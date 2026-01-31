import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password) {
      onLogin(username.trim(), password);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#23232b', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
      <h2 style={{ marginBottom: 24 }}>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 4, border: '1px solid #444', background: '#18181b', color: '#fff' }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 4, border: '1px solid #444', background: '#18181b', color: '#fff' }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
