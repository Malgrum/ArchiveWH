import React from 'react';
import NavButton from './NavButton';

const NavBar = ({ page, setPage, username, onLogin, onLogout, goProfile }) => (
  <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#27272a', borderBottom: '1px solid #333', width: '100%' }}>
    <div style={{ display: 'flex', gap: 16 }}>
      <NavButton active={page==='home'} onClick={()=>setPage('home')}>Accueil</NavButton>
      <NavButton active={page==='army'} onClick={()=>setPage('army')}>Listes d'Armées</NavButton>
      <NavButton active={page==='battle'} onClick={()=>setPage('battle')}>Rapports de Batailles</NavButton>
      <NavButton active={page==='codex'} onClick={()=>setPage('codex')}>Codex</NavButton>
    </div>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
      {username ? (
        <>
          <span style={{ fontWeight: 'bold', marginRight: 8, cursor: 'pointer' }} onClick={goProfile}>👤 {username}</span>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#f87171', fontWeight: 'bold', cursor: 'pointer' }}>Déconnexion</button>
        </>
      ) : (
        <button onClick={onLogin} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Login</button>
      )}
    </div>
  </nav>
);

export default NavBar;
