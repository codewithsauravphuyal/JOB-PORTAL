import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import RusumeHero from '../components/RusumeHero'
import Footer from '../components/Footer'
 
function Home() {
  return (
    <div>
     <Navbar />
     <Hero />
     <JobListing />
     <RusumeHero />
     <Footer />
    </div>
  )
}

export default Home
