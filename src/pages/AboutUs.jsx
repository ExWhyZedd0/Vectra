import React from 'react';
import { Navbar } from '../components/navbar.jsx';

// Import CSS dari folder CSS
import '../CSS/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page-container">
      
      {/* Background Gradient */}
      <div className="about-bg-accent"></div>

      {/* Navbar Wrapper */}
      <div className="about-navbar-wrapper">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        
        {/* Header */}
        <div className="about-header">
          <h1 className="about-title">
            About <span className="text-highlight">Vectra</span>
          </h1>
          <p className="about-description">
            We are building the next generation of decentralized finance tools for everyone.
          </p>
        </div>

        {/* Grid Mission & Vision */}
        <div className="about-grid">
          {/* Card 1: Mission */}
          <div className="about-card">
            <h2 className="card-title">Our Mission</h2>
            <p className="card-text">
              Vectra aims to simplify crypto trading by providing professional-grade analytics wrapped in a beautiful, accessible interface. We believe financial freedom should be available to everyone, everywhere.
            </p>
          </div>

          {/* Card 2: Vision */}
          <div className="about-card">
            <h2 className="card-title">Our Vision</h2>
            <p className="card-text">
              To become the world's most trusted platform for digital asset tracking and trading, bridging the gap between traditional finance and the decentralized web.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;