import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Edit, Globe, Plus, Search, Trash2, Code } from 'lucide-react';
import { websitesService } from '@dashboard/services';
import { QUERY_KEYS } from '@dashboard/constants';
import { Website } from '@dashboard/types';
import { Badge, Button, ConfirmDialog, EmptyState, Input, Modal, ModalBody, ModalFooter } from '@dashboard/components/ui';

interface WebsiteForm {
  clientName: string;
  domain: string;
  siteType: 'framer' | 'react';
  cloudflareProjectId?: string;
}

export function WebsitesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'framer' | 'react'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Website | null>(null);
  const [deleting, setDeleting] = useState<Website | null>(null);
  const [form, setForm] = useState<WebsiteForm>({ clientName: '', domain: '', siteType: 'react', cloudflareProjectId: '' });

  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.WEBSITES, search, filter],
    queryFn: () => websitesService.getWebsites({ search: search || undefined, siteType: filter === 'all' ? undefined : filter }),
  });

  const createMutation = useMutation({
    mutationFn: websitesService.createWebsite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES] });
      setShowCreate(false);
      setForm({ clientName: '', domain: '', siteType: 'react', cloudflareProjectId: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Website> }) => websitesService.updateWebsite(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: websitesService.deleteWebsite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES] });
      setDeleting(null);
    },
  });

  const websites = data?.websites ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Websites</h1>
          <p className="text-sm text-gray-500 mt-1">Super Admin website registry</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Website
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search websites..." className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'framer' | 'react')} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="all">All Types</option>
          <option value="framer">Framer</option>
          <option value="react">React</option>
        </select>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-sm text-gray-500">Loading...</div>
        ) : websites.length === 0 ? (
          <EmptyState title="No websites found" description="Create one to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Website', 'Type', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {websites.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{w.clientName}</p>
                      <p className="text-xs text-gray-500">{w.domain}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={w.siteType === 'framer' ? 'purple' : 'blue'}>
                        {w.siteType === 'framer' ? <Globe className="h-3 w-3 mr-1" /> : <Code className="h-3 w-3 mr-1" />}
                        {w.siteType}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={w.isActive ? 'green' : 'red'}>{w.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {w.siteType === 'framer' && w.framerWebhookSecret && (
                          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" onClick={() => navigator.clipboard.writeText(w.framerWebhookSecret || '')}>
                            <Copy className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-forest-600 hover:bg-forest-50 rounded" onClick={() => setEditing(w)}><Edit className="h-4 w-4" /></button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" onClick={() => setDeleting(w)}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Website">
        <ModalBody className="space-y-3">
          <Input label="Client Name" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          <Input label="Domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Type</label>
            <select value={form.siteType} onChange={(e) => setForm({ ...form, siteType: e.target.value as 'framer' | 'react' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="react">React</option>
              <option value="framer">Framer</option>
            </select>
          </div>
          {form.siteType === 'react' && (
            <Input label="Cloudflare Project ID" value={form.cloudflareProjectId || ''} onChange={(e) => setForm({ ...form, cloudflareProjectId: e.target.value })} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button loading={createMutation.isPending} onClick={() => createMutation.mutate(form)}>Create</Button>
        </ModalFooter>
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Website">
        {editing && (
          <>
            <ModalBody className="space-y-3">
              <Input label="Client Name" value={editing.clientName} onChange={(e) => setEditing({ ...editing, clientName: e.target.value })} />
              <Input label="Domain" value={editing.domain} onChange={(e) => setEditing({ ...editing, domain: e.target.value })} />
              {editing.siteType === 'react' && (
                <Input label="Cloudflare Project ID" value={editing.cloudflareProjectId || ''} onChange={(e) => setEditing({ ...editing, cloudflareProjectId: e.target.value })} />
              )}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.isActive} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} /> Active
              </label>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              <Button loading={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: editing._id, data: editing })}>Save</Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting._id)}
        title="Delete Website"
        message={`Delete ${deleting?.clientName}? This cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
