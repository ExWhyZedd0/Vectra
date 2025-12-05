import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import DarkVeil from '../components/darkveil';
import { supabase } from '../supabaseClient';
import '../CSS/Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // DATA DUMMY (Nanti kita ganti dengan data dari Database Supabase)
  // Bayangkan user memiliki 0.5 BTC, 10 ETH, dan 5000 XRP.
  const [holdings, setHoldings] = useState([
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', amount: 0.45, price: 96500, change24h: 2.5 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', amount: 12.5, price: 3500, change24h: -1.2 },
    { id: 'solana', symbol: 'sol', name: 'Solana', amount: 150, price: 145, change24h: 5.4 },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', amount: 5000, price: 0.62, change24h: 0.8 },
  ]);

  // Cek Login (Proteksi Halaman)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Jika belum login, tendang ke halaman login
        navigate('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  // Hitung Total Balance
  const totalBalance = holdings.reduce((acc, asset) => acc + (asset.amount * asset.price), 0);
  
  // Format Uang
  const formatUSD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  if (loading) return null; // Atau tampilkan spinner

  return (
    <div className="portfolio-container">
      {/* Background DarkVeil Hitam */}
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}>
        <DarkVeil hueShift={0} />
      </div>

      <div style={{position: 'fixed', top: 0, width: '100%', zIndex: 50}}>
         <div className="navbar-container is-at-top"><Navbar /></div>
      </div>

      <div className="portfolio-content">
        
        {/* HEADER: TOTAL BALANCE */}
        <div className="balance-card">
          <div className="balance-label">Total Portfolio Value</div>
          <h1 className="balance-amount">{formatUSD(totalBalance)}</h1>
          <div className="balance-change positive">
            + $1,240.50 (24h) {/* Dummy Data */}
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="portfolio-actions">
          <button className="btn-add-asset" onClick={() => alert("Fitur Database belum aktif. Nanti kita sambungkan ke Supabase!")}>
            <span>+</span> Add New Asset
          </button>
        </div>

        {/* TABEL HOLDINGS */}
        <div className="holdings-wrapper">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price</th>
                <th>Balance</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((asset) => {
                const totalValue = asset.amount * asset.price;
                return (
                  <tr key={asset.id}>
                    <td>
                      <div className="asset-info">
                        <img 
                          src={`https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`} 
                          alt={asset.name} 
                          className="asset-icon"
                          onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/40"}}
                        />
                        <div>
                          <span className="asset-name">{asset.name}</span>
                          <span className="asset-symbol">{asset.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-val">{formatUSD(asset.price)}</div>
                      <div className={`text-sub ${asset.change24h >= 0 ? 'text-green' : 'text-red'}`} style={{color: asset.change24h >= 0 ? '#00FFA3' : '#ef4444'}}>
                        {asset.change24h}%
                      </div>
                    </td>
                    <td>
                      <div className="text-val">{asset.amount} {asset.symbol.toUpperCase()}</div>
                    </td>
                    <td>
                      <div className="text-val">{formatUSD(totalValue)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Portfolio;