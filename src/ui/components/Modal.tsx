import React from 'react'

export default function Modal({
  open, title, onClose, children
}:{ open:boolean; title:string; onClose:()=>void; children:React.ReactNode }) {
  if (!open) return null
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-content card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <strong>{title}</strong>
          <button className="btn" onClick={onClose}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
