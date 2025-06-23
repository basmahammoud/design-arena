import { useState } from 'react';
import { checkout } from '../services/payment';

const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const startCheckout = async (subId) => {
  setLoading(true);
  setError('');
  try {
    const data = await checkout(subId, {
      success_url: `http://localhost:3000/payment-success/${subId}`,
      cancel_url: `http://localhost:3000/payment-cancel`
    });
    window.location.href = data.checkout_url;
  } catch (err) {
    setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء جلسة الدفع');
  } finally {
    setLoading(false);
  }
};



  return { startCheckout, loading, error };
};

export default useStripeCheckout;
