import React, { useState } from 'react';

const MarketTable = () => {
  const [filter, setFilter] = useState('all');

  // Data Dummy yang lebih lengkap
  const marketData = [
    { rank: 1, code: 'BTC', name: 'Bitcoin', price: '$64,230.50', change: '+2.4%', cap: '$1.2T', vol: '$35B', isUp: true },
    { rank: 2, code: 'ETH', name: 'Ethereum', price: '$3,450.12', change: '+1.8%', cap: '$405B', vol: '$15B', isUp: true },
    { rank: 3, code: 'SOL', name: 'Solana', price: '$145.60', change: '+5.2%', cap: '$65B', vol: '$4.2B', isUp: true },
    { rank: 4, code: 'VCT', name: 'Vectra', price: '$12.45', change: '+12.5%', cap: '$800M', vol: '$120M', isUp: true },
    { rank: 5, code: 'XRP', name: 'Ripple', price: '$0.62', change: '+0.9%', cap: '$34B', vol: '$1.1B', isUp: true },
    { rank: 6, code: 'ADA', name: 'Cardano', price: '$0.45', change: '-0.4%', cap: '$16B', vol: '$400M', isUp: false },
    { rank: 7, code: 'DOGE', name: 'Dogecoin', price: '$0.16', change: '+8.1%', cap: '$23B', vol: '$2.5B', isUp: true },
    { rank: 8, code: 'DOT', name: 'Polkadot', price: '$7.20', change: '-1.2%', cap: '$10B', vol: '$200M', isUp: false },
    { rank: 9, code: 'LINK', name: 'Chainlink', price: '$18.50', change: '+3.4%', cap: '$11B', vol: '$500M', isUp: true },
    { rank: 10, code: 'MATIC', name: 'Polygon', price: '$0.98', change: '+1.1%', cap: '$9B', vol: '$300M', isUp: true },
    { rank: 11, code: 'AVAX', name: 'Avalanche', price: '$45.30', change: '-2.5%', cap: '$17B', vol: '$600M', isUp: false },
    { rank: 12, code: 'SHIB', name: 'Shiba Inu', price: '$0.000027', change: '-1.5%', cap: '$15B', vol: '$800M', isUp: false },
  ];

  // Logic Filter Sederhana
  const filteredData = marketData.filter(coin => {
    if (filter === 'gainers') return coin.isUp;
    if (filter === 'losers') return !coin.isUp;
    return true;
  });

  const tableHeaderStyle = "text-gray-400 font-['Fredoka'] text-sm pb-4";

  return (
    <div className="w-full max-w-7xl mx-auto">
      
      {/* FILTER TABS */}
      <div className="flex gap-4 mb-8 font-['Audiowide']">
        {['all', 'gainers', 'losers'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              filter === tab 
              ? 'bg-[#00FFA3] text-black border-[#00FFA3] shadow-[0_0_15px_rgba(0,255,163,0.5)]' 
              : 'bg-transparent text-white border-white/20 hover:border-[#00FFA3] hover:text-[#00FFA3]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE HEADER (Hidden on mobile) */}
      <div className="hidden md:grid grid-cols-12 px-6 mb-2">
        <div className={`${tableHeaderStyle} col-span-1`}>#</div>
        <div className={`${tableHeaderStyle} col-span-3`}>Name</div>
        <div className={`${tableHeaderStyle} col-span-2 text-right`}>Price</div>
        <div className={`${tableHeaderStyle} col-span-2 text-right`}>24h Change</div>
        <div className={`${tableHeaderStyle} col-span-2 text-right`}>Market Cap</div>
        <div className={`${tableHeaderStyle} col-span-2 text-right`}>Volume</div>
      </div>

      {/* COIN LIST */}
      <div className="flex flex-col gap-3">
        {filteredData.map((coin) => (
          <div 
            key={coin.rank}
            className="group grid grid-cols-2 md:grid-cols-12 items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 md:px-6 md:py-5 hover:bg-white/10 hover:border-[#00FFA3]/30 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
          >
            {/* RANK */}
            <div className="hidden md:block col-span-1 text-gray-500 font-['Audiowide'] group-hover:text-white transition-colors">
              {coin.rank}
            </div>

            {/* NAME */}
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-xs text-white">
                {coin.code[0]}
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                <span className="text-white font-['Audiowide'] text-lg">{coin.code}</span>
                <span className="text-gray-400 text-xs md:text-sm font-['Fredoka']">{coin.name}</span>
              </div>
            </div>

            {/* PRICE */}
            <div className="col-span-2 text-right font-['Audiowide'] text-white md:text-base text-lg">
              {coin.price}
            </div>

            {/* CHANGE (Mobile: Hidden if needed, but important) */}
            <div className={`col-span-2 text-right font-['Fredoka'] font-medium ${coin.isUp ? 'text-[#00FFA3]' : 'text-red-500'}`}>
              {coin.change}
            </div>

            {/* MARKET CAP (Hidden on Mobile) */}
            <div className="hidden md:block col-span-2 text-right text-white/80 font-['Fredoka']">
              {coin.cap}
            </div>

             {/* VOLUME (Hidden on Mobile) */}
             <div className="hidden md:block col-span-2 text-right text-white/80 font-['Fredoka']">
              {coin.vol}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTable;