import React from 'react';

const InputField = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
    <input
      {...props}
      style={{
        width: '100%',
        padding: 10,
        borderRadius: 4,
        border: '1px solid #444',
        background: '#18181b',
        color: '#fff',
        ...props.style
      }}
    />
  </div>
);

export default InputField;
