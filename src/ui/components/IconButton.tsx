import React from 'react'

export default function IconButton({ icon, label, disabled=true }:{
  icon: string; label: string; disabled?: boolean
}) {
  return (
    <button className="icon-btn" disabled={disabled} title={label} aria-label={label}>
      <span>{icon}</span>
    </button>
  )
}
