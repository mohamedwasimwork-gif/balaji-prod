import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, X, Link2, ImageOff, LayoutGrid } from 'lucide-react';
import { showcaseService } from '@dashboard/services';
import { QUERY_KEYS, ROUTES } from '@dashboard/constants';
import { Button, Input } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';

const MAX_GALLERY = 4;

interface ShowcaseFormData {
  title: string;
  slug: string;
  client: string;
  location: string;
  category: string;
  projectDate: string;
  overview: string;
  imageUrl: string;
  images: string[];
  scopeOfWork: string[];
  keyHighlights: string[];
  status: 'draft' | 'published';
  isFeatured: boolean;
}

export function ShowcaseProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [coverPreviewError, setCoverPreviewError] = useState(false);
  const [galleryErrors, setGalleryErrors] = useState<boolean[]>([false, false, false, false]);

  const { data: project, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.SHOWCASE_PROJECT, id],
    queryFn: () => showcaseService.getProject(id!),
    enabled: isEditing,
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting, errors } } =
    useForm<ShowcaseFormData>({
      defaultValues: {
        title: '', slug: '', client: '', location: '', category: '',
        projectDate: '', overview: '', imageUrl: '', images: ['', '', '', ''],
        scopeOfWork: [], keyHighlights: [], status: 'published', isFeatured: false,
      },
    });

  useEffect(() => {
    if (project) {
      const existingImages = (project.images ?? []).slice(0, MAX_GALLERY);
      const paddedImages = [...existingImages, ...Array(MAX_GALLERY - existingImages.length).fill('')];
      reset({
        ...project,
        projectDate: project.projectDate
          ? new Date(project.projectDate).toISOString().split('T')[0]
          : '',
        scopeOfWork: project.scopeOfWork ?? [],
        keyHighlights: project.keyHighlights ?? [],
        images: paddedImages,
      });
    }
  }, [project, reset]);

  const title = watch('title');
  useEffect(() => {
    if (!isEditing && title) {
      setValue('slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title, isEditing, setValue]);

  const createMutation = useMutation({
    mutationFn: showcaseService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOWCASE_PROJECTS] });
      navigate(ROUTES.SHOWCASE_PROJECTS);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<ShowcaseFormData>) => showcaseService.updateProject(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOWCASE_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOWCASE_PROJECT, id] });
      navigate(ROUTES.SHOWCASE_PROJECTS);
    },
  });

  const onSubmit = (data: ShowcaseFormData) => {
    const payload: any = {
      ...data,
      images: data.images.filter(Boolean),
      projectDate: data.projectDate ? new Date(data.projectDate) : undefined,
    };
    if (isEditing) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  };

  const scopeOfWork   = watch('scopeOfWork')  ?? [];
  const keyHighlights = watch('keyHighlights') ?? [];
  const imageUrl      = watch('imageUrl');
  const galleryImages = watch('images') ?? ['', '', '', ''];

  const setGalleryError = (i: number, val: boolean) => {
    setGalleryErrors((prev) => { const next = [...prev]; next[i] = val; return next; });
  };

  if (isLoading && isEditing) return <SectionSpinner />;

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(ROUTES.SHOWCASE_PROJECTS)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Showcase Project' : 'New Showcase Project'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isEditing ? 'Update project details' : 'Create a new showcase project'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
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
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />
            </div>
            <div className="md:col-span-2">
              <Input label="Slug" hint="Auto-generated from title" {...register('slug')} />
            </div>
            <Input label="Client" {...register('client')} />
            <Input label="Location" {...register('location')} />
            <Input label="Category" placeholder="e.g. Wind Power, Solar Power" {...register('category')} />
            <Input label="Project Date" type="date" {...register('projectDate')} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Content</h2>
          <div className="space-y-6">
            {/* Overview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Overview</label>
              <textarea
                rows={4}
                {...register('overview')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Project Cover Image</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register('imageUrl')}
                    type="url"
                    onChange={(e) => { setValue('imageUrl', e.target.value); setCoverPreviewError(false); }}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
                {imageUrl && (
                  <button type="button" onClick={() => { setValue('imageUrl', ''); setCoverPreviewError(false); }}
                    className="px-3 py-2 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
                    <X className="h-3.5 w-3.5" /> Clear
                  </button>
                )}
              </div>
              {imageUrl && !coverPreviewError && (
                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={imageUrl} alt="Cover preview" className="w-full h-full object-cover" onError={() => setCoverPreviewError(true)} />
                </div>
              )}
              {imageUrl && coverPreviewError && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-md">
                  <ImageOff className="h-4 w-4 flex-shrink-0" />
                  <span>Image could not be loaded. Check the URL and try again.</span>
                </div>
              )}
              {!imageUrl && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-forest-400 flex-shrink-0" />
                  Upload to Cloudinary, copy the public URL, and paste above. Displayed as hero image on the project page.
                </p>
              )}
            </div>

            {/* Gallery Images — up to 4 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-gray-500" />
                <label className="block text-sm font-medium text-gray-700">Project Gallery (up to {MAX_GALLERY} photos)</label>
              </div>
              <p className="text-xs text-gray-400">These appear in a grid on the project detail page. Leave slots empty to skip them.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: MAX_GALLERY }).map((_, i) => {
                  const url = galleryImages[i] ?? '';
                  const hasError = galleryErrors[i];
                  return (
                    <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">Photo {i + 1}</span>
                        {url && (
                          <button type="button"
                            onClick={() => { setValue(`images.${i}`, ''); setGalleryError(i, false); }}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          {...register(`images.${i}`)}
                          type="url"
                          onChange={(e) => { setValue(`images.${i}`, e.target.value); setGalleryError(i, false); }}
                          placeholder="https://res.cloudinary.com/..."
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-forest-500 bg-white"
                        />
                      </div>

                      {url && !hasError && (
                        <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-100" style={{ aspectRatio: '16/10' }}>
                          <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" onError={() => setGalleryError(i, true)} />
                        </div>
                      )}

                      {url && hasError && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                          <ImageOff className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>Could not load this image.</span>
                        </div>
                      )}

                      {!url && (
                        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white text-gray-300" style={{ aspectRatio: '16/10' }}>
                          <span className="text-xs">Empty slot</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scope of Work */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scope of Work</label>
              {scopeOfWork.map((_: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    {...register(`scopeOfWork.${i}`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                  <button type="button" onClick={() => setValue('scopeOfWork', scopeOfWork.filter((_: string, j: number) => j !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setValue('scopeOfWork', [...scopeOfWork, ''])} className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 mt-1">
                <Plus className="h-4 w-4" /> Add Item
              </button>
            </div>

            {/* Key Highlights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Highlights</label>
              {keyHighlights.map((_: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    {...register(`keyHighlights.${i}`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                  <button type="button" onClick={() => setValue('keyHighlights', keyHighlights.filter((_: string, j: number) => j !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setValue('keyHighlights', [...keyHighlights, ''])} className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 mt-1">
                <Plus className="h-4 w-4" /> Add Highlight
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 text-forest-600 rounded border-gray-300" />
              <span className="text-sm text-gray-700">Featured Project</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
