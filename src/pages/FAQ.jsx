import React from 'react';
import { Navbar } from '../components/navbar';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-[#060010] text-white selection:bg-[#00FFA3] selection:text-black">
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto pt-32 pb-20 px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-['Audiowide'] mb-12 text-center">
          F.A.Q
        </h1>
        
        <div className="flex flex-col gap-4">
          {['What is Vectra?', 'How to trade?', 'Is my wallet secure?'].map((q, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="font-['Audiowide'] text-lg text-[#00FFA3] mb-2">{q}</h3>
              <p className="font-['Fredoka'] text-gray-300">This is a placeholder answer for the question above.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;