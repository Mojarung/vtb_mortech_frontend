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
              {/* Вращающиеся дуги */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg width="300" height="300" viewBox="0 0 300 300" className="absolute">
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        values="0 150 150;360 150 150"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 150 50 A 100 100 0 0 1 250 150"
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 250 150 A 100 100 0 0 1 150 250"
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg width="350" height="350" viewBox="0 0 350 350" className="absolute">
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        values="360 175 175;0 175 175"
                        dur="12s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 175 75 A 100 100 0 0 1 275 175"
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 75 175 A 100 100 0 0 1 175 275"
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg width="280" height="280" viewBox="0 0 280 280" className="absolute">
                  <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        values="0 140 140;360 140 140"
                        dur="10s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 140 40 A 100 100 0 0 1 240 140"
                    fill="none"
                    stroke="url(#gradient3)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              <div className="relative">
                <svg
                  width="400"
                  height="400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full max-w-sm"
                >
                  <defs>
                    <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                      <stop offset="70%" stopColor="rgba(255,255,255,0.2)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      <animate attributeName="r" values="40%;60%;40%" dur="4s" repeatCount="indefinite" />
                    </radialGradient>
                  </defs>

                  <circle cx="12" cy="12" r="10" fill="url(#centerGradient)" />
                  <circle cx="12" cy="12" r="8" fill="#8B5CF6" opacity="0.2" />

                  <path
                    d="M4 21V18.5C4 15.4624 6.46243 13 9.5 13H14.5C17.5376 13 20 15.4624 20 18.5V21M8 21V18M16 21V18M11 9H7.5C6.67157 9 6 8.32843 6 7.5V6.5C6 5.16725 6.57938 3.96983 7.5 3.14585M18 8.00001V6.50001C18 5.16726 17.4206 3.96983 16.5 3.14585M20 7.5V6M4 7.5V6M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="#8B5CF6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    fill="none"
                  />

                  <circle cx="12" cy="7" r="3" fill="#8B5CF6" opacity="0.3" />
                </svg>
              </div>
              </div>
          </motion.div>
        </div>


      </div>
    </section>
  )
}
