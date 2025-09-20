'use client'

import { motion } from 'framer-motion'
import { Users, Eye, Download, Filter, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { ProtectedRoute } from '../../../components/ProtectedRoute'
import { apiClient, Interview } from '../../../lib/api'

export default function HRInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openSummaries, setOpenSummaries] = useState<Set<number>>(new Set())
  const [openDialogues, setOpenDialogues] = useState<Set<number>>(new Set())
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null)
  const [selectedVacancyFilter, setSelectedVacancyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [generatingOffer, setGeneratingOffer] = useState<number | null>(null)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiClient.getInterviews()
        // Сначала пройденные интервью (с отчетом), потом запланированные
        const allInterviews = Array.isArray(data) ? data.filter(interview => interview.status === 'not_started') : []
        const sortedInterviews = allInterviews.sort((a, b) => {
          // Сначала те, у которых есть summary (пройденные)
          if (a.summary && !b.summary) return -1
          if (!a.summary && b.summary) return 1
          return 0
        })
        setInterviews(sortedInterviews)
      } catch (err) {
        console.error('Error fetching interviews:', err)
        setError('Ошибка загрузки интервью')
        setInterviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  const getStatusColor = (status: string, summary?: string) => {
    if (status === 'not_started' && summary) {
      // Пройдено - зеленый с галочкой
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
    } else if (status === 'not_started') {
      // Запланировано - синий с календарем
      return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
    } else if (status === 'completed') {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    } else if (status === 'in_progress') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    } else {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusText = (status: string, summary?: string) => {
    switch (status) {
      case 'not_started':
        return summary ? 'Пройдено' : 'Запланировано'
      case 'completed':
        return 'Завершено'
      case 'in_progress':
        return 'В процессе'
      default:
        return 'Неизвестно'
    }
  }

  // Фильтрация интервью
  const filteredInterviews = interviews.filter(interview => {
    // Фильтр по вакансии
    const matchesVacancy = !selectedVacancyFilter || 
      interview.vacancy?.title?.toLowerCase().includes(selectedVacancyFilter.toLowerCase())
    
    if (!matchesVacancy) return false
    
    // Фильтр по статусу
    if (statusFilter === 'completed') {
      return interview.summary // Только пройденные (с отчетом)
    } else if (statusFilter === 'scheduled') {
      return !interview.summary && interview.status === 'not_started' // Только запланированные
    }
    
    // По умолчанию показываем все релевантные (пройденные + запланированные)
    return interview.summary || interview.status === 'not_started'
  })

  // Получаем уникальные вакансии для фильтра
  const uniqueVacancies = Array.from(new Set(interviews.map(interview => interview.vacancy?.title).filter(Boolean)))


  const getCandidateName = (interview: Interview) => {
    // Пытаемся получить имя из связанных данных
    if (interview.resume?.user?.full_name) {
      return interview.resume.user.full_name
    }
    if (interview.resume?.user?.first_name && interview.resume?.user?.last_name) {
      return `${interview.resume.user.first_name} ${interview.resume.user.last_name}`
    }
    if (interview.resume?.user?.username) {
      return interview.resume.user.username
    }
    return 'Неизвестный кандидат'
  }

  const getPosition = (interview: Interview) => {
    return interview.vacancy?.title || 'Позиция не указана'
  }

  const getAvatar = (interview: Interview) => {
    const name = getCandidateName(interview)
    const words = name.split(' ')
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const toggleSummary = (id: number) => {
    setOpenSummaries(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDialogue = (id: number) => {
    setOpenDialogues(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openVacancyDetails = (vacancy: any) => {
    setSelectedVacancy(vacancy)
    setShowDetailsModal(true)
  }

  const closeModal = () => {
    setShowDetailsModal(false)
    setSelectedVacancy(null)
  }

  const generateOffer = async (interviewId: number) => {
    try {
      setGeneratingOffer(interviewId)
      const response = await apiClient.generateOffer(interviewId)
      
      // Создаем blob из base64 данных
      const pdfBlob = new Blob([Uint8Array.from(atob(response.pdf_data), c => c.charCodeAt(0))], {
        type: 'application/pdf'
      })
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = response.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Обновляем список интервью
      const updatedInterviews = interviews.map(interview => 
        interview.id === interviewId 
          ? { ...interview, resume: { ...interview.resume, status: 'accepted' } }
          : interview
      )
      setInterviews(updatedInterviews)
      
    } catch (error) {
      console.error('Ошибка при генерации оффера:', error)
      alert('Ошибка при генерации оффера. Попробуйте еще раз.')
    } finally {
      setGeneratingOffer(null)
    }
  }


  type DialogueMessage = {
    timestamp?: string
    role?: 'assistant' | 'user' | string
    content?: string
  }

  const parseDialogueMessages = (dialogue: any): DialogueMessage[] => {
    if (!dialogue) return []
    if (Array.isArray(dialogue)) return dialogue as DialogueMessage[]
    if (Array.isArray(dialogue?.dialogue)) return dialogue.dialogue as DialogueMessage[]
    return []
  }

  const formatTimestamp = (ts?: string) => {
    if (!ts) return ''
    const date = new Date(ts)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <ProtectedRoute requiredRole="hr">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Sidebar userRole="hr" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader title="Interviews" userRole="hr" />
          <div className="p-0 sm:p-6">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-none sm:rounded-2xl mx-0 mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900 to-violet-900"></div>
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600 opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600 opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
          <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-cyan-500/20 rounded-full blur-md"></div>
          <div className="relative px-5 sm:px-8 py-8 sm:py-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Интервью</h1>
                <p className="mt-1 text-violet-100/90">Управление расписанием интервью и их проведение</p>
              </div>
            </div>
          </div>
        </div>

        {/* Панель фильтров */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-5 sm:px-0 mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter size={20} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Фильтры</span>
                </button>
                {selectedVacancyFilter && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Фильтр: {selectedVacancyFilter}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Показано {filteredInterviews.length} из {interviews.length}
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.3, 
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Вакансия
                    </label>
                    <select 
                      value={selectedVacancyFilter}
                      onChange={(e) => setSelectedVacancyFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <option value="">Все вакансии</option>
                      {uniqueVacancies.map(vacancy => (
                        <option key={vacancy} value={vacancy}>{vacancy}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Статус интервью
                    </label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <option value="">Все интервью</option>
                      <option value="completed">Пройденные</option>
                      <option value="scheduled">Запланированные</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedVacancyFilter('')
                        setStatusFilter('')
                      }}
                      className="px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 px-5 sm:px-0"
        >
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Загрузка интервью...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Попробовать снова
                </button>
              </div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Нет запланированных интервью</p>
              </div>
            ) : (
              filteredInterviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform duration-300">
                        {getAvatar(interview)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {getCandidateName(interview)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {getPosition(interview)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(interview.status, interview.summary)}`}>
                        {getStatusText(interview.status, interview.summary)}
                      </span>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => openVacancyDetails(interview.vacancy)}
                          className="group flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
                          title="Подробнее о вакансии"
                        >
                          <Eye size={16} className="group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-semibold">Вакансия</span>
                        </button>
                        
                        <a
                          href={apiClient.getResumeDownloadUrlById(interview.resume_id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
                          title="Скачать резюме"
                        >
                          <Download size={16} className="group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-semibold">Резюме</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Кнопки отчета, диалога и оффера */}
                  {(interview.summary || interview.dialogue) && (
                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                      {interview.summary && (
                        <button 
                          onClick={() => toggleSummary(interview.id)}
                          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-300 text-sm font-semibold hover:scale-105 hover:shadow-lg"
                        >
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {openSummaries.has(interview.id) ? 'Скрыть отчёт' : 'Показать отчёт'}
                        </button>
                      )}
                      {interview.dialogue && (
                        <button 
                          onClick={() => toggleDialogue(interview.id)}
                          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-sm font-semibold hover:scale-105 hover:shadow-lg"
                        >
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {openDialogues.has(interview.id) ? 'Скрыть диалог' : 'Показать диалог'}
                        </button>
                      )}
                      {interview.summary && interview.resume?.status !== 'accepted' && (
                        <button 
                          onClick={() => generateOffer(interview.id)}
                          disabled={generatingOffer === interview.id}
                          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all duration-300 text-sm font-semibold hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {generatingOffer === interview.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Генерация...
                            </>
                          ) : (
                            <>
                              <FileText size={16} className="group-hover:scale-110 transition-transform duration-300" />
                              Отправить оффер
                            </>
                          )}
                        </button>
                      )}
                      {interview.resume?.status === 'accepted' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Оффер отправлен
                        </div>
                      )}
                    </div>
                  )}
                  
                  {(openSummaries.has(interview.id) && interview.summary) && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Отчёт</h4>
                      <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        {interview.summary}
                      </div>
                    </div>
                  )}
                  {(openDialogues.has(interview.id) && interview.dialogue) && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Диалог</h4>
                      <div className="max-w-full overflow-x-auto">
                        <div className="max-h-96 overflow-y-auto pr-2">
                          <div className="space-y-3">
                            {parseDialogueMessages(interview.dialogue).map((msg, idx) => {
                              const isUser = msg.role === 'user'
                              const isAssistant = msg.role === 'assistant'
                              return (
                                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 border text-sm whitespace-pre-wrap ${
                                    isUser
                                      ? 'bg-primary-purple text-white border-transparent'
                                      : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                                  }`}>
                                    {msg.content || ''}
                                    <div className={`mt-1 text-[11px] ${isUser ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                      {formatTimestamp(msg.timestamp)}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
        </motion.div>
        </div>
      </div>

      {/* Модальное окно с подробной информацией о вакансии */}
      {showDetailsModal && selectedVacancy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedVacancy.title}</h2>
                <p className="text-sm text-blue-600 dark:text-blue-400">{selectedVacancy.company || 'Компания не указана'}</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[75vh] space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Локация</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedVacancy.location || 'Не указана'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Зарплата</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedVacancy.salary_from && selectedVacancy.salary_to 
                      ? `${selectedVacancy.salary_from.toLocaleString()} - ${selectedVacancy.salary_to.toLocaleString()} ₽`
                      : 'Не указана'
                    }
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Опыт</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedVacancy.experience_level || 'Не указан'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Занятость</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedVacancy.employment_type || 'Не указана'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Описание</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedVacancy.description || '—'}</p>
              </div>
              {selectedVacancy.requirements && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Требования</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedVacancy.requirements}</p>
                </div>
              )}
              {selectedVacancy.benefits && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Условия</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedVacancy.benefits}</p>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Закрыть</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}
