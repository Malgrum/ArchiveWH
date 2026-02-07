
import ArmyListPage from './pages/armyList';
import BattleReportPage from './pages/battleReport';
import CodexPage from './pages/codex';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { useState, useEffect } from 'react';
import NavButton from './components/NavButton';
import HomePage from './pages/HomePage';

function App() {
  const [page, setPage] = useState('home');
  const [globalError, setGlobalError] = useState('');
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('wh_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [route, setRoute] = useState('main'); // 'main', 'login', 'profile'
  const username = user?.username || '';

  // Propager setGlobalError aux pages pour afficher les erreurs API
  const pageProps = { setGlobalError, user };

  // Login handler
  const handleLogin = async (name, password) => {
    setGlobalError('');
    const response = await fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: name, password })
    });
    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.error || 'Erreur de connexion');
    }
    const data = await response.json();
    setUser(data);
    localStorage.setItem('wh_user', JSON.stringify(data));
    setRoute('main');
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wh_user');
    setRoute('login');
  };

  useEffect(() => {
    // Pour garder le nom à jour si modifié ailleurs
    const sync = () => {
      try {
        const raw = localStorage.getItem('wh_user');
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setUser(null);
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Affichage de la navbar
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#18181b', color: '#f3f3f3', margin: 0, padding: 0, boxSizing: 'border-box' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#27272a', borderBottom: '1px solid #333', width: '100%' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <NavButton active={page==='home' && route==='main'} onClick={()=>{setPage('home');setRoute('main')}}>Accueil</NavButton>
          <NavButton active={page==='army' && route==='main'} onClick={()=>{setPage('army');setRoute('main')}}>Listes d'Armées</NavButton>
          <NavButton active={page==='battle' && route==='main'} onClick={()=>{setPage('battle');setRoute('main')}}>Rapports de Batailles</NavButton>
          <NavButton active={page==='codex' && route==='main'} onClick={()=>{setPage('codex');setRoute('main')}}>Codex</NavButton>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {username ? (
            <>
              <span style={{ fontWeight: 'bold', marginRight: 8, cursor: 'pointer' }} onClick={()=>setRoute('profile')}>👤 {username}{user?.is_admin ? ' (admin)' : ''}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#f87171', fontWeight: 'bold', cursor: 'pointer' }}>Déconnexion</button>
            </>
          ) : (
            <button onClick={()=>setRoute('login')} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Login</button>
          )}
        </div>
      </nav>
      {globalError && <div style={{ background: '#3f1d1d', color: '#ffb4b4', padding: 12, margin: 0, border: '1px solid #a00', borderRadius: 4 }}>{globalError}</div>}
      <main style={{ padding: 16, width: '100%', boxSizing: 'border-box' }}>
        {route === 'login' && <LoginPage onLogin={handleLogin} />}
        {route === 'profile' && <ProfilePage user={user} onLogout={handleLogout} />}
        {route === 'main' && (
          <>
            {page === 'home' && <HomePage user={user} />}
            {page === 'army' && <ArmyListPage {...pageProps} />}
            {page === 'battle' && <BattleReportPage {...pageProps} />}
            {page === 'codex' && <CodexPage {...pageProps} />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
