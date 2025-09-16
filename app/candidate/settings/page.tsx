'use client'

import { motion } from 'framer-motion'
import { User, Bell, Shield, Globe, Palette, Eye, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { apiClient } from '../../../lib/api'
import Notification from '../../../components/Notification'
import { useAuth } from '../../../contexts/AuthContext'

export default function CandidateSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [toastNotifications, setToastNotifications] = useState<any[]>([])

  const addNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now().toString()
    setToastNotifications(prev => [...prev, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setToastNotifications(prev => prev.filter(n => n.id !== id))
  }
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  
  const [profile, setProfile] = useState({
    preferredPosition: 'Неизвестно',
    minSalary: '',
    maxSalary: '',
    relocation: 'Неизвестно',
    employmentTypes: ['Полная занятость']
  })
  
  const [notifications, setNotifications] = useState({
    interviews: true,
    applications: true,
    messages: false,
    email: true
  })
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    contactVisible: false,
    experienceVisible: true
  })

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Загружаем данные профиля при монтировании компонента
    if (user) {
      setProfile(prev => ({
        ...prev,
        preferredPosition: user.preferred_position || 'Неизвестно',
        minSalary: user.min_salary?.toString() || '',
        maxSalary: user.max_salary?.toString() || '',
        relocation: user.relocation || 'Неизвестно',
        employmentTypes: user.employment_types || ['Полная занятость']
      }))
    }
  }, [user])

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      // Преобразуем camelCase из UI в snake_case, ожидаемый бекендом
      await apiClient.updateProfile({
        preferred_position: profile.preferredPosition,
        min_salary: profile.minSalary ? Number(profile.minSalary) : undefined,
        max_salary: profile.maxSalary ? Number(profile.maxSalary) : undefined,
        relocation: profile.relocation,
        employment_types: profile.employmentTypes,
      })
      addNotification('Профиль успешно обновлен!', 'success')
    } catch (error) {
      console.error('Error updating profile:', error)
      addNotification('Ошибка при обновлении профиля', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      addNotification('Пароли не совпадают', 'error')
      return
    }
    
    try {
      setSaving(true)
      await apiClient.changePassword({
        oldPassword: password.oldPassword,
        newPassword: password.newPassword
      })
      addNotification('Пароль успешно изменен!', 'success')
      setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error changing password:', error)
      addNotification('Ошибка при изменении пароля', 'error')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'privacy', label: 'Приватность', icon: Eye },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'preferences', label: 'Настройки', icon: Palette }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="candidate" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Settings" userRole="candidate" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Настройки
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Управляйте своими настройками и предпочтениями
            </p>
          </motion.div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-purple text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Настройки профиля
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Предпочитаемая должность
                      </label>
                      <input
                        type="text"
                        value={profile.preferredPosition}
                        onChange={(e) => setProfile(prev => ({ ...prev, preferredPosition: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Желаемая зарплата (₽)
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          placeholder="От"
                          value={profile.minSalary}
                          onChange={(e) => setProfile(prev => ({ ...prev, minSalary: e.target.value }))}
                          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="number"
                          placeholder="До"
                          value={profile.maxSalary}
                          onChange={(e) => setProfile(prev => ({ ...prev, maxSalary: e.target.value }))}
                          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Готовность к переезду
                      </label>
                      <select 
                        value={profile.relocation}
                        onChange={(e) => setProfile(prev => ({ ...prev, relocation: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="Неизвестно">Неизвестно</option>
                        <option value="Не готов">Не готов</option>
                        <option value="Готов в пределах города">Готов в пределах города</option>
                        <option value="Готов к переезду по стране">Готов к переезду по стране</option>
                        <option value="Готов к переезду за границу">Готов к переезду за границу</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Тип занятости
                      </label>
                      <div className="space-y-2">
                        {['Полная занятость', 'Частичная занятость', 'Проектная работа', 'Стажировка'].map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={profile.employmentTypes.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProfile(prev => ({ 
                                    ...prev, 
                                    employmentTypes: [...prev.employmentTypes, type] 
                                  }))
                                } else {
                                  setProfile(prev => ({ 
                                    ...prev, 
                                    employmentTypes: prev.employmentTypes.filter(t => t !== type) 
                                  }))
                                }
                              }}
                              className="w-4 h-4 text-primary-purple bg-gray-100 border-gray-300 rounded focus:ring-primary-purple focus:ring-2"
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                      >
                        <Save size={20} />
                        {saving ? 'Сохранение...' : 'Сохранить изменения'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Уведомления
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Новые интервью</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Уведомления о назначенных интервью</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.interviews}
                          onChange={(e) => setNotifications({...notifications, interviews: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-purple/25 dark:peer-focus:ring-primary-purple/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-purple"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Статус заявок</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Изменения статуса ваших заявок</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.applications}
                          onChange={(e) => setNotifications({...notifications, applications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-purple/25 dark:peer-focus:ring-primary-purple/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-purple"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Новые сообщения</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Сообщения от рекрутеров</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.messages}
                          onChange={(e) => setNotifications({...notifications, messages: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-purple/25 dark:peer-focus:ring-primary-purple/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-purple"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Настройки приватности
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Видимость профиля</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Разрешить рекрутерам находить ваш профиль</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.profileVisible}
                          onChange={(e) => setPrivacy({...privacy, profileVisible: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-purple/25 dark:peer-focus:ring-primary-purple/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-purple"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Контактная информация</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Показывать телефон и email в профиле</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.contactVisible}
                          onChange={(e) => setPrivacy({...privacy, contactVisible: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-purple/25 dark:peer-focus:ring-primary-purple/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-purple"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Опыт работы</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Показывать детали опыта работы</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.experienceVisible}
                          onChange={(e) => setPrivacy({...privacy, experienceVisible: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-purple/25 dark:peer-focus:ring-primary-purple/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-purple"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Безопасность
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Изменить пароль
                      </h3>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Текущий пароль"
                          value={password.oldPassword}
                          onChange={(e) => setPassword(prev => ({ ...prev, oldPassword: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="password"
                          placeholder="Новый пароль"
                          value={password.newPassword}
                          onChange={(e) => setPassword(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="password"
                          placeholder="Подтвердить новый пароль"
                          value={password.confirmPassword}
                          onChange={(e) => setPassword(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button 
                          onClick={handleChangePassword}
                          disabled={saving}
                          className="px-6 py-3 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                        >
                          {saving ? 'Обновление...' : 'Обновить пароль'}
                        </button>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Активные сессии
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Текущая сессия</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Chrome на Windows • Москва</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                            Активна
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Настройки интерфейса
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Язык интерфейса
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>Русский</option>
                        <option>English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Часовой пояс
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>UTC+3 (Москва)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC-5 (EST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Элементов на странице
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Уведомления */}
      {toastNotifications.map((notification) => (
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
