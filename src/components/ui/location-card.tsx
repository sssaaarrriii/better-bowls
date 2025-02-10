import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

interface LocationCardProps {
  image: string
  name: string
  date: string
  time: string
  address: string
  city: string
  zip: string
  isUpcoming?: boolean
}

export function LocationCard({
  image,
  name,
  date,
  time,
  address,
  city,
  zip,
  isUpcoming
}: LocationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <Image
        src={image}
        alt={name}
        width={400}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="font-header font-bold text-xl text-reseda-green mb-2 underline decoration-sage decoration-2">
          {name}
        </h3>
        <p className="mb-1">
          <span className="font-header font-bold text-[#FF9B3E]">
            {date} | {time}
          </span>
        </p>
        <Link 
          href={`https://maps.google.com/?q=${encodeURIComponent(
            `${address} ${city} ${zip}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-reseda-green hover:no-underline mb-4"
        >
          <p className="font-header">{address}</p>
          <p className="font-header">{`${city}, ${zip}`}</p>
        </Link>
        <Link
          href="/order"
          className="block w-full py-3 text-center bg-reseda-green text-[#FCFCE4] border-2 border-[#A8B589] rounded-full hover:bg-white hover:text-reseda-green transition-colors font-header font-semibold"
        >
          {isUpcoming ? 'Pre-Order for Pickup' : 'Order Now for Pickup'}
        </Link>
      </div>
    </div>
  )
} 