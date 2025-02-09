'use client'

import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  fullWidth?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-full font-medium transition-colors',
        {
          'bg-green-900 text-white hover:bg-opacity-90': variant === 'primary',
          'bg-sage text-green-900 hover:bg-opacity-90': variant === 'secondary',
          'border-2 border-green-900 text-green-900 hover:bg-green-900 hover:text-white': variant === 'outline',
          'hover:bg-white/10': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3': size === 'lg',
          'p-2': size === 'icon',
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
} 