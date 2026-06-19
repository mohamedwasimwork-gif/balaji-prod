import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, Star, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showcaseService } from '@dashboard/services';
import { QUERY_KEYS, ROUTES } from '@dashboard/constants';
import { ShowcaseProject } from '@dashboard/types';
import { Badge, Button, ConfirmDialog, EmptyState } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';

export function ShowcaseProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<ShowcaseProject | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.SHOWCASE_PROJECTS, search, statusFilter],
    queryFn: () => showcaseService.getProjects({
      search: search || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: 50,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: showcaseService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOWCASE_PROJECTS] });
      setDeleteTarget(null);
    },
  });

  const projects = data?.projects ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Showcase Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage website portfolio projects</p>
        </div>
        <Button onClick={() => navigate(ROUTES.SHOWCASE_PROJECTS_NEW)}>
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <SectionSpinner />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No showcase projects"
          description="Create your first showcase project for the website portfolio."
          action={{ label: 'New Project', onClick: () => navigate(ROUTES.SHOWCASE_PROJECTS_NEW) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <div key={project._id} className="bg-white shadow-sm rounded-xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{project.title}</h3>
                    {project.isFeatured && <Star className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{project.slug}</p>
                </div>
                <Badge variant={project.status === 'published' ? 'green' : 'yellow'} className="capitalize text-xs ml-2">
                  {project.status}
                </Badge>
              </div>

              {project.category && (
                <span className="inline-block px-2 py-0.5 bg-forest-50 text-forest-700 text-xs rounded-md font-medium">
                  {project.category}
                </span>
              )}

              <div className="space-y-1 text-xs text-gray-500">
                {project.client && <p>Client: {project.client}</p>}
                {project.location && (
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {project.location}</p>
                )}
                {project.projectDate && (
                  <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(project.projectDate).toLocaleDateString()}</p>
                )}
              </div>

              {project.overview && (
                <p className="text-xs text-gray-600 line-clamp-2">{project.overview}</p>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => navigate(ROUTES.SHOWCASE_PROJECT_EDIT(project._id))}
                  className="flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700 font-medium"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
        title="Delete Showcase Project"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
