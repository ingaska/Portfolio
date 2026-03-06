import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Inga Sumska — Product Design Lead',
  description:
    'Product Design Lead — from zero to scale, building products people return to. Portfolio of mobile and web products across health, education, lifestyle and entertainment.',
  openGraph: {
    title: 'Inga Sumska — Product Design Lead',
    description: 'Product Design Lead — from zero to scale, building products people return to.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-white text-[#1a1a1a]`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
