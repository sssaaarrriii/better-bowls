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

export function Button({ variant, size, fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size }),
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  )
} 