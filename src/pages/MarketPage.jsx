import React from 'react';
import { Navbar } from '../components/navbar';
import MarketTable from '../components/MarketTable';

//CSS
import '../CSS/MarketPage.css'; 

const MarketPage = () => {
  return (
    <div className="market-page-container">
      
      {/* BACKGROUND ACCENT */}
      <div className="market-bg-accent"></div>

      {/* NAVBAR */}
      <div className="market-navbar-wrapper">
        <div className="navbar-container is-at-top"> 
            <Navbar />
        </div>
      </div>

      {/* MAIN CONTENT */}
      {/* Style marginTop sudah dipindahkan ke class .market-content di CSS */}
      <div className="market-content">
        
        {/* HEADER SECTION */}
        <div className="market-header">
          <h1 className="market-title">
            Crypto <span className="text-highlight">Market</span>
          </h1>
          <p className="market-description">
            Track live prices, market cap, and trading volume for top cryptocurrencies. 
            Trade wisely with Vectra analytics.
          </p>
        </div>

        {/* MARKET STATS (3 Highlight Cards) */}
        <div className="stats-grid">
          <StatCard label="Global Market Cap" value="$2.45 Trillion" change="+1.2%" />
          <StatCard label="24h Volume" value="$86.4 Billion" change="-5.4%" isNegative />
          <StatCard label="BTC Dominance" value="54.2%" change="+0.1%" />
        </div>

        {/* TABLE SECTION */}
        {/* Wrapper div optional jika MarketTable butuh lebar penuh */}
        <div className="w-full">
            <MarketTable />
        </div>

      </div>
    </div>
  );
};

// Component Kecil untuk Statistik Atas (Refactored to Pure CSS classes)
const StatCard = ({ label, value, change, isNegative }) => (
  <div className="stat-card">
    <p className="stat-label">{label}</p>
    <div className="stat-value-container">
      <h3 className="stat-value">{value}</h3>
      <span className={`stat-change ${isNegative ? 'negative' : 'positive'}`}>
        {change}
      </span>
    </div>
  </div>
);

export default MarketPage;