'use client'

import { motion } from 'framer-motion'
import { Upload, FileText, Brain, CheckCircle, XCircle, Clock, Download, Eye } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../components/DashboardHeader'

export default function ResumeAnalysis() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const resumeAnalyses = [
    {
      id: 1,
      candidateName: 'Анна Смирнова',
      position: 'Frontend Developer',
      fileName: 'anna_smirnova_cv.pdf',
      uploadDate: '2024-01-15',
      matchPercentage: 92,
      status: 'completed',
      aiRecommendation: 'Рекомендуется к интервью',
      keySkills: ['React', 'TypeScript', 'Next.js'],
      experience: '3 года',
      education: 'МГУ, Прикладная математика'
    },
    {
      id: 2,
      candidateName: 'Дмитрий Козлов',
      position: 'Backend Developer',
      fileName: 'dmitry_kozlov_resume.pdf',
      uploadDate: '2024-01-14',
      matchPercentage: 78,
      status: 'completed',
      aiRecommendation: 'Требует дополнительной проверки',
      keySkills: ['Python', 'Django', 'PostgreSQL'],
      experience: '2 года',
      education: 'СПбГУ, Информатика'
    },
    {
      id: 3,
      candidateName: 'Мария Волкова',
      position: 'UI/UX Designer',
      fileName: 'maria_volkova_portfolio.pdf',
      uploadDate: '2024-01-16',
      matchPercentage: 45,
      status: 'processing',
      aiRecommendation: 'Анализ в процессе...',
      keySkills: ['Figma', 'Adobe XD'],
      experience: '1 год',
      education: 'МГТУ, Дизайн'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const filteredAnalyses = resumeAnalyses.filter(analysis => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'high-match') return analysis.matchPercentage >= 80
    if (selectedFilter === 'medium-match') return analysis.matchPercentage >= 60 && analysis.matchPercentage < 80
    if (selectedFilter === 'low-match') return analysis.matchPercentage < 60
    return analysis.status === selectedFilter
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar userRole="hr" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Resume Analysis" userRole="hr" />
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Анализ резюме
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Автоматический анализ резюме кандидатов с использованием ИИ
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Загрузка резюме
            </h2>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Перетащите файлы сюда или нажмите для выбора
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Поддерживаются форматы: PDF, DOC, DOCX (до 10 МБ)
              </p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Выбрать файлы
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Результаты анализа
              </h2>
              <div className="flex gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Все</option>
                  <option value="high-match">Высокое соответствие (80%+)</option>
                  <option value="medium-match">Среднее соответствие (60-79%)</option>
                  <option value="low-match">Низкое соответствие (&lt;60%)</option>
                  <option value="processing">В обработке</option>
                  <option value="completed">Завершено</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAnalyses.map((analysis) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {analysis.candidateName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                          {analysis.status === 'completed' ? 'Завершено' : 'В процессе'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Позиция</p>
                          <p className="font-medium text-gray-900 dark:text-white">{analysis.position}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Опыт</p>
                          <p className="font-medium text-gray-900 dark:text-white">{analysis.experience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Образование</p>
                          <p className="font-medium text-gray-900 dark:text-white">{analysis.education}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Дата загрузки</p>
                          <p className="font-medium text-gray-900 dark:text-white">{analysis.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Соответствие:</span>
                          <span className={`font-bold ${getMatchColor(analysis.matchPercentage)}`}>
                            {analysis.matchPercentage}%
                          </span>
                        </div>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              analysis.matchPercentage >= 80 ? 'bg-green-500' :
                              analysis.matchPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${analysis.matchPercentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Ключевые навыки:</span>
                        <div className="flex gap-1">
                          {analysis.keySkills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {analysis.aiRecommendation}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
