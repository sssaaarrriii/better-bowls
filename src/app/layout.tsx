import React from "react";
import "../styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import localFont from 'next/font/local'
import { Mulish } from 'next/font/google'

const recoleta = localFont({
  src: '../../public/fonts/Recoleta-RegularDEMO.otf',
  variable: '--font-header'
})

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-body',
})

// Note: You'll need to either load Myriad and Baskerville similarly,
// or use fallback system fonts

/**
 * Root Layout Component
 * 
 * The main layout wrapper for the entire application.
 * Handles:
 * - Font loading (Recoleta, Mulish)
 * - Global styles
 * - Common layout elements (Header, Footer)
 * - HTML structure and metadata
 * 
 * This component wraps every page in the application and provides
 * consistent styling and structure across all routes.
 */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${recoleta.variable} ${mulish.variable}`}>
      <head>
        {/* Remove this line as it's not needed */}
        {/* <link rel="stylesheet" href={fraunces.style.fontDisplay} /> */}
      </head>
      <body className={mulish.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}