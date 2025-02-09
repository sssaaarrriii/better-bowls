'use client'

/*
OrderPage.tsx vs OrderForm.tsx Explanation:

OrderPage.tsx:
- This is the parent/container component that manages the overall order flow
- Handles the main state management (current step and customer info)
- Controls which component to show (OrderForm or BowlSelection)
- Acts as the orchestrator between different order steps

OrderForm.tsx: 
- This is a child component focused only on collecting customer information
- Handles its own form state (name, phone, class time)
- Validates and submits form data back to parent via onSubmit prop
- Only concerned with the customer info collection step
*/

import { useState } from 'react'
import OrderForm from './OrderForm'
import BowlSelection from './BowlSelection'

interface CustomerInfo {
  name: string
  phone: string
  classTime: string
}

export default function OrderPage() {
  const [step, setStep] = useState<'customer-info' | 'bowl-selection'>('customer-info')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)

  const handleCustomerSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data)
    setStep('bowl-selection')
  }

  return (
    <div className="min-h-screen pt-32 bg-beige">
      {step === 'customer-info' ? (
        <OrderForm onSubmit={handleCustomerSubmit} />
      ) : (
        <BowlSelection customerInfo={customerInfo} />
      )}
    </div>
  )
}