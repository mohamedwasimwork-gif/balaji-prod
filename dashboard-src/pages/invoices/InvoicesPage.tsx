import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfDay, endOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Search, Plus, Trash2, Pencil, Maximize2, Minimize2, X, FileText,
  Building2, Phone, Mail, MapPin, TrendingUp, TrendingDown, Calendar,
} from 'lucide-react';
import { invoicesService, projectsService } from '@dashboard/services';
import type { CreateInvoicePayload } from '@dashboard/services/invoices.service';
import { Invoice, Project, ProfitData } from '@dashboard/types';
import { QUERY_KEYS, PAYMENT_MODES, REF_ID_LABELS } from '@dashboard/constants';
import { Badge, Button, ConfirmDialog, EmptyState, Modal } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { ErrorState } from '@dashboard/components/ui/ErrorState';
import { DEFAULT_PAGE_SIZE, Pagination } from '@dashboard/components/ui/Pagination';
import { useDebounce } from '@dashboard/hooks/useDebounce';
import { usePermissions } from '@dashboard/hooks/usePermissions';

type PaymentMode = 'cash' | 'upi' | 'bank' | 'other';

const pretty = (d: string) => format(new Date(d), 'dd MMM yyyy');

function describeRange(from: string, to: string): string {
  if (!from && !to) return 'Create your first invoice record.';
  if (from && to) {
    return from === to
      ? `No invoices found for ${pretty(from)}. Try another range or click "Show All".`
      : `No invoices found between ${pretty(from)} and ${pretty(to)}. Try another range or click "Show All".`;
  }
  if (from) return `No invoices found on or after ${pretty(from)}. Try another range or click "Show All".`;
  return `No invoices found on or before ${pretty(to)}. Try another range or click "Show All".`;
}

