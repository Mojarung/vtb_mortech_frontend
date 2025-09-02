'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Video, Phone, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function HRInterviews() {
  const [selectedView, setSelectedView] = useState('list')

  const interviews = [
    {
      id: 1,
      candidate: 'Анна Смирнова',
      position: 'Frontend Developer',
      interviewer: 'Михаил Петров',
      date: '2024-01-15',
      time: '14:00',
      duration: '60 мин',
      type: 'video',
      status: 'scheduled',
      avatar: 'AS'
    },
    {
      id: 2,
      candidate: 'Дмитрий Козлов',
      position: 'Backend Developer',
      interviewer: 'Елена Иванова',
      date: '2024-01-15',
      time: '15:30',
      duration: '45 мин',
      type: 'phone',
      status: 'completed',
      avatar: 'ДК'
    },
    {
      id: 3,
      candidate: 'Мария Волкова',
      position: 'UI/UX Designer',
      interviewer: 'Александр Новиков',
      date: '2024-01-16',
      time: '10:00',
      duration: '90 мин',
      type: 'video',
      status: 'in-progress',
      avatar: 'МВ'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Запланировано'
      case 'completed':
        return 'Завершено'
      case 'in-progress':
        return 'В процессе'
      default:
        return 'Неизвестно'
    }
  }

  return (
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
            {interviews.map((interview, index) => (
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
                      {interview.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {interview.candidate}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {interview.position}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Интервьюер: {interview.interviewer}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm">{interview.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock size={16} />
                        <span className="text-sm">{interview.time} ({interview.duration})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {interview.type === 'video' ? (
                        <Video className="text-blue-500" size={20} />
                      ) : (
                        <Phone className="text-green-500" size={20} />
                      )}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.status)}`}>
                        {getStatusText(interview.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {interview.status === 'scheduled' && (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                          Начать
                        </button>
                      )}
                      {interview.status === 'completed' && (
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
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
            ))}
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
  )
}
