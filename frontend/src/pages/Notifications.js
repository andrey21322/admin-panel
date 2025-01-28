import React, { useState } from 'react';
import './Notifications.css';

const Notifications = ({ theme, t, notifications, updateNotification }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'favorite') return notification.favorite;
    return true;
  });

  const getTranslatedText = (text) => {
    const translations = {
      'View Purchase': t.viewPurchase,
      'View Report': t.viewReport,
    };
    return translations[text] || text;
  };

  const getTranslatedMonth = (month) => (month ? t[month.toLowerCase()] || month : '');

  const markAsRead = (id) => updateNotification(id, { read: true });

  const toggleFavorite = (id, currentStatus) => updateNotification(id, { favorite: !currentStatus });

  const openNotification = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const closeModal = () => setSelectedNotification(null);

  return (
    <div className={`notifications ${theme}`}>
      <h1>{t.notifications}</h1>
      <div className="filters">
        <button onClick={() => setFilter('all')}>{t.all}</button>
        <button onClick={() => setFilter('unread')}>{t.unread}</button>
        <button onClick={() => setFilter('favorite')}>{t.favorite}</button>
      </div>
      <div className="scrollable">
        {filteredNotifications.length === 0 ? (
          <p>{t.noMessagesFound}</p>
        ) : (
          filteredNotifications
            .sort((a, b) => b.id - a.id)
            .map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'} ${
                  notification.favorite ? 'favorite' : ''
                }`}
                onClick={() => openNotification(notification)}
              >
                <p>{getTranslatedText(notification.text)}</p>
                <span
                  className={`star ${notification.favorite ? 'gold' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(notification.id, notification.favorite);
                  }}
                >
                  ★
                </span>
              </div>
            ))
        )}
      </div>
      {selectedNotification && (
        <div className="modal-content">
          <h2>{t.notificationDetails}</h2>
          {selectedNotification.orderId && (
            <p>
              {t.orderId}: {selectedNotification.orderId}
            </p>
          )}
          {selectedNotification.customer && (
            <p>
              {t.customer}: {selectedNotification.customer}
            </p>
          )}
          {selectedNotification.Amount !== undefined && (
            <p>
              {t.amount}: ${selectedNotification.Amount}
            </p>
          )}
          {selectedNotification.sales !== undefined && selectedNotification.month && (
            <p>
              {t.sales}: ${selectedNotification.sales}, {t.month}:{' '}
              {getTranslatedMonth(selectedNotification.month)}
            </p>
          )}
          <button className="modal-close-btn" onClick={closeModal}>
            {t.close}
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
