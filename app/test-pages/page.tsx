'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Users, Bot, BarChart3, FileText, Calendar, PieChart, Settings, Brain, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function TestPages() {
  const hrPages = [
    {
      title: 'HR Dashboard',
      description: 'Главная панель HR с общей статистикой и метриками',
      path: '/hr/dashboard',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      title: 'Candidates',
      description: 'Управление кандидатами и их профилями',
      path: '/hr/candidates',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Interviews',
      description: 'Планирование и управление интервью',
      path: '/hr/interviews',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'Аналитика и отчеты по процессу найма',
      path: '/hr/analytics',
      icon: PieChart,
      color: 'bg-orange-500'
    },
    {
      title: 'Reports',
      description: 'Генерация и просмотр отчетов',
      path: '/hr/reports',
      icon: FileText,
      color: 'bg-red-500'
    },
    {
      title: 'Resume Analysis',
      description: 'Автоматический анализ резюме с использованием ИИ',
      path: '/hr/resume-analysis',
      icon: Brain,
      color: 'bg-indigo-500'
    },
    {
      title: 'AI Avatar',
      description: 'Управление ИИ-аватаром для проведения интервью',
      path: '/hr/ai-avatar',
      icon: Bot,
      color: 'bg-cyan-500'
    },
    {
      title: 'Settings',
      description: 'Настройки системы и профиля HR',
      path: '/hr/settings',
      icon: Settings,
      color: 'bg-gray-500'
    }
  ]

  const candidatePages = [
    {
      title: 'Candidate Dashboard',
      description: 'Личная панель кандидата с текущим статусом',
      path: '/candidate/dashboard',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      title: 'My Interview',
      description: 'Информация о предстоящих интервью',
      path: '/candidate/interview',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'AI Interview',
      description: 'Прохождение интервью с ИИ-аватаром',
      path: '/candidate/ai-interview',
      icon: Bot,
      color: 'bg-cyan-500'
    },
    {
      title: 'Vacancies',
      description: 'Поиск и подача заявок на вакансии',
      path: '/candidate/vacancies',
      icon: FileText,
      color: 'bg-indigo-500'
    },
    {
      title: 'My Applications',
      description: 'История заявок и их статусы',
      path: '/candidate/applications',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Profile',
      description: 'Управление профилем и резюме',
      path: '/candidate/profile',
      icon: Users,
      color: 'bg-orange-500'
    },
    {
      title: 'Feedback',
      description: 'Обратная связь по пройденным интервью',
      path: '/candidate/feedback',
      icon: MessageSquare,
      color: 'bg-pink-500'
    },
    {
      title: 'Settings',
      description: 'Персональные настройки кандидата',
      path: '/candidate/settings',
      icon: Settings,
      color: 'bg-gray-500'
    }
  ]

  const authPages = [
    {
      title: 'Login',
      description: 'Страница входа в систему',
      path: '/auth/login',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Register',
      description: 'Регистрация новых пользователей',
      path: '/auth/register',
      icon: Users,
      color: 'bg-green-500'
    }
  ]

  const PageCard = ({ page, index }: { page: any, index: number }) => {
    const IconComponent = page.icon
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-lg transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className={`${page.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {page.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {page.description}
            </p>
            <Link
              href={page.path}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Открыть страницу
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Тестирование страниц HR-аватара
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Навигация по всем страницам системы для проверки дизайна и функциональности
          </p>
        </motion.div>

        <div className="space-y-12">
          <section>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                HR Панель
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Страницы для HR-специалистов и управления процессом найма
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hrPages.map((page, index) => (
                <PageCard key={page.path} page={page} index={index} />
              ))}
            </div>
          </section>

          <section>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Панель кандидата
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Страницы для кандидатов и прохождения интервью
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatePages.map((page, index) => (
                <PageCard key={page.path} page={page} index={index + hrPages.length} />
              ))}
            </div>
          </section>

          <section>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Аутентификация
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Страницы входа и регистрации
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {authPages.map((page, index) => (
                <PageCard key={page.path} page={page} index={index + hrPages.length + candidatePages.length} />
              ))}
            </div>
          </section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Общая информация о системе
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {hrPages.length + candidatePages.length + authPages.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Всего страниц
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {hrPages.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  HR страниц
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {candidatePages.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Страниц кандидата
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Ключевые особенности системы:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Автоматический анализ резюме с использованием ИИ</li>
                <li>• Проведение интервью с ИИ-аватаром в реальном времени</li>
                <li>• Голосовое взаимодействие и распознавание речи</li>
                <li>• Количественная оценка соответствия кандидата вакансии</li>
                <li>• Персонализированная обратная связь для кандидатов</li>
                <li>• Аналитика и отчеты для HR-специалистов</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
