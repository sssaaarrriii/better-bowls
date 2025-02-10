import Image from 'next/image'

export function Squiggle() {
  return (
    <Image
      src="/images/squiggle_divider.png"
      alt="Decorative divider"
      width={1440}
      height={200}
      className="w-full block"
    />
  )
} 