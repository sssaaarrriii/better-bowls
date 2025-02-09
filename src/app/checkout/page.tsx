'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import OrderSummary from '../../components/checkout/OrderSummary'
import PromoCode from '../../components/checkout/PromoCode'
import PickupDetails from '../../components/checkout/PickupDetails'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
          // Order details would come from your app state
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

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="font-recoleta text-3xl mb-6">Checkout</h1>
      
      <OrderSummary orderDetails={{
        items: [],
        subtotal: 0,
        total: 0
      }} />
      
      <Card className="p-6">
        <PromoCode onApply={async (code) => {
          // Handle promo code validation
          return true
        }} />
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
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
      
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}
