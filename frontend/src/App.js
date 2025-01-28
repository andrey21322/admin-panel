import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Auth from './auth/Auth';
import config from './config.json';

const translations = config.translations;
const __url = `${process.env.REACT_APP_API_BASE}${process.env.REACT_APP_DATA_URL}`;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || config.defaultTheme);
  const [language, setLanguage] = useState(localStorage.getItem('language') || config.defaultLanguage);
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashboardResponse, productsResponse, notificationsResponse] = await Promise.all([
        axios.get(`${__url}/dashboard/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${__url}/products/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${__url}/notifications/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      setData(dashboardResponse.data);
      setProducts(productsResponse.data);
      setNotifications(notificationsResponse.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const fetchInitialData = async () => {
      if (token && userId) {
        await fetchData();
      }
    };
    fetchInitialData();
  }, [token, userId]);

  const setTokenAndFetchData = async (newToken, newUserId) => {
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', newUserId);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ru' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const changeActiveTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  const t = useMemo(() => translations[language], [language]);

  const updateNotification = async (id, updates) => {
    try {
      const response = await axios.post(
        `${__url}/notification/edit/${userId}`,
        { id, updates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, ...response.data } : n))
      );
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  if (!token) {
    return <Auth setToken={setTokenAndFetchData} />;
  }

  if (loading) {
    return (
      <div className="bgloader">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={changeActiveTab}
        theme={theme}
        t={t}
        onLogout={handleLogout}
        unreadCount={notifications.filter((n) => !n.read).length}
      />
      <div className="content">
        {activeTab === 'dashboard' && <Dashboard theme={theme} language={language} t={t} data={data} />}
        {activeTab === 'profile' && <Profile theme={theme} language={language} t={t} products={products} token={token} userId={userId} />}
        {activeTab === 'notifications' && (
          <Notifications
            theme={theme}
            t={t}
            notifications={notifications}
            setNotifications={setNotifications}
            updateNotification={updateNotification}
          />
        )}
        {activeTab === 'help' && <Help theme={theme} language={language} t={t} />}
        {activeTab === 'settings' && (
          <Settings
            theme={theme}
            toggleTheme={toggleTheme}
            language={language}
            toggleLanguage={toggleLanguage}
            t={t}
          />
        )}
      </div>
    </div>
  );
};

export default App;
