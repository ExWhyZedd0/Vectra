import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar';
import MarketTable from '../components/MarketTable';
import '../CSS/MarketPage.css'; 

const MarketPage = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalData = async () => {
      setLoading(true);
      try {
        // HANYA MENGGUNAKAN COINGECKO
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        
        if (!response.ok) {
          throw new Error('Failed to fetch global data from CoinGecko');
        }

        const result = await response.json();
        
        if (result && result.data) {
          setGlobalStats(result.data);
        }

      } catch (error) {
        console.error("Error fetching global stats:", error);
        // Tidak ada fallback ke API lain.
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  const formatBigNumber = (num) => {
    if (!num) return "$0";
    if (num >= 1.0e+12) {
      return "$" + (num / 1.0e+12).toFixed(2) + " Trillion";
    } else if (num >= 1.0e+9) {
      return "$" + (num / 1.0e+9).toFixed(2) + " Billion";
    } else {
      return "$" + num.toLocaleString();
    }
  };

  return (
    <div className="market-page-container">
      <div className="market-bg-accent"></div>
      
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
          
          {/* Card 1: Global Market Cap */}
          <StatCard 
            label="Global Market Cap" 
            value={loading ? "Loading..." : formatBigNumber(globalStats?.total_market_cap?.usd)} 
            change={loading ? "..." : (globalStats?.market_cap_change_percentage_24h_usd?.toFixed(1) + "%")}
            isNegative={globalStats?.market_cap_change_percentage_24h_usd < 0}
          />

          {/* Card 2: 24h Volume */}
          <StatCard 
            label="24h Volume" 
            value={loading ? "Loading..." : formatBigNumber(globalStats?.total_volume?.usd)} 
            change={null}
            isNegative={false} 
          />

          {/* Card 3: BTC Dominance */}
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