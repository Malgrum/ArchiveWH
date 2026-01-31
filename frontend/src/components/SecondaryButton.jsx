import React from 'react';

const SecondaryButton = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      background: 'none',
      color: '#2563eb',
      border: '1px solid #2563eb',
      borderRadius: 4,
      padding: '8px 20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem',
      margin: '4px 0',
      ...props.style
    }}
  >
    {children}
  </button>
);

export default SecondaryButton;
