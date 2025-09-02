'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  const clientLogos = [
    { name: 'Amazon', src: '/logos/amazon.svg' },
    { name: 'Dribbble', src: '/logos/dribbble.svg' },
    { name: 'HubSpot', src: '/logos/hubspot.svg' },
    { name: 'Notion', src: '/logos/notion.svg' },
    { name: 'Netflix', src: '/logos/netflix.svg' },
    { name: 'Zoom', src: '/logos/zoom.svg' },
  ]

  return (
    <section className="pt-20 pb-16 bg-white" id="hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:pr-8"
          >
            <h1 className="text-4xl lg:text-6xl font-bold font-positivus mb-6 leading-tight">
              Революция в{' '}
              <span className="relative">
                найме
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-purple -z-10"></span>
              </span>{' '}
              с помощью ИИ
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Наш AI HR сервис помогает рекрутерам проводить интеллектуальные собеседования, 
              автоматизируя процесс отбора кандидатов и повышая качество найма.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-dark text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-all duration-300"
            >
Записаться на консультацию
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-96 lg:h-[500px] flex items-center justify-center">
              <div className="relative">
                <svg
                  width="400"
                  height="400"
                  viewBox="0 0 400 400"
                  className="w-full h-full max-w-md"
                >
                  <circle cx="200" cy="200" r="150" fill="#F3F3F3" opacity="0.3" />
                  <circle cx="200" cy="200" r="100" fill="#8B5CF6" opacity="0.5" />
                  
                  <path
                    d="M120 180 L280 180 L280 140 L320 200 L280 260 L280 220 L120 220 Z"
                    fill="#191A23"
                  />
                  
                  <circle cx="80" cy="120" r="20" fill="#8B5CF6" />
                  <circle cx="320" cy="80" r="15" fill="#191A23" />
                  <circle cx="350" cy="300" r="25" fill="#8B5CF6" opacity="0.7" />
                  
                  <path
                    d="M60 300 L100 280 L140 320 L180 300 L220 340 L260 320 L300 360"
                    stroke="#191A23"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>
              
              <div className="absolute top-8 right-8 w-12 h-12 bg-primary-purple rounded-full animate-pulse"></div>
              <div className="absolute bottom-16 left-8 w-8 h-8 bg-dark rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  )
}
