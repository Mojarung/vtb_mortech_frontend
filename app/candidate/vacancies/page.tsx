'use client'

import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Clock, DollarSign, Users, Bookmark, BookmarkCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { apiClient } from '../../../lib/api'
import Notification from '../../../components/Notification'

export default function CandidateVacancies() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    experience: '',
    salary: '',
    employment: '',
    schedule: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [savedVacancies, setSavedVacancies] = useState<number[]>([])
  const [appliedVacancies, setAppliedVacancies] = useState<number[]>([])
  const [vacancies, setVacancies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])

  const addNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getVacancies()
        setVacancies(data)
      } catch (error) {
        console.error('Error fetching vacancies:', error)
        // Fallback to empty array if API fails
        setVacancies([])
      } finally {
        setLoading(false)
      }
    }

    const fetchApplications = async () => {
      try {
        const applications = await apiClient.getApplications()
        const appliedIds = applications.map((app: any) => app.vacancy?.id).filter(Boolean)
        setAppliedVacancies(appliedIds)
      } catch (error) {
        console.error('Error fetching applications:', error)
      }
    }

    fetchVacancies()
    fetchApplications()
  }, [])

  

  const filterOptions = {
    location: ['Москва', 'Санкт-Петербург', 'Удаленно', 'Екатеринбург', 'Новосибирск'],
    experience: ['Без опыта', '1-3 года', '3-5 лет', '5+ лет'],
    salary: ['до 100к', '100к-200к', '200к-300к', '300к+'],
    employment: ['Полная занятость', 'Частичная занятость', 'Проектная работа', 'Стажировка'],
    schedule: ['Полный день', 'Гибкий график', 'Сменный график', 'Удаленная работа']
  }

  const formatSalary = (vacancy: any) => {
    const hasRange = vacancy?.salary_from || vacancy?.salary_to
    if (hasRange) {
      const from = vacancy?.salary_from ? `${vacancy.salary_from.toLocaleString('ru-RU')} ₽` : ''
      const to = vacancy?.salary_to ? `${vacancy.salary_to.toLocaleString('ru-RU')} ₽` : ''
      if (from && to) return `${from} — ${to}`
      return from || to
    }
    return vacancy?.salary || 'Не указана'
  }

  const getExperience = (vacancy: any) => vacancy?.experience_level || vacancy?.experience || 'Не указано'
  const getEmployment = (vacancy: any) => vacancy?.employment_type || vacancy?.employment || 'Не указано'

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacancy.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLocation = !selectedFilters.location || vacancy.location === selectedFilters.location
    const matchesExperience = !selectedFilters.experience || vacancy.experience.includes(selectedFilters.experience)
    const matchesEmployment = !selectedFilters.employment || vacancy.employment === selectedFilters.employment
    const matchesSchedule = !selectedFilters.schedule || vacancy.schedule === selectedFilters.schedule

    return matchesSearch && matchesLocation && matchesExperience && matchesEmployment && matchesSchedule
  })

  const handleSaveVacancy = (vacancyId: number) => {
    setSavedVacancies(prev => 
      prev.includes(vacancyId) 
        ? prev.filter(id => id !== vacancyId)
        : [...prev, vacancyId]
    )
  }

  const handleApply = async (vacancyId: number) => {
    // Создаем input для выбора файла
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)
      formData.append('cover_letter', 'Заявка на вакансию')

      try {
        await apiClient.applyToVacancyWithFile(vacancyId, formData)
        setAppliedVacancies(prev => [...prev, vacancyId])
        addNotification('Заявка на вакансию отправлена!', 'success')
      } catch (error) {
        console.error('Error applying to vacancy:', error)
        addNotification('Ошибка при отправке заявки. Попробуйте позже.', 'error')
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="candidate" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Vacancies" userRole="candidate" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Поиск вакансий
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Найдите идеальную работу среди {vacancies.length} доступных вакансий
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Поиск по названию, компании или описанию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter size={20} />
                Фильтры
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(filterOptions).map(([key, options]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {key === 'location' ? 'Локация' :
                         key === 'experience' ? 'Опыт' :
                         key === 'salary' ? 'Зарплата' :
                         key === 'employment' ? 'Занятость' : 'График'}
                      </label>
                      <select
                        value={selectedFilters[key as keyof typeof selectedFilters]}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Все</option>
                        {options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setSelectedFilters({
                      location: '',
                      experience: '',
                      salary: '',
                      employment: '',
                      schedule: ''
                    })}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Найдено {filteredVacancies.length} вакансий
            </p>
            <select className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
              <option>Сортировать по дате</option>
              <option>Сортировать по зарплате</option>
              <option>Сортировать по названию</option>
              <option>Сортировать по компании</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Загрузка вакансий...</p>
              </div>
            ) : (
              filteredVacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {vacancy.title}
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                      {String(vacancy.company || '').trim() || 'Компания не указана'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveVacancy(vacancy.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {savedVacancies.includes(vacancy.id) ? 
                      <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                      <Bookmark className="h-5 w-5" />
                    }
                  </button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {vacancy.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                    <MapPin className="h-3.5 w-3.5" /> {vacancy.location || 'Локация не указана'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs">
                    <DollarSign className="h-3.5 w-3.5" /> {formatSalary(vacancy)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs">
                    <Clock className="h-3.5 w-3.5" /> {getExperience(vacancy)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 text-xs">
                    <Users className="h-3.5 w-3.5" /> {getEmployment(vacancy)}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Требования</h4>
                  <div className="flex flex-wrap gap-2">
                    {vacancy.requirements.map((req: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Условия</h4>
                  <div className="flex flex-wrap gap-2">
                    {vacancy.benefits.map((benefit: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Опубликовано: {vacancy.postedDate || '—'}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm">
                      Подробнее
                    </button>
                    <button
                      onClick={() => handleApply(vacancy.id)}
                      disabled={appliedVacancies.includes(vacancy.id)}
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        appliedVacancies.includes(vacancy.id)
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {appliedVacancies.includes(vacancy.id) ? 'Заявка отправлена' : 'Откликнуться'}
                    </button>
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>

          {filteredVacancies.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Вакансии не найдены
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Попробуйте изменить критерии поиска или фильтры
              </p>
            </motion.div>
          )}
        </div>
      </div>

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
