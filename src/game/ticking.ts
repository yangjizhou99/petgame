import { applyOneTick, settleOfflineAndGetNextAt } from './tickLogic'

let timer: number | null = null
const nowSec = () => Math.floor(Date.now()/1000)

function schedule(nextAtSec: number) {
  if (timer) { window.clearTimeout(timer); timer = null }
  const delayMs = Math.max(500, (nextAtSec - nowSec()) * 1000) // 至少延时 0.5s，防抖
  timer = window.setTimeout(handleTick, delayMs)
}

function handleTick() {
  applyOneTick()
  const nextAt = settleOfflineAndGetNextAt()  // 通常是 lastTick+STEP
  schedule(nextAt)
}

function onVisible() {
  if (document.visibilityState === 'visible') {
    const nextAt = settleOfflineAndGetNextAt()
    schedule(nextAt)
  } else {
    if (timer) { window.clearTimeout(timer); timer = null }
  }
}

export function startTicking() {
  const nextAt = settleOfflineAndGetNextAt()
  schedule(nextAt)
  document.addEventListener('visibilitychange', onVisible)
  window.addEventListener('focus', onVisible)

  return () => {
    document.removeEventListener('visibilitychange', onVisible)
    window.removeEventListener('focus', onVisible)
    if (timer) { window.clearTimeout(timer); timer = null }
  }
}
