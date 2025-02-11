import React from "react";
import LocationCard from "./LocationCard";

interface Location {
  name: string;
  date: string;
  time: string;
  address: string;
  city: string;
  zip: string;
  isUpcoming?: boolean;
  image: string;
}

interface LocationGridProps {
  locations?: Location[];
}

const LocationGrid = ({
  locations = [
    {
      image: '/images/fred-fitness.jpg',
      name: 'Fred Fitness Santa Monica',
      date: 'Saturday, February 15',
      time: '10AM-4PM',
      address: '1544 4th St.',
      city: 'Santa Monica',
      zip: 'CA 90401',
    },
    {
      image: '/images/pvolve.png',
      name: 'Pvolve West Hollywood',
      date: 'Saturday, March 3',
      time: '8AM-2PM',
      address: '8417 Melrose Ave.',
      city: 'West Hollywood',
      zip: 'CA 90069',
      isUpcoming: true,
    },
  ],
}: LocationGridProps) => {
  return (
    <div className="bg-[#fcfce4] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-header text-center mb-8">Find Us</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {locations.map((location, index) => (
            <LocationCard
              key={index}
              name={location.name}
              date={location.date}
              time={location.time}
              address={location.address}
              city={location.city}
              zip={location.zip}
              isUpcoming={location.isUpcoming}
              image={location.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationGrid;
