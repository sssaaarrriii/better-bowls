import React from 'react'
import clsx from 'clsx'

interface Option {
  id: string
  label: string
}

interface RadioGroupProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function RadioGroup({ options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={className}>
      {options.map((option) => (
        <label
          key={option.id}
          className={clsx(
            'flex items-center p-4 rounded-full border-2 border-[#5E7153] cursor-pointer',
            value === option.id && 'bg-[#5E7153] text-white'
          )}
        >
          <input
            type="radio"
            name="radio-group"
            value={option.id}
            checked={value === option.id}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
} 