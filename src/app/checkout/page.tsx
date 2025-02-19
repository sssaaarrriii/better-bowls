'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import OrderSummary from '@/components/checkout/order-summary'
import PromoCode from '@/components/checkout/promo-code'
import PickupDetails from '@/components/checkout/pickup-details'
import { Button } from '@/components/ui/button'

interface OrderDetails {
  items: {
    name: string;
    quantity: number;
    price: number;
    size: string;
    toppings?: Record<string, number>;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

// TODO: Add Stripe key when ready
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
const stripePromise = loadStripe('dummy_key')

function CheckoutContent() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  const selectedEvent = JSON.parse(localStorage.getItem('selectedEvent') || '{}')
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}')

  useEffect(() => {
    const savedOrder = localStorage.getItem('currentOrder')
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder))
    }
  }, [])

  const calculateOrderDetails = () => {
    if (!orderDetails) return {
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0
    }

    // Ensure items have size and toppings from localStorage
    const items = orderDetails.items.map(item => ({
      ...item,
      size: item.size || 'Regular',
      toppings: item.toppings || {}
    }))

    const subtotal = items[0].price
    const discount = promoApplied ? subtotal * 0.2 : 0
    const tax = (subtotal - discount) * 0.095
    const total = subtotal - discount + tax

    return {
      items,
      subtotal,
      discount,
      tax,
      total
    }
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDetails: calculateOrderDetails()
        }),
      })

      if (!response.ok) throw new Error('Checkout failed')

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      })

      if (error) throw error
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromoCode = async (code: string) => {
    const validCodes = ['pvolve20', 'solidcore20']
    if (validCodes.includes(code.toLowerCase())) {
      setPromoApplied(true)
      setPromoCode(code)
      return true
    }
    return false
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pt-32 space-y-6">
      <h1 className="font-recoleta text-3xl mb-6">Checkout</h1>
      
      <OrderSummary orderDetails={calculateOrderDetails()} />
      
      <div className="bg-white rounded-lg shadow p-6">
        <PromoCode onApply={handlePromoCode} />
      </div>
      
      <PickupDetails
        location={{
          name: selectedEvent.location || 'Pvolve West Hollywood',
          address: selectedEvent.address || '8417 Melrose Ave',
          city: selectedEvent.city || 'West Hollywood',
          zip: selectedEvent.zip || 'CA 90069'
        }}
        pickupTime={customerInfo.classTime}
      />
      
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? 'Processing...' : 'Pay with Apple Pay'}
      </Button>
      
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        variant="outline"
        fullWidth
      >
        Confirm
      </Button>
      
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense 
      fallback={
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="font-recoleta text-3xl mb-6">Loading Checkout...</h1>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
