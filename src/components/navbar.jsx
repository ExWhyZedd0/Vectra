import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../CSS/navbar.css'; // Import CSS yang baru dibuat

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Untuk cek halaman aktif

  // Fungsi toggle buka/tutup
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fungsi tutup menu saat link diklik
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Daftar Link agar kodenya bersih
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Market', path: '/market' },
    { name: 'News', path: '/news' },
    { name: 'F.A.Q', path: '/faq' },
    { name: 'About Us', path: '/about-us' },
  ];

  return (
    <>
      {/* Overlay Gelap (Klik di luar sidebar untuk menutup) */}
      <div 
        className={`nav-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeMenu}
      ></div>

      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Vectra<span>.</span>
        </Link>

        {/* Tombol Hamburger / Close */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? (
            // Icon X (Close) SVG
            <svg className="menu-icon" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
            // Icon Hamburger (Garis 3) SVG
            <svg className="menu-icon" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          )}
        </button>

        {/* Links (Desktop: Horizontal, Mobile: Sidebar) */}
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
              onClick={closeMenu} // Tutup sidebar saat link diklik
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};