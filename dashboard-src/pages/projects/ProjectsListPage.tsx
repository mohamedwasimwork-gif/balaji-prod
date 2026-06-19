import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, Plus, Edit, Trash2, Building2, Phone, Mail, MapPin, FolderKanban, Eye } from 'lucide-react';
import { projectsService } from '@dashboard/services';
import { Project } from '@dashboard/types';
import { QUERY_KEYS, ROUTES } from '@dashboard/constants';
import { Badge, Button, ConfirmDialog, EmptyState } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { ErrorState } from '@dashboard/components/ui/ErrorState';
import { Pagination } from '@dashboard/components/ui/Pagination';
import { useDebounce } from '@dashboard/hooks/useDebounce';
import { usePermissions } from '@dashboard/hooks/usePermissions';

const statusColor = (s: string) => {
  if (s === 'active') return 'green';
  if (s === 'draft') return 'yellow';
  return 'gray';
};

export function ProjectsListPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { canEdit, canDelete } = usePermissions();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECTS, debouncedSearch, statusFilter, page],
    queryFn: () =>
      projectsService.getAdminProjects({
        search: debouncedSearch || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: 20,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: projectsService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS] });
      setDeleteTarget(null);
      toast.success('Project deleted');
    },
    onError: () => toast.error('Failed to delete project'),
  });

  const projects = data?.projects ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your project portfolio</p>
        </div>
        <Button onClick={() => navigate(ROUTES.PROJECTS_NEW)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title, company, client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'draft' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
          <span className="flex items-center text-sm text-gray-500 px-2">{total} project{total !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {isError ? (
        <ErrorState message="Failed to load projects" onRetry={() => refetch()} />
      ) : isLoading ? (
        <SectionSpinner />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to get started."
          action={{ label: 'New Project', onClick: () => navigate(ROUTES.PROJECTS_NEW) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(ROUTES.PROJECT_DETAIL(project._id))}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-forest-700 truncate hover:underline">{project.projectTitle}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {project.companyName}
                    </p>
                  </div>
                  <Badge variant={statusColor(project.status) as any} className="ml-2 flex-shrink-0 capitalize">
                    {project.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-gray-500">
                  <p className="font-medium text-gray-700">{project.clientName}</p>
                  <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {project.phoneNumber}</p>
                  <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {project.email}</p>
                  {project.address && (
                    (() => {
                      const parts = [project.address.line1, project.address.city, project.address.state, project.address.pincode].filter(Boolean);
                      return parts.length > 0 ? (
                        <p className="flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{parts.join(', ')}</span>
                        </p>
                      ) : null;
                    })()
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate(ROUTES.PROJECT_DETAIL(project._id)); }}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  {canEdit && (
                    <Button variant="secondary" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate(ROUTES.PROJECT_EDIT(project._id)); }}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="danger" size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDeleteTarget(project); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && <Pagination page={page} total={data.total} limit={20} onPageChange={setPage} />}

      {canDelete && (
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
          title="Delete Project"
          message={`Are you sure you want to delete "${deleteTarget?.projectTitle}"? This cannot be undone.`}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
