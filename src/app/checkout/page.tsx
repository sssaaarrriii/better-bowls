'use client'

import { useEffect, useState, Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import OrderSummary from '@/components/checkout/order-summary'
import PromoCode from '@/components/checkout/promo-code'
import PickupDetails from '@/components/checkout/pickup-details'
import { Button } from '@/components/ui/button'
import { Elements } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import ExpressCheckout from '@/components/checkout/ExpressCheckout'

export interface OrderDetails {
  items: Array<{
    name: string
    quantity: number
    price: number
    size: string
    toppings?: Record<string, number>
    nutrition?: {
      calories: number
      protein: number
    }
    notes?: string
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
  customerInfo: {
    name: string
    phone: string
    email?: string
  }
  promoCode?: string
  pickupLocation?: string
  pickupTime?: string
}

// Load Stripe outside component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [currentTotal, setCurrentTotal] = useState(0)

  // Get selected event from localStorage with proper typing
  const selectedEvent = useMemo(() => {
    const storedEvent = localStorage.getItem('selectedEvent')
    if (!storedEvent) {
      return {
        location: '',
        address: '',
        city: '',
        zip: '',
        date: '',
        time: ''
      }
    }
    return JSON.parse(storedEvent)
  }, [])

  const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}')

  // Calculate order details with memoization
  const calculateOrderDetails = useMemo(() => {
    return () => {
      if (!orderDetails) return {
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        customerInfo: {
          name: '',
          phone: ''
        }
      }

      const items = orderDetails.items.map(item => ({
        ...item,
        size: item.size || 'Regular',
        toppings: item.toppings || {}
      }))

      const subtotal = items[0].price
      const discount = promoApplied 
        ? promoCode.toLowerCase() === 'stripetesting'
          ? subtotal * 0.90 // Changed to 90% off
          : subtotal * 0.2
        : 0
      const tax = (subtotal - discount) * 0.095
      const total = subtotal - discount + tax

      return {
        items,
        subtotal,
        discount,
        tax,
        total,
        customerInfo: orderDetails.customerInfo,
        promoCode: promoCode
      }
    }
  }, [orderDetails, promoApplied, promoCode])

  // Memoize calculated order details
  const calculatedOrderDetails = useMemo(() => {
    const details = calculateOrderDetails()
    return {
      ...details,
      pickupLocation: selectedEvent.location,
      pickupTime: customerInfo.classTime || selectedEvent.time
    }
  }, [calculateOrderDetails, selectedEvent, customerInfo])

  useEffect(() => {
    const savedOrder = localStorage.getItem('currentOrder')
    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      setOrderDetails(order)
    }
  }, [])

  useEffect(() => {
    if (orderDetails) {
      const details = calculateOrderDetails()
      setCurrentTotal(details.total)
    }
  }, [orderDetails, promoApplied, promoCode, calculateOrderDetails])

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const payment_intent = query.get('payment_intent')
    const payment_intent_client_secret = query.get('payment_intent_client_secret')

    if (payment_intent && payment_intent_client_secret) {
      router.push('/order/confirmation')
    }
  }, [router])

  useEffect(() => {
    const storedEvent = localStorage.getItem('selectedEvent')
    if (!storedEvent) {
      router.push('/')
    }
  }, [router])

  const handlePromoCode = async (code: string) => {
    const validCodes = ['pvolve20', 'solidcore20', 'stripetesting']
    if (validCodes.includes(code.toLowerCase())) {
      setPromoCode(code)
      setPromoApplied(true)
      return true
    }
    return false
  }

  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: Math.max(50, Math.round((calculatedOrderDetails.subtotal - calculatedOrderDetails.discount + calculatedOrderDetails.tax) * 100)),
    currency: 'usd',
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#5E7153'
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pt-32 space-y-6">
      <h1 className="font-recoleta text-3xl mb-6">Checkout</h1>
      
      <OrderSummary orderDetails={calculatedOrderDetails} />
      
      <div className="bg-white rounded-lg shadow p-6">
        <PromoCode onApply={handlePromoCode} />
      </div>
      
      <PickupDetails
        location={{
          name: selectedEvent.location,
          address: selectedEvent.address,
          city: selectedEvent.city,
          zip: selectedEvent.zip
        }}
        pickupTime={customerInfo.classTime || selectedEvent.time}
      />
      
      {/* Elements provider wraps the ExpressCheckout component
          - Provides stripe instance and elements context
          - Configures payment flow with mode, amount, currency */}
      <Elements stripe={stripePromise} options={options}>
        <ExpressCheckout orderDetails={calculatedOrderDetails} />
      </Elements>
      
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
