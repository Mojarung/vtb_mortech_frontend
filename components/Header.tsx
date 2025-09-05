'use client'

import { useState } from 'react'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const navLinks = [
    { href: '#services', label: 'Сервисы' },
    { href: '#case-studies', label: 'Кейсы' },
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2 bg-black rounded-lg flex items-center justify-center">
                <img src="/favicon.svg" alt="AI HR Logo" className="w-8 h-8 object-contain brightness-0 invert"/>
              </div>
              <span className="text-xl font-bold font-positivus">AI HR</span>
            </div>
          </div>

          <div className="hidden md:flex space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={16} />
                  <span className="text-sm">{user?.full_name || user?.username}</span>
                  <span className="text-xs text-gray-500">({user?.role === 'hr' ? 'HR' : 'Кандидат'})</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 border border-red-500 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <LogOut size={16} />
                  <span>Выйти</span>
                </button>
              </>
            ) : (
              <>
                <a href="/auth/login" className="border border-dark text-dark px-6 py-2 rounded-xl hover:bg-dark hover:text-white transition-all duration-300">
                  Вход
                </a>
                <a href="/auth/register" className="bg-dark text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300">
                  Регистрация
                </a>
              </>
            )}
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
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-center text-gray-700 border-b">
                    <div className="flex items-center justify-center space-x-2">
                      <User size={16} />
                      <span className="text-sm">{user?.full_name || user?.username}</span>
                    </div>
                    <span className="text-xs text-gray-500">({user?.role === 'hr' ? 'HR' : 'Кандидат'})</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 border border-red-500 text-red-500 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <LogOut size={16} />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <a href="/auth/login" className="w-full border border-dark text-dark px-6 py-2 rounded-xl hover:bg-dark hover:text-white transition-all duration-300 mb-2 block text-center">
                    Вход
                  </a>
                  <a href="/auth/register" className="w-full bg-dark text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-all duration-300 block text-center">
                    Регистрация
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
