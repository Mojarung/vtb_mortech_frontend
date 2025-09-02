import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import CTASection from '../components/CTASection'
import CaseStudies from '../components/CaseStudies'
import WorkingProcess from '../components/WorkingProcess'
import Footer from '../components/Footer'
import ThemeLanguageSwitcher from '../components/ThemeLanguageSwitcher'

export default function Home() {
  return (
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
  )
}
