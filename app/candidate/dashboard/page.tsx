'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, AlertCircle, Play, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { ProtectedRoute } from '../../../components/ProtectedRoute'
import { apiClient } from '../../../lib/api'

export default function CandidateDashboard() {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    scheduledInterviews: 0,
    averageScore: 0
  })
  const [interviews, setInterviews] = useState({
    upcoming: [],
    completed: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, interviewsData] = await Promise.all([
          apiClient.getCandidateStats(),
          apiClient.getCandidateInterviews()
        ])
        setStats(statsData)
        setInterviews(interviewsData)
      } catch (error) {
        console.error('Error fetching candidate data:', error)
        // Fallback to empty data if API fails
        setStats({
          totalInterviews: 0,
          completedInterviews: 0,
          scheduledInterviews: 0,
          averageScore: 0
        })
        setInterviews({
          upcoming: [],
          completed: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  const statsData = [
    {
      title: 'Всего интервью',
      value: (stats?.totalInterviews || 0).toString(),
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Завершенных',
      value: (stats?.completedInterviews || 0).toString(),
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Запланированных',
      value: (stats?.scheduledInterviews || 0).toString(),
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Средний балл',
      value: (stats?.averageScore || 0).toString(),
      icon: FileText,
      color: 'bg-purple-500'
    }
  ]

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar userRole="candidate" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader title="Dashboard" userRole="candidate" />
          <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Личный кабинет кандидата
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Добро пожаловать! Здесь вы можете отслеживать свои интервью и результаты
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Предстоящие интервью
            </h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Загрузка интервью...</p>
                </div>
              ) : (interviews?.upcoming?.length || 0) > 0 ? (
                interviews.upcoming.map((interview: any, index: number) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {interview.company}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {interview.position}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {interview.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {interview.time} ({interview.duration})
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Интервьюер: {interview.interviewer}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {interview.type}
                      </span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      <Play size={16} />
                      Присоединиться
                    </button>
                  </div>
                </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Нет предстоящих интервью</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              История интервью
            </h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Загрузка истории...</p>
                </div>
              ) : (interviews?.completed?.length || 0) > 0 ? (
                interviews.completed.map((interview: any, index: number) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {interview.company}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {interview.position}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {interview.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {interview.score}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">/100</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        interview.result === 'Прошел на следующий этап'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {interview.result}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Обратная связь:</span> {interview.feedback}
                  </p>
                </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Нет завершенных интервью</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Рекомендации для подготовки
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-yellow-600" size={20} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Алгоритмы и структуры данных
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Рекомендуем повторить основные алгоритмы сортировки и работу с деревьями
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-600" size={20} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Практические навыки
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ваши практические навыки на высоком уровне, продолжайте в том же духе
              </p>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
