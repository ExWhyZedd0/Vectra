import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import '../CSS/CoinDetail.css';

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State untuk menyimpan pesan error

  const fetchCoinDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Data Detail
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`);
      
      // Cek Status Limit (429)
      if (res.status === 429) {
        throw new Error("Too Many Requests. Please wait a few seconds and try again.");
      }
      
      // Cek jika ID salah (404)
      if (res.status === 404) {
        throw new Error("Coin not found. It might be delisted or ID is wrong.");
      }

      if (!res.ok) {
        throw new Error("Failed to fetch data.");
      }

      const data = await res.json();
      setCoin(data);
    } catch (err) {
      console.error("Error fetching detail:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinDetail();
  }, [id]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // TAMPILAN LOADING
  if (loading) return (
    <div className="detail-container">
      <div className="detail-bg-accent"></div>
      <div style={{paddingTop: '150px', textAlign:'center', fontFamily:'Audiowide'}}>
        Loading {id}...
      </div>
    </div>
  );

  // TAMPILAN ERROR (Rate Limit / Not Found)
  if (error) return (
    <div className="detail-container">
      <div className="detail-bg-accent"></div>
      <div style={{
        paddingTop: '150px', 
        textAlign:'center', 
        display:'flex', 
        flexDirection:'column', 
        alignItems:'center', 
        gap:'20px'
      }}>
        <h2 style={{fontFamily:'Audiowide', color:'#ef4444'}}>⚠️ Oops!</h2>
        <p style={{fontFamily:'Fredoka', maxWidth:'400px'}}>{error}</p>
        
        <div style={{display:'flex', gap:'10px'}}>
          <button onClick={() => navigate('/market')} className="back-button">
            &larr; Back to List
          </button>
          <button 
            onClick={fetchCoinDetail} 
            className="back-button"
            style={{borderColor:'#00FFA3', color:'#00FFA3'}}
          >
            ↻ Try Again
          </button>
        </div>
      </div>
    </div>
  );

  if (!coin) return null;

  return (
    <div className="detail-container">
      <div className="detail-bg-accent"></div>
      
      <div style={{position:'fixed', top:0, width:'100%', zIndex:100}}>
         <div className="navbar-container is-at-top"><Navbar /></div>
      </div>

      <div className="detail-content">
        <button onClick={() => navigate('/market')} className="back-button">
          &larr; Back to Market
        </button>

        {/* HEADER */}
        <div className="coin-header">
          <div className="coin-title-group">
            <img src={coin.image.large} alt={coin.name} className="detail-coin-icon" />
            <div>
              <h1 className="detail-coin-name">
                {coin.name} <span className="detail-coin-rank">#{coin.market_cap_rank}</span>
              </h1>
              <span style={{color:'#9ca3af', textTransform:'uppercase'}}>{coin.symbol}</span>
            </div>
          </div>

          <div className="coin-price-group">
            <h2 className="detail-price">
              {coin.market_data?.current_price?.usd ? formatCurrency(coin.market_data.current_price.usd) : "N/A"}
            </h2>
            <div className={`detail-change ${coin.market_data.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`} style={{color: coin.market_data.price_change_percentage_24h > 0 ? '#00FFA3' : '#ef4444'}}>
              {coin.market_data.price_change_percentage_24h?.toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        {/* GRID CONTENT */}
        <div className="detail-grid">
          
          {/* CHART SECTION */}
          <div className="chart-card">
            <h3 style={{fontFamily:'Audiowide', marginBottom:'20px'}}>Price Chart (7 Days)</h3>
            <div style={{width:'100%', height:'300px', display:'flex', alignItems:'flex-end'}}>
               {coin.market_data.sparkline_7d?.price ? (
                 <SimpleSparkline data={coin.market_data.sparkline_7d.price} color={coin.market_data.price_change_percentage_7d > 0 ? '#00FFA3' : '#ef4444'} />
               ) : (
                 <div className="chart-placeholder">Chart data unavailable</div>
               )}
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="stats-card">
            <h3 style={{fontFamily:'Audiowide', marginBottom:'10px'}}>Market Stats</h3>
            
            <StatRow label="Market Cap" value={formatCurrency(coin.market_data.market_cap.usd)} />
            <StatRow label="Trading Vol (24h)" value={formatCurrency(coin.market_data.total_volume.usd)} />
            <StatRow label="24h High" value={formatCurrency(coin.market_data.high_24h.usd)} />
            <StatRow label="24h Low" value={formatCurrency(coin.market_data.low_24h.usd)} />
            <StatRow label="Circulating Supply" value={coin.market_data.circulating_supply?.toLocaleString()} />
          </div>

          {/* DESCRIPTION */}
          <div className="desc-card">
            <h3 style={{fontFamily:'Audiowide', marginBottom:'15px'}}>About {coin.name}</h3>
            <div 
              className="desc-text"
              dangerouslySetInnerHTML={{ __html: coin.description.en || "No description available." }} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};

const StatRow = ({label, value}) => (
  <div className="stat-row">
    <span className="stat-label">{label}</span>
    <span className="stat-val">{value || "N/A"}</span>
  </div>
);

const SimpleSparkline = ({ data, color }) => {
  const width = 800;
  const height = 300;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  if (range === 0) return null; // Prevent division by zero

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{width:'100%', height:'100%', overflow:'visible'}}>
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id={`chartGradient-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#chartGradient-${color})`} />
    </svg>
  );
}

export default CoinDetail;