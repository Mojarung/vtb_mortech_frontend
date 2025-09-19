'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const formContainer = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
  }

  const formItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(formData.username, formData.password)
      // После успешного логина пользователь будет перенаправлен в AuthContext
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка входа')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen auth-bg flex items-center justify-center p-4 overflow-hidden">
      <div className="auth-grid"></div>
      <motion.div className="auth-blob w-[500px] h-[500px] rounded-full bg-indigo-500/25" animate={{ x: [ -80, 80, -80 ], y: [ -40, 60, -40 ] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} style={{ top: '-10%', left: '-5%' }} />
      <motion.div className="auth-blob w-[400px] h-[400px] rounded-full bg-violet-500/25" animate={{ x: [ 60, -60, 60 ], y: [ 40, -60, 40 ] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} style={{ bottom: '-8%', right: '-4%' }} />
      <motion.div className="auth-blob w-[350px] h-[350px] rounded-full bg-white/10" animate={{ x: [ 0, 30, 0 ], y: [ 0, -30, 0 ] }} transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} style={{ top: '30%', right: '10%' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl p-8 glass-card text-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-white/20 shadow-md" style={{
              background: 'radial-gradient(60% 60% at 30% 30%, rgba(124,58,237,0.95) 0%, rgba(99,102,241,0.95) 60%, rgba(233,234,246,0.9) 100%)'
            }}>
              <span className="text-black font-extrabold text-xl leading-none">AI</span>
            </div>
            <h1 className="text-3xl font-extrabold font-positivus tracking-tight mb-2">
              Добро пожаловать!
            </h1>
            <p className="text-white/70">
              Войдите в свой аккаунт AI HR
            </p>
          </div>

          {/* Показываем ошибку если есть */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <motion.form onSubmit={handleSubmit} className="space-y-6" variants={formContainer} initial="hidden" animate="visible">
            <motion.div variants={formItem}>
              <label className="block text-sm font-semibold mb-2 text-white/80">
                Имя пользователя
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="username"
                />
              </div>
            </motion.div>

            <motion.div variants={formItem}>
              <label className="block text-sm font-semibold mb-2 text-white/80">
                Пароль
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full h-12 pl-10 pr-12 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div className="flex items-center justify-between" variants={formItem}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-dark bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-indigo-400"
                />
                <span className="ml-2 text-sm text-white/80">
                  Запомнить меня
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-indigo-300 hover:text-white transition-colors"
              >
                Забыли пароль?
              </Link>
            </motion.div>

            <motion.button
              variants={formItem}
              whileHover={{ scale: isLoading ? 1 : 1.02, boxShadow: isLoading ? "none" : "0 10px 25px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-500 text-white py-4 px-6 rounded-2xl font-extrabold tracking-tight hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span className="relative z-10">Войти</span>
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </motion.button>
          </motion.form>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Нет аккаунта?{' '}
              <Link
                href="/auth/register"
                className="text-indigo-300 hover:text-white font-semibold transition-colors"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="mt-2 inline-flex items-center text-sm text-white/70 hover:text-indigo-300 transition-colors"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
