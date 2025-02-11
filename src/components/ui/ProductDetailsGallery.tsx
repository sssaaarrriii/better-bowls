'use client'

import { useState } from 'react'
import Image from 'next/image'

const GALLERY_IMAGES = [
  {
    src: '/images/mediumbowl2.png',
    alt: 'Classic Energy Bowl with fresh berries and toppings'
  },
  {
    src: '/images/mediumbowl1.png',
    alt: 'Energy Bowl with granola and fruit'
  },
  {
    src: '/images/heroimage2.png',
    alt: 'Better Bowls presentation'
  }
]

export function ProductDetailsGallery() {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Image */}
      <div className="relative w-full aspect-square mb-4">
        <Image
          src={GALLERY_IMAGES[selectedImage].src}
          alt={GALLERY_IMAGES[selectedImage].alt}
          fill
          className="object-cover rounded-lg transition-opacity duration-300"
          priority
        />
      </div>

      {/* Scrollable Thumbnails */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {GALLERY_IMAGES.map((image, index) => (
          <button
            key={image.src}
            onClick={() => setSelectedImage(index)}
            className={`relative flex-none w-20 aspect-square rounded-lg overflow-hidden 
              ${selectedImage === index ? 'ring-2 ring-reseda-green' : ''}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
} 