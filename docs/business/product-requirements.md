# Product Requirements Document (PRD)

## 1. Product Vision

Build the definitive digital ledger of the skilled trades, enabling every worker to turn their labor into a verified, portable asset.

## 2. Scope

**MVP (Phase 1)**: Mobile-first iOS and Android application focusing on:
- Portfolio Creation
- Identity Verification
- Basic Networking

**Phase 2**: Adds Payments and Job Search functionality.

## 3. User Personas

### 3.1 The Apprentice ("The Learner")

| Attribute | Details |
|-----------|---------|
| **Goals** | Document hours for licensure; prove competence to advance from "helper" to "mechanic" |
| **Pain Points** | No resume; skills questioned; low bargaining power |
| **App Use** | Uploads daily photos of work to log progress |
| **Tech Comfort** | Digital native, comfortable with mobile apps |

### 3.2 The Journeyman ("The Earner")

| Attribute | Details |
|-----------|---------|
| **Goals** | Find side work (gigs); get headhunted for higher-paying full-time roles |
| **Pain Points** | Relying on word-of-mouth; dealing with non-paying clients |
| **App Use** | Uses "Verified Pro" status to bid on side jobs; sends invoices via app |
| **Tech Comfort** | Moderate; needs intuitive, fast interface |

### 3.3 The Craftsman ("The Master")

| Attribute | Details |
|-----------|---------|
| **Goals** | Build personal brand; attract premium clients |
| **Pain Points** | High skill, low patience for technology; needs "one-tap" recording |
| **App Use** | Showcases complex projects; receives endorsements from peers |
| **Tech Comfort** | Low; UI must be extremely simple |

### 3.4 The Recruiter ("The Hunter")

| Attribute | Details |
|-----------|---------|
| **Goals** | Filter candidates by actual skill, not claimed skill |
| **Pain Points** | Text resumes don't show competency; high cost of bad hires |
| **App Use** | Searches database for "HVAC Tech + EPA 608 + 5 Years Exp" |
| **Tech Comfort** | High; expects enterprise-grade search and filtering |

## 4. Core Features

### 4.1 The "Smart" Portfolio

The portfolio is the heart of the application—supporting high-fidelity media and structured data tagging.

#### Project Entities
Unlike social media "posts," users create **Projects**. A Project aggregates multiple photos/videos under a single header (e.g., "Whole House Rewire - Oak Street").

#### Project "Stories" Structure
A structured 3-part upload flow:
1. **Materials** - What's being used
2. **Process** - The work being done
3. **Final Product** - The completed result

#### Before/After Slider
A dedicated UI component for uploading "Before" and "After" states of a job. High-engagement feature for trades (e.g., messy wiring vs. clean cable management).

#### Skill Taxonomy Integration
When uploading photos, users tag with specific skills from a standardized library:

| Trade | Example Skills |
|-------|---------------|
| **Electrical** | Rough-in, Conduit Bending, Panel Termination, Low Voltage |
| **HVAC** | Brazing, Refrigerant Recovery, Duct Fabrication, Load Calculation |
| **Welding** | MIG, TIG, Stick, Flux Core, Pipefitting |
| **Plumbing** | Rough-in, Drain Line, Water Heater, Gas Line |
| **Carpentry** | Framing, Finish, Cabinet, Restoration |

### 4.2 Dual-Source Video Feed

- **Native Uploads**: 4K video via S3/Mux with client-side compression
- **YouTube Integration**: One-click OAuth sync of existing YouTube content

### 4.3 Offline Mode

Construction sites often lack cell service. The app must:
- Allow project creation while completely offline
- Draft descriptions without connectivity
- Queue photo/video uploads
- Auto-sync when connectivity is restored

### 4.4 Trade-Specific Filtering

Advanced search for niche skills:
- TIG Welding on Aluminum
- Restoration Carpentry
- Commercial HVAC
- High-Voltage Electrical

## 5. Verification & Trust Engine

Trust is the currency of this platform. Three layers of verification:

### 5.1 Identity Verification (KYC)
- Integration with Stripe Identity
- Scans government ID
- Prevents bot accounts
- Ensures safety for homeowners

### 5.2 Credential Verification
- Users upload certification photos (OSHA 10/30, EPA 608, State Licenses)
- AI OCR validates expiration dates and license numbers
- Admin panel for manual review when needed

### 5.3 Peer Vouching ("Endorsement 2.0")
- Users can only endorse skills if they've co-worked on a verified project
- Creates a "Web of Trust" distinct from LinkedIn's open endorsement model
- Requires overlap in employment history or project co-location

## 6. Networking & Discovery

### 6.1 The "Crew" Feature
Project owners can tag collaborators (e.g., "Worked with @JohnDoe on this install"). Helps apprentices build profiles through association with established mentors.

### 6.2 Geospatial Search
- Users and projects indexable by location
- Search "Plumbers within 10 miles of 90210"
- Integration with PostGIS for efficient queries

### 6.3 Privacy Controls
- Users can fuzz location data ("Show city only")
- Protects client privacy while maintaining searchability
- Granular control over what's visible to whom

## 7. Invoicing & Payments (Phase 2)

### 7.1 Estimate Builder
Simple form to generate PDF estimates:
- Labor costs
- Materials costs
- Markup percentage
- Professional formatting

### 7.2 Milestone Payments
Clients fund projects in stages:
1. **Deposit** - Initial payment to start
2. **Rough-in Complete** - Mid-project milestone
3. **Final** - Completion payment

## 8. UX Specifications

### 8.1 Visual Design Principles
- **Full-Bleed Images**: Interface resembles a gallery, not a spreadsheet
- **Dark Mode Default**: Reduces glare outdoors, saves battery
- **Media-Centric**: Photos and videos are the primary content

### 8.2 Accessibility Requirements
- **Fat Finger Friendly**: Minimum 48x48pt touch targets
- **Glove-Compatible**: Works with dirty hands or work gloves
- **High Contrast**: Readable in bright sunlight

### 8.3 Gamification
- Progress bars for profile completion
- "Add 3 more verified skills to reach Master status"
- Digital badges for streaks ("7 Days of Logs")
- Achievements for milestones

## 9. App Flow Overview

```
Landing Page
    ├── Worker Dashboard
    │   ├── Add Project (Record or Sync)
    │   ├── My Portfolio
    │   ├── Profile & Settings
    │   └── Messages
    │
    └── Recruiter Dashboard
        ├── Search Talent
        ├── Saved Candidates
        ├── Post Jobs
        └── Messages
```

---

*See [Technical Architecture](../technical/architecture-overview.md) for implementation details.*
