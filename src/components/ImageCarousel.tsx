import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselImage {
  url: string;
  alt: string;
}

interface ImageCarouselProps {
  images?: CarouselImage[];
  interval?: number;
  caption?: string;
}

const ImageCarousel = ({
  images = [
    {
      url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1600&h=900&fit=crop",
      alt: "Yogurt bowl with fresh berries",
    },
    {
      url: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?q=80&w=1600&h=900&fit=crop",
      alt: "Protein bowl with granola",
    },
    {
      url: "https://images.unsplash.com/photo-1647102398925-e23f8c1c9f12?q=80&w=1600&h=900&fit=crop",
      alt: "Fresh fruit and yogurt bowl",
    },
  ],
  interval = 5000,
  caption = "The most delicious way to hit your protein goals",
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="w-full bg-white relative overflow-hidden">
      <div className="relative h-[400px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Card className="w-full h-full overflow-hidden">
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                className="w-full h-full object-cover"
              />
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Caption */}
      <div className="text-center py-4">
        <p className="text-xl font-semibold text-gray-900">{caption}</p>
      </div>
    </div>
  );
};

export default ImageCarousel;
