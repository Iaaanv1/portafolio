'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Save, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [settings, setSettings] = useState({
    email: '',
    github: '',
    linkedin: '',
    whatsapp: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const supabase = createClient()

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['email', 'github', 'linkedin', 'whatsapp'])
    
    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key as keyof typeof settings] = item.value
        return acc
      }, {} as typeof settings)
      setSettings(settingsMap)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }))
    
    for (const update of updates) {
      await supabase
        .from('site_settings')
        .upsert(update, { onConflict: 'key' })
    }
    
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
        <h1 className="text-3xl font-bold">Contacto</h1>
        <p className="text-muted-foreground">Gestiona tu informacion de contacto</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacion de contacto</CardTitle>
          <CardDescription>
            Esta informacion aparece en el footer y los botones de contacto de tu portafolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              value={settings.github}
              onChange={(e) => setSettings({ ...settings, github: e.target.value })}
              placeholder="https://github.com/tu-usuario"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              value={settings.linkedin}
              onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/tu-usuario"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Numero de WhatsApp</Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              placeholder="525549027490"
            />
            <p className="text-xs text-muted-foreground">Solo numeros, sin espacios ni simbolos (ej: 525549027490)</p>
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
