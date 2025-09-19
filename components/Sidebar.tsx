'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Package, 
  Heart, 
  Mail, 
  FileText, 
  PieChart, 
  Settings, 
  LogOut,
  Menu,
  X,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../hooks/useLanguage'

interface SidebarProps {
  userRole: 'hr' | 'candidate'
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  const hrMenuItems = [
    { icon: BarChart3, label: t('dashboard'), href: '/hr/dashboard' },
    { icon: Briefcase, label: 'Вакансии', href: '/hr/vacancies' },
    { icon: Users, label: t('candidates'), href: '/hr/candidates' },
    { icon: Calendar, label: t('interviews'), href: '/hr/interviews' },
    { icon: PieChart, label: t('analytics'), href: '/hr/analytics' },
    { icon: FileText, label: t('reports'), href: '/hr/reports' },
    { icon: Settings, label: t('settings'), href: '/hr/settings' },
  ]

  const candidateMenuItems = [
    { icon: BarChart3, label: t('dashboard'), href: '/candidate/dashboard' },
    { icon: Package, label: 'Вакансии', href: '/candidate/vacancies' },
    { icon: Calendar, label: t('my_interviews'), href: '/candidate/interview' },
    // { icon: FileText, label: t('my_applications'), href: '/candidate/applications' },
    { icon: Users, label: t('profile'), href: '/candidate/profile' },
    { icon: Settings, label: t('settings'), href: '/candidate/settings' },
  ]

  const menuItems = userRole === 'hr' ? hrMenuItems : candidateMenuItems

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <motion.div
  initial={false}
  animate={{ 
    width: isCollapsed ? 80 : 280,
    x: isCollapsed ? -280 : 0
  }}
  className={`fixed left-0 top-0 h-screen bg-gray-800 dark:bg-gray-900 text-white z-50 flex flex-col ${
    isCollapsed ? 'lg:translate-x-0 -translate-x-full' : 'translate-x-0'
  } lg:relative lg:translate-x-0 transition-all duration-300 shadow-xl`} 
>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 h-16 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-900 dark:to-gray-800 border-b border-gray-600 dark:border-gray-700">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-white">AI HR</span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden p-1 hover:bg-gray-600 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="px-6 mb-6">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>


        </nav>

        {/* Footer */}
        <div className="mt-auto p-6 border-t border-gray-600 dark:border-gray-700">
          <button
            onClick={() => window.location.href = '/auth/login'}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>{t('logout')}</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-gray-800 dark:bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>
    </>
  )
}
