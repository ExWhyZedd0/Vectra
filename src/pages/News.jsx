import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar';
import '../CSS/News.css'; 

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dari CryptoCompare
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();

        // === PERBAIKAN UTAMA DI SINI ===
        // 1. Ambil data dari result.Data
        let articles = result.Data;

        // 2. SAFETY CHECK: Pastikan 'articles' adalah Array
        // Jika articles itu undefined, null, atau bukan array (misal object error), paksa jadi []
        if (!Array.isArray(articles)) {
          console.warn("API response 'Data' is not an array:", result);
          articles = []; 
        }

        // 3. Cek jika kosong
        if (articles.length === 0) {
           console.warn("No news articles found.");
        }

        // 4. Slice dengan aman karena kita sudah yakin ini Array
        setNewsData(articles.slice(0, 36));
        setLoading(false);

      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
        setLoading(false);
        setNewsData([]); // Reset ke array kosong jika error
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
    const date = new Date(timestamp * 1000);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="news-page-container">
      <div className="news-bg-accent"></div>
      <div className="news-navbar-wrapper">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      <div className="news-content">
        <h1 className="news-title">
          Latest <span className="news-accent">News</span>
        </h1>
        <p className="news-subtitle">Stay updated with the latest trends from CryptoCompare.</p>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Fetching latest stories...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error} <br/>
            <small style={{fontSize:'0.8rem'}}>Check console (F12) for details.</small>
          </div>
        )}

        {!loading && !error && newsData.length === 0 && (
           <div style={{marginTop: '2rem', color: '#9ca3af'}}>
             No news articles found. Please try again later.
           </div>
        )}

        {!loading && !error && newsData.length > 0 && (
          <div className="news-grid">
            {newsData.map((item, index) => (
              <a 
                key={item.id || index} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="news-card"
              >
                <div className="news-image-wrapper">
                  {item.imageurl ? (
                    <img 
                      src={item.imageurl} 
                      alt={item.title} 
                      className="news-image" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="news-image-placeholder">No Image</div>
                  )}
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