'use client'

import LocationCard from './LocationCard'
import Link from 'next/link'

export default function LocationSection() {
  return (
    <section>
      <h2 className="font-recoleta text-3xl text-green-900 mb-12">Locations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LocationCard
          name="Fred Fitness Santa Monica"
          date="Saturday, February 15"
          time="10AM-4PM"
          address="1544 4th St."
          city="Santa Monica, CA 90401"
          image="/images/fred-fitness.jpg"
        >
          <Link 
            href="/order" 
            className="block w-full text-center py-4 px-8 text-xl font-header text-[#5E7153] border-2 border-[#5E7153] rounded-full hover:bg-[#5E7153] hover:text-white transition-colors"
          >
            Order for Pickup
          </Link>
        </LocationCard>
        <LocationCard
          name="Pvolve West Hollywood"
          date="Saturday, March 3"
          time="8AM-2PM"
          address="8417 Melrose Ave."
          city="West Hollywood, CA 90069"
          isUpcoming
          image="/images/pvolve.png"
        >
          <Link 
            href="/order" 
            className="block w-full text-center py-4 px-8 text-xl font-header text-[#5E7153] border-2 border-[#5E7153] rounded-full hover:bg-[#5E7153] hover:text-white transition-colors"
          >
            Order for Pickup
          </Link>
        </LocationCard>
      </div>
    </section>
  )
} 