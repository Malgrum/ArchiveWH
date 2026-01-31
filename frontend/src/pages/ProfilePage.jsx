import React from 'react';

const ProfilePage = ({ username, onLogout }) => (
  <div style={{ maxWidth: 400, margin: '60px auto', background: '#23232b', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
    <h2 style={{ marginBottom: 24 }}>Profil</h2>
    <div style={{ marginBottom: 16 }}>
      <strong>Nom d'utilisateur :</strong> {username || <em>Non connecté</em>}
    </div>
    <button onClick={onLogout} style={{ padding: 10, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
      Se déconnecter
    </button>
  </div>
);

export default ProfilePage;
