import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import DarkVeil from '../components/darkveil';
import { supabase } from '../supabaseClient'; // Import Client
import '../CSS/Auth.css';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Panggil API Login Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // 2. Sukses -> Arahkan ke Market
      navigate('/market');

    } catch (err) {
      setError("Login failed: " + err.message);
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to access your portfolio</p>
        </div>

        {error && <div style={{color: '#ef4444', textAlign: 'center', fontSize: '0.9rem', background: 'rgba(239,68,68,0.1)', padding:'8px', borderRadius:'8px'}}>{error}</div>}

        <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'20px'}}>
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;