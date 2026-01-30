# Feature Implementation Prompts

Detailed, actionable prompts for implementing TradeFolio features. Each section follows the PCTF (Persona, Context, Task, Format) framework with implementation steps and acceptance criteria.

## Table of Contents

1. [User Authentication & Identity Verification](#1-user-authentication--identity-verification)
2. [Profile Setup & Management](#2-profile-setup--management)
3. [Portfolio & Project Management](#3-portfolio--project-management)
4. [Verification & Trust Engine](#4-verification--trust-engine)
5. [Networking & Discovery Features](#5-networking--discovery-features)
6. [Payment & Invoicing System](#6-payment--invoicing-system)
7. [Media Pipeline & Storage](#7-media-pipeline--storage)
8. [Offline Functionality](#8-offline-functionality)
9. [Security & Compliance](#9-security--compliance)
10. [UI/UX & Mobile Experience](#10-uiux--mobile-experience)

---

## 1. User Authentication & Identity Verification

**Persona:** All users (tradespeople, recruiters, clients)  
**Context:** Secure onboarding, KYC/AML compliance, and access control  
**Task:** Implement robust authentication and identity verification  
**Format:** API endpoints, UI flows, integration with Stripe Identity

### Requirements

- JWT-based authentication with refresh tokens
- Integrate Stripe Identity for KYC
- Store only verification status, not raw PII
- Support social login (Google, Apple)

### Implementation Steps

1. **Build Auth Endpoints**
   ```
   POST /auth/register
   POST /auth/login
   POST /auth/refresh
   POST /auth/logout
   POST /auth/verify-identity
   ```

2. **Integrate Stripe Identity SDK**
   - Create verification session on backend
   - Handle webhook events for verification completion
   - Map verification status to user profile

3. **Secure Storage**
   - Store verification status in PostgreSQL
   - Never store raw ID images or PII
   - Use Stripe's reference ID only

4. **API Security**
   - Enforce TLS 1.2+
   - Implement rate limiting
   - Add certificate transparency monitoring

### Acceptance Criteria

- [ ] Users can securely register and login
- [ ] JWT tokens expire appropriately (15min access, 7day refresh)
- [ ] "Verified Pro" badge appears only after KYC completion
- [ ] Failed KYC blocks payouts
- [ ] Rate limiting prevents brute force attacks

### Success Metrics

- <1% failed login attempts due to system issues
- 100% KYC compliance before payouts
- <3 second auth flow completion

---

## 2. Profile Setup & Management

**Persona:** Tradespeople, recruiters  
**Context:** Creating and editing professional profiles  
**Task:** Enable users to set up and manage detailed profiles  
**Format:** Mobile-first forms, profile API, validation logic

### Requirements

- Profile fields: Name, trade, skills, certifications, work history, location
- Editable multi-step wizard
- Local and backend storage with sync
- Profile completion gamification

### Implementation Steps

1. **Define Profile Schema**
   ```sql
   CREATE TABLE profiles (
     profile_id UUID PRIMARY KEY,
     full_name VARCHAR(100),
     trade_category VARCHAR(50),
     specialty VARCHAR(100),
     years_experience INTEGER,
     -- ... see database-schema.md
   );
   ```

2. **Build Profile Endpoints**
   ```
   GET /profile/me
   POST /profile/create
   PATCH /profile/update
   GET /profile/:userId
   ```

3. **Create React Native UI Wizard**
   - Step 1: Basic info (name, email, avatar)
   - Step 2: Trade selection and specialty
   - Step 3: Skills and experience
   - Step 4: Location and privacy settings
   - Step 5: Credential uploads

4. **Add Gamification**
   - Calculate completion percentage
   - Show progress bar
   - Badge rewards for milestones

### Acceptance Criteria

- [ ] 90%+ users complete profile setup
- [ ] Profiles sync seamlessly between local and cloud
- [ ] Profile changes reflect within 2 seconds
- [ ] Avatar upload works offline (queued)

---

## 3. Portfolio & Project Management

**Persona:** Tradespeople  
**Context:** Showcasing work, building a digital portfolio  
**Task:** Allow users to create, tag, and manage project portfolios  
**Format:** Project entities, media upload, tagging system

### Requirements

- Users can create projects with multiple media items
- Tagging system using standardized skill taxonomy
- Before/After slider component
- Offline-first creation with auto-sync

### Implementation Steps

1. **Build Portfolio Endpoints**
   ```
   POST /portfolio/create
   PATCH /portfolio/:projectId
   DELETE /portfolio/:projectId
   POST /portfolio/:projectId/media
   DELETE /portfolio/:projectId/media/:mediaId
   POST /portfolio/:projectId/publish
   ```

2. **Implement Media Upload**
   - Request pre-signed S3 URL
   - Client-side compression before upload
   - Track upload progress
   - Generate blur hash for placeholders

3. **Design Gallery UI**
   - Grid view for project list
   - Drag-and-drop media ordering
   - Before/After slider component
   - Full-screen media viewer

4. **Add Tagging System**
   - Autocomplete skill search
   - Multi-select tags
   - Suggested tags based on trade category

### Acceptance Criteria

- [ ] 95%+ successful media uploads
- [ ] Projects display correctly with tags and media
- [ ] Before/After slider works smoothly
- [ ] Offline project creation syncs when online

---

## 4. Verification & Trust Engine

**Persona:** Tradespeople, recruiters, clients  
**Context:** Building trust through verified credentials and endorsements  
**Task:** Implement multi-layered verification (identity, credentials, peer vouching)  
**Format:** Admin/AI validation, endorsement logic

### Requirements

- Stripe Identity for personal verification
- OCR/AI validation for uploaded credentials
- Peer endorsements only for co-worked projects
- Verification badges and trust scores

### Implementation Steps

1. **Integrate Stripe Identity**
   - Create verification session
   - Handle webhook callbacks
   - Update profile verification status

2. **Build Credential System**
   ```
   POST /credentials/upload
   GET /credentials/mine
   POST /credentials/:id/verify (admin)
   ```

3. **Implement Peer Vouching**
   ```
   POST /vouch/create
   GET /vouch/received
   GET /vouch/given
   DELETE /vouch/:id
   ```

4. **Create Admin Panel**
   - Queue of pending credential verifications
   - OCR preview with extracted data
   - Approve/Reject workflow
   - Audit logging

### Acceptance Criteria

- [ ] 100% verified users receive badges
- [ ] Peer endorsements require project collaboration records
- [ ] Admin can verify credentials within 48 hours
- [ ] OCR correctly extracts data 80%+ of the time

---

## 5. Networking & Discovery Features

**Persona:** Tradespeople, recruiters  
**Context:** Connecting, collaborating, and searching for talent  
**Task:** Enable user tagging, geospatial search, and privacy controls  
**Format:** Crew tagging, search filters, location fuzzing

### Requirements

- Geospatial search with user/project filters
- Privacy controls for location fuzzing
- Crew tagging for project collaborations
- Search by skills, location, experience

### Implementation Steps

1. **Build Search Endpoints**
   ```
   GET /search/profiles
   GET /search/projects
   GET /search/nearby
   ```

2. **Integrate PostGIS**
   - Enable PostGIS extension
   - Create spatial indexes
   - Implement radius queries

3. **Implement Privacy Controls**
   ```
   PATCH /privacy/settings
   - locationPrivacy: 'exact' | 'city' | 'state'
   - profileVisibility: 'public' | 'verified_only' | 'private'
   ```

4. **Build Crew Tagging**
   - Invite collaborators to projects
   - Confirmation workflow
   - Tagged users appear on project

### Acceptance Criteria

- [ ] 90%+ search accuracy for skill queries
- [ ] Location privacy respected for all users
- [ ] Search results return within 500ms
- [ ] Collaborator invites work via email/in-app

---

## 6. Payment & Invoicing System

**Persona:** Tradespeople, clients  
**Context:** Handling payments, escrow, and invoicing  
**Task:** Implement Stripe Connect Express, milestone payments, and estimate builder  
**Format:** Payment APIs, PDF generation, escrow logic

### Requirements

- Stripe Connect for split payments
- Milestone-based payment system
- PDF estimate and invoice generator
- Transaction history and reporting

### Implementation Steps

1. **Integrate Stripe Connect**
   - Onboard contractors as Express accounts
   - Handle OAuth flow
   - Configure payout schedule

2. **Build Payment Flow**
   ```
   POST /payments/create-intent
   POST /payments/capture
   POST /payments/release-milestone
   POST /payments/refund
   ```

3. **Implement Invoice System**
   ```
   POST /invoices/create
   GET /invoices/mine
   POST /invoices/:id/send
   GET /invoices/:id/pdf
   ```

4. **Add PDF Generation**
   - Professional invoice template
   - Line items, totals, taxes
   - Company branding
   - QR code for payment

### Acceptance Criteria

- [ ] 99%+ successful payment transactions
- [ ] Escrow system ensures verified job completion
- [ ] Invoices generate as PDF within 2 seconds
- [ ] Contractors receive payouts on schedule

---

## 7. Media Pipeline & Storage

**Persona:** Tradespeople  
**Context:** Uploading, processing, and serving high-fidelity media  
**Task:** Build scalable, cost-efficient media pipeline  
**Format:** AWS S3, MediaConvert, CloudFront

### Requirements

- Direct upload to S3 with pre-signed URLs
- MediaConvert for adaptive streaming
- CloudFront CDN for delivery
- Cost monitoring and alerts

### Implementation Steps

1. **Configure S3 Bucket**
   - Create ingest and output buckets
   - Enable encryption at rest
   - Set lifecycle policies

2. **Build Upload Flow**
   ```
   POST /media/request-upload-url
   POST /media/confirm-upload
   GET /media/:id/status
   ```

3. **Set Up MediaConvert**
   - Create job template for HLS
   - Configure adaptive bitrates (360p, 720p, 1080p)
   - Generate thumbnails and blur hashes

4. **Configure CloudFront**
   - Create distribution
   - Set up signed URLs for private content
   - Configure caching policies

### Acceptance Criteria

- [ ] <2s average media load time
- [ ] 100% secure media storage
- [ ] Video playback adapts to network conditions
- [ ] Cost alerts trigger at $500/month threshold

---

## 8. Offline Functionality

**Persona:** Tradespeople on job sites  
**Context:** Poor/no connectivity environments  
**Task:** Enable offline project creation and media queuing  
**Format:** Local storage, sync logic

### Requirements

- WatermelonDB for local data storage
- Sync queue for offline changes
- Conflict resolution (server-wins metadata, merge arrays)
- Upload queue with retry logic

### Implementation Steps

1. **Configure WatermelonDB**
   - Define schemas matching backend
   - Set up migrations
   - Configure sync adapter

2. **Build Sync Engine**
   - Pull changes from server
   - Detect and resolve conflicts
   - Push local changes
   - Handle errors gracefully

3. **Implement Upload Queue**
   - Queue uploads when offline
   - Retry with exponential backoff
   - Resume after app restart

4. **Create Offline UI**
   - Sync status indicator
   - Pending changes count
   - Manual sync trigger

### Acceptance Criteria

- [ ] 100% data integrity after sync
- [ ] <1% sync conflicts
- [ ] Offline projects sync within 30s of connectivity
- [ ] Users see clear offline status indicator

---

## 9. Security & Compliance

**Persona:** All users  
**Context:** Protecting user data, financial transactions, and platform integrity  
**Task:** Enforce encryption, privacy, and regulatory compliance  
**Format:** Encryption, GDPR/CCPA features, review integrity

### Requirements

- AES-256 encryption for data at rest
- TLS 1.2+ for data in transit
- GDPR-compliant "Download/Delete My Data" features
- Automated content moderation

### Implementation Steps

1. **Enable Encryption**
   - Configure AWS KMS keys
   - Enable RDS encryption
   - Enable S3 bucket encryption

2. **Build Compliance Endpoints**
   ```
   POST /compliance/request-data-export
   GET /compliance/download-data/:requestId
   POST /compliance/delete-account
   ```

3. **Integrate Content Moderation**
   - Configure AWS Rekognition
   - Set moderation thresholds
   - Queue flagged content for review

4. **Implement Audit Logging**
   - Log all sensitive operations
   - Store logs securely
   - Set retention policies

### Acceptance Criteria

- [ ] 0 data breaches
- [ ] 100% compliance with GDPR/CCPA
- [ ] Data export delivered within 24 hours
- [ ] Account deletion complete within 30 days

---

## 10. UI/UX & Mobile Experience

**Persona:** All users  
**Context:** Ensuring accessibility, engagement, and usability  
**Task:** Design intuitive, visually appealing, and accessible interfaces  
**Format:** React Native components, accessibility standards

### Requirements

- React Native with TypeScript
- Accessible components (48x48pt touch targets)
- Dark mode by default
- Gamification features

### Implementation Steps

1. **Create Design System**
   - Define color palette (dark mode first)
   - Typography scale
   - Spacing system
   - Component library

2. **Build Core Components**
   - Buttons (primary, secondary, ghost)
   - Input fields (text, select, date)
   - Cards (project, profile, credential)
   - Modals and sheets

3. **Implement Accessibility**
   - Minimum touch targets (48x48)
   - Screen reader labels
   - High contrast ratios
   - Keyboard navigation

4. **Add Gamification**
   - Profile completion progress bar
   - Achievement badges
   - Streak counters
   - Level indicators

### Acceptance Criteria

- [ ] 95%+ user satisfaction score
- [ ] 100% accessibility compliance (WCAG 2.1 AA)
- [ ] App loads in <3 seconds
- [ ] Smooth 60fps scrolling

---

## Using These Prompts

1. **Copy the relevant section** into Cursor or Claude
2. **Provide context** about your current codebase state
3. **Request specific code** for implementation steps
4. **Iterate** based on your specific requirements

### Example Prompt Usage

```
I'm implementing the Profile Setup feature for TradeFolio.

Current state:
- Backend is NestJS with PostgreSQL
- Frontend is React Native with Expo
- Auth is already working

Please implement:
1. The profile schema migration
2. The /profile/update endpoint
3. The React Native multi-step wizard component

Follow the requirements and acceptance criteria from the Feature Prompts document.
```

---

*See [Code Prompts](./code-prompts.md) for specific code generation prompts.*
