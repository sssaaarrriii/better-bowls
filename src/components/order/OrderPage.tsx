'use client'

/*
OrderPage.tsx vs OrderForm.tsx Explanation:

OrderPage.tsx:
- This is the parent/container component that manages the order flow
- Handles customer information submission
- Routes to the product customization page
- Acts as the entry point for the ordering process

OrderForm.tsx: 
- This is a child component focused only on collecting customer information
- Handles its own form state (name, phone, class time)
- Validates and submits form data back to parent via onSubmit prop
- Only concerned with the customer info collection step
*/

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import OrderForm from './OrderForm'

interface CustomerInfo {
  name: string
  phone: string
  classTime: string
}

export default function OrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleCustomerSubmit = async (data: CustomerInfo) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      localStorage.setItem('customerInfo', JSON.stringify(data))
      router.push('/order/customize')
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 bg-beige">
      <OrderForm 
        onSubmit={handleCustomerSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  )
}