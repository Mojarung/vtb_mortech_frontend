'use client'

import { motion } from 'framer-motion'
import { Users, Package, TrendingUp, Clock, ArrowUp, ArrowDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { ProtectedRoute } from '../../../components/ProtectedRoute'
import { apiClient } from '../../../lib/api'

export default function HRDashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalInterviews: 0,
    successfulHires: 0,
    pending: 0
  })
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, interviewsData] = await Promise.all([
          apiClient.getHRStats(),
          apiClient.getHRInterviews()
        ])
        setStats(statsData)
        setInterviews(interviewsData)
      } catch (error) {
        console.error('Error fetching HR data:', error)
        // Fallback to empty data if API fails
        setStats({
          totalCandidates: 0,
          totalInterviews: 0,
          successfulHires: 0,
          pending: 0
        })
        setInterviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  const statsData = [
    {
      title: 'Всего кандидатов',
      value: stats.totalCandidates.toString(),
      change: '+8.5%',
      changeType: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Всего интервью',
      value: stats.totalInterviews.toString(),
      change: '+1.3%',
      changeType: 'up',
      icon: Package,
      color: 'bg-yellow-500'
    },
    {
      title: 'Успешных найма',
      value: stats.successfulHires.toString(),
      change: '-4.3%',
      changeType: 'down',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Ожидающих',
      value: stats.pending.toString(),
      change: '+1.8%',
      changeType: 'up',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ]

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar userRole="hr" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader title="Dashboard" userRole="hr" />
          <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Панель управления HR
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Обзор активности и статистики по найму
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
                <div className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.changeType === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {stat.changeType === 'up' ? 'Рост с' : 'Снижение с'} прошлого месяца
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Статистика интервью
              </h2>
              <select className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                <option>Октябрь</option>
              </select>
            </div>
            <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">График статистики</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Последние интервью
            </h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Загрузка интервью...</p>
                </div>
              ) : interviews.length > 0 ? (
                interviews.map((interview: any) => (
                <div key={interview.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {interview.candidate}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {interview.position}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    {interview.date}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Оценка: {interview.score}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      {interview.status}
                    </span>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Нет интервью</p>
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
