import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/navbar';
import DarkVeil from '../components/darkveil';
import '../CSS/News.css'; 

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const result = await response.json();
        
        let articles = result.Data;
        if (!Array.isArray(articles)) articles = [];
        
        setNewsData(articles.slice(0, 36));
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
        setLoading(false);
        setNewsData([]);
      }
    };
    fetchNews();
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    const cleanText = text.replace(/&nbsp;/g, ' ').replace(/<[^>]*>?/gm, '');
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substr(0, maxLength) + "...";
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    // Set background transparent agar DarkVeil terlihat
    <div className="news-page-container" ref={containerRef} style={{backgroundColor: 'transparent'}}>
      
      {/* DARKVEIL BACKGROUND */}
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10}}>
        <DarkVeil scrollProgress={scrollProgress} hueShift={0} />
      </div>

      <div className="news-navbar-wrapper">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      <div className="news-content">
        <h1 className="news-title">Latest <span className="news-accent">News</span></h1>
        <p className="news-subtitle">Stay updated with the latest trends from CryptoCompare.</p>
        
        {loading && <div className="loading-container"><div className="loading-spinner"></div><p>Fetching latest stories...</p></div>}
        {error && <div className="error-message">⚠️ {error}</div>}

        {!loading && !error && newsData.length > 0 && (
          <div className="news-grid">
            {newsData.map((item, index) => (
              <a key={item.id || index} href={item.url} target="_blank" rel="noopener noreferrer" className="news-card">
                <div className="news-image-wrapper">
                  {item.imageurl ? <img src={item.imageurl} alt={item.title} className="news-image" loading="lazy"/> : <div className="news-image-placeholder">No Image</div>}
                  <div className="news-overlay">Read More ↗</div>
                </div>
                <div className="news-card-content">
                  <div className="news-meta">
                    <span className="news-source">{item.source_info?.name || "CryptoNews"}</span>
                    <span className="news-date">{formatDate(item.published_on)}</span>
                  </div>
                  <h3 className="news-card-title">{truncateText(item.title, 60)}</h3>
                  <p className="news-card-desc">{truncateText(item.body, 100)}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;