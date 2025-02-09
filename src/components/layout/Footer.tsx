import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-reseda-green text-white py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Image
            src="/images/footer-logo.jpg"
            alt="Better Bowls"
            width={60}
            height={60}
          />
          
          <Link
            href="https://instagram.com/betterbowls.la"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:opacity-80 transition-opacity font-body"
          >
            @betterbowls.la
          </Link>
        </div>
      </div>
    </footer>
  )
}