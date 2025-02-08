'use client'

import React from 'react'
import Button from '../ui/Button'

interface LocationProps {
  name: string
  date: string
  time: string
  address: string
  city: string
  isUpcoming?: boolean
  image: string
  children?: React.ReactNode
}

export default function LocationCard({
  name,
  date,
  time,
  address,
  city,
  isUpcoming = false,
  image,
  children
}: LocationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm">
      <img 
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="font-recoleta text-xl text-green-900 mb-2">{name}</h3>
      <p className="text-orange-500 mb-1">{date} | {time}</p>
      <p className="text-green-900 mb-6">
        {address}<br />
        {city}
      </p>
      {children}
      <Button 
        variant="primary" 
        fullWidth
      >
        {isUpcoming ? 'Pre-Order for Pickup' : 'Order Now for Pickup'}
      </Button>
    </div>
  )
}