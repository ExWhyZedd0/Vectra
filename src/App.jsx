import React from 'react'
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home.jsx';
import MarketPage from './pages/MarketPage.jsx';

// CSS Utama
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/market" element={<MarketPage />} />
      
      {/* Tambahkan route lain di sini nanti, misal: */}
      {/* <Route path="/news" element={<NewsPage />} /> */}
    </Routes>
  )
}

export default App