# TradeFolio Development Remediation Guide

Comprehensive technical issues, solutions, and step-by-step implementation for critical architecture decisions.

## Table of Contents

1. [Mobile Offline-First Architecture & Data Synchronization](#1-mobile-offline-first-architecture--data-synchronization)
2. [Financial Infrastructure & Marketplace Liquidity](#2-financial-infrastructure--marketplace-liquidity)
3. [Identity Verification & Trust Frameworks](#3-identity-verification--trust-frameworks)
4. [Backend Engineering & Performance Scaling](#4-backend-engineering--performance-scaling)
5. [Media Pipeline Architecture](#5-media-pipeline-architecture)
6. [Security Posture & Cryptographic Controls](#6-security-posture--cryptographic-controls)
7. [Regulatory Compliance & Data Governance](#7-regulatory-compliance--data-governance)
8. [User Engagement & Notification Architecture](#8-user-engagement--notification-architecture)

---

## 1. Mobile Offline-First Architecture & Data Synchronization

### 1.1 Binary Asset Storage in Relational Databases

**Problem:**  
Storing binary assets (e.g., images) directly in WatermelonDB leads to severe performance degradation, sync instability, and increased risk of data corruption. WatermelonDB is optimized for structured data, not large binary blobs.

**Solution & Rationale:**  
Adopt a reference-pointer architecture: store only references (URLs, file paths) in the database, and keep actual binary assets in the device filesystem or cloud storage.

**Step-by-Step Implementation:**

1. Refactor WatermelonDB schema to include:
   ```typescript
   const mediaSchema = tableSchema({
     name: 'project_media',
     columns: [
       { name: 'remote_url', type: 'string' },
       { name: 'local_path', type: 'string', isOptional: true },
       { name: 'blur_hash', type: 'string' },
       { name: 'sync_status', type: 'string' },
     ],
   });
   ```

2. Use a background worker to download assets:
   ```typescript
   import * as FileSystem from 'expo-file-system';
   
   async function downloadAsset(remoteUrl: string): Promise<string> {
     const filename = remoteUrl.split('/').pop();
     const localPath = `${FileSystem.documentDirectory}media/${filename}`;
     await FileSystem.downloadAsync(remoteUrl, localPath);
     return localPath;
   }
   ```

3. Update UI logic to load from `local_path` if available, else fallback to `remote_url` or `blur_hash`.

4. Ensure sync engine only handles JSON/text data, not binary payloads.

**Recommended Tools/Libraries:**  
- WatermelonDB
- expo-file-system
- react-native-blob-util
- blurhash

**Impact Assessment:**  
- Major improvement in sync speed and reliability
- Reduced risk of data corruption and app crashes

**Risk Mitigation:**  
- Implement migration scripts to move existing binary data out of database
- Test sync and media loading under poor network conditions

---

### 1.2 Data Synchronization and Conflict Resolution

**Problem:**  
Lack of deterministic conflict resolution strategies for offline data sync can result in data loss or inconsistent state across devices.

**Solution & Rationale:**  
Implement a last-write-wins (LWW) or operational transformation (OT) strategy for conflict resolution. Deterministic merging ensures predictable outcomes.

**Step-by-Step Implementation:**

1. Define versioning scheme:
   ```typescript
   interface SyncableRecord {
     id: string;
     _version: number;
     _updatedAt: number;
     _syncStatus: 'synced' | 'pending' | 'conflict';
   }
   ```

2. On sync, compare versions and apply resolution:
   ```typescript
   function resolveConflict(local: SyncableRecord, remote: SyncableRecord) {
     // Last-write-wins based on timestamp
     if (remote._updatedAt > local._updatedAt) {
       return { ...remote, _syncStatus: 'synced' };
     }
     return { ...local, _syncStatus: 'pending' };
   }
   ```

3. Log all conflicts and provide user-facing resolution options for critical data.

**Recommended Tools/Libraries:**  
- Automerge (for CRDT-based merging)
- Yjs (for collaborative editing)
- Custom LWW logic

**Risk Mitigation:**  
- Extensively test conflict scenarios
- Provide user notifications for unresolved conflicts

---

### 1.3 Background Operations and Resilience

**Problem:**  
Insufficient handling of background operations can lead to failed transfers, partial data, and poor reliability.

**Solution & Rationale:**  
Implement a resilient job queue with retry logic for all background tasks.

**Step-by-Step Implementation:**

1. Create job queue:
   ```typescript
   interface BackgroundJob {
     id: string;
     type: 'upload' | 'download' | 'sync';
     payload: any;
     retryCount: number;
     maxRetries: number;
     status: 'pending' | 'processing' | 'failed' | 'complete';
   }
   ```

2. Implement retry with exponential backoff:
   ```typescript
   async function processJob(job: BackgroundJob) {
     try {
       await executeJob(job);
       job.status = 'complete';
     } catch (error) {
       job.retryCount++;
       if (job.retryCount >= job.maxRetries) {
         job.status = 'failed';
         notifyUser(job, error);
       } else {
         const delay = Math.pow(2, job.retryCount) * 1000;
         await sleep(delay);
         await processJob(job);
       }
     }
   }
   ```

3. Persist job state to survive app restarts.

**Recommended Tools/Libraries:**  
- react-native-background-fetch
- react-native-background-task

---

## 2. Financial Infrastructure & Marketplace Liquidity

### 2.1 Deprecated Escrow Model

**Problem:**  
Use of traditional "escrow" is incompatible with modern payment processors like Stripe Connect, which don't support true escrow. This leads to regulatory and operational issues.

**Solution & Rationale:**  
Adopt Stripe Connect's "separate charges and transfers" model. The platform acts as merchant of record and manages payouts.

**Step-by-Step Implementation:**

1. Set up Stripe Connect with Express accounts:
   ```typescript
   const account = await stripe.accounts.create({
     type: 'express',
     country: 'US',
     capabilities: {
       card_payments: { requested: true },
       transfers: { requested: true },
     },
   });
   ```

2. On payment, create PaymentIntent on platform account:
   ```typescript
   const paymentIntent = await stripe.paymentIntents.create({
     amount: 100000, // $1,000
     currency: 'usd',
     payment_method_types: ['card'],
     metadata: {
       projectId,
       contractorId,
     },
   });
   ```

3. Record liability in internal ledger.

4. On milestone completion, trigger transfer:
   ```typescript
   const transfer = await stripe.transfers.create({
     amount: 92070, // $920.70 after fees
     currency: 'usd',
     destination: contractorStripeAccountId,
     transfer_group: projectId,
   });
   ```

5. Configure payout schedule to manual with delay (T+7 days).

6. Handle dispute webhooks:
   ```typescript
   app.post('/webhooks/stripe', async (req, res) => {
     const event = req.body;
     if (event.type === 'charge.dispute.created') {
       await freezeFundsInLedger(event.data.object);
       await notifySupport(event.data.object);
     }
   });
   ```

**Risk Mitigation:**  
- Regularly review Stripe documentation for compliance updates
- Implement automated reconciliation between ledger and Stripe

---

### 2.2 Account Types and Liability Matrix

**Problem:**  
Ambiguity in account types and unclear liability mapping for funds flow and dispute resolution.

**Solution:**  
Define explicit account roles and document all fund flow scenarios.

| Account Type | Funds Held | Funds Released | Dispute Liability |
|--------------|------------|----------------|-------------------|
| Platform | Yes (as MoR) | On approval | Platform |
| Contractor | No | After transfer | Contractor |
| Client | No | N/A | Client |

---

## 3. Identity Verification & Trust Frameworks

### 3.1 Granular Failure Handling

**Problem:**  
Insufficient granularity in KYC error codes leads to poor user feedback.

**Solution:**  
Map provider error codes to actionable user messages.

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

### 3.2 GDPR and Right to Erasure

**Problem:**  
Incomplete support for GDPR right to erasure ("right to be forgotten").

**Solution:**  
Implement suppression lists and ensure data is deleted from all systems.

```typescript
async function deleteUserData(userId: string) {
  // 1. Add to suppression list
  await db.suppressionList.insert({
    email: user.email,
    deletedAt: new Date(),
  });
  
  // 2. Delete from primary database
  await db.transaction(async (trx) => {
    await trx('vouches').where('from_user_id', userId).delete();
    await trx('projects').where('user_id', userId).delete();
    await trx('profiles').where('user_id', userId).delete();
  });
  
  // 3. Delete from S3
  await deleteUserMediaFromS3(userId);
  
  // 4. Delete from search index
  await searchIndex.deleteUser(userId);
  
  // 5. Request deletion from Stripe
  await stripe.customers.del(user.stripeCustomerId);
  
  // 6. Log for compliance
  await auditLog.record('user_deleted', { userId });
}
```

---

## 4. Backend Engineering & Performance Scaling

### 4.1 Technology Selection

**Problem:**  
Unclear rationale for backend technology choices.

**Solution:**  
Adopt a polyglot microservices approach:

| Service Type | Technology | Rationale |
|--------------|------------|-----------|
| API Gateway | Node.js (NestJS) | I/O-bound, excellent ecosystem |
| Media Processing | Python (FastAPI) | CPU-bound, ML libraries |
| Real-time | Node.js (Socket.io) | Event-driven, low latency |
| Analytics | Python | Data science libraries |

---

### 4.2 REST API Design Best Practices

**Problem:**  
Inconsistent API design leads to maintenance issues.

**Solution:**  
Adopt RESTful conventions:

1. **Resource Naming**: Use plural nouns
   - `/users`, `/projects`, `/invoices`

2. **Versioning**: Use URL prefix
   - `/v1/users`, `/v2/users`

3. **Status Codes**: Use standard HTTP codes
   - 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found

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

## 5. Media Pipeline Architecture

### 5.1 Managed Transcoding Cost Trap

**Problem:**  
Managed services like AWS MediaConvert can cause cost overruns at scale.

**Solution:**  
Monitor costs and plan migration path.

**Implementation:**

1. Set up AWS Budgets:
   ```bash
   aws budgets create-budget \
     --account-id $ACCOUNT_ID \
     --budget file://media-budget.json
   ```

2. Create CloudWatch alarms:
   ```typescript
   new cloudwatch.Alarm(this, 'MediaConvertCostAlarm', {
     metric: mediaConvertCostMetric,
     threshold: 500,
     evaluationPeriods: 1,
     comparisonOperator: 'GreaterThanThreshold',
   });
   ```

3. Migration trigger: When monthly costs exceed $1,000, evaluate self-hosted FFmpeg.

---

## 6. Security Posture & Cryptographic Controls

### 6.1 Certificate Pinning (Deprecated)

**Problem:**  
Certificate pinning causes app breakage during rotation and is now discouraged.

**Solution:**  
Remove pinning, monitor Certificate Transparency logs instead.

```typescript
// Remove pinning from mobile app
// Instead, set up CT monitoring
const ctConfig = {
  domains: ['api.tradefolio.com'],
  alertWebhook: 'https://alerts.tradefolio.com/ct',
};
```

---

### 6.2 S3 Upload Security

**Problem:**  
Insecure direct uploads without proper access controls.

**Solution:**  
Use time-limited, permission-scoped presigned URLs.

```typescript
async function getSecureUploadUrl(userId: string, contentType: string) {
  const key = `uploads/${userId}/${crypto.randomUUID()}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: 'private',
  });
  
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 300, // 5 minutes
  });
  
  return { url, key };
}
```

---

## 7. Regulatory Compliance & Data Governance

### 7.1 Geospatial Privacy and Location Fuzzing

**Problem:**  
Storing exact GPS coordinates exposes users to privacy risks.

**Solution:**  
Implement location fuzzing with dual storage.

```typescript
function fuzzLocation(exact: { lat: number; lng: number }, level: 'city' | 'state') {
  if (level === 'state') {
    return getStateCentroid(exact);
  }
  
  // Add random offset (~1 mile)
  const offset = {
    lat: (Math.random() - 0.5) * 0.03,
    lng: (Math.random() - 0.5) * 0.03,
  };
  
  return {
    lat: exact.lat + offset.lat,
    lng: exact.lng + offset.lng,
  };
}
```

---

## 8. User Engagement & Notification Architecture

### 8.1 Single-Channel Notification Limitation

**Problem:**  
Single-channel notifications (push only) reduce engagement and reliability.

**Solution:**  
Build omni-channel notification router.

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

## Summary Checklist

### Critical (Address Immediately)
- [ ] Implement binary asset reference architecture
- [ ] Set up Stripe Connect separate charges/transfers
- [ ] Add granular KYC error handling
- [ ] Remove certificate pinning

### High Priority
- [ ] Build conflict resolution for offline sync
- [ ] Configure cost monitoring for MediaConvert
- [ ] Implement location fuzzing
- [ ] Add GDPR data export/deletion

### Medium Priority
- [ ] Adopt polyglot microservices where appropriate
- [ ] Standardize REST API design
- [ ] Build omni-channel notifications
- [ ] Set up S3 presigned URL security

---

*This guide should be reviewed quarterly and updated as the platform evolves.*
