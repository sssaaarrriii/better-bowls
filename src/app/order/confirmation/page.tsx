'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check payment status
    const checkPayment = async () => {
      const payment_intent = searchParams.get('payment_intent')
      
      if (!payment_intent) {
        router.push('/')
        return
      }

      setIsLoading(false)
    }

    checkPayment()

    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router, searchParams])

  if (isLoading) {
    return <div>Verifying payment...</div>
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