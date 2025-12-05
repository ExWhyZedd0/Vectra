import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import DarkVeil from '../components/darkveil';
import { supabase } from '../supabaseClient';
import '../CSS/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  
  // State Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Panggil API Sign Up Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName, // Simpan nama di metadata
          },
        },
      });

      if (error) throw error;

      // 2. Sukses
      alert("Registration Successful! Please Login.");
      navigate('/login');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}>
        <DarkVeil scrollProgress={0} hueShift={0} />
      </div>

      <div style={{position: 'fixed', top: 0, width: '100%', zIndex: 50}}>
         <div className="navbar-container is-at-top"><Navbar /></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the Vectra community today</p>
        </div>

        {/* Pesan Error */}
        {error && <div style={{color: '#ef4444', textAlign: 'center', fontSize: '0.9rem', background: 'rgba(239,68,68,0.1)', padding:'8px', borderRadius:'8px'}}>{error}</div>}

        <form onSubmit={handleRegister} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;