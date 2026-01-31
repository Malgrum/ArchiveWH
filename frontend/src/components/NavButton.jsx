import React from 'react';

const NavButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      fontWeight: active ? 'bold' : 'normal',
      textDecoration: active ? 'underline' : 'none',
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: '1rem',
      padding: '4px 12px',
      borderRadius: 4,
      outline: 'none',
      transition: 'background 0.2s',
      ...(active ? { background: '#27272a' } : {})
    }}
  >
    {children}
  </button>
);

export default NavButton;
