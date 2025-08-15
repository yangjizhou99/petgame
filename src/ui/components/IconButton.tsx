import React from 'react'

export default function IconButton({
  icon, label, disabled=false, onClick
}:{ icon: string; label: string; disabled?: boolean; onClick?: ()=>void }) {
  return (
    <button
      className="icon-btn"
      disabled={disabled}
      title={label}
      aria-label={label}
      onClick={onClick}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <span>{icon}</span>
    </button>
  )
}
