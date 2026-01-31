import React from 'react';

const PrimaryButton = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      background: '#2563eb',
      color: '#fff',
      border: 'none',
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

export default PrimaryButton;
