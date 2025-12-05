import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/navbar';
import DarkVeil from '../components/darkveil';
import '../CSS/FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // State untuk animasi DarkVeil
  const [scrollProgress, setScrollProgress] = useState(0);
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

  const faqData = [
    { question: "What is Vectra?", answer: "Vectra is a real-time cryptocurrency tracking platform. We provide advanced analytics, live price updates, and market trends." },
    { question: "Is Vectra free to use?", answer: "Yes! Currently, Vectra is completely free for all users. You can access market data, charts, and news without any subscription fees." },
    { question: "Where does the data come from?", answer: "We aggregate data from reliable sources like CoinGecko. This ensures that the prices are accurate." },
    { question: "Is my wallet secure?", answer: "Vectra is a non-custodial platform. We do not hold your private keys or crypto assets." },
    { question: "How often are prices updated?", answer: "Our market data is updated in near real-time based on API limits." },
    { question: "Can I buy crypto directly?", answer: "Currently, Vectra is an analytics tool. We do not support direct buying or selling yet." },
    { question: "Do I need an account?", answer: "No account is required for basic tracking. You can browse anonymously." },
    { question: "Is there a mobile app?", answer: "Vectra is a Progressive Web App (PWA). It works perfectly on your mobile browser." }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    // Set background transparent agar DarkVeil terlihat
    <div className="faq-page-container" ref={containerRef} style={{backgroundColor: 'transparent'}}>
      
      {/* DARKVEIL BACKGROUND */}
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10}}>
        <DarkVeil scrollProgress={scrollProgress} hueShift={0} />
      </div>

      <div className="faq-navbar-wrapper">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      <div className="faq-content">
        <div className="faq-header">
          <h1 className="faq-title">Frequently Asked <span style={{color: '#00FFA3'}}>Questions</span></h1>
          <p className="faq-subtitle">Everything you need to know about the platform.</p>
        </div>
        
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`} onClick={() => toggleFAQ(index)}>
              <div className="faq-question-row">
                <h3 className="faq-question">{item.question}</h3>
                <span className="faq-icon">▼</span>
              </div>
              <div className="faq-answer-wrapper">
                <p className="faq-answer">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign: 'center', marginTop: '4rem', color: '#9ca3af'}}>
          <p>Still have questions?</p>
          <a href="mailto:support@vectra-cex.site" style={{color: '#00FFA3', textDecoration: 'none', fontWeight: 'bold'}}>Contact Support &rarr;</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;