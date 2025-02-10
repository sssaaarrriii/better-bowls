'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import OrderSummary from '../../components/checkout/OrderSummary'
import PromoCode from '../../components/checkout/PromoCode'
import PickupDetails from '../../components/checkout/PickupDetails'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { loadStripe } from '@stripe/stripe-js'

interface OrderDetails {
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

// TODO: Add Stripe key when ready
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
const stripePromise = loadStripe('dummy_key')

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [promoApplied, setPromoApplied] = useState(false)

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

    const subtotal = orderDetails.items[0].price
    const discount = promoApplied ? subtotal * 0.2 : 0
    const tax = (subtotal - discount) * 0.095
    const total = subtotal - discount + tax

    return {
      items: orderDetails.items,
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
    if (code.toLowerCase() === 'pvolve20') {
      setPromoApplied(true)
      return true
    }
    return false
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="font-recoleta text-3xl mb-6">Checkout</h1>
      
      <OrderSummary orderDetails={calculateOrderDetails()} />
      
      <Card className="p-6">
        <PromoCode onApply={handlePromoCode} />
      </Card>
      
      <PickupDetails
        location={{
          name: 'Pvolve West Hollywood',
          address: '8417 Melrose Ave',
          city: 'West Hollywood, CA 90069',
        }}
        pickupTime="2024-03-03T08:45:00Z"
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
