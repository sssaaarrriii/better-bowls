'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Topping {
  name: string
  default: string
  calories: number
  min: string
  max: string
}

const REGULAR_TOPPINGS: Record<string, Topping> = {
  'Organic Chia Seeds': {
    name: 'Organic Chia Seeds',
    default: '1 tsp',
    calories: 35,
    min: 'None',
    max: '2 tsp (70 calories)'
  },
  'Organic Gluten-Free Granola': {
    name: 'Organic Gluten-Free Granola',
    default: '1 tsp',
    calories: 35,
    min: 'None',
    max: '2 tsp (70 calories)'
  },
  'Organic Coconut Shreds': {
    name: 'Organic Coconut Shreds',
    default: '1/2 tsp',
    calories: 20,
    min: 'None',
    max: '1 tsp (40 calories)'
  },
  'Organic Honey': {
    name: 'Organic Honey',
    default: '1/2 tsp',
    calories: 20,
    min: 'None',
    max: '1 tsp (40 calories)'
  }
}

export function ToppingsCustomizer() {
  const [portions, setPortions] = useState<Record<string, number>>({})
  const [extraNotes, setExtraNotes] = useState('')

  return (
    <div className="bg-sage/10 rounded-lg p-6 mb-8">
      {Object.entries(REGULAR_TOPPINGS).map(([key, topping]) => (
        <div key={key} className="mb-6 last:mb-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-header text-reseda-green">{topping.name}</span>
            <span className="text-sm text-reseda-green/80">
              {topping.default} ({topping.calories} calories)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPortions(prev => ({
                ...prev,
                [key]: Math.max((prev[key] || 0) - 1, -1)
              }))}
            >
              -
            </Button>
            <span className="text-reseda-green">
              {portions[key] ? portions[key] > 0 ? `+${portions[key]}` : portions[key] : '0'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPortions(prev => ({
                ...prev,
                [key]: Math.min((prev[key] || 0) + 1, 1)
              }))}
            >
              +
            </Button>
          </div>
        </div>
      ))}

      <textarea
        placeholder="Extra customization notes..."
        className="w-full mt-6 p-3 rounded-lg border-2 border-reseda-green/20 focus:outline-none focus:border-reseda-green/40"
        value={extraNotes}
        onChange={(e) => setExtraNotes(e.target.value)}
      />
    </div>
  )
} 