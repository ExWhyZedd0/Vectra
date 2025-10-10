import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom';

// GSAP
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

// Components
import { Navbar } from './components/navbar.jsx'
import MagicBento from './components/magicbento.jsx'
import DarkVeil from './components/darkveil.jsx'
import LaserFlow from './components/laserflow.jsx'
import TextType from './components/texttype.jsx'
import DecryptedText from './components/decryptedtext.jsx'
import SplineScene from './components/SplineScene.jsx';

//Hooks
import useOnScreen from './hooks/useOnScreen.js'

// Assets
import HomePageLight from './assets/Home_Page.png'
import HomePageDark from './assets/Home_Page_Dark.png'
import HeroImage from './assets/Hero_Vectra.png'
import Logo from './assets/Vectra-Logo.svg'
import './App.css'

function App() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false); 

  const scrollContainerRef = useRef(null);
  const heroSectionRef = useRef(null); 
  const bodySectionRef = useRef(null);

  const isBodyVisible = !!useOnScreen(bodySectionRef, scrollContainerRef);

  // GSAP useEffect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !heroSectionRef.current || !bodySectionRef.current) return;

    const handleWheel = (event) => {
      if (isAnimating) {
        event.preventDefault();
        return;
      }
      event.preventDefault();

      const scrollAmount = event.deltaY;
      const currentScroll = container.scrollTop;
      const sections = [heroSectionRef.current, bodySectionRef.current];
      
      let currentIndex = sections.findIndex(section => currentScroll < section.offsetTop + section.clientHeight / 2);
      if (currentIndex === -1) currentIndex = 0;

      let targetIndex = currentIndex;
      if (scrollAmount > 0 && currentIndex < sections.length - 1) {
        targetIndex = currentIndex + 1;
      } else if (scrollAmount < 0 && currentIndex > 0) {
        targetIndex = currentIndex - 1;
      }

      if (targetIndex !== currentIndex || currentScroll !== sections[targetIndex].offsetTop) {
        setIsAnimating(true);
        gsap.to(container, {
          duration: 1.2,
          scrollTo: sections[targetIndex].offsetTop,
          ease: 'power2.inOut',
          onComplete: () => {
            setIsAnimating(false);
          }
        });
      }
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isAnimating]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;

      setIsAtTop(scrollTop < 50);

      const progress = Math.min(scrollTop / clientHeight, 1);
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <div className={`navbar-container ${isAtTop ? 'is-at-top' : ''}`}>
      <Navbar />
      </div>
      <div className='background-veil'>
        <DarkVeil scrollProgress={scrollProgress} />
      </div>
      <main className={`scroll-container ${isAtTop ? 'is-at-top' : ''}`} ref={scrollContainerRef}>
        <section className='hero-section' ref={heroSectionRef}>
          <div className='hero-content'>
            <img src={HeroImage} alt="" className='hero-image'/>
            <div className='hero-text-container'>
            <TextType 
              text={["The future of world is here"]}
              typingSpeed={30}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              className='hero-typed-text'
            />
            <p className='hero-subtext'>The future of finance, in your hands. Trade crypto assets with advanced speed and security.</p>
            </div>
          </div>
        </section>
        <section className='body-section' ref={bodySectionRef}>
          <div className='spline-background'>
            <SplineScene />
          </div>
          <div className={`bento-box-section ${isBodyVisible ? 'is-visible' : ''}`}>
            <p className='bento-section-title'><span>Trade with 390 million users on </span> Vectra</p>
            <div className='bento-box-container'>
              <div className='bento-box-wrap'>
                <div className='bento-and-title'>
                <div className='bento-box-tv-mc'>
                  <div className='bento-trading-volume'>
                    <p className='bento-box-title'>24h trading volume</p>
                    <p className='bento-box-description'></p>
                  </div>
                  <div className='bento-market-cap'>
                    <p className='bento-box-title'>Market Cap</p>
                    <p className='bento-box-description'></p>
                  </div>
                </div>
                {/* <p className='bento-section-title'>Trade with 390 million users on Vectra</p> */}
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
        {/* <section className='footer-section' ref={footerSectionRef}>
          <div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
            <LaserFlow />
          </div>
        </section> */}
      </main>
    </>
  )
}

export default App
