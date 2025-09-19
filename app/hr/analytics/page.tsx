'use client'

import { motion } from 'framer-motion'
import { Users, Award, Clock, Target } from 'lucide-react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { useEffect, useState } from 'react'
import { apiClient } from '../../../lib/api'

export default function HRAnalytics() {
  const [stats, setStats] = useState<any>({ totalCandidates: 0, totalInterviews: 0, successfulHires: 0, pending: 0 })
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const s = await apiClient.getHRStats().catch(() => ({ totalCandidates: 0, totalInterviews: 0, successfulHires: 0, pending: 0 }))
        const it = await apiClient.getHRInterviews().catch(() => [])
        setStats(s)
        setInterviews(Array.isArray(it) ? it : [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="hr" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Analytics" userRole="hr" />
        <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Аналитика HR
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Анализ эффективности процессов найма и HR-метрик
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[{title:'Всего кандидатов', value:String(stats.totalCandidates||0), icon: Users, color:'text-blue-500'},
            {title:'Всего интервью', value:String(stats.totalInterviews||0), icon: Target, color:'text-green-500'},
            {title:'Успешных найма', value:String(stats.successfulHires||0), icon: Award, color:'text-purple-500'},
            {title:'Ожидающих', value:String(stats.pending||0), icon: Clock, color:'text-orange-500'}].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`${metric.color}`} size={32} />
                <div className="text-sm text-gray-400">&nbsp;</div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Последние интервью</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Загрузка...</div>
              ) : interviews.length > 0 ? (
                interviews.map((it) => {
                  const name = it.candidate || it.candidate_name || 'Кандидат'
                  const dateIso = it.date || it.scheduled_date || it.created_at
                  const dateStr = dateIso ? new Date(dateIso).toLocaleDateString('ru-RU') : '—'
                  const position = it.position || it.vacancy?.title || 'Неизвестная позиция'
                  const score = it.score ?? it.pass_percentage ?? '—'
                  return (
                    <div key={it.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{position}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500 dark:text-gray-400">{dateStr}</div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">Оценка: {score}</div>
                    </div>
                  )
                })
              ) : (
                <div className="text-gray-500">Нет интервью</div>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Динамика найма
            </h2>
            <select className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
              <option>Последние 6 месяцев</option>
              <option>Последний год</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">График динамики найма</p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}
