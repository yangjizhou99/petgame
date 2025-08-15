import React from 'react'
import Modal from '../components/Modal'
import { useGame } from '../../game/state'
import { ensureDailyState, signInIfPossible } from '../../game/progress'
import { useTranslation } from 'react-i18next'

export default function DailyModal({open,onClose}:{open:boolean;onClose:()=>void}) {
  const { t } = useTranslation()
  const p = useGame(s=>s.progress)
  ensureDailyState()

  return (
    <Modal open={open} title={t('daily')} onClose={onClose}>
      <div style={{display:'grid', gap:12}}>
        <section className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <b>{t('signin')}</b>
            <button className="btn" onClick={signInIfPossible} disabled={p.signed}>
              {p.signed ? t('signed') : t('sign_in')}
            </button>
          </div>
          <small>{t('signin_hint')}</small>
        </section>

        <section className="card">
          <b>{t('daily_tasks')}</b>
          <ul>
            <li>{t('task_feed')}：{p.tasks.feed}/3 {p.completed.t1 ? '✅' : ''}</li>
            <li>{t('task_play')}：{p.tasks.play}/2 {p.completed.t2 ? '✅' : ''}</li>
            <li>{t('task_clean')}：{p.tasks.clean}/1 {p.completed.t3 ? '✅' : ''}</li>
          </ul>
          <small>{t('tasks_hint')}</small>
        </section>
      </div>
    </Modal>
  )
}
