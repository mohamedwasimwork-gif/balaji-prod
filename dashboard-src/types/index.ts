export interface User {
  id: string;
  email: string;
  role: 'admin' | 'superadmin' | 'employee';
  websiteId?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface Website {
  _id: string;
  clientName: string;
  domain: string;
  siteType: 'framer' | 'react';
  framerWebhookSecret?: string;
  cloudflareProjectId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  websiteId: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  formName?: string;
  status: 'new' | 'contacted' | 'closed';
  source: 'framer' | 'react' | 'manual';
  isContacted: boolean;
  contactedAt?: string;
  contactedBy?: string;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  website?: Website;
}

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface Project {
  _id: string;
  projectTitle: string;
  companyName: string;
  clientName: string;
  phoneNumber: string;
  email: string;
  gstNumber?: string;
  address?: Address;
  status: 'active' | 'draft' | 'inactive';
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSnapshot {
  projectTitle: string;
  companyName: string;
  clientName: string;
  phoneNumber: string;
  email: string;
  address?: Address;
}

export type PaymentMode = 'cash' | 'upi' | 'bank' | 'other';
export type AmountType = 'credit' | 'debit';

export interface Expense {
  _id: string;
  expenseId: string;
  projectId: string;
  projectSnapshot: ProjectSnapshot;
  purpose: string;
  amount: number;
  amountType: AmountType;
  paymentMode: PaymentMode;
  refId: string;
  remarks?: string;
  vendorName?: string;
  invoiceNumber?: string;
  gstNumber?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  _id: string;
  invoiceId: string;
  projectId: string;
  projectSnapshot: ProjectSnapshot;
  purpose: string;
  amount: number;
  amountType: AmountType;
  paymentMode: PaymentMode;
  refId: string;
  remarks?: string;
  vendorName?: string;
  invoiceNumber?: string;
  gstNumber?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadReportEntry {
  id: string;
  date: string;
  projectTitle: string;
  purpose: string;
  amount: number;
  paymentMode: string;
  refId: string;
  vendorName?: string;
  invoiceNumber?: string;
  gstNumber?: string;
  remarks?: string;
}

export interface DownloadReportSection {
  credits: DownloadReportEntry[];
  creditTotal: number;
  debits: DownloadReportEntry[];
  debitTotal: number;
}

export interface DownloadReportData {
  companyName: string;
  generatedAt: string;
  projects: { projectTitle: string; projectId: string }[];
  paymentAdvice: DownloadReportSection;
  billing: DownloadReportSection;
}

export interface ProfitData {
  projectId: string;
  invoiceId: string;
  totalIncome: number;
  totalExpenditure: number;
  profit: number;
  profitPercentage: number;
}

export interface ContentChangeRequest {
  _id: string;
  websiteId: string;
  page: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  status: 'pending' | 'approved' | 'deployed' | 'rejected';
  requestedBy: User;
  approvedBy?: User;
  approvedAt?: string;
  deployedAt?: string;
  rejectionReason?: string;
  deploymentNotes?: string;
  createdAt: string;
  updatedAt: string;
  website?: Website;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  message: string;
  total: number;
  page: number;
  limit: number;
  [key: string]: T[] | number | string;
}

export interface DashboardMetrics {
  leads: {
    total: number;
    today: number;
    last7Days: number;
    last30Days: number;
    byStatus: { new: number; contacted: number; closed: number };
    recent: Lead[];
  };
  activity: {
    recent: ActivityLog[];
    lastActivity: string | null;
  };
  content: {
    pendingRequests: number;
    totalRequests: number;
  };
}

export interface ActivityLog {
  _id: string;
  adminId: string;
  actionType: string;
  entityType: string;
  entityId?: string;
  description: string;
  createdAt: string;
}

export interface ShowcaseProject {
  _id: string;
  title: string;
  slug: string;
  client: string;
  imageUrl?: string;
  location: string;
  category: string;
  projectDate?: string;
  overview: string;
  scopeOfWork: string[];
  keyHighlights: string[];
  status: 'draft' | 'published';
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'closed';
export type ProjectStatus = 'active' | 'draft' | 'inactive';
export type SiteType = 'framer' | 'react';
export type UserRole = 'admin' | 'superadmin' | 'employee';

export interface EmployeeDashboardMetrics {
  projects: { total: number };
  expenses: { total: number };
  invoices: { total: number };
}
