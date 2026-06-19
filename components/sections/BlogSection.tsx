import BlurInWords from '@/components/motion/BlurInWords';
import HoverImageZoom from '@/components/motion/HoverImageZoom';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import PillLabel from '@/components/ui/PillLabel';
import ProjectCard from '@/components/ui/ProjectCard';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { PROJECTS } from '@/lib/projects';

export default function BlogSection() {
  return (
    <SectionWrapper id="blog-section" className="py-24 desktop:py-32">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <ScrollFadeUp>
            <PillLabel>Key Projects</PillLabel>
          </ScrollFadeUp>
          <BlurInWords
            text="Delivering large-scale wind and solar projects with engineering precision and reliable execution."
            as="h2"
            className="type-h2 text-text max-w-xl"
            stagger={0.05}
          />
        </div>

        {/* All projects grid */}
        <div className="grid gap-6 mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <ScrollFadeUp key={project.slug} delay={i * 0.1}>
              <HoverImageZoom>
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  category={project.category}
                  date={project.date}
                  imageSrc={project.image}
                  imageAlt={`${project.title} project site`}
                />
              </HoverImageZoom>
            </ScrollFadeUp>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
