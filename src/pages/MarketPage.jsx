import React from 'react';
import { Navbar } from '../components/navbar';
import MarketTable from '../components/MarketTable';

const MarketPage = () => {
  return (
    <div className="min-h-screen bg-[#060010] text-white overflow-x-hidden selection:bg-[#00FFA3] selection:text-black">
      
      {/* BACKGROUND ACCENT (Optional static glow) */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00FFA3]/10 via-[#060010] to-[#060010] -z-10 pointer-events-none"></div>

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="navbar-container is-at-top"> 
            {/* Kita pakai class is-at-top agar navbar langsung terlihat solid/jelas */}
            <Navbar />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="pt-32 pb-20 px-4 md:px-8">
        
        {/* HEADER SECTION */}
        <div className="max-w-7xl mx-auto mb-16 text-center mt-10">
          <h1 className="text-4xl md:text-6xl font-['Audiowide'] mb-6 animate-[fade-in_1s_ease-out]">
            Crypto <span className="text-[#00FFA3]">Market</span>
          </h1>
          <p className="text-gray-400 font-['Fredoka'] text-lg max-w-2xl mx-auto">
            Track live prices, market cap, and trading volume for top cryptocurrencies. 
            Trade wisely with Vectra analytics.
          </p>
        </div>

        {/* MARKET STATS (3 Highlight Cards) */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatCard label="Global Market Cap" value="$2.45 Trillion" change="+1.2%" />
          <StatCard label="24h Volume" value="$86.4 Billion" change="-5.4%" isNegative />
          <StatCard label="BTC Dominance" value="54.2%" change="+0.1%" />
        </div>

        {/* TABLE SECTION */}
        <MarketTable />

      </div>
    </div>
  );
};

// Component Kecil untuk Statistik Atas
const StatCard = ({ label, value, change, isNegative }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-start hover:border-[#00FFA3]/30 transition-all duration-300 hover:-translate-y-1">
    <p className="text-gray-400 font-['Fredoka'] text-sm mb-2">{label}</p>
    <div className="flex items-end gap-3 w-full justify-between">
      <h3 className="text-2xl md:text-3xl font-['Audiowide']">{value}</h3>
      <span className={`text-sm font-bold px-2 py-1 rounded-md ${
        isNegative 
        ? 'bg-red-500/20 text-red-400' 
        : 'bg-[#00FFA3]/20 text-[#00FFA3]'
      }`}>
        {change}
      </span>
    </div>
  </div>
);

export default MarketPage;