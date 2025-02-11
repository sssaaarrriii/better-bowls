'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-green-900 text-white hover:bg-opacity-90",
        secondary: "bg-sage text-green-900 hover:bg-opacity-90",
        outline: "border-2 border-green-900 text-green-900 hover:bg-green-900 hover:text-white",
        ghost: "hover:bg-white/10"
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3",
        icon: "p-2"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'default', 
    size = 'default', 
    fullWidth = false,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      default: 'bg-[#5E7153] text-white hover:bg-[#5E7153]/90',
      outline: 'border border-[#5E7153] text-[#5E7153] hover:bg-[#5E7153]/10',
      secondary: 'bg-[#5E7153]/10 text-[#5E7153] hover:bg-[#5E7153]/20'
    }
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8'
    }
    
    const widthClass = fullWidth ? 'w-full' : ''
    
    const combinedClassName = `
      ${baseStyles}
      ${variants[variant as keyof typeof variants] || variants.default}
      ${sizes[size as keyof typeof sizes] || sizes.default}
      ${widthClass}
      ${className}
    `.trim()

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button } 