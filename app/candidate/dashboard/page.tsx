'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, Play, Target } from 'lucide-react'
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
  const [interviews, setInterviews] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, interviewsData, applicationsData] = await Promise.all([
          apiClient.getCandidateStats().catch(() => ({ totalInterviews: 0, completedInterviews: 0, scheduledInterviews: 0, averageScore: 0 })),
          apiClient.getCandidateInterviews().catch(() => []),
          apiClient.getCandidateApplications().catch(() => [])
        ])
        setStats(statsData)
        setInterviews(Array.isArray(interviewsData) ? interviewsData : [])
        setApplications(Array.isArray(applicationsData) ? applicationsData : [])
      } catch (error) {
        console.error('Error fetching candidate data:', error)
        setStats({ totalInterviews: 0, completedInterviews: 0, scheduledInterviews: 0, averageScore: 0 })
        setInterviews([])
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statsData = [
    { title: 'Всего интервью', value: stats?.totalInterviews || 0, icon: Calendar, gradient: 'from-blue-500 to-indigo-500' },
    { title: 'Завершенных', value: stats?.completedInterviews || 0, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500' },
    { title: 'Запланированных', value: stats?.scheduledInterviews || 0, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
  ]

  const recentApplications = applications.slice(0, 3)
  
  // Разделяем интервью на предстоящие и завершенные
  const upcomingInterviews = interviews.filter(interview => 
    interview.status === 'not_started' || interview.status === 'scheduled'
  )

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="hidden md:block"><Sidebar userRole="candidate" /></div>
        <div className="flex-1 flex flex-col">
          <DashboardHeader title="Dashboard" userRole="candidate" />
          <div className="p-0 sm:p-6">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-none sm:rounded-2xl mx-0 mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900 to-indigo-900"></div>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600 opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600 opacity-30 blur-3xl rounded-full"></div>
          <div className="relative px-5 sm:px-8 py-8 sm:py-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Личный кабинет</h1>
                <p className="mt-1 text-blue-100/90">Отслеживайте свои интервью и результаты</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-white/80">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats?.totalInterviews || 0}</div>
                  <div className="text-sm">Всего интервью</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats?.completedInterviews || 0}</div>
                  <div className="text-sm">Завершено</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats?.scheduledInterviews || 0}</div>
                  <div className="text-sm">Запланировано</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 px-5 sm:px-0">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`relative rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 overflow-hidden`}
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20`}></div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                  <stat.icon size={22} />
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white"
              >
                {stat.value}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 px-5 sm:px-0">
          {/* Upcoming interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Предстоящие интервью</h2>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-3">Загрузка интервью...</p>
                </div>
              ) : upcomingInterviews.length > 0 ? (
                upcomingInterviews.map((interview: any, index: number) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {interview.position || 'Позиция'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {interview.company || 'Компания'}
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md">
                      <Play size={16} />
                      Присоединиться
                    </button>
                  </div>
                </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={40} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Нет предстоящих интервью</h3>
                  <p className="text-gray-500 dark:text-gray-400">Когда у вас появятся запланированные интервью, они отобразятся здесь</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Target className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Заявки</h2>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2 text-sm">Загрузка...</p>
                </div>
              ) : recentApplications.length > 0 ? (
                recentApplications.map((application: any, index: number) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {application.vacancy?.title || 'Позиция'}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {application.vacancy?.company || 'Компания'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {application.status === 'pending' ? 'Рассматривается' :
                       application.status === 'accepted' ? 'Принято' :
                       application.status === 'rejected' ? 'Отклонено' : 'Неизвестно'}
                    </span>
                  </div>
                </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Нет заявок</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ваши заявки будут отображаться здесь</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>


          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}