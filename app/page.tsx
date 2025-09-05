'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import CTASection from '../components/CTASection'
import CaseStudies from '../components/CaseStudies'
import WorkingProcess from '../components/WorkingProcess'
import Footer from '../components/Footer'
import ThemeLanguageSwitcher from '../components/ThemeLanguageSwitcher'
import HomeLayout from '../components/HomeLayout'

export default function Home() {
  const { user, loading } = useAuth()

  useEffect(() => {
    // Если пользователь аутентифицирован, перенаправляем на соответствующий dashboard
    if (!loading && user) {
      if (user.role === 'hr') {
        window.location.href = '/hr/dashboard'
      } else {
        window.location.href = '/candidate/dashboard'
      }
    }
  }, [user, loading])

  // Показываем загрузку пока проверяем аутентификацию
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Если пользователь аутентифицирован, не показываем главную страницу
  if (user) {
    return null
  }

  return (
    <HomeLayout>
      <main className="min-h-screen">
        <ThemeLanguageSwitcher />
        <Header />
        <Hero />
        <Services />
        <CTASection />
        <CaseStudies />
        <WorkingProcess />
        <Footer />
      </main>
    </HomeLayout>
  )
}
