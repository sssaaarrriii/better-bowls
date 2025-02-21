'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'processing' | 'error'>('processing')
  const [error, setError] = useState('')

  useEffect(() => {
    const checkPayment = async () => {
      const payment_intent = searchParams.get('payment_intent')
      const payment_intent_client_secret = searchParams.get('payment_intent_client_secret')
      const redirect_status = searchParams.get('redirect_status')

      if (!payment_intent || !payment_intent_client_secret) {
        router.push('/')
        return
      }

      if (redirect_status === 'succeeded') {
        setStatus('success')
      } else if (redirect_status === 'failed') {
        setStatus('error')
        setError('Payment failed. Please try again.')
      }
    }

    checkPayment()

    // Only redirect on success
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [router, searchParams, status])

  if (status === 'processing') {
    return <div>Verifying payment...</div>
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <h1 className="text-red-500">Payment Failed</h1>
        <p>{error}</p>
        <Link href="/checkout" className="text-blue-500">
          Try Again
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-header text-green-900 mb-6">
        Thank you for your order!
      </h1>
      
      <p className="text-lg mb-6">
        We've sent you a text confirming your order! If you have any questions, 
        <Link 
          href="sms:+16506960570" 
          className="text-green-900 underline ml-1"
        >
          text us directly at (650) 696-0570
        </Link>
      </p>

      <p className="text-gray-600 text-sm">
        Redirecting to home page in 5 seconds...
      </p>
    </div>
  )
}

// Wrap the page content in Suspense
export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
} 