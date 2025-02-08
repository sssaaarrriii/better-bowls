'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../ui/Button'

interface PaymentButtonProps {
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

export default function PaymentButton({
  amount,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      // In a real implementation, this would integrate with Apple Pay/Google Pay
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onSuccess()
      router.push('/checkout/confirmation')
    } catch (error) {
      onError('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      fullWidth
      className="bg-black text-white hover:bg-black/90"
    >
      {isProcessing ? 'Processing...' : 'Pay with Apple Pay'}
    </Button>
  )
}