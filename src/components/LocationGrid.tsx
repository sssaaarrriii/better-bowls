import React from "react";
import LocationCard from "./LocationCard";

interface Location {
  gymName: string;
  date: string;
  time: string;
  address: string;
  isCurrentEvent: boolean;
}

interface LocationGridProps {
  locations?: Location[];
}

const LocationGrid = ({
  locations = [
    {
      gymName: "Pvolve SF - Mission",
      date: "January 22, 2024",
      time: "8:00 AM",
      address: "1256 Mission St, San Francisco, CA 94103",
      isCurrentEvent: true,
    },
    {
      gymName: "Pvolve SF - Marina",
      date: "January 22, 2024",
      time: "9:30 AM",
      address: "2055 Union St, San Francisco, CA 94123",
      isCurrentEvent: false,
    },
    {
      gymName: "Pvolve SF - SoMa",
      date: "January 22, 2024",
      time: "11:00 AM",
      address: "768 Brannan St, San Francisco, CA 94103",
      isCurrentEvent: false,
    },
  ],
}: LocationGridProps) => {
  return (
    <div className="w-full bg-gray-50 p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Available Pickup Locations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {locations.map((location, index) => (
          <LocationCard
            key={index}
            gymName={location.gymName}
            date={location.date}
            time={location.time}
            address={location.address}
            isCurrentEvent={location.isCurrentEvent}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationGrid;
