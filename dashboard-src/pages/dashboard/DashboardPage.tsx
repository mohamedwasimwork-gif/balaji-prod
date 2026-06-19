import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Clock, CheckCircle, FolderKanban, Receipt, FileText, Plus } from 'lucide-react';
import { dashboardService } from '@dashboard/services';
import { useAuth } from '@dashboard/features/auth';
import { QUERY_KEYS, REFETCH_INTERVALS, ROUTES } from '@dashboard/constants';
import { Badge, Button } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  footer?: React.ReactNode;
}

function StatCard({ title, value, icon: Icon, iconColor, footer }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-2 rounded-lg ${iconColor}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="ml-4 w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
      {footer && <div className="bg-gray-50 px-5 py-3 text-sm border-t border-gray-100">{footer}</div>}
    </div>
  );
}

export function DashboardPage() {
  const { isEmployee } = useAuth();

  if (isEmployee) return <EmployeeDashboard />;

  return <AdminDashboard />;
}

function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: metrics, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_DASHBOARD_METRICS],
    queryFn: dashboardService.getEmployeeMetrics,
    refetchInterval: REFETCH_INTERVALS.DASHBOARD,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.fullName || user?.email}
        </p>
      </div>

      {isLoading ? (
        <SectionSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Projects"
              value={metrics?.projects.total ?? 0}
              icon={FolderKanban}
              iconColor="bg-forest-500"
            />
            <StatCard
              title="Total Expenses"
              value={metrics?.expenses.total ?? 0}
              icon={Receipt}
              iconColor="bg-orange-500"
            />
            <StatCard
              title="Total Invoices"
              value={metrics?.invoices.total ?? 0}
              icon={FileText}
              iconColor="bg-green-500"
            />
          </div>

          <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button variant="secondary" onClick={() => navigate(ROUTES.PROJECTS_NEW)} className="justify-center">
                <Plus className="h-4 w-4 mr-2" /> New Project
              </Button>
              <Button variant="secondary" onClick={() => navigate(ROUTES.EXPENSES)} className="justify-center">
                <Plus className="h-4 w-4 mr-2" /> New Expense
              </Button>
              <Button variant="secondary" onClick={() => navigate(ROUTES.INVOICES)} className="justify-center">
                <Plus className="h-4 w-4 mr-2" /> New Invoice
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();

  const { data: metrics, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_METRICS],
    queryFn: dashboardService.getMetrics,
    refetchInterval: REFETCH_INTERVALS.DASHBOARD,
  });

  const leads = metrics?.leads;
  const recentLeads = leads?.recent ?? [];

  const statusBadge = (status: string) => {
    if (status === 'closed') return <Badge variant="gray">Closed</Badge>;
    if (status === 'contacted') return <Badge variant="green">Contacted</Badge>;
    return <Badge variant="yellow">New</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {user?.fullName || user?.email}
        </p>
      </div>

      {isLoading ? (
        <SectionSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Leads"
              value={leads?.total ?? 0}
              icon={Users}
              iconColor="bg-forest-500"
              footer={<span className="text-gray-500">{leads?.last7Days ?? 0} in last 7 days</span>}
            />
            <StatCard
              title="New Leads"
              value={leads?.byStatus.new ?? 0}
              icon={TrendingUp}
              iconColor="bg-yellow-500"
              footer={<span className="text-gray-500">Awaiting contact</span>}
            />
            <StatCard
              title="Contacted"
              value={leads?.byStatus.contacted ?? 0}
              icon={CheckCircle}
              iconColor="bg-green-500"
              footer={<span className="text-gray-500">In progress</span>}
            />
            <StatCard
              title="Contact Rate"
              value={`${leads?.total ? Math.round(((leads.total - (leads.byStatus.new ?? 0)) / leads.total) * 100) : 0}%`}
              icon={Clock}
              iconColor="bg-purple-500"
              footer={<span className="text-gray-500">{leads?.byStatus.closed ?? 0} closed</span>}
            />
          </div>

          <div className="bg-white shadow-sm rounded-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Recent Leads</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentLeads.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-gray-500">No leads yet</div>
              ) : (
                recentLeads.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between px-6 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {lead.email} · {lead.formName ?? 'Unknown form'} · {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">{statusBadge(lead.status)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
