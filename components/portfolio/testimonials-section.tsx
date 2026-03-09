'use client'

import { motion } from 'framer-motion'
import { Quote, Star, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Testimonial } from '@/lib/types'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Testimonios
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Lo que dicen mis clientes sobre trabajar conmigo.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/dejar-resena">
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Deja tu resena
            </Link>
          </Button>
        </motion.div>

        {testimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12 px-6 rounded-xl border border-dashed border-border"
          >
            <p className="text-muted-foreground">
              Aun no hay resenas. Se el primero en dejar tu experiencia.
            </p>
          </motion.div>
        ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-4">
                <Quote className="h-8 w-8 text-muted-foreground/50" />
                {testimonial.rating && (
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {testimonial.content}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ' - '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
