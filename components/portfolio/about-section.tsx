'use client'

import { motion } from 'framer-motion'

interface AboutSectionProps {
  aboutText: string
}

export function AboutSection({ aboutText }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Sobre Mi
          </h2>
          <div className="mt-8 flex flex-col items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-secondary border-4 border-border flex items-center justify-center">
              <span className="text-4xl font-bold">I</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty">
              {aboutText || 'Soy un desarrollador web apasionado por crear experiencias digitales excepcionales.'}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
