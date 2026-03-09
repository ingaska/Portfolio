import Link from 'next/link'
import { cases } from '@/data/cases'

export default function Footer() {
  return (
    <footer className="bg-[#f7f7f5] border-t border-[#1a1a1a]/8">

      {/* Main footer grid */}
      <div className="px-8 md:px-12 pt-14 pb-10 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand col */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <span className="text-sm font-medium text-[#1a1a1a]">Inga Sumska</span>
          <p className="text-xs text-[#1a1a1a]/45 leading-relaxed max-w-[200px]">
            Product Design Lead — building apps people return to.
          </p>
        </div>

        {/* Work col */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/35 mb-1">Products</span>
          {cases.map((c) => (
            <Link
              key={c.slug}
              href={`/work/${c.slug}`}
              className="text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
            >
              {c.title}
            </Link>
          ))}
        </div>

        {/* Pages col */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/35 mb-1">Pages</span>
          <Link href="/" className="text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
            About
          </Link>
        </div>

        {/* Social col */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/35 mb-1">Connect</span>
          <a
            href="https://www.linkedin.com/in/sumska/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/ingasumska?igsh=N3U1Nmg3ZWxlcTdo&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/inga.sumska"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://www.behance.net/ingasumska"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
          >
            Behance
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 md:px-12 py-5 border-t border-[#1a1a1a]/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-[11px] text-[#1a1a1a]/30">
          © {new Date().getFullYear()} Inga Sumska
        </span>
        <span className="text-[11px] text-[#1a1a1a]/30">Paphos, Cyprus</span>
      </div>

    </footer>
  )
}
