'use client'

import { motion } from 'framer-motion'
import { Users, Package, TrendingUp, Clock, Plus } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { ProtectedRoute } from '../../../components/ProtectedRoute'
import { apiClient } from '../../../lib/api'
import Link from 'next/link'
import { useAuth } from '../../../contexts/AuthContext'

export default function HRDashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalInterviews: 0,
    successfulHires: 0,
    pending: 0
  })
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Реальные кандидаты
        const candidatesData = await apiClient.getCandidates({ processed: true }).catch(() => [])
        const candidates = Array.isArray(candidatesData) ? candidatesData : []

        const myCandidates = candidates.filter((candidate: any) =>
          candidate?.vacancy?.creator_id && user?.id ? candidate.vacancy.creator_id === user.id : true
        )

        const totalCandidates = myCandidates.length
        const successfulHires = myCandidates.filter((c: any) => c.status === 'accepted').length
        const pending = myCandidates.filter((c: any) => c.status === 'pending').length
        const totalInterviews = myCandidates.filter((c: any) =>
          c.status === 'interview_scheduled' || c.status === 'interview_completed'
        ).length

        setStats({ totalCandidates, totalInterviews, successfulHires, pending })

        // Реальные интервью
        const interviewsData = await apiClient.getHRInterviews().catch(() => [])
        setInterviews(Array.isArray(interviewsData) ? interviewsData : [])
      } catch (error) {
        console.error('Error fetching HR data:', error)
        setStats({ totalCandidates: 0, totalInterviews: 0, successfulHires: 0, pending: 0 })
        setInterviews([])
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchData()
  }, [user])

  // Подготовка данных для графика на основе реальных интервью (группируем по неделям)sd
  const chartData = useMemo(() => {
    if (!interviews || interviews.length === 0) {
      return Array.from({ length: 8 }).map((_, i) => ({ label: `Нед. ${i + 1}`, value: (i + 1) * 5 }))
    }
    const byWeek: Record<string, number> = {}
    interviews.forEach((it: any) => {
      const d = new Date(it.scheduled_date || it.created_at)
      if (isNaN(d.getTime())) return
      const year = d.getFullYear()
      const firstDay = new Date(Date.UTC(year, 0, 1))
      const pastDays = Math.floor((d.getTime() - firstDay.getTime()) / 86400000)
      const week = Math.floor((pastDays + firstDay.getUTCDay()) / 7)
      const key = `${year}-W${week}`
      byWeek[key] = (byWeek[key] || 0) + 1
    })
    const keys = Object.keys(byWeek).sort().slice(-8)
    if (keys.length === 0) return Array.from({ length: 8 }).map((_, i) => ({ label: `Нед. ${i + 1}`, value: (i + 1) * 5 }))
    return keys.map((k, idx) => ({ label: k, value: byWeek[k] }))
  }, [interviews])

  const maxChartValue = Math.max(...chartData.map(d => d.value)) || 1
  const minChartValue = Math.min(...chartData.map(d => d.value)) || 0
  const normalize = (v: number) => (v - minChartValue) / (maxChartValue - minChartValue || 1)
  const sparkWidth = 560
  const sparkHeight = 140
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1 || 1)) * sparkWidth
    const y = sparkHeight - normalize(d.value) * sparkHeight
    return `${x},${y}`
  }).join(' ')

  const statsData = [
    { title: 'Всего кандидатов', value: stats?.totalCandidates || 0, icon: Users, gradient: 'from-indigo-500 to-violet-500' },
    { title: 'Всего интервью', value: stats?.totalInterviews || 0, icon: Package, gradient: 'from-amber-500 to-orange-500' },
    { title: 'Успешных найма', value: stats?.successfulHires || 0, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
    { title: 'Ожидающих', value: stats?.pending || 0, icon: Clock, gradient: 'from-pink-500 to-rose-500' },
  ]

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="hidden md:block"><Sidebar userRole="hr" /></div>
        <div className="flex-1 flex flex-col">
          <DashboardHeader title="Dashboard" userRole="hr" />
          <div className="p-0 sm:p-6">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-none sm:rounded-2xl mx-0 mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900 to-violet-900"></div>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600 opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600 opacity-30 blur-3xl rounded-full"></div>
          <div className="relative px-5 sm:px-8 py-8 sm:py-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Панель HR</h1>
                <p className="mt-1 text-violet-100/90">Живой обзор найма, интервью и кандидатов</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/hr/vacancies?create=1" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white backdrop-blur-md">
                  <Plus size={16} /> Новая вакансия
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 px-5 sm:px-0">
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

        {/* Chart + Latest interviews */}
        <div className="grid lg:grid-cols-3 gap-6 px-5 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Динамика интервью</h2>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">последние недели</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <svg width={sparkWidth} height={sparkHeight} className="max-w-full">
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline fill="none" stroke="#6366F1" strokeWidth="3" points={points} />
                <polygon fill="url(#grad)" points={`0,${sparkHeight} ${points} ${sparkWidth},${sparkHeight}`} />
                {chartData.map((d, i) => {
                  const x = (i / (chartData.length - 1 || 1)) * sparkWidth
                  const y = sparkHeight - normalize(d.value) * sparkHeight
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={3} fill="#6366F1" />
                      <text x={x} y={y - 8} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300" fontSize="10">{d.value}</text>
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {chartData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                  <span className="truncate max-w-[120px]">{d.label}</span>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Последние интервью</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Загрузка интервью...</p>
                </div>
              ) : (interviews?.length || 0) > 0 ? (
                interviews.slice(0, 5).map((interview: any) => {
                  const nameFromString = interview.candidate || interview.candidate_name
                  const nameFromObject = interview.candidate?.first_name && interview.candidate?.last_name
                    ? `${interview.candidate.first_name} ${interview.candidate.last_name}`
                    : undefined
                  const candidate = nameFromString || nameFromObject || 'Кандидат'
                  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate)}`
                  const dateIso = interview.date || interview.scheduled_date || interview.created_at
                  const date = dateIso ? new Date(dateIso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'
                  const score = interview.pass_percentage ?? interview.score ?? '—'
                  const statusMap: Record<string, string> = { completed: 'Завершено', in_progress: 'В процессе', not_started: 'Ожидает' }
                  const statusText = statusMap[interview.status] || 'Ожидает'
                  const position = interview.position || interview.vacancy?.title || 'Неизвестная позиция'
                  return (
                    <div key={interview.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={avatarUrl} alt={candidate} className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{candidate}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{position}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">{date}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Оценка: {score}</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">{statusText}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Нет интервью</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions removed as requested */}

          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
