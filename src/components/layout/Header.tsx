'use client'

import React from "react";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-recoleta text-2xl">Better Bowls</div> {/* Placeholder for logo */}
        <button className="text-white">
          <span className="sr-only">Menu</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}