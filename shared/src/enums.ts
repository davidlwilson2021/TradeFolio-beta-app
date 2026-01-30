export enum TradeCategory {
  ELECTRICAL = 'ELECTRICAL',
  HVAC = 'HVAC',
  PLUMBING = 'PLUMBING',
  WELDING = 'WELDING',
  CARPENTRY = 'CARPENTRY',
  MASONRY = 'MASONRY',
  ROOFING = 'ROOFING',
  PAINTING = 'PAINTING',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum SubscriptionTier {
  FREE = 'free',
  PLUS = 'plus',
  PRO = 'pro',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETE = 'complete',
  FAILED = 'failed',
}
