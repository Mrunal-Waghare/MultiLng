import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Home = ({ onLogout }) => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      
      {/* Top Right Logout */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <h1>{t('welcome')}</h1>
      <LanguageSwitcher />
    </div>
  );
};

export default Home;