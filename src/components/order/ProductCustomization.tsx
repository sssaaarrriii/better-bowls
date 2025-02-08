'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BOWL_SIZES, DEFAULT_TOPPINGS } from '../../lib/constants/menu'
import Button from '../ui/Button'
import type { OrderItem } from '../../lib/types'
import ToppingsCustomizer from './ToppingsCustomizer'

interface ProductCustomizationProps {
  onComplete: (data: OrderItem) => void
  customerName?: string
}

export default function ProductCustomization({ onComplete, customerName }: ProductCustomizationProps) {
  const [selectedSize, setSelectedSize] = useState<'REGULAR' | 'LARGE'>('REGULAR')
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [item, setItem] = useState<OrderItem>({
    name: 'Classic Bowl',
    quantity: 1,
    price: 12.99
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(item)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <Image
          src="/images/menu/classic-bowl.jpg"
          alt="Classic Energy Bowl"
          width={400}
          height={400}
          className="rounded-lg w-full"
        />
      </div>

      <h1 className="heading-1 mb-4">Classic Energy Bowl</h1>
      <p className="body-text mb-6">
        ${BOWL_SIZES[selectedSize].price} {BOWL_SIZES[selectedSize].calories} Cal.
      </p>

      <div className="flex gap-4 mb-6">
        {Object.entries(BOWL_SIZES).map(([size, details]) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size as 'REGULAR' | 'LARGE')}
            className={`flex-1 p-4 rounded-full border-2 ${
              selectedSize === size
                ? 'border-green-900 bg-green-900 text-beige'
                : 'border-green-900 text-green-900'
            }`}
          >
            {details.name}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        fullWidth
        onClick={() => setIsCustomizing(!isCustomizing)}
        className="mb-6"
      >
        Customize
      </Button>

      {isCustomizing && (
        <ToppingsCustomizer
          size={selectedSize}
          defaultToppings={DEFAULT_TOPPINGS[selectedSize]}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Hi {customerName}!</h2>
        <Button type="submit" fullWidth>Continue to Checkout</Button>
      </form>
    </div>
  )
}