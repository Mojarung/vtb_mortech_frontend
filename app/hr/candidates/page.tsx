'use client'

import { motion } from 'framer-motion'
import { Search, Filter, Calendar, MoreHorizontal, Eye, Edit, Trash2, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { apiClient } from '../../../lib/api'
import Notification from '../../../components/Notification'
import { useAuth } from '../../../contexts/AuthContext'

function extractRecommendation(notes?: string | null): string {
  if (!notes) return '—'
  const marker = 'РЕКОМЕНДАЦИЯ_СТРУКТУРА:'
  const idx = notes.indexOf(marker)
  if (idx === -1) return '—'
  const after = notes.slice(idx + marker.length).trim()
  const firstLine = after.split(/\r?\n/)[0].trim()
  return firstLine || '—'
}

function extractFromNotes(notes?: string | null, label?: string): string {
  if (!notes) return '—'
  const lines = notes.split(/\r?\n/)
  if (label) {
    const line = lines.find(l => l.includes(label))
    if (line) {
      const parts = line.split(':')
      if (parts.length > 1) {
        const value = parts.slice(1).join(':').trim()
        return value || '—'
      }
    }
  }
  return '—'
}

function sanitizeListItem(item: string): string {
  if (!item) return ''
  return item
    .trim()
    .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
    .replace(/\s*@[^\s]+\s*\([^)]*\)\s*$/g, '') // Remove @username (description) patterns
    .trim()
}

function extractAiBlock(notes?: string | null): string {
  if (!notes) return ''
  const marker = '🤖 АНАЛИЗ ИИ:'
  const idx = notes.indexOf(marker)
  return idx >= 0 ? notes.slice(idx) : notes
}

