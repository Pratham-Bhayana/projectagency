import React from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import TechStack from '../components/TechStack'
import Portfolio from '../components/Portfolio'
import Contact from '../components/Contact'

const Home = () => {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Services />
      <About />
      <TechStack />
      <Portfolio />
      <Contact />
    </main>
  )
}

export default Home
