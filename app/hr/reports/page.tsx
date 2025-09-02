'use client'

import { motion } from 'framer-motion'
import { FileText, Download, Calendar, Filter, TrendingUp, Users, Clock } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function HRReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedType, setSelectedType] = useState('all')

  const reports = [
    {
      id: 1,
      title: 'Отчет по найму за месяц',
      description: 'Детальная статистика по всем процессам найма за текущий месяц',
      type: 'hiring',
      date: '2024-01-15',
      size: '2.3 MB',
      format: 'PDF'
    },
    {
      id: 2,
      title: 'Аналитика интервью',
      description: 'Анализ эффективности проведенных интервью и обратной связи',
      type: 'interviews',
      date: '2024-01-14',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 3,
      title: 'Отчет по кандидатам',
      description: 'Статистика по источникам кандидатов и их качеству',
      type: 'candidates',
      date: '2024-01-13',
      size: '3.1 MB',
      format: 'PDF'
    },
    {
      id: 4,
      title: 'Временные метрики',
      description: 'Анализ времени на каждый этап процесса найма',
      type: 'time',
      date: '2024-01-12',
      size: '1.5 MB',
      format: 'Excel'
    }
  ]

  const stats = [
    {
      title: 'Сгенерированных отчетов',
      value: '24',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Скачиваний',
      value: '156',
      icon: Download,
      color: 'bg-green-500'
    },
    {
      title: 'Активных отчетов',
      value: '8',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="hr" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Reports" userRole="hr" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Отчеты и аналитика
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Создавайте и загружайте подробные отчеты по HR-процессам
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Доступные отчеты
                </h2>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="week">За неделю</option>
                    <option value="month">За месяц</option>
                    <option value="quarter">За квартал</option>
                    <option value="year">За год</option>
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="all">Все типы</option>
                    <option value="hiring">Найм</option>
                    <option value="interviews">Интервью</option>
                    <option value="candidates">Кандидаты</option>
                  </select>
                  <button className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors">
                    Создать отчет
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {report.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            {report.date}
                          </div>
                          <span>{report.format}</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid lg:grid-cols-2 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Быстрые отчеты
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Users className="text-blue-500" size={20} />
                  <span className="text-gray-900 dark:text-white">Отчет по кандидатам за сегодня</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Calendar className="text-green-500" size={20} />
                  <span className="text-gray-900 dark:text-white">Интервью на эту неделю</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Clock className="text-purple-500" size={20} />
                  <span className="text-gray-900 dark:text-white">Временные метрики</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Настройки отчетов
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Автоматическая генерация
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                    <option>Ежедневно</option>
                    <option>Еженедельно</option>
                    <option>Ежемесячно</option>
                    <option>Отключено</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Формат по умолчанию
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
