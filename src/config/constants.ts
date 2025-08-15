export const TICK_MINUTES = 5
export const DECAY_PER_TICK = { hunger:2, mood:2, cleanliness:2, energy:2 }
export const SLEEP_MOD = { decayFactor:0.5, energyGainPerTick:6 }
export const OFFLINE_CAP_HOURS = 8
export const GROWTH_XP = { baby:0, teen:200, adult:800, elite:2000 }
export const CAPS = { base:100, moodPlus:5, cleanPlus:5 }

export const REWARDS = {
  play: (score:number) => ({ coins: 10 + Math.floor(score/5), xp: 5 + Math.floor(score/10) }),
  clean: { coins: 15, xp: 8 },
  feed: { coins: 5, xp: 3 },
  daily: { signin:{coins:30,xp:5}, tasks:{t1:40,t2:40,t3:20} }
}
