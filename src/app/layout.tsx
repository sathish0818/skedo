import type { Metadata, Viewport } from 'next'
import { Fraunces, Public_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const display = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const ui = Public_Sans({
  variable: '--font-ui',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const mono = IBM_Plex_Mono({
  variable: '--font-mono-ui',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Skedo — one-hour live workshops',
    template: '%s · Skedo',
  },
  description:
    'Paid one-hour live workshops. Twenty seats, real questions, and a certificate for the people who actually turn up.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never block zoom — it breaks accessibility on every phone.
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f6' },
    { media: '(prefers-color-scheme: dark)', color: '#101512' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
