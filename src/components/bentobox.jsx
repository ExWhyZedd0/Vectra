import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/BentoBox.css'; // Import CSS Baru

const BentoBox = ({ isVisible }) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        // Ambil 5 koin teratas untuk list vertikal
        setTrending(data.coins.slice(0, 5)); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending:", error);
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className={`bento-wrapper ${isVisible ? 'visible' : ''}`}>
      <div className="bento-grid">
        
        {/* BOX 1: Main Feature (Large) */}
        <div className="bento-item bento-large">
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', 
            background: 'radial-gradient(circle at center, rgba(0,255,163,0.1), transparent 70%)', 
            zIndex: 0
          }}></div>
          
          <div style={{zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <h3 className="bento-title" style={{fontSize: '2rem', marginBottom: '10px'}}>
              Real-time <span style={{color:'#00FFA3'}}>Analytics</span>
            </h3>
            <p className="bento-desc" style={{maxWidth: '80%'}}>
              Our advanced algorithms process millions of data points every second to give you the most accurate market insights.
            </p>
            <button 
                onClick={() => navigate('/market')}
                style={{
                  marginTop: '20px', padding: '10px 24px', background: '#00FFA3', 
                  color: 'black', border: 'none', borderRadius: '8px', 
                  fontFamily: 'Audiowide', cursor: 'pointer', width: 'fit-content'
                }}
            >
              Explore Market &rarr;
            </button>
          </div>
        </div>

        {/* BOX 2: TRENDING WIDGET (API INTEGRATED) */}
        <div className="bento-item bento-trending">
          <h3 className="bento-title">
            <span className="icon-fire">🔥</span> Trending Now
          </h3>
          
          <div className="trending-list">
            {loading ? (
              <div style={{color: '#9ca3af', textAlign:'center', marginTop: '20px'}}>Loading...</div>
            ) : (
              trending.map((coinData) => {
                const coin = coinData.item;
                return (
                  <div 
                    key={coin.id} 
                    className="trending-item"
                    onClick={() => navigate(`/market/${coin.id}`)}
                  >
                    <img src={coin.small} alt={coin.name} className="t-img" />
                    <div className="t-info">
                      <span className="t-name">{coin.name}</span>
                      <span className="t-symbol">{coin.symbol}</span>
                    </div>
                    <span className="t-rank">#{coin.market_cap_rank}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* BOX 3: Stat Box */}
        <div className="bento-item">
          <h3 className="bento-title">Global Users</h3>
          <p className="bento-desc">Join our growing community.</p>
          <div className="bento-stat-num">50K+</div>
        </div>

        {/* BOX 4: Stat Box */}
        <div className="bento-item">
          <h3 className="bento-title">Secure</h3>
          <p className="bento-desc">Bank-grade encryption for all your assets.</p>
          <div style={{fontSize: '3rem', marginTop: 'auto'}}>🔒</div>
        </div>

      </div>
    </div>
  );
};

export default BentoBox;