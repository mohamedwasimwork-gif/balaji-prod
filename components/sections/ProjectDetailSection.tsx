import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import SectionWrapper from '@/components/ui/SectionWrapper';
import type { Project } from '@/lib/projects';

interface ProjectDetailSectionProps {
  project: Project;
}

export default function ProjectDetailSection({ project }: ProjectDetailSectionProps) {
  return (
    <SectionWrapper id="project-detail" className="py-24 desktop:py-32">
      <div className="mx-auto max-w-3xl">
        {/* Meta */}
        <ScrollFadeUp>
          <div className="mb-8 flex flex-wrap gap-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 type-label font-medium text-primary">
              {project.category}
            </span>
            <span className="type-label text-text-muted self-center">{project.date}</span>
          </div>
        </ScrollFadeUp>

        {/* Overview */}
        <ScrollFadeUp delay={0.1} distance={200} fadeOpacity={false}>
          <div className="mb-10">
            <h2 className="type-h3 font-medium text-text mb-4">Project Overview</h2>
            <p className="type-body text-text-muted leading-relaxed">{project.overview}</p>
          </div>
        </ScrollFadeUp>

        {/* Client + location */}
        <ScrollFadeUp delay={0.15} distance={200} fadeOpacity={false}>
          <div className="mb-10 grid gap-6 tablet:grid-cols-2">
            <div className="rounded-xl bg-bg-soft p-5">
              <p className="type-label font-semibold text-text-subtle mb-1">Client</p>
              <p className="type-body text-text">{project.client}</p>
            </div>
            <div className="rounded-xl bg-bg-soft p-5">
              <p className="type-label font-semibold text-text-subtle mb-1">Location</p>
              <p className="type-body text-text">{project.location}</p>
            </div>
          </div>
        </ScrollFadeUp>

        {/* Scope of work */}
        <ScrollFadeUp delay={0.2} distance={200} fadeOpacity={false}>
          <div className="mb-10">
            <h2 className="type-h3 font-medium text-text mb-4">Scope of Work</h2>
            <ul className="flex flex-col gap-3">
              {project.scope.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span className="type-body text-text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollFadeUp>

        {/* Key highlights */}
        <ScrollFadeUp delay={0.25} distance={200} fadeOpacity={false}>
          <div>
            <h2 className="type-h3 font-medium text-text mb-4">Key Highlights</h2>
            <ul className="flex flex-col gap-3">
              {project.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span className="type-body font-medium text-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollFadeUp>
      </div>
    </SectionWrapper>
  );
}
