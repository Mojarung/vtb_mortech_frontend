'use client'

import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'hr' | 'user'>('user')
  const [step, setStep] = useState<1 | 2>(1)
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
              Создать аккаунт
            </h1>
            <p className="text-white/70">
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
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === 'user'
                    ? 'border-indigo-300 bg-indigo-300/15 text-indigo-300 shadow-lg shadow-indigo-300/20'
                    : 'border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5'
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
                  <div className="text-sm font-semibold">Кандидат</div>
                  <div className="text-xs text-white/60 mt-1 opacity-75">Ищу работу</div>
                </div>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setSelectedRole('hr')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === 'hr'
                    ? 'border-indigo-300 bg-indigo-300/15 text-indigo-300 shadow-lg shadow-indigo-300/20'
                    : 'border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5'
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
                  <div className="text-sm font-semibold">HR</div>
                  <div className="text-xs text-white/60 mt-1 opacity-75">Провожу интервью</div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Показываем ошибку если есть */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <motion.form onSubmit={handleSubmit} className="space-y-4" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{staggerChildren:0.08}}>
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
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
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white/80">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full h-12 pl-10 pr-4 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white/80">
                    Полное имя (необязательно)
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full h-12 px-4 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                    placeholder="Иван Иванов"
                  />
                </div>

                <button type="button" onClick={() => setStep(2)} className="w-full bg-indigo-500 text-white py-3 rounded-xl font-extrabold tracking-tight hover:brightness-110 transition">Далее</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
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
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white/80">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full h-12 pl-10 pr-12 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/10 focus:bg-white/10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-dark bg-white/10 border-white/20 rounded focus:ring-2 focus:ring-indigo-400 mt-1"
                  />
                  <span className="ml-2 text-sm text-white/80">
                    Я согласен с{' '}
                    <Link href="/terms" className="text-indigo-300 hover:text-white">
                      условиями использования
                    </Link>{' '}
                    и{' '}
                    <Link href="/privacy" className="text-indigo-300 hover:text-white">
                      политикой конфиденциальности
                    </Link>
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02, boxShadow: isLoading ? 'none' : '0 10px 25px rgba(99, 102, 241, 0.25)' }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-500 text-white py-4 px-6 rounded-2xl font-extrabold tracking-tight hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span className="relative z-10">Создать аккаунт</span>
                      <motion.div
                        whileHover={{ x: 2 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <ArrowRight size={20} />
                      </motion.div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </motion.button>

                <button type="button" onClick={() => setStep(1)} className="w-full text-white/70 hover:text-white text-sm">Назад</button>
              </motion.div>
            )}
          </motion.form>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Уже есть аккаунт?{' '}
              <Link
                href="/auth/login"
                className="text-indigo-300 hover:text-white font-semibold transition-colors"
              >
                Войти
              </Link>
            </p>
          </div>

          <div className="mt-3 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-white/70 hover:text-indigo-300 transition-colors"
            >
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
