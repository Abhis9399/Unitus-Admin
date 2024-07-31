import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications
    axios.get('/api/admin-notify').then(response => {
      setNotifications(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map(notification => (
          <li key={notification._id}>
            <p><strong>Minimum Price:</strong> {notification.minPrice}</p>
            <p><strong>Maximum Vehicle Capacity:</strong> {notification.maxCapacity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
