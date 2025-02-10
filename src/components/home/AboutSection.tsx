'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function AboutSection() {
  return (
    <section className="px-6 py-12 bg-sage-50">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Nice to meet you!<br />I'm Sari.</h2>
        <p className="mb-8">
          At Better Bowls, we believe that healthy eating should be simple, delicious and packed with the nutrients your body needs.
        </p>
        <p className="mb-8">
          I started going to the gym nearly 10 years ago and felt constantly fatigued, but I had no idea why—until I discovered I was severely underestimating protein. Creating Better Bowls made hitting my protein goals easy and delicious.
        </p>
        <Button variant="primary">Learn more About Us</Button>
      </div>
    </section>
  )
} 