import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/navbar.jsx';
import DarkVeil from '../components/darkveil.jsx';
import '../CSS/AboutUs.css';

const AboutUs = () => {
  // State untuk animasi DarkVeil
  const [scrollProgress, setScrollProgress] = useState(1);
  const containerRef = useRef(null);

  // Logic Scroll Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress || 0);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Set background transparent agar DarkVeil terlihat
    <div className="about-page-container" ref={containerRef} style={{backgroundColor: 'transparent'}}>
      
      {/* DARKVEIL BACKGROUND */}
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10}}>
        <DarkVeil scrollProgress={scrollProgress} hueShift={0} />
      </div>

      {/* Navbar Wrapper */}
      <div className="about-navbar-wrapper">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <div className="about-header">
          <h1 className="about-title">About <span className="text-highlight">Vectra</span></h1>
          <p className="about-description">We are building the next generation of decentralized finance tools for everyone.</p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <h2 className="card-title">Our Mission</h2>
            <p className="card-text">Vectra aims to simplify crypto trading by providing professional-grade analytics wrapped in a beautiful, accessible interface. We believe financial freedom should be available to everyone, everywhere.</p>
          </div>

          <div className="about-card">
            <h2 className="card-title">Our Vision</h2>
            <p className="card-text">To become the world's most trusted platform for digital asset tracking and trading, bridging the gap between traditional finance and the decentralized web.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;