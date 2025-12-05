import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase
import '../CSS/navbar.css';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // State User
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Cek status login saat komponen dimuat
  useEffect(() => {
    // 1. Cek sesi saat ini
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // 2. Pasang Listener (Real-time update jika login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fungsi Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeMenu();
    navigate('/'); // Kembali ke home setelah logout
  };

  return (
    <>
      <div className={`nav-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu}></div>

      <nav className="navbar">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Vectra<span>.</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? (
            <svg className="menu-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
          ) : (
            <svg className="menu-icon" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
          )}
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          
          <ul className="nav-menu-list">
            <li><NavLink to="/market" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>Market</NavLink></li>
            
            {/* MENU BARU: PORTFOLIO (Hanya muncul jika user Login) */}
            {user && (
              <li>
                <NavLink to="/portfolio" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>
                  Portfolio
                </NavLink>
              </li>
            )}
            
            <li><NavLink to="/news" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>News</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>About</NavLink></li>
            <li><NavLink to="/faq" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={closeMenu}>FAQ</NavLink></li>
          </ul>

          <div className="nav-auth-group">
            {/* LOGIKA KONDISIONAL: Jika User ada, tampilkan Logout. Jika tidak, tampilkan Login/Register */}
            {user ? (
              <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <span style={{color: '#9ca3af', fontSize:'0.9rem', fontFamily:'Fredoka'}}>
                  Hi, {user.user_metadata.full_name || 'Trader'}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="nav-item" 
                  style={{background:'transparent', border:'none', cursor:'pointer'}}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-item" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="btn-register" onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};