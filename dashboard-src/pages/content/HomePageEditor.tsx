import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, X, AlertCircle, Link2, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { contentService } from '@dashboard/services';
import { QUERY_KEYS } from '@dashboard/constants';
import { Button } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';

interface HomePageContent {
  hero: { headline: string; subheadline: string; ctaText: string; backgroundImageUrl?: string };
  whoWeHelp: { sectionLabel: string; title: string; description: string; ctaText: string; clientCards: Array<{ label: string; desc: string }> };
  servicesSection: { sectionLabel: string; heading: string; subtext: string; linkText: string };
  services: Array<{ order: string; title: string; description: string; features: string[]; imageUrl?: string }>;
  keyProjects: { sectionLabel: string; heading: string; description: string; ctaText: string };
  values: { sectionLabel: string; heading: string; sublabel: string; missionTitle: string; missionText: string; visionTitle: string; visionText: string; coreValues: string[] };
  achievements: { sectionLabel: string; heading: string; summaryText: string; ctaText: string; stats: Array<{ label: string; value: string }> };
  about: { sectionLabel: string; title: string; paragraphs: string[]; imageUrl?: string; stats: Array<{ value: string; label: string }>; certificationBadge: string; whyUs: string[] };
  faqs: { sectionLabel: string; heading: string; description: string; items: Array<{ question: string; answer: string }> };
  certifications: { sectionLabel: string; heading: string; description: string; items: Array<{ name: string; description: string }> };
  cta: { headline: string; subtext: string; ctaButton1: string; ctaButton2: string };
  footer: { companyName: string; companyDescription: string; address: string; email: string; phone: string; copyrightText: string; creditLine: string };
}

type SectionKey = keyof HomePageContent;

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'hero', label: 'Hero Section' },
  { key: 'whoWeHelp', label: 'Who We Help' },
  { key: 'services', label: 'Services' },
  { key: 'keyProjects', label: 'Key Projects' },
  { key: 'values', label: 'Our Values' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'about', label: 'About Us' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'cta', label: 'CTA Banner' },
  { key: 'footer', label: 'Footer' },
];

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500';

export function HomePageEditor() {
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PAGE_CONTENT_HOME],
    queryFn: contentService.getHomePage,
    retry: 2,
    staleTime: 0,
    refetchOnMount: true,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<HomePageContent>) => contentService.updateHomePage(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAGE_CONTENT_HOME] });
      const sectionLabel = SECTIONS.find((s) => Object.keys(variables)[0] === s.key)?.label ?? 'Section';
      toast.success(`${sectionLabel} saved successfully`);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : 'Failed to save. Please try again.';
      toast.error(message);
    },
  });

  const defaults: HomePageContent = {
    hero: { headline: '', subheadline: '', ctaText: '' },
    whoWeHelp: { sectionLabel: '', title: '', description: '', ctaText: '', clientCards: [] },
    servicesSection: { sectionLabel: '', heading: '', subtext: '', linkText: '' },
    services: [],
    keyProjects: { sectionLabel: '', heading: '', description: '', ctaText: '' },
    values: { sectionLabel: '', heading: '', sublabel: '', missionTitle: '', missionText: '', visionTitle: '', visionText: '', coreValues: [] },
    achievements: { sectionLabel: '', heading: '', summaryText: '', ctaText: '', stats: [] },
    about: { sectionLabel: '', title: '', paragraphs: [], stats: [], certificationBadge: '', whyUs: [] },
    faqs: { sectionLabel: '', heading: '', description: '', items: [] },
    certifications: { sectionLabel: '', heading: '', description: '', items: [] },
    cta: { headline: '', subtext: '', ctaButton1: '', ctaButton2: '' },
    footer: { companyName: '', companyDescription: '', address: '', email: '', phone: '', copyrightText: '', creditLine: '' },
  };

  const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting } } = useForm<HomePageContent>({
    defaultValues: defaults,
  });

  // Explicitly reset the form whenever fresh data arrives from the server.
  // This replaces RHF's `values` prop which uses deep comparison against the
  // *previous* values prop (not form state), causing stale fields to persist.
  useEffect(() => {
    if (data) {
      reset(data as HomePageContent);
    }
  }, [data, activeSection, reset]);

  const handleSectionChange = (key: SectionKey) => {
    setActiveSection(key);
    refetch();
  };

  const onSubmit = (formData: HomePageContent) => {
    updateMutation.mutate({ [activeSection]: formData[activeSection] });
  };

  const sectionInfo = SECTIONS.find((s) => s.key === activeSection)!;

  if (isLoading && !data) return <SectionSpinner />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-base font-semibold text-gray-800">Failed to load page content</p>
        <p className="text-sm text-gray-500">Check that the backend is running and try refreshing.</p>
        <Button size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAGE_CONTENT_HOME] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Home Page Editor</h1>
        <p className="text-sm text-gray-500 mt-1">Update your Home page content, one section at a time</p>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => handleSectionChange(s.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeSection === s.key
                  ? 'bg-forest-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {isFetching && (
          <p className="text-[11px] text-gray-400 mt-2 ml-1">Refreshing content…</p>
        )}
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
          <SectionEditor section={activeSection} register={register} watch={watch} setValue={setValue} />
        </form>
      </div>
    </div>
  );
}

