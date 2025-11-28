import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Components
import { Navbar } from '../components/navbar.jsx'
import DarkVeil from '../components/darkveil.jsx'
import TextType from '../components/texttype.jsx'
import SplineScene from '../components/splinescene.jsx'
import BentoBox from '../components/bentobox.jsx'

//Hooks
import useOnScreen from '../hooks/useOnScreen.js'

// Assets
import HeroImage from '../assets/Hero_Vectra.png'

gsap.registerPlugin(ScrollToPlugin);

const Home = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); 

  const scrollContainerRef = useRef(null);
  const heroSectionRef = useRef(null); 
  const bodySectionRef = useRef(null);
  const footerSectionRef = useRef(null);

  const isBodyVisible = !!useOnScreen(bodySectionRef, scrollContainerRef, footerSectionRef);

  // GSAP Scroll Logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !heroSectionRef.current || !bodySectionRef.current || !footerSectionRef.current) return;

    const handleWheel = (event) => {
      if (isAnimating) {
        event.preventDefault();
        return;
      }
      
      // Jika user sedang di body section dan scroll element internal (misal bento box list), jangan trigger GSAP
      const target = event.target;
      if (target.closest('.overflow-y-auto')) {
        // Biarkan default scroll behavior untuk elemen yang bisa di-scroll
        return;
      }

      event.preventDefault();

      const scrollAmount = event.deltaY;
      const currentScroll = container.scrollTop;
      const sections = [heroSectionRef.current, bodySectionRef.current, footerSectionRef.current];
      
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

  // Scroll Progress Logic
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
        
        {/* SECTION 1: HERO */}
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

        {/* SECTION 2: BODY / BENTO */}
        <section className='body-section' ref={bodySectionRef}>
          <div className='spline-background'>
            <SplineScene />
          </div>
          
          <div className="relative z-10 w-full flex items-center justify-center min-h-screen py-20">
              <BentoBox isVisible={isBodyVisible} />
          </div>
        </section>

        {/* SECTION 3: FOOTER */}
        <section className='footer-section' ref={footerSectionRef}>
          <p>© 2025 Vectra. All rights reserved.</p>
        </section>

      </main>
    </>
  )
}

export default Home;