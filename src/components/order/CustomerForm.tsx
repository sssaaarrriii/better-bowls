'use client'

import { useState } from 'react'
import { type Customer } from '../../lib/types'
import Button from '../ui/Button'

const CLASSES = [
  '8AM Strength and Sculpt (Nat)',
  '9:30AM Sculpt and Burn (Nat)',
  '11AM Strength and Sculpt (Nat)'
]

interface CustomerFormProps {
  onSubmit: (data: Customer) => void
}

export default function CustomerForm({ onSubmit }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    class: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Select Class</label>
        {CLASSES.map((classTime) => (
          <button
            key={classTime}
            type="button"
            className={`w-full p-3 mb-2 rounded-md text-left ${
              formData.class === classTime
                ? 'bg-green-900 text-beige'
                : 'bg-beige text-green-900'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, class: classTime }))}
          >
            {classTime}
          </button>
        ))}
      </div>

      <Button type="submit" fullWidth>Continue</Button>
    </form>
  )
}
  