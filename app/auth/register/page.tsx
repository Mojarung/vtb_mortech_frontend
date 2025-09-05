'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Building, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'hr' | 'user'>('user')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      return
    }

    setIsLoading(true)

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        full_name: formData.full_name || undefined
      })
      // После успешной регистрации пользователь будет перенаправлен в AuthContext
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка регистрации')
    } finally {
      setIsLoading(false)
    }
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
              Создать аккаунт
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Присоединяйтесь к AI HR платформе
            </p>
          </div>

          {/* Выбор роли */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Регистрация как:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                onClick={() => setSelectedRole('user')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                  selectedRole === 'user'
                    ? 'border-primary-purple bg-primary-purple/20 text-primary-purple shadow-lg shadow-primary-purple/20'
                    : 'border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:border-primary-purple/50 hover:bg-primary-purple/5'
                }`}
              >
                <div className="text-center">
                  <motion.div
                    className="text-2xl mb-2"
                    animate={selectedRole === 'user' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    👤
                  </motion.div>
                  <div className="text-sm font-medium">Кандидат</div>
                  <div className="text-xs text-gray-500 mt-1 opacity-75">Ищу работу</div>
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
                  <div className="text-xs text-gray-500 mt-1 opacity-75">Провожу интервью</div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Показываем ошибку если есть */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
                  placeholder="username"
                />
              </div>
            </div>

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
                Полное имя (необязательно)
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
                placeholder="Иван Иванов"
              />
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
                  minLength={8}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-primary-purple bg-gray-100 border-gray-300 rounded focus:ring-primary-purple focus:ring-2 mt-1"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Я согласен с{' '}
                <Link href="/terms" className="text-primary-purple hover:text-purple-700">
                  условиями использования
                </Link>{' '}
                и{' '}
                <Link href="/privacy" className="text-primary-purple hover:text-purple-700">
                  политикой конфиденциальности
                </Link>
              </span>
            </div>

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02, boxShadow: isLoading ? "none" : "0 10px 25px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-purple to-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-purple-600 hover:to-primary-purple transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary-purple/25 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span className="relative z-10">Создать аккаунт</span>
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Уже есть аккаунт?{' '}
              <Link
                href="/auth/login"
                className="text-primary-purple hover:text-purple-700 font-medium transition-colors"
              >
                Войти
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-purple transition-colors"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
