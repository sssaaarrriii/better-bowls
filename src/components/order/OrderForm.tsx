'use client'

import { useState } from 'react'
import { Input } from '../ui'

const CLASS_TIMES = [
  { id: '8am', label: '8AM Strength and Sculpt (Nat)' },
  { id: '930am', label: '9:30AM Sculpt and Burn (Nat)' },
  { id: '11am', label: '11AM Strength and Sculpt (Nat)' },
]

interface OrderFormProps {
  onSubmit: (data: {
    name: string
    phone: string
    classTime: string
  }) => void
  isSubmitting?: boolean
}

export default function OrderForm({ onSubmit, isSubmitting }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    classTime: '',
  })

  const isFormValid = formData.name.trim() !== '' && 
                     formData.phone.trim() !== '' && 
                     formData.classTime !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid && !isSubmitting) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-[#5E7153] text-6xl font-header text-center mb-12">
        Order
      </h1>
      
      <div className="mb-12">
        <h2 className="text-[#5E7153] text-2xl text-center mb-8 font-header">
          What name and phone number should we use for your order?
        </h2>
        
        <Input
          placeholder="Insert Name*"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mb-4"
        />
        
        <Input
          placeholder="Insert Number*"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>

      <div className="mb-12">
        <h2 className="text-[#5E7153] text-2xl text-center mb-2 font-header">
          Which class are you taking on Saturday, March 3rd?
        </h2>
        <p className="text-center text-[#5E7153] text-sm mb-6">
          We'll have your bowl ready after class!
        </p>

        <div className="space-y-3">
          {CLASS_TIMES.map((time) => (
            <button
              key={time.id}
              type="button"
              onClick={() => setFormData({ ...formData, classTime: time.id })}
              className={`
                w-full py-4 px-6 rounded-xl text-lg font-header
                transition-all duration-200
                ${formData.classTime === time.id
                  ? 'bg-[#5E7153] text-white shadow-md transform scale-[1.02]'
                  : 'bg-white text-[#5E7153] border-2 border-[#5E7153] hover:bg-[#5E7153]/10'
                }
              `}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={`
          w-full py-4 px-8 text-2xl font-header rounded-full
          transition-all duration-200 transform
          ${(!isFormValid || isSubmitting)
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-300'
            : 'text-[#5E7153] border-2 border-[#5E7153] hover:bg-[#5E7153] hover:text-white active:scale-[0.98] hover:shadow-md'
          }
        `}
      >
        {isSubmitting ? 'Processing...' : 'Next'}
      </button>
    </form>
  )
} 