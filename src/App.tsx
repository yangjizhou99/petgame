import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from './game/state'
import { startTicking } from './game/ticking'
import { applyNTicks } from './game/tickLogic'
import StatusBar from './ui/components/StatusBar'
import IconButton from './ui/components/IconButton'

export default function App(){
  const { t, i18n } = useTranslation()
  const { stats, coins, lang } = useGame()
  const sleeping = useGame(s=>s.flags.sleeping)

  useEffect(()=>{
    const stop = startTicking()
    return stop
  },[])

  const switchLang = (l:'zh'|'ja'|'en')=>{
    useGame.setState({ lang: l } as any)
    i18n.changeLanguage(l)
  }
  const toggleSleep = ()=>{
    useGame.setState(s=>({ flags: { ...s.flags, sleeping: !s.flags.sleeping } }))
  }

  return (
    <div className="app">
      {/* 顶栏 */}
      <div className="topbar">
        <h1 style={{fontSize:18, margin:0}}>{t('title')}</h1>
        <div className="lang">
          {(['zh','ja','en'] as const).map(l=>(
            <button key={l} onClick={()=>switchLang(l)} className={lang===l?'active':''}>{l.toUpperCase()}</button>
          ))}
          <div className="coin">🪙 {t('coins')}: {coins}</div>
        </div>
      </div>

      {/* 状态条 */}
      <div className="status-grid">
        <StatusBar label={t('hunger')}      icon="🍗" value={stats.hunger}/>
        <StatusBar label={t('mood')}        icon="❤️" value={stats.mood}/>
        <StatusBar label={t('cleanliness')} icon="✨" value={stats.cleanliness}/>
        <StatusBar label={t('energy')}      icon="🔋" value={stats.energy}/>
      </div>

      {/* 宠物与房间占位 + 调试按钮（仅开发环境显示） */}
      <div className="pet-area card" style={{position:'relative'}}>
        <div className="pet-placeholder" role="img" aria-label="pet" />
        {import.meta.env.DEV && (
          <button
            onClick={()=>applyNTicks(1)}
            style={{
              position:'absolute', right:16, bottom:16,
              padding:'6px 10px', borderRadius:8, border:'1px solid #2a3140',
              background:'#1a1f2b', color:'#fff', cursor:'pointer'
            }}
          >
            +1 Tick（调试）
          </button>
        )}
      </div>

      {/* 动作按钮：开放睡觉/起床，其它占位 */}
      <div className="actions">
        <IconButton icon="🍱" label={t('feed')} disabled />
        <IconButton icon="🎮" label={t('play')} disabled />
        <IconButton icon="🧼" label={t('clean')} disabled />
        <IconButton
          icon={sleeping ? '⏰' : '🛏️'}
          label={sleeping ? t('wake') : t('sleep')}
          onClick={toggleSleep}
        />
      </div>
    </div>
  )
}
