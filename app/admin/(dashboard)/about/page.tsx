'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Save, CheckCircle } from 'lucide-react'

export default function AboutPage() {
  const [aboutText, setAboutText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  const fetchAbout = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'about_text')
      .single()
    setAboutText(data?.value || '')
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await supabase
      .from('site_settings')
      .upsert({ key: 'about_text', value: aboutText, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sobre Mi</h1>
        <p className="text-muted-foreground">Edita la seccion &quot;Sobre Mi&quot; de tu portafolio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Texto de presentacion</CardTitle>
          <CardDescription>
            Este texto aparece en la seccion &quot;Sobre Mi&quot; de tu portafolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about_text">Descripcion</Label>
            <Textarea
              id="about_text"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={8}
              placeholder="Escribe sobre ti, tu experiencia, habilidades y lo que te hace unico..."
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Guardado
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
