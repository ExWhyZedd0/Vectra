import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../CSS/Portfolio.css'; 

// UBAH NAMA KOMPONEN DI SINI
const BuyAssetModal = ({ isOpen, onClose, coinId, currentPrice, coinSymbol, image, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    if (isOpen) getUser();
  }, [isOpen]);

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to manage your portfolio.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Cek apakah user sudah punya koin ini sebelumnya?
      const { data: existingData, error: fetchError } = await supabase
        .from('portfolio')
        .select('id, amount')
        .eq('user_id', user.id)
        .eq('coin_id', coinId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingData) {
        // SKENARIO A: SUDAH PUNYA -> UPDATE (TAMBAH JUMLAH)
        const newTotal = existingData.amount + parseFloat(amount);
        const { error } = await supabase
          .from('portfolio')
          .update({ amount: newTotal })
          .eq('id', existingData.id);
        
        if (error) throw error;
      } else {
        // SKENARIO B: BELUM PUNYA -> INSERT BARU
        const { error } = await supabase
          .from('portfolio')
          .insert([
            { 
              user_id: user.id, 
              coin_id: coinId, 
              amount: parseFloat(amount) 
            }
          ]);
        
        if (error) throw error;
      }
      
      alert(`Success! Bought ${amount} ${coinSymbol.toUpperCase()}.`);
      if (onSuccess) onSuccess(); // Refresh data di halaman induk
      onClose(); 
      setAmount(''); 
      
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const estimatedValue = amount && currentPrice ? (parseFloat(amount) * currentPrice) : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{textAlign:'center', marginBottom:'20px'}}>
           {image && <img src={image} alt={coinId} style={{width:'50px', height:'50px', borderRadius:'50%', marginBottom:'10px'}} />}
           <h2 className="modal-title">Buy {coinSymbol?.toUpperCase()}</h2>
           <p style={{color:'#9ca3af', fontSize:'0.9rem'}}>Current Price: ${currentPrice?.toLocaleString()}</p>
        </div>

        <form onSubmit={handleBuy}>
          <div>
            <label style={{color:'#9ca3af', fontSize:'0.8rem'}}>Amount to Buy</label>
            <input 
              type="number" 
              step="any"
              className="modal-input" 
              placeholder="e.g. 0.5" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
              required
            />
          </div>
          
          <div style={{background:'rgba(0,255,163,0.1)', padding:'10px', borderRadius:'8px', marginBottom:'15px', textAlign:'center'}}>
            <span style={{color:'#9ca3af', fontSize:'0.8rem'}}>Total Cost:</span>
            <div style={{color:'#00FFA3', fontFamily:'Audiowide', fontSize:'1.2rem'}}>
              ${estimatedValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Buy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyAssetModal;