import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="type-h2 text-text mb-4">Page not found</h1>
      <p className="type-body text-text-muted mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button variant="primary" href="/">
        Back to Home
      </Button>
    </section>
  );
}
