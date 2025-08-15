import { useGame } from './state'
import { TICK_MINUTES, DECAY_PER_TICK, SLEEP_MOD, OFFLINE_CAP_HOURS } from '../config/constants'
import { getEffectiveCaps } from './actions'
import { ensureDailyState } from './progress'

export const STEP = TICK_MINUTES * 60
const CAP = OFFLINE_CAP_HOURS * 3600

const clamp = (v:number,min:number,max:number)=>Math.max(min,Math.min(max,v))

export function applyOneTick() {
  useGame.setState((s) => {
    const caps = getEffectiveCaps()
    const factor = s.flags.sleeping ? SLEEP_MOD.decayFactor : 1

    const hunger      = clamp(s.stats.hunger      - DECAY_PER_TICK.hunger      * factor, 0, caps.hunger)
    const mood        = clamp(s.stats.mood        - DECAY_PER_TICK.mood        * factor, 0, caps.mood)
    const cleanliness = clamp(s.stats.cleanliness - DECAY_PER_TICK.cleanliness * factor, 0, caps.cleanliness)
    const energy      = clamp(
      s.flags.sleeping ? s.stats.energy + SLEEP_MOD.energyGainPerTick
                        : s.stats.energy - DECAY_PER_TICK.energy,
      0, caps.energy
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

export function settleOfflineAndGetNextAt(): number {
  ensureDailyState()
  const now = Math.floor(Date.now()/1000)
  const s0 = useGame.getState()
  let delta = now - s0.timestamps.lastTick
  if (delta > 0) {
    const capped = Math.min(delta, CAP)
    const ticks  = Math.floor(capped / STEP)
    for (let i=0; i<ticks; i++) applyOneTick()
  }
  const s1 = useGame.getState()
  return s1.timestamps.lastTick + STEP
}

export function applyNTicks(n: number) {
  for (let i=0; i<n; i++) applyOneTick()
}
