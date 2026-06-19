export const QUERY_KEYS = {
  LEADS: 'leads',
  LEAD: 'lead',
  LEAD_STATS: 'lead-stats',
  PROJECTS: 'projects',
  PROJECT: 'project',
  ADMIN_PROJECTS: 'admin-projects',
  ADMIN_PROJECT: 'admin-project',
  WEBSITES: 'websites',
  WEBSITE: 'website',
  DASHBOARD_METRICS: 'dashboard-metrics',
  PAGE_CONTENT_HOME: 'page-content-home',
  PAGE_CONTENT_SOLUTIONS: 'page-content-solutions',
  PAGE_CONTENT_CONTACT: 'page-content-contact',
  PAGE_CONTENT_PROJECTS: 'page-content-projects',
  ACTIVITY: 'activity',
  ACTIVITY_STATS: 'activity-stats',
  CONTENT_REQUESTS: 'content-requests',
  EXPENSES: 'expenses',
  EXPENSE: 'expense',
  INVOICES: 'invoices',
  INVOICE: 'invoice',
  INVOICE_PROFIT: 'invoice-profit',
  INVOICE_PROJECT_PROFIT: 'invoice-project-profit',
  EXPENSE_PROFIT: 'expense-profit',
  DOWNLOAD_REPORT: 'download-report',
  SHOWCASE_PROJECTS: 'showcase-projects',
  SHOWCASE_PROJECT: 'showcase-project',
  EMPLOYEE_DASHBOARD_METRICS: 'employee-dashboard-metrics',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LEADS: '/leads',
  PROJECTS: '/projects',
  PROJECTS_NEW: '/projects/new',
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  PROJECT_EDIT: (id: string) => `/projects/${id}/edit`,
  PAGES_HOME: '/pages/home',
  PAGES_SOLUTIONS: '/pages/solutions',
  PAGES_CONTACT: '/pages/contact',
  PAGES_PROJECTS: '/pages/projects',
  WEBSITES: '/websites',
  EXPENSES: '/expenses',
  EXPENSES_NEW: '/expenses/new',
  INVOICES: '/invoices',
  INVOICES_NEW: '/invoices/new',
  DOWNLOAD: '/download',
  SHOWCASE_PROJECTS: '/showcase-projects',
  SHOWCASE_PROJECTS_NEW: '/showcase-projects/new',
  SHOWCASE_PROJECT_EDIT: (id: string) => `/showcase-projects/${id}/edit`,
  MEDIA: '/media',
} as const;

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  CLOSED: 'closed',
} as const;

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  INACTIVE: 'inactive',
} as const;

export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank', label: 'Bank' },
  { value: 'other', label: 'Other' },
] as const;

export const REF_ID_LABELS: Record<string, string> = {
  cash: 'Collector Name',
  upi: 'UTR ID',
  bank: 'Cheque / Transaction Number',
  other: 'Other Details / Remarks',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  EMPLOYEE: 'employee',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
} as const;

export const REFETCH_INTERVALS = {
  DASHBOARD: 30_000,
  LEADS: 30_000,
} as const;
