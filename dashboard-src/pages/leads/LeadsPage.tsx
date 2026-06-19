import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Search, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { leadsService } from '@dashboard/services';
import { Lead } from '@dashboard/types';
import { QUERY_KEYS, REFETCH_INTERVALS } from '@dashboard/constants';
import { Badge, Button, Modal, ModalBody, ModalFooter, ConfirmDialog, EmptyState } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { ErrorState } from '@dashboard/components/ui/ErrorState';
import { Pagination } from '@dashboard/components/ui/Pagination';
import { useDebounce } from '@dashboard/hooks/useDebounce';

type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';

const statusBadge = (status: string) => {
  if (status === 'closed') return <Badge variant="gray">Closed</Badge>;
  if (status === 'contacted') return <Badge variant="green">Contacted</Badge>;
  return <Badge variant="yellow">New</Badge>;
};

const nextStatus = (current: string) => {
  if (current === 'new') return 'contacted';
  if (current === 'contacted') return 'closed';
  return 'new';
};

export function LeadsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesModal, setNotesModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [notes, setNotes] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.LEADS, debouncedSearch, statusFilter, page],
    queryFn: () =>
      leadsService.getLeads({
        search: debouncedSearch || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: 20,
      }),
    refetchInterval: REFETCH_INTERVALS.LEADS,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: 'new' | 'contacted' | 'closed'; notes?: string } }) =>
      leadsService.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEADS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_METRICS] });
      setNotesModal(false);
      setSelectedLead(null);
      toast.success('Lead updated');
    },
    onError: () => toast.error('Failed to update lead'),
  });

  const deleteMutation = useMutation({
    mutationFn: leadsService.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEADS] });
      setDeleteModal(false);
      setSelectedLead(null);
      toast.success('Lead deleted');
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  const openNotesModal = (lead: Lead) => {
    setSelectedLead(lead);
    setNotes(lead.notes || '');
    setNotesModal(true);
  };

  const openDeleteModal = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteModal(true);
  };

  const handleSave = () => {
    if (!selectedLead) return;
    updateMutation.mutate({
      id: selectedLead._id,
      data: { status: nextStatus(selectedLead.status) as 'new' | 'contacted' | 'closed', notes },
    });
  };

  const leads = data?.leads ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track all customer leads</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 focus:border-forest-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500 focus:border-forest-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
          <span className="flex items-center text-sm text-gray-500 px-2">
            {leads.length} lead{leads.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        {isError ? (
          <ErrorState message="Failed to load leads" onRetry={() => refetch()} />
        ) : isLoading ? (
          <SectionSpinner />
        ) : leads.length === 0 ? (
          <EmptyState icon={Search} title="No leads found" description="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Lead', 'Contact', 'Source', 'Date', 'Status', ''].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{lead.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="purple">{lead.formName ?? 'Unknown'}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">{statusBadge(lead.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openNotesModal(lead)} className="p-1.5 text-forest-600 hover:bg-forest-50 rounded-md" title="Edit / advance status">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => openDeleteModal(lead)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data && <Pagination page={page} total={data.total} limit={20} onPageChange={setPage} />}
      </div>

      {/* Notes / Status Modal */}
      <Modal open={notesModal} onClose={() => setNotesModal(false)} title="Update Lead">
        {selectedLead && (
          <>
            <ModalBody>
              <p className="text-sm text-gray-500 mb-4">
                {selectedLead.name} · {selectedLead.email}
              </p>
              <p className="text-xs font-medium text-gray-700 mb-1">
                Status will advance: <strong>{selectedLead.status}</strong> → <strong>{nextStatus(selectedLead.status)}</strong>
              </p>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  placeholder="Add notes about this lead..."
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setNotesModal(false)}>Cancel</Button>
              <Button onClick={handleSave} loading={updateMutation.isPending}>Save & Advance</Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={() => selectedLead && deleteMutation.mutate(selectedLead._id)}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead from ${selectedLead?.name}? This cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
