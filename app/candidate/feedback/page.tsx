'use client'

import { motion } from 'framer-motion'
import { Star, TrendingUp, TrendingDown, Award, AlertCircle, CheckCircle, Clock, Brain } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function CandidateFeedback() {
  const [selectedFeedback, setSelectedFeedback] = useState('latest')

  const feedbackData = [
    {
      id: 1,
      position: 'Frontend Developer',
      company: 'ВТБ',
      date: '2024-01-15',
      overallScore: 85,
      status: 'passed',
      interviewer: 'ИИ-Аватар',
      duration: '45 мин',
      categories: {
        technical: { score: 90, feedback: 'Отличные знания React и TypeScript' },
        communication: { score: 80, feedback: 'Хорошие навыки общения, можно улучшить структуру ответов' },
        experience: { score: 85, feedback: 'Релевантный опыт работы с современными технологиями' },
        problemSolving: { score: 85, feedback: 'Логичный подход к решению задач' }
      },
      strengths: [
        'Глубокие знания React и современных фронтенд-технологий',
        'Понимание принципов проектирования компонентов',
        'Опыт работы с TypeScript и современными инструментами'
      ],
      improvements: [
        'Улучшить структурирование ответов на поведенческие вопросы',
        'Развить навыки презентации технических решений',
        'Изучить больше о тестировании фронтенд-приложений'
      ],
      recommendation: 'Кандидат рекомендуется к следующему этапу. Показал высокий уровень технических навыков.'
    },
    {
      id: 2,
      position: 'Full Stack Developer',
      company: 'Тех Компания',
      date: '2024-01-10',
      overallScore: 72,
      status: 'review',
      interviewer: 'ИИ-Аватар',
      duration: '60 мин',
      categories: {
        technical: { score: 75, feedback: 'Хорошие знания фронтенда, нужно подтянуть backend' },
        communication: { score: 70, feedback: 'Стеснительность в общении, но понятно объясняет' },
        experience: { score: 70, feedback: 'Ограниченный опыт с backend технологиями' },
        problemSolving: { score: 75, feedback: 'Творческий подход, но иногда не хватает системности' }
      },
      strengths: [
        'Креативный подход к решению задач',
        'Хорошие знания frontend-технологий',
        'Желание учиться и развиваться'
      ],
      improvements: [
        'Изучить backend-технологии более глубоко',
        'Развить уверенность в общении',
        'Получить больше практического опыта с базами данных'
      ],
      recommendation: 'Кандидат имеет потенциал, но требует дополнительного обучения по backend-технологиям.'
    }
  ]

  const currentFeedback = feedbackData[0]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'review':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'passed':
        return 'Прошел на следующий этап'
      case 'review':
        return 'На рассмотрении'
      case 'rejected':
        return 'Отклонен'
      default:
        return 'Неизвестно'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="candidate" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Feedback" userRole="candidate" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Обратная связь по интервью
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Детальный анализ вашего интервью и рекомендации для развития
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentFeedback.position}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentFeedback.company} • {currentFeedback.date}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(currentFeedback.overallScore)} mb-1`}>
                      {currentFeedback.overallScore}%
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(currentFeedback.status)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getStatusText(currentFeedback.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Оценка по категориям
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(currentFeedback.categories).map(([key, category]) => (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {key === 'technical' ? 'Технические навыки' :
                               key === 'communication' ? 'Коммуникация' :
                               key === 'experience' ? 'Опыт работы' : 'Решение задач'}
                            </span>
                            <span className={`font-bold ${getScoreColor(category.score)}`}>
                              {category.score}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBgColor(category.score)}`}
                              style={{ width: `${category.score}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {category.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Информация об интервью
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Интервьюер:</span>
                          <span className="text-sm text-gray-900 dark:text-white">{currentFeedback.interviewer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Длительность:</span>
                          <span className="text-sm text-gray-900 dark:text-white">{currentFeedback.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Дата:</span>
                          <span className="text-sm text-gray-900 dark:text-white">{currentFeedback.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                          Рекомендация ИИ
                        </h4>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        {currentFeedback.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Сильные стороны
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentFeedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {strength}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Области для улучшения
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {currentFeedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {improvement}
                        </span>
                      </li>
                    ))}
                  </ul>
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
                  История интервью
                </h3>
                <div className="space-y-3">
                  {feedbackData.map((feedback) => (
                    <div
                      key={feedback.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedFeedback === feedback.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedFeedback(feedback.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {feedback.position}
                        </h4>
                        <span className={`text-sm font-bold ${getScoreColor(feedback.overallScore)}`}>
                          {feedback.overallScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {feedback.company}
                        </span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(feedback.status)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {feedback.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Рекомендации для развития
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Пройдите курсы
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Изучите backend-технологии для расширения навыков
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Практикуйтесь
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Создайте pet-проекты с использованием новых технологий
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Развивайте soft skills
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Улучшите навыки презентации и структурирования ответов
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Следующие шаги
                </h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Записаться на следующее интервью
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    Скачать отчет PDF
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                    Поделиться результатами
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
