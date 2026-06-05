// ============================================
// QRAZY - Global Type Definitions
// ============================================

// ---------- Auth & User ----------
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Date;
  workspaceId: string;
  themePreference: ThemeOption;
}

// ---------- Theme ----------
export type ThemeOption = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// ---------- Business Verticals ----------
export type BusinessType =
  | 'restaurant'
  | 'retail'
  | 'furniture'
  | 'jewelry'
  | 'real_estate'
  | 'automotive'
  | 'general';

export interface BusinessTypeOption {
  id: BusinessType;
  name: string;
  description: string;
  icon: string;
  arExperienceLabel: string;
  productLabel: { singular: string; plural: string };
  color: string;
  gradient: string;
}

// ---------- Workspace ----------
export interface Workspace {
  workspaceId: string;
  ownerId: string;
  workspaceName: string;
  businessType: BusinessType;
  brandingConfig: BrandingConfig;
  createdAt: Date;
}

export interface BrandingConfig {
  primaryColor: string;
  logoUrl: string | null;
  companyName: string;
}

// ---------- Products ----------
export interface Product {
  productId: string;
  ownerId: string;
  workspaceId: string;
  name: string;
  description: string;
  imageUrl: string;
  glbUrl: string | null;
  usdzUrl: string | null;
  verticalMetadata: Record<string, string | number | boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- QR Codes ----------
export interface QRCode {
  qrcodeId: string;
  productId: string;
  workspaceId: string;
  ownerId: string;
  qrImageUrl: string;
  linkedArUrl: string;
  scanCount: number;
  createdAt: Date;
  style: QRStyle;
}

export interface QRStyle {
  color: string;
  backgroundColor: string;
  logoUrl: string | null;
}

// ---------- Analytics ----------
export interface AnalyticsEvent {
  eventId: string;
  eventType: 'qr_scan' | 'ar_launch' | 'ar_view_duration';
  productId: string;
  workspaceId: string;
  deviceType: string;
  timestamp: Date;
  sessionId: string;
}

// ---------- AR Generation ----------
export interface ARGenerationJob {
  jobId: string;
  productId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageUrl: string;
  glbUrl: string | null;
  usdzUrl: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

// ---------- Templates ----------
export interface Template {
  templateId: string;
  name: string;
  category: BusinessType;
  glbUrl: string;
  previewImageUrl: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
}

// ---------- Vertical Config ----------
export interface VerticalConfig {
  productLabels: { singular: string; plural: string };
  arExperienceLabel: string;
  dashboardWidgets: string[];
  productFormFields: FormField[];
  recommendedTemplateCategories: string[];
  analyticsKPILabels: Record<string, string>;
  geometryTemplate: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'url';
  required: boolean;
  placeholder?: string;
  options?: string[];
}