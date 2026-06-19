import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, X, Link2, ImageOff } from 'lucide-react';
import { contentService } from '@dashboard/services';
import { QUERY_KEYS } from '@dashboard/constants';
import { Button } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';

interface SolutionsPageContent {
  solutionsHero: { sectionLabel: string; headline: string; subheadline: string; backgroundImageUrl?: string };
  solutionsIntroServices: Array<{ title: string; description: string }>;
  coreServices: {
    sectionLabel: string; heading: string; description: string;
    windSolutions: { title: string; description: string; points: string[] };
    solarSolutions: { title: string; description: string; points: string[] };
  };
  impactStats: {
    sectionLabel: string;
    heading: string;
    description: string;
    items: Array<{ value: string; label: string }>;
  };
  founderNote: { sectionLabel: string; quote: string; name: string; designation: string; backgroundImageUrl: string };
  solutionsAchievements: {
    sectionLabel: string; heading: string; description: string; ctaText: string; ctaLink: string;
    items: Array<{ title: string; description: string }>;
  };
  solutionsWorkflow: {
    sectionLabel: string; heading: string; ctaText: string; ctaLink: string;
    steps: Array<{ order: string; title: string; description: string }>;
  };
  solutionsCTA: { headline: string; subtext: string; ctaButton1: string; ctaButton1Link: string; ctaButton2: string; ctaButton2Link: string };
}

type SectionKey = keyof SolutionsPageContent;

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'solutionsHero', label: 'Hero' },
  { key: 'solutionsIntroServices', label: 'Service Cards' },
  { key: 'coreServices', label: 'Core Services' },
  { key: 'impactStats', label: 'Impact Stats' },
  { key: 'founderNote', label: "Founder's Note" },
  { key: 'solutionsAchievements', label: 'Achievements' },
  { key: 'solutionsWorkflow', label: 'How We Deliver' },
  { key: 'solutionsCTA', label: 'CTA Banner' },
];

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500';

