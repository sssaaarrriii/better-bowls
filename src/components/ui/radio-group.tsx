import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

interface RadioGroupProps {
  options: Array<{ id: string; label: string }>
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RadioGroup({ options, value, onChange, className }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root value={value} onValueChange={onChange}>
      <div className={cn("space-y-3", className)}>
        {options.map((option) => (
          <label key={option.id} className="flex items-center space-x-3">
            <RadioGroupPrimitive.Item
              value={option.id}
              className="h-4 w-4 rounded-full border border-primary"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </RadioGroupPrimitive.Root>
  )
} 