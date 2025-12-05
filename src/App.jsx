import React from 'react'
import { Routes, Route } from 'react-router-dom';

// Pages - Pastikan semua file ini ADA di folder src/pages/
import Home from './pages/Home.jsx';
import MarketPage from './pages/MarketPage.jsx';
import CoinDetail from './pages/CoinDetail.jsx';
import AboutUs from './pages/AboutUs.jsx';
import News from './pages/News.jsx';
import FAQ from './pages/FAQ.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Portfolio from './pages/Portfolio.jsx';

// CSS Utama
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/market" element={<MarketPage />} />
      <Route path="/market/:id" element={<CoinDetail />} />
      <Route path="/news" element={<News />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/portfolio" element={<Portfolio />} />
    </Routes>
  )
}

export default App