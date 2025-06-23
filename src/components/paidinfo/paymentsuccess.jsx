import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const { id } = useParams(); // subcategory ID
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await axios.get(`/stripe/success?sub_id=${id}`);
        // بعد نجاح الحفظ نوجه المستخدم لواجهة الفيديوهات
        navigate(`/subcategories/${id}/videos`);
      } catch (err) {
        console.error('فشل تأكيد الدفع:', err);
        // يمكنك عرض رسالة أو إعادة التوجيه لصفحة خطأ
      }
    };

    confirmPayment();
  }, [id, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>جاري تأكيد الدفع...</h2>
    </div>
  );
};

export default PaymentSuccess;
