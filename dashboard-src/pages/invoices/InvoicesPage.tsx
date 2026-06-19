import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfDay, endOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Search, Plus, Trash2, Maximize2, Minimize2, X, FileText,
  Building2, Phone, Mail, MapPin, TrendingUp, TrendingDown, Calendar,
} from 'lucide-react';
import { invoicesService, projectsService } from '@dashboard/services';
import { Invoice, Project, ProfitData } from '@dashboard/types';
import { QUERY_KEYS, PAYMENT_MODES, REF_ID_LABELS } from '@dashboard/constants';
import { Badge, Button, ConfirmDialog, EmptyState, Modal } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { ErrorState } from '@dashboard/components/ui/ErrorState';
import { Pagination } from '@dashboard/components/ui/Pagination';
import { useDebounce } from '@dashboard/hooks/useDebounce';
import { usePermissions } from '@dashboard/hooks/usePermissions';

type PaymentMode = 'cash' | 'upi' | 'bank' | 'other';

export function InvoicesPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [page, setPage] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();
  const { canDelete, canViewProfit } = usePermissions();

  const dateFilters = filterDate
    ? {
        startDate: startOfDay(new Date(filterDate)).toISOString(),
        endDate: endOfDay(new Date(filterDate)).toISOString(),
      }
    : {};

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.INVOICES, debouncedSearch, modeFilter, typeFilter, filterDate, page],
    queryFn: () =>
      invoicesService.getInvoices({
        search: debouncedSearch || undefined,
        paymentMode: modeFilter === 'all' ? undefined : (modeFilter as PaymentMode),
        amountType: typeFilter === 'all' ? undefined : (typeFilter as 'credit' | 'debit'),
        page,
        limit: 20,
        ...dateFilters,
      }),
  });

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
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
            {filterDate && (
              <button
                onClick={() => { setFilterDate(''); setPage(1); }}
                className="px-3 py-2 text-xs font-medium text-forest-600 bg-forest-50 rounded-lg hover:bg-forest-100"
              >
                Show All
              </button>
            )}
          </div>
          <span className="flex items-center text-sm text-gray-500 px-2 ml-auto">{total} record{total !== 1 ? 's' : ''}</span>
        </div>
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
                description={filterDate ? `No invoices found for ${format(new Date(filterDate), 'dd MMM yyyy')}. Try another date or click "Show All".` : 'Create your first invoice record.'}
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
                    {canDelete && <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>}
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
                      <td className="px-4 py-3 text-gray-500 text-xs">{format(new Date(inv.createdAt), 'dd MMM yyyy')}</td>
                      {canDelete && (
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(inv); }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data && <Pagination page={page} total={data.total} limit={20} onPageChange={setPage} />}
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
                <p className="text-gray-500 text-xs mb-1">Date</p>
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

function CreateInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [amountType, setAmountType] = useState<'credit' | 'debit'>('credit');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [refId, setRefId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const { data: projectsData } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS],
    queryFn: () => projectsService.getAdminProjects({ limit: 100 }),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: invoicesService.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVOICES] });
      resetForm();
      onClose();
    },
  });

  const resetForm = () => {
    setProjectId(''); setPurpose(''); setAmount(''); setAmountType('credit');
    setPaymentMode('cash'); setRefId(''); setRemarks('');
    setVendorName(''); setInvoiceNumber(''); setGstNumber('');
  };

  const wordCount = purpose.trim().split(/\s+/).filter(Boolean).length;
  const vendorWordCount = vendorName.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !purpose || !amount || !refId) return;
    if (wordCount > 100) { toast.error('Purpose must be max 100 words'); return; }
    createMutation.mutate({
      projectId,
      purpose,
      amount: parseFloat(amount),
      amountType,
      paymentMode,
      refId,
      remarks: remarks || undefined,
      vendorName: vendorName || undefined,
      invoiceNumber: invoiceNumber || undefined,
      gstNumber: gstNumber || undefined,
    });
  };

  const projects: Project[] = projectsData?.projects ?? [];

  return (
    <Modal open={open} onClose={onClose} title="New Invoice">
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              >
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.projectTitle} — {p.companyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose * <span className="text-gray-400 font-normal">({wordCount}/100 words)</span>
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Max 100 words"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={amountType}
                  onChange={(e) => setAmountType(e.target.value as 'credit' | 'debit')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode *</label>
                <select
                  value={paymentMode}
                  onChange={(e) => { setPaymentMode(e.target.value as PaymentMode); setRefId(''); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {PAYMENT_MODES.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{REF_ID_LABELS[paymentMode]} *</label>
                <input
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Name <span className="text-gray-400 font-normal">({vendorWordCount}/100 words)</span>
              </label>
              <textarea
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Optional"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
          <Button type="submit" loading={createMutation.isPending}>Create Invoice</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
