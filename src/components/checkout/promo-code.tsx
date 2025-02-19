'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PromoCodeProps {
  onApply: (code: string) => Promise<boolean>
}

export default function PromoCode({ onApply }: PromoCodeProps) {
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
      const isValid = await onApply(code)
      if (isValid) {
        setSuccess('Promo code applied successfully!')
      } else {
        setError('Invalid promo code')
      }
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