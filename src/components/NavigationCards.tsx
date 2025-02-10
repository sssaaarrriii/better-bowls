import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from 'next/link'

interface NavigationCardProps {
  title?: string;
  imageSrc?: string;
  linkTo?: string;
}

const NavigationCard = ({
  title = "Navigation Item",
  imageSrc = "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=300&fit=crop",
  linkTo = "/",
}: NavigationCardProps) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-0">
      <div className="relative">
        <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />
        <Link href={linkTo}>
          <Button
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                       bg-white text-black hover:bg-gray-100 font-semibold
                       min-w-32 shadow-lg"
          >
            {title}
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

interface NavigationCardsProps {
  cards?: Array<{
    title: string;
    imageSrc: string;
    linkTo: string;
  }>;
}

const NavigationCards = ({
  cards = [
    {
      title: "About Us",
      imageSrc:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      linkTo: "/about",
    },
    {
      title: "Order",
      imageSrc:
        "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=300&fit=crop",
      linkTo: "/order",
    },
    {
      title: "Locations",
      imageSrc:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
      linkTo: "/locations",
    },
  ],
}: NavigationCardsProps) => {
  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <NavigationCard
              key={index}
              title={card.title}
              imageSrc={card.imageSrc}
              linkTo={card.linkTo}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationCards;
