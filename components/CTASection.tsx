'use client'

import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-light-gray rounded-3xl p-8 lg:p-16 relative overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold font-positivus mb-6">
                Начнем работать вместе
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Свяжитесь с нами сегодня, чтобы узнать, как AI HR сервис 
                может помочь вашей компании оптимизировать процесс найма.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-dark text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-all duration-300"
              >
Получить бесплатное предложение
              </motion.button>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center h-80">
                <svg
                  width="300"
                  height="300"
                  viewBox="0 0 300 300"
                  className="w-full h-full max-w-sm"
                >
                  <circle cx="150" cy="150" r="150" fill="#191A23" />
                  <path d="M6.00001 21V15.3426C6.00001 15.1158 5.96145 14.8908 5.88599 14.6769L3.35382 7.50248C3.15169 6.92978 3.40765 6.29618 3.95086 6.02457C4.5347 5.73265 5.24482 5.95902 5.552 6.53498L9.00001 13M18 21V15.3426C18 15.1158 18.0386 14.8908 18.114 14.6769L20.6462 7.50248C20.8483 6.92978 20.5924 6.29618 20.0491 6.02457C19.4653 5.73265 18.7552 5.95902 18.448 6.53498L15 13M16 6.5C16 8.70914 14.2091 10.5 12 10.5C9.79087 10.5 8.00001 8.70914 8.00001 6.5C8.00001 4.29086 9.79087 2.5 12 2.5C14.2091 2.5 16 4.29086 16 6.5Z" stroke="white" stroke-linecap="round" stroke-width="2" transform="translate(30, 30) scale(10)"/>
                </svg>
              </div>
            </div>
          </div>
</motion.div>
      </div>
    </section>
  )
}
