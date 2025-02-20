'use client'

import { useEffect, useState, Suspense, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import OrderSummary from '@/components/checkout/order-summary'
import PromoCode from '@/components/checkout/promo-code'
import PickupDetails from '@/components/checkout/pickup-details'
import { Button } from '@/components/ui/button'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from '@/components/checkout/PaymentForm'

export interface OrderDetails {
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
  customerInfo: {
    name: string;
    phone: string;
  };
  promoCode?: string;
}

// Initialize Stripe
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

  const selectedEvent = JSON.parse(localStorage.getItem('selectedEvent') || '{}')
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}')

  // Move calculateOrderDetails definition before its usage
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
          ? subtotal * 0.99
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

  // Memoize the calculated order details
  const calculatedOrderDetails = useMemo(() => 
    calculateOrderDetails(), 
    [calculateOrderDetails]
  )

  // Move useEffects after the function definitions
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

  // Add debug log for clientSecret
  console.log('Stripe initialized:', !!stripePromise)

  useEffect(() => {
    // Check to see if this is a redirect back from Stripe
    const query = new URLSearchParams(window.location.search);
    const payment_intent = query.get('payment_intent');
    const payment_intent_client_secret = query.get('payment_intent_client_secret');

    if (payment_intent && payment_intent_client_secret) {
      router.push('/order/confirmation');
    }
  }, [router]);

  const handlePromoCode = async (code: string) => {
    const validCodes = ['pvolve20', 'solidcore20', 'stripetesting']
    if (validCodes.includes(code.toLowerCase())) {
      setPromoCode(code)
      setPromoApplied(true)
      return true
    }
    return false
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
          name: selectedEvent.location || 'Pvolve West Hollywood',
          address: selectedEvent.address || '8417 Melrose Ave',
          city: selectedEvent.city || 'West Hollywood',
          zip: selectedEvent.zip || 'CA 90069'
        }}
        pickupTime={customerInfo.classTime}
      />
      
      {orderDetails && (
        <Elements 
          key="stripe-element"
          stripe={stripePromise} 
          options={{
            mode: 'payment',
            amount: Math.round(calculatedOrderDetails.total * 100),
            currency: 'usd',
            appearance: { theme: 'stripe' }
          }}
        >
          <PaymentForm 
            orderDetails={calculatedOrderDetails} 
          />
        </Elements>
      )}
      
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