// ── Reusable image upload field ──────────────────────────────────────────────
function CloudinaryUrlField({ label, value, onChange, hint }: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [draft, setDraft] = useState(value);
  const [previewError, setPreviewError] = useState(false);

  // Keep draft in sync when external value changes (e.g. section switch)
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

      {/* URL input row */}
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

      {/* Live preview */}
      {value && !previewError && (
        <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
          />
        </div>
      )}

      {/* Broken URL notice */}
      {value && previewError && (
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-sm">
          <ImageOff className="h-4 w-4 flex-shrink-0" />
          <span>Image could not be loaded. Check the Cloudinary URL and try again.</span>
        </div>
      )}

      {/* Helper tip */}
      {!value && (
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-forest-400"></span>
          Upload your image to Cloudinary, copy the public URL, and paste it above.
        </p>
      )}
    </div>
  );
}

function SectionEditor({ section, register, watch, setValue }: {
  section: SectionKey; register: any; watch: any; setValue: any;
}) {
  switch (section) {
    case 'hero':
      return (
        <div className="space-y-4">
          <Field label="Main Heading" register={register} name="hero.headline" placeholder="Powering India's Renewable Future" />
          <Field label="Subheading" register={register} name="hero.subheadline" textarea rows={3} placeholder="Supporting description below the heading" />
          <Field label="CTA Button Text" register={register} name="hero.ctaText" placeholder="Explore Solutions" />
          <CloudinaryUrlField
            label="Hero Background Image"
            value={watch('hero.backgroundImageUrl') || ''}
            onChange={(url) => setValue('hero.backgroundImageUrl', url)}
          />
        </div>
      );

    case 'whoWeHelp':
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Field label="Section Label" register={register} name="whoWeHelp.sectionLabel" placeholder="Who We Help" />
            <Field label="Heading" register={register} name="whoWeHelp.title" placeholder="Complete Wind & Solar Services" />
            <Field label="Description" register={register} name="whoWeHelp.description" textarea rows={3} />
            <Field label="CTA Button Text" register={register} name="whoWeHelp.ctaText" placeholder="Explore Services" />
          </div>
          <hr className="border-gray-100" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Client Type Cards (right panel)</h4>
            <p className="text-xs text-gray-400 mb-3">Each card shows a title and description. Icons cycle automatically.</p>
            <ClientCardsRepeater watch={watch} setValue={setValue} />
          </div>
        </div>
      );

    case 'services':
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Section Header</h4>
            <Field label="Section Label" register={register} name="servicesSection.sectionLabel" placeholder="Our Services" />
            <Field label="Heading" register={register} name="servicesSection.heading" placeholder="What We Do" />
            <Field label="Subtext" register={register} name="servicesSection.subtext" textarea rows={2} placeholder="End-to-end project delivery across every phase..." />
            <Field label="Service Link Text" register={register} name="servicesSection.linkText" placeholder="Learn more about this service" />
          </div>
          <hr className="border-gray-100" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Service Tabs</h4>
            <p className="text-xs text-gray-400 mb-3">Each tab has a title, description, and feature bullets. Icons cycle automatically (Wind → Solar → Settings → Document).</p>
            <ServicesFullEditor watch={watch} setValue={setValue} register={register} />
          </div>
        </div>
      );

    case 'keyProjects':
      return (
        <div className="space-y-4">
          <Field label="Section Label" register={register} name="keyProjects.sectionLabel" placeholder="Key Projects" />
          <Field label="Heading" register={register} name="keyProjects.heading" placeholder="Proven Renewable Energy Projects" />
          <Field label="Description" register={register} name="keyProjects.description" textarea rows={3} />
          <Field label="CTA Button Text" register={register} name="keyProjects.ctaText" placeholder="View All" />
          <p className="text-xs text-gray-400">Project cards are managed from the Showcase Projects page.</p>
        </div>
      );

    case 'values':
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Field label="Section Label (shown above heading on website)" register={register} name="values.sectionLabel" placeholder="About Us" />
            <Field label="Section Heading" register={register} name="values.heading" placeholder="Foundation of Our Guiding Principles" />
          </div>
          <hr className="border-gray-100" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Mission</h4>
            <div className="space-y-3">
              <Field label="Mission Title" register={register} name="values.missionTitle" />
              <Field label="Mission Description" register={register} name="values.missionText" textarea rows={3} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Vision</h4>
            <div className="space-y-3">
              <Field label="Vision Title" register={register} name="values.visionTitle" />
              <Field label="Vision Description" register={register} name="values.visionText" textarea rows={3} />
            </div>
          </div>
          <hr className="border-gray-100" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Core Values (pills shown below)</h4>
            <CoreValuesRepeater watch={watch} setValue={setValue} register={register} />
          </div>
        </div>
      );

    case 'achievements':
      return (
        <div className="space-y-4">
          <Field label="Section Label" register={register} name="achievements.sectionLabel" placeholder="Our Achievements" />
          <Field label="Heading" register={register} name="achievements.heading" placeholder="Reliable delivery backed by 2060 MW..." />
          <Field label="Description" register={register} name="achievements.summaryText" textarea rows={3} />
          <Field label="CTA Button Text" register={register} name="achievements.ctaText" placeholder="View All" />
          <AchievementStats watch={watch} setValue={setValue} register={register} />
        </div>
      );

    case 'about':
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <Field label="Section Label" register={register} name="about.sectionLabel" placeholder="About Us" />
            <Field label="Heading" register={register} name="about.title" placeholder="Proven expertise powering large wind..." />
          </div>

          <hr className="border-gray-100" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Paragraphs</h4>
            <ParagraphRepeater watch={watch} setValue={setValue} register={register} />
          </div>

          <hr className="border-gray-100" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Stat Cards (left panel)</h4>
            <p className="text-xs text-gray-400 mb-3">Shown when no image is uploaded. Cards cycle through green/amber colours automatically.</p>
            <AboutStatsRepeater watch={watch} setValue={setValue} />
          </div>

          <hr className="border-gray-100" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Certification Badge Text</h4>
            <Field label="Badge Text" register={register} name="about.certificationBadge" placeholder="ISO 9001 · ISO 14001 · OHSAS 18001" />
          </div>

          <hr className="border-gray-100" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Why Us Checklist</h4>
            <WhyUsRepeater watch={watch} setValue={setValue} />
          </div>

          <hr className="border-gray-100" />
          <CloudinaryUrlField
            label="About Section Image (replaces stat cards when set)"
            value={watch('about.imageUrl') || ''}
            onChange={(url) => setValue('about.imageUrl', url)}
          />
        </div>
      );

    case 'faqs':
      return (
        <div className="space-y-4">
          <Field label="Section Label" register={register} name="faqs.sectionLabel" placeholder="Help Center" />
          <Field label="Section Heading" register={register} name="faqs.heading" placeholder="Frequently Asked Questions" />
          <Field label="Section Description" register={register} name="faqs.description" textarea rows={2} />
          <hr className="border-gray-100" />
          <FAQRepeater watch={watch} setValue={setValue} register={register} />
        </div>
      );

    case 'certifications':
      return (
        <div className="space-y-4">
          <Field label="Section Label" register={register} name="certifications.sectionLabel" placeholder="Our Certifications" />
          <Field label="Section Heading" register={register} name="certifications.heading" placeholder="Accreditations & Standards" />
          <Field label="Section Description" register={register} name="certifications.description" textarea rows={2} />
          <hr className="border-gray-100" />
          <CertRepeater watch={watch} setValue={setValue} register={register} />
        </div>
      );

    case 'cta':
      return (
        <div className="space-y-4">
          <Field label="Heading" register={register} name="cta.headline" placeholder="Build Your Renewable Energy Project" />
          <Field label="Description" register={register} name="cta.subtext" textarea rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Button 1 Text" register={register} name="cta.ctaButton1" placeholder="Contact Us" />
            <Field label="Button 2 Text" register={register} name="cta.ctaButton2" placeholder="Explore Solutions" />
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="space-y-4">
          <Field label="Company Name" register={register} name="footer.companyName" placeholder="Balaji & Co." />
          <Field label="Company Description" register={register} name="footer.companyDescription" textarea rows={2} />
          <Field label="Address" register={register} name="footer.address" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" register={register} name="footer.email" />
            <Field label="Phone" register={register} name="footer.phone" />
          </div>
          <Field label="Copyright Text" register={register} name="footer.copyrightText" />
          <Field label="Credit Line" register={register} name="footer.creditLine" placeholder="Made with ... by Zerocodes.io" />
        </div>
      );

    default:
      return null;
  }
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


