'use client'

import { useEffect, useState, Suspense } from 'react'
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
  const [clientSecret, setClientSecret] = useState('')

  const selectedEvent = JSON.parse(localStorage.getItem('selectedEvent') || '{}')
  const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}')

  useEffect(() => {
    // Load order details from localStorage
    const savedOrder = localStorage.getItem('currentOrder')
    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      setOrderDetails(order)
      
      // Create PaymentIntent
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: order.total,
          orderId: Date.now().toString() // Generate order ID
        })
      })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
    }
  }, [])

  useEffect(() => {
    // Check to see if this is a redirect back from Stripe
    const query = new URLSearchParams(window.location.search);
    const payment_intent = query.get('payment_intent');
    const payment_intent_client_secret = query.get('payment_intent_client_secret');

    if (payment_intent && payment_intent_client_secret) {
      // Handle successful payment here
      // You might want to redirect to a success page
      router.push('/order/confirmation');
    }
  }, [router]);

  const calculateOrderDetails = () => {
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

    // Ensure items have size and toppings from localStorage
    const items = orderDetails.items.map(item => ({
      ...item,
      size: item.size || 'Regular',
      toppings: item.toppings || {}
    }))

    const subtotal = items[0].price
    const discount = promoApplied 
      ? promoCode.toLowerCase() === 'stripetesting'
        ? subtotal * 0.99  // 99% off for testing
        : subtotal * 0.2   // Regular 20% off
      : 0
    const tax = (subtotal - discount) * 0.095
    const total = subtotal - discount + tax

    return {
      items,
      subtotal,
      discount,
      tax,
      total,
      customerInfo: orderDetails.customerInfo
    }
  }

  const handlePromoCode = async (code: string) => {
    const validCodes = ['pvolve20', 'solidcore20', 'stripetesting']
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
      
      {clientSecret && (
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: { theme: 'stripe' },
          }}
        >
          <PaymentForm orderDetails={orderDetails!} />
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
