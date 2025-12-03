import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/MarketTable.css';

const MarketTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('default'); 
  
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchIncremental = async () => {
      setLoading(true);
      setError(null);
      
      const pages = [1, 2, 3, 4]; 
      let allFetchedCoins = [];

      try {
        for (const page of pages) {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`
          );

          if (response.status === 429) {
            throw new Error("API Rate Limit Hit! Please wait a moment.");
          }
          
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          allFetchedCoins = [...allFetchedCoins, ...data];
          setCoins(prevCoins => [...prevCoins, ...data]);

          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncremental();
  }, []);

  let filteredData = coins.filter(coin => 
    coin.name.toLowerCase().includes(search.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (sortType === 'gainers') {
    filteredData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  } else if (sortType === 'losers') {
    filteredData.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
  } 

  const formatCurrency = (number) => {
    if (!number) return "$0.00";
    
    // Jika harga sangat kecil (di bawah 1 dollar), tampilkan hingga 8 desimal
    if (number < 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      }).format(number);
    }
    
    // Jika harga normal, cukup 2 desimal standar
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  };

  return (
    <div className="table-container">
      
      <div className="filter-header">
        <div className="header-left">
          <h2 className="table-title">Market Data</h2>
          <span className="page-info" style={{fontSize: '0.8rem'}}>
            Loaded: {coins.length} / 1000 Assets
          </span>
        </div>

        <div className="header-right" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="filter-group">
            <button 
              className={`filter-btn ${sortType === 'default' ? 'active' : ''}`} 
              onClick={() => setSortType('default')}
            >
              Market Cap
            </button>
            <button 
              className={`filter-btn ${sortType === 'gainers' ? 'active' : ''}`} 
              onClick={() => setSortType('gainers')}
            >
              🔥 Top Gainers
            </button>
            <button 
              className={`filter-btn ${sortType === 'losers' ? 'active' : ''}`} 
              onClick={() => setSortType('losers')}
            >
              ❄️ Top Losers
            </button>
          </div>

          <input 
            type="text" 
            placeholder="Search coin..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.2)', 
          border: '1px solid #ef4444', 
          color: '#fca5a5', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          ⚠️ {error} <br/>
          <small>Showing data loaded before error occurred.</small>
        </div>
      )}

      <div className="table-scroll-wrapper">
        <table className="market-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((coin, index) => (
                <tr 
                  key={`${coin.id}-${index}`}
                  onClick={() => navigate(`/market/${coin.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ color: '#9ca3af' }}>{coin.market_cap_rank}</td>
                  <td>
                    <div className="coin-info">
                      <img src={coin.image} alt={coin.name} className="coin-image" loading="lazy" />
                      <div>
                        <span className="coin-name">{coin.name}</span>
                        <span className="coin-symbol">{coin.symbol}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Styling khusus font Audiowide dihapus agar sama dengan Market Cap (Fredoka) */}
                  <td>
                    {formatCurrency(coin.current_price)}
                  </td>
                  
                  <td className={`percent-change ${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td>{formatCurrency(coin.market_cap)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  {loading ? (
                    <div className="loading-message">
                      Fetching Assets... ({coins.length}/1000 loaded)
                    </div>
                  ) : (
                    "No coins found matching your search."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{textAlign: 'center', marginTop: '1rem', color: '#555', fontSize: '0.8rem', paddingBottom: '2rem'}}>
        {loading 
          ? "Loading data from CoinGecko..." 
          : `Showing ${filteredData.length} assets.`
        }
      </div>

    </div>
  );
};

export default MarketTable;