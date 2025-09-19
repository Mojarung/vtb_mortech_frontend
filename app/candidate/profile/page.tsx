'use client'

import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Calendar, Edit, Upload, Star, DollarSign, Briefcase, GraduationCap, Plus, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'
import { apiClient, User as UserType, ProfileUpdateRequest } from '../../../lib/api'
import Notification from '../../../components/Notification'
import { useAuth } from '../../../contexts/AuthContext'

export default function CandidateProfile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  const addNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  const [profile, setProfile] = useState<ProfileUpdateRequest>({
    first_name: '',
    last_name: '',
    phone: '',
    birth_date: '',
    location: '',
    about: '',
    desired_salary: undefined,
    ready_to_relocate: false,
    employment_type: undefined,
    education: [],
    skills: [],
    work_experience: []
  })

  const [newSkill, setNewSkill] = useState('')
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    period: ''
  })
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    period: '',
    description: ''
  })

  useEffect(() => {
    if (user) {
      // Автоматическое разделение full_name если нет отдельных полей
      let firstName = user.first_name || '';
      let lastName = user.last_name || '';
      
      if (!firstName && !lastName && user.full_name) {
        const nameParts = user.full_name.trim().split(' ');
        if (nameParts.length >= 1) {
          firstName = nameParts[0];
        }
        if (nameParts.length >= 2) {
          lastName = nameParts[1];
        }
      }
      
      setProfile({
        first_name: firstName,
        last_name: lastName,
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        location: user.location || '',
        about: user.about || '',
        desired_salary: user.desired_salary,
        ready_to_relocate: user.ready_to_relocate || false,
        employment_type: user.employment_type,
        education: user.education || [],
        skills: user.skills || [],
        work_experience: user.work_experience || []
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const updatedUser = await apiClient.updateProfile(profile)
      updateUser(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error)
      addNotification('Ошибка при сохранении профиля', 'error')
    } finally {
      setLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills?.filter(skill => skill !== skillToRemove) || []
    })
  }

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree && newEducation.field && newEducation.period) {
      setProfile({
        ...profile,
        education: [...(profile.education || []), { ...newEducation }]
      })
      setNewEducation({ institution: '', degree: '', field: '', period: '' })
    }
  }

  const removeEducation = (index: number) => {
    setProfile({
      ...profile,
      education: profile.education?.filter((_, i) => i !== index) || []
    })
  }

  const addExperience = () => {
    if (newExperience.company && newExperience.position && newExperience.period && newExperience.description) {
      setProfile({
        ...profile,
        work_experience: [...(profile.work_experience || []), { ...newExperience }]
      })
      setNewExperience({ company: '', position: '', period: '', description: '' })
    }
  }

  const removeExperience = (index: number) => {
    setProfile({
      ...profile,
      work_experience: profile.work_experience?.filter((_, i) => i !== index) || []
    })
  }

  const employmentTypeLabels = {
    full_time: 'Полная занятость',
    part_time: 'Частичная занятость',
    contract: 'Контракт',
    freelance: 'Фриланс',
    internship: 'Стажировка'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="candidate" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Profile" userRole="candidate" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Мой профиль
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Управляйте своей профессиональной информацией
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <Edit size={20} />
                {isEditing ? 'Отменить' : 'Редактировать'}
              </button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-primary-purple rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">
                        {(() => {
                          const firstName = profile.first_name || user?.first_name;
                          const lastName = profile.last_name || user?.last_name;
                          const fullName = user?.full_name;
                          
                          if (firstName && lastName) {
                            return firstName[0] + lastName[0];
                          } else if (fullName) {
                            const nameParts = fullName.trim().split(' ');
                            if (nameParts.length >= 2) {
                              return nameParts[0][0] + nameParts[1][0];
                            } else if (nameParts.length === 1) {
                              return nameParts[0][0] + nameParts[0][0];
                            }
                          }
                          return 'U';
                        })()}
                      </span>
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                        <Upload size={16} />
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={profile.first_name || ''}
                          onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                          placeholder="Имя"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                        />
                        <input
                          type="text"
                          value={profile.last_name || ''}
                          onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                          placeholder="Фамилия"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {(() => {
                          const firstName = profile.first_name || user?.first_name;
                          const lastName = profile.last_name || user?.last_name;
                          const fullName = user?.full_name;
                          
                          if (firstName && lastName) {
                            return `${firstName} ${lastName}`;
                          } else if (fullName) {
                            return fullName;
                          }
                          return 'Пользователь';
                        })()}
                      </h2>
                      <p className="text-primary-purple font-medium">{user?.email}</p>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        placeholder="Телефон"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{profile.phone || user?.phone || 'Не указан'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location || ''}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        placeholder="Место жительства"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{profile.location || user?.location || 'Не указано'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="date"
                        value={profile.birth_date || ''}
                        onChange={(e) => setProfile({...profile, birth_date: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{profile.birth_date || user?.birth_date || 'Не указана'}</span>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-[20px]">₽</span>
                        <input
                          type="number"
                          value={profile.desired_salary || ''}
                          onChange={(e) => setProfile({...profile, desired_salary: e.target.value ? parseInt(e.target.value) : undefined})}
                          placeholder="Желаемая зарплата"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-gray-400" size={20} />
                        <select
                          value={profile.employment_type || ''}
                          onChange={(e) => setProfile({...profile, employment_type: e.target.value as any})}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Выберите тип занятости</option>
                          {Object.entries(employmentTypeLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="ready_to_relocate"
                          checked={profile.ready_to_relocate || false}
                          onChange={(e) => setProfile({...profile, ready_to_relocate: e.target.checked})}
                          className="w-4 h-4 text-primary-purple bg-gray-100 border-gray-300 rounded focus:ring-primary-purple"
                        />
                        <label htmlFor="ready_to_relocate" className="text-gray-700 dark:text-gray-300">
                          Готов к переезду
                        </label>
                      </div>
                    </>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full mt-6 px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* About */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  О себе
                </h3>
                {isEditing ? (
                  <textarea
                    value={profile.about || ''}
                    onChange={(e) => setProfile({...profile, about: e.target.value})}
                    placeholder="Расскажите о себе, своих навыках и опыте..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {profile.about || user?.about || 'Информация не указана'}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Навыки
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(profile.skills || user?.skills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-purple bg-opacity-10 text-primary-purple rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Добавить навык"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Опыт работы
                </h3>
                <div className="space-y-6">
                  {(profile.work_experience || user?.work_experience || []).map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-primary-purple">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-purple rounded-full"></div>
                      {isEditing && (
                        <button
                          onClick={() => removeExperience(index)}
                          className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {exp.position}
                      </h4>
                      <p className="text-primary-purple font-medium mb-1">{exp.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{exp.period}</p>
                      <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Добавить опыт работы</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newExperience.position}
                        onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                        placeholder="Должность"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                        placeholder="Компания"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newExperience.period}
                        onChange={(e) => setNewExperience({...newExperience, period: e.target.value})}
                        placeholder="Период работы"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <textarea
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                        placeholder="Описание обязанностей"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      />
                      <button
                        onClick={addExperience}
                        className="w-full px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        Добавить опыт
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Education */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Образование
                </h3>
                <div className="space-y-4">
                  {(profile.education || user?.education || []).map((edu, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <GraduationCap className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <div className="flex-1">
                        {isEditing && (
                          <button
                            onClick={() => removeEducation(index)}
                            className="float-right text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {edu.degree}, {edu.field}
                        </h4>
                        <p className="text-primary-purple font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{edu.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="mt-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Добавить образование</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                        placeholder="Учебное заведение"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                        placeholder="Степень"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newEducation.field}
                        onChange={(e) => setNewEducation({...newEducation, field: e.target.value})}
                        placeholder="Специальность"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newEducation.period}
                        onChange={(e) => setNewEducation({...newEducation, period: e.target.value})}
                        placeholder="Период обучения"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={addEducation}
                        className="w-full px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        Добавить образование
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
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
