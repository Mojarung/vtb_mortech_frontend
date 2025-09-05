'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'hr' | 'candidate'>('candidate')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { ...formData, role: selectedRole })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-purple via-purple-500 to-pink-500 flex items-center justify-center p-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Добро пожаловать!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Войдите в свой аккаунт AI HR
            </p>
          </div>

          {/* Выбор роли */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Войти как:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                onClick={() => setSelectedRole('candidate')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                  selectedRole === 'candidate'
                    ? 'border-primary-purple bg-primary-purple/20 text-primary-purple shadow-lg shadow-primary-purple/20'
                    : 'border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:border-primary-purple/50 hover:bg-primary-purple/5'
                }`}
              >
                <div className="text-center">
                  <motion.div
                    className="text-2xl mb-2"
                    animate={selectedRole === 'candidate' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    👤
                  </motion.div>
                  <div className="text-sm font-medium">Кандидат</div>
                </div>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setSelectedRole('hr')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                  selectedRole === 'hr'
                    ? 'border-primary-purple bg-primary-purple/20 text-primary-purple shadow-lg shadow-primary-purple/20'
                    : 'border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:border-primary-purple/50 hover:bg-primary-purple/5'
                }`}
              >
                <div className="text-center">
                  <motion.div
                    className="text-2xl mb-2"
                    animate={selectedRole === 'hr' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    💼
                  </motion.div>
                  <div className="text-sm font-medium">HR</div>
                </div>
              </motion.button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-purple bg-gray-100 border-gray-300 rounded focus:ring-primary-purple focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Запомнить меня
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-purple hover:text-purple-700 transition-colors"
              >
                Забыли пароль?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-primary-purple to-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-purple-600 hover:to-primary-purple transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary-purple/25 relative overflow-hidden group"
            >
              <span className="relative z-10">Войти</span>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight size={20} />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Нет аккаунта?{' '}
              <Link
                href="/auth/register"
                className="text-primary-purple hover:text-purple-700 font-medium transition-colors"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  или
                </span>
              </div>
            </div>
            <Link
              href="/"
              className="mt-4 inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-purple transition-colors"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
