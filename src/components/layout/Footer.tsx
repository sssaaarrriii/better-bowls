import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Image
              src="/images/logo-white.svg"
              alt="Better Bowls"
              width={120}
              height={40}
              className="mb-4"
            />
            <div className="space-y-2">
              <p>sari@betterbowls.la</p>
              <p>650-696-0570</p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <Link
              href="https://instagram.com/betterbowls.la"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/social/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Better Bowls. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}