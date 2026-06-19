import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  ArrowLeft, Edit, Building2, Phone, Mail, MapPin, FileText,
  TrendingUp, TrendingDown, Receipt, Hash,
} from 'lucide-react';
import { projectsService, expensesService, invoicesService } from '@dashboard/services';
import { ProfitData } from '@dashboard/types';
import { QUERY_KEYS, ROUTES } from '@dashboard/constants';
import { Badge, Button } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { ErrorState } from '@dashboard/components/ui/ErrorState';
import { usePermissions } from '@dashboard/hooks/usePermissions';

const statusColor = (s: string) => {
  if (s === 'active') return 'green';
  if (s === 'draft') return 'yellow';
  return 'gray';
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit, canViewProfit } = usePermissions();

  const { data: project, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECT, id],
    queryFn: () => projectsService.getAdminProject(id!),
    enabled: !!id,
  });

  const { data: expenseProfit } = useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_PROFIT, id],
    queryFn: () => expensesService.getProjectProfit(id!),
    enabled: !!id && canViewProfit,
  });

  const { data: invoiceProfit } = useQuery({
    queryKey: [QUERY_KEYS.INVOICE_PROJECT_PROFIT, id],
    queryFn: () => invoicesService.getProjectProfit(id!),
    enabled: !!id && canViewProfit,
  });

  if (isLoading) return <SectionSpinner />;
  if (isError || !project) return <ErrorState message="Failed to load project" onRetry={() => refetch()} />;

  const addressParts = project.address
    ? [project.address.line1, project.address.line2, project.address.city, project.address.state, project.address.pincode, project.address.country].filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(ROUTES.PROJECTS)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{project.projectTitle}</h1>
              <Badge variant={statusColor(project.status) as any} className="capitalize">{project.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{project.companyName}</p>
          </div>
        </div>
        {canEdit && (
          <Button onClick={() => navigate(ROUTES.PROJECT_EDIT(project._id))}>
            <Edit className="h-4 w-4 mr-2" /> Edit Project
          </Button>
        )}
      </div>

      {/* Project Details + Profit Panels */}
      <div className={`grid grid-cols-1 ${canViewProfit ? 'lg:grid-cols-3' : ''} gap-6`}>
        {/* Project Info Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Project Information</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Project Title</p>
              <p className="font-medium text-gray-900">{project.projectTitle}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Company Name</p>
              <p className="flex items-center gap-1.5 text-gray-900">
                <Building2 className="h-4 w-4 text-gray-400" /> {project.companyName}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Client Name</p>
              <p className="font-medium text-gray-900">{project.clientName}</p>
            </div>
            {project.gstNumber && (
              <div>
                <p className="text-gray-500 text-xs mb-1">GST Number</p>
                <p className="flex items-center gap-1.5 text-gray-900 font-mono text-xs">
                  <Hash className="h-4 w-4 text-gray-400" /> {project.gstNumber}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-500 text-xs mb-1">Phone</p>
              <p className="flex items-center gap-1.5 text-gray-900">
                <Phone className="h-4 w-4 text-gray-400" /> {project.phoneNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Email</p>
              <p className="flex items-center gap-1.5 text-gray-900">
                <Mail className="h-4 w-4 text-gray-400" /> {project.email}
              </p>
            </div>
            {addressParts.length > 0 && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Client Address</p>
                <p className="flex items-start gap-1.5 text-gray-900">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>{addressParts.join(', ')}</span>
                </p>
              </div>
            )}
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
              Created: {format(new Date(project.createdAt), 'dd MMM yyyy, hh:mm a')}
            </div>
          </div>
        </div>

        {/* Payment Advice Profit */}
        {canViewProfit && (
          <ProfitCard
            title="Payment Advice Profit"
            icon={Receipt}
            data={expenseProfit}
            description="All entries · Payment Advice (Expenses) only"
          />
        )}

        {/* Billing Profit */}
        {canViewProfit && (
          <ProfitCard
            title="Billing Profit"
            icon={FileText}
            data={invoiceProfit}
            description="All entries · Billing (Invoices) only"
          />
        )}
      </div>
    </div>
  );
}

function ProfitCard({
  title,
  icon: Icon,
  data,
  description,
}: {
  title: string;
  icon: React.ElementType;
  data: ProfitData | undefined;
  description: string;
}) {
  if (!data) {
    return (
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-8 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const isPositive = data.profit >= 0;
  const hasData = data.totalIncome > 0 || data.totalExpenditure > 0;

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-5 w-5 text-gray-400" />
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      <p className="text-xs text-gray-400 mb-5">{description}</p>

      {!hasData ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-400">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-green-700 font-medium mb-1">Total Income</p>
              <p className="text-xl font-bold text-green-700">₹{data.totalIncome.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-xs text-red-700 font-medium mb-1">Total Expenditure</p>
              <p className="text-xl font-bold text-red-700">₹{data.totalExpenditure.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className={`rounded-lg p-4 ${isPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Net Profit</p>
                <p className={`text-2xl font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                  {isPositive ? '+' : ''}₹{data.profit.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {data.profitPercentage}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
