 'use client'

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import Link from 'next/link';

interface EventCardProps {
  image: string;
  eventLocation: string;  // renamed from 'name'
  eventName?: string;     // new optional field
  date: string;
  time: string;
  address: string;
  city: string;
  zip: string;
  isUpcoming?: boolean;
}

const EventCard = ({
  image,
  eventLocation,
  eventName,
  date,
  time,
  address,
  city,
  zip,
  isUpcoming = false,
}: EventCardProps) => {
  const handleAddressClick = () => {
    window.open(
      `https://maps.google.com/?q=${encodeURIComponent(`${address} ${city} ${zip}`)}`,
      "_blank",
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={`${eventLocation} location`}
          fill
          className="object-cover rounded-t-lg"
          priority
        />
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900">{eventLocation}</h3>
            {eventName && (
              <h4 className={`text-lg font-semibold text-gray-900 inline-block px-2 rounded ${
                eventLocation.includes('solidcore') ? 'bg-[#D5E3F0]' : 'bg-[#F5E6D3]'
              }`}>
                {eventName}
              </h4>
            )}
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{`${date} at ${time}`}</span>
          </div>

          <div
            className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-blue-600"
            onClick={handleAddressClick}
          >
            <MapPin className="w-4 h-4" />
            <div>
              <p>{address}</p>
              <p>{`${city}, ${zip}`}</p>
            </div>
          </div>

          <Link
            href="/order"
            className="block w-full py-3 text-center bg-reseda-green text-[#FCFCE4] border-2 border-[#A8B589] rounded-full hover:bg-white hover:text-reseda-green transition-colors font-header font-semibold"
          >
            {isUpcoming ? 'Pre-Order for Pickup' : 'Order Now for Pickup'}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;