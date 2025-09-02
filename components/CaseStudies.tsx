'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CaseStudies() {
  const caseStudies = [
    {
      description: "Для IT-компании мы внедрили AI HR систему, которая сократила время на проведение собеседований на 60% и повысила качество отбора кандидатов.",
    },
    {
      description: "Для финансовой компании мы разработали систему автоматической оценки навыков, что позволило снизить ошибки в найме на 80%.",
    },
    {
      description: "Для стартапа мы создали полноценную AI платформу для рекрутинга, которая увеличила скорость найма в 3 раза.",
    }
  ]

  return (
    <section className="py-20 bg-white" id="case-studies">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold font-positivus mb-4">
            <span className="bg-primary-purple px-2 py-1 rounded">Кейсы</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Реальные примеры успешного внедрения AI HR решений 
            для оптимизации процесса найма
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-dark rounded-3xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <p className="text-lg leading-relaxed mb-6">
                  {study.description}
                </p>
                <div className="flex items-center text-primary-purple hover:text-white cursor-pointer transition-colors duration-300 group">
                  <span className="text-lg font-medium mr-2">Подробнее</span>
                  <ArrowRight 
                    size={20} 
                    className="group-hover:translate-x-1 transition-transform duration-300" 
                  />
                </div>
                {index < caseStudies.length - 1 && (
                  <div className="mt-8 lg:hidden border-b border-gray-600"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
