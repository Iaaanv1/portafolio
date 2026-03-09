import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, Wrench, MessageSquareQuote, Eye } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: projectsCount },
    { count: servicesCount },
    { count: testimonialsCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Proyectos', value: projectsCount || 0, icon: FolderKanban },
    { label: 'Servicios', value: servicesCount || 0, icon: Wrench },
    { label: 'Testimonios', value: testimonialsCount || 0, icon: MessageSquareQuote },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido al panel de administracion
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista rapida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Usa el menu lateral para gestionar tu contenido. Los cambios se reflejan automaticamente en tu portafolio.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
