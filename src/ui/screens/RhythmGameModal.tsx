import React, { useEffect, useRef, useState } from 'react'
import Modal from '../components/Modal'
import { useTranslation } from 'react-i18next'
import { onRhythmFinished } from '../../game/progress'

const DURATION = 20000 // 20s
const BEAT_MS  = 1000
const WINDOW   = 250   // 允许点击窗口 ±ms

export default function RhythmGameModal({open,onClose}:{open:boolean;onClose:()=>void}) {
  const { t } = useTranslation()
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [score, setScore] = useState(0)
  const [flash, setFlash] = useState(false)
  const startRef = useRef(0)
  const lastBeatRef = useRef(0)
  const raf = useRef<number | null>(null)

  useEffect(()=>{ if(!open){ reset(); } },[open])

  function reset(){
    setRunning(false); setTimeLeft(DURATION); setScore(0); setFlash(false)
    startRef.current = 0; lastBeatRef.current = 0
    if (raf.current) cancelAnimationFrame(raf.current)
  }

  function start(){
    reset()
    setRunning(true)
    const now = performance.now()
    startRef.current = now
    lastBeatRef.current = now
    tick()
  }

  function tick(){
    raf.current = requestAnimationFrame(()=>{
      const now = performance.now()
      const elapsed = now - startRef.current
      const left = Math.max(0, DURATION - elapsed)
      setTimeLeft(left)

      if (now - lastBeatRef.current >= BEAT_MS){
        lastBeatRef.current = now
        setFlash(true)
        setTimeout(()=>setFlash(false), 120)
      }

      if (left <= 0){
        setRunning(false)
        onRhythmFinished(score)
        onClose()
        return
      }
      tick()
    })
  }

  function onTap(){
    if (!running) return
    const now = performance.now()
    const dt = now - lastBeatRef.current
    if (Math.abs(dt) <= WINDOW) setScore(s=>s+1)
    else setScore(s=>Math.max(0, s-1)) // 失误扣1分（不低于0）
  }

  return (
    <Modal open={open} title={t('rhythm')} onClose={()=>{ reset(); onClose() }}>
      <div style={{display:'grid', gap:12}}>
        <div style={{
          height:120, display:'grid', placeItems:'center',
          background: flash ? '#ffd166' : '#1a1f2b',
          border:'1px solid #2a3140', borderRadius:12
        }}>
          <div style={{fontSize:18}}>{t('time_left')}: {Math.ceil(timeLeft/1000)}s</div>
          <div style={{fontSize:24}}>{t('score')}: {score}</div>
        </div>
        {!running
          ? <button className="btn" onClick={start}>{t('start')}</button>
          : <button className="btn" onClick={onTap}>{t('tap')}</button>}
        <small>{t('rhythm_hint')}</small>
      </div>
    </Modal>
  )
}
