'use client'

import { motion } from 'framer-motion'
import { Linkedin } from 'lucide-react'

export default function Team() {
  const teamMembers = [
    {
      name: 'John Smith',
      position: 'CEO and Founder',
      bio: '10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy',
      image: '/team/john.jpg'
    },
    {
      name: 'Jane Doe',
      position: 'Director of Operations',
      bio: '7+ years of experience in project management and team leadership. Strong organizational and communication skills',
      image: '/team/jane.jpg'
    },
    {
      name: 'Michael Brown',
      position: 'Senior SEO Specialist',
      bio: '5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization',
      image: '/team/michael.jpg'
    },
    {
      name: 'Emily Johnson',
      position: 'PPC Manager',
      bio: '3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis',
      image: '/team/emily.jpg'
    },
    {
      name: 'Brian Williams',
      position: 'Social Media Specialist',
      bio: '4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement',
      image: '/team/brian.jpg'
    },
    {
      name: 'Sarah Kim',
      position: 'Content Creator',
      bio: '2+ years of experience in writing and editing. Skilled in creating compelling, SEO-optimized content for various industries',
      image: '/team/sarah.jpg'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold font-positivus mb-4">
            <span className="bg-primary-green px-2 py-1 rounded">Team</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Meet the skilled and experienced team behind our 
            successful digital marketing strategies
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white border border-dark rounded-3xl p-6 relative overflow-hidden group cursor-pointer"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <div className="w-24 h-24 bg-primary-green rounded-full absolute inset-0 opacity-30"></div>
                  <div className="w-20 h-20 bg-gray-300 rounded-full absolute top-2 left-2 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 bg-dark text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Linkedin size={16} />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary-green font-medium mb-4">{member.position}</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center">
                  <Linkedin size={16} className="text-dark" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="bg-dark text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-all duration-300">
            See all team
          </button>
        </motion.div>
      </div>
    </section>
  )
}
