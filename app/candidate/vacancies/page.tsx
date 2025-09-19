'use client'

import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Clock, DollarSign, Users, Bookmark, BookmarkCheck } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
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
  const [sortBy, setSortBy] = useState('date') // 'date', 'salary', 'title', 'company'
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedVacancy, setSelectedVacancy] = useState<any | null>(null)

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

  const filteredVacancies = useMemo(() => {
    let filtered = [...vacancies]

    const matchesSearch = (vacancy: any) =>
      vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilters = (vacancy: any) =>
      (!selectedFilters.location || vacancy.location === selectedFilters.location) &&
      (!selectedFilters.experience || vacancy.experience.includes(selectedFilters.experience)) &&
      (!selectedFilters.employment || vacancy.employment === selectedFilters.employment) &&
      (!selectedFilters.schedule || vacancy.schedule === selectedFilters.schedule)

    return filtered.filter(vacancy => matchesSearch(vacancy) && matchesFilters(vacancy))
  }, [vacancies, searchTerm, selectedFilters])

  const sortedAndFilteredVacancies = useMemo(() => {
    let sorted = [...filteredVacancies]
    switch (sortBy) {
      case 'salary':
        sorted.sort((a, b) => (b.salary_from || 0) - (a.salary_from || 0))
        break
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'company':
        sorted.sort((a, b) => a.company.localeCompare(b.company))
        break
      case 'date':
      default:
        sorted.sort((a, b) => new Date(b.postedDate || b.created_at).getTime() - new Date(a.postedDate || a.created_at).getTime())
        break
    }
    return sorted
  }, [filteredVacancies, sortBy])

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
      <div className="hidden md:block"><Sidebar userRole="candidate" /></div>
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Vacancies" userRole="candidate" />
        <div className="p-0 sm:p-6">
          {/* HERO */}
          <div className="relative overflow-hidden rounded-none sm:rounded-2xl mx-0 mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900 to-violet-900"></div>
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600 opacity-30 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600 opacity-30 blur-3xl rounded-full"></div>
            {/* Дополнительные легкие элементы */}
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
            <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-cyan-500/20 rounded-full blur-md"></div>
            <div className="relative px-5 sm:px-8 py-8 sm:py-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Вакансии</h1>
              <p className="mt-1 text-violet-100/90">Подберите позицию под ваш опыт и интересы</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/70 dark:border-gray-700/70 p-5 sm:p-6 mb-6 mx-5 sm:mx-0 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            {/* Легкий декоративный элемент */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/3 to-purple-500/3 rounded-full blur-xl"></div>
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
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Filter size={20} />
                  Фильтры
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Сортировать по дате</option>
                  <option value="salary">Сортировать по зарплате</option>
                  <option value="title">Сортировать по названию</option>
                  <option value="company">Сортировать по компании</option>
                </select>
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 px-5 sm:px-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Загрузка вакансий...</p>
              </div>
            ) : (
              sortedAndFilteredVacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/70 dark:border-gray-700/70 overflow-hidden group"
              >
                {/* Легкий декоративный фон */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-105 transition-transform duration-500"></div>
                
                {/* Контент карточки */}
                <div className="relative z-10">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {vacancy.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                      {String(vacancy.company || '').trim() || 'Компания не указана'}
                    </p>
                  </div>
                  {/* Без иконки сохранения для визуального паритета с HR */}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
    <MapPin className="h-3.5 w-3.5" /> {vacancy.location || 'Локация не указана'}
  </span>
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs">
    <span className="h-3.5 w-3.5">₽</span> {formatSalary(vacancy)}
  </span>
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs">
    <Clock className="h-3.5 w-3.5" /> {getExperience(vacancy)}
  </span>
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 text-xs">
    <Users className="h-3.5 w-3.5" /> {getEmployment(vacancy)}
  </span>
</div>


                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 whitespace-pre-line">
                  {vacancy.description}
                </p>

                {/* Требования и Условия - ограничено 3 штуками */}
                {(Array.isArray(vacancy.requirements) && vacancy.requirements.length > 0) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Требования</h4>
                    <div className="flex flex-wrap gap-2">
                      {vacancy.requirements.slice(0, 3).map((req: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                        >
                          {req}
                        </span>
                      ))}
                      {vacancy.requirements.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                          +{vacancy.requirements.length - 3} еще
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {(Array.isArray(vacancy.benefits) && vacancy.benefits.length > 0) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Условия</h4>
                    <div className="flex flex-wrap gap-2">
                      {vacancy.benefits.slice(0, 3).map((benefit: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                      {vacancy.benefits.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                          +{vacancy.benefits.length - 3} еще
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Опубликовано: {vacancy.postedDate || '—'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedVacancy(vacancy); setShowDetailsModal(true) }}
                      className="px-3 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-sm"
                    >
                      Подробнее
                    </button>
                    <button
                      onClick={() => handleApply(vacancy.id)}
                      disabled={appliedVacancies.includes(vacancy.id)}
                      className={`px-3 py-2 rounded-xl transition text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                        appliedVacancies.includes(vacancy.id)
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {appliedVacancies.includes(vacancy.id) ? 'Заявка отправлена' : 'Откликнуться'}
                    </button>
                  </div>
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

      {/* Модальное окно деталей вакансии */}
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
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[75vh] space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Локация</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedVacancy.location || 'Не указана'}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Зарплата</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatSalary(selectedVacancy)}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Опыт</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{getExperience(selectedVacancy)}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Занятость</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{getEmployment(selectedVacancy)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Описание</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedVacancy.description || '—'}</p>
              </div>
              {Array.isArray(selectedVacancy.requirements) && selectedVacancy.requirements.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Требования</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {selectedVacancy.requirements.map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(selectedVacancy.benefits) && selectedVacancy.benefits.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Условия</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {selectedVacancy.benefits.map((b: string, idx: number) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Закрыть</button>
              <button onClick={() => { if (selectedVacancy) handleApply(selectedVacancy.id) }} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm">Откликнуться</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
