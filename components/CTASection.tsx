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
                Let's make things happen
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Contact us today to learn more about how our digital marketing services 
                can help your business grow and succeed online.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-dark text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-all duration-300"
              >
                Get your free proposal
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
                  <circle cx="150" cy="150" r="80" fill="#191A23" />
                  <circle cx="130" cy="130" r="8" fill="white" />
                  <circle cx="170" cy="130" r="8" fill="white" />
                  <path
                    d="M120 180 Q150 200 180 180"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  
                  <path
                    d="M80 80 Q150 40 220 80 Q250 150 220 220 Q150 260 80 220 Q50 150 80 80"
                    stroke="#B9FF66"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                  
                  <circle cx="250" cy="100" r="15" fill="#B9FF66" />
                  <polygon points="50,250 70,230 90,250 110,230" fill="#B9FF66" />
                  <circle cx="50" cy="100" r="10" fill="#191A23" />
                </svg>
              </div>
            </div>
          </div>

          <div className="absolute top-8 right-8 w-16 h-16 bg-primary-green rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-12 h-12 bg-dark rounded-full opacity-10 animate-bounce"></div>
        </motion.div>
      </div>
    </section>
  )
}
