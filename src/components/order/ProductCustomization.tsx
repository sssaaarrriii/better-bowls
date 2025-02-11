'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductDetailsGallery } from '../ui/ProductDetailsGallery'
import { useRouter } from 'next/navigation'

interface ToppingOption {
  name: string
  calories: number
  defaultAmount: string
}

const TOPPINGS: ToppingOption[] = [
  { name: 'Organic Chia Seeds', calories: 35, defaultAmount: '1 tsp' },
  { name: 'Organic Gluten-Free Granola', calories: 35, defaultAmount: '1 tsp' },
  { name: 'Organic Honey', calories: 20, defaultAmount: '1 tsp' },
]

const BOWL_SIZES = {
  REGULAR: { name: 'Regular', price: 14.95 },
  LARGE: { name: 'Large', price: 17.95 }
} as const

export default function ProductCustomization() {
  const [selectedSize, setSelectedSize] = useState<keyof typeof BOWL_SIZES>('REGULAR')
  const [toppingAmounts, setToppingAmounts] = useState<Record<string, number>>({})
  const [extraNotes, setExtraNotes] = useState('')
  const router = useRouter()

  const customerInfo = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('customerInfo') || '{}')
    : {}

  const handleToppingChange = (toppingName: string, change: number) => {
    setToppingAmounts(prev => {
      const newAmount = (prev[toppingName] || 0) + change
      if (newAmount < 0) return prev
      return { ...prev, [toppingName]: newAmount }
    })
  }

  const handleOrder = () => {
    const orderDetails = {
      customerInfo,
      items: [{
        name: 'Classic Energy Bowl',
        size: selectedSize,
        price: BOWL_SIZES[selectedSize].price,
        toppings: toppingAmounts,
        notes: extraNotes
      }],
      subtotal: BOWL_SIZES[selectedSize].price,
      discount: 0,
      tax: BOWL_SIZES[selectedSize].price * 0.095,
      total: BOWL_SIZES[selectedSize].price * 1.095
    }
    
    localStorage.setItem('currentOrder', JSON.stringify(orderDetails))
    router.push('/checkout')
  }

  return (
    <div className="bg-[#fcfce4] min-h-screen">
      {/* Logo and Title */}
      <div className="text-center pt-8 pb-4">
        <Image
          src="/images/Logomark.png"
          alt="Better Bowls"
          width={100}
          height={100}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="font-header text-reseda-green text-2xl">Classic Energy Bowl</h1>
      </div>

      {/* Bowl Images Slideshow */}
      <div className="max-w-md mx-auto mb-6">
        <ProductDetailsGallery />
      </div>

      {/* Nutrition Info */}
      <div className="bg-reseda-green text-white p-4 mx-4 rounded-lg mb-6 text-center">
        <h2 className="text-xl mb-2">40g Protein, 400 Calories</h2>
        <p className="text-sm mb-2">
          Delicious greek yogurt and protein blend topped with strawberries, 
          blueberries, bananas, organic chia seeds, organic granola (gluten free), 
          organic coconut shreds, and honey
        </p>
        <p className="text-xs">
          contains: milk, tree nuts (almonds, coconut)
        </p>
      </div>

      {/* Size Selection */}
      <div className="flex gap-4 justify-center mb-6">
        {Object.entries(BOWL_SIZES).map(([size, details]) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size as keyof typeof BOWL_SIZES)}
            className={`px-6 py-2 rounded-full border-2 border-reseda-green font-header
              ${selectedSize === size 
                ? 'bg-reseda-green text-white' 
                : 'bg-transparent text-reseda-green'}`}
          >
            {details.name} ${details.price}
          </button>
        ))}
      </div>

      {/* Toppings Customization */}
      <div className="px-4 space-y-6">
        <h3 className="text-center text-reseda-green font-header text-xl">Customize</h3>
        
        {TOPPINGS.map((topping) => (
          <div key={topping.name} className="flex items-center justify-between">
            <div>
              <Image
                src={`/images/toppings/${topping.name.toLowerCase().replace(/\s+/g, '-')}.png`}
                alt={topping.name}
                width={40}
                height={40}
              />
              <p className="text-reseda-green font-header">{topping.name}</p>
              <p className="text-sm text-reseda-green/80">{topping.defaultAmount} ({topping.calories} calories)</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleToppingChange(topping.name, -1)}
                className="w-8 h-8 rounded-full border-2 border-reseda-green text-reseda-green"
              >
                -
              </button>
              <span className="w-8 text-center text-reseda-green">
                {toppingAmounts[topping.name] || 0}
              </span>
              <button 
                onClick={() => handleToppingChange(topping.name, 1)}
                className="w-8 h-8 rounded-full border-2 border-reseda-green text-reseda-green"
              >
                +
              </button>
            </div>
          </div>
        ))}

        {/* Extra Notes */}
        <textarea
          placeholder="Extra Customization"
          className="w-full p-4 border-2 border-reseda-green/20 rounded-lg bg-white/50"
          rows={3}
          value={extraNotes}
          onChange={(e) => setExtraNotes(e.target.value)}
        />

        {/* Order Button */}
        <button 
          className="w-full mb-8 bg-reseda-green text-white py-3 rounded-lg"
          onClick={() => {
            console.log('Clicked!');
            handleOrder();
          }}
        >
          Add to Order
        </button>
      </div>

      {/* Benefits Section */}
      <section className="bg-reseda-green text-white p-8">
        <h2 className="text-2xl font-header text-center mb-6">
          Benefits of Better Bowls
        </h2>
        {/* Benefits content will be added later */}
      </section>
    </div>
  )
}