'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')

  const navLinks = [
    { href: '#services', label: 'Сервисы' },
    { href: '#case-studies', label: 'Кейсы' },
  ]

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <footer className="bg-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
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
              <span className="text-xl font-bold font-positivus">AI HR</span>
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
              <a href="#" className="text-gray-300 hover:text-primary-purple transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-purple transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-purple transition-colors duration-300">
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
            <h3 className="text-primary-purple font-bold mb-4">Связаться с нами:</h3>
            <div className="space-y-3 text-gray-300">
              <p>Email: info@aihr.ru</p>
              <p>Телефон: +7 (495) 123-45-67</p>
              <p>
                Адрес: Москва, ул. Тверская, д. 1<br />
                Россия, 123456
              </p>
            </div>
          </motion.div>


        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm"
        >
          <p>© 2024 AI HR. Все права защищены.</p>
          <a href="#" className="hover:text-white transition-colors duration-300 underline mt-4 sm:mt-0">
Политика конфиденциальности
          </a>
        </motion.div>
      </div>
    </footer>
  )
}
