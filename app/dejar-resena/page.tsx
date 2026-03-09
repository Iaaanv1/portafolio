'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, CheckCircle, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const workTypes = [
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'sitio-web', label: 'Sitio Web Completo' },
  { value: 'dashboard', label: 'Dashboard / Panel de Control' },
  { value: 'ecommerce', label: 'Tienda Online / E-commerce' },
  { value: 'aplicacion-web', label: 'Aplicacion Web' },
  { value: 'rediseno', label: 'Rediseno de Sitio' },
  { value: 'otro', label: 'Otro' },
]

const experienceOptions = [
  { value: 5, label: 'Excelente', description: 'Superó mis expectativas' },
  { value: 4, label: 'Muy buena', description: 'Muy satisfecho con el resultado' },
  { value: 3, label: 'Buena', description: 'Cumplio con lo esperado' },
  { value: 2, label: 'Regular', description: 'Podria mejorar en algunos aspectos' },
  { value: 1, label: 'Mala', description: 'No estoy satisfecho' },
]

export default function DejarResenaPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    workType: '',
    experience: 5,
    content: '',
    imageUrl: '',
  })

  const supabase = createClient()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const { error: submitError } = await supabase
        .from('testimonials')
        .insert({
          name: formData.company ? `${formData.name} - ${formData.company}` : formData.name,
          role: workTypes.find(w => w.value === formData.workType)?.label || formData.workType,
          content: formData.content,
          rating: formData.experience,
          work_type: formData.workType,
          work_image_url: formData.imageUrl || null,
          is_visible: false,
          submitted_at: new Date().toISOString(),
        })

      if (submitError) throw submitError
      
      setSubmitted(true)
    } catch (err) {
      setError('Hubo un error al enviar tu resena. Por favor intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Gracias por tu resena</h2>
            <p className="text-muted-foreground mb-6">
              Tu resena ha sido enviada y sera revisada antes de publicarse. Apreciamos mucho tu tiempo y comentarios.
            </p>
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deja tu resena</h1>
          <p className="text-muted-foreground">
            Tu opinion es muy importante. Comparte tu experiencia trabajando conmigo.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s 
                    ? 'bg-foreground text-background' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${step > s ? 'bg-foreground' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informacion personal</CardTitle>
              <CardDescription>
                Cuentanos quien eres para que otros puedan conocer tu experiencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tu nombre *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Juan Perez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Nombre de tu empresa (opcional)</Label>
                <Input
                  id="company"
                  placeholder="Ej: Mi Empresa S.A."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label>Tipo de trabajo realizado *</Label>
                <RadioGroup
                  value={formData.workType}
                  onValueChange={(value) => setFormData({ ...formData, workType: value })}
                  className="grid gap-2"
                >
                  {workTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={type.value} id={type.value} />
                      <Label htmlFor={type.value} className="font-normal cursor-pointer">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="pt-4">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.workType}
                  className="w-full"
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Experience Rating */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Tu experiencia</CardTitle>
              <CardDescription>
                Como calificarias tu experiencia trabajando conmigo?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={formData.experience.toString()}
                onValueChange={(value) => setFormData({ ...formData, experience: parseInt(value) })}
                className="space-y-3"
              >
                {experienceOptions.map((option) => (
                  <div 
                    key={option.value} 
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      formData.experience === option.value 
                        ? 'border-foreground bg-muted/50' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setFormData({ ...formData, experience: option.value })}
                  >
                    <RadioGroupItem value={option.value.toString()} id={`exp-${option.value}`} />
                    <div className="flex-1">
                      <Label htmlFor={`exp-${option.value}`} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < option.value ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Atras
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Comments and Photo */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Comentarios finales</CardTitle>
              <CardDescription>
                Comparte mas detalles sobre tu experiencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Tu comentario *</Label>
                <Textarea
                  id="content"
                  placeholder="Cuentanos como fue tu experiencia, que te gusto del trabajo, como fue la comunicacion, si lo recomendarias..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de imagen del proyecto (opcional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Puedes compartir una captura de pantalla o foto del trabajo realizado
                </p>
              </div>
              {formData.imageUrl && (
                <div className="rounded-lg overflow-hidden border">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Atras
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !formData.content}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar resena'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
