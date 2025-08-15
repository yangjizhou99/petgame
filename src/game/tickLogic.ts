import { useGame } from './state'
import type { Store } from './state'
import { clamp } from '../utils/num'
import { TICK_MINUTES, DECAY_PER_TICK, SLEEP_MOD, OFFLINE_CAP_HOURS } from '../config/constants'

export const STEP = TICK_MINUTES * 60         // 单步长(秒)
const CAP = OFFLINE_CAP_HOURS * 3600          // 离线封顶(秒)
const nowSec = () => Math.floor(Date.now()/1000)

// 一步结算：衰减/恢复/健康推导 + 推进 lastTick
export function applyOneTick() {
  useGame.setState((s: Store) => {
    const factor = s.flags.sleeping ? SLEEP_MOD.decayFactor : 1

    const hunger      = clamp(s.stats.hunger      - DECAY_PER_TICK.hunger      * factor, 0, 100)
    const mood        = clamp(s.stats.mood        - DECAY_PER_TICK.mood        * factor, 0, 100)
    const cleanliness = clamp(s.stats.cleanliness - DECAY_PER_TICK.cleanliness * factor, 0, 100)
    const energy      = clamp(
      s.flags.sleeping ? s.stats.energy + SLEEP_MOD.energyGainPerTick
                        : s.stats.energy - DECAY_PER_TICK.energy,
      0, 100
    )

    let health = s.stats.health
    if (hunger < 20 || cleanliness < 20) health -= 1
    else if (hunger > 70 && cleanliness > 70 && mood > 70 && energy > 70) health += 1
    health = clamp(health, 0, 100)

    return {
      ...s,
      stats: { ...s.stats, hunger, mood, cleanliness, energy, health },
      timestamps: { ...s.timestamps, lastTick: s.timestamps.lastTick + STEP }
    }
  })
}

// 进入页面/回到前台：按 5 分钟步长补算离线，并返回下一次目标时间点（秒）
export function settleOfflineAndGetNextAt(): number {
  const s0 = useGame.getState()
  const now = nowSec()
  let delta = now - s0.timestamps.lastTick
  if (delta > 0) {
    const capped = Math.min(delta, CAP)
    const ticks  = Math.floor(capped / STEP)
    for (let i=0; i<ticks; i++) applyOneTick()
  }
  const s1 = useGame.getState()
  return s1.timestamps.lastTick + STEP
}

// 可选：开发用批量推进
export function applyNTicks(n: number) {
  for (let i=0; i<n; i++) applyOneTick()
}
