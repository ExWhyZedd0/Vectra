import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { Navbar } from '../components/navbar';
import '../CSS/CoinDetail.css';

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data Koin (Metadata, Harga)
  const [coin, setCoin] = useState(null);
  const [loadingCoin, setLoadingCoin] = useState(true);
  
  // Data Chart
  const [ohlc, setOhlc] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [timeFrame, setTimeFrame] = useState(14); // Default 14 Hari
  
  const [error, setError] = useState(null);

  // FETCH 1: Detail Koin (Hanya dijalankan sekali saat mount)
  useEffect(() => {
    const fetchCoinData = async () => {
      setLoadingCoin(true);
      setError(null);
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        
        if (res.status === 429) throw new Error("Rate Limit Hit. Tunggu sebentar.");
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

  // FETCH 2: Data Chart (Dijalankan saat ID atau TimeFrame berubah)
  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        // days: 1, 7, 14, 30, 90, 180, 365, max
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${timeFrame}`);
        
        if (res.ok) {
          const data = await res.json();
          // Format Data ApexCharts: [timestamp, [Open, High, Low, Close]]
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
  }, [id, timeFrame]); // Dependency: timeFrame (agar re-fetch saat tombol diklik)


  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // --- Opsi Time Frame ---
  const timeFrames = [
    { label: '24H', value: '1' },
    { label: '7D', value: '7' },
    { label: '14D', value: '14' },
    { label: '30D', value: '30' },
    { label: '3M', value: '90' }, // 3 Bulan
    { label: '1Y', value: '365' }, // 1 Tahun
  ];

  // --- Konfigurasi Chart ---
  const chartOptions = {
    chart: {
      type: 'candlestick',
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: false } // Matikan animasi saat ganti timeframe agar cepat
    },
    theme: { mode: 'dark' },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#9ca3af', fontFamily: 'Fredoka' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      tooltip: { enabled: true },
      opposite: true, // Pindahkan harga ke kanan agar lebih rapi
      labels: { 
        style: { colors: '#9ca3af', fontFamily: 'Fredoka' },
        formatter: (value) => {
            if(value < 1) return value.toFixed(6);
            if(value > 1000) return (value/1000).toFixed(1) + 'k';
            return value.toFixed(2);
        }
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 4,
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#00FFA3',
          downward: '#ef4444'
        },
        wick: { useFillColor: true }
      }
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM HH:mm' }
    }
  };

  // --- Render Loading / Error ---
  if (loadingCoin) return (
    <div className="detail-container">
      <div className="detail-bg-accent"></div>
      <div style={{paddingTop: '150px', textAlign:'center', fontFamily:'Audiowide'}}>Loading Asset...</div>
    </div>
  );

  if (error) return (
    <div className="detail-container">
      <div className="detail-bg-accent"></div>
      <div style={{paddingTop: '150px', textAlign:'center', color:'#ef4444'}}>
        <h3>⚠️ {error}</h3>
        <button onClick={() => navigate('/market')} className="back-button" style={{marginTop:'20px'}}>Back</button>
      </div>
    </div>
  );

  return (
    <div className="detail-container">
      <div className="detail-bg-accent"></div>
      <div style={{position:'fixed', top:0, width:'100%', zIndex:100}}>
         <div className="navbar-container is-at-top"><Navbar /></div>
      </div>

      <div className="detail-content">
        <button onClick={() => navigate('/market')} className="back-button">
          &larr; Back to Market
        </button>

        {/* HEADER */}
        <div className="coin-header">
          <div className="coin-title-group">
            <img src={coin.image.large} alt={coin.name} className="detail-coin-icon" />
            <div>
              <h1 className="detail-coin-name">
                {coin.name} <span className="detail-coin-rank">#{coin.market_cap_rank}</span>
              </h1>
              <span style={{color:'#9ca3af', textTransform:'uppercase'}}>{coin.symbol}</span>
            </div>
          </div>

          <div className="coin-price-group">
            <h2 className="detail-price">
              {coin.market_data?.current_price?.usd ? formatCurrency(coin.market_data.current_price.usd) : "N/A"}
            </h2>
            <div className={`detail-change ${coin.market_data.price_change_percentage_24h > 0 ? 'positive' : 'negative'}`} style={{color: coin.market_data.price_change_percentage_24h > 0 ? '#00FFA3' : '#ef4444'}}>
              {coin.market_data.price_change_percentage_24h?.toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="detail-grid">
          <div className="chart-card">
            
            {/* CHART HEADER: TITLE + TIME FRAME BUTTONS */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px'}}>
              <h3 style={{fontFamily:'Audiowide', margin:0}}>Price Action</h3>
              
              {/* BUTTON GROUP */}
              <div style={{display:'flex', gap:'5px', background:'rgba(255,255,255,0.05)', padding:'4px', borderRadius:'8px'}}>
                {timeFrames.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeFrame(tf.value)}
                    style={{
                      background: timeFrame == tf.value ? '#00FFA3' : 'transparent',
                      color: timeFrame == tf.value ? '#000' : '#9ca3af',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontFamily: 'Fredoka',
                      fontWeight: 'bold',
                      transition: 'all 0.3s'
                    }}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{width:'100%', height:'400px', position:'relative'}}>
               {/* Indikator Loading Chart Transparan */}
               {loadingChart && (
                 <div style={{
                   position:'absolute', top:0, left:0, width:'100%', height:'100%', 
                   background:'rgba(0,0,0,0.5)', zIndex:10, display:'flex', 
                   alignItems:'center', justifyContent:'center', color:'#00FFA3', fontFamily:'Audiowide'
                 }}>
                   Updating Chart...
                 </div>
               )}

               {!loadingChart && ohlc.length === 0 && (
                 <div className="chart-placeholder">Chart Data Unavailable</div>
               )}

               {ohlc.length > 0 && (
                 <Chart 
                   options={chartOptions} 
                   series={ohlc} 
                   type="candlestick" 
                   height="100%" 
                   width="100%"
                 />
               )}
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="stats-card">
            <h3 style={{fontFamily:'Audiowide', marginBottom:'10px'}}>Market Stats</h3>
            <StatRow label="Market Cap" value={formatCurrency(coin.market_data.market_cap.usd)} />
            <StatRow label="Trading Vol (24h)" value={formatCurrency(coin.market_data.total_volume.usd)} />
            <StatRow label="24h High" value={formatCurrency(coin.market_data.high_24h.usd)} />
            <StatRow label="24h Low" value={formatCurrency(coin.market_data.low_24h.usd)} />
            <StatRow label="Circulating Supply" value={coin.market_data.circulating_supply?.toLocaleString()} />
          </div>

          <div className="desc-card">
            <h3 style={{fontFamily:'Audiowide', marginBottom:'15px'}}>About {coin.name}</h3>
            <div className="desc-text" dangerouslySetInnerHTML={{ __html: coin.description.en || "No description available." }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({label, value}) => (
  <div className="stat-row">
    <span className="stat-label">{label}</span>
    <span className="stat-val">{value || "N/A"}</span>
  </div>
);

export default CoinDetail;