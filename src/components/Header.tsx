import React from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
  logoUrl?: string;
}

const Header = ({
  onMenuClick = () => {},
  logoUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=50&fit=crop&crop=center",
}: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white shadow-sm z-50 flex items-center justify-between px-4 md:px-6">
      <div className="w-8" /> {/* Spacer for symmetry */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="focus:outline-none"
        >
          <img
            src={logoUrl}
            alt="Better Bowls"
            className="h-12 object-contain"
          />
        </button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default Header;
