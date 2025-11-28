import React from 'react';
import { Navbar } from '../components/navbar';

const News = () => {
  return (
    <div className="min-h-screen bg-[#060010] text-white selection:bg-[#00FFA3] selection:text-black">
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-['Audiowide'] mb-6">
          Latest <span className="text-[#00FFA3]">News</span>
        </h1>
        <p className="text-gray-400 font-['Fredoka']">Stay updated with the latest trends in crypto.</p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left hover:border-[#00FFA3]/50 transition-colors cursor-pointer">
              <div className="h-40 bg-white/10 rounded-xl mb-4 w-full animate-pulse"></div>
              <h3 className="font-['Audiowide'] text-xl mb-2">Crypto Market Update #{item}</h3>
              <p className="font-['Fredoka'] text-sm text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;