import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { Navbar } from '../components/navbar';
import DarkVeil from '../components/darkveil';
import { supabase } from '../supabaseClient';
import BuyAssetModal from '../components/BuyAssetModal'; // Modal Beli Baru
import SellAssetModal from '../components/SellAssetModal'; // Modal Jual
import '../CSS/CoinDetail.css';

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- STATE UTAMA ---
  const [coin, setCoin] = useState(null); // Data Koin (Metadata, Harga)
  const [ohlc, setOhlc] = useState([]);   // Data Chart
  const [holding, setHolding] = useState(null); // Data Kepemilikan User
  const [user, setUser] = useState(null);

  // --- STATE UI & LOADING ---
  const [loadingCoin, setLoadingCoin] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [timeFrame, setTimeFrame] = useState('14'); // Default 14 Hari
  const [error, setError] = useState(null);

  // --- STATE MODALS ---
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // ---------------------------------------------------------
  // 1. FETCH HOLDING (Cek apakah user punya aset ini?)
  // ---------------------------------------------------------
  const fetchUserHolding = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('coin_id', id)
        .maybeSingle(); // Ambil satu baris saja (atau null jika tidak punya)

      if (!error) {
        setHolding(data); 
      }
    }
  };

  useEffect(() => {
    fetchUserHolding();
  }, [id]);

  // Callback untuk refresh data setelah transaksi berhasil
  const onTransactionSuccess = () => {
    fetchUserHolding();
  };

  // ---------------------------------------------------------
  // 2. FETCH KOIN DETAIL (CoinGecko)
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchCoinData = async () => {
      setLoadingCoin(true);
      setError(null);
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        
        if (res.status === 429) throw new Error("Rate Limit Hit. Mohon tunggu sebentar.");
        if (res.status === 404) throw new Error("Coin not found.");
        if (!res.ok) throw new Error("Gagal mengambil data.");

        const data = await res.json();
        setCoin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCoin(false);
      }
    };
    fetchCoinData();
  }, [id]);

  // ---------------------------------------------------------
  // 3. FETCH CHART OHLC (CoinGecko)
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        // Timeframes supported: 1, 7, 14, 30, 90, 180, 365, max
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${timeFrame}`);
        
        if (res.ok) {
          const data = await res.json();
          // Format ApexCharts: [timestamp, [Open, High, Low, Close]]
          const formattedSeries = data.map(item => ({
            x: new Date(item[0]),
            y: [item[1], item[2], item[3], item[4]]
          }));
          setOhlc([{ data: formattedSeries }]);
        }
      } catch (err) {
        console.error("Chart Error:", err);
      } finally {
        setLoadingChart(false);
      }
    };
    fetchChartData();
  }, [id, timeFrame]);

  // ---------------------------------------------------------
  // HELPERS & CONFIG
  // ---------------------------------------------------------
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  
  const timeFrames = [
    { label: '24H', value: '1' },
    { label: '7D', value: '7' },
    { label: '14D', value: '14' },
    { label: '30D', value: '30' },
    { label: '3M', value: '90' },
    { label: '1Y', value: '365' },
  ];

  const chartOptions = {
    chart: { type: 'candlestick', background: 'transparent', toolbar: { show: false }, animations: { enabled: false } },
    theme: { mode: 'dark' },
    xaxis: { type: 'datetime', labels: { style: { colors: '#9ca3af', fontFamily: 'Fredoka' } }, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
    yaxis: { tooltip: { enabled: true }, opposite: true, labels: { style: { colors: '#9ca3af', fontFamily: 'Fredoka' }, formatter: (value) => value < 1 ? value.toFixed(6) : (value > 1000 ? (value/1000).toFixed(1) + 'k' : value.toFixed(2)) } },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)', strokeDashArray: 4 },
    plotOptions: { candlestick: { colors: { upward: '#00FFA3', downward: '#ef4444' }, wick: { useFillColor: true } } },
    tooltip: { theme: 'dark', x: { format: 'dd MMM HH:mm' } }
  };

  // Data Wrapper untuk Modal Sell
  const assetForSell = holding && coin ? {
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image?.large,
    current_price: coin.market_data?.current_price?.usd,
    amount: holding.amount,
    db_id: holding.id
  } : null;

  // ---------------------------------------------------------
  // RENDER UI
  // ---------------------------------------------------------
  if (loadingCoin) return (
    <div className="detail-container">
       <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}><DarkVeil hueShift={0} /></div>
      <div style={{paddingTop: '150px', textAlign:'center', fontFamily:'Audiowide', color:'white'}}>Loading Asset...</div>
    </div>
  );

  if (error) return (
    <div className="detail-container">
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}><DarkVeil hueShift={0} /></div>
      <div style={{paddingTop: '150px', textAlign:'center', color:'#ef4444'}}>
        <h3>⚠️ {error}</h3>
        <button onClick={() => navigate('/market')} className="back-button" style={{marginTop:'20px'}}>Back to Market</button>
      </div>
    </div>
  );

  return (
    <div className="detail-container">
      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}>
        <DarkVeil scrollProgress={0} hueShift={0} />
      </div>

      <div style={{position: 'fixed', top: 0, width: '100%', zIndex: 50}}>
         <div className="navbar-container is-at-top"><Navbar /></div>
      </div>

      <div className="detail-content">
        <button onClick={() => navigate('/market')} className="back-button">&larr; Back to Market</button>

        {/* --- HEADER SECTION --- */}
        <div className="coin-header">
          <div className="coin-title-group">
            <img src={coin.image.large} alt={coin.name} className="detail-coin-icon" />
            <div>
              <h1 className="detail-coin-name">
                {coin.name} <span className="detail-coin-rank">#{coin.market_cap_rank}</span>
              </h1>
              <span style={{color:'#9ca3af', textTransform:'uppercase'}}>{coin.symbol}</span>
              
              {/* Indikator Punya Aset */}
              {holding && (
                <div style={{marginTop:'8px', color:'#00FFA3', fontSize:'0.85rem', fontFamily:'Fredoka', background:'rgba(0,255,163,0.1)', padding:'4px 10px', borderRadius:'6px', width:'fit-content', border:'1px solid rgba(0,255,163,0.2)'}}>
                  Owned: {holding.amount} {coin.symbol.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="coin-price-group" style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'15px'}}>
            <div style={{textAlign:'right'}}>
                <h2 className="detail-price">
                  {coin.market_data?.current_price?.usd ? formatCurrency(coin.market_data.current_price.usd) : "N/A"}
                </h2>
                <div className={`detail-change ${coin.market_data.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`} style={{color: coin.market_data.price_change_percentage_24h > 0 ? '#00FFA3' : '#ef4444'}}>
                  {coin.market_data.price_change_percentage_24h?.toFixed(2)}% (24h)
                </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div style={{display:'flex', gap:'10px'}}>
                
                {/* Tombol BUY (Selalu Muncul) */}
                <button 
                    onClick={() => setIsBuyModalOpen(true)}
                    style={{
                        background: '#00FFA3', color: 'black', border: 'none',
                        padding: '12px 24px', borderRadius: '12px', 
                        fontFamily: 'Audiowide', fontSize: '1rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 0 20px rgba(0, 255, 163, 0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span>+</span> Buy
                </button>

                {/* Tombol SELL (Hanya Muncul Jika Punya) */}
                {holding && (
                    <button 
                        onClick={() => setIsSellModalOpen(true)}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444',
                            padding: '12px 24px', borderRadius: '12px', 
                            fontFamily: 'Audiowide', fontSize: '1rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ef4444';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <span>-</span> Sell
                    </button>
                )}
            </div>
          </div>
        </div>

        {/* --- GRID CONTENT --- */}
        <div className="detail-grid">
          
          {/* CHART */}
          <div className="chart-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px'}}>
              <h3 style={{fontFamily:'Audiowide', margin:0}}>Price Action</h3>
              <div style={{display:'flex', gap:'5px', background:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'8px'}}>
                {timeFrames.map((tf) => (
                  <button key={tf.value} onClick={() => setTimeFrame(tf.value)} style={{background: timeFrame === tf.value ? '#00FFA3' : 'transparent', color: timeFrame === tf.value ? '#000' : '#9ca3af', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Fredoka', fontWeight: 'bold', transition: 'all 0.3s'}}>
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{width:'100%', height:'400px', position:'relative'}}>
               {loadingChart && <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#00FFA3', fontFamily:'Audiowide'}}>Updating Chart...</div>}
               {!loadingChart && ohlc.length === 0 && <div className="chart-placeholder">Chart Data Unavailable</div>}
               {ohlc.length > 0 && <Chart options={chartOptions} series={ohlc} type="candlestick" height="100%" width="100%"/>}
            </div>
          </div>

          {/* STATS */}
          <div className="stats-card">
            <h3 style={{fontFamily:'Audiowide', marginBottom:'10px'}}>Market Stats</h3>
            <StatRow label="Market Cap" value={formatCurrency(coin.market_data.market_cap.usd)} />
            <StatRow label="Trading Vol (24h)" value={formatCurrency(coin.market_data.total_volume.usd)} />
            <StatRow label="24h High" value={formatCurrency(coin.market_data.high_24h.usd)} />
            <StatRow label="24h Low" value={formatCurrency(coin.market_data.low_24h.usd)} />
            <StatRow label="Circulating Supply" value={coin.market_data.circulating_supply?.toLocaleString()} />
          </div>

          {/* DESCRIPTION */}
          <div className="desc-card">
            <h3 style={{fontFamily:'Audiowide', marginBottom:'15px'}}>About {coin.name}</h3>
            <div className="desc-text" dangerouslySetInnerHTML={{ __html: coin.description.en || "No description available." }} />
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      <BuyAssetModal 
        isOpen={isBuyModalOpen}
        onClose={() => { setIsBuyModalOpen(false); onTransactionSuccess(); }} 
        coinId={coin.id}
        coinSymbol={coin.symbol}
        currentPrice={coin.market_data?.current_price?.usd}
        image={coin.image?.large}
        onSuccess={onTransactionSuccess}
      />

      <SellAssetModal 
        isOpen={isSellModalOpen} 
        onClose={() => { setIsSellModalOpen(false); onTransactionSuccess(); }} 
        asset={assetForSell}
        onSuccess={onTransactionSuccess}
      />
    </div>
  );
};

// Helper Component Stat Row
const StatRow = ({label, value}) => (
  <div className="stat-row">
    <span className="stat-label">{label}</span>
    <span className="stat-val">{value || "N/A"}</span>
  </div>
);

export default CoinDetail;