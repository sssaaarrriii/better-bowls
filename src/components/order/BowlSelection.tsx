'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BowlSelectionProps {
  customerInfo: {
    name: string
    phone: string
    classTime: string
  } | null
}

export default function BowlSelection({ customerInfo }: BowlSelectionProps) {
  const [size, setSize] = useState<'Regular' | 'Large'>()
  
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Image
          src="/images/better-bowls-logo.png"
          alt="Better Bowls"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-[#5E7153] text-3xl font-header mb-2">
          Classic Energy Bowl
        </h1>
        <p className="text-[#5E7153]">40g Protein, 400 Calories</p>
      </div>

      <div className="mb-8">
        <Image
          src="/images/classic-bowl.jpg"
          alt="Classic Energy Bowl"
          width={400}
          height={400}
          className="w-full rounded-lg"
        />
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSize('Regular')}
            className={`px-6 py-3 rounded-full border-2 border-[#5E7153] ${
              size === 'Regular' ? 'bg-[#5E7153] text-white' : 'text-[#5E7153]'
            }`}
          >
            Regular $14.95
          </button>
          <button
            onClick={() => setSize('Large')}
            className={`px-6 py-3 rounded-full border-2 border-[#5E7153] ${
              size === 'Large' ? 'bg-[#5E7153] text-white' : 'text-[#5E7153]'
            }`}
          >
            Large $17.95
          </button>
        </div>
        
        <button className="w-full py-3 text-[#5E7153] border-2 border-[#5E7153] rounded-full">
          Customize
        </button>
        
        <button 
          className="w-full py-3 bg-[#5E7153] text-white rounded-full"
          disabled={!size}
        >
          Order
        </button>
      </div>

      <div className="bg-white rounded-lg p-4 text-sm text-[#5E7153]">
        <p>Delicious greek yogurt and whey protein blend topped with strawberries, blueberries, bananas, organic chia seeds, organic granola (gluten free), organic coconut shreds, and honey</p>
        <p className="mt-2">Contains: milk, tree nuts (almonds, coconut)</p>
      </div>
    </div>
  )
} 