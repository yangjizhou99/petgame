import React from 'react'
import Modal from '../components/Modal'
import { useGame } from '../../game/state'
import { FOODS, DECOS, TOYS } from '../../config/items'
import { buy } from '../../game/actions'
import { useTranslation } from 'react-i18next'

export default function ShopModal({open,onClose}:{open:boolean;onClose:()=>void}) {
  const coins = useGame(s=>s.coins)
  const decos = useGame(s=>s.decos)
  const { t } = useTranslation()

  return (
    <Modal open={open} title={t('shop')} onClose={onClose}>
      <div style={{display:'grid', gap:10}}>
        <section className="shop-sec">
          <h4>{t('foods')}</h4>
          <div className="grid">
            {FOODS.map(f=>(
              <div className="item card" key={f.id}>
                <div style={{display:'flex',justifyContent:'space-between'}}><b>{f.name['zh']}</b><span>🪙 {f.price}</span></div>
                <small>🍗 +{f.hunger}  ❤️ +{f.mood||0}  ✨ {f.clean||0}</small>
                <button className="btn" disabled={coins < f.price} onClick={()=>buy('food', f.id)}>
                  {t('buy')}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="shop-sec">
          <h4>{t('decor')}</h4>
          <div className="grid">
            {DECOS.map(d=>{
              const owned = decos.includes(d.id)
              return (
                <div className="item card" key={d.id}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><b>{d.name['zh']}</b><span>🪙 {d.price}</span></div>
                  <small>上限：{d.passive?.moodCap?`心情+${d.passive.moodCap} `:''}{d.passive?.cleanCap?`清洁+${d.passive.cleanCap}`:''}</small>
                  <button className="btn" disabled={owned || coins < d.price} onClick={()=>buy('deco', d.id)}>
                    {owned ? t('owned') : t('buy')}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section className="shop-sec">
          <h4>{t('toys')}</h4>
          <div className="grid">
            {TOYS.map(toy=>(
              <div className="item card" key={toy.id}>
                <div style={{display:'flex',justifyContent:'space-between'}}><b>{toy.name['zh']}</b><span>🪙 {toy.price}</span></div>
                <small>耐久：{toy.uses}（第4步小游戏使用）</small>
                <button className="btn" disabled={coins < toy.price} onClick={()=>buy('toy', toy.id)}>
                  {t('buy')}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  )
}
