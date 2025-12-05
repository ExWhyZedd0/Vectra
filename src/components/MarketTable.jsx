import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BuyAssetModal from './BuyAssetModal'; // Menggunakan nama baru
import SellAssetModal from './SellAssetModal';
import '../CSS/MarketTable.css';

const MarketTable = () => {
  // --- STATE DATA MARKET ---
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- STATE FILTER & SORT ---
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('default');
  
  // --- STATE USER & PORTFOLIO ---
  const [user, setUser] = useState(null);
  const [holdingsMap, setHoldingsMap] = useState({}); // { 'bitcoin': { amount: 0.5, db_id: 123 } }

  // --- STATE MODALS ---
  const [selectedCoin, setSelectedCoin] = useState(null); // Data untuk Modal Beli
  const [selectedSellAsset, setSelectedSellAsset] = useState(null); // Data untuk Modal Jual
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  // 1. FUNGSI FETCH HOLDINGS (Supabase)
  // Dipanggil saat awal load DAN setelah transaksi berhasil
  const fetchUserHoldings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', session.user.id);

      if (!error && data) {
        // Mapping data agar mudah dicek: holdingsMap['bitcoin']
        const map = {};
        data.forEach(item => {
          map[item.coin_id] = { 
            amount: item.amount, 
            db_id: item.id 
          };
        });
        setHoldingsMap(map);
      }
    }
  };

  useEffect(() => {
    fetchUserHoldings();
  }, []);

  // 2. FUNGSI FETCH MARKET DATA (CoinGecko)
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`
        );
        
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // 3. LOGIKA FILTER & SORTING
  let filteredData = coins.filter(coin => 
    coin.name.toLowerCase().includes(search.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (sortType === 'gainers') {
    filteredData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  } else if (sortType === 'losers') {
    filteredData.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
  } 

  // Formatter Harga
  const formatCurrency = (number) => {
    if (!number) return "$0.00";
    if (number < 1) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 8 }).format(number);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
  };

  // --- HANDLERS ---

  const handleBuyClick = (e, coin) => {
    e.stopPropagation(); // Mencegah pindah halaman
    if (!user) {
      alert("Please login to start trading.");
      return;
    }
    setSelectedCoin(coin);
    setIsBuyModalOpen(true);
  };

  const handleSellClick = (e, coin) => {
    e.stopPropagation();
    
    // Ambil info holding user untuk koin ini
    const holdingData = holdingsMap[coin.id];
    if (!holdingData) return;

    // Gabungkan data Market + Data Database
    const assetToSell = {
      ...coin, // name, image, price
      amount: holdingData.amount, // jumlah yang dimiliki
      db_id: holdingData.db_id // ID row database untuk dihapus/update
    };

    setSelectedSellAsset(assetToSell);
    setIsSellModalOpen(true);
  };

  // Callback sukses -> Refresh data holding agar tombol Sell muncul/hilang/update
  const onTransactionSuccess = () => {
    fetchUserHoldings();
  };

  return (
    <div className="table-container">
      
      {/* HEADER & FILTER */}
      <div className="filter-header">
        <div className="header-left">
           <h2 className="table-title">Market Data</h2>
           <span className="page-info" style={{fontSize: '0.8rem', color: '#00FFA3'}}>
             Showing Top {coins.length} Assets
           </span>
        </div>
        <div className="header-right" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="filter-group">
            <button className={`filter-btn ${sortType === 'default' ? 'active' : ''}`} onClick={() => setSortType('default')}>Market Cap</button>
            <button className={`filter-btn ${sortType === 'gainers' ? 'active' : ''}`} onClick={() => setSortType('gainers')}>🔥 Gainers</button>
            <button className={`filter-btn ${sortType === 'losers' ? 'active' : ''}`} onClick={() => setSortType('losers')}>❄️ Losers</button>
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

      {error && <div style={{color:'red', textAlign:'center', padding:'1rem'}}>{error}</div>}

      {/* TABEL MARKET */}
      <div className="table-scroll-wrapper">
        <table className="market-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Market Cap</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((coin, index) => {
                // Cek Kepemilikan
                const isOwned = holdingsMap[coin.id] !== undefined;
                const ownedAmount = isOwned ? holdingsMap[coin.id].amount : 0;

                return (
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
                          {/* Label "Owned" jika punya */}
                          {isOwned && (
                            <span style={{
                              fontSize:'0.65rem', 
                              color:'#00FFA3', 
                              background:'rgba(0,255,163,0.1)', 
                              padding:'2px 5px', 
                              borderRadius:'4px',
                              marginLeft:'5px'
                            }}>
                              Owned: {ownedAmount}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{formatCurrency(coin.current_price)}</td>
                    <td className={`percent-change ${coin.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`}>
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td>{formatCurrency(coin.market_cap)}</td>
                    
                    {/* ACTION BUTTONS */}
                    <td>
                      <div style={{display:'flex', gap:'8px'}}>
                        {/* Tombol BUY */}
                        <button 
                          className="btn-action btn-buy"
                          onClick={(e) => handleBuyClick(e, coin)}
                          title="Buy Asset"
                        >
                          + Buy
                        </button>

                        {/* Tombol SELL (Hanya muncul jika punya) */}
                        {isOwned && (
                          <button 
                            className="btn-action btn-sell"
                            onClick={(e) => handleSellClick(e, coin)}
                            title="Sell Asset"
                          >
                            - Sell
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                  {loading ? "Loading Market Data..." : "No coins found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* MODAL BUY */}
      {selectedCoin && (
        <BuyAssetModal 
            isOpen={isBuyModalOpen}
            onClose={() => { setIsBuyModalOpen(false); onTransactionSuccess(); }} 
            coinId={selectedCoin.id}
            coinSymbol={selectedCoin.symbol}
            currentPrice={selectedCoin.current_price}
            image={selectedCoin.image}
            onSuccess={onTransactionSuccess}
        />
      )}

      {/* MODAL SELL */}
      {selectedSellAsset && (
        <SellAssetModal 
            isOpen={isSellModalOpen} 
            onClose={() => { setIsSellModalOpen(false); onTransactionSuccess(); }} 
            asset={selectedSellAsset}
            onSuccess={onTransactionSuccess}
        />
      )}

    </div>
  );
};

export default MarketTable;