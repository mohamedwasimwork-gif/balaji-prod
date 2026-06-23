import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfDay, endOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Search, Plus, Trash2, Maximize2, Minimize2, X, Receipt,
  Building2, Phone, Mail, MapPin, Calendar, TrendingUp, TrendingDown,
  Download, FileSpreadsheet
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { expensesService, projectsService } from '@dashboard/services';
import { Expense, Project, ProfitData } from '@dashboard/types';
import { QUERY_KEYS, PAYMENT_MODES, REF_ID_LABELS } from '@dashboard/constants';
import { Badge, Button, ConfirmDialog, EmptyState, Modal } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { ErrorState } from '@dashboard/components/ui/ErrorState';
import { Pagination } from '@dashboard/components/ui/Pagination';
import { useDebounce } from '@dashboard/hooks/useDebounce';
import { usePermissions } from '@dashboard/hooks/usePermissions';

type PaymentMode = 'cash' | 'upi' | 'bank' | 'other';

export function ExpensesPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [page, setPage] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [selected, setSelected] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showDownloadReport, setShowDownloadReport] = useState(false);
  const queryClient = useQueryClient();
  const { canDelete, canViewProfit } = usePermissions();

  const dateFilters = filterDate
    ? {
        startDate: startOfDay(new Date(filterDate)).toISOString(),
        endDate: endOfDay(new Date(filterDate)).toISOString(),
      }
    : {};

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.EXPENSES, debouncedSearch, modeFilter, typeFilter, filterDate, page],
    queryFn: () =>
      expensesService.getExpenses({
        search: debouncedSearch || undefined,
        paymentMode: modeFilter === 'all' ? undefined : (modeFilter as PaymentMode),
        amountType: typeFilter === 'all' ? undefined : (typeFilter as 'credit' | 'debit'),
        page,
        limit: 20,
        ...dateFilters,
      }),
  });

  const { data: profitData } = useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_PROFIT, selected?.projectId],
    queryFn: () => expensesService.getProjectProfit(selected!.projectId),
    enabled: !!selected?.projectId && canViewProfit,
  });

  const deleteMutation = useMutation({
    mutationFn: expensesService.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
      setDeleteTarget(null);
      if (selected && deleteTarget && selected._id === deleteTarget._id) setSelected(null);
      toast.success('Expense deleted');
    },
    onError: () => toast.error('Failed to delete expense'),
  });

  const expenses = data?.expenses ?? [];
  const total = data?.total ?? 0;

  const containerClass = fullscreen
     ? 'fixed inset-0 z-50 bg-gray-50 overflow-auto p-6'
     : 'space-y-6';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Advice</h1>
          <p className="text-sm text-gray-500 mt-1">Manage project expenditures</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setFullscreen(!fullscreen)}>
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="secondary" onClick={() => setShowDownloadReport(true)} className="flex items-center gap-1.5">
            <Download className="h-4 w-4" /> Download Report
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Expense
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
            <ErrorState message="Failed to load expenses" onRetry={() => refetch()} />
          ) : isLoading ? (
            <SectionSpinner />
          ) : expenses.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Receipt}
                title="No expenses yet"
                description={filterDate ? `No expenses found for ${format(new Date(filterDate), 'dd MMM yyyy')}. Try another date or click "Show All".` : 'Create your first expense record.'}
                action={{ label: 'New Expense', onClick: () => setShowCreate(true) }}
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
                  {expenses.map((exp) => (
                    <tr
                      key={exp._id}
                      onClick={() => setSelected(exp)}
                      className={`cursor-pointer hover:bg-forest-50/50 transition-colors ${selected?._id === exp._id ? 'bg-forest-50' : ''}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-forest-600">{exp.expenseId}</td>
                      <td className="px-4 py-3 truncate max-w-[160px]">{exp.projectSnapshot.projectTitle}</td>
                      <td className="px-4 py-3 truncate max-w-[200px]">{exp.purpose}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        <span className={exp.amountType === 'credit' ? 'text-green-600' : 'text-red-600'}>
                          {exp.amountType === 'credit' ? '+' : '-'}₹{exp.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={exp.amountType === 'credit' ? 'green' : 'red'} className="capitalize text-xs">
                          {exp.amountType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 capitalize">{exp.paymentMode}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{format(new Date(exp.createdAt), 'dd MMM yyyy')}</td>
                      {canDelete && (
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(exp); }}
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
              <h3 className="font-semibold text-gray-900">{selected.expenseId}</h3>
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
      <CreateExpenseModal open={showCreate} onClose={() => setShowCreate(false)} />

      {/* Download Report Modal */}
      <DownloadExpensesReportModal open={showDownloadReport} onClose={() => setShowDownloadReport(false)} />

      {canDelete && (
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
          title="Delete Expense"
          message={`Delete expense "${deleteTarget?.expenseId}"? This cannot be undone.`}
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
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Project Profit · Payment Advice (All Entries)</p>
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

function CreateExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState('');
  interface ExpenseItem {
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

  const [items, setItems] = useState<ExpenseItem[]>([
    {
      purpose: '',
      amount: '',
      amountType: 'debit',
      paymentMode: 'cash',
      refId: '',
      remarks: '',
      vendorName: '',
      invoiceNumber: '',
      gstNumber: '',
    }
  ]);

  const { data: projectsData } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS],
    queryFn: () => projectsService.getAdminProjects({ limit: 100 }),
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: expensesService.createExpensesBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
      resetForm();
      onClose();
      toast.success('Expenses created successfully');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to create expenses';
      toast.error(msg);
    }
  });

  const resetForm = () => {
    setProjectId('');
    setItems([
      {
        purpose: '',
        amount: '',
        amountType: 'debit',
        paymentMode: 'cash',
        refId: '',
        remarks: '',
        vendorName: '',
        invoiceNumber: '',
        gstNumber: '',
      }
    ]);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        purpose: '',
        amount: '',
        amountType: 'debit',
        paymentMode: 'cash',
        refId: '',
        remarks: '',
        vendorName: '',
        invoiceNumber: '',
        gstNumber: '',
      }
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleUpdateItem = (idx: number, field: keyof ExpenseItem, value: any) => {
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
      if (!item.purpose.trim() || !item.amount || !item.refId.trim()) {
        toast.error(`Please fill all required fields for Expense #${i + 1}`);
        return;
      }
      const wordCount = item.purpose.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > 100) {
        toast.error(`Purpose must be max 100 words for Expense #${i + 1}`);
        return;
      }
      const vendorWordCount = item.vendorName.trim().split(/\s+/).filter(Boolean).length;
      if (vendorWordCount > 100) {
        toast.error(`Vendor Name must be max 100 words for Expense #${i + 1}`);
        return;
      }
    }

    createMutation.mutate({
      projectId,
      expenses: items.map(item => ({
        purpose: item.purpose.trim(),
        amount: parseFloat(item.amount),
        amountType: item.amountType,
        paymentMode: item.paymentMode,
        refId: item.refId.trim(),
        remarks: item.remarks.trim() || undefined,
        vendorName: item.vendorName.trim() || undefined,
        invoiceNumber: item.invoiceNumber.trim() || undefined,
        gstNumber: item.gstNumber.trim() || undefined,
      }))
    });
  };

  const projects: Project[] = projectsData?.projects ?? [];

  return (
    <Modal open={open} onClose={onClose} title="New Expense" size="lg">
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
                      <span className="text-sm font-semibold text-forest-700">Expense #{idx + 1}</span>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          <option value="debit">Debit</option>
                          <option value="credit">Credit</option>
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
                <Plus className="h-4 w-4" /> Add Another Expense
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
          <Button type="submit" loading={createMutation.isPending}>Create Expenses</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

function DownloadExpensesReportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amountType, setAmountType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterProjectId, setFilterProjectId] = useState('all');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const { data: projectsData } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS],
    queryFn: () => projectsService.getAdminProjects({ limit: 100 }),
    enabled: open,
  });

  const projects: Project[] = projectsData?.projects ?? [];

  const handleDownloadPdf = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    setDownloadingPdf(true);
    try {
      const filters: any = {
        limit: 10000,
        startDate: startOfDay(new Date(startDate)).toISOString(),
        endDate: endOfDay(new Date(endDate)).toISOString(),
      };
      if (amountType !== 'all') {
        filters.amountType = amountType;
      }
      if (filterProjectId !== 'all') {
        filters.projectId = filterProjectId;
      }

      const response = await expensesService.getExpenses(filters);
      const expenses = response.expenses;

      if (expenses.length === 0) {
        toast.error('No expenses found for the selected filters');
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Payment Advice (Expenses) Report', 14, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Date Range: ${format(new Date(startDate), 'dd MMM yyyy')} to ${format(new Date(endDate), 'dd MMM yyyy')}`, 14, 25);
      doc.text(`Type: ${amountType.toUpperCase()}`, 14, 30);

      const projectLabel = filterProjectId === 'all'
        ? 'All Projects'
        : projects.find((p) => p._id === filterProjectId)?.projectTitle || 'Selected Project';
      doc.text(`Project: ${projectLabel}`, 14, 35);

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 38, 283, 38);

      const pdfAmount = (amount: number) => `Rs. ${amount.toLocaleString('en-IN')}`;

      const entryToRow = (e: any) => [
        e.expenseId,
        format(new Date(e.createdAt), 'dd MMM yyyy'),
        e.projectSnapshot?.projectTitle || '',
        e.purpose,
        pdfAmount(e.amount),
        e.amountType.toUpperCase(),
        e.paymentMode.toUpperCase(),
        e.refId,
        e.vendorName || '-',
        e.invoiceNumber || '-',
        e.gstNumber || '-',
      ];

      const tableHeaders = ['ID', 'Date', 'Project', 'Purpose', 'Amount (Rs.)', 'Type', 'Mode', 'Ref ID', 'Vendor', 'Invoice#', 'GST'];

      const totalCredit = expenses
        .filter((e: any) => e.amountType === 'credit')
        .reduce((acc: number, e: any) => acc + e.amount, 0);

      const totalDebit = expenses
        .filter((e: any) => e.amountType === 'debit')
        .reduce((acc: number, e: any) => acc + e.amount, 0);

      const netBalance = totalCredit - totalDebit;

      // Col styles
      const txColStyles = {
        0: { cellWidth: 18 }, // ID
        1: { cellWidth: 20 }, // Date
        2: { cellWidth: 32 }, // Project
        3: { cellWidth: 44 }, // Purpose
        4: { cellWidth: 26, halign: 'right' as const }, // Amount
        5: { cellWidth: 14 }, // Type
        6: { cellWidth: 16 }, // Mode
        7: { cellWidth: 24 }, // Ref ID
        8: { cellWidth: 22 }, // Vendor
        9: { cellWidth: 21 }, // Invoice#
        10: { cellWidth: 32 }, // GST
      };

      autoTable(doc, {
        startY: 42,
        head: [tableHeaders],
        body: expenses.map(entryToRow),
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [20, 83, 45], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: txColStyles,
        margin: { left: 14, right: 14 },
      });

      let y = (doc as any).lastAutoTable.finalY + 8;

      if (y > 175) {
        doc.addPage();
        y = 18;
      }

      // Summary Table
      autoTable(doc, {
        startY: y,
        head: [['Report Summary', '', '']],
        body: [
          ['Total Credits (Receipts)', pdfAmount(totalCredit), 'Total Debits (Payments)', pdfAmount(totalDebit)],
          ['Net Profit / Balance', `${netBalance >= 0 ? '+' : ''}${pdfAmount(netBalance)}`, '', ''],
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3, fontStyle: 'bold' },
        headStyles: { fillColor: [240, 240, 240], textColor: [30, 30, 30], fontStyle: 'bold', halign: 'center' },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 74.5, halign: 'right' },
          2: { cellWidth: 60 },
          3: { cellWidth: 74.5, halign: 'right' },
        },
        margin: { left: 14, right: 14 },
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(160, 160, 160);
        doc.text(`Balaji & Co - Payment Advice Report | Page ${i} of ${pageCount}`, 148, 200, { align: 'center' });
      }

      doc.save(`expenses-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success('PDF report downloaded successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF report');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    setDownloadingExcel(true);
    try {
      const filters: any = {
        limit: 10000,
        startDate: startOfDay(new Date(startDate)).toISOString(),
        endDate: endOfDay(new Date(endDate)).toISOString(),
      };
      if (amountType !== 'all') {
        filters.amountType = amountType;
      }
      if (filterProjectId !== 'all') {
        filters.projectId = filterProjectId;
      }

      const response = await expensesService.getExpenses(filters);
      const expenses = response.expenses;

      if (expenses.length === 0) {
        toast.error('No expenses found for the selected filters');
        return;
      }

      // Generate CSV
      const csvHeaders = [
        'Expense ID',
        'Date',
        'Project Title',
        'Company Name',
        'Purpose',
        'Amount',
        'Amount Type',
        'Payment Mode',
        'Ref ID',
        'Vendor Name',
        'Invoice Number',
        'GST Number',
        'Remarks'
      ];

      const csvRows = expenses.map((e: any) => [
        e.expenseId,
        format(new Date(e.createdAt), 'yyyy-MM-dd HH:mm'),
        `"${(e.projectSnapshot?.projectTitle || '').replace(/"/g, '""')}"`,
        `"${(e.projectSnapshot?.companyName || '').replace(/"/g, '""')}"`,
        `"${(e.purpose || '').replace(/"/g, '""')}"`,
        e.amount,
        e.amountType,
        e.paymentMode,
        `"${(e.refId || '').replace(/"/g, '""')}"`,
        `"${(e.vendorName || '').replace(/"/g, '""')}"`,
        `"${(e.invoiceNumber || '').replace(/"/g, '""')}"`,
        `"${(e.gstNumber || '').replace(/"/g, '""')}"`,
        `"${(e.remarks || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map((row: any) => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `expenses-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Excel (CSV) report downloaded successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate Excel report');
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Download Expenses Report">
      <div className="space-y-4">
        <Modal.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select
                value={amountType}
                onChange={(e) => setAmountType(e.target.value as 'all' | 'credit' | 'debit')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="all">All (Credits & Debits)</option>
                <option value="debit">Debits Only</option>
                <option value="credit">Credits Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Selection</label>
              <select
                value={filterProjectId}
                onChange={(e) => setFilterProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.projectTitle} — {p.companyName}</option>
                ))}
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadExcel}
              loading={downloadingExcel}
              disabled={downloadingPdf}
              variant="secondary"
              className="flex items-center gap-1.5"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-700" /> Export Excel
            </Button>
            <Button
              onClick={handleDownloadPdf}
              loading={downloadingPdf}
              disabled={downloadingExcel}
              className="flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
}
