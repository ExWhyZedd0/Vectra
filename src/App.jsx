import React from 'react'
import { Navbar } from './components/navbar.jsx'
import HomePageLight from './assets/Home_Page.png'
import HomePageDark from './assets/Home_Page_Dark.png'
import HeroImage from './assets/Hero_Vectra.png'
import Logo from './assets/Vectra-Logo.svg'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <section className='hero-section'>
        <div className='hero-content'>
          <img src={HeroImage} alt="" className='hero-image'/>
          <div className='hero-text-container'>
          <h1 className='hero-text'>The future of world is here</h1>
          <p className='hero-subtext'>We're the most trusted place for people and businesses to buy, sell, and manage crypto.</p>
          </div>
        </div>
      </section>
      <section className='body-section'>
        {/* <MagicBento 
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        /> */}
      </section>
      <main>

      </main>
    </>
  )
}

export default App
