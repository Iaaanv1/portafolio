import { createClient } from '@/lib/supabase/server'
import type { Project, Service, Testimonial, SiteSettings } from '@/lib/types'

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data || []
}

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching services:', error)
    return []
  }
  return data || []
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
  return data || []
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
  
  const defaults: SiteSettings = {
    about_text: '',
    email: '',
    github: '',
    linkedin: '',
    whatsapp: '525549027490',
  }
  
  if (error || !data) {
    console.error('Error fetching site settings:', error)
    return defaults
  }
  
  return data.reduce((acc, setting) => {
    acc[setting.key as keyof SiteSettings] = setting.value
    return acc
  }, defaults)
}
