import React, { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { useTranslation } from 'react-i18next'
import { onBubbleFinished } from '../../game/progress'

const DURATION = 15000
const GRID = 6

function genBubbles(n:number){ return Array.from({length:n}, (_,i)=>({id:i, alive:true})) }

export default function BubbleCleanModal({open,onClose}:{open:boolean;onClose:()=>void}) {
  const { t } = useTranslation()
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [popped, setPopped] = useState(0)
  const [bubbles, setBubbles] = useState(genBubbles(GRID*GRID))

  useEffect(()=>{
    if(!open){ 
      reset()
    }
  },[open])

  useEffect(()=>{
    if(!running) return
    const id = setInterval(()=> setTimeLeft(t=>Math.max(0, t-100)), 100)
    return ()=> clearInterval(id)
  },[running])

  useEffect(()=>{
    if (running && timeLeft===0){
      setRunning(false)
      onBubbleFinished(popped)
      onClose()
    }
  },[timeLeft, running, popped, onClose])

  function reset(){
    setRunning(false)
    setTimeLeft(DURATION)
    setPopped(0)
    setBubbles(genBubbles(GRID*GRID))
  }

  function start(){ 
    reset()
    setRunning(true) 
  }

  function clickBubble(idx:number){
    if (!running) return
    setBubbles(bs=>{
      if (!bs[idx].alive) return bs
      const nb = bs.slice()
      nb[idx] = { ...nb[idx], alive:false }
      return nb
    })
    setPopped(n=>n+1)
  }

  return (
    <Modal open={open} title={t('bubble')} onClose={()=>{ reset(); onClose() }}>
      <div style={{display:'grid', gap:12}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <div>{t('time_left')}: {Math.ceil(timeLeft/1000)}s</div>
          <div>{t('popped')}: {popped}</div>
        </div>
        <div
          style={{
            display:'grid',
            gridTemplateColumns:`repeat(${GRID}, 1fr)`,
            gap:8,
            padding:8,
            background:'#10131a',
            border:'1px solid #2a3140',
            borderRadius:12
          }}
        >
          {bubbles.map((b,i)=>(
            <div key={b.id}
              onClick={()=>clickBubble(i)}
              style={{
                height:40,
                background: b.alive ? '#ffd166' : 'transparent',
                border:'1px solid #2a3140',
                borderRadius:6,
                cursor: running && b.alive ? 'pointer' : 'default'
              }}
            />
          ))}
        </div>
        {!running
          ? <button className="btn" onClick={start}>{t('start')}</button>
          : <small>{t('bubble_hint')}</small>
        }
      </div>
    </Modal>
  )
}
