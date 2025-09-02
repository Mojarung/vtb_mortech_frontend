'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeLanguageSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [language, setLanguage] = useState<'ru' | 'en'>('ru')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  useEffect(() => {
    const savedTheme = document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1] as 'light' | 'dark' || 'light'
    
    const savedLanguage = document.cookie
      .split('; ')
      .find(row => row.startsWith('language='))
      ?.split('=')[1] as 'ru' | 'en' || 'ru'

    setTheme(savedTheme)
    setLanguage(savedLanguage)
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const changeLanguage = (newLanguage: 'ru' | 'en') => {
    setLanguage(newLanguage)
    document.cookie = `language=${newLanguage}; path=/; max-age=31536000`
    setShowLanguageMenu(false)
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
      >
        {theme === 'light' ? (
          <Moon size={20} className="text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun size={20} className="text-yellow-500" />
        )}
      </motion.button>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <Globe size={20} className="text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
            {language}
          </span>
        </motion.button>

        <AnimatePresence>
          {showLanguageMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => changeLanguage('ru')}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  language === 'ru' ? 'bg-primary-purple text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Русский
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  language === 'en' ? 'bg-primary-purple text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                English
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
