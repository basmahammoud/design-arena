import React, { useState } from 'react';
import '../Login/Login.css';
import useVerify from '../../hooks/verifyhooks'; 
import { useNavigate } from 'react-router-dom';


export default function Verify() {
  const [code, setCode] = useState('');
  const { verifyCode, loading, error } = useVerify(); 
  const [activated, setActivated] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await verifyCode(code); 
    if (success) {
      navigate('/homepage');
    }
  };
  

  return (
    <div className="login-page">
       <div
      className={`ring ${activated ? 'activated' : ''}`}
      onMouseEnter={() => setActivated(true)}
    >
        <i style={{ '--clr': '#a965a9' }}></i>
        <i style={{ '--clr': '#ff0057' }}></i>
        <i style={{ '--clr': '#fffd44' }}></i>

        <form className="login" onSubmit={handleSubmit}>
          <h2>Verify</h2>

          <div className="inputBx">
            <input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)} 
              required
            />
          </div>

          <div className="inputBx">
            <input
              type="submit"
              value={loading ? 'Verifying...' : 'Verify'}
              disabled={loading}
            />
          </div>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* عرض الأخطاء إن وجدت */}
      </div>
    </div>
  );
}
