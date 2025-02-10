'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const BENEFITS = [
  {
    icon: '/images/benefits/protein.svg',
    title: '40g+ of high quality protein',
    description: 'to support muscle recovery and toning',
  },
  {
    icon: '/images/benefits/energy.svg',
    title: 'Packed with energy',
    description: 'from whole ingredients to fuel your day',
  },
  {
    icon: '/images/benefits/digestion.svg',
    title: 'Supports digestion',
    description: 'with organic greek yogurt',
  },
]

export default function Benefits() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-recoleta text-3xl text-center mb-8">
          Benefits of Better Bowls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => (
            <Card key={benefit.title} className="p-6 text-center">
              <Image
                src={benefit.icon}
                alt={benefit.title}
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <h3 className="font-recoleta text-xl mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 