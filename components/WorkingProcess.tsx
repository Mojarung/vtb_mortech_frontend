'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function WorkingProcess() {
  const [openItem, setOpenItem] = useState(0)

  const processSteps = [
    {
      number: '01',
      title: 'Consultation',
      description: 'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.'
    },
    {
      number: '02',
      title: 'Research and Strategy Development',
      description: 'We conduct thorough market research and competitor analysis to develop a comprehensive digital marketing strategy tailored to your business needs and target audience.'
    },
    {
      number: '03',
      title: 'Implementation',
      description: 'Our team executes the agreed-upon strategy with precision, utilizing the latest tools and techniques to ensure maximum effectiveness and ROI for your campaigns.'
    },
    {
      number: '04',
      title: 'Monitoring and Optimization',
      description: 'We continuously monitor campaign performance and make data-driven adjustments to optimize results and ensure your marketing goals are achieved.'
    },
    {
      number: '05',
      title: 'Reporting and Communication',
      description: 'Regular reporting keeps you informed of campaign progress, results, and insights. We maintain open communication to ensure transparency and alignment with your business objectives.'
    },
    {
      number: '06',
      title: 'Continual Improvement',
      description: 'We believe in continuous improvement and regularly review and refine our strategies to stay ahead of industry trends and maximize your competitive advantage.'
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
            <span className="bg-primary-green px-2 py-1 rounded">Our Working Process</span>
          </h2>
          <p className="text-lg text-gray-700">
            Step-by-Step Guide to Achieving Your Business Goals
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
                openItem === index ? 'bg-primary-green' : 'bg-light-gray'
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
