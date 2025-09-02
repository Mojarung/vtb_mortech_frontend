import { useState, useEffect } from 'react'

export type Language = 'ru' | 'en'

interface Translations {
  [key: string]: {
    ru: string
    en: string
  }
}

const translations: Translations = {
  // Dashboard
  'dashboard': { ru: 'Панель управления', en: 'Dashboard' },
  'candidates': { ru: 'Кандидаты', en: 'Candidates' },
  'interviews': { ru: 'Интервью', en: 'Interviews' },
  'analytics': { ru: 'Аналитика', en: 'Analytics' },
  'reports': { ru: 'Отчеты', en: 'Reports' },
  'settings': { ru: 'Настройки', en: 'Settings' },
  'logout': { ru: 'Выйти', en: 'Logout' },
  
  // Candidate menu
  'my_interviews': { ru: 'Мои интервью', en: 'My Interviews' },
  'my_applications': { ru: 'Мои заявки', en: 'My Applications' },
  'profile': { ru: 'Профиль', en: 'Profile' },
  
  // Common
  'search': { ru: 'Поиск', en: 'Search' },
  'notification': { ru: 'Уведомления', en: 'Notifications' },
  'manage_account': { ru: 'Управление аккаунтом', en: 'Manage Account' },
  'change_password': { ru: 'Изменить пароль', en: 'Change Password' },
  'activity_log': { ru: 'Журнал активности', en: 'Activity Log' },
  
  // Dashboard content
  'total_candidates': { ru: 'Всего кандидатов', en: 'Total Candidates' },
  'total_interviews': { ru: 'Всего интервью', en: 'Total Interviews' },
  'successful_hires': { ru: 'Успешных найма', en: 'Successful Hires' },
  'pending': { ru: 'Ожидающих', en: 'Pending' },
  'interview_statistics': { ru: 'Статистика интервью', en: 'Interview Statistics' },
  'recent_interviews': { ru: 'Последние интервью', en: 'Recent Interviews' },
  
  // Months
  'october': { ru: 'Октябрь', en: 'October' },
  'january': { ru: 'Январь', en: 'January' },
  'february': { ru: 'Февраль', en: 'February' },
  'march': { ru: 'Март', en: 'March' },
  
  // Status
  'accepted': { ru: 'Принят', en: 'Accepted' },
  'rejected': { ru: 'Отклонено', en: 'Rejected' },
  'in_progress': { ru: 'В процессе', en: 'In Progress' },
  'completed': { ru: 'Завершено', en: 'Completed' },
  'scheduled': { ru: 'Запланировано', en: 'Scheduled' },
  
  // Actions
  'add_candidate': { ru: 'Добавить кандидата', en: 'Add Candidate' },
  'schedule_interview': { ru: 'Запланировать интервью', en: 'Schedule Interview' },
  'filters': { ru: 'Фильтры', en: 'Filters' },
  'previous': { ru: 'Предыдущая', en: 'Previous' },
  'next': { ru: 'Следующая', en: 'Next' },
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ru')

  useEffect(() => {
    const savedLanguage = document.cookie
      .split('; ')
      .find(row => row.startsWith('language='))
      ?.split('=')[1] as Language || 'ru'
    
    setLanguage(savedLanguage)
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    document.cookie = `language=${newLanguage}; path=/; max-age=31536000`
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return { language, changeLanguage, t }
}
