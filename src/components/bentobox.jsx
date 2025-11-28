import React from 'react';

const BentoBox = ({ isVisible }) => {
  // Style dasar
  const glassStyle = "bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl text-white flex flex-col items-center justify-center text-center transition-all duration-700 ease-out hover:scale-[1.02] hover:bg-white/15 hover:border-white/40";

  const coins = [
    { code: 'BTC', name: 'Bitcoin', change: '+2.4%' },
    { code: 'ETH', name: 'Ethereum', change: '+1.8%' },
    { code: 'SOL', name: 'Solana', change: '+5.2%' },
    { code: 'VCT', name: 'Vectra', change: '+12.5%' },
    { code: 'XRP', name: 'Ripple', change: '+0.9%' },
    { code: 'ADA', name: 'Cardano', change: '-0.4%' },
    { code: 'DOGE', name: 'Dogecoin', change: '+8.1%' },
    { code: 'DOT', name: 'Polkadot', change: '-1.2%' },
    { code: 'LINK', name: 'Chainlink', change: '+3.4%' },
    { code: 'MATIC', name: 'Polygon', change: '+1.1%' },
  ];

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-10 flex flex-col items-center justify-center transition-all duration-1000 gap-10 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
    }`}>
      
      {/* JUDUL UTAMA */}
      <h2 className={`text-3xl md:text-5xl mb-12 md:mb-24 font-['Audiowide'] text-center leading-tight transition-all duration-1000 delay-100  ${
         isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
      }`}>
        <span className="font-['Fredoka'] text-[#efefef]">Trade with 390 million users on </span>
        <span className="text-[#00FFA3]">Vectra</span>
      </h2>
      
      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
        
        {/* --- KOLOM KIRI (Volume, Cap, News) --- */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          
          {/* BARIS ATAS (Volume & Cap) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
            {/* 1. Trading Volume */}
            <div className={`${glassStyle} h-[180px] p-6 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}>
              <p className="font-['Fredoka'] text-lg md:text-xl text-[#00FFA3] mb-2">24h Trading Volume</p>
              <p className="font-['Audiowide'] text-2xl md:text-4xl">$14.2 B</p>
            </div>

            {/* 2. Market Cap */}
            <div className={`${glassStyle} h-[180px] p-6 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}>
               <p className="font-['Fredoka'] text-lg md:text-xl text-[#00FFA3] mb-2">Market Cap</p>
               <p className="font-['Audiowide'] text-2xl md:text-4xl">$1.8 T</p>
            </div>
          </div>

          {/* BARIS BAWAH (News) */}
          {/* 3. News */}
          {/* PERBAIKAN: Menambahkan 'gap-10' di sini. Ini memaksa jarak fisik antara Judul dan Isi Berita. */}
          <div className={`${glassStyle} w-full flex-1 min-h-[180px] delay-500 items-start !justify-start text-left !p-5 gap-6 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
             {/* HAPUS margin-bottom (mb-*) karena sudah dihandle oleh gap parent */}
             <p className="font-['Fredoka'] text-xl text-[#00FFA3] w-full text-center md:text-left">Latest News</p>
             
             <div className="flex flex-col gap-6 text-sm md:text-base font-['Fredoka'] opacity-80 w-full h-full justify-start">
                <div className="group cursor-pointer">
                  <p className="group-hover:text-[#00FFA3] transition-colors duration-300 font-medium">🚀 Bitcoin hits new all-time high amidst market surge</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
                <div className="w-full h-[1px] bg-white/10"></div>
                <div className="group cursor-pointer">
                  <p className="group-hover:text-[#00FFA3] transition-colors duration-300 font-medium">💎 Vectra launches revolutionary zero-fee staking tier</p>
                  <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>
                <div className="w-full h-[1px] bg-white/10 hidden lg:block"></div>
                <div className="group cursor-pointer hidden lg:block">
                  <p className="group-hover:text-[#00FFA3] transition-colors duration-300 font-medium">📈 Ethereum 2.0 upgrade complete success</p>
                  <p className="text-xs text-gray-400 mt-1">8 hours ago</p>
                </div>
             </div>
          </div>

        </div>

        {/* --- KOLOM KANAN (Most Popular) --- */}
        {/* 4. Most Popular */}
        {/* PERBAIKAN: Menambahkan 'gap-10' juga agar konsisten */}
        <div className={`${glassStyle} lg:col-span-1 h-full delay-400 justify-start !p-3 gap-6 ${
             isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
        }`}>
            {/* HAPUS margin-bottom */}
            <p className="font-['Fredoka'] text-xl text-[#00FFA3] shrink-0">Most Popular</p>
            
            <div className="w-full"> 
              <ul className="w-full flex flex-col gap-6 font-['Audiowide']">
                {coins.map((coin, idx) => (
                  <li key={idx} className="flex justify-between items-center w-full px-4 py-3 rounded-xl hover:bg-white/20 transition-colors cursor-pointer group border border-transparent hover:border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 group-hover:text-white w-4">{idx + 1}</span>
                      <span className="text-lg">{coin.code}</span>
                    </div>
                    <span className={`text-sm ${coin.change.startsWith('+') ? 'text-[#00FFA3]' : 'text-red-400'}`}>
                      {coin.change}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BentoBox;