export function SolutionsPageEditor() {
  const [activeSection, setActiveSection] = useState<SectionKey>('solutionsHero');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PAGE_CONTENT_SOLUTIONS],
    queryFn: contentService.getSolutionsPage,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<SolutionsPageContent>) => contentService.updateSolutionsPage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAGE_CONTENT_SOLUTIONS] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const defaults: SolutionsPageContent = {
    solutionsHero: { sectionLabel: '', headline: '', subheadline: '', backgroundImageUrl: '' },
    solutionsIntroServices: [],
    coreServices: { sectionLabel: '', heading: '', description: '', windSolutions: { title: '', description: '', points: [] }, solarSolutions: { title: '', description: '', points: [] } },
    impactStats: { sectionLabel: '', heading: '', description: '', items: [] },
    founderNote: { sectionLabel: '', quote: '', name: '', designation: '', backgroundImageUrl: '' },
    solutionsAchievements: { sectionLabel: '', heading: '', description: '', ctaText: '', ctaLink: '/contact', items: [] },
    solutionsWorkflow: { sectionLabel: '', heading: '', ctaText: '', ctaLink: '/contact', steps: [] },
    solutionsCTA: { headline: '', subtext: '', ctaButton1: '', ctaButton1Link: '/contact', ctaButton2: '', ctaButton2Link: '/' },
  };

  const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting } } = useForm<SolutionsPageContent>({
    defaultValues: data || defaults,
    values: data,
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, activeSection, reset]);

  const onSubmit = (formData: SolutionsPageContent) => {
    updateMutation.mutate({ [activeSection]: formData[activeSection] });
  };

  const sectionInfo = SECTIONS.find((s) => s.key === activeSection)!;

  if (isLoading) return <SectionSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solutions Page Editor</h1>
        <p className="text-sm text-gray-500 mt-1">Update your Solutions page content, one section at a time</p>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          {sectionInfo.label} saved successfully!
        </div>
      )}

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeSection === s.key ? 'bg-forest-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">{sectionInfo.label}</h2>
          <Button size="sm" loading={isSubmitting || updateMutation.isPending} onClick={handleSubmit(onSubmit)}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting || updateMutation.isPending ? 'Saving...' : `Save ${sectionInfo.label}`}
          </Button>
        </div>

        <form key={activeSection} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {activeSection === 'solutionsHero' && (
            <div className="space-y-4">
              <Field label="Section Label" register={register} name="solutionsHero.sectionLabel" placeholder="Our Solutions" />
              <Field label="Main Heading" register={register} name="solutionsHero.headline" placeholder="End-to-End Solutions for Wind & Solar Projects" />
              <Field label="Description" register={register} name="solutionsHero.subheadline" textarea rows={3} />
              <CloudinaryUrlField
                label="Hero Background Image"
                value={watch('solutionsHero.backgroundImageUrl') || ''}
                onChange={(url) => setValue('solutionsHero.backgroundImageUrl', url)}
                hint="Optional. When set, this image fills the Solutions hero behind the heading with a 20% dark overlay."
              />
            </div>
          )}

          {activeSection === 'solutionsIntroServices' && (
            <Repeater fieldName="solutionsIntroServices" watch={watch} setValue={setValue} register={register}
              fields={['title', 'description']} labels={['Card Title', 'Description']} addLabel="Add Service Card" textareaFields={['description']} />
          )}

          {activeSection === 'coreServices' && (
            <div className="space-y-6">
              <Field label="Section Label" register={register} name="coreServices.sectionLabel" placeholder="Core Services" />
              <Field label="Heading" register={register} name="coreServices.heading" placeholder="Building Reliable Wind and Solar Infrastructure" />
              <Field label="Description" register={register} name="coreServices.description" textarea rows={2} />
              <hr className="border-gray-100" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Wind Solutions</h4>
                <div className="space-y-3">
                  <Field label="Title" register={register} name="coreServices.windSolutions.title" placeholder="Wind Solutions" />
                  <Field label="Description" register={register} name="coreServices.windSolutions.description" textarea rows={2} />
                  <PointsRepeater path="coreServices.windSolutions.points" watch={watch} setValue={setValue} register={register} label="Wind Bullet Point" />
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Solar Solutions</h4>
                <div className="space-y-3">
                  <Field label="Title" register={register} name="coreServices.solarSolutions.title" placeholder="Solar Solutions" />
                  <Field label="Description" register={register} name="coreServices.solarSolutions.description" textarea rows={2} />
                  <PointsRepeater path="coreServices.solarSolutions.points" watch={watch} setValue={setValue} register={register} label="Solar Bullet Point" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'impactStats' && (
            <div className="space-y-4">
              <Field label="Section Label" register={register} name="impactStats.sectionLabel" placeholder="Our Impact" />
              <Field label="Section Heading" register={register} name="impactStats.heading" placeholder="Real Results for Real Projects" />
              <Field label="Description" register={register} name="impactStats.description" textarea rows={2} placeholder="Numbers that reflect our commitment to performance." />
              <hr className="border-gray-100" />
              <Repeater fieldName="impactStats.items" watch={watch} setValue={setValue} register={register}
                fields={['value', 'label']} labels={['Value (e.g. 65%)', 'Label (e.g. Reduction in Electricity Costs)']} addLabel="Add Stat" />
            </div>
          )}

          {activeSection === 'founderNote' && (
            <div className="space-y-4">
              <Field label="Section Label" register={register} name="founderNote.sectionLabel" placeholder="Founder's Note" />
              <Field label="Quote" register={register} name="founderNote.quote" textarea rows={4} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" register={register} name="founderNote.name" placeholder="Balaji" />
                <Field label="Title" register={register} name="founderNote.designation" placeholder="Founder & Director" />
              </div>
              <hr className="border-gray-100" />
              <CloudinaryUrlField
                label="Background Image URL (optional)"
                value={watch('founderNote.backgroundImageUrl') || ''}
                onChange={(url) => setValue('founderNote.backgroundImageUrl', url)}
                hint="Paste a Cloudinary URL to display as the section background. A dark overlay will be applied automatically so the text remains readable."
              />
            </div>
          )}

          {activeSection === 'solutionsAchievements' && (
            <div className="space-y-4">
              <Field label="Section Label" register={register} name="solutionsAchievements.sectionLabel" placeholder="Our Values" />
              <Field label="Heading" register={register} name="solutionsAchievements.heading" placeholder="Our achievements & strength" />
              <Field label="Description" register={register} name="solutionsAchievements.description" textarea rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="CTA Button Text" register={register} name="solutionsAchievements.ctaText" placeholder="Contact Us" />
                <Field label="CTA Button Link" register={register} name="solutionsAchievements.ctaLink" placeholder="/contact" />
              </div>
              <hr className="border-gray-100" />
              <AchievementRepeater watch={watch} setValue={setValue} register={register} />
            </div>
          )}

          {activeSection === 'solutionsWorkflow' && (
            <div className="space-y-4">
              <Field label="Section Label" register={register} name="solutionsWorkflow.sectionLabel" placeholder="How We Work" />
              <Field label="Section Heading" register={register} name="solutionsWorkflow.heading" placeholder="How We Deliver Every Project" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="CTA Button Text" register={register} name="solutionsWorkflow.ctaText" placeholder="Contact Us" />
                <Field label="CTA Button Link" register={register} name="solutionsWorkflow.ctaLink" placeholder="/contact" />
              </div>
              <hr className="border-gray-100" />
              <WorkflowSteps watch={watch} setValue={setValue} register={register} />
            </div>
          )}

          {activeSection === 'solutionsCTA' && (
            <div className="space-y-4">
              <Field label="Heading" register={register} name="solutionsCTA.headline" placeholder="Build Your Renewable Energy Project" />
              <Field label="Description" register={register} name="solutionsCTA.subtext" textarea rows={2} />
              <hr className="border-gray-100" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Button 1 Text" register={register} name="solutionsCTA.ctaButton1" placeholder="Contact Us" />
                <Field label="Button 1 Link" register={register} name="solutionsCTA.ctaButton1Link" placeholder="/contact" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Button 2 Text" register={register} name="solutionsCTA.ctaButton2" placeholder="Learn About Us" />
                <Field label="Button 2 Link" register={register} name="solutionsCTA.ctaButton2Link" placeholder="/" />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function CloudinaryUrlField({ label, value, onChange, hint }: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [draft, setDraft] = useState(value);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    setDraft(value);
    setPreviewError(false);
  }, [value]);

  const handleCommit = () => {
    onChange(draft.trim());
    setPreviewError(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="url"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCommit())}
            placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
        </div>
        {value && (
          <button
            type="button"
            onClick={() => { setDraft(''); onChange(''); setPreviewError(false); }}
            className="px-3 py-2 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {value && !previewError && (
        <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={() => setPreviewError(true)} />
        </div>
      )}
      {value && previewError && (
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-sm">
          <ImageOff className="h-4 w-4 flex-shrink-0" />
          <span>Image could not be loaded. Check the Cloudinary URL and try again.</span>
        </div>
      )}
      {!value && (
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-forest-400"></span>
          Upload your image to Cloudinary, copy the public URL, and paste it above.
        </p>
      )}
    </div>
  );
}

