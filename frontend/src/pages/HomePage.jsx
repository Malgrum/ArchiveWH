import React from 'react';

const HomePage = () => (
  <div style={{ maxWidth: 700, margin: '40px auto', background: '#23232b', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
    <h1 style={{ marginBottom: 24 }}>Bienvenue sur ArchiveWH</h1>
    <p style={{ marginBottom: 16 }}>
      Ce site permet aux membres du club de créer et partager leurs listes d'armées, d'écrire des rapports de batailles, et de consulter le codex communautaire.
    </p>
    <ul style={{ marginLeft: 24 }}>
      <li>• Gestion des utilisateurs (connexion, profil)</li>
      <li>• Création et consultation de listes d'armées</li>
      <li>• Rédaction et lecture de rapports de batailles</li>
      <li>• Section codex pour les administrateurs</li>
    </ul>
  </div>
);

export default HomePage;
