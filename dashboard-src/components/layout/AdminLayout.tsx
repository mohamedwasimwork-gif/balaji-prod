import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@dashboard/features/auth';
import { ROUTES } from '@dashboard/constants';
import {
  LayoutDashboard,
  Users,
  Globe,
  FolderKanban,
  Receipt,
  FileText,
  Download,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

// ─── Nav Group Types ─────────────────────────────────────────────────────────

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// ─── Admin Navigation Groups ──────────────────────────────────────────────────

const adminNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    ],
  },
  {
    label: 'CRM',
    items: [
      { name: 'Leads', href: ROUTES.LEADS, icon: Users },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Projects', href: ROUTES.PROJECTS, icon: FolderKanban },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Payment Advice', href: ROUTES.EXPENSES, icon: Receipt },
      { name: 'Billing', href: ROUTES.INVOICES, icon: FileText },
      { name: 'Download Report', href: ROUTES.DOWNLOAD, icon: Download },
    ],
  },
];

const superAdminNavGroups: NavGroup[] = [
  {
    label: 'System',
    items: [
      { name: 'Websites', href: ROUTES.WEBSITES, icon: Globe },
    ],
  },
];

const employeeNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Projects', href: ROUTES.PROJECTS, icon: FolderKanban },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Payment Advice', href: ROUTES.EXPENSES, icon: Receipt },
      { name: 'Billing', href: ROUTES.INVOICES, icon: FileText },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminLayout() {
  const { user, logout, isSuperAdmin, isEmployee } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navGroups = isEmployee
    ? employeeNavGroups
    : isSuperAdmin
      ? [...adminNavGroups, ...superAdminNavGroups]
      : adminNavGroups;

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Brand Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-gray-100 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-bold text-forest-800 leading-none">Balaji & Co.</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
            {isEmployee ? 'Employee Dashboard' : isSuperAdmin ? 'Super Admin' : 'Admin Dashboard'}
          </p>
        </div>
      </div>

      {/* ── Navigation Groups ─────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {/* Group Label */}
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 select-none">
              {group.label}
            </p>
            {/* Group Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                      active
                        ? 'bg-forest-50 text-forest-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-forest-700'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${
                        active ? 'text-forest-600' : 'text-gray-400 group-hover:text-forest-500'
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {active && (
                      <ChevronRight className="h-3.5 w-3.5 text-forest-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User Footer ──────────────────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-forest-700">
              {(user?.fullName || user?.email || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate leading-none">
              {user?.fullName || user?.email}
            </p>
            <p className="text-[10px] text-gray-400 capitalize mt-0.5 leading-none">{user?.role}</p>
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col border-r border-gray-100 bg-white shadow-sm">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Top bar (mobile only) */}
        <div className="sticky top-0 z-10 flex items-center h-14 px-4 bg-white border-b border-gray-100 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-sm font-semibold text-gray-900">
            {isEmployee ? 'Balaji & Co Employee' : 'Balaji & Co Admin'}
          </span>
        </div>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
