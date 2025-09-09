'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Video, Phone, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { ProtectedRoute } from '../../../components/ProtectedRoute'
import { apiClient, Interview } from '../../../lib/api'

export default function HRInterviews() {
  const [selectedView, setSelectedView] = useState('list')
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiClient.getInterviews()
        setInterviews(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching interviews:', err)
        setError('Ошибка загрузки интервью')
        setInterviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Запланировано'
      case 'completed':
        return 'Завершено'
      case 'in_progress':
        return 'В процессе'
      default:
        return 'Неизвестно'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU')
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '—'
    return `${minutes} мин`
  }

  const getCandidateName = (interview: Interview) => {
    // Пытаемся получить имя из связанных данных
    if (interview.resume?.user?.full_name) {
      return interview.resume.user.full_name
    }
    if (interview.resume?.user?.first_name && interview.resume?.user?.last_name) {
      return `${interview.resume.user.first_name} ${interview.resume.user.last_name}`
    }
    if (interview.resume?.user?.username) {
      return interview.resume.user.username
    }
    return 'Неизвестный кандидат'
  }

  const getPosition = (interview: Interview) => {
    return interview.vacancy?.title || 'Позиция не указана'
  }

  const getAvatar = (interview: Interview) => {
    const name = getCandidateName(interview)
    const words = name.split(' ')
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar userRole="hr" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader title="Interviews" userRole="hr" />
          <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Интервью
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управление расписанием интервью и их проведение
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedView('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedView === 'list'
                  ? 'bg-primary-purple text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              Список
            </button>
            <button
              onClick={() => setSelectedView('calendar')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedView === 'calendar'
                  ? 'bg-primary-purple text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              Календарь
            </button>
          </div>
          <button className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors">
            Запланировать интервью
          </button>
        </motion.div>

        {selectedView === 'list' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Загрузка интервью...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Нет запланированных интервью</p>
              </div>
            ) : (
              interviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-purple rounded-full flex items-center justify-center text-white font-bold">
                        {getAvatar(interview)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {getCandidateName(interview)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {getPosition(interview)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          ID интервью: {interview.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <Calendar size={16} />
                          <span className="text-sm">{formatDate(interview.scheduled_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock size={16} />
                          <span className="text-sm">{formatTime(interview.scheduled_date)} ({formatDuration(interview.duration_minutes)})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Video className="text-blue-500" size={20} />
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                          {getStatusText(interview.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {interview.status === 'not_started' && (
                          <button 
                            onClick={() => {
                              // TODO: Реализовать начало интервью
                              console.log('Starting interview:', interview.id)
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            Начать
                          </button>
                        )}
                        {interview.status === 'completed' && (
                          <button 
                            onClick={() => {
                              // TODO: Реализовать просмотр отчета
                              console.log('Viewing report for interview:', interview.id)
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            Отчет
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="h-96 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Календарь интервью</p>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