function Field({ label, register, name, placeholder, textarea, rows }: {
  label: string; register: any; name: string; placeholder?: string; textarea?: boolean; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {textarea ? (
        <textarea {...register(name)} rows={rows || 3} className={inputCls} placeholder={placeholder} />
      ) : (
        <input {...register(name)} className={inputCls} placeholder={placeholder} />
      )}
    </div>
  );
}

function Repeater({ fieldName, watch, setValue, register, fields, labels, addLabel, textareaFields = [] }: {
  fieldName: string; watch: any; setValue: any; register: any;
  fields: string[]; labels: string[]; addLabel: string; textareaFields?: string[];
}) {
  const items = watch(fieldName) || [];
  const defaultItem = fields.reduce((acc, f) => ({ ...acc, [f]: '' }), {} as Record<string, string>);
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue(fieldName, [...items, defaultItem])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
      {items.map((_: unknown, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Item {i + 1}</span>
            <button type="button" onClick={() => setValue(fieldName, items.filter((_: unknown, j: number) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          {fields.map((f, fi) => (
            <div key={f}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{labels[fi]}</label>
              {textareaFields.includes(f) ? (
                <textarea {...register(`${fieldName}.${i}.${f}`)} rows={2} className={inputCls} />
              ) : (
                <input {...register(`${fieldName}.${i}.${f}`)} className={inputCls} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PointsRepeater({ path, watch, setValue, register, label }: {
  path: string; watch: any; setValue: any; register: any; label: string;
}) {
  const points = watch(path) || [];
  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setValue(path, [...points, ''])}
        className="flex items-center gap-1.5 text-xs text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-3.5 w-3.5" /> Add {label}
      </button>
      {points.map((_: unknown, i: number) => (
        <div key={i} className="flex gap-2">
          <input {...register(`${path}.${i}`)} className={`flex-1 ${inputCls}`} placeholder={`${label} ${i + 1}`} />
          <button type="button" onClick={() => setValue(path, points.filter((_: unknown, j: number) => j !== i))}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

function AchievementRepeater({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const items = watch('solutionsAchievements.items') || [];
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue('solutionsAchievements.items', [...items, { title: '', description: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add Achievement
      </button>
      {items.map((_: unknown, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Achievement {i + 1}</span>
            <button type="button" onClick={() => setValue('solutionsAchievements.items', items.filter((_: unknown, j: number) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <Field label="Title" register={register} name={`solutionsAchievements.items.${i}.title`} />
          <Field label="Description" register={register} name={`solutionsAchievements.items.${i}.description`} textarea rows={2} />
        </div>
      ))}
    </div>
  );
}

function WorkflowSteps({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const steps = watch('solutionsWorkflow.steps') || [];
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue('solutionsWorkflow.steps', [...steps, { order: '', title: '', description: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add Step
      </button>
      {steps.map((_: unknown, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Step {i + 1}</span>
            <button type="button" onClick={() => setValue('solutionsWorkflow.steps', steps.filter((_: unknown, j: number) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Number" register={register} name={`solutionsWorkflow.steps.${i}.order`} placeholder="01" />
            <div className="col-span-3"><Field label="Title" register={register} name={`solutionsWorkflow.steps.${i}.title`} /></div>
          </div>
          <Field label="Description" register={register} name={`solutionsWorkflow.steps.${i}.description`} textarea rows={2} />
        </div>
      ))}
    </div>
  );
}
