'use client'

import { ReactNode } from 'react'

interface HomeLayoutProps {
  children: ReactNode
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {children}
    </div>
  )
}
