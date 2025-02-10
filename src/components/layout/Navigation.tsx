'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// This component creates an animated navigation menu/sidebar that slides in from the right
// Props:
// - isOpen: boolean to control if the navigation is visible
// - onClose: function to call when closing the navigation
interface NavigationProps {
  isOpen: boolean
  onClose: () => void
}

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  // Define the navigation menu items with their URLs and labels
  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' }, 
    { href: '/order', label: 'Order Now' },
    { href: '/locations', label: 'Locations' },
  ]

  return (
    // AnimatePresence enables exit animations when the menu closes
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Semi-transparent overlay that closes menu when clicked */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          {/* Navigation menu panel that slides in from right */}
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-64 bg-beige z-50 p-6"
          >
            {/* Menu items container */}
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-recoleta text-xl text-green-900 hover:text-sage"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}