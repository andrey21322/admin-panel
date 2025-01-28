import React from 'react';
import './Settings.css';
import { FaMoon, FaSun } from 'react-icons/fa';
import Flag from 'react-country-flag';

const Settings = ({ theme, toggleTheme, language, toggleLanguage, t }) => {
  return (
    <div className="settings">
      <h1>{t.settings}</h1>
      <div className="setting-item">
        <label>{t.language}</label>
        <button onClick={toggleLanguage} className="setting-button">
          {language === 'ru' ? (
            <>
              <Flag
                countryCode="RU"
                svg
                style={{
                  width: '20px',
                  height: '15px',
                }}
              />
            </>
          ) : (
            <>
              <Flag
                countryCode="GB"
                svg
                style={{
                  width: '20px',
                  height: '15px',
                }}
              />
            </>
          )}
        </button>
      </div>
      <div className="setting-item">
        <label>{t.theme}</label>
        <button onClick={toggleTheme} className="setting-button">
          {theme === 'light' ? (
            <>
              <FaSun className="icon" style={{ color: 'yellow' }} />
            </>
          ) : (
            <>
              <FaMoon className="icon" style={{ color: 'darkblue' }} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
