'use client'

import { motion } from 'framer-motion'
import { Building, Calendar, Clock, Eye, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function CandidateApplications() {
  const [filter, setFilter] = useState('all')

  const applications = [
    {
      id: 1,
      company: 'TechCorp',
      position: 'Frontend Developer',
      appliedDate: '2024-01-15',
      status: 'interview',
      statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      salary: '150,000 - 200,000 ₽',
      location: 'Москва',
      description: 'Разработка современных веб-приложений на React и TypeScript'
    },
    {
      id: 2,
      company: 'StartupXYZ',
      position: 'React Developer',
      appliedDate: '2024-01-12',
      status: 'pending',
      statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      salary: '120,000 - 160,000 ₽',
      location: 'Удаленно',
      description: 'Создание пользовательских интерфейсов для мобильных и веб-приложений'
    },
    {
      id: 3,
      company: 'DevStudio',
      position: 'Full Stack Developer',
      appliedDate: '2024-01-10',
      status: 'accepted',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      salary: '180,000 - 220,000 ₽',
      location: 'Санкт-Петербург',
      description: 'Полноценная разработка веб-приложений от фронтенда до бэкенда'
    },
    {
      id: 4,
      company: 'WebAgency',
      position: 'Frontend Developer',
      appliedDate: '2024-01-08',
      status: 'rejected',
      statusColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      salary: '100,000 - 140,000 ₽',
      location: 'Москва',
      description: 'Разработка корпоративных сайтов и лендингов'
    }
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'На рассмотрении'
      case 'interview':
        return 'Интервью'
      case 'accepted':
        return 'Принято'
      case 'rejected':
        return 'Отклонено'
      default:
        return status
    }
  }

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  const stats = [
    { label: 'Всего заявок', value: applications.length, color: 'bg-blue-500' },
    { label: 'На рассмотрении', value: applications.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Интервью', value: applications.filter(a => a.status === 'interview').length, color: 'bg-purple-500' },
    { label: 'Принято', value: applications.filter(a => a.status === 'accepted').length, color: 'bg-green-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="candidate" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Applications" userRole="candidate" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Мои заявки
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Отслеживайте статус ваших заявок на работу
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Все заявки' },
                { key: 'pending', label: 'На рассмотрении' },
                { key: 'interview', label: 'Интервью' },
                { key: 'accepted', label: 'Принято' },
                { key: 'rejected', label: 'Отклонено' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === filterOption.key
                      ? 'bg-primary-purple text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-purple rounded-lg flex items-center justify-center">
                        <Building className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {application.position}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${application.statusColor}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                          {application.company}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {application.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            Подано: {application.appliedDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building size={16} />
                            {application.location}
                          </div>
                          <div className="font-medium text-green-600 dark:text-green-400">
                            {application.salary}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Eye size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Нет заявок
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                У вас пока нет заявок с выбранным статусом
              </p>
              <button
                onClick={() => setFilter('all')}
                className="px-6 py-3 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Показать все заявки
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
