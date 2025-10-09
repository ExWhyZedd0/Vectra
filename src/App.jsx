import React, { useState, useEffect, useRef } from 'react'
// Components
import { Navbar } from './components/navbar.jsx'
import MagicBento from './components/magicbento.jsx'
import DarkVeil from './components/darkveil.jsx'
import LaserFlow from './components/laserflow.jsx'
import TextType from './components/texttype.jsx'
import DecryptedText from './components/decryptedtext.jsx'
// Assets
import HomePageLight from './assets/Home_Page.png'
import HomePageDark from './assets/Home_Page_Dark.png'
import HeroImage from './assets/Hero_Vectra.png'
import Logo from './assets/Vectra-Logo.svg'
import './App.css'

function App() {
  const [isAtTop, setIsAtTop] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <clipPath id="rounded-trapezoid" clipPathUnits="objectBoundingBox">
        <path d="M 0.00,0.10
                A 0.10,0.10 0 0 1 0.10,0.00
                L 0.90,0.00
                A 0.10,0.10 0 0 1 1.00,0.10
                L 1.00,0.80
                A 0.10,0.10 0 0 1 0.90,0.90
                L 0.10,1.00
                A 0.10,0.10 0 0 1 0.00,0.90
                Z" />
      </clipPath>
    </svg>
      <div className={`navbar-container ${isAtTop ? 'is-at-top' : ''}`}>
      <Navbar />
      </div>
      <div className='background-veil'>
        <DarkVeil />
      </div>
      <section className='hero-section'>
        <div className='hero-content'>
          <img src={HeroImage} alt="" className='hero-image'/>
          <div className='hero-text-container'>
          <TextType 
            text={["The future of world is here"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className='hero-typed-text'
          />
          <p className='hero-subtext'>The future of finance, in your hands. Trade crypto assets with advanced speed and security.</p>
          </div>
        </div>
      </section>
      <section className='body-section'>
        {/* <div className='body-text' >
          <h1>Trading bersama 390 juta pengguna di <Span>Vectra</Span>Vectra</h1>
        </div> */}
        {/* <div class="trapezoid">
          <p>Anda bisa memasukkan konten di sini.</p>
        </div>
        <div class="trapesium-tumpul">
          <p>Konten dengan sudut tumpul!</p>
        </div> */}
        {/* <MagicBento 
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={false}
          clickEffect={true}
          spotlightRadius={250}
          particleCount={24}
          className = 'bento-section'
        /> */}
        <p className='body-title'>Trade with 390 million users on Vectra</p>  
        <div className='bento-box-section'>
          <div className='bento-box-container'>
            <div className='bento-box-wrap'>
              <div className='bento-box-tv-mc'>
                <div className='bento-box-trading-volume'>
                  <p className='bento-box-title'>24h trading volume</p>
                  <p className='bento-box-description'></p>
                </div>
                <div className='bento-market-cap'>
                  <p className='bento-box-title'>Market Cap</p>
                  <p className='bento-box-description'></p>
                </div>
              </div>
              <div className='bento-news'>
                <p className='bento-box-title'>News</p>
                <p className='bento-box-description'></p>
              </div>
            </div>
            <div className='bento-popular'>
              <p className='bento-box-title'>Most Popular</p>
              <p className='bento-box-description'></p>
            </div>
          </div>
        </div>
      </section>
      {/* <section className='footer-section'>
        <div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
          <LaserFlow />
        </div>
      </section> */}
      <main>

      </main>
    </>
  )
}

export default App
