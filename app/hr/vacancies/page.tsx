'use client'

import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Clock, DollarSign, Users, Plus, Edit, Trash2, Eye, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { apiClient } from '../../../lib/api'
import Notification from '../../../components/Notification'
import { useAuth } from '../../../contexts/AuthContext'

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
  const [selectedVacancy, setSelectedVacancy] = useState<any | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState<any | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const { user } = useAuth()

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
        benefits: '',
        company: ''
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

  const handleViewDetails = (vacancy: any) => {
    setSelectedVacancy(vacancy)
    setShowDetailsModal(true)
  }

  const handleEditVacancy = (vacancy: any) => {
    setEditingVacancy(vacancy)
    setShowEditForm(true)
  }

  const handleUpdateVacancy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVacancy) return

    try {
      const updateData = {
        ...editingVacancy,
        salary_from: editingVacancy.salary_from ? parseInt(editingVacancy.salary_from) : null,
        salary_to: editingVacancy.salary_to ? parseInt(editingVacancy.salary_to) : null
      }

      await apiClient.updateVacancy(editingVacancy.id, updateData)
      
      // Обновляем список вакансий
      const data = await apiClient.getVacancies()
      setVacancies(data)
      setFilteredVacancies(data)
      
      setEditingVacancy(null)
      setShowEditForm(false)
      addNotification('Вакансия обновлена!', 'success')
    } catch (error) {
      console.error('Error updating vacancy:', error)
      addNotification('Ошибка при обновлении вакансии', 'error')
    }
  }

  const canEditVacancy = (vacancy: any) => {
    console.log('🔍 Checking edit permissions:', {
      userId: user?.id,
      vacancyCreatorId: vacancy?.creator_id,
      canEdit: user?.id && vacancy?.creator_id && vacancy.creator_id === user.id,
      vacancy: vacancy
    })
    return user?.id && vacancy?.creator_id && vacancy.creator_id === user.id
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
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleViewDetails(vacancy)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Просмотреть детали"
                    >
                      <Eye size={18} />
                    </button>
                    {canEditVacancy(vacancy) && (
                      <>
                        <button 
                          onClick={() => handleEditVacancy(vacancy)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-green-600 transition-colors"
                          title="Редактировать"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteVacancy(vacancy.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-red-600 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 whitespace-pre-line">
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

                {Array.isArray(vacancy.requirements) && vacancy.requirements.length > 0 && (
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
                )}

                {Array.isArray(vacancy.benefits) && vacancy.benefits.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Условия</h4>
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Опубликовано: {vacancy.postedDate ? new Date(vacancy.postedDate).toLocaleDateString('ru-RU') : vacancy.created_at ? new Date(vacancy.created_at).toLocaleDateString('ru-RU') : '—'}
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

      {/* Модальное окно для деталей вакансии */}
      {showDetailsModal && selectedVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedVacancy.title}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {/* Основная информация */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Компания</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedVacancy.company || 'Не указана'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Локация</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedVacancy.location || 'Не указана'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Зарплата</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatSalary(selectedVacancy)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Опыт</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{getExperience(selectedVacancy)}</p>
                  </div>
                </div>

                {/* Описание */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Описание</h3>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedVacancy.description}</p>
                  </div>
                </div>

                {/* Требования */}
                {Array.isArray(selectedVacancy.requirements) && selectedVacancy.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Требования</h3>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {selectedVacancy.requirements.map((req: string, idx: number) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Условия работы */}
                {Array.isArray(selectedVacancy.benefits) && selectedVacancy.benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Условия работы</h3>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {selectedVacancy.benefits.map((benefit: string, idx: number) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Дополнительная информация */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Тип занятости</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{getEmployment(selectedVacancy)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Дата создания</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedVacancy.postedDate ? new Date(selectedVacancy.postedDate).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : selectedVacancy.created_at ? new Date(selectedVacancy.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Не указана'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Модальное окно для редактирования вакансии */}
      {showEditForm && editingVacancy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Редактировать вакансию
              </h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleUpdateVacancy} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Название вакансии *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingVacancy.title || ''}
                      onChange={(e) => setEditingVacancy({...editingVacancy, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Компания *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingVacancy.company || ''}
                      onChange={(e) => setEditingVacancy({...editingVacancy, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Локация
                    </label>
                    <input
                      type="text"
                      value={editingVacancy.location || ''}
                      onChange={(e) => setEditingVacancy({...editingVacancy, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={editingVacancy.description || ''}
                    onChange={(e) => setEditingVacancy({...editingVacancy, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Требования
                  </label>
                  <textarea
                    rows={3}
                    value={editingVacancy.requirements || ''}
                    onChange={(e) => setEditingVacancy({...editingVacancy, requirements: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Условия работы
                  </label>
                  <textarea
                    rows={3}
                    value={editingVacancy.benefits || ''}
                    onChange={(e) => setEditingVacancy({...editingVacancy, benefits: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Зарплата от
                    </label>
                    <input
                      type="number"
                      value={editingVacancy.salary_from || ''}
                      onChange={(e) => setEditingVacancy({...editingVacancy, salary_from: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Зарплата до
                    </label>
                    <input
                      type="number"
                      value={editingVacancy.salary_to || ''}
                      onChange={(e) => setEditingVacancy({...editingVacancy, salary_to: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Опыт работы
                    </label>
                    <select
                      value={editingVacancy.experience_level || ''}
                      onChange={(e) => setEditingVacancy({...editingVacancy, experience_level: e.target.value})}
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

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Сохранить изменения
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
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
