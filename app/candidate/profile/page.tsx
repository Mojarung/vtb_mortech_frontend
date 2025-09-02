'use client'

import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Calendar, Edit, Upload, Star } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function CandidateProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: 'Александр',
    lastName: 'Петров',
    email: 'alexander.petrov@email.com',
    phone: '+7 (999) 123-45-67',
    location: 'Москва, Россия',
    birthDate: '1990-05-15',
    position: 'Frontend Developer',
    experience: '5+ лет',
    about: 'Опытный фронтенд-разработчик с глубокими знаниями React, TypeScript и современных веб-технологий. Увлекаюсь созданием пользовательских интерфейсов и оптимизацией производительности.',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Node.js', 'Git', 'Webpack', 'Redux']
  })

  const experiences = [
    {
      company: 'TechCorp',
      position: 'Senior Frontend Developer',
      period: '2022 - настоящее время',
      description: 'Разработка и поддержка крупных веб-приложений на React. Ментoring младших разработчиков.'
    },
    {
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      period: '2020 - 2022',
      description: 'Создание пользовательских интерфейсов для мобильных и веб-приложений.'
    },
    {
      company: 'WebStudio',
      position: 'Junior Frontend Developer',
      period: '2019 - 2020',
      description: 'Верстка сайтов, изучение современных фреймворков и библиотек.'
    }
  ]

  const education = [
    {
      institution: 'МГУ им. М.В. Ломоносова',
      degree: 'Бакалавр',
      field: 'Прикладная математика и информатика',
      period: '2015 - 2019'
    }
  ]

  const handleSave = () => {
    setIsEditing(false)
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
                        {profile.firstName[0]}{profile.lastName[0]}
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
                          value={profile.firstName}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                        />
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                        />
                      </div>
                      <input
                        type="text"
                        value={profile.position}
                        onChange={(e) => setProfile({...profile, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {profile.firstName} {profile.lastName}
                      </h2>
                      <p className="text-primary-purple font-medium">{profile.position}</p>
                      <p className="text-gray-600 dark:text-gray-400">{profile.experience} опыта</p>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{profile.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">{profile.birthDate}</span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full mt-6 px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Сохранить изменения
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
                    value={profile.about}
                    onChange={(e) => setProfile({...profile, about: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {profile.about}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Навыки
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-purple bg-opacity-10 text-primary-purple rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {isEditing && (
                    <button className="px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-full text-sm hover:border-primary-purple hover:text-primary-purple transition-colors">
                      + Добавить навык
                    </button>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Опыт работы
                </h3>
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-primary-purple">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-primary-purple rounded-full"></div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {exp.position}
                      </h4>
                      <p className="text-primary-purple font-medium mb-1">{exp.company}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{exp.period}</p>
                      <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Образование
                </h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Star className="text-blue-600 dark:text-blue-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {edu.degree}, {edu.field}
                        </h4>
                        <p className="text-primary-purple font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{edu.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
