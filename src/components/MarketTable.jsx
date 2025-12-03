import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/MarketTable.css'; // Pastikan path ini sesuai dengan struktur folder Anda

const MarketTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk Filter & Sort
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('default'); 
  
  // Ref untuk mencegah double-fetch di React Strict Mode
  const hasFetched = useRef(false);
  
  // Hook navigasi pindah halaman
  const navigate = useNavigate();

  useEffect(() => {
    // Mencegah fetch 2x saat development
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchIncremental = async () => {
      setLoading(true);
      setError(null);
      
      // Kita ambil 4 halaman x 250 data = 1000 koin
      const pages = [1, 2, 3, 4]; 
      let allFetchedCoins = [];

      try {
        for (const page of pages) {
          // 1. Fetch data per halaman
          const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`
          );

          // 2. Handle Rate Limit (429)
          if (response.status === 429) {
            throw new Error("API Rate Limit Hit! (Too many requests). Please wait a moment.");
          }
          
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          
          // 3. Update State LANGSUNG agar user melihat data masuk bertahap
          allFetchedCoins = [...allFetchedCoins, ...data];
          setCoins(prevCoins => [...prevCoins, ...data]);

          // 4. Delay 1.5 detik antar request agar API tidak memblokir kita
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

  // === LOGIC FILTER ===
  let filteredData = coins.filter(coin => 
    coin.name.toLowerCase().includes(search.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // === LOGIC SORT ===
  if (sortType === 'gainers') {
    filteredData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  } else if (sortType === 'losers') {
    filteredData.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
  } 
  // Jika 'default', biarkan urutan asli (Market Cap)

  // Helper Format Uang
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  };

  return (
    <div className="table-container">
      
      {/* HEADER SECTION */}
      <div className="filter-header">
        <div className="header-left">
          <h2 className="table-title">Market Data</h2>
          <span className="page-info" style={{fontSize: '0.8rem'}}>
            Loaded: {coins.length} / 1000 Assets
          </span>
        </div>

        <div className="header-right" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* SORT BUTTONS */}
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

          {/* SEARCH INPUT */}
          <input 
            type="text" 
            placeholder="Search coin..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ERROR MESSAGE (Jika ada) */}
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

      {/* TABLE WRAPPER */}
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
                  onClick={() => navigate(`/market/${coin.id}`)} // Fitur Navigasi Klik
                  style={{ cursor: 'pointer' }} // Indikator kursor berubah
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
                  <td>{formatCurrency(coin.current_price)}</td>
                  <td className={`percent-change ${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td>{formatCurrency(coin.market_cap)}</td>
                </tr>
              ))
            ) : (
              // Tampilan saat Loading atau Tidak ada Data
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
      
      {/* FOOTER */}
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