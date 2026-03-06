'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const isCase = pathname.startsWith('/work/')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between bg-white/90 backdrop-blur-sm">
      <Link
        href="/"
        className="text-sm font-medium tracking-wide text-[#1a1a1a] hover:opacity-60 transition-opacity"
      >
        Inga Sumska
      </Link>
      <nav className="flex items-center gap-8">
        {isCase && (
          <Link
            href="/"
            className="text-sm text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors"
          >
            ← Products
          </Link>
        )}
        <a
          href="#about"
          className="text-sm text-[#1a1a1a] hover:opacity-60 transition-opacity"
        >
          About
        </a>
      </nav>
    </header>
  )
}
