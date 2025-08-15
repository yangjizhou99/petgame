import React from 'react'

export default function StatusBar({ label, icon, value, cap=100 }:{
  label: string; icon: string; value: number; cap?: number
}) {
  const pct = Math.min(100, Math.round(value / cap * 100))
  return (
    <div className="card" aria-label={label}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span aria-hidden="true">{icon}</span>
          <strong>{label}</strong>
        </div>
        <span>{value}/{cap}</span>
      </div>
      <div style={{height:8, background:'#0f1420', border:'1px solid #242a36', borderRadius:6}}>
        <div style={{
          width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#ffd166,#ff5a3c)',
          borderRadius:5
        }} />
      </div>
    </div>
  )
}
