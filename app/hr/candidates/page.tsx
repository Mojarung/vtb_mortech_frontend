'use client'

import { motion } from 'framer-motion'
import { Search, Filter, Calendar, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { apiClient } from '../../../lib/api'

export default function HRCandidates() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getCandidates()
        setCandidates(data)
      } catch (error) {
        console.error('Error fetching candidates:', error)
        // Fallback to empty array if API fails
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  const mockCandidates = [
    {
      id: '00001',
      name: 'Кристина Брукс',
      position: 'Frontend Developer',
      address: '089 Kutch Green Apt. 448',
      date: '04 Sep 2019',
      type: 'Техническое',
      status: 'Завершено',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    {
      id: '00002',
      name: 'Роза Пирсон',
      position: 'Backend Developer',
      address: '979 Immanuel Ferry Suite 526',
      date: '28 May 2019',
      type: 'HR',
      status: 'В процессе',
      statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    {
      id: '00003',
      name: 'Даррелл Колдуэлл',
      position: 'DevOps Engineer',
      address: '8587 Frida Ports',
      date: '23 Nov 2019',
      type: 'Техническое',
      status: 'Отклонено',
      statusColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    },
    {
      id: '00004',
      name: 'Гилберт Джонсон',
      position: 'UI/UX Designer',
      address: '768 Destiny Lake Suite 600',
      date: '05 Feb 2019',
      type: 'Креативное',
      status: 'Завершено',
      statusColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    {
      id: '00005',
      name: 'Алан Кейн',
      position: 'Product Manager',
      address: '042 Mylene Throughway',
      date: '29 Jul 2019',
      type: 'Управленческое',
      status: 'В процессе',
      statusColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="hr" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Candidates" userRole="hr" />
        <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Список кандидатов
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управление кандидатами и их интервью
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Поиск кандидатов..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter size={20} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Фильтры</span>
                </button>
              </div>
              <button className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors">
                Добавить кандидата
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option>Все позиции</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>DevOps Engineer</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option>Все статусы</option>
                    <option>Завершено</option>
                    <option>В процессе</option>
                    <option>Отклонено</option>
                  </select>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Кандидат
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Позиция
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Загрузка кандидатов...</p>
                      </div>
                    </td>
                  </tr>
                ) : candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {candidate.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {candidate.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {candidate.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {candidate.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {candidate.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {candidate.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${candidate.statusColor}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                          <Search className="text-gray-400" size={24} />
                        </div>
                        <p className="text-gray-500">Нет кандидатов</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Показано 1-9 из 78
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  Предыдущая
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  Следующая
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}
