import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../CSS/Portfolio.css';

const SellAssetModal = ({ isOpen, onClose, asset, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !asset) return null;

  const handleSell = async (e) => {
    e.preventDefault();
    const sellAmount = parseFloat(amount);
    
    // Validasi input
    if (sellAmount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    if (sellAmount > asset.amount) {
      alert(`Insufficient balance. You only have ${asset.amount} ${asset.symbol.toUpperCase()}`);
      return;
    }

    setIsSubmitting(true);

    try {
      if (sellAmount === asset.amount) {
        // SKENARIO 1: JUAL SEMUA -> HAPUS DARI DB
        const { error } = await supabase
          .from('portfolio')
          .delete()
          .eq('id', asset.db_id); // Hapus berdasarkan ID database
        if (error) throw error;
      } else {
        // SKENARIO 2: JUAL SEBAGIAN -> UPDATE DB
        const newAmount = asset.amount - sellAmount;
        const { error } = await supabase
          .from('portfolio')
          .update({ amount: newAmount })
          .eq('id', asset.db_id);
        if (error) throw error;
      }

      alert(`Successfully sold ${sellAmount} ${asset.symbol.toUpperCase()}!`);
      onSuccess(); // Refresh data di Portfolio
      onClose(); // Tutup modal
      setAmount(''); // Reset
      
    } catch (err) {
      alert("Failed to sell: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estimasi nilai jual (USD)
  const estimatedValue = amount ? (parseFloat(amount) * asset.current_price) : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{border: '1px solid #ef4444', boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)'}}>
        <div style={{textAlign:'center', marginBottom:'20px'}}>
           <img src={asset.image} alt={asset.name} style={{width:'50px', height:'50px', borderRadius:'50%', marginBottom:'10px'}} />
           <h2 className="modal-title" style={{color:'#ef4444'}}>Sell {asset.symbol.toUpperCase()}</h2>
           <p style={{color:'#9ca3af', fontSize:'0.9rem'}}>Available: {asset.amount} {asset.symbol.toUpperCase()}</p>
        </div>

        <form onSubmit={handleSell}>
          <div>
            <label style={{color:'#9ca3af', fontSize:'0.8rem'}}>Amount to Sell</label>
            <input 
              type="number" 
              step="any"
              className="modal-input" 
              placeholder="0.00" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          {/* Estimasi Dapat Uang Berapa */}
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
      </div>
    </div>
  );
};

export default SellAssetModal;