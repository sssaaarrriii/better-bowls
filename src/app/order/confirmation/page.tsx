'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OrderConfirmation() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

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