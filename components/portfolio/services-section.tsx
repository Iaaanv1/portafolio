'use client'

import { motion } from 'framer-motion'
import { Rocket, Code, Layout, Zap, type LucideIcon } from 'lucide-react'
import type { Service } from '@/lib/types'

const iconMap: Record<string, LucideIcon> = {
  rocket: Rocket,
  code: Code,
  layout: Layout,
  zap: Zap,
}

interface ServicesSectionProps {
  services: Service[]
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Servicios
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Soluciones de desarrollo web adaptadas a las necesidades de tu negocio.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-xl border border-border bg-card hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-secondary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {services.length === 0 && (
          <p className="text-center text-muted-foreground">
            No hay servicios disponibles.
          </p>
        )}
      </div>
    </section>
  )
}
