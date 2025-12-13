import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../CSS/Portfolio.css';

const SellAssetModal = ({ isOpen, onClose, asset, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // STATE VIEW
  const [view, setView] = useState('input'); 

  useEffect(() => {
    if (isOpen) {
      setView('input');
      setAmount('');
    }
  }, [isOpen]);

  const handleMaxClick = () => {
    setAmount(asset.amount);
  };

  const handleSell = async (e) => {
    e.preventDefault();
    const sellAmount = parseFloat(amount);
    
    if (sellAmount <= 0 || sellAmount > asset.amount) {
      alert("Invalid Amount");
      return;
    }

    setIsSubmitting(true);
    try {
      if (sellAmount === asset.amount) {
        const { error } = await supabase.from('portfolio').delete().eq('id', asset.db_id);
        if (error) throw error;
      } else {
        const newAmount = asset.amount - sellAmount;
        const { error } = await supabase.from('portfolio').update({ amount: newAmount }).eq('id', asset.db_id);
        if (error) throw error;
      }

      // SUKSES
      if (onSuccess) onSuccess();
      setView('success');
      
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setView('input');
    onClose();
  };

  if (!isOpen || !asset) return null;
  const estimatedValue = amount ? (parseFloat(amount) * asset.current_price) : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={view === 'input' ? {border: '1px solid #ef4444', boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)'} : {border: '1px solid #00FFA3'}}>
        
        {/* VIEW INPUT */}
        {view === 'input' && (
          <>
            <div style={{textAlign:'center', marginBottom:'20px'}}>
               <img src={asset.image} alt={asset.name} style={{width:'50px', height:'50px', borderRadius:'50%', marginBottom:'10px'}} />
               <h2 className="modal-title" style={{color:'#ef4444'}}>Sell {asset.symbol.toUpperCase()}</h2>
               <p style={{color:'#9ca3af', fontSize:'0.9rem'}}>Available: {asset.amount} {asset.symbol.toUpperCase()}</p>
            </div>

            <form onSubmit={handleSell}>
              <div>
                <label style={{color:'#9ca3af', fontSize:'0.8rem'}}>Amount to Sell</label>
                <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <input 
                    type="number" step="any" className="modal-input" 
                    placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                    required autoFocus style={{paddingRight: '60px', marginBottom: '15px'}} 
                  />
                  <button type="button" onClick={handleMaxClick} style={{position: 'absolute', right: '10px', top: '12px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontFamily: 'Audiowide', cursor: 'pointer', fontWeight: 'bold'}}>MAX</button>
                </div>
              </div>
              
              <div style={{background:'rgba(239, 68, 68, 0.1)', padding:'10px', borderRadius:'8px', marginBottom:'15px', textAlign:'center'}}>
                <span style={{color:'#9ca3af', fontSize:'0.8rem'}}>You will receive:</span>
                <div style={{color:'#ef4444', fontFamily:'Audiowide', fontSize:'1.2rem'}}>
                  ${estimatedValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose} style={{borderColor:'#fff', color:'#fff'}}>Cancel</button>
                <button type="submit" className="btn-save" disabled={isSubmitting} style={{background:'#ef4444', color:'white'}}>
                  {isSubmitting ? "Processing..." : "Confirm Sell"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* VIEW SUKSES */}
        {view === 'success' && (
          <div className="success-view">
             {/* Ikon Sukses tetap hijau (Vectra style) atau bisa merah jika mau konsisten */}
            <div className="success-icon-container" style={{borderColor: '#ef4444', background: 'rgba(239,68,68,0.1)', boxShadow: '0 0 20px rgba(239,68,68,0.4)'}}>
              <span className="success-icon" style={{color: '#ef4444'}}>✓</span>
            </div>
            <h2 className="success-title">Sale Successful!</h2>
            <p className="success-desc">
              You sold <strong style={{color:'white'}}>{amount} {asset.symbol.toUpperCase()}</strong><br/>
              Proceeds: ${estimatedValue.toLocaleString()}
            </p>
            <button className="btn-done" onClick={handleClose} style={{background: '#ef4444', color: 'white'}}>Done</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SellAssetModal;