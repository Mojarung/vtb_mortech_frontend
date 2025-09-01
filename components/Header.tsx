'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '#about', label: 'About us' },
    { href: '#services', label: 'Services' },
    { href: '#case-studies', label: 'Use Cases' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#blog', label: 'Blog' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-dark rounded mr-2 flex items-center justify-center">
                <span className="text-white font-bold text-sm">⬡</span>
              </div>
              <span className="text-xl font-bold font-positivus">Positivus</span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-dark transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <button className="border border-dark text-dark px-6 py-2 rounded-xl hover:bg-dark hover:text-white transition-all duration-300">
              Request a quote
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-dark"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button className="w-full mt-3 border border-dark text-dark px-6 py-2 rounded-xl hover:bg-dark hover:text-white transition-all duration-300">
                Request a quote
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
