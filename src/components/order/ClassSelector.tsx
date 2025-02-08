'use client'

import { useState } from 'react'
import clsx from 'clsx'

interface ClassOption {
  time: string
  instructor: string
  name: string
}

interface ClassSelectorProps {
  selectedClass: string
  onSelect: (classTime: string) => void
  error?: string
}

const CLASS_OPTIONS: ClassOption[] = [
  { time: '8AM', instructor: 'Nat', name: 'Strength and Sculpt' },
  { time: '9:30AM', instructor: 'Nat', name: 'Sculpt and Burn' },
  { time: '11AM', instructor: 'Nat', name: 'Strength and Sculpt' },
  { time: '12PM', instructor: 'Barney', name: 'Strength and Sculpt' },
  { time: '1PM', instructor: 'Barney', name: 'Strength and Sculpt' },
]

export default function ClassSelector({
  selectedClass,
  onSelect,
  error,
}: ClassSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-recoleta text-lg">
        Which class are you taking on Saturday, March 3rd?
      </h3>
      <p className="text-sm text-gray-600">
        We'll have your bowl ready after class!
      </p>
      <div className="space-y-2">
        {CLASS_OPTIONS.map((classOption) => (
          <button
            key={classOption.time}
            onClick={() => onSelect(`${classOption.time} ${classOption.name} (${classOption.instructor})`)}
            className={clsx(
              'w-full p-4 rounded-lg border-2 text-left transition-colors',
              selectedClass === `${classOption.time} ${classOption.name} (${classOption.instructor})`
                ? 'border-green-900 bg-green-900 text-white'
                : 'border-green-900/20 hover:border-green-900/40'
            )}
          >
            <div className="font-recoleta">
              {classOption.time} {classOption.name}
            </div>
            <div className="text-sm opacity-80">with {classOption.instructor}</div>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
} 