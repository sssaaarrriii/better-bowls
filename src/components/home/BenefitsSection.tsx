'use client'

import { Card } from '../ui/Card'

const BENEFITS = [
  {
    title: '40g+ of high quality protein',
    description: 'to support muscle recovery and toning',
  },
  {
    title: 'Packed with energy',
    description: 'from whole ingredients to fuel your day',
  },
  {
    title: 'Supports digestion',
    description: 'with organic greek yogurt',
  },
]

export default function BenefitsSection() {
  return (
    <section>
      <h2 className="font-recoleta text-3xl text-green-900 mb-12">Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BENEFITS.map((benefit) => (
          <Card key={benefit.title} className="p-6 text-center">
            <h3 className="font-recoleta text-xl mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
} 