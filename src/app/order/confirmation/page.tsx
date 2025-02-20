'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import OrderSummary from '@/components/checkout/order-summary'
import type { OrderDetails } from '@/app/checkout/page'

function ConfirmationContent() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get order details from localStorage
    const savedOrder = localStorage.getItem('currentOrder')
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder))
      // Clear cart after successful payment
      localStorage.removeItem('currentOrder')
    } else {
      // If no order details, redirect to home
      router.push('/')
    }
  }, [router])

  return (
    <div className="max-w-2xl mx-auto p-4 pt-32">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h1 className="font-recoleta text-3xl mb-2 text-green-800">Order Confirmed!</h1>
        <p className="text-green-700">
          Thank you for your order. We'll have it ready for pickup after your class.
        </p>
      </div>

      {orderDetails && (
        <div className="space-y-6">
          <OrderSummary orderDetails={orderDetails} />
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-recoleta text-xl mb-4">Pickup Details</h3>
            <div className="space-y-2">
              <p className="font-medium">
                {orderDetails.customerInfo.name}
              </p>
              <p className="text-gray-600">
                {orderDetails.customerInfo.phone}
              </p>
              <div className="h-px bg-gray-200 my-4" />
              <p className="text-gray-600">
                Your order will be ready for pickup 50 minutes after your class starts.
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>A confirmation email has been sent to your phone number.</p>
            <p>Order ID: {searchParams.get('payment_intent') || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Wrap the main content in Suspense
export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto p-4 pt-32 text-center">
        Loading order details...
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
} 