export function InvoicesPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [fullscreen, setFullscreen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [editTarget, setEditTarget] = useState<Invoice | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();
  const { canDelete, canEdit, canViewProfit } = usePermissions();

  // Both bounds are optional and independent: From only = that day onward,
  // To only = up to that day, both = range, same value in both = single day.
  const invalidRange = !!fromDate && !!toDate && new Date(fromDate) > new Date(toDate);
  const dateFilters = {
    ...(fromDate ? { startDate: startOfDay(new Date(fromDate)).toISOString() } : {}),
    ...(toDate ? { endDate: endOfDay(new Date(toDate)).toISOString() } : {}),
  };

  const applyRange = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    setPage(1);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.INVOICES, debouncedSearch, modeFilter, typeFilter, projectFilter, fromDate, toDate, page, limit],
    enabled: !invalidRange,
    queryFn: () =>
      invoicesService.getInvoices({
        search: debouncedSearch || undefined,
        paymentMode: modeFilter === 'all' ? undefined : (modeFilter as PaymentMode),
        amountType: typeFilter === 'all' ? undefined : (typeFilter as 'credit' | 'debit'),
        projectId: projectFilter === 'all' ? undefined : projectFilter,
        page,
        limit,
        ...dateFilters,
      }),
  });

  // Drives the project filter dropdown; the list is small enough to fetch in one page.
  const { data: filterProjectsData } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS, 'filter'],
    queryFn: () => projectsService.getAdminProjects({ limit: 100 }),
  });
  const filterProjects: Project[] = filterProjectsData?.projects ?? [];

  const { data: profitData } = useQuery({
    queryKey: [QUERY_KEYS.INVOICE_PROFIT, selected?._id],
    queryFn: () => invoicesService.getProfit(selected!._id),
    enabled: !!selected && canViewProfit,
  });

  const deleteMutation = useMutation({
    mutationFn: invoicesService.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICES] });
      setDeleteTarget(null);
      if (selected && deleteTarget && selected._id === deleteTarget._id) setSelected(null);
      toast.success('Invoice deleted');
    },
    onError: () => toast.error('Failed to delete invoice'),
  });

  const invoices = data?.invoices ?? [];
  const total = data?.total ?? 0;

  const containerClass = fullscreen
    ? 'fixed inset-0 z-50 bg-gray-50 overflow-auto p-6'
    : 'space-y-6';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage project invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setFullscreen(!fullscreen)}>
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Invoice
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4 mt-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by ID, purpose, project, vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Modes</option>
            {PAYMENT_MODES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <select
            value={projectFilter}
            onChange={(e) => { setProjectFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm max-w-[220px]"
          >
            <option value="all">All Projects</option>
            {filterProjects.map((p) => (
              <option key={p._id} value={p._id}>{p.projectTitle} — {p.companyName}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <label className="text-xs font-medium text-gray-500">From</label>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
            <label className="text-xs font-medium text-gray-500">To</label>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => { setToDate(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
            <button
              onClick={() => { const t = format(new Date(), 'yyyy-MM-dd'); applyRange(t, t); }}
              className="px-3 py-2 text-xs font-medium text-forest-600 bg-forest-50 rounded-lg hover:bg-forest-100"
            >
              Today
            </button>
            <button
              onClick={() => applyRange(format(new Date(), 'yyyy-MM-01'), format(new Date(), 'yyyy-MM-dd'))}
              className="px-3 py-2 text-xs font-medium text-forest-600 bg-forest-50 rounded-lg hover:bg-forest-100"
            >
              This Month
            </button>
            {(fromDate || toDate) && (
              <button
                onClick={() => applyRange('', '')}
                className="px-3 py-2 text-xs font-medium text-forest-600 bg-forest-50 rounded-lg hover:bg-forest-100"
              >
                Show All
              </button>
            )}
          </div>
          <span className="flex items-center text-sm text-gray-500 px-2 sm:ml-auto">
            {invalidRange ? 'Invalid range' : `${total} record${total !== 1 ? 's' : ''}`}
          </span>
        </div>
        {invalidRange && (
          <p className="mt-2 text-xs text-red-600">The From date must be on or before the To date.</p>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        {/* Table */}
        <div className={`flex-1 bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden ${selected ? 'w-2/3' : 'w-full'}`}>
          {isError ? (
            <ErrorState message="Failed to load invoices" onRetry={() => refetch()} />
          ) : isLoading ? (
            <SectionSpinner />
          ) : invoices.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={FileText}
                title="No invoices yet"
                description={describeRange(fromDate, toDate)}
                action={{ label: 'New Invoice', onClick: () => setShowCreate(true) }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Project</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Purpose</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Mode</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                    {(canEdit || canDelete) && <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoices.map((inv) => (
                    <tr
                      key={inv._id}
                      onClick={() => setSelected(inv)}
                      className={`cursor-pointer hover:bg-forest-50/50 transition-colors ${selected?._id === inv._id ? 'bg-forest-50' : ''}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-forest-600">{inv.invoiceId}</td>
                      <td className="px-4 py-3 truncate max-w-[160px]">{inv.projectSnapshot.projectTitle}</td>
                      <td className="px-4 py-3 truncate max-w-[200px]">{inv.purpose}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        <span className={inv.amountType === 'credit' ? 'text-green-600' : 'text-red-600'}>
                          {inv.amountType === 'credit' ? '+' : '-'}₹{inv.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={inv.amountType === 'credit' ? 'green' : 'red'} className="capitalize text-xs">
                          {inv.amountType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 capitalize">{inv.paymentMode}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{pretty(inv.invoiceDate ?? inv.createdAt)}</td>
                      {(canEdit || canDelete) && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canEdit && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditTarget(inv); }}
                                className="p-1.5 text-forest-600 hover:bg-forest-50 rounded-lg"
                                title="Edit invoice"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setDeleteTarget(inv); }}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                title="Delete invoice"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data && (
            <Pagination
              page={page}
              total={data.total}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(next) => {
                setLimit(next);
                setPage(1);
              }}
            />
          )}
        </div>

        {/* Right Detail Panel */}
        {selected && (
          <div className="w-1/3 min-w-[320px] bg-white shadow-sm rounded-xl border border-gray-100 p-5 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{selected.invoiceId}</h3>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Profit Panel */}
            {canViewProfit && profitData && <ProfitPanel data={profitData} />}

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Purpose</p>
                <p className="font-medium">{selected.purpose}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Amount</p>
                  <p className={`font-semibold text-lg ${selected.amountType === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {selected.amountType === 'credit' ? '+' : '-'}₹{selected.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Type</p>
                  <Badge variant={selected.amountType === 'credit' ? 'green' : 'red'} className="capitalize">{selected.amountType}</Badge>
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Payment Mode</p>
                  <p className="capitalize">{selected.paymentMode}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">{REF_ID_LABELS[selected.paymentMode] || 'Ref ID'}</p>
                  <p className="font-mono text-xs">{selected.refId}</p>
                </div>
              </div>
              {selected.vendorName && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Vendor Name</p>
                  <p>{selected.vendorName}</p>
                </div>
              )}
              {selected.invoiceNumber && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Invoice Number</p>
                  <p className="font-mono text-xs">{selected.invoiceNumber}</p>
                </div>
              )}
              {selected.gstNumber && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">GST Number</p>
                  <p className="font-mono text-xs">{selected.gstNumber}</p>
                </div>
              )}
              {selected.remarks && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Remarks</p>
                  <p>{selected.remarks}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-xs mb-1">Invoice Date</p>
                <p>{pretty(selected.invoiceDate ?? selected.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Recorded On</p>
                <p>{format(new Date(selected.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Project Details</p>
              <div className="space-y-1.5 text-sm">
                <p className="font-medium">{selected.projectSnapshot.projectTitle}</p>
                <p className="flex items-center gap-1 text-gray-500 text-xs"><Building2 className="h-3 w-3" /> {selected.projectSnapshot.companyName}</p>
                <p className="text-gray-700">{selected.projectSnapshot.clientName}</p>
                <p className="flex items-center gap-1 text-gray-500 text-xs"><Phone className="h-3 w-3" /> {selected.projectSnapshot.phoneNumber}</p>
                <p className="flex items-center gap-1 text-gray-500 text-xs"><Mail className="h-3 w-3" /> {selected.projectSnapshot.email}</p>
                {selected.projectSnapshot.address && (() => {
                  const parts = [selected.projectSnapshot.address.line1, selected.projectSnapshot.address.city, selected.projectSnapshot.address.state, selected.projectSnapshot.address.pincode].filter(Boolean);
                  return parts.length > 0 ? (
                    <p className="flex items-start gap-1 text-gray-500 text-xs">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{parts.join(', ')}</span>
                    </p>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateInvoiceModal open={showCreate} onClose={() => setShowCreate(false)} />

      {/* Edit Modal */}
      {canEdit && (
        <EditInvoiceModal
          invoice={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={(updated) => {
            setSelected((cur) => (cur && cur._id === updated._id ? updated : cur));
          }}
        />
      )}

      {canDelete && (
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
          title="Delete Invoice"
          message={`Delete invoice "${deleteTarget?.invoiceId}"? This cannot be undone.`}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

function ProfitPanel({ data }: { data: ProfitData }) {
  const isPositive = data.profit >= 0;
  return (
    <div className={`rounded-lg p-4 ${isPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        {isPositive ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Project Profit · Billing (All Entries)</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Total Income</p>
          <p className="font-semibold text-green-700">₹{data.totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total Expenditure</p>
          <p className="font-semibold text-red-700">₹{data.totalExpenditure.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Net Profit</p>
          <p className={`font-bold text-lg ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
            {isPositive ? '+' : ''}₹{data.profit.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Profit %</p>
          <p className={`font-bold text-lg ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
            {data.profitPercentage}%
          </p>
        </div>
      </div>
    </div>
  );
}


interface EditFormState {
  invoiceDate: string;
  purpose: string;
  amount: string;
  amountType: 'credit' | 'debit';
  paymentMode: PaymentMode;
  refId: string;
  remarks: string;
  vendorName: string;
  invoiceNumber: string;
  gstNumber: string;
}

function toEditForm(inv: Invoice): EditFormState {
  return {
    invoiceDate: format(new Date(inv.invoiceDate ?? inv.createdAt), 'yyyy-MM-dd'),
    purpose: inv.purpose ?? '',
    amount: String(inv.amount ?? ''),
    amountType: inv.amountType,
    paymentMode: inv.paymentMode as PaymentMode,
    refId: inv.refId ?? '',
    remarks: inv.remarks ?? '',
    vendorName: inv.vendorName ?? '',
    invoiceNumber: inv.invoiceNumber ?? '',
    gstNumber: inv.gstNumber ?? '',
  };
}

function EditInvoiceModal({
  invoice,
  onClose,
  onUpdated,
}: {
  invoice: Invoice | null;
  onClose: () => void;
  onUpdated: (updated: Invoice) => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<EditFormState | null>(null);

  // Re-seed the form each time a different invoice is opened.
  const [seededId, setSeededId] = useState<string | null>(null);
  if (invoice && seededId !== invoice._id) {
    setSeededId(invoice._id);
    setForm(toEditForm(invoice));
  }

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<CreateInvoicePayload>) =>
      invoicesService.updateInvoice(invoice!._id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICE_PROFIT] });
      onUpdated(updated);
      onClose();
      toast.success('Invoice updated');
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 403) {
        toast.error('You do not have permission to edit invoices');
        return;
      }
      toast.error(error?.response?.data?.message || 'Failed to update invoice');
    },
  });

  const set = <K extends keyof EditFormState>(field: K, value: EditFormState[K]) => {
    setForm((cur) => {
      if (!cur) return cur;
      // Changing payment mode invalidates the reference ID, same as create.
      if (field === 'paymentMode') return { ...cur, paymentMode: value as PaymentMode, refId: '' };
      return { ...cur, [field]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !invoice) return;

    if (!form.invoiceDate || !form.purpose.trim() || !form.amount || !form.refId.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    const amount = parseFloat(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    if (form.purpose.trim().split(/\s+/).filter(Boolean).length > 100) {
      toast.error('Purpose must be max 100 words');
      return;
    }
    if (form.vendorName.trim().split(/\s+/).filter(Boolean).length > 100) {
      toast.error('Vendor Name must be max 100 words');
      return;
    }

    updateMutation.mutate({
      // Send midday so the stored UTC instant stays on the intended calendar day.
      invoiceDate: new Date(`${form.invoiceDate}T12:00:00`).toISOString(),
      purpose: form.purpose.trim(),
      amount,
      amountType: form.amountType,
      paymentMode: form.paymentMode,
      refId: form.refId.trim(),
      remarks: form.remarks.trim(),
      vendorName: form.vendorName.trim(),
      invoiceNumber: form.invoiceNumber.trim(),
      gstNumber: form.gstNumber.trim(),
    });
  };

  if (!invoice || !form) return null;

  const wordCount = form.purpose.trim().split(/\s+/).filter(Boolean).length;
  const vendorWordCount = form.vendorName.trim().split(/\s+/).filter(Boolean).length;
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white';

  return (
    <Modal open onClose={onClose} title={`Edit Invoice · ${invoice.invoiceId}`} size="lg">
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Project is intentionally read-only: the invoice stores a denormalized
                projectSnapshot, and reassigning would skew per-project profit totals. */}
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
              <p className="text-xs text-gray-500 mb-0.5">Project (cannot be changed)</p>
              <p className="text-sm font-medium text-gray-800">{invoice.projectSnapshot.projectTitle}</p>
              <p className="text-xs text-gray-500">{invoice.projectSnapshot.companyName}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Purpose * <span className="text-gray-400 font-normal">({wordCount}/100 words)</span>
              </label>
              <textarea
                value={form.purpose}
                onChange={(e) => set('purpose', e.target.value)}
                className={inputClass}
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) => set('invoiceDate', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
                <select
                  value={form.amountType}
                  onChange={(e) => set('amountType', e.target.value as 'credit' | 'debit')}
                  className={inputClass}
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Mode *</label>
                <select
                  value={form.paymentMode}
                  onChange={(e) => set('paymentMode', e.target.value as PaymentMode)}
                  className={inputClass}
                >
                  {PAYMENT_MODES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{REF_ID_LABELS[form.paymentMode]} *</label>
                <input
                  value={form.refId}
                  onChange={(e) => set('refId', e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Vendor Name <span className="text-gray-400 font-normal">({vendorWordCount}/100 words)</span>
              </label>
              <input
                value={form.vendorName}
                onChange={(e) => set('vendorName', e.target.value)}
                className={inputClass}
                placeholder="Optional"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number</label>
                <input
                  value={form.invoiceNumber}
                  onChange={(e) => set('invoiceNumber', e.target.value)}
                  className={inputClass}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">GST Number</label>
                <input
                  value={form.gstNumber}
                  onChange={(e) => set('gstNumber', e.target.value)}
                  className={inputClass}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Remarks</label>
              <textarea
                value={form.remarks}
                onChange={(e) => set('remarks', e.target.value)}
                rows={1}
                className={inputClass}
                placeholder="Optional"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={updateMutation.isPending}>Save Changes</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

interface InvoiceItem {
  invoiceDate: string;
  purpose: string;
  amount: string;
  amountType: 'credit' | 'debit';
  paymentMode: PaymentMode;
  refId: string;
  remarks: string;
  vendorName: string;
  invoiceNumber: string;
  gstNumber: string;
}

// Billing records income by default, so a new row starts as a credit.
const blankItem = (): InvoiceItem => ({
  invoiceDate: format(new Date(), 'yyyy-MM-dd'),
  purpose: '',
  amount: '',
  amountType: 'credit',
  paymentMode: 'cash',
  refId: '',
  remarks: '',
  vendorName: '',
  invoiceNumber: '',
  gstNumber: '',
});

function CreateInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([blankItem()]);

  const { data: projectsData } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS],
    queryFn: () => projectsService.getAdminProjects({ limit: 100 }),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: invoicesService.createInvoicesBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICES] });
      resetForm();
      onClose();
      toast.success('Invoices created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create invoices');
    },
  });

  const resetForm = () => {
    setProjectId('');
    setItems([blankItem()]);
  };

  const handleAddItem = () => setItems([...items, blankItem()]);

  const handleRemoveItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleUpdateItem = (idx: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = updated[idx];
    if (item) {
      updated[idx] = { ...item, [field]: value };
      if (field === 'paymentMode') {
        updated[idx].refId = ''; // Reset reference ID when mode changes
      }
      setItems(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      toast.error('Please select a project');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;
      if (!item.invoiceDate || !item.purpose.trim() || !item.amount || !item.refId.trim()) {
        toast.error(`Please fill all required fields for Invoice #${i + 1}`);
        return;
      }
      const amount = parseFloat(item.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        toast.error(`Amount must be greater than 0 for Invoice #${i + 1}`);
        return;
      }
      if (item.purpose.trim().split(/\s+/).filter(Boolean).length > 100) {
        toast.error(`Purpose must be max 100 words for Invoice #${i + 1}`);
        return;
      }
      if (item.vendorName.trim().split(/\s+/).filter(Boolean).length > 100) {
        toast.error(`Vendor Name must be max 100 words for Invoice #${i + 1}`);
        return;
      }
    }

    createMutation.mutate({
      projectId,
      invoices: items.map((item) => ({
        // Send midday so the stored UTC instant stays on the intended calendar day.
        invoiceDate: new Date(`${item.invoiceDate}T12:00:00`).toISOString(),
        purpose: item.purpose.trim(),
        amount: parseFloat(item.amount),
        amountType: item.amountType,
        paymentMode: item.paymentMode,
        refId: item.refId.trim(),
        remarks: item.remarks.trim() || undefined,
        vendorName: item.vendorName.trim() || undefined,
        invoiceNumber: item.invoiceNumber.trim() || undefined,
        gstNumber: item.gstNumber.trim() || undefined,
      })),
    });
  };

  const projects: Project[] = projectsData?.projects ?? [];

  return (
    <Modal open={open} onClose={onClose} title="New Invoice" size="lg">
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                required
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.projectTitle} — {p.companyName}</option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-100 my-4" />

            <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
              {items.map((item, idx) => {
                const wordCount = item.purpose.trim().split(/\s+/).filter(Boolean).length;
                const vendorWordCount = item.vendorName.trim().split(/\s+/).filter(Boolean).length;

                return (
                  <div key={idx} className="relative p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-forest-700">Invoice #{idx + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Purpose * <span className="text-gray-400 font-normal">({wordCount}/100 words)</span>
                      </label>
                      <textarea
                        value={item.purpose}
                        onChange={(e) => handleUpdateItem(idx, 'purpose', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                        placeholder="Max 100 words"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                        <input
                          type="date"
                          value={item.invoiceDate}
                          onChange={(e) => handleUpdateItem(idx, 'invoiceDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Amount *</label>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => handleUpdateItem(idx, 'amount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
                        <select
                          value={item.amountType}
                          onChange={(e) => handleUpdateItem(idx, 'amountType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                        >
                          <option value="credit">Credit</option>
                          <option value="debit">Debit</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Payment Mode *</label>
                        <select
                          value={item.paymentMode}
                          onChange={(e) => handleUpdateItem(idx, 'paymentMode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                        >
                          {PAYMENT_MODES.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{REF_ID_LABELS[item.paymentMode]} *</label>
                        <input
                          value={item.refId}
                          onChange={(e) => handleUpdateItem(idx, 'refId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Vendor Name <span className="text-gray-400 font-normal">({vendorWordCount}/100 words)</span>
                      </label>
                      <input
                        type="text"
                        value={item.vendorName}
                        onChange={(e) => handleUpdateItem(idx, 'vendorName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                        placeholder="Optional"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Invoice Number</label>
                        <input
                          value={item.invoiceNumber}
                          onChange={(e) => handleUpdateItem(idx, 'invoiceNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">GST Number</label>
                        <input
                          value={item.gstNumber}
                          onChange={(e) => handleUpdateItem(idx, 'gstNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Remarks</label>
                      <textarea
                        value={item.remarks}
                        onChange={(e) => handleUpdateItem(idx, 'remarks', e.target.value)}
                        rows={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 hover:border-forest-500 rounded-xl text-sm font-medium text-gray-600 hover:text-forest-700 transition-colors bg-white hover:bg-forest-50/20"
              >
                <Plus className="h-4 w-4" /> Add Another Invoice
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
          <Button type="submit" loading={createMutation.isPending}>Create Invoices</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
