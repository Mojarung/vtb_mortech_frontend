import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import CTASection from '../components/CTASection'
import CaseStudies from '../components/CaseStudies'
import WorkingProcess from '../components/WorkingProcess'
import Team from '../components/Team'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <CTASection />
      <CaseStudies />
      <WorkingProcess />
      <Team />
      <Footer />
    </main>
  )
}
