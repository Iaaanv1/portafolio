import { Navbar } from '@/components/portfolio/navbar'
import { Hero } from '@/components/portfolio/hero'
import { ProjectsSection } from '@/components/portfolio/projects-section'
import { ServicesSection } from '@/components/portfolio/services-section'
import { AboutSection } from '@/components/portfolio/about-section'
import { TestimonialsSection } from '@/components/portfolio/testimonials-section'
import { CTASection } from '@/components/portfolio/cta-section'
import { Footer } from '@/components/portfolio/footer'
import { getProjects, getServices, getTestimonials, getSiteSettings } from '@/lib/data'

export const revalidate = 60

export default async function HomePage() {
  const [projects, services, testimonials, settings] = await Promise.all([
    getProjects(),
    getServices(),
    getTestimonials(),
    getSiteSettings(),
  ])

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ProjectsSection projects={projects} />
      <ServicesSection services={services} />
      <AboutSection aboutText={settings.about_text} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection whatsapp={settings.whatsapp} />
      <Footer settings={settings} />
    </main>
  )
}
