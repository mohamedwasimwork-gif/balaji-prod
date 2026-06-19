import { useRef, useState } from 'react';
import {
  Upload,
  Copy,
  Check,
  ImageOff,
  Trash2,
  Cloud,
  ExternalLink,
  AlertTriangle,
  ImagePlus,
} from 'lucide-react';
import { uploadService } from '@dashboard/services';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedImage {
  id: string;
  url: string;
  publicId: string;
  name: string;
  uploadedAt: Date;
}

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for non-https
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy URL"
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
        copied
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-forest-50 text-forest-700 border border-forest-200 hover:bg-forest-100'
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : 'Copy URL'}
    </button>
  );
}

function ImageCard({ img, onRemove }: { img: UploadedImage; onRemove: (id: string) => void }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-50">
        {broken ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">Preview unavailable</span>
          </div>
        ) : (
          <img
            src={img.url}
            alt={img.name}
            className="w-full h-full object-cover"
            onError={() => setBroken(true)}
          />
        )}

        {/* Hover overlay — open in new tab */}
        <a
          href={img.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ExternalLink className="h-6 w-6 text-white" />
        </a>

        {/* Remove button */}
        <button
          onClick={() => onRemove(img.id)}
          title="Remove from list"
          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* File name + time */}
        <div>
          <p className="text-sm font-semibold text-gray-900 truncate" title={img.name}>
            {img.name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Uploaded at {formatTime(img.uploadedAt)}</p>
        </div>

        {/* URL box */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span className="flex-1 text-xs text-gray-500 truncate font-mono" title={img.url}>
            {img.url}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <CopyButton url={img.url} />
          <a
            href={img.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MediaLibraryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadedImage[]>([]);

  // ── Upload handler ──────────────────────────────────────────────────────────

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Only image files are supported (JPG, PNG, WebP).');
      setStatus('error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum size is 5 MB.');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    // Simulate progress (actual upload doesn't report progress)
    const ticker = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 12 : p));
    }, 250);

    try {
      const { url, publicId } = await uploadService.uploadImage(file);
      clearInterval(ticker);
      setProgress(100);

      const newImage: UploadedImage = {
        id: `${Date.now()}-${Math.random()}`,
        url,
        publicId,
        name: file.name,
        uploadedAt: new Date(),
      };

      setUploads((prev) => [newImage, ...prev]);
      setStatus('done');

      // Reset to idle after a moment
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 1500);
    } catch (err: unknown) {
      clearInterval(ticker);
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setErrorMsg(
        msg.includes('Cloudinary') || msg.includes('cloud_name') || msg.includes('401') || msg.includes('403')
          ? 'Cloudinary credentials are not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to the backend .env file.'
          : `Upload failed: ${msg}`
      );
      setStatus('error');
      setProgress(0);
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) handleUpload(file);
  };

  // ── Drag & drop handlers ────────────────────────────────────────────────────

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => setUploads((prev) => prev.filter((img) => img.id !== id));

  const isUploading = status === 'uploading';

  return (
    <div className="space-y-8 max-w-5xl">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload images to Cloudinary and copy the public URL to use anywhere on the website.
        </p>
      </div>

      {/* ── Setup notice (always shown until keys work) ────────────────── */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-800">Cloudinary credentials required</p>
          <p className="text-amber-700 mt-1">
            Open <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">apps/backend/.env</code> and
            fill in the three variables below with values from your{' '}
            <a
              href="https://cloudinary.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-900 font-medium"
            >
              Cloudinary Console ↗
            </a>
          </p>
          <pre className="mt-3 bg-amber-100 border border-amber-200 rounded-lg px-4 py-3 text-xs font-mono text-amber-900 leading-relaxed select-all">
{`CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`}
          </pre>
          <p className="text-amber-600 text-xs mt-2">Restart the backend server after adding the credentials.</p>
        </div>
      </div>

      {/* ── Upload zone ────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-50 flex items-center justify-center">
            <Cloud className="h-5 w-5 text-forest-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Upload Image</h2>
            <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 5 MB per file</p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all py-14 ${
            dragging
              ? 'border-forest-400 bg-forest-50 scale-[1.01]'
              : isUploading
              ? 'border-forest-300 bg-forest-50 cursor-not-allowed'
              : status === 'done'
              ? 'border-green-400 bg-green-50'
              : status === 'error'
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 hover:border-forest-300 hover:bg-forest-50'
          }`}
        >
          {isUploading ? (
            <>
              {/* Progress ring */}
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                  <circle
                    cx="32" cy="32" r="28"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-forest-700">
                  {progress}%
                </span>
              </div>
              <p className="text-sm font-medium text-forest-700">Uploading to Cloudinary…</p>
            </>
          ) : status === 'done' ? (
            <>
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-7 w-7 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-green-700">Upload successful!</p>
              <p className="text-xs text-green-600">The Cloudinary URL is shown below. Click to upload another.</p>
            </>
          ) : status === 'error' ? (
            <>
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <ImageOff className="h-7 w-7 text-red-500" />
              </div>
              <p className="text-sm font-semibold text-red-700">Upload failed</p>
              <p className="text-xs text-red-500 max-w-sm text-center">{errorMsg}</p>
              <p className="text-xs text-gray-400">Click to try again</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-forest-50 border-2 border-forest-100 flex items-center justify-center">
                <ImagePlus className="h-7 w-7 text-forest-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  Drag & drop an image here
                </p>
                <p className="text-xs text-gray-400 mt-1">or click to browse files</p>
              </div>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        {/* Upload button (alternative to clicking zone) */}
        {!isUploading && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Upload className="h-4 w-4" />
            Select Image to Upload
          </button>
        )}
      </div>

      {/* ── Uploaded images grid ────────────────────────────────────────── */}
      {uploads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Uploaded This Session
              <span className="ml-2 text-xs font-normal text-gray-400">({uploads.length} image{uploads.length !== 1 ? 's' : ''})</span>
            </h2>
            <button
              onClick={() => setUploads([])}
              className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {uploads.map((img) => (
              <ImageCard key={img.id} img={img} onRemove={removeImage} />
            ))}
          </div>
        </div>
      )}

      {/* ── How to use guide ───────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">How to use</h3>
        <ol className="space-y-3">
          {[
            { step: '01', text: 'Upload your image using the zone above.' },
            { step: '02', text: 'Copy the Cloudinary URL from the card that appears.' },
            { step: '03', text: 'Paste the URL into any image URL field in the Home Page, Solutions, Contact, or Showcase editor.' },
            { step: '04', text: 'Save the page — the image will appear live on the website immediately.' },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest-100 text-forest-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {step}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}
