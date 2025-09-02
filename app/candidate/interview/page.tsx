'use client'

import { motion } from 'framer-motion'
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Settings } from 'lucide-react'
import { useState } from 'react'

export default function CandidateInterview() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)

  const questions = [
    {
      id: 1,
      text: "Расскажите о себе и своем опыте работы с React",
      timeLimit: 300
    },
    {
      id: 2,
      text: "Как бы вы оптимизировали производительность React приложения?",
      timeLimit: 600
    },
    {
      id: 3,
      text: "Объясните разницу между useState и useEffect",
      timeLimit: 400
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        {/* Левая панель - Видео */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gray-800 rounded-lg m-4">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-4xl font-bold">AI</span>
                </div>
                <p className="text-white text-lg">AI Интервьюер</p>
                <p className="text-gray-400">Алексей Смирнов</p>
              </div>
            </div>
          </div>

          {/* Видео кандидата */}
          <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600">
            <div className="h-full flex items-center justify-center">
              {isVideoOff ? (
                <div className="text-center">
                  <VideoOff className="text-gray-400 mx-auto mb-2" size={32} />
                  <p className="text-gray-400 text-sm">Камера выключена</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-xl font-bold">Вы</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Панель управления */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-full px-6 py-3"
            >
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                {isMuted ? <MicOff className="text-white" size={20} /> : <Mic className="text-white" size={20} />}
              </button>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                {isVideoOff ? <VideoOff className="text-white" size={20} /> : <Video className="text-white" size={20} />}
              </button>
              <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
                <PhoneOff className="text-white" size={20} />
              </button>
              <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors">
                <MessageSquare className="text-white" size={20} />
              </button>
              <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors">
                <Settings className="text-white" size={20} />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Правая панель - Вопросы и информация */}
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <div className="h-full flex flex-col">
            {/* Заголовок */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Техническое интервью
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Frontend Developer - TechCorp
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  Вопрос {currentQuestion} из {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-500">В эфире</span>
                </div>
              </div>
            </div>

            {/* Текущий вопрос */}
            <div className="flex-1 p-6">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Текущий вопрос:
                </h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-gray-700 dark:text-gray-300">
                    {questions[currentQuestion - 1].text}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    Время на ответ: {Math.floor(questions[currentQuestion - 1].timeLimit / 60)} мин
                  </span>
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </motion.div>

              {/* Прогресс интервью */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Прогресс интервью
                </h4>
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        index + 1 === currentQuestion
                          ? 'bg-primary-purple bg-opacity-10 border border-primary-purple'
                          : index + 1 < currentQuestion
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index + 1 === currentQuestion
                          ? 'bg-primary-purple text-white'
                          : index + 1 < currentQuestion
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`text-sm ${
                        index + 1 === currentQuestion
                          ? 'text-primary-purple font-medium'
                          : index + 1 < currentQuestion
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        Вопрос {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Советы */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  💡 Совет
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Говорите четко и структурированно. Не торопитесь с ответом, лучше подумать несколько секунд.
                </p>
              </div>
            </div>

            {/* Кнопки управления */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
                  disabled={currentQuestion === 1}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length, currentQuestion + 1))}
                  disabled={currentQuestion === questions.length}
                  className="flex-1 px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Далее
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
