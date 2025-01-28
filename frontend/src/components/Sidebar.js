import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, theme, t, onLogout, unreadCount }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${theme}`}>
      <button
        onClick={toggleCollapse}
        className={`toggle-button ${isCollapsed ? 'collapsed' : ''}`}
      >
        <span className="arrow">{isCollapsed ? '←' : '→'}</span>
      </button>
      <nav>
        {!isCollapsed && <h2>My Panel</h2>}
        <ul>
          <li
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            {t.dashboard}
          </li>
          <li
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            {t.profile}
          </li>
          <li
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            {t.notifications}
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </li>
          <li
            className={activeTab === 'help' ? 'active' : ''}
            onClick={() => setActiveTab('help')}
          >
            {t.help}
          </li>
          <li
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            {t.settings}
          </li>
        </ul>
      </nav>
      {!isCollapsed && (
        <button onClick={onLogout} className="logout-btn">
          {t.logOut}
        </button>
      )}
    </div>
  );
};

export default Sidebar;
