'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function WorkingProcess() {
  const [openItem, setOpenItem] = useState(0)

  const processSteps = [
    {
      number: '01',
      title: 'Консультация',
      description: 'На первоначальной консультации мы обсудим цели вашего бизнеса, текущие HR-процессы и потребности. Это позволит нам понять ваши требования и адаптировать наши сервисы.'
    },
    {
      number: '02',
      title: 'Анализ и разработка стратегии',
      description: 'Мы проводим тщательный анализ ваших HR-процессов и разрабатываем комплексную стратегию автоматизации найма с помощью AI.'
    },
    {
      number: '03',
      title: 'Внедрение',
      description: 'Наша команда реализует согласованную стратегию с прецизионностью, используя новейшие AI-технологии и инструменты для максимальной эффективности.'
    },
    {
      number: '04',
      title: 'Мониторинг и оптимизация',
      description: 'Мы непрерывно отслеживаем эффективность системы и вносим корректировки на основе данных для оптимизации результатов и достижения целей.'
    },
    {
      number: '05',
      title: 'Отчётность и коммуникация',
      description: 'Регулярная отчётность держит вас в курсе прогресса, результатов и аналитики. Мы поддерживаем открытое общение для обеспечения прозрачности.'
    },
    {
      number: '06',
      title: 'Непрерывное улучшение',
      description: 'Мы верим в непрерывное совершенствование и регулярно проверяем и совершенствуем наши стратегии, чтобы опережать тренды отрасли.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold font-positivus mb-4">
            <span className="bg-primary-purple px-2 py-1 rounded">Наш рабочий процесс</span>
          </h2>
          <p className="text-lg text-gray-700">
            Пошаговое руководство по достижению ваших HR-целей
          </p>
        </motion.div>

        <div className="space-y-6">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`border border-dark rounded-3xl overflow-hidden ${
                openItem === index ? 'bg-primary-purple' : 'bg-light-gray'
              } transition-colors duration-300`}
            >
              <button
                onClick={() => setOpenItem(openItem === index ? -1 : index)}
                className="w-full p-6 lg:p-8 flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <span className="text-4xl lg:text-5xl font-bold mr-6">
                    {step.number}
                  </span>
                  <h3 className="text-xl lg:text-2xl font-bold">
                    {step.title}
                  </h3>
                </div>
                <div className="ml-4">
                  {openItem === index ? (
                    <Minus size={24} className="text-dark" />
                  ) : (
                    <Plus size={24} className="text-dark" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openItem === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                      <div className="border-t border-dark pt-6">
                        <p className="text-lg leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
