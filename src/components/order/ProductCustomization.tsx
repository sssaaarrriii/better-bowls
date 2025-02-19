'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductDetailsGallery } from '../ui/ProductDetailsGallery'
import { useRouter } from 'next/navigation'

interface ToppingOption {
  name: string
  regular: {
    calories: number
    protein: number
    defaultAmount: string
  }
  large: {
    calories: number
    protein: number
    defaultAmount: string
  }
  image: string
}

const TOPPINGS: ToppingOption[] = [
  {
    name: 'Organic Chia Seeds',
    regular: { calories: 33.3, protein: 1.4, defaultAmount: '1 tsp' },
    large: { calories: 50, protein: 2.1, defaultAmount: '1 tbsp' },
    image: '/images/chia-seeds.png'
  },
  {
    name: 'Organic Gluten-Free Granola',
    regular: { calories: 36, protein: 0.7, defaultAmount: '1 tsp' },
    large: { calories: 54, protein: 1, defaultAmount: '1 tbsp' },
    image: '/images/granola.png'
  },
  {
    name: 'Organic Coconut Shreds',
    regular: { calories: 19.6, protein: 0.2, defaultAmount: '1/2 tsp' },
    large: { calories: 29.3, protein: 0.3, defaultAmount: '1/2 tbsp' },
    image: '/images/coconut.png'
  },
  {
    name: 'Organic Honey',
    regular: { calories: 20, protein: 0, defaultAmount: '1/2 tsp' },
    large: { calories: 30, protein: 0, defaultAmount: '1/2 tbsp' },
    image: '/images/honey.png'
  },
]

const BOWL_SIZES = {
  REGULAR: { 
    name: 'Regular', 
    price: 14.95,
    baseCalories: 290,
    baseProtein: 37
  },
  LARGE: { 
    name: 'Large', 
    price: 17.95,
    baseCalories: 437,
    baseProtein: 55
  }
} as const

export default function ProductCustomization() {
  const [selectedSize, setSelectedSize] = useState<keyof typeof BOWL_SIZES>('REGULAR')
  const [toppingAmounts, setToppingAmounts] = useState<Record<string, number>>(() => 
    TOPPINGS.reduce((acc, topping) => ({ ...acc, [topping.name]: 1 }), {})
  )
  const [extraNotes, setExtraNotes] = useState('')
  const router = useRouter()
  const [isCustomizing, setIsCustomizing] = useState(false)

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

  const calculateTotals = () => {
    const baseSize = BOWL_SIZES[selectedSize]
    let totalCalories = baseSize.baseCalories
    let totalProtein = baseSize.baseProtein

    Object.entries(toppingAmounts).forEach(([name, amount]) => {
      const topping = TOPPINGS.find(t => t.name === name)
      if (topping) {
        totalCalories += topping[selectedSize.toLowerCase()].calories * amount
        totalProtein += topping[selectedSize.toLowerCase()].protein * amount
      }
    })

    // Marketing rounding for default values (when all toppings are at 1 serving)
    const isDefaultToppings = Object.values(toppingAmounts).every(amount => amount === 1)
    if (isDefaultToppings) {
      return {
        calories: selectedSize === 'REGULAR' ? 400 : 600,
        protein: selectedSize === 'REGULAR' ? 40 : 60
      }
    }

    // Regular rounding for custom topping amounts
    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein)
    }
  }

  const totals = calculateTotals()

  return (
    <div className="bg-[#fcfce4] min-h-screen pt-32">
      {/* Logo and Title */}
      <div className="text-center pb-2">
        <Image
          src="/images/Logomark.png"
          alt="Better Bowls"
          width={100}
          height={100}
          className="mx-auto mb-2"
          priority
        />
        <h1 className="font-recolleta-bold text-reseda-green text-4xl italic font-serif">Classic Energy Bowl</h1>
      </div>

      {/* Bowl Images Slideshow */}
      <div className="max-w-md mx-auto mb-6">
        <ProductDetailsGallery />
      </div>

      {/* Nutrition Info */}
      <div className="bg-reseda-green text-white p-4 mx-4 rounded-lg mb-6 text-center">
        <h2 className="text-xl mb-2">{totals.protein}g Protein, {totals.calories} Calories</h2>
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
      <div className="px-4">
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`
            w-full py-2 px-6 
            rounded-full border-2 border-reseda-green font-header text-xl
            transition-all duration-200
            mb-4
            ${isCustomizing 
              ? 'bg-reseda-green text-white' 
              : 'bg-transparent text-reseda-green hover:bg-reseda-green/10'
            }
          `}
        >
          {isCustomizing ? 'Hide Customization' : 'Customize Toppings'}
        </button>

        <div className={`
          transition-all duration-300 ease-in-out
          ${isCustomizing 
            ? 'opacity-100 max-h-[2000px] mb-6'
            : 'opacity-0 max-h-0 overflow-hidden'
          }
        `}>
          <p className="text-center text-reseda-green/80 text-sm mb-6">
            Toppings can be added or removed at no additional cost
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOPPINGS.map((topping) => (
              <div key={topping.name} className="border-4 border-reseda-green/20 rounded-lg p-6 flex flex-col">
                {/* Top Section: Image and Name */}
                <div className="text-center mb-6">
                  <div className="mb-3">
                    <Image
                      src={topping.image}
                      alt={topping.name}
                      width={48}
                      height={48}
                      className="mx-auto"
                    />
                  </div>
                  <h3 className="font-header text-reseda-green">
                    {topping.name}
                  </h3>
                </div>

                {/* Bottom Section: Serving Info and Controls */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-reseda-green/80">
                      {toppingAmounts[topping.name] === 0 ? 'None' : 
                        `${toppingAmounts[topping.name]} serving${toppingAmounts[topping.name] > 1 ? 's' : ''} ` + 
                        `(${Math.round(topping[selectedSize.toLowerCase()].calories * toppingAmounts[topping.name])} calories)`
                      }
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToppingChange(topping.name, -1)}
                        className="w-7 h-7 rounded-full border border-reseda-green text-reseda-green flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-reseda-green">
                        {toppingAmounts[topping.name]}
                      </span>
                      <button 
                        onClick={() => handleToppingChange(topping.name, 1)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center
                          ${toppingAmounts[topping.name] >= 3 
                            ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
                            : 'border-reseda-green text-reseda-green'
                          }`}
                        disabled={toppingAmounts[topping.name] >= 3}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-reseda-green/60">
                    {topping[selectedSize.toLowerCase()].defaultAmount} per serving
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Extra Notes */}
          <textarea
            placeholder="Extra Customization"
            className="w-full mt-6 p-4 border-4 border-reseda-green/20 rounded-lg bg-white/50"
            rows={3}
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
          />
        </div>

        {/* Order Button */}
        <button 
          className="w-full mt-6 mb-8 bg-reseda-green text-white py-3 rounded-lg hover:bg-reseda-green/90 transition-colors"
          onClick={handleOrder}
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