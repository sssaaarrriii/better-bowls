import { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={clsx(
        'bg-white rounded-lg shadow-md',
        className
      )} 
      {...props} 
    />
  )
} 