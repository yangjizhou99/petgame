import React from 'react'
import Modal from '../components/Modal'
import { useGame } from '../../game/state'
import { FOODS, DECOS, TOYS } from '../../config/items'
import { feedFood } from '../../game/actions'
import { useTranslation } from 'react-i18next'

export default function InventoryModal({open,onClose}:{open:boolean;onClose:()=>void}) {
  const inv = useGame(s=>s.inventory)
  const decos = useGame(s=>s.decos)
  const { t } = useTranslation()

  const qtyOf = (id:string)=> inv.find(x=>x.id===id)?.qty || 0
  const usesOf = (id:string)=> inv.find(x=>x.id===id)?.uses || 0

  return (
    <Modal open={open} title={t('inventory')} onClose={onClose}>
      <div style={{display:'grid', gap:10}}>
        <section>
          <h4>{t('foods')}</h4>
          <div className="grid">
            {FOODS.map(f=>{
              const qty = qtyOf(f.id)
              return (
                <div className="item card" key={f.id}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><b>{f.name['zh']}</b><span>{t('qty')}: {qty}</span></div>
                  <button className="btn" disabled={qty<=0} onClick={()=>feedFood(f.id)}>{t('feed')}</button>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h4>{t('toys')}</h4>
          <div className="grid">
            {TOYS.map(toy=>{
              const uses = usesOf(toy.id)
              return (
                <div className="item card" key={toy.id}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><b>{toy.name['zh']}</b><span>{t('uses')}: {uses}</span></div>
                  <small>{t('toy_hint')}</small>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h4>{t('decor')}</h4>
          <div className="grid">
            {DECOS.map(d=>{
              const owned = decos.includes(d.id)
              return (
                <div className="item card" key={d.id}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><b>{d.name['zh']}</b><span>{owned? t('owned'): t('not_owned')}</span></div>
                  <small>{t('cap_hint')}</small>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </Modal>
  )
}
