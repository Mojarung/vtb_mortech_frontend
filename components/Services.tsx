'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Search, MousePointer, Share2, Mail, FileText, BarChart3 } from 'lucide-react'

export default function Services() {
  const services = [
    {
      title: 'Автоматическое проведение собеседований',
      icon: Search,
      bgColor: 'bg-light-gray',
      textColor: 'text-dark',
      iconColor: 'text-primary-purple'
    },
    {
      title: 'Оценка навыков с помощью ИИ',
      icon: MousePointer,
      bgColor: 'bg-primary-purple',
      textColor: 'text-dark',
      iconColor: 'text-dark'
    },
    {
      title: 'Анализ поведения кандидатов',
      icon: Share2,
      bgColor: 'bg-dark',
      textColor: 'text-white',
      iconColor: 'text-primary-purple'
    },
    {
      title: 'Генерация отчетов по кандидатам',
      icon: Mail,
      bgColor: 'bg-light-gray',
      textColor: 'text-dark',
      iconColor: 'text-primary-purple'
    },
    {
      title: 'Персонализация вопросов',
      icon: FileText,
      bgColor: 'bg-primary-purple',
      textColor: 'text-dark',
      iconColor: 'text-dark'
    },
    {
      title: 'Интеграция с HR-системами',
      icon: BarChart3,
      bgColor: 'bg-dark',
      textColor: 'text-white',
      iconColor: 'text-primary-purple'
    }
  ]

  return (
    <section className="py-20 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold font-positivus mb-4">
            <span className="bg-primary-purple px-2 py-1 rounded">Наши сервисы</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            AI HR платформа предлагает полный спектр сервисов для 
            автоматизации процесса найма и повышения эффективности HR-отделов:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className={`${service.bgColor} ${service.textColor} p-8 rounded-3xl border border-dark relative overflow-hidden group cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                    {service.title}
                  </h3>
                  <div className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                    <service.icon className={`${service.iconColor} mr-3`} size={24} />
                    <span className="text-lg font-medium">Подробнее</span>
                    <ArrowRight className={`${service.iconColor} ml-2`} size={20} />
                  </div>
                </div>
                
                <div className="ml-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                    <service.icon className={`${service.iconColor}`} size={40} />
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <service.icon size={120} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
