import React from 'react';
import { Navbar } from '../components/navbar.jsx'; // Pastikan path import benar

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#060010] text-white selection:bg-[#00FFA3] selection:text-black">
      
      {/* Background Gradient */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00FFA3]/10 via-[#060010] to-[#060010] -z-10 pointer-events-none"></div>

      {/* Navbar Wrapper */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="navbar-container is-at-top">
          <Navbar />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto pt-40 pb-20 px-4 md:px-8" style={{ marginTop: '120px' }}>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-['Audiowide'] mb-6">
            About <span className="text-[#00FFA3]">Vectra</span>
          </h1>
          <p className="text-gray-400 font-['Fredoka'] text-lg max-w-2xl mx-auto">
            We are building the next generation of decentralized finance tools for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-[#00FFA3]/30 transition-colors">
            <h2 className="text-2xl font-['Audiowide'] text-[#00FFA3] mb-4">Our Mission</h2>
            <p className="font-['Fredoka'] leading-relaxed text-gray-300">
              Vectra aims to simplify crypto trading by providing professional-grade analytics wrapped in a beautiful, accessible interface. We believe financial freedom should be available to everyone, everywhere.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-[#00FFA3]/30 transition-colors">
            <h2 className="text-2xl font-['Audiowide'] text-[#00FFA3] mb-4">Our Vision</h2>
            <p className="font-['Fredoka'] leading-relaxed text-gray-300">
              To become the world's most trusted platform for digital asset tracking and trading, bridging the gap between traditional finance and the decentralized web.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;