function getRecommendationBadgeClasses(text: string): string {
  const t = (text || '').toLowerCase()
  if (!t || t === '—') return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  if (t.includes('не рекоменд')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  if (t.includes('требует') || t.includes('проверь')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  if (t.includes('рекоменд')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

function getStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'interview_scheduled':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'interview_completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'accepted':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function HRCandidates() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredCandidates, setFilteredCandidates] = useState<any[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null)
  const [selectedAnalysisData, setSelectedAnalysisData] = useState<any | null>(null)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [editingStatus, setEditingStatus] = useState<number | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [notifications, setNotifications] = useState<any[]>([])
  const { user } = useAuth()

  const addNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleDeleteApplication = async (applicationId: number) => {
    try {
      await apiClient.deleteApplication(applicationId)
      setCandidates(prev => prev.filter(candidate => candidate.id !== applicationId))
      addNotification('Заявка удалена', 'success')
    } catch (error) {
      console.error('Error deleting application:', error)
      addNotification('Ошибка при удалении заявки', 'error')
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Ожидает рассмотрения',
      'interview_scheduled': 'Интервью назначено',
      'interview_completed': 'Интервью пройдено',
      'accepted': 'Принята',
      'rejected': 'Отклонена'
    }
    return statusMap[status] || status
  }

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)
        console.log('🚀 Начало загрузки кандидатов')
        
        // Получаем только обработанные заявки
        const data = await apiClient.getCandidates({ processed: true })
        
        console.log('📦 Полученные данные:', data)
        const list = Array.isArray(data) ? data : []
        const onlyMineAndProcessed = list.filter((r: any) => {
          const isProcessed = r.processed === true
          const sameHr = r?.vacancy?.creator_id && user?.id ? r.vacancy.creator_id === user.id : true
          return isProcessed && sameHr
        })
        // Маппим базовые данные
        const baseMapped = onlyMineAndProcessed.map((r: any) => {
          const fullNameCandidate = r?.user?.full_name || [r?.user?.first_name, r?.user?.last_name].filter(Boolean).join(' ').trim() || r?.user?.username || '—'
          const position = r?.vacancy?.title || extractFromNotes(r?.notes, '• Позиция') || '—'
          const date = r?.uploaded_at ? new Date(r.uploaded_at).toLocaleDateString() : '—'
          const rec = r?.analysis?.recommendation || extractFromNotes(r?.notes, '🎯 РЕКОМЕНДАЦИЯ') || extractRecommendation(r?.notes)
          return {
            id: r.id,
            candidate_name: fullNameCandidate,
            position,
            date,
            type: '—',
            status: r.status,
            recommended: rec && rec !== '—' ? rec : '—',
            resume_path: r.file_path,
            ai_analysis: r?.notes ? extractAiBlock(r.notes) : (r?.analysis ? JSON.stringify(r.analysis, null, 2) : ''),
            _resume: r
          }
        })

        // Подгружаем анализы с бэка для каждого резюме (если нет analysis/notes)
        const withAnalysis = await Promise.all(baseMapped.map(async (item: any) => {
          if (item.recommended !== '—' && item.ai_analysis) return item
          try {
            const analysis = await apiClient.getResumeAnalysis(item.id)
            const recommendation = analysis?.recommendation || item.recommended
            const aiText = analysis ? JSON.stringify(analysis, null, 2) : item.ai_analysis
            return {
              ...item,
              recommended: recommendation || item.recommended,
              ai_analysis: aiText || item.ai_analysis
            }
          } catch (e) {
            return item
          }
        }))

        if (withAnalysis.length === 0) {
          console.warn('🚨 Нет подходящих заявок после фильтрации (processed + hr)')
          addNotification('Нет заявок для вашего аккаунта HR', 'warning')
        } else {
          console.log(`✅ К отображению: ${withAnalysis.length}`)
          console.log('🔍 Пример записи:', withAnalysis[0])
        }

        setCandidates(withAnalysis)
        setFilteredCandidates(withAnalysis)
      } catch (error) {
        console.error('❌ Ошибка получения кандидатов:', error)
        
        // Более информативное уведомление об ошибке
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Неизвестная ошибка при получении кандидатов'
        
        addNotification(errorMessage, 'error')
        
        // Очистка состояния
        setCandidates([])
        setFilteredCandidates([])
      } finally {
        setLoading(false)
        console.log('🏁 Загрузка кандидатов завершена')
      }
    }

    // Запускаем загрузку только когда есть данные пользователя
    if (user) fetchCandidates()
  }, [user])

  // Фильтрация кандидатов
  useEffect(() => {
    let filtered = candidates

    if (selectedPosition) {
      filtered = filtered.filter(candidate => 
        candidate.position?.toLowerCase().includes(selectedPosition.toLowerCase())
      )
    }

    if (selectedStatus) {
      filtered = filtered.filter(candidate => candidate.status === selectedStatus)
    }

    if (selectedDate) {
      filtered = filtered.filter(candidate => {
        const candidateDate = new Date(candidate.created_at).toISOString().split('T')[0]
        return candidateDate === selectedDate
      })
    }

    setFilteredCandidates(filtered)
  }, [candidates, selectedPosition, selectedStatus, selectedDate])

  const handleStatusChange = async (applicationId: number, status: string) => {
    try {
      console.log('🔄 Frontend: Starting status update', { applicationId, status });
      const result = await apiClient.updateApplicationStatus(applicationId, status)
      console.log('✅ Frontend: Status update successful', result);
      
      // Обновляем локальное состояние
      setCandidates(prev => prev.map(candidate => 
        candidate.id === applicationId 
          ? { ...candidate, status: status }
          : candidate
      ))
      setEditingStatus(null)
      addNotification('Статус заявки обновлен!', 'success')
    } catch (error) {
      console.error('❌ Frontend: Error updating status:', error)
      addNotification('Ошибка при обновлении статуса', 'error')
    }
  }

  

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
                  <select 
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Все позиции</option>
                    {Array.from(new Set(candidates.map(c => c.position))).map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Все статусы</option>
                    <option value="pending">Ожидает рассмотрения</option>
                    <option value="accepted">Принята</option>
                    <option value="rejected">Отклонена</option>
                    <option value="interview_scheduled">Интервью назначено</option>
                    <option value="interview_completed">Интервью пройдено</option>
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
                    Кандидат
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Позиция
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Рекомендация
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
                        <p className="text-gray-500">Загрузка заявок...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {candidate.candidate_name}
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecommendationBadgeClasses(candidate.recommended)}`}>
                        {candidate.recommended}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(candidate.status)}`}>
                        {getStatusText(candidate.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {candidate.id && (
                          <a
                            className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Скачать резюме"
                            href={apiClient.getResumeDownloadUrlById(candidate.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600 dark:text-gray-300">
                              <path d="M12 3a1 1 0 011 1v8.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 12.586V4a1 1 0 011-1z" />
                              <path d="M5 15a1 1 0 011 1v2h12v-2a1 1 0 112 0v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3a1 1 0 012 0v2h2v-2a1 1 0 011-1z" />
                            </svg>
                          </a>
                        )}
                        <button 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Просмотреть анализ ИИ"
                          onClick={() => {
                            setSelectedAnalysis(candidate.ai_analysis)
                            setSelectedAnalysisData(null)
                            setShowAnalysisModal(true)
                            // Подгружаем структурированный анализ по id
                            apiClient.getResumeAnalysis(candidate.id)
                              .then((data) => setSelectedAnalysisData(data))
                              .catch(() => {})
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          title="Изменить статус"
                          onClick={() => {
                            setEditingStatus(candidate.id)
                            setNewStatus(candidate.status)
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Удалить заявку"
                          onClick={() => handleDeleteApplication(candidate.id)}
                        >
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
                        <p className="text-gray-500">Нет заявок</p>
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
                Показано {filteredCandidates.length} из {candidates.length}
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

      {/* Модальное окно для анализа ИИ */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Анализ ИИ
              </h2>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Красиво оформленный анализ */}
              <div className="space-y-4">
                {/* Блок пользователя и позиции */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Кандидат</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedAnalysisData?.name || filteredCandidates.find(c => c.ai_analysis === selectedAnalysis)?.candidate_name || '—'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Позиция</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedAnalysisData?.position || filteredCandidates.find(c => c.ai_analysis === selectedAnalysis)?.position || '—'}</p>
                  </div>
                </div>
                {/* Вердикт */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">Вердикт</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRecommendationBadgeClasses(selectedAnalysisData?.recommendation || filteredCandidates.find(c => c.ai_analysis === selectedAnalysis)?.recommended || '—')}`}>
                    {selectedAnalysisData?.recommendation || filteredCandidates.find(c => c.ai_analysis === selectedAnalysis)?.recommended || '—'}
                  </span>
                </div>
                {/* Краткое объяснение, плюсы и минусы из текста */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">Почему такой вердикт</p>
                    {selectedAnalysisData ? (
                      <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {selectedAnalysisData?.match_score && (
                          <p><span className="text-gray-500">Соответствие:</span> {selectedAnalysisData.match_score}</p>
                        )}
                        {selectedAnalysisData?.education && (
                          <p><span className="text-gray-500">Образование:</span> {selectedAnalysisData.education}</p>
                        )}
                        {selectedAnalysisData?.experience && (
                          <p><span className="text-gray-500">Опыт:</span> {selectedAnalysisData.experience}</p>
                        )}
                        {Array.isArray(selectedAnalysisData?.key_skills) && selectedAnalysisData.key_skills.length > 0 && (
                          <p><span className="text-gray-500">Ключевые навыки:</span> {selectedAnalysisData.key_skills.slice(0,6).join(', ')}</p>
                        )}
                        {selectedAnalysisData?.brief_reason && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Краткое объяснение вердикта</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{selectedAnalysisData.brief_reason}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedAnalysis || '—'}</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">Сильные стороны</p>
                      {Array.isArray(selectedAnalysisData?.strengths) && selectedAnalysisData.strengths.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {selectedAnalysisData.strengths
                            .map((item: string) => sanitizeListItem(item))
                            .filter((item: string) => item.length > 0)
                            .slice(0, 6)
                            .map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      ) : Array.isArray(selectedAnalysisData?.achievements) && selectedAnalysisData.achievements.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {selectedAnalysisData.achievements
                            .map((item: string) => sanitizeListItem(item))
                            .filter((item: string) => item.length > 0)
                            .slice(0, 6)
                            .map((s: string, i: number) => (
                            <li key={i}>{sanitizeListItem(s)}</li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {(selectedAnalysis || '')
                            .split('\n')
                            .filter(l => l.trim().startsWith('•'))
                            .map(l => sanitizeListItem(l.replace(/^•\s?/, '')))
                            .filter((s: string) => s.length > 0)
                            .slice(0, 5)
                            .map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">Слабые стороны</p>
                      {Array.isArray(selectedAnalysisData?.weaknesses) && selectedAnalysisData.weaknesses.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {selectedAnalysisData.weaknesses
                            .filter((w: string) => w.length > 0)
                            .map((w: string, i: number) => (
                            <li key={i}>{sanitizeListItem(w)}</li>
                          ))}
                        </ul>
                      ) : Array.isArray(selectedAnalysisData?.missing_skills) && selectedAnalysisData.missing_skills.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {selectedAnalysisData.missing_skills
                            .filter((w: string) => w.length > 0)
                            .map((w: string, i: number) => (
                            <li key={i}>{sanitizeListItem(w)}</li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {(selectedAnalysis || '')
                            .split('\n')
                            .filter(l => l.toLowerCase().includes('слаб') || l.toLowerCase().includes('нет'))
                            .map(l => sanitizeListItem(l.replace(/^•\s?/, '')))
                            .filter((s: string) => s.length > 0)
                            .slice(0, 5)
                            .map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Модальное окно для изменения статуса */}
      {editingStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Изменить статус заявки
              </h2>
              <button
                onClick={() => setEditingStatus(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Новый статус
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Ожидает рассмотрения</option>
                  <option value="interview_scheduled">Интервью назначено</option>
                  <option value="interview_completed">Интервью пройдено</option>
                  <option value="accepted">Принята</option>
                  <option value="rejected">Отклонена</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    handleStatusChange(editingStatus, newStatus)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setEditingStatus(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Уведомления */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}
