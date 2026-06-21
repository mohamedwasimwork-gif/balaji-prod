import BlurInWords from '@/components/motion/BlurInWords';
import HoverImageZoom from '@/components/motion/HoverImageZoom';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { PROJECTS } from '@/lib/projects';

interface ResourcesSectionProps {
  limit?: number;
  excludeSlug?: string;
  showViewAll?: boolean;
}

export default function ResourcesSection({
  limit,
  excludeSlug,
  showViewAll = true,
}: ResourcesSectionProps) {
  const projects = PROJECTS.filter((p) => p.slug !== excludeSlug).slice(0, limit ?? 3);

  return (
    <SectionWrapper id="resources-section" className="py-12 desktop:py-24">
      <div className="flex flex-col gap-12">

        {/* Header — left: eyebrow + heading | right: subtitle + CTA */}
        <div className="flex flex-col gap-8 desktop:flex-row desktop:items-start desktop:justify-between">
          <div className="flex flex-col gap-4">
            <ScrollFadeUp>
              <span className="flex items-center gap-2 type-label text-text-muted">
                <span aria-hidden="true">—</span>
                Key Projects
              </span>
            </ScrollFadeUp>
            <BlurInWords
              text="Proven Renewable Energy Projects"
              as="h2"
              className="type-h2 text-text max-w-lg"
              stagger={0.05}
            />
          </div>

          {showViewAll && (
            <ScrollFadeUp delay={0.2} className="flex flex-col items-start gap-4 desktop:max-w-xs desktop:items-end desktop:text-right">
              <ParagraphBlurIn className="type-body text-text-muted" delay={0.1}>
                Delivering large-scale wind and solar projects with engineering precision and reliable execution.
              </ParagraphBlurIn>
              <Button variant="secondary" href="/projects">
                View All
              </Button>
            </ScrollFadeUp>
          )}
        </div>

        {/* Project grid — 3 columns */}
        <div className="grid gap-8 mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
          {projects.map((project, i) => (
            <ScrollFadeUp key={project.slug} delay={i * 0.1}>
              <HoverImageZoom>
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  category={project.category}
                  date={project.date}
                  imageSrc={project.image}
                  imageAlt={`${project.title} project site`}
                  status={project.status}
                />
              </HoverImageZoom>
            </ScrollFadeUp>
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
}
