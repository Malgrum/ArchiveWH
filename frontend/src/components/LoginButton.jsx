import React from 'react';

const LoginButton = ({ onLogin }) => (
  <button
    onClick={onLogin || (() => alert('Fonction login à implémenter'))}
    style={{
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      padding: '6px 18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: 16,
      float: 'right'
    }}
  >
    Login
  </button>
);

export default LoginButton;
