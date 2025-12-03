import React, { useState } from 'react';
import { Navbar } from '../components/navbar';
import '../CSS/FAQ.css';

const FAQ = () => {
  // State untuk melacak indeks pertanyaan yang terbuka (null = tertutup semua)
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What is Vectra?",
      answer: "Vectra is a real-time cryptocurrency tracking platform. We provide advanced analytics, live price updates, and market trends to help you make informed trading decisions."
    },
    {
      question: "Is Vectra free to use?",
      answer: "Yes! Currently, Vectra is completely free for all users. You can access market data, charts, and news without any subscription fees."
    },
    {
      question: "Where does the data come from?",
      answer: "We aggregate data from reliable sources like CoinGecko and CryptoCompare APIs. This ensures that the prices, volume, and market cap information is accurate."
    },
    {
      question: "Is my wallet secure?",
      answer: "Vectra is a non-custodial platform. We do not hold your private keys or crypto assets. Your assets remain 100% safe in your own personal wallet."
    },
    {
      question: "How often are prices updated?",
      answer: "Our market data is updated in near real-time. Major assets like Bitcoin and Ethereum are updated every few seconds."
    },
    {
      question: "Can I buy crypto directly?",
      answer: "Currently, Vectra is an analytics tool. We do not support direct buying or selling yet, but we are working on DEX integration."
    },
    {
      question: "Do I need an account?",
      answer: "No account is required for basic tracking. You can browse anonymously. An account is only needed for future Watchlist features."
    },
    {
      question: "Is there a mobile app?",
      answer: "Vectra is a Progressive Web App (PWA). It works perfectly on your mobile browser. Native apps are in development."
    }
  ];

  // Fungsi Toggle (Buka/Tutup)
  const toggleFAQ = (index) => {
    // Jika diklik yang sedang terbuka, maka tutup (set null). Jika beda, buka yang baru.
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page-container">
      <div className="faq-navbar-wrapper">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      <div className="faq-content">
        <div className="faq-header">
          <h1 className="faq-title">
            Frequently Asked <span style={{color: '#00FFA3'}}>Questions</span>
          </h1>
          <p className="faq-subtitle">Everything you need to know about the platform.</p>
        </div>
        
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)} // Klik untuk toggle
            >
              <div className="faq-question-row">
                <h3 className="faq-question">{item.question}</h3>
                {/* Icon Panah (Hanya muncul di Mobile lewat CSS) */}
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
          <a href="mailto:support@vectra.com" style={{color: '#00FFA3', textDecoration: 'none', fontWeight: 'bold'}}>
            Contact Support &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;