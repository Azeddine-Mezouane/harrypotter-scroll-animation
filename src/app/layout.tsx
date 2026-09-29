import type { Metadata } from 'next'
import { Host_Grotesk } from 'next/font/google'
import './globals.css'

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  variable: '--font-host-grotesk',
})

export const metadata: Metadata = {
  title: 'harry potter Scroll Animation',
  description: 'This GSAP experience was designed for use on PC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={hostGrotesk.variable}>{children}</body>
    </html>
  )
}
