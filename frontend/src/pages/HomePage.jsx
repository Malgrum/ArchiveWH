import React, { useEffect, useState } from 'react';

const HomePage = ({ user }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const isAdmin = !!user?.is_admin;

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/news');
      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        throw new Error(errPayload.error || 'Erreur chargement actualités');
      }
      const data = await res.json();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim() || !formData.content.trim()) return;
      const res = await fetch('http://localhost:4000/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user?.id },
        body: JSON.stringify({ title: formData.title.trim(), content: formData.content.trim() })
      });
      if (!res.ok) {
        const errPayload = await res.json().catch(() => ({}));
        throw new Error(errPayload.error || 'Erreur création actualité');
      }
      setFormData({ title: '', content: '' });
      await fetchNews();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#23232b', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
        <h1 style={{ marginBottom: 12 }}>Bienvenue sur ArchiveWH</h1>
        <p style={{ marginBottom: 12, fontSize: '0.95rem', color: '#d4d4d8' }}>
          Ce site permet aux membres du club de créer et partager leurs listes d'armées, d'écrire des rapports de batailles, et de consulter le codex communautaire.
        </p>
        <ul style={{ marginLeft: 20, fontSize: '0.95rem', color: '#cbd5f5' }}>
          <li>• Gestion des utilisateurs (connexion, profil)</li>
          <li>• Création et consultation de listes d'armées</li>
          <li>• Rédaction et lecture de rapports de batailles</li>
          <li>• Section codex pour les administrateurs</li>
        </ul>
      </div>

      <div style={{ background: '#23232b', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0002' }}>
        <h2 style={{ marginBottom: 12 }}>Actualités</h2>
        {error && <div style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}

        {isAdmin && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 20, border: '1px solid #333', padding: 16, borderRadius: 6 }}>
            <input
              type="text"
              placeholder="Titre"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 4, border: '1px solid #444', background: '#18181b', color: '#fff' }}
            />
            <textarea
              placeholder="Contenu de l'actualité"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 4, border: '1px solid #444', background: '#18181b', color: '#fff', minHeight: 120 }}
            />
            <button type="submit" style={{ padding: '8px 16px' }}>Publier</button>
          </form>
        )}

        {loading ? (
          <div>Chargement...</div>
        ) : news.length === 0 ? (
          <div>Aucune actualité pour le moment.</div>
        ) : (
          news.map(item => (
            <div key={item.id} style={{ border: '1px solid #333', padding: 12, borderRadius: 6, marginBottom: 12 }}>
              <h3 style={{ marginBottom: 6 }}>{item.title}</h3>
              <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: 6 }}>
                {item.author} • {new Date(item.created_at).toLocaleDateString()}
              </div>
              <p style={{ margin: 0 }}>{item.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;