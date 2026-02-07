import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setError('');
    setLoading(true);
    try {
      await onLogin(username.trim(), password);
    } catch (err) {
      setError(err?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#23232b', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
      <h2 style={{ marginBottom: 24 }}>Connexion</h2>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}
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
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
