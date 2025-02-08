'use client'

import { useState } from 'react'
import { TOPPINGS } from '../../lib/constants/menu'

interface ToppingsCustomizerProps {
  size: 'REGULAR' | 'LARGE'
  defaultToppings: string[]
}

const ToppingsCustomizer = ({ size, defaultToppings }: ToppingsCustomizerProps) => {
  const [selectedToppings, setSelectedToppings] = useState(defaultToppings)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Fruits</h3>
        <div className="space-y-2">
          {TOPPINGS.FRUITS.map(topping => (
            <label key={topping.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedToppings.includes(topping.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedToppings([...selectedToppings, topping.name])
                  } else {
                    setSelectedToppings(selectedToppings.filter(t => t !== topping.name))
                  }
                }}
              />
              <span>{topping.name}</span>
              <span className="text-sm text-gray-500">({topping.defaultAmount})</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ToppingsCustomizer 