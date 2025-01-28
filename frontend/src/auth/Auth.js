import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css';
import { FaBolt, FaFire, FaRobot, FaGhost, FaDragon, FaGem } from 'react-icons/fa';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [icon, setIcon] = useState(null);

  const __url = `${process.env.REACT_APP_API_BASE}${process.env.REACT_APP_AUTH_URL}`;

  const icons = [
    <FaGhost />, <FaDragon />, <FaRobot />, <FaFire />, <FaBolt />, <FaGem />
  ];

  useEffect(() => {
    setIcon(icons[Math.floor(Math.random() * icons.length)]);
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await axios.post(`${__url}${endpoint}`, payload);

      if (response.data.token) {
        const token = response.data.token;
        const userId = response.data.userId;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setToken(token, userId);
      } else {
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '' });
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError('Error: ' + (err.response?.data?.message || 'Please try again.'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">
            {isLogin ? 'Login' : 'Register'} {icon}
          </button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default Auth;