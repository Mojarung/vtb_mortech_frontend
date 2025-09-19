'use client'

import { motion } from 'framer-motion'
import { Building, Calendar, Clock, Eye, MessageSquare, Video } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { apiClient } from '../../../lib/api'

export default function CandidateApplications() {
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getApplications()
        setApplications(data)
      } catch (error) {
        console.error('Error fetching applications:', error)
        // Fallback to empty array if API fails
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const navigateToAIInterview = async (application: any) => {
    try {
      // Получаем interview_id через API
      const response = await apiClient.getApplicationInterview(application.id)
      const interviewId = response.interview_id
      
      if (interviewId) {
        router.push(`/candidate/ai-interview?interview_id=${interviewId}`)
      } else {
        // Fallback на старый URL если нет interview_id
        router.push('/candidate/ai-interview')
      }
    } catch (error) {
      console.error('Ошибка получения interview_id:', error)
      // Fallback на старый URL при ошибке
      router.push('/candidate/ai-interview')
    }
  }

  const openVacancyDetails = (vacancy: any) => {
    setSelectedVacancy(vacancy)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedVacancy(null)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'На рассмотрении'
      case 'interview_scheduled':
        return 'Интервью назначено'
      case 'interview_completed':
        return 'Интервью пройдено'
      case 'accepted':
        return 'Принято'
      case 'rejected':
        return 'Отклонено'
      case 'reviewed':
        return 'Просмотрено'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'interview_completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'reviewed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  const stats = [
    { label: 'Всего заявок', value: applications.length, color: 'bg-blue-500' },
    { label: 'На рассмотрении', value: applications.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Интервью', value: applications.filter(a => a.status === 'interview_scheduled' || a.status === 'interview_completed').length, color: 'bg-purple-500' },
    { label: 'Принято', value: applications.filter(a => a.status === 'accepted').length, color: 'bg-green-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="hidden md:block"><Sidebar userRole="candidate" /></div>
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Applications" userRole="candidate" />
        <div className="p-0 sm:p-6">
          {/* HERO */}
          <div className="relative overflow-hidden rounded-none sm:rounded-2xl mx-0 mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900 to-violet-900"></div>
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600 opacity-30 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600 opacity-30 blur-3xl rounded-full"></div>
            <div className="relative px-5 sm:px-8 py-8 sm:py-10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Мои заявки</h1>
                <p className="mt-1 text-violet-100/90">Отслеживайте статусы и двигайтесь дальше</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 px-5 sm:px-0">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
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
            className="mb-6 px-5 sm:px-0"
          >
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Все заявки' },
                { key: 'pending', label: 'На рассмотрении' },
                { key: 'interview_scheduled', label: 'Интервью назначено' },
                { key: 'interview_completed', label: 'Интервью пройдено' },
                { key: 'accepted', label: 'Принято' },
                { key: 'rejected', label: 'Отклонено' }
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-xl transition ${
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
          <div className="space-y-4 px-5 sm:px-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Загрузка заявок...</p>
              </div>
            ) : (
              filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-purple rounded-xl flex items-center justify-center">
                        <Building className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {application.vacancy?.title || 'Неизвестная позиция'}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                          {application.vacancy?.company || application.vacancy?.creator?.full_name || application.vacancy?.creator?.username || 'Неизвестная компания'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                          {application.vacancy?.description || 'Описание не указано'}
                        </p>
                        <button 
                          onClick={() => openVacancyDetails(application.vacancy)}
                          className="text-primary-purple hover:underline text-sm mb-4 block"
                        >
                          Подробнее
                        </button>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            Подано: {new Date(application.uploaded_at).toLocaleDateString('ru-RU')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Building size={16} />
                            {application.vacancy?.location || 'Не указано'}
                          </div>
                          <div className="font-medium text-green-600 dark:text-green-400">
                            {application.vacancy?.salary_from && application.vacancy?.salary_to 
                              ? `${application.vacancy.salary_from.toLocaleString()} - ${application.vacancy.salary_to.toLocaleString()} ₽`
                              : 'Зарплата не указана'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {application.status === 'interview_scheduled' && (
                      <button 
                        onClick={() => navigateToAIInterview(application)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        ПРОЙТИ ИНТЕРВЬЮ
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>

          {filteredApplications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 px-5 sm:px-0"
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
                className="px-6 py-3 bg-primary-purple text-white rounded-xl hover:bg-opacity-90 transition"
              >
                Показать все заявки
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Модальное окно с подробной информацией о вакансии */}
      {isModalOpen && selectedVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedVacancy.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Компания</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedVacancy.company || selectedVacancy.creator?.full_name || selectedVacancy.creator?.username || 'Неизвестная компания'}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Описание</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedVacancy.description || 'Описание не указано'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Местоположение</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedVacancy.location || 'Не указано'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Зарплата</h4>
                  <p className="text-green-600 dark:text-green-400">
                    {selectedVacancy.salary_from && selectedVacancy.salary_to 
                      ? `${selectedVacancy.salary_from.toLocaleString()} - ${selectedVacancy.salary_to.toLocaleString()} ₽`
                      : 'Не указана'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
