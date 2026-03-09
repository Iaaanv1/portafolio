-- Portfolio Database Schema

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'code',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table (for about, contact info, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('about_text', 'Soy Ian, desarrollador web especializado en crear experiencias digitales modernas y funcionales. Con experiencia en startups tecnológicas, me enfoco en desarrollar soluciones que no solo se ven bien, sino que generan resultados reales para los negocios.'),
  ('email', 'contacto@ian.dev'),
  ('github', 'https://github.com/ian'),
  ('linkedin', 'https://linkedin.com/in/ian'),
  ('whatsapp', '525549027490')
ON CONFLICT (key) DO NOTHING;

-- Insert default services
INSERT INTO services (title, description, icon, display_order) VALUES
  ('Landing Pages de Alta Conversion', 'Diseño y desarrollo landing pages optimizadas para convertir visitantes en clientes, con un enfoque en velocidad y experiencia de usuario.', 'rocket', 1),
  ('Desarrollo Web Moderno', 'Aplicaciones web con las tecnologías más actuales: React, Next.js, TypeScript. Código limpio, escalable y mantenible.', 'code', 2),
  ('Dashboards y Herramientas Internas', 'Paneles de administración y herramientas internas que simplifican procesos y mejoran la productividad de tu equipo.', 'layout', 3),
  ('Optimización de Velocidad y SEO', 'Mejoro el rendimiento de sitios existentes para cargar más rápido y posicionar mejor en buscadores.', 'zap', 4)
ON CONFLICT DO NOTHING;

-- Insert sample project
INSERT INTO projects (title, description, image_url, technologies, demo_url, github_url, display_order) VALUES
  ('E-Commerce Dashboard', 'Panel de administración completo para gestionar productos, pedidos y clientes de una tienda online.', '/images/project-1.jpg', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'], 'https://demo.com', 'https://github.com', 1),
  ('SaaS Landing Page', 'Landing page de alta conversión para una startup de software con animaciones fluidas y diseño moderno.', '/images/project-2.jpg', ARRAY['React', 'Framer Motion', 'Tailwind CSS'], 'https://demo.com', 'https://github.com', 2),
  ('Task Management App', 'Aplicación de gestión de tareas con colaboración en tiempo real y sincronización entre dispositivos.', '/images/project-3.jpg', ARRAY['Next.js', 'Supabase', 'Real-time'], 'https://demo.com', 'https://github.com', 3)
ON CONFLICT DO NOTHING;

-- Insert sample testimonial
INSERT INTO testimonials (name, role, company, content, display_order) VALUES
  ('María García', 'CEO', 'TechStartup', 'Ian transformó nuestra visión en una realidad digital. Su atención al detalle y capacidad técnica superaron nuestras expectativas.', 1),
  ('Carlos Rodríguez', 'Founder', 'Innovate Labs', 'Excelente trabajo en nuestro dashboard interno. El proyecto se entregó a tiempo y con una calidad excepcional.', 2)
ON CONFLICT DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can read)
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access for services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access for site_settings" ON site_settings FOR SELECT USING (true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Authenticated users can insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update services" ON services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete services" ON services FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update testimonials" ON testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete testimonials" ON testimonials FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert site_settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site_settings" ON site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete site_settings" ON site_settings FOR DELETE TO authenticated USING (true);
