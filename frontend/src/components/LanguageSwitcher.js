import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../config'; // <- create frontend/src/config.js

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(null); // for dev-mode OTP display

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文' },
    { code: 'fr', name: 'Français' },
  ];

  const handleLangSelect = (lang) => {
    if (!lang) return;
    setSelectedLang(lang);
    setStep(1);
  };

  const sendOtp = async () => {
    if (!contact) {
      toast.error('Please enter contact');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/otp/send-otp`, {
        language: selectedLang,
        contact,
      });

      setStep(2);
      toast.success('OTP sent successfully');

      if (res.data.devOtp) {
        setDevOtp(res.data.devOtp); // show dev OTP for testing
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/otp/verify-otp`, {
        otp,
        contact,
      });

      if (res.data.success) {
        i18n.changeLanguage(selectedLang);
        toast.success(t('languageSwitched'));
        setStep(0);
        setContact('');
        setOtp('');
        setDevOtp(null);
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div style={styles.container}>
    <div style={styles.card}>

      {step === 0 && (
        <>
          <h3>Select Language</h3>
          <select
            style={styles.input}
            onChange={(e) => handleLangSelect(e.target.value)}
          >
            <option value="">{t('switchLanguage')}</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </>
      )}

      {step === 1 && (
        <>
          <h3>Verify Contact</h3>
          <input
            style={styles.input}
            type={selectedLang === 'fr' ? 'email' : 'tel'}
            placeholder={t('enterContact')}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <button style={styles.button} onClick={sendOtp} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Enter OTP</h3>
          <input
            style={styles.input}
            type="text"
            placeholder={t('enterOtp')}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button style={styles.button} onClick={verifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

    </div>
  </div>
);
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  card: {
    width: '350px',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};


export default LanguageSwitcher;
