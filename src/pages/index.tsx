import React from "react";
import Header from "../components/Header";
import ImageCarousel from "../components/ImageCarousel";
import LocationGrid from "../components/LocationGrid";
import NavigationCards from "../components/NavigationCards";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main content with top padding for fixed header */}
      <main className="pt-20">
        {/* Image Carousel */}
        <ImageCarousel />

        {/* Location Grid */}
        <LocationGrid />

        {/* Navigation Cards */}
        <NavigationCards />
      </main>

      {/* Footer spacing */}
      <div className="h-16" />
    </div>
  );
};

export default HomePage;
