'use client'

import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Clock, DollarSign, Users, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { apiClient } from '../../../lib/api'
import Notification from '../../../components/Notification'

export default function HRVacancies() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    experience: '',
    salary: '',
    employment: '',
    schedule: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [vacancies, setVacancies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredVacancies, setFilteredVacancies] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  const addNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Форма создания вакансии
  const [newVacancy, setNewVacancy] = useState({
    title: '',
    description: '',
    requirements: '',
    salary_from: '',
    salary_to: '',
    location: '',
    employment_type: '',
    experience_level: '',
    benefits: '',
    company: ''
  })

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getVacancies()
        setVacancies(data)
        setFilteredVacancies(data)
      } catch (error) {
        console.error('Error fetching vacancies:', error)
        setVacancies([])
        setFilteredVacancies([])
      } finally {
        setLoading(false)
      }
    }

    fetchVacancies()
  }, [])

  // Фильтрация вакансий
  useEffect(() => {
    let filtered = vacancies

    // Поиск по названию, компании и описанию
    if (searchTerm) {
      filtered = filtered.filter(vacancy => 
        vacancy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Фильтры
    if (selectedFilters.location) {
      filtered = filtered.filter(vacancy => 
        vacancy.location?.toLowerCase().includes(selectedFilters.location.toLowerCase())
      )
    }

    if (selectedFilters.experience) {
      filtered = filtered.filter(vacancy => 
        vacancy.experience_level === selectedFilters.experience
      )
    }

    if (selectedFilters.employment) {
      filtered = filtered.filter(vacancy => 
        vacancy.employment_type === selectedFilters.employment
      )
    }

    setFilteredVacancies(filtered)
  }, [vacancies, searchTerm, selectedFilters])

  const filterOptions = {
    location: ['Москва', 'Санкт-Петербург', 'Удаленно', 'Екатеринбург', 'Новосибирск'],
    experience: ['Без опыта', '1-3 года', '3-5 лет', '5+ лет'],
    salary: ['до 100к', '100к-200к', '200к-300к', '300к+'],
    employment: ['Полная занятость', 'Частичная занятость', 'Проектная работа', 'Стажировка'],
    schedule: ['Полный день', 'Гибкий график', 'Сменный график', 'Удаленная работа']
  }


  const handleCreateVacancy = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const vacancyData = {
        ...newVacancy,
        salary_from: newVacancy.salary_from ? parseInt(newVacancy.salary_from) : null,
        salary_to: newVacancy.salary_to ? parseInt(newVacancy.salary_to) : null
      }

      console.log('📝 Отправка создания вакансии. Данные:', vacancyData)
      
      await apiClient.createVacancy(vacancyData)
      
      // Обновляем список вакансий
      const data = await apiClient.getVacancies()
      setVacancies(data)
      setFilteredVacancies(data)
      
      // Сбрасываем форму
      setNewVacancy({
        title: '',
        description: '',
        requirements: '',
        salary_from: '',
        salary_to: '',
        location: '',
        employment_type: '',
        experience_level: '',
        benefits: ''
      })
      setShowCreateForm(false)
      
      addNotification('Вакансия успешно создана!', 'success')
    } catch (error) {
      const err = error as any
      const message = err?.message || 'Неизвестная ошибка'
      console.error('❌ Ошибка при создании вакансии:', err)
      addNotification(`Ошибка при создании вакансии: ${message}`, 'error')
    }
  }

  const handleDeleteVacancy = async (vacancyId: number) => {
    if (confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      try {
        await apiClient.deleteVacancy(vacancyId)
        
        // Обновляем список вакансий
        const data = await apiClient.getVacancies()
        setVacancies(data)
        setFilteredVacancies(data)
        
        addNotification('Вакансия удалена!', 'success')
      } catch (error) {
        console.error('Error deleting vacancy:', error)
        addNotification('Ошибка при удалении вакансии. Попробуйте позже.', 'error')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="hr" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Vacancies" userRole="hr" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Управление вакансиями
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Создавайте и управляйте вакансиями
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Создать вакансию
              </button>
            </div>
          </motion.div>

          {/* Форма создания вакансии */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Создать новую вакансию
              </h2>
              <form onSubmit={handleCreateVacancy} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Название вакансии *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVacancy.title}
                      onChange={(e) => setNewVacancy({...newVacancy, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Например: Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Компания *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVacancy.company}
                      onChange={(e) => setNewVacancy({...newVacancy, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Например: ВТБ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Локация
                    </label>
                    <input
                      type="text"
                      value={newVacancy.location}
                      onChange={(e) => setNewVacancy({...newVacancy, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Например: Москва"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Описание *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newVacancy.description}
                    onChange={(e) => setNewVacancy({...newVacancy, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Подробное описание вакансии..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Требования
                  </label>
                  <textarea
                    rows={3}
                    value={newVacancy.requirements}
                    onChange={(e) => setNewVacancy({...newVacancy, requirements: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Требования к кандидату (через запятую)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Условия работы
                  </label>
                  <textarea
                    rows={3}
                    value={newVacancy.benefits}
                    onChange={(e) => setNewVacancy({...newVacancy, benefits: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Условия работы (через запятую): ДМС, Обучение, Гибкий график..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Зарплата от
                    </label>
                    <input
                      type="number"
                      value={newVacancy.salary_from}
                      onChange={(e) => setNewVacancy({...newVacancy, salary_from: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Зарплата до
                    </label>
                    <input
                      type="number"
                      value={newVacancy.salary_to}
                      onChange={(e) => setNewVacancy({...newVacancy, salary_to: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="200000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Опыт работы
                    </label>
                    <select
                      value={newVacancy.experience_level}
                      onChange={(e) => setNewVacancy({...newVacancy, experience_level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Выберите опыт</option>
                      <option value="Без опыта">Без опыта</option>
                      <option value="1-3 года">1-3 года</option>
                      <option value="3-5 лет">3-5 лет</option>
                      <option value="5+ лет">5+ лет</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Создать вакансию
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </motion.div>
          )}

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
          </div>

          <div className="space-y-6">
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {vacancy.title}
                    </h3>
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">
                      {vacancy.company}
                    </p>
                    <div className="text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                      {String(vacancy.description || '')
                        .split(/\n+|\.|\r/)
                        .map((para: string, idx: number) => (
                          para.trim() && (
                            <p key={idx} className="leading-relaxed">{para.trim()}</p>
                          )
                        ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDeleteVacancy(vacancy.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{vacancy.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{vacancy.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{vacancy.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{vacancy.applicants} заявок</span>
                  </div>
                </div>

                {Array.isArray(vacancy.requirements) && vacancy.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Требования:</h4>
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
                )}

                {Array.isArray(vacancy.benefits) && vacancy.benefits.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Условия:</h4>
                    <div className="flex flex-wrap gap-2">
                      {vacancy.benefits.map((b: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Опубликовано: {vacancy.postedDate}
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>

          {filteredVacancies.length === 0 && !loading && (
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
                Попробуйте изменить критерии поиска или создайте новую вакансию
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
