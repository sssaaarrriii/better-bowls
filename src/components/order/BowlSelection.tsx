/*
This file is temporarily commented out.
The bowl selection functionality has been integrated into the main order flow:
OrderPage -> OrderForm -> ProductCustomization

This component previously handled:
- Bowl size selection
- Basic product information display
- Nutrition information

These features are now available in ProductCustomization.tsx with additional customization options.
See ProductCustomization.tsx for the active implementation

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

interface BowlSelectionProps {
  customerInfo: {
    name: string
    phone: string
    classTime: string
  } | null
}

const BOWL_SIZES = {
  REGULAR: {
    name: 'Regular',
    price: 14.95,
    calories: 400,
    protein: 40
  },
  LARGE: {
    name: 'Large',
    price: 17.95,
    calories: 600,
    protein: 60
  }
}

export default function BowlSelection({ customerInfo }: BowlSelectionProps) {
  const [selectedSize, setSelectedSize] = useState<'REGULAR' | 'LARGE'>('REGULAR')
  const router = useRouter()

  return (
    <div className="bg-dutch-white min-h-screen">
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center mb-8">
          <Image
            src="/images/better-bowls-logo-circle.png"
            alt="Better Bowls"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>

        <h1 className="font-header text-reseda-green text-3xl text-center mb-2">
          Classic Energy Bowl
        </h1>
        <p className="text-center text-reseda-green mb-8">
          ${BOWL_SIZES[selectedSize].price} • {BOWL_SIZES[selectedSize].protein}g Protein • {BOWL_SIZES[selectedSize].calories} Cal
        </p>

        <div className="mb-8 relative h-[400px]">
          <Image
            src="/images/mediumbowl1.png"
            alt="Classic Energy Bowl"
            fill
            className="rounded-lg object-contain"
            priority
          />
        </div>

        <div className="bg-reseda-green text-white rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl mb-4">{BOWL_SIZES[selectedSize].protein}g Protein, {BOWL_SIZES[selectedSize].calories} Calories</h2>
          <p className="mb-4">
            Delicious greek yogurt and whey protein blend topped with strawberries, 
            blueberries, bananas, organic chia seeds, organic granola (gluten free), 
            organic coconut shreds, and honey
          </p>
          <p className="text-sm">
            contains: milk, tree nuts (almonds, coconut)
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          {Object.entries(BOWL_SIZES).map(([size, details]) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size as 'REGULAR' | 'LARGE')}
              className={`px-8 py-3 rounded-full border-2 border-reseda-green ${
                selectedSize === size 
                  ? 'bg-reseda-green text-white' 
                  : 'text-reseda-green hover:bg-reseda-green/10'
              }`}
            >
              {details.name}
              <br />
              ${details.price}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-12">
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => {
              localStorage.setItem('selectedSize', selectedSize)
              router.push('/order/customize')
            }}
          >
            Continue to Customize
          </Button>
        </div>
      </div>
    </div>
  )
}
*/