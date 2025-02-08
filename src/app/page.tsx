import Image from 'next/image'
import Link from 'next/link'

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
    icon: '/images/slideshow-image1.jpg',
    text: '40g of high quality protein muscle recovery and energy'
  },
  {
    icon: '/images/slideshow-image2.png',
    text: 'Packed with energy from ingredients to fuel your day'
  },
  {
    icon: '/images/slideshow-image4.png',
    text: 'Supports optimal greek yogurt'
  }
]

const proteinInfo = [
  {
    icon: '/images/slideshow-image5.png',
    text: 'Has all essential amino acids for muscle recovery'
  },
  {
    icon: '/images/slidwhow-image3.png',
    text: 'No refined sugar'
  },
  {
    icon: '/images/Order Page White-1.png',
    text: 'Highly purified protein powder easier for digestion'
  }
]

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src="/images/Order Page White-1.png"
          alt="Better Bowls"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <h1 className="text-white text-4xl md:text-5xl font-header max-w-md px-4">
            High-Protein. All Natural. Seriously Delicious.
          </h1>
        </div>
      </div>

      {/* Locations Section */}
      <section className="px-4 py-12 bg-beige">
        <h2 className="text-green-900 text-3xl font-header text-center mb-8">
          Locations
        </h2>
        
        <div className="max-w-md mx-auto space-y-6">
          {locations.map((location, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <Image
                src={location.image}
                alt={location.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-header text-green-900 mb-2">{location.name}</h3>
              <p className="text-sage mb-1">{location.date}</p>
              <p className="text-sage mb-2">{location.time}</p>
              <p className="text-sage">{location.address}</p>
              <p className="text-sage mb-4">{`${location.city}, ${location.zip}`}</p>
              <Link
                href="/order"
                className="inline-block w-full py-3 px-6 text-center text-green-900 border-2 border-green-900 rounded-full hover:bg-green-900 hover:text-white transition-colors"
              >
                {location.isUpcoming ? 'Pre-Order for Pickup' : 'Order Now for Pickup'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-12 bg-dutch-white">
        <h2 className="text-green-900 text-3xl font-header text-center mb-12">
          Benefits of Better Bowls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <Image
                  src={benefit.icon}
                  alt={benefit.text}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-green-900 text-sm">{benefit.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-green-900 text-3xl font-header text-center mb-12">
          About our Greek Yogurt and Protein Blend
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {proteinInfo.map((info, index) => (
            <div key={index} className="text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <Image
                  src={info.icon}
                  alt={info.text}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-green-900 text-sm">{info.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-12 bg-beige">
        <div className="max-w-md mx-auto text-center">
          <Image
            src="/images/Order Page White-1.png"
            alt="Founder"
            width={200}
            height={200}
            className="rounded-full mx-auto mb-6 object-cover"
          />
          <h2 className="text-green-900 text-3xl font-header mb-4">
            Nice to meet you! I'm Sari.
          </h2>
          <p className="text-green-900 mb-6">
            At Better Bowls, we believe that healthy eating should be simple, delicious and packed with the nutrition your body needs.
          </p>
          <Link
            href="/about"
            className="inline-block py-3 px-8 text-lg font-header text-green-900 border-2 border-green-900 rounded-full hover:bg-green-900 hover:text-white transition-colors"
          >
            Learn more About Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <Image
            src="/logo-white.png"
            alt="Better Bowls"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <p className="mb-2">sari@betterbowls.la</p>
          <p>650-696-0570</p>
        </div>
      </footer>
    </main>
  )
} 