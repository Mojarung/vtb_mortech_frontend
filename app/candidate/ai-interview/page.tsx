'use client'

import { motion } from 'framer-motion'
import { Bot, Mic, MicOff, Video, VideoOff, Clock, Brain, CheckCircle, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function AIInterview() {
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState('')

  const questions = [
    {
      id: 1,
      text: "Расскажите о себе и своем опыте работы в области разработки",
      category: "Общие вопросы",
      timeLimit: 180
    },
    {
      id: 2,
      text: "Какие технологии вы используете для frontend разработки?",
      category: "Технические навыки",
      timeLimit: 120
    },
    {
      id: 3,
      text: "Опишите сложный проект, над которым вы работали",
      category: "Опыт работы",
      timeLimit: 240
    },
    {
      id: 4,
      text: "Как вы решаете конфликты в команде?",
      category: "Soft Skills",
      timeLimit: 150
    }
  ]

  const interviewProgress = {
    questionsAnswered: currentQuestion - 1,
    totalQuestions: questions.length,
    currentScore: 78,
    timeSpent: 900 // 15 minutes
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (interviewStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [interviewStarted, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartInterview = () => {
    setInterviewStarted(true)
    setIsRecording(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
      setCurrentAnswer('')
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const currentQ = questions[currentQuestion - 1]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="candidate" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="AI Interview" userRole="candidate" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Интервью с ИИ-аватаром
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Пройдите интервью с ИИ-аватаром для позиции Frontend Developer
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Видео-интервью
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    {interviewStarted && (
                      <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs animate-pulse">
                        Запись
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="relative bg-gray-900 rounded-lg aspect-video mb-4 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Bot className="h-24 w-24 text-blue-500 mx-auto mb-4" />
                      {!interviewStarted ? (
                        <div>
                          <p className="text-white text-lg mb-2">ИИ-Аватар готов к интервью</p>
                          <p className="text-gray-300 text-sm">
                            Нажмите "Начать интервью" когда будете готовы
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-white text-lg mb-2">Интервью в процессе</p>
                          <p className="text-gray-300 text-sm">
                            Слушаю ваш ответ...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                          {currentQ?.category}
                        </span>
                        <span className="text-xs text-gray-300">
                          Вопрос {currentQuestion} из {questions.length}
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>ИИ-Аватар:</strong> "{currentQ?.text}"
                      </p>
                      {interviewStarted && (
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <span>Рекомендуемое время: {Math.floor(currentQ?.timeLimit / 60)} мин</span>
                          <span>•</span>
                          <span>Текущая оценка: {interviewProgress.currentScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 mb-4">
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
                </div>

                {!interviewStarted ? (
                  <div className="text-center">
                    <button
                      onClick={handleStartInterview}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Начать интервью
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 1}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Предыдущий
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={currentQuestion === questions.length}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Следующий вопрос
                    </button>
                    {currentQuestion === questions.length && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Завершить интервью
                      </button>
                    )}
                  </div>
                )}
              </div>

              {interviewStarted && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Ваш ответ
                  </h3>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Введите ваш ответ здесь или используйте голосовой ввод..."
                    className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {currentAnswer.length} символов
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Отправить ответ
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Прогресс интервью
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Вопросы</span>
                      <span className="text-gray-900 dark:text-white">
                        {interviewProgress.questionsAnswered}/{interviewProgress.totalQuestions}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(interviewProgress.questionsAnswered / interviewProgress.totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Текущая оценка</span>
                      <span className="text-gray-900 dark:text-white">
                        {interviewProgress.currentScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${interviewProgress.currentScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Список вопросов
                </h3>
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`p-3 rounded-lg border ${
                        currentQuestion === question.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : index < currentQuestion - 1
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {index < currentQuestion - 1 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : currentQuestion === question.id ? (
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {question.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {question.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Рекомендуемое время: {Math.floor(question.timeLimit / 60)} мин
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Советы для интервью
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Будьте конкретными
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Приводите конкретные примеры из вашего опыта
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Структурируйте ответы
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Используйте методику STAR для поведенческих вопросов
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Следите за временем
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Старайтесь укладываться в рекомендуемое время
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
