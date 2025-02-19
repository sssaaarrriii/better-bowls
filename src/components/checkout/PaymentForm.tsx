'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import type { OrderDetails } from '@/app/checkout/page'

interface PaymentFormProps {
  orderDetails: OrderDetails & {
    customerInfo: {
      name: string;
      phone: string;
    };
  };
}

export default function PaymentForm({ orderDetails }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setError('')

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) throw submitError

      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/confirmation`,
          payment_method_data: {
            billing_details: {
              name: orderDetails.customerInfo.name,
              phone: orderDetails.customerInfo.phone,
            }
          }
        }
      })

      if (paymentError) throw paymentError
    } catch (err: any) {
      setError(err.message || 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        fullWidth
      >
        {isProcessing ? 'Processing...' : 'Pay now'}
      </Button>
      
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
    </form>
  )
} 