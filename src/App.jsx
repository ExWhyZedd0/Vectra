import React, { useState, useEffect} from 'react'
// Components
import { Navbar } from './components/navbar.jsx'
import MagicBento from './components/magicbento.jsx'
import DarkVeil from './components/darkveil.jsx'
import TextType from './components/texttype.jsx';
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
        <MagicBento 
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
        />
      </section>
      <main>

      </main>
    </>
  )
}

export default App
