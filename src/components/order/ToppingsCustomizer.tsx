'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Topping {
  name: string
  default: string
  calories: number
  min: string
  max: string
  image?: string
}

const REGULAR_TOPPINGS: Record<string, Topping> = {
  'Organic Chia Seeds': {
    name: 'Organic Chia Seeds',
    default: '1 serving',
    calories: 35,
    min: 'None',
    max: '2 servings (70 calories)',
    image: '/images/chia-seeds.png'
  },
  'Organic Gluten-Free Granola': {
    name: 'Organic Gluten-Free Granola',
    default: '1 serving',
    calories: 35,
    min: 'None',
    max: '2 servings (70 calories)',
    image: '/images/granola.png'
  },
  'Organic Coconut Shreds': {
    name: 'Organic Coconut Shreds',
    default: '1 serving',
    calories: 20,
    min: 'None',
    max: '2 servings (40 calories)',
    image: '/images/coconut.png'
  },
  'Organic Honey': {
    name: 'Organic Honey',
    default: '1 serving',
    calories: 20,
    min: 'None',
    max: '2 servings (40 calories)',
    image: '/images/honey.png'
  }
}

export function ToppingsCustomizer() {
  const [portions, setPortions] = useState<Record<string, number>>({
    'Organic Chia Seeds': 1,
    'Organic Gluten-Free Granola': 1,
    'Organic Coconut Shreds': 1,
    'Organic Honey': 1
  })
  const [extraNotes, setExtraNotes] = useState('')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(REGULAR_TOPPINGS).map(([key, topping]) => (
        <div key={key} className="border-4 border-reseda-green/20 rounded-lg p-6 flex flex-col">
          {/* Top Section: Image and Name */}
          <div className="text-center mb-6">
            {topping.image && (
              <div className="mb-3">
                <Image
                  src={topping.image}
                  alt={topping.name}
                  width={48}
                  height={48}
                  className="mx-auto"
                />
              </div>
            )}
            <h3 className="font-header text-reseda-green">
              {topping.name}
            </h3>
          </div>

          {/* Bottom Section: Serving Info and Controls */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-reseda-green/80">
                {portions[key] === 0 ? 'None' : `${portions[key] || 1} serving`} 
                {portions[key] > 0 && ` (${(topping.calories * (portions[key] || 1))} calories)`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPortions(prev => ({
                    ...prev,
                    [key]: Math.max((prev[key] || 1) - 1, 0)
                  }))}
                  className="w-7 h-7 rounded-full border border-reseda-green text-reseda-green flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-6 text-center text-reseda-green">
                  {portions[key] === 0 ? '0' : portions[key] || 1}
                </span>
                <button
                  onClick={() => setPortions(prev => ({
                    ...prev,
                    [key]: Math.min((prev[key] || 1) + 1, 2)
                  }))}
                  className="w-7 h-7 rounded-full border border-reseda-green text-reseda-green flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <textarea
        placeholder="Extra customization notes..."
        className="w-full mt-6 p-3 rounded-lg border-4 border-reseda-green/20 focus:outline-none focus:border-reseda-green/40"
        value={extraNotes}
        onChange={(e) => setExtraNotes(e.target.value)}
      />
    </div>
  )
} 