# TradeFolio Development Remediation Guide

Prioritized technical issues and remediation steps for critical architecture decisions. Each item links to the detailed implementation in the relevant technical document.

## Table of Contents

1. [Critical Priority](#critical-priority)
2. [High Priority](#high-priority)
3. [Medium Priority](#medium-priority)
4. [Summary Checklist](#summary-checklist)

---

## Critical Priority

### 1. Binary Asset Storage in WatermelonDB

**Problem:** Storing binary assets (images) directly in WatermelonDB leads to performance degradation, sync instability, and data corruption risk.

**Solution:** Adopt a reference-pointer architecture: store only references (URLs, file paths) in the database, keep binary assets in the device filesystem or cloud storage.

**Detailed Implementation:** See [Offline Sync - Binary Asset Handling](../technical/offline-sync.md#binary-asset-handling)

**Impact:** Major improvement in sync speed and reliability; reduced risk of crashes.

**Risk Mitigation:**
- Implement migration scripts to move existing binary data out of the database
- Test sync and media loading under poor network conditions

---

### 2. Stripe Connect: Separate Charges and Transfers (Not Escrow)

**Problem:** Traditional "escrow" is incompatible with Stripe Connect. Stripe does not support true escrow, leading to regulatory and operational issues.

**Solution:** Adopt Stripe Connect's "separate charges and transfers" model. The platform acts as merchant of record and manages payouts.

**Detailed Implementation:** See [Architecture Overview - Payment Infrastructure](../technical/architecture-overview.md#5-payment-infrastructure)

**Account Liability Matrix:**

| Account Type | Funds Held | Funds Released | Dispute Liability |
|--------------|------------|----------------|-------------------|
| Platform | Yes (as MoR) | On approval | Platform |
| Contractor | No | After transfer | Contractor |
| Client | No | N/A | Client |

**Risk Mitigation:**
- Regularly review Stripe documentation for compliance updates
- Implement automated reconciliation between internal ledger and Stripe

---

### 3. Granular KYC Failure Handling

**Problem:** Insufficient granularity in KYC error codes leads to poor user feedback and failed verification loops.

**Solution:** Map Stripe Identity error codes to actionable user messages.

**Detailed Implementation:** See [Security & Compliance - Identity Verification](../technical/security-compliance.md#1-identity-verification-kycaml)

```typescript
const errorMessages: Record<string, string> = {
  'document_expired': 'Your ID has expired. Please use a valid, non-expired ID.',
  'document_type_not_supported': 'This type of ID is not accepted. Please use a passport or driver\'s license.',
  'selfie_mismatch': 'The photo doesn\'t match your ID. Please try again with better lighting.',
  'document_country_not_supported': 'IDs from this country are not yet supported.',
};

function getUserMessage(stripeErrorCode: string): string {
  return errorMessages[stripeErrorCode] || 'Verification failed. Please try again.';
}
```

---

### 4. Certificate Pinning Removal

**Problem:** Certificate pinning causes app breakage during rotation and is now discouraged by the security community.

**Solution:** Remove pinning from mobile apps, monitor Certificate Transparency logs instead.

**Detailed Implementation:** See [Security & Compliance - Certificate Transparency](../technical/security-compliance.md#certificate-transparency-modern-approach)

---

## High Priority

### 5. Data Synchronization and Conflict Resolution

**Problem:** Lack of deterministic conflict resolution for offline data sync can result in data loss or inconsistent state across devices.

**Solution:** Implement "Server Wins" for metadata and "Merge" for arrays, with timestamp-based delta syncing.

**Detailed Implementation:** See [Offline Sync - Conflict Resolution Policies](../technical/offline-sync.md#conflict-resolution-policies)

**Risk Mitigation:**
- Extensively test conflict scenarios (two devices editing the same project)
- Provide user notifications for unresolved conflicts

---

### 6. Media Pipeline Cost Monitoring

**Problem:** Managed transcoding services (Mux, AWS MediaConvert) can cause cost overruns at scale.

**Solution:** Start with Mux for MVP speed, monitor costs, and migrate to self-hosted MediaConvert at 10,000 users.

**Detailed Implementation:** See [Architecture Overview - Media Pipeline](../technical/architecture-overview.md#4-media-pipeline)

**Migration Trigger:** When monthly video processing costs exceed $1,000, evaluate self-hosted FFmpeg or direct MediaConvert pipeline.

---

### 7. GDPR Right to Erasure

**Problem:** Incomplete support for GDPR right to erasure ("right to be forgotten") across all data stores.

**Solution:** Implement suppression lists and ensure data is deleted from all systems (database, S3, search index, Stripe).

**Detailed Implementation:** See [Security & Compliance - GDPR/CCPA Compliance](../technical/security-compliance.md#5-gdprccpa-compliance)

---

### 8. Location Privacy (Fuzzing)

**Problem:** Storing exact GPS coordinates without privacy protection exposes users to risk.

**Solution:** Implement dual storage with fuzzed coordinates for public queries and exact coordinates restricted to admin access only.

**Detailed Implementation:** See [Security & Compliance - Geospatial Privacy](../technical/security-compliance.md#6-geospatial-privacy)

---

## Medium Priority

### 9. Backend Technology Selection

**Problem:** A monolithic backend may not serve all workload types efficiently as the platform scales.

**Recommended Approach:** Adopt a polyglot microservices model where it makes sense:

| Service Type | Technology | Rationale |
|--------------|------------|-----------|
| API Gateway | Node.js (NestJS) | I/O-bound, excellent ecosystem |
| Media Processing | Python (FastAPI) | CPU-bound, ML libraries for OCR/moderation |
| Real-time | Node.js (Socket.io) | Event-driven, low latency |
| Analytics | Python | Data science libraries |

Start monolithic with NestJS, extract services as scaling demands.

---

### 10. REST API Design Standards

**Problem:** Inconsistent API design leads to maintenance issues and confusion.

**Solution:** Adopt RESTful conventions:

1. **Resource Naming**: Use plural nouns (`/users`, `/projects`, `/invoices`)
2. **Versioning**: Use URL prefix (`/v1/users`)
3. **Status Codes**: Standard HTTP codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found)
4. **Error Format**:
   ```json
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Invalid email format",
       "field": "email"
     }
   }
   ```

---

### 11. Omni-Channel Notification Architecture

**Problem:** Single-channel notifications (push only) reduce engagement and reliability.

**Solution:** Build a notification router supporting push, email, and SMS with user preference controls.

```typescript
class NotificationRouter {
  async send(userId: string, notification: Notification) {
    const prefs = await this.getUserPreferences(userId);
    const channels: Promise<void>[] = [];

    if (prefs.push) {
      channels.push(this.sendPush(userId, notification));
    }
    if (prefs.email) {
      channels.push(this.sendEmail(userId, notification));
    }
    if (prefs.sms && notification.priority === 'urgent') {
      channels.push(this.sendSms(userId, notification));
    }

    await Promise.allSettled(channels);
  }
}
```

**Recommended Tools:**
- Firebase Cloud Messaging (push)
- SendGrid (email)
- Twilio (SMS)

---

### 12. S3 Upload Security

**Problem:** Direct uploads without proper access controls create security vulnerabilities.

**Solution:** Use time-limited, permission-scoped presigned URLs for all client uploads.

**Detailed Implementation:** See [Security & Compliance - S3 Upload Security](../technical/security-compliance.md#3-s3-upload-security)

---

## Summary Checklist

### Critical (Address Immediately)
- [ ] Implement binary asset reference architecture ([Offline Sync](../technical/offline-sync.md))
- [ ] Set up Stripe Connect separate charges/transfers ([Architecture](../technical/architecture-overview.md))
- [ ] Add granular KYC error handling ([Security](../technical/security-compliance.md))
- [ ] Remove certificate pinning ([Security](../technical/security-compliance.md))

### High Priority
- [ ] Build conflict resolution for offline sync ([Offline Sync](../technical/offline-sync.md))
- [ ] Configure cost monitoring for MediaConvert ([Architecture](../technical/architecture-overview.md))
- [ ] Implement GDPR data export/deletion ([Security](../technical/security-compliance.md))
- [ ] Add location fuzzing ([Security](../technical/security-compliance.md))

### Medium Priority
- [ ] Plan polyglot microservices migration path
- [ ] Standardize REST API design conventions
- [ ] Build omni-channel notification router
- [ ] Enforce S3 presigned URL security ([Security](../technical/security-compliance.md))

---

*This guide should be reviewed quarterly and updated as the platform evolves.*
