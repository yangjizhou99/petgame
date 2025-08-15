import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from './game/state'
import StatusBar from './ui/components/StatusBar'
import IconButton from './ui/components/IconButton'

export default function App(){
  const { t, i18n } = useTranslation()
  const { stats, coins, lang, setLang } = useGame()

  const switchLang = (l:'zh'|'ja'|'en')=>{
    setLang(l); i18n.changeLanguage(l)
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

      {/* 宠物与房间占位 */}
      <div className="pet-area card">
        <div className="pet-placeholder" role="img" aria-label="pet" />
      </div>

      {/* 动作按钮（占位，下一步接入逻辑） */}
      <div className="actions">
        <IconButton icon="🍱" label={t('feed')} />
        <IconButton icon="🎮" label={t('play')} />
        <IconButton icon="🧼" label={t('clean')} />
        <IconButton icon="🛏️" label={t('sleep')} />
      </div>
    </div>
  )
}
