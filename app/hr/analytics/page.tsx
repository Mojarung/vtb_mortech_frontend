'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, Award, Clock, Target } from 'lucide-react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function HRAnalytics() {
  const metrics = [
    {
      title: 'Конверсия найма',
      value: '34.2%',
      change: '+5.2%',
      changeType: 'up',
      icon: Target,
      color: 'text-green-500'
    },
    {
      title: 'Среднее время найма',
      value: '18 дней',
      change: '-3 дня',
      changeType: 'up',
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      title: 'Качество кандидатов',
      value: '87%',
      change: '+2.1%',
      changeType: 'up',
      icon: Award,
      color: 'text-purple-500'
    },
    {
      title: 'Активные вакансии',
      value: '42',
      change: '+7',
      changeType: 'up',
      icon: Users,
      color: 'text-orange-500'
    }
  ]

  const departmentStats = [
    { department: 'IT', candidates: 156, hired: 23, conversion: '14.7%' },
    { department: 'Маркетинг', candidates: 89, hired: 12, conversion: '13.5%' },
    { department: 'Продажи', candidates: 134, hired: 18, conversion: '13.4%' },
    { department: 'HR', candidates: 67, hired: 8, conversion: '11.9%' },
    { department: 'Финансы', candidates: 45, hired: 5, conversion: '11.1%' }
  ]

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
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`${metric.color}`} size={32} />
                <div className={`flex items-center text-sm font-medium ${
                  metric.changeType === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.changeType === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
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
              Воронка найма
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Заявки</span>
                <span className="font-bold text-gray-900 dark:text-white">1,247</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Скрининг</span>
                <span className="font-bold text-gray-900 dark:text-white">623</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Интервью</span>
                <span className="font-bold text-gray-900 dark:text-white">234</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Оффер</span>
                <span className="font-bold text-gray-900 dark:text-white">89</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary-purple bg-opacity-10 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Принято</span>
                <span className="font-bold text-gray-900 dark:text-white">67</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Статистика по отделам
            </h2>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {dept.department}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {dept.candidates} кандидатов
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {dept.hired} нанято
                    </p>
                    <p className="text-sm text-green-500">
                      {dept.conversion}
                    </p>
                  </div>
                </div>
              ))}
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
