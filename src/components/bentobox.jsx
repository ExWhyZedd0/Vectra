import React from 'react';

const BentoBox = ({ isVisible }) => {
  const cardBaseClass = "bg-white/10 backdrop-blur-[10px] border border-white/30 shadow-xl rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center font-['Fredoka'] m-3";

  return (
    <div 
      className={`w-full h-screen flex flex-col items-center justify-between relative z-20 px-32 py-8 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Judul Section */}
      <p 
        className={`w-fit font-['Audiowide'] text-5xl mb-8 font-medium transition-all duration-1000 ${
          isVisible ? 'opacity-100 animate-[slide-in-down_1.5s_ease-in-out_forwards]' : 'opacity-0'
        }`}
      >
        <span className="font-['Fredoka']">Trade with 390 million users on </span> Vectra
      </p>
      
      {/* Kontainer untuk semua kartu bento */}
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div 
              className={`${cardBaseClass} w-[280px] h-[180px] ${
                isVisible ? 'animate-[slide-in-left_1.5s_ease-in-out_forwards]' : 'opacity-0'
              }`}
            >
              <p className='bento-box-title'>24h trading volume</p>
              <p className='bento-box-description'></p>
            </div>
            <div 
              className={`${cardBaseClass} w-[280px] h-[180px] ${
                isVisible ? 'animate-[slide-in-left_1.5s_ease-in-out_0.2s_forwards]' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.2s' }} // Delay untuk animasi stagger
            >
              <p className='bento-box-title'>Market Cap</p>
              <p className='bento-box-description'></p>
            </div>
          </div>
          <div 
            className={`${cardBaseClass} w-[584px] h-[180px] ${
              isVisible ? 'animate-[slide-in-up_1.5s_ease-in-out_0.4s_forwards]' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.4s' }}
          >
            <p className='bento-box-title'>News</p>
            <p className='bento-box-description'></p>
          </div>
        </div>
        <div 
          className={`${cardBaseClass} w-[280px] h-[584px] ${ // Perhatikan tinggi disesuaikan
            isVisible ? 'animate-[slide-in-right_1.5s_ease-in-out_0.2s_forwards]' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          <p className='bento-box-title'>Most Popular</p>
          <p className='bento-box-description'></p>
        </div>
      </div>
    </div>
  );
};

export default BentoBox;