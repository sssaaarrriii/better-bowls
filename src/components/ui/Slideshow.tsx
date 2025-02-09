'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const images = [
  {
    src: '/images/slideshow-image1.png',
    alt: 'Multiple protein yogurt bowls with fresh berries and toppings'
  },
  {
    src: '/images/slideshow-image2.png',
    alt: 'Close up of protein yogurt bowl with fresh berries and coconut'
  },
  {
    src: '/images/slideshow-image3.png',
    alt: 'Fresh ingredients: blueberries, bananas, and strawberries'
  }
]

export function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tagline Section */}
      <div className="bg-beige py-8 px-4 text-center">
        <h2 className="text-reseda-green text-3xl md:text-4xl font-header max-w-2xl mx-auto leading-tight">
          The most delicious way to get your protein
        </h2>
      </div>
    </>
  )
} 