function AchievementStats({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const stats = watch('achievements.stats') || [];
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue('achievements.stats', [...stats, { label: '', value: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add Stat
      </button>
      {stats.map((_: unknown, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500">Stat {i + 1}</span>
            <button type="button" onClick={() => setValue('achievements.stats', stats.filter((_: unknown, j: number) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Value (e.g. 454 MW)" register={register} name={`achievements.stats.${i}.value`} />
            <Field label="Label (e.g. Karnataka)" register={register} name={`achievements.stats.${i}.label`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ParagraphRepeater({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const paragraphs = watch('about.paragraphs') || [];
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue('about.paragraphs', [...paragraphs, ''])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add Paragraph
      </button>
      {paragraphs.map((_: unknown, i: number) => (
        <div key={i} className="flex gap-2">
          <textarea {...register(`about.paragraphs.${i}`)} rows={3} className={`flex-1 ${inputCls}`} placeholder={`Paragraph ${i + 1}`} />
          <button type="button" onClick={() => setValue('about.paragraphs', paragraphs.filter((_: unknown, j: number) => j !== i))}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded self-start mt-1"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

function FAQRepeater({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const items = watch('faqs.items') || [];
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue('faqs.items', [...items, { question: '', answer: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add FAQ
      </button>
      {items.map((_: unknown, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">FAQ {i + 1}</span>
            <button type="button" onClick={() => setValue('faqs.items', items.filter((_: unknown, j: number) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <Field label="Question" register={register} name={`faqs.items.${i}.question`} />
          <Field label="Answer" register={register} name={`faqs.items.${i}.answer`} textarea rows={3} />
        </div>
      ))}
    </div>
  );
}

function CertRepeater({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const items = watch('certifications.items') || [];
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue('certifications.items', [...items, { name: '', description: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add Certification
      </button>
      {items.map((_: unknown, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Certification {i + 1}</span>
            <button type="button" onClick={() => setValue('certifications.items', items.filter((_: unknown, j: number) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <Field label="Certification Name" register={register} name={`certifications.items.${i}.name`} placeholder="ISO 9001:2015" />
          <Field label="Description" register={register} name={`certifications.items.${i}.description`} textarea rows={2} />
        </div>
      ))}
    </div>
  );
}

function CoreValuesRepeater({ watch, setValue }: { watch: any; setValue: any; register: any }) {
  const items: string[] = watch('values.coreValues') || [];
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setValue('values.coreValues', [...items, ''])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium"
      >
        <Plus className="h-4 w-4" /> Add Value
      </button>
      {items.map((_, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={items[i]}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = e.target.value;
              setValue('values.coreValues', updated);
            }}
            className={`flex-1 ${inputCls}`}
            placeholder="e.g. Integrity &amp; Transparency"
          />
          <button
            type="button"
            onClick={() => setValue('values.coreValues', items.filter((_, j) => j !== i))}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-gray-400">No values added yet. Defaults will be shown on the website.</p>
      )}
    </div>
  );
}

function AboutStatsRepeater({ watch, setValue }: { watch: any; setValue: any }) {
  const stats: Array<{ value: string; label: string }> = watch('about.stats') || [];
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setValue('about.stats', [...stats, { value: '', label: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium"
      >
        <Plus className="h-4 w-4" /> Add Stat
      </button>
      {stats.map((stat, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={stat.value}
            onChange={(e) => {
              const updated = stats.map((s, j) => j === i ? { ...s, value: e.target.value } : s);
              setValue('about.stats', updated);
            }}
            className={`w-28 flex-shrink-0 ${inputCls}`}
            placeholder="e.g. 150+"
          />
          <input
            value={stat.label}
            onChange={(e) => {
              const updated = stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s);
              setValue('about.stats', updated);
            }}
            className={`flex-1 ${inputCls}`}
            placeholder="e.g. Projects Delivered"
          />
          <button
            type="button"
            onClick={() => setValue('about.stats', stats.filter((_, j) => j !== i))}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      {stats.length === 0 && (
        <p className="text-xs text-gray-400">No stats added yet. Defaults will be shown on the website.</p>
      )}
    </div>
  );
}

function WhyUsRepeater({ watch, setValue }: { watch: any; setValue: any }) {
  const items: string[] = watch('about.whyUs') || [];
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setValue('about.whyUs', [...items, ''])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium"
      >
        <Plus className="h-4 w-4" /> Add Item
      </button>
      {items.map((_, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={items[i]}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = e.target.value;
              setValue('about.whyUs', updated);
            }}
            className={`flex-1 ${inputCls}`}
            placeholder="e.g. In-house engineering & design team"
          />
          <button
            type="button"
            onClick={() => setValue('about.whyUs', items.filter((_, j) => j !== i))}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-gray-400">No items added yet. Defaults will be shown on the website.</p>
      )}
    </div>
  );
}

function ClientCardsRepeater({ watch, setValue }: { watch: any; setValue: any }) {
  const cards: Array<{ label: string; desc: string }> = watch('whoWeHelp.clientCards') || [];
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setValue('whoWeHelp.clientCards', [...cards, { label: '', desc: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium"
      >
        <Plus className="h-4 w-4" /> Add Card
      </button>
      {cards.map((card, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Card {i + 1}</span>
            <button
              type="button"
              onClick={() => setValue('whoWeHelp.clientCards', cards.filter((_, j) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={card.label}
              onChange={(e) => {
                const updated = cards.map((c, j) => j === i ? { ...c, label: e.target.value } : c);
                setValue('whoWeHelp.clientCards', updated);
              }}
              className={inputCls}
              placeholder="e.g. IPPs & Developers"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              value={card.desc}
              onChange={(e) => {
                const updated = cards.map((c, j) => j === i ? { ...c, desc: e.target.value } : c);
                setValue('whoWeHelp.clientCards', updated);
              }}
              className={inputCls}
              placeholder="e.g. Independent power producers scaling renewable capacity"
            />
          </div>
        </div>
      ))}
      {cards.length === 0 && (
        <p className="text-xs text-gray-400">No cards added yet. Defaults will be shown on the website.</p>
      )}
    </div>
  );
}

function ServicesFullEditor({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const services: Array<{ order: string; title: string; description: string; features: string[]; imageUrl?: string }> = watch('services') || [];

  const addService = () => setValue('services', [...services, { order: '', title: '', description: '', features: [], imageUrl: '' }]);
  const removeService = (i: number) => setValue('services', services.filter((_, j) => j !== i));

  const addFeature = (i: number) => {
    const updated = services.map((s, j) => j === i ? { ...s, features: [...(s.features || []), ''] } : s);
    setValue('services', updated);
  };
  const removeFeature = (si: number, fi: number) => {
    const updated = services.map((s, j) => j === si ? { ...s, features: s.features.filter((_, k) => k !== fi) } : s);
    setValue('services', updated);
  };
  const updateFeature = (si: number, fi: number, val: string) => {
    const updated = services.map((s, j) => j === si ? { ...s, features: s.features.map((f, k) => k === fi ? val : f) } : s);
    setValue('services', updated);
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={addService}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add Service Tab
      </button>
      {services.map((svc, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Service {i + 1}</span>
            <button type="button" onClick={() => removeService(i)}
              className="p-1 text-red-500 hover:bg-red-50 rounded">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Order" register={register} name={`services.${i}.order`} placeholder="01" />
            <Field label="Title" register={register} name={`services.${i}.title`} placeholder="Wind Energy" />
          </div>
          <Field label="Description" register={register} name={`services.${i}.description`} textarea rows={2} placeholder="Full EPC solutions covering..." />
          <CloudinaryUrlField
            label="Tab Banner Image"
            value={svc.imageUrl || ''}
            onChange={(url) => {
              const updated = services.map((s, j) => j === i ? { ...s, imageUrl: url } : s);
              setValue('services', updated);
            }}
            hint="Optional. Shown in the banner area of this service tab. Recommended: wide landscape photo (1200×400px+)."
          />
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Feature Bullets</p>
            <div className="space-y-2">
              <button type="button" onClick={() => addFeature(i)}
                className="flex items-center gap-1.5 text-xs text-forest-600 hover:text-forest-700 font-medium">
                <Plus className="h-3.5 w-3.5" /> Add Feature
              </button>
              {(svc.features || []).map((feat, fi) => (
                <div key={fi} className="flex gap-2 items-center">
                  <input
                    value={feat}
                    onChange={(e) => updateFeature(i, fi, e.target.value)}
                    className={`flex-1 ${inputCls}`}
                    placeholder="e.g. Site feasibility & wind resource assessment"
                  />
                  <button type="button" onClick={() => removeFeature(i, fi)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded flex-shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {(svc.features || []).length === 0 && (
                <p className="text-xs text-gray-400">No features yet.</p>
              )}
            </div>
          </div>
        </div>
      ))}
      {services.length === 0 && (
        <p className="text-xs text-gray-400">No services yet. Defaults will be shown on the website.</p>
      )}
    </div>
  );
}
