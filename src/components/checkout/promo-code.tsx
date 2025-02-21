'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PromoCodeProps {
  subtotal: number
  onApplyPromo: (discount: number, code: string) => void
}

export default function PromoCode({ subtotal, onApplyPromo }: PromoCodeProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleApply = async () => {
    if (!code) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Valid promo codes and their discount percentages
      const validCodes = {
        'PVOLVE20': 0.20,
        'SOLIDCORE20': 0.20,
        'STRIPETESTING': 0.90
      }

      const discount = validCodes[code.toUpperCase()]
      if (!discount) {
        setError('Invalid promo code')
        return
      }

      const discountAmount = subtotal * discount
      onApplyPromo(discountAmount, code)
      setSuccess('Promo code applied successfully!')
    } catch (err) {
      setError('Error applying promo code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1"
          disabled={success !== ''}
        />
        <Button
          onClick={handleApply}
          disabled={!code || isLoading || success !== ''}
          variant="secondary"
          size="sm"
        >
          {success ? 'Applied' : 'Apply'}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
    </div>
  )
} 