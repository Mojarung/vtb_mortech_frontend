import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Positivus - Digital Marketing Agency',
  description: 'Navigating the digital landscape for success',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="dark">
      <body className="dark:bg-gray-900 dark:text-white">{children}</body>
    </html>
  )
}
