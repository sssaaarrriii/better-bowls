'use client'

import React from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/Button";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({
  onMenuClick = () => {},
}: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-32 bg-[#5E7153] shadow-sm z-50 flex items-center justify-between px-4 md:px-6">
      <div className="w-8" /> {/* Spacer for symmetry */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="focus:outline-none"
        >
          <img
            src="/images/better-bowls-logo.png"
            alt="Better Bowls"
            className="h-28 object-contain max-w-[300px] md:max-w-[400px]"
          />
        </button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 text-[#F9ECC9] hover:text-[#F9ECC9]/80 mt-2"
        onClick={onMenuClick}
      >
        <Menu className="h-8 w-8" />
      </Button>
    </header>
  );
};

export default Header;
