'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/Button'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-[#fcfce4] z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-reseda-green hover:text-reseda-green/80"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <nav className="mt-16 space-y-6">
            <Link 
              href="/"
              className="block text-xl font-header text-reseda-green hover:opacity-80 transition-opacity"
              onClick={onClose}
            >
              Home
            </Link>
            <Link 
              href="/about"
              className="block text-xl font-header text-reseda-green hover:opacity-80 transition-opacity"
              onClick={onClose}
            >
              About Us
            </Link>
            <Link 
              href="/order"
              className="block text-xl font-header text-reseda-green hover:opacity-80 transition-opacity"
              onClick={onClose}
            >
              Order Now
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
} 