'use client'

import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Clock, DollarSign, Users, Star, Bookmark, BookmarkCheck } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

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

  const vacancies = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'ВТБ',
      location: 'Москва',
      salary: '150 000 - 250 000 ₽',
      experience: '3-5 лет',
      employment: 'Полная занятость',
      schedule: 'Полный день',
      description: 'Разработка современных веб-приложений с использованием React, TypeScript и современных инструментов.',
      requirements: ['React', 'TypeScript', 'HTML/CSS', 'JavaScript', 'Git'],
      benefits: ['ДМС', 'Обучение', 'Гибкий график', 'Удаленная работа'],
      rating: 4.8,
      applicants: 15,
      postedDate: '2024-01-15',
      deadline: '2024-02-15'
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'Сбербанк',
      location: 'Санкт-Петербург',
      salary: '180 000 - 300 000 ₽',
      experience: '4-6 лет',
      employment: 'Полная занятость',
      schedule: 'Полный день',
      description: 'Разработка высоконагруженных backend-систем на Python/Java с использованием микросервисной архитектуры.',
      requirements: ['Python', 'Django/FastAPI', 'PostgreSQL', 'Docker', 'Kubernetes'],
      benefits: ['ДМС', 'Корпоративное обучение', 'Бонусы', 'Спортзал'],
      rating: 4.6,
      applicants: 23,
      postedDate: '2024-01-12',
      deadline: '2024-02-12'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Тинькофф',
      location: 'Москва',
      salary: '200 000 - 350 000 ₽',
      experience: '5+ лет',
      employment: 'Полная занятость',
      schedule: 'Гибкий',
      description: 'Разработка полного цикла веб-приложений для финтех продуктов с высокими требованиями к производительности.',
      requirements: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Redis'],
      benefits: ['ДМС', 'Высокая зарплата', 'Акции компании', 'Обучение'],
      rating: 4.9,
      applicants: 8,
      postedDate: '2024-01-18',
      deadline: '2024-02-18'
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'Яндекс',
      location: 'Москва',
      salary: '120 000 - 200 000 ₽',
      experience: '2-4 года',
      employment: 'Полная занятость',
      schedule: 'Полный день',
      description: 'Проектирование пользовательских интерфейсов для веб и мобильных приложений с миллионами пользователей.',
      requirements: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
      benefits: ['ДМС', 'Обеды', 'Транспорт', 'Обучение'],
      rating: 4.7,
      applicants: 31,
      postedDate: '2024-01-10',
      deadline: '2024-02-10'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'МТС',
      location: 'Удаленно',
      salary: '160 000 - 280 000 ₽',
      experience: '3-5 лет',
      employment: 'Полная занятость',
      schedule: 'Гибкий',
      description: 'Автоматизация процессов разработки и развертывания, управление облачной инфраструктурой.',
      requirements: ['Docker', 'Kubernetes', 'AWS/Azure', 'Terraform', 'CI/CD'],
      benefits: ['ДМС', 'Удаленная работа', 'Гибкий график', 'Обучение'],
      rating: 4.5,
      applicants: 19,
      postedDate: '2024-01-16',
      deadline: '2024-02-16'
    },
    {
      id: 6,
      title: 'Product Manager',
      company: 'Ozon',
      location: 'Москва',
      salary: '220 000 - 400 000 ₽',
      experience: '4-7 лет',
      employment: 'Полная занятость',
      schedule: 'Полный день',
      description: 'Управление продуктом в сфере e-commerce, работа с большими данными и аналитикой.',
      requirements: ['Product Management', 'Analytics', 'SQL', 'A/B Testing', 'Agile'],
      benefits: ['ДМС', 'Высокая зарплата', 'Бонусы', 'Карьерный рост'],
      rating: 4.4,
      applicants: 12,
      postedDate: '2024-01-14',
      deadline: '2024-02-14'
    }
  ]

  const filterOptions = {
    location: ['Москва', 'Санкт-Петербург', 'Удаленно', 'Екатеринбург', 'Новосибирск'],
    experience: ['Без опыта', '1-3 года', '3-5 лет', '5+ лет'],
    salary: ['до 100к', '100к-200к', '200к-300к', '300к+'],
    employment: ['Полная занятость', 'Частичная занятость', 'Проектная работа', 'Стажировка'],
    schedule: ['Полный день', 'Гибкий график', 'Сменный график', 'Удаленная работа']
  }

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

  const handleApply = (vacancyId: number) => {
    alert(`Заявка на вакансию ${vacancyId} отправлена!`)
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
              <option>Сортировать по рейтингу</option>
            </select>
          </div>

          <div className="space-y-6">
            {filteredVacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {vacancy.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {vacancy.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">
                      {vacancy.company}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {vacancy.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveVacancy(vacancy.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {savedVacancies.includes(vacancy.id) ? 
                      <BookmarkCheck className="h-5 w-5 text-blue-600" /> : 
                      <Bookmark className="h-5 w-5" />
                    }
                  </button>
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

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Требования:</h4>
                  <div className="flex flex-wrap gap-2">
                    {vacancy.requirements.map((req, idx) => (
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
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Условия:</h4>
                  <div className="flex flex-wrap gap-2">
                    {vacancy.benefits.map((benefit, idx) => (
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
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Опубликовано: {vacancy.postedDate} • Дедлайн: {vacancy.deadline}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      Подробнее
                    </button>
                    <button
                      onClick={() => handleApply(vacancy.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Откликнуться
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
    </div>
  )
}
