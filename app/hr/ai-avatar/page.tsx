'use client'

import { motion } from 'framer-motion'
import { Bot, Mic, MicOff, Video, VideoOff, Settings, Play, Pause, RotateCcw, Save } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function AIAvatar() {
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState('professional')
  const [interviewMode, setInterviewMode] = useState('technical')

  const avatarTypes = [
    {
      id: 'professional',
      name: 'Профессиональный',
      description: 'Строгий деловой стиль для технических интервью',
      image: '/avatars/professional.jpg'
    },
    {
      id: 'friendly',
      name: 'Дружелюбный',
      description: 'Мягкий подход для начинающих специалистов',
      image: '/avatars/friendly.jpg'
    },
    {
      id: 'expert',
      name: 'Эксперт',
      description: 'Глубокие технические вопросы для senior позиций',
      image: '/avatars/expert.jpg'
    }
  ]

  const interviewModes = [
    {
      id: 'technical',
      name: 'Техническое интервью',
      description: 'Проверка технических навыков и знаний'
    },
    {
      id: 'behavioral',
      name: 'Поведенческое интервью',
      description: 'Оценка soft skills и культурного соответствия'
    },
    {
      id: 'mixed',
      name: 'Смешанное интервью',
      description: 'Комбинация технических и поведенческих вопросов'
    }
  ]

  const currentInterview = {
    candidate: 'Анна Смирнова',
    position: 'Frontend Developer',
    duration: '00:15:32',
    questionsAsked: 7,
    currentScore: 85,
    status: 'in-progress'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="hr" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="AI Avatar" userRole="hr" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ИИ-Аватар для интервью
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Управление ИИ-аватаром для проведения автоматических интервью с кандидатами
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Видео-интервью
                </h2>
                <div className="relative bg-gray-900 rounded-lg aspect-video mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Bot className="h-24 w-24 text-blue-500 mx-auto mb-4" />
                      <p className="text-white text-lg">ИИ-Аватар готов к интервью</p>
                      <p className="text-gray-300 text-sm mt-2">
                        Кандидат: {currentInterview.candidate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentInterview.duration}
                  </div>
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                      REC
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg">
                      <p className="text-sm mb-1">
                        <strong>ИИ-Аватар:</strong> "Расскажите о вашем опыте работы с React и какие проекты вы реализовывали?"
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>Вопрос {currentInterview.questionsAsked}/15</span>
                        <span>•</span>
                        <span>Текущая оценка: {currentInterview.currentScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-3 rounded-full transition-colors ${
                      isMicOn ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-3 rounded-full transition-colors ${
                      isVideoOn ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-3 rounded-full transition-colors ${
                      isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isRecording ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button className="p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                    <Save className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Статистика интервью в реальном времени
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentInterview.questionsAsked}</div>
                    <div className="text-sm text-gray-500">Задано вопросов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{currentInterview.currentScore}%</div>
                    <div className="text-sm text-gray-500">Текущая оценка</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">15:32</div>
                    <div className="text-sm text-gray-500">Время интервью</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-500">Пропущенных ответов</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Настройки аватара
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Тип аватара
                    </label>
                    <div className="space-y-2">
                      {avatarTypes.map((avatar) => (
                        <label key={avatar.id} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="avatar"
                            value={avatar.id}
                            checked={selectedAvatar === avatar.id}
                            onChange={(e) => setSelectedAvatar(e.target.value)}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {avatar.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {avatar.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Режим интервью
                </h3>
                <div className="space-y-2">
                  {interviewModes.map((mode) => (
                    <label key={mode.id} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        value={mode.id}
                        checked={interviewMode === mode.id}
                        onChange={(e) => setInterviewMode(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {mode.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {mode.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Информация о кандидате
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Имя</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {currentInterview.candidate}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Позиция</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {currentInterview.position}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Статус</div>
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                      Интервью в процессе
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Быстрые действия
                </h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Начать новое интервью
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Приостановить интервью
                  </button>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Завершить и сохранить
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
