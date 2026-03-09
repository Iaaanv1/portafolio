'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, Star, ExternalLink } from 'lucide-react'
import type { Testimonial } from '@/lib/types'

interface ExtendedTestimonial extends Testimonial {
  work_type?: string
  work_image_url?: string
  is_visible?: boolean
  submitted_at?: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<ExtendedTestimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<ExtendedTestimonial | null>(null)
  const [filter, setFilter] = useState<'all' | 'visible' | 'pending'>('all')
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    avatar_url: '',
    display_order: 0,
  })

  const supabase = createClient()

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('submitted_at', { ascending: false })
    setTestimonials(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const resetForm = () => {
    setFormData({ name: '', role: '', company: '', content: '', avatar_url: '', display_order: 0 })
    setEditingTestimonial(null)
  }

  const handleEdit = (testimonial: ExtendedTestimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      company: testimonial.company || '',
      content: testimonial.content,
      avatar_url: testimonial.avatar_url || '',
      display_order: testimonial.display_order,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Estas seguro de eliminar este testimonio? Esta accion no se puede deshacer.')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchTestimonials()
  }

  const handleToggleVisibility = async (testimonial: ExtendedTestimonial) => {
    const newVisibility = !testimonial.is_visible
    await supabase
      .from('testimonials')
      .update({ is_visible: newVisibility })
      .eq('id', testimonial.id)
    fetchTestimonials()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const testimonialData = {
      name: formData.name,
      role: formData.role || null,
      company: formData.company || null,
      content: formData.content,
      avatar_url: formData.avatar_url || null,
      display_order: formData.display_order,
      is_visible: true,
    }

    if (editingTestimonial) {
      await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', editingTestimonial.id)
    } else {
      await supabase.from('testimonials').insert(testimonialData)
    }

    setIsDialogOpen(false)
    resetForm()
    fetchTestimonials()
  }

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === 'visible') return t.is_visible === true
    if (filter === 'pending') return t.is_visible === false
    return true
  })

  const pendingCount = testimonials.filter(t => !t.is_visible).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonios</h1>
          <p className="text-muted-foreground">
            Gestiona los testimonios de tus clientes
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
              </Badge>
            )}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar testimonio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Editar testimonio' : 'Nuevo testimonio'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo / Tipo de trabajo</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Testimonio</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">URL de avatar</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Orden de visualizacion</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTestimonial ? 'Guardar cambios' : 'Crear testimonio'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todos ({testimonials.length})
        </Button>
        <Button 
          variant={filter === 'visible' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('visible')}
        >
          Visibles ({testimonials.filter(t => t.is_visible).length})
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pendientes ({pendingCount})
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className={!testimonial.is_visible ? 'border-dashed opacity-75' : ''}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  {testimonial.is_visible ? (
                    <Badge variant="default" className="bg-green-600">Visible</Badge>
                  ) : (
                    <Badge variant="secondary">Pendiente</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {testimonial.role && <span>{testimonial.role}</span>}
                  {testimonial.work_type && (
                    <Badge variant="outline" className="text-xs">
                      {testimonial.work_type}
                    </Badge>
                  )}
                  {testimonial.rating && (
                    <span className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                        />
                      ))}
                    </span>
                  )}
                </div>
                {testimonial.submitted_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Enviado: {new Date(testimonial.submitted_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleToggleVisibility(testimonial)}
                  title={testimonial.is_visible ? 'Ocultar' : 'Mostrar'}
                >
                  {testimonial.is_visible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
              {testimonial.work_image_url && (
                <div className="mt-3">
                  <a 
                    href={testimonial.work_image_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Ver imagen del proyecto
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {filteredTestimonials.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {filter === 'pending' 
              ? 'No hay testimonios pendientes de revision.' 
              : filter === 'visible'
              ? 'No hay testimonios visibles.'
              : 'No hay testimonios. Agrega tu primer testimonio.'}
          </p>
        )}
      </div>
    </div>
  )
}
