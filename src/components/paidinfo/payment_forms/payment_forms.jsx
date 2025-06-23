import { useEffect, useState } from 'react';
import useStripeCheckout from '../../../hooks/usePay';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './payment_forms.css';

const Payment_Forms = () => {
  const { id } = useParams(); // subcategory ID
  const { startCheckout, loading, error } = useStripeCheckout();
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // تحقق هل المستخدم دفع مسبقًا
    const checkPaymentStatus = async () => {
      try {
        const res = await axios.get(`/stripe/${id}/pay`);
        setAlreadyPaid(false); // الدفع مطلوب
      } catch (err) {
        if (err.response?.data?.message === 'لقد قمت بالدفع لهذا العنصر مسبقًا.') {
          setAlreadyPaid(true);
          navigate(`/subcategories/${id}/videos`);
        }
      } finally {
        setLoadingStatus(false);
      }
    };
    checkPaymentStatus();
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    startCheckout(id);
  };

  if (loadingStatus) return <div className="loading">جار التحقق من حالة الدفع...</div>;

  return (
    <div className="background">
      <div className="payment-container">
        <div className="payment-total">
          <span>Donation Total</span>
          <strong>$10.00</strong>
        </div>

        <div className="payment-method-box">
          <h3>Donate with Stripe Payment Element</h3>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <button type="submit" className="payment-button" disabled={loading}>
              {loading ? ' Loading...' : 'Donate Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment_Forms;
