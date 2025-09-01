'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')

  const navLinks = [
    { href: '#about', label: 'About us' },
    { href: '#services', label: 'Services' },
    { href: '#case-studies', label: 'Use Cases' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#blog', label: 'Blog' },
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <footer className="bg-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-white rounded mr-2 flex items-center justify-center">
                <span className="text-dark font-bold text-sm">⬡</span>
              </div>
              <span className="text-xl font-bold font-positivus">Positivus</span>
            </div>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 hover:text-white transition-colors duration-300 underline"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-primary-green transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-green transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-green transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:pl-8"
          >
            <h3 className="text-primary-green font-bold mb-4">Contact us:</h3>
            <div className="space-y-3 text-gray-300">
              <p>Email: info@positivus.com</p>
              <p>Phone: 555-567-8901</p>
              <p>
                Address: 1234 Main St<br />
                Moonstone City, Stardust State 12345
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubscribe} className="bg-gray-800 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-primary-green focus:outline-none transition-colors duration-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-green text-dark px-6 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe to news
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm"
        >
          <p>© 2023 Positivus. All Rights Reserved.</p>
          <a href="#" className="hover:text-white transition-colors duration-300 underline mt-4 sm:mt-0">
            Privacy Policy
          </a>
        </motion.div>
      </div>
    </footer>
  )
}
