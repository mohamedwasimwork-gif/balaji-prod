import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Link2, X, ImageOff, CheckCircle } from 'lucide-react';
import { contentService } from '@dashboard/services';
import { QUERY_KEYS } from '@dashboard/constants';
import { Button } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';

interface ProjectsPageContent {
  projectsHero: {
    heading: string;
    subheading: string;
    backgroundImageUrl: string;
  };
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500';

export function ProjectsPageEditor() {
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  const defaults: ProjectsPageContent = {
    projectsHero: { heading: 'Our Projects', subheading: 'A selection of Wind & Solar EPC projects delivered across India.', backgroundImageUrl: '' },
  };

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PAGE_CONTENT_PROJECTS],
    queryFn: contentService.getProjectsPage,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<ProjectsPageContent>) => contentService.updateProjectsPage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAGE_CONTENT_PROJECTS] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<ProjectsPageContent>({
    defaultValues: data || defaults,
    values: data,
  });

  const bgUrl = watch('projectsHero.backgroundImageUrl');
  const isSaving = isSubmitting || updateMutation.isPending;

  const onSubmit = (formData: ProjectsPageContent) => {
    updateMutation.mutate({ projectsHero: formData.projectsHero });
  };

  if (isLoading) return <SectionSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects Page</h1>
          <p className="text-sm text-gray-500 mt-0.5">Edit the hero section for the public Projects listing page.</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <CheckCircle className="h-4 w-4" /> Saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Hero Section</h2>
            <Button type="submit" loading={isSaving} size="sm">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>

          <div className="space-y-4">
            {/* Heading */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Heading</label>
              <input {...register('projectsHero.heading')} className={inputCls} placeholder="Our Projects" />
            </div>

            {/* Subheading */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
              <input {...register('projectsHero.subheading')} className={inputCls} placeholder="A selection of Wind & Solar EPC projects..." />
            </div>

            {/* Background Image */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Hero Background Image</label>
              <p className="text-xs text-gray-400">When set, this image appears behind the hero heading. Paste a Cloudinary or any public HTTPS image URL.</p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register('projectsHero.backgroundImageUrl')}
                    type="url"
                    onChange={(e) => { setValue('projectsHero.backgroundImageUrl', e.target.value); setImgError(false); }}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
                {bgUrl && (
                  <button
                    type="button"
                    onClick={() => { setValue('projectsHero.backgroundImageUrl', ''); setImgError(false); }}
                    className="px-3 py-2 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" /> Clear
                  </button>
                )}
              </div>

              {/* Live preview */}
              {bgUrl && !imgError && (
                <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ aspectRatio: '16/5' }}>
                  <img
                    src={bgUrl}
                    alt="Hero background preview"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                  {/* Simulate the overlay */}
                  <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
                    <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">Projects</p>
                    <p className="text-2xl font-bold text-white drop-shadow-lg">{watch('projectsHero.heading') || 'Our Projects'}</p>
                    <p className="text-sm text-white/80 mt-1">{watch('projectsHero.subheading') || ''}</p>
                  </div>
                </div>
              )}

              {bgUrl && imgError && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <ImageOff className="h-4 w-4 flex-shrink-0" />
                  <span>Image could not be loaded. Check the URL and try again.</span>
                </div>
              )}

              {!bgUrl && (
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 text-sm" style={{ aspectRatio: '16/5' }}>
                  No background image — hero will show solid dark green
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
