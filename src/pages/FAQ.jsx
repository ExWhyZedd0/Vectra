import React from 'react';
import { Navbar } from '../components/navbar';

// PERUBAHAN: Import CSS dari folder CSS
import '../CSS/FAQ.css';

const FAQ = () => {
  return (
    <div className="faq-page-container">
      
      {/* Navbar Fixed */}
      <div className="faq-navbar-wrapper">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      {/* Main Content */}
      <div className="faq-content">
        <div className="faq-header">
          <h1 className="faq-title">
            F.A.Q
          </h1>
        </div>
        
        <div className="faq-list">
          {['What is Vectra?', 'How to trade?', 'Is my wallet secure?'].map((q, i) => (
            <div key={i} className="faq-item">
              <h3 className="faq-question">{q}</h3>
              <p className="faq-answer">This is a placeholder answer for the question above. We are working hard to bring you the best experience.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;