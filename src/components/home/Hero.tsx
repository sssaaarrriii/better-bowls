'use client'

export default function Hero() {
  return (
    <div className="relative h-[80vh] min-h-[600px]">
      <img
        src="/images/hero-bowls.jpg"
        alt="Better Bowls with fresh fruits and toppings"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <h1 className="font-recoleta text-4xl md:text-6xl text-white max-w-2xl leading-tight">
          High-Protein. All Natural.
          <br />
          Seriously Delicious.
        </h1>
      </div>
    </div>
  )
}
  