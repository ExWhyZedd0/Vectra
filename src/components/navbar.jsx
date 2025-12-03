import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../CSS/navbar.css'; // Pastikan path CSS sesuai struktur folder Anda

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fungsi untuk menutup menu saat link diklik (penting untuk mobile)
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay Gelap saat Sidebar Mobile Terbuka */}
      <div 
        className={`nav-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeMenu}
      ></div>

      <nav className="navbar">
        {/* LOGO: Berfungsi sebagai tombol Home */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Vectra<span>.</span>
        </Link>

        {/* Tombol Hamburger (Mobile) */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? (
            /* Icon X (Close) */
            <svg className="menu-icon" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          ) : (
            /* Icon Garis 3 (Hamburger) */
            <svg className="menu-icon" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          )}
        </button>

        {/* DAFTAR MENU */}
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {/* Note: Opsi "Home" telah dihapus sesuai permintaan */}

          <li>
            <NavLink 
              to="/market" 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              onClick={closeMenu}
            >
              Market
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/news" 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              onClick={closeMenu}
            >
              News
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/faq" 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              onClick={closeMenu}
            >
              FAQ
            </NavLink>
          </li>


           <li>
            <NavLink 
              to="/about-us" 
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              onClick={closeMenu}
            >
              About Us
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};