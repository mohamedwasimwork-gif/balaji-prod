interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  showSeparator?: boolean;
}

export default function ServiceCard({
  number,
  title,
  description,
  showSeparator = true,
}: ServiceCardProps) {
  return (
    <>
      <div className="flex gap-5 py-6">
        {/* Blue number box */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary">
          <span className="type-label font-mono text-white">{number}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="type-h4 font-medium text-text">{title}</h3>
          <p className="type-body-sm text-text-muted">{description}</p>
        </div>
      </div>
      {showSeparator && <hr className="border-border" />}
    </>
  );
}
