import React, { useEffect, useState } from 'react';
import { notifications } from '../services/Notification'; 

const Notifications = () => {
  const [notificationsList, setNotificationsList] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await notifications();

      // 🔥 تحقق هنا من شكل البيانات
      console.log('DATA:', data);

      // ثم عينها بشكل صحيح
      setNotificationsList(data.data ?? data); 
    } catch (err) {
      console.error('خطأ في جلب الإشعارات:', err);
    }
  };
  fetchData();
}, []);


  return (
    <div>
      <h2>🔔 إشعاراتك</h2>
      <ul>
        {notificationsList.map((n) => (
          <li key={n.id}>
            <strong>{n.data.title}</strong> 
            <p>{n.data.caption}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
