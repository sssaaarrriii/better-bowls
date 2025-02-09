import Image from 'next/image'
import Link from 'next/link'
import { LocationCard } from '@/components/ui/LocationCard'
// Keep the import but comment it out for now
// import { Slideshow } from '../components/ui/Slideshow'

interface LocationCard {
  image: string
  name: string
  date: string
  time: string
  address: string
  city: string
  zip: string
  isUpcoming?: boolean
}

const locations: LocationCard[] = [
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
]

const benefits = [
  {
    icon: '🏋️‍♂️',
    text: '40g of high quality protein muscle recovery and energy'
  },
  {
    icon: '⚡',
    text: 'Packed with energy from ingredients to fuel your day'
  },
  {
    icon: '🥄',
    text: 'Supports optimal greek yogurt'
  }
]

const proteinInfo = [
  {
    icon: '🧬',
    text: 'Has all essential amino acids for muscle recovery'
  },
  {
    icon: '🍯',
    text: 'No refined sugar'
  },
  {
    icon: '🥄',
    text: 'Highly purified protein powder easier for digestion'
  }
]

export default function Home() {
  return (
    <main className="bg-[#fcfce4]">
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] min-h-[280px] overflow-hidden">
        <Image
          src="/images/slideshow-image1.png"
          alt="Better Bowls hero image"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Locations Section - reduced spacing */}
      <section className="px-4 pb-8 pt-8 bg-[#fcfce4]">
        <h2 className="text-reseda-green text-3xl font-header font-black text-center mb-8">
          Locations
        </h2>
        
        <div className="max-w-md mx-auto">
          {/* Fred Fitness Location */}
          <LocationCard
            image="/images/fred-fitness.jpg"
            name="Fred Fitness Santa Monica"
            date="Saturday, February 15"
            time="10AM-4PM"
            address="1544 4th St."
            city="Santa Monica"
            zip="CA 90401"
          />

          {/* Coming Up Text - changed from "Coming Soon" */}
          <h2 className="text-reseda-green text-2xl font-header font-black text-center my-8">
            Coming Up
          </h2>

          {/* Pvolve Location */}
          <LocationCard
            image="/images/pvolve.png"
            name="Pvolve West Hollywood"
            date="Saturday, March 3"
            time="8AM-2PM"
            address="8417 Melrose Ave."
            city="West Hollywood"
            zip="CA 90069"
            isUpcoming={true}
          />
        </div>
      </section>

      {/* Squiggle Divider Image */}
      <Image
        src="/images/squiggle_divider.png"
        alt="Decorative divider"
        width={1440}
        height={200}
        className="w-full block"
      />{/* About Section - updated text */}
      <section className="px-4 py-12 bg-reseda-green">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-white text-3xl font-header mb-4">
            Nice to meet you! I'm Sari.
          </h2>
          <p className="text-white mb-6 font-body">
            I like pushing at the gym and felt constantly fatigued, but I had no idea why—until I discovered I was severely undereating protein. Eating 150g a day felt impossible, so I created Better Bowls to make the perfect recipe that's both nutritious and delicious. That's how Better Bowls was born!
          </p>
          <Link
            href="/about"
            className="inline-block py-3 px-8 text-lg font-header text-white border-2 border-white rounded-full hover:bg-white hover:text-reseda-green transition-colors"
          >
            Learn more About Us
          </Link>
        </div>
      </section>
    </main>
  )
} 