import Image from 'next/image'
import { Card } from '../../components/ui/Card'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="font-recoleta text-4xl mb-6">Our Story</h1>
        <Image
          src="/images/about/founder-large.jpg"
          alt="Better Bowls founder"
          width={300}
          height={300}
          className="rounded-full mx-auto mb-8"
        />
      </div>

      <div className="space-y-8">
        <Card className="p-8">
          <p className="text-lg mb-6">
            Hey! My name is Sari and I wanted to share a little bit about the story behind Better Bowls.
          </p>

          <p className="mb-6">
            I started going to the gym nearly 10 years ago and I started working out more seriously about 5 years ago. As I was pushing myself at the gym, I started feeling more tired and fatigued in my day to day life. On top of that, my progress started to plateau and I was feeling frustrated, but I wasn't sure why.
          </p>

          <p className="mb-6">
            After many conversations with gym friends and a consultation with a nutritionist, I found out that I was severely undereating protein.
          </p>

          <p className="mb-6">
            But it was very difficult to consume the recommended 150g of protein per day. That would involve eating 1-2 pounds of meat. Every single day.
          </p>

          <p className="mb-6">
            After looking at high protein alternatives I found out that Greek Yogurt is very high in protein and has many other health benefits such as probiotics which improve gut health.
          </p>

          <p>
            I went on to experiment with dozens of protein powders to create the perfect recipe that involves a creamy and delicious organic greek yogurt base mixed with highly purified whey protein for smoother blending and no after taste. That's how Better Bowls was born! We make it easier to get 40-60g of protein in one delicious bowl.
          </p>
        </Card>
      </div>
    </div>
  )
}