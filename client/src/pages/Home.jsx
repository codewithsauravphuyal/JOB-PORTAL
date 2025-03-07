import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import RusumeAi from '../components/RusumeAi'
import Footer from '../components/Footer'
 
function Home() {
  return (
    <div>
     <Navbar />
     <Hero />
     <JobListing />
     <RusumeAi />
     <Footer />
    </div>
  )
}

export default Home
