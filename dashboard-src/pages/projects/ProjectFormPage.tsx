import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, ArrowLeft } from 'lucide-react';
import { projectsService } from '@dashboard/services';
import { QUERY_KEYS, ROUTES } from '@dashboard/constants';
import { Button, Input } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { usePermissions } from '@dashboard/hooks/usePermissions';

interface ProjectFormData {
  projectTitle: string;
  companyName: string;
  clientName: string;
  phoneNumber: string;
  email: string;
  gstNumber: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  status: 'active' | 'draft' | 'inactive';
}

export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { canEdit, loading: authLoading } = usePermissions();
  const isEditing = !!id;

  // All hooks must be called unconditionally before any early returns
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PROJECT, id],
    queryFn: () => projectsService.getAdminProject(id!),
    enabled: isEditing,
  });

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } =
    useForm<ProjectFormData>({
      defaultValues: {
        projectTitle: '', companyName: '', clientName: '', phoneNumber: '', email: '', gstNumber: '',
        address: { line1: '', line2: '', city: '', state: '', pincode: '', country: 'India' },
        status: 'active',
      },
    });

  useEffect(() => {
    if (project) {
      reset({
        projectTitle: project.projectTitle,
        companyName: project.companyName,
        clientName: project.clientName,
        phoneNumber: project.phoneNumber,
        email: project.email,
        gstNumber: project.gstNumber || '',
        address: {
          line1: project.address?.line1 || '',
          line2: project.address?.line2 || '',
          city: project.address?.city || '',
          state: project.address?.state || '',
          pincode: project.address?.pincode || '',
          country: project.address?.country || 'India',
        },
        status: project.status,
      });
    }
  }, [project, reset]);

  const createMutation = useMutation({
    mutationFn: projectsService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS] });
      toast.success('Project created');
      navigate(ROUTES.PROJECTS);
    },
    onError: () => toast.error('Failed to create project'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProjectFormData>) => projectsService.updateProject(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PROJECT, id] });
      toast.success('Project updated');
      navigate(ROUTES.PROJECTS);
    },
    onError: () => toast.error('Failed to update project'),
  });

  const onSubmit = (data: ProjectFormData) => {
    if (isEditing) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  // Guard conditions after all hooks — wait for auth to resolve before redirecting
  if (authLoading) return <SectionSpinner />;
  if (isEditing && !canEdit) return <Navigate to={ROUTES.PROJECTS} replace />;
  if (projectLoading && isEditing) return <SectionSpinner />;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(ROUTES.PROJECTS)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Project' : 'New Project'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isEditing ? 'Update project details' : 'Create a new project'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Project Information</h2>
            <Button type="submit" loading={isSaving} size="sm">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Project'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Project Title *"
                error={errors.projectTitle?.message}
                {...register('projectTitle', { required: 'Project title is required' })}
              />
            </div>
            <Input
              label="Company Name *"
              error={errors.companyName?.message}
              {...register('companyName', { required: 'Company name is required' })}
            />
            <Input
              label="Client Name *"
              error={errors.clientName?.message}
              {...register('clientName', { required: 'Client name is required' })}
            />
            <Input
              label="Phone Number *"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber', { required: 'Phone number is required' })}
            />
            <Input
              label="Email *"
              type="email"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Company GST Number"
              placeholder="e.g. 33AABCU9603R1ZM"
              {...register('gstNumber')}
            />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Client Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input label="Address Line 1" {...register('address.line1')} />
            </div>
            <div className="md:col-span-2">
              <Input label="Address Line 2" {...register('address.line2')} />
            </div>
            <Input label="City" {...register('address.city')} />
            <Input label="State" {...register('address.state')} />
            <Input label="Pincode" {...register('address.pincode')} />
            <Input label="Country" {...register('address.country')} />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
