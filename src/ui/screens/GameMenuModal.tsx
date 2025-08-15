import React from 'react'
import Modal from '../components/Modal'
import { useTranslation } from 'react-i18next'

export default function GameMenuModal({
  open,onClose,onPick
}:{ open:boolean; onClose:()=>void; onPick:(k:'rhythm'|'bubble')=>void }) {
  const { t } = useTranslation()
  return (
    <Modal open={open} title={t('choose_game')} onClose={onClose}>
      <div className="grid">
        <button className="btn" onClick={()=>onPick('rhythm')}>{t('rhythm')}</button>
        <button className="btn" onClick={()=>onPick('bubble')}>{t('bubble')}</button>
      </div>
    </Modal>
  )
}
