'use client'

import { useState } from 'react'
import { useStripe, useElements, ExpressCheckoutElement } from '@stripe/react-stripe-js'
import type { OrderDetails } from '@/app/checkout/page'

interface PaymentFormProps {
  orderDetails: OrderDetails
}

export default function PaymentForm({ orderDetails }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState('')

  const onConfirm = async () => {
    if (!stripe || !elements) return

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setErrorMessage(submitError.message ?? 'Error submitting payment')
      return
    }

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: orderDetails.total,
        orderId: Date.now().toString(),
        promoCode: orderDetails.promoCode
      })
    })

    if (!res.ok) {
      setErrorMessage('Payment failed. Please try again.')
      return
    }

    const { client_secret: clientSecret } = await res.json()

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/order/confirmation`,
        payment_method_data: {
          billing_details: {
            name: orderDetails.customerInfo.name,
            phone: orderDetails.customerInfo.phone
          }
        }
      }
    })

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed')
    }
  }

  return (
    <div className="space-y-4">
      <ExpressCheckoutElement 
        onConfirm={onConfirm}
        onClick={({ resolve }) => {
          resolve({
            emailRequired: true,
            phoneNumberRequired: true,
            lineItems: [{
              name: orderDetails.items[0].name,
              amount: Math.round(orderDetails.total * 100)
            }]
          })
        }}
      />
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
    </div>
  )
} 