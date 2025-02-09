'use client'

import { useState } from 'react'
import { Input } from '../ui'
import { RadioGroup } from '../ui'

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
}

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    classTime: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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

        <RadioGroup
          options={CLASS_TIMES}
          value={formData.classTime}
          onChange={(value) => setFormData({ ...formData, classTime: value })}
          className="space-y-4"
        />
      </div>

      <button
        type="submit"
        className="w-full py-4 px-8 text-2xl font-header text-[#5E7153] border-2 border-[#5E7153] rounded-full hover:bg-[#5E7153] hover:text-white transition-colors"
      >
        Next
      </button>
    </form>
  )
} 