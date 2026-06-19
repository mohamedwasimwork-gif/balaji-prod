import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, ExternalLink, Link2, ImageOff, X } from 'lucide-react';
import { contentService } from '@dashboard/services';
import { QUERY_KEYS } from '@dashboard/constants';
import { Button } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';

interface ContactPageContent {
  contactHero: { sectionLabel: string; headline: string; subheadline: string; backgroundImageUrl?: string };
  contactInfoCards: Array<{ title: string; email: string; description: string }>;
  contactLocation: { address: string; label: string };
  contactFAQs: { sectionLabel: string; heading: string; description: string; items: Array<{ question: string; answer: string }> };
  contactCTA: { prefixLabel: string; headline: string; subtext: string; ctaButton1: string; ctaButton2: string };
}

type SectionKey = keyof ContactPageContent;

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'contactHero', label: 'Contact Hero' },
  { key: 'contactInfoCards', label: 'Contact Information' },
  { key: 'contactLocation', label: 'Location / Map' },
  { key: 'contactFAQs', label: 'Frequently Asked Questions' },
  { key: 'contactCTA', label: 'CTA Banner' },
];

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500';

export function ContactPageEditor() {
  const [activeSection, setActiveSection] = useState<SectionKey>('contactHero');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PAGE_CONTENT_CONTACT],
    queryFn: contentService.getContactPage,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<ContactPageContent>) => contentService.updateContactPage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAGE_CONTENT_CONTACT] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const defaults: ContactPageContent = {
    contactHero: { sectionLabel: '', headline: '', subheadline: '', backgroundImageUrl: '' },
    contactInfoCards: [],
    contactLocation: { address: '', label: '' },
    contactFAQs: { sectionLabel: '', heading: '', description: '', items: [] },
    contactCTA: { prefixLabel: '', headline: '', subtext: '', ctaButton1: '', ctaButton2: '' },
  };

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<ContactPageContent>({
    defaultValues: data || defaults,
    values: data,
  });

  const onSubmit = (formData: ContactPageContent) => {
    updateMutation.mutate({ [activeSection]: formData[activeSection] });
  };

  const sectionInfo = SECTIONS.find((s) => s.key === activeSection)!;

  if (isLoading) return <SectionSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Page Editor</h1>
        <p className="text-sm text-gray-500 mt-1">Update your Contact page content, one section at a time</p>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {activeSection === 'contactHero' && (
            <div className="space-y-4">
              <Field label="Section Label" register={register} name="contactHero.sectionLabel" placeholder="Contact Us" />
              <Field label="Main Heading" register={register} name="contactHero.headline" placeholder="Let's Talk About Your Next Project" />
              <Field label="Description" register={register} name="contactHero.subheadline" textarea rows={3} />
              <CloudinaryUrlField
                label="Hero Background Image"
                value={watch('contactHero.backgroundImageUrl') || ''}
                onChange={(url) => setValue('contactHero.backgroundImageUrl', url)}
                hint="Optional. When set, this image fills the Contact hero behind the heading with a 20% dark overlay."
              />
              <p className="text-xs text-gray-400 italic">Note: The contact form fields (Name, Email, Company, Message) are managed by the Leads system.</p>
            </div>
          )}

          {activeSection === 'contactInfoCards' && (
            <ContactCardsEditor watch={watch} setValue={setValue} register={register} />
          )}

          {activeSection === 'contactLocation' && (
            <LocationEditor register={register} watch={watch} />
          )}

          {activeSection === 'contactFAQs' && (
            <div className="space-y-4">
              <Field label="Section Label" register={register} name="contactFAQs.sectionLabel" placeholder="Help Center" />
              <Field label="Section Heading" register={register} name="contactFAQs.heading" placeholder="Frequently Asked Questions" />
              <Field label="Section Description" register={register} name="contactFAQs.description" textarea rows={2} placeholder="Browse answers to frequently asked questions..." />
              <hr className="border-gray-100" />
              <FAQsEditor watch={watch} setValue={setValue} register={register} />
            </div>
          )}

          {activeSection === 'contactCTA' && (
            <div className="space-y-4">
              <Field label="Prefix Label" register={register} name="contactCTA.prefixLabel" placeholder="Solutions" />
              <Field label="Heading" register={register} name="contactCTA.headline" placeholder="Build Your Renewable Energy Project" />
              <Field label="Description" register={register} name="contactCTA.subtext" textarea rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Button 1 Text" register={register} name="contactCTA.ctaButton1" placeholder="Contact Us" />
                <Field label="Button 2 Text" register={register} name="contactCTA.ctaButton2" placeholder="Learn About Us" />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ─── Location Editor with live Google Maps preview ───────────────────────────

function LocationEditor({ register, watch }: { register: any; watch: any }) {
  const address = watch('contactLocation.address') || '';
  const [debouncedAddr, setDebouncedAddr] = useState(address);
  const iframeKey = useRef(0);

  // Debounce the address so the iframe doesn't reload on every keystroke
  useEffect(() => {
    if (!address.trim()) { setDebouncedAddr(''); return; }
    const timer = setTimeout(() => {
      iframeKey.current += 1;
      setDebouncedAddr(address.trim());
    }, 1000);
    return () => clearTimeout(timer);
  }, [address]);

  const encoded = encodeURIComponent(debouncedAddr);
  const embedUrl = `https://www.google.com/maps?q=${encoded}&z=15&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  return (
    <div className="space-y-4">
      <Field
        label="Section Label"
        register={register}
        name="contactLocation.label"
        placeholder="Our Office"
      />
      <Field
        label="Full Address"
        register={register}
        name="contactLocation.address"
        textarea
        rows={3}
        placeholder="7A Cross Street, Ashraya Layout, Bengaluru, Karnataka 560048, India"
      />

      {/* Live Google Maps preview */}
      {debouncedAddr && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Live Map Preview</label>

          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              key={iframeKey.current}
              src={embedUrl}
              className="w-full border-0"
              style={{ height: '280px' }}
              loading="lazy"
              title="Google Maps preview"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs text-gray-500 truncate max-w-xs">{debouncedAddr}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-forest-600 hover:text-forest-700 transition-colors flex-shrink-0 ml-3"
              >
                Open in Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Preview auto-updates as you type. Click "Save" to publish on the website.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

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

function CloudinaryUrlField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (url: string) => void; hint?: string;
}) {
  const [draft, setDraft] = useState(value);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => { setDraft(value); setPreviewError(false); }, [value]);

  const commit = () => { onChange(draft.trim()); setPreviewError(false); };

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
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), commit())}
            placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
        </div>
        {value && (
          <button type="button" onClick={() => { setDraft(''); onChange(''); setPreviewError(false); }}
            className="px-3 py-2 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
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
          <span>Image could not be loaded. Check the URL and try again.</span>
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

function ContactCardsEditor({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const cards = watch('contactInfoCards') || [];
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue('contactInfoCards', [...cards, { title: '', email: '', description: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add Contact Card
      </button>
      {cards.map((_: unknown, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Card {i + 1}</span>
            <button type="button" onClick={() => setValue('contactInfoCards', cards.filter((_: unknown, j: number) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <Field label="Card Title" register={register} name={`contactInfoCards.${i}.title`} placeholder="Project Inquiries" />
          <Field label="Email Address" register={register} name={`contactInfoCards.${i}.email`} placeholder="hello@balaji-co.com" />
          <Field label="Description" register={register} name={`contactInfoCards.${i}.description`} textarea rows={2} />
        </div>
      ))}
    </div>
  );
}

function FAQsEditor({ watch, setValue, register }: { watch: any; setValue: any; register: any }) {
  const faqs = watch('contactFAQs.items') || [];
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => setValue('contactFAQs.items', [...faqs, { question: '', answer: '' }])}
        className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-700 font-medium">
        <Plus className="h-4 w-4" /> Add FAQ
      </button>
      {faqs.map((_: unknown, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">FAQ {i + 1}</span>
            <button type="button" onClick={() => setValue('contactFAQs.items', faqs.filter((_: unknown, j: number) => j !== i))}
              className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <Field label="Question" register={register} name={`contactFAQs.items.${i}.question`} />
          <Field label="Answer" register={register} name={`contactFAQs.items.${i}.answer`} textarea rows={3} />
        </div>
      ))}
    </div>
  );
}
