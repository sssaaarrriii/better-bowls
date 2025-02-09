import { InputHTMLAttributes } from 'react'
import classNames from 'classnames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  className?: string
}

export function Input({ className = '', error, ...props }: InputProps) {
  return (
    <input
      className={classNames(
        'w-full px-4 py-3 rounded-full border-2 border-[#5E7153] text-[#5E7153] placeholder-[#5E7153] focus:outline-none focus:ring-2 focus:ring-[#5E7153]',
        error && 'border-red-500',
        className
      )}
      {...props}
    />
  )
} 