'use client'

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { MapPin, Clock } from "lucide-react";
import Link from 'next/link';

interface LocationCardProps {
  image: string;
  name: string;
  date: string;
  time: string;
  address: string;
  city: string;
  zip: string;
  isUpcoming?: boolean;
}

const LocationCard = ({
  image,
  name,
  date,
  time,
  address,
  city,
  zip,
  isUpcoming = false,
}: LocationCardProps) => {
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
          alt={`${name} location`}
          fill
          className="object-cover rounded-t-lg"
          priority
        />
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>

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
              <p className="underline">{address}</p>
              <p className="underline">{`${city}, ${zip}`}</p>
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

export default LocationCard;
