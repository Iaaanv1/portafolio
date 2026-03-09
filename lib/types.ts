export interface Project {
  id: string
  title: string
  description: string
  image_url: string | null
  technologies: string[]
  demo_url: string | null
  github_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  company: string | null
  content: string
  avatar_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  updated_at: string
}

export interface SiteSettings {
  about_text: string
  email: string
  github: string
  linkedin: string
  whatsapp: string
}
