'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, ExpressCheckoutElement } from '@stripe/react-stripe-js'
import type { OrderDetails } from '@/app/checkout/page'

interface PaymentFormProps {
  orderDetails: OrderDetails
}

export default function PaymentForm({ orderDetails }: PaymentFormProps) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const createPaymentIntent = async () => {
    try {
      // Use same calculation as onClick - use pre-calculated discount
      const subtotalAmount = Math.round(orderDetails.subtotal * 100)
      const discountAmount = Math.round(orderDetails.discount * 100)
      const taxAmount = Math.round(orderDetails.tax * 100)
      
      // Apply same $0.50 minimum
      const rawFinalAmount = subtotalAmount - discountAmount + taxAmount
      const finalAmount = Math.max(rawFinalAmount, 50) // 50 cents minimum

      console.log('Payment Intent Amount:', {
        subtotal: subtotalAmount / 100,
        discount: discountAmount / 100,
        tax: taxAmount / 100,
        rawFinal: rawFinalAmount / 100,
        finalWithFloor: finalAmount / 100
      })

      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'usd',
          orderDetails
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      return data.clientSecret
    } catch (error) {
      throw new Error('Payment initialization failed')
    }
  }

  const onConfirm = async () => {
    if (!stripe || !elements || isProcessing) return

    try {
      setIsProcessing(true)
      setErrorMessage('')

      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw new Error(submitError.message ?? 'Error submitting payment')
      }

      const clientSecret = await createPaymentIntent()

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required',
      })

      if (confirmError) {
        throw new Error(confirmError.message ?? 'Payment confirmation failed')
      }

      if (paymentIntent.status === 'succeeded') {
        // Store order in Airtable
        await fetch('/api/checkout/store-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: paymentIntent.id,
            orderDetails,
            status: 'confirmed'
          })
        })

        // Send confirmation SMS
        await fetch('/api/checkout/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: orderDetails.customerInfo.phone,
            orderId: paymentIntent.id
          })
        })

        router.push(`/order/confirmation?orderId=${paymentIntent.id}`)
      }

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const onClick = ({ resolve }) => {
    // Calculate amounts for Apple/Google Pay display
    // Using same calculations as payment intent for consistency
    const subtotalAmount = Math.round(orderDetails.subtotal * 100)
    const discountAmount = Math.round(orderDetails.discount * 100)
    const taxAmount = Math.round(orderDetails.tax * 100)
    
    // Calculate final amount with $0.50 minimum
    const rawFinalAmount = subtotalAmount - discountAmount + taxAmount
    const finalAmount = Math.max(rawFinalAmount, 50) // 50 cents minimum

    console.log('Express Checkout Amounts:', {
      subtotal: subtotalAmount / 100,
      discount: discountAmount / 100,
      tax: taxAmount / 100,
      rawFinal: rawFinalAmount / 100,
      finalWithFloor: finalAmount / 100
    })

    resolve({
      phoneNumberRequired: true,
      emailRequired: false,
      lineItems: [
        {
          name: 'Subtotal',
          amount: subtotalAmount
        },
        {
          name: 'Discount',
          amount: -discountAmount
        },
        {
          name: 'Tax',
          amount: taxAmount
        }
      ],
      total: {
        label: 'Total',
        amount: finalAmount, // Use floor price if needed
        pending: false
      }
    })
  }

  return (
    <div className="space-y-4">
      {!isProcessing && (
        <ExpressCheckoutElement
          key={`${orderDetails.total}-${orderDetails.promoCode}`}
          onConfirm={onConfirm}
          onClick={onClick}
        />
      )}
      
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
      
      {isProcessing && (
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900 mx-auto" />
          <p className="text-gray-600">Processing payment...</p>
        </div>
      )}
    </div>
  )
} 