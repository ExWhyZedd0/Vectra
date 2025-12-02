import React from 'react';
import { Navbar } from '../components/navbar';

// Import file CSS (sesuaikan path jika perlu mundur folder gunakan '../News.css')
import '../CSS/News.css'; 

const News = () => {
  return (
    <div className="news-page-container">
      
      {/* Navbar Wrapper */}
      <div className="news-navbar-wrapper">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="news-content">
        <h1 className="news-title">
          Latest <span className="news-accent">News</span>
        </h1>
        <p className="news-subtitle">Stay updated with the latest trends in crypto.</p>
        
        {/* Grid System */}
        <div className="news-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="news-card">
              {/* Image Skeleton */}
              <div className="news-image-placeholder"></div>
              
              <h3 className="news-card-title">Crypto Market Update #{item}</h3>
              <p className="news-card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;