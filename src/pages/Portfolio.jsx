import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import DarkVeil from '../components/darkveil';
import { supabase } from '../supabaseClient';
import SellAssetModal from '../components/SellAssetModal'; // Import Modal Sell
import '../CSS/Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // State Data
  const [dbHoldings, setDbHoldings] = useState([]); 
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modal Sell
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- 1. INIT ---
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      fetchPortfolio(session.user.id);
    };
    init();

    const container = containerRef.current;
    if (container) {
      const handleScroll = () => {
        setScrollProgress(container.scrollTop / (container.scrollHeight - container.clientHeight) || 0);
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [navigate]);

  // --- 2. FETCH DB ---
  const fetchPortfolio = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('portfolio').select('*').eq('user_id', userId);
      if (error) throw error;
      setDbHoldings(data || []);
    } catch (err) {
      console.error("Database Error:", err);
    } 
  };

  // --- 3. FETCH PRICE ---
  useEffect(() => {
    const fetchLivePrices = async () => {
      if (dbHoldings.length === 0) {
        setPortfolioData([]);
        setLoading(false);
        return;
      }
      try {
        const uniqueIds = [...new Set(dbHoldings.map(item => item.coin_id))];
        const idsString = uniqueIds.join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsString}&order=market_cap_desc&sparkline=false`);
        
        let liveData = [];
        if (response.ok) {
            const json = await response.json();
            if (Array.isArray(json)) liveData = json;
        }

        const mergedData = dbHoldings.map(dbItem => {
          const apiItem = liveData.find(api => api.id === dbItem.coin_id);
          const fallbackItem = { id: dbItem.coin_id, name: dbItem.coin_id, symbol: '---', image: 'https://via.placeholder.com/40?text=?', current_price: 0, price_change_percentage_24h: 0, totalValue: 0 };
          const finalItem = apiItem || fallbackItem;

          return {
            ...finalItem,
            db_id: dbItem.id, // ID Database untuk update/delete
            amount: dbItem.amount,
            totalValue: dbItem.amount * (finalItem.current_price || 0)
          };
        });
        setPortfolioData(mergedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLivePrices();
  }, [dbHoldings]);

  // --- HANDLER TOMBOL SELL ---
  const handleSellClick = (e, asset) => {
    e.stopPropagation(); // Mencegah pindah halaman saat klik tombol
    setSelectedAsset(asset);
    setIsSellModalOpen(true);
  };

  // --- FORMATTERS ---
  const totalBalance = portfolioData.reduce((acc, curr) => acc + curr.totalValue, 0);
  const formatUSD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  const formatAmount = (num) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 8 }).format(num);

  return (
    <div className="portfolio-container" ref={containerRef}>
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}>
        <DarkVeil scrollProgress={scrollProgress} hueShift={0} />
      </div>

      <div style={{position: 'fixed', top: 0, width: '100%', zIndex: 50}}>
         <div className="navbar-container is-at-top"><Navbar /></div>
      </div>

      <div className="portfolio-content">
        
        {/* BALANCE */}
        <div className="balance-card">
          <div className="balance-label">Total Portfolio Value</div>
          <h1 className="balance-amount">{formatUSD(totalBalance)}</h1>
        </div>

        {/* EMPTY STATE */}
        {portfolioData.length === 0 && !loading && (
            <div style={{textAlign:'center', marginBottom:'20px', color:'#9ca3af', fontSize:'0.9rem'}}>
                Go to <span style={{color:'#00FFA3', cursor:'pointer', fontWeight:'bold'}} onClick={()=>navigate('/market')}>Market</span> to buy assets.
            </div>
        )}

        {/* TABLE */}
        <div className="holdings-wrapper">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price</th>
                <th>Balance</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="5" style={{textAlign:'center', padding:'30px'}}>Loading Assets...</td></tr>
              ) : portfolioData.length === 0 ? (
                 <tr><td colSpan="5" style={{textAlign:'center', padding:'30px', color:'#9ca3af'}}>Your portfolio is empty.</td></tr>
              ) : (
                portfolioData.map((asset) => (
                  <tr key={asset.db_id} onClick={() => navigate(`/market/${asset.id}`)} style={{cursor:'pointer'}}>
                    <td>
                      <div className="asset-info">
                        <img src={asset.image} onError={(e)=>{e.target.onerror=null; e.target.src="https://via.placeholder.com/40"}} alt={asset.name} className="asset-icon" />
                        <div>
                          <span className="asset-name">{asset.name}</span>
                          <span className="asset-symbol">{asset.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-val">{formatUSD(asset.current_price)}</div>
                      <div style={{color: asset.price_change_percentage_24h >= 0 ? '#00FFA3' : '#ef4444', fontSize:'0.85rem'}}>
                        {asset.price_change_percentage_24h?.toFixed(2)}%
                      </div>
                    </td>
                    <td>
                      <div className="text-val">{formatAmount(asset.amount)} <span style={{fontSize:'0.8rem', color:'#9ca3af'}}>{asset.symbol?.toUpperCase()}</span></div>
                    </td>
                    <td>
                      <div className="text-val">{formatUSD(asset.totalValue)}</div>
                    </td>
                    <td>
                      {/* TOMBOL SELL MENGGANTIKAN DELETE */}
                      <button 
                        className="btn-sell-action" 
                        onClick={(e) => handleSellClick(e, asset)}
                      >
                        - Sell
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL SELL */}
      <SellAssetModal 
        isOpen={isSellModalOpen} 
        onClose={() => setIsSellModalOpen(false)} 
        asset={selectedAsset}
        onSuccess={() => fetchPortfolio(user.id)} // Refresh setelah jual
      />
    </div>
  );
};

export default Portfolio;