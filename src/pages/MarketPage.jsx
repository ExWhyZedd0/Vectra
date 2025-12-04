import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/navbar';
import MarketTable from '../components/MarketTable';
import DarkVeil from '../components/darkveil';
import '../CSS/MarketPage.css'; 

const MarketPage = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
    const fetchGlobalData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        if (!response.ok) throw new Error('Failed to fetch global data');
        const result = await response.json();
        if (result && result.data) setGlobalStats(result.data);
      } catch (error) {
        console.error("Error fetching global stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalData();
  }, []);

  const formatBigNumber = (num) => {
    if (!num) return "$0";
    if (num >= 1.0e+12) return "$" + (num / 1.0e+12).toFixed(2) + " Trillion";
    if (num >= 1.0e+9) return "$" + (num / 1.0e+9).toFixed(2) + " Billion";
    return "$" + num.toLocaleString();
  };

  return (
    // Tambahkan ref dan set background transparan agar Veil terlihat
    <div className="market-page-container" ref={containerRef} style={{backgroundColor: 'transparent'}}>
      
      {/* GANTI BACKGROUND ACCENT DENGAN DARKVEIL */}
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10}}>
        <DarkVeil scrollProgress={scrollProgress} hueShift={0} />
      </div>
      
      <div className="market-navbar-wrapper">
        <div className="navbar-container is-at-top"> 
            <Navbar />
        </div>
      </div>

      <div className="market-content">
        <div className="market-header">
          <h1 className="market-title">
            Crypto <span className="text-highlight">Market</span>
          </h1>
          <p className="market-description">
            Track live prices, market cap, and trading volume for top cryptocurrencies. 
            Trade wisely with Vectra analytics.
          </p>
        </div>

        <div className="stats-grid">
          <StatCard 
            label="Global Market Cap" 
            value={loading ? "Loading..." : formatBigNumber(globalStats?.total_market_cap?.usd)} 
            change={loading ? "..." : (globalStats?.market_cap_change_percentage_24h_usd?.toFixed(1) + "%")}
            isNegative={globalStats?.market_cap_change_percentage_24h_usd < 0}
          />
          <StatCard 
            label="24h Volume" 
            value={loading ? "Loading..." : formatBigNumber(globalStats?.total_volume?.usd)} 
            change={null}
            isNegative={false} 
          />
          <StatCard 
            label="BTC Dominance" 
            value={loading ? "Loading..." : (globalStats?.market_cap_percentage?.btc?.toFixed(1) + "%")} 
            change={null}
            isNegative={false}
          />
        </div>

        <div className="w-full">
            <MarketTable />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, change, isNegative }) => (
  <div className="stat-card">
    <p className="stat-label">{label}</p>
    <div className="stat-value-container">
      <h3 className="stat-value" style={{fontSize: value && value.length > 15 ? '1.5rem' : '1.875rem'}}>
        {value}
      </h3>
      {change && (
        <span className={`stat-change ${isNegative ? 'negative' : 'positive'}`}>
          {change}
        </span>
      )}
    </div>
  </div>
);

export default MarketPage;