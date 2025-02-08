import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Clock } from "lucide-react";

interface LocationCardProps {
  gymName?: string;
  date?: string;
  time?: string;
  address?: string;
  isCurrentEvent?: boolean;
}

const LocationCard = ({
  gymName = "Pvolve SF",
  date = "January 22, 2025",
  time = "8:00 AM",
  address = "1256 Mission St, San Francisco, CA 94103",
  isCurrentEvent = false,
}: LocationCardProps) => {
  const handleAddressClick = () => {
    window.open(
      `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      "_blank",
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">{gymName}</h3>

          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{`${date} at ${time}`}</span>
          </div>

          <div
            className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-blue-600"
            onClick={handleAddressClick}
          >
            <MapPin className="w-4 h-4" />
            <span className="underline">{address}</span>
          </div>

          <Button
            className={`w-full ${isCurrentEvent ? "bg-green-600" : "bg-blue-600"} hover:opacity-90 text-white py-3 rounded-lg transition-colors duration-200`}
          >
            {isCurrentEvent ? "Order Now for Pickup" : "Pre-order for Pickup"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
