import { useGame } from './state'
import { FOODS, DECOS, TOYS } from '../config/items'
import { CAPS, REWARDS } from '../config/constants'
import { addTaskProgress, grantReward } from './progress'

type Caps = { hunger:number; mood:number; cleanliness:number; energy:number }
function effectiveCapsFromDecos(decos: string[]): Caps {
  let moodPlus = 0, cleanPlus = 0
  for (const id of decos) {
    const d = DECOS.find(x=>x.id===id)
    if (!d?.passive) continue
    if (typeof d.passive.moodCap === 'number')  moodPlus  += d.passive.moodCap
    if (typeof d.passive.cleanCap === 'number') cleanPlus += d.passive.cleanCap
  }
  moodPlus  = Math.min(moodPlus,  CAPS.moodPlus)
  cleanPlus = Math.min(cleanPlus, CAPS.cleanPlus)
  return {
    hunger: CAPS.base,
    energy: CAPS.base,
    mood: CAPS.base + moodPlus,
    cleanliness: CAPS.base + cleanPlus
  }
}

const clamp = (v:number,min:number,max:number)=>Math.max(min,Math.min(max,v))

export function feedFood(foodId: string) {
  let consumed = false

  useGame.setState(s=>{
    const foodDef = FOODS.find(f=>f.id===foodId)
    const invIdx  = s.inventory.findIndex(it=>it.id===foodId && (it.qty??0)>0)
    if (!foodDef || invIdx<0) return s

    const caps = effectiveCapsFromDecos(s.decos)
    const nextInv = [...s.inventory]
    nextInv[invIdx] = { ...nextInv[invIdx], qty: (nextInv[invIdx].qty || 0) - 1 }

    consumed = true

    return {
      ...s,
      stats: {
        ...s.stats,
        hunger:      clamp(s.stats.hunger      + (foodDef.hunger||0), 0, caps.hunger),
        mood:        clamp(s.stats.mood        + (foodDef.mood||0),   0, caps.mood),
        cleanliness: clamp(s.stats.cleanliness + (foodDef.clean||0),  0, caps.cleanliness)
      },
      inventory: nextInv
    }
  })

  if (consumed) {
    addTaskProgress('feed')
    grantReward(REWARDS.feed)
  }
}

export function cleanNow() {
  let did = false

  useGame.setState(s=>{
    const caps = effectiveCapsFromDecos(s.decos)
    did = true
    return {
      ...s,
      stats: {
        ...s.stats,
        cleanliness: clamp(s.stats.cleanliness + 25, 0, caps.cleanliness),
        mood:        clamp(s.stats.mood + 5,             0, caps.mood)
      }
    }
  })

  if (did) {
    addTaskProgress('clean')
    grantReward(REWARDS.clean)
  }
}

export function buy(kind:'food'|'deco'|'toy', id: string) {
  useGame.setState(s=>{
    let price = 0
    if (kind==='food') {
      const d = FOODS.find(x=>x.id===id); if (!d) return s; price = d.price
      if (s.coins < price) return s
      const inv = [...s.inventory]
      const i = inv.findIndex(it=>it.id===id)
      if (i>=0) inv[i] = { ...inv[i], qty: (inv[i].qty||0) + 1 }
      else inv.push({ id, qty: 1 })
      return { ...s, coins: s.coins - price, inventory: inv }
    }
    if (kind==='deco') {
      const d = DECOS.find(x=>x.id===id); if (!d) return s; price = d.price
      if (s.coins < price) return s
      if (s.decos.includes(id)) return s // 已拥有不重复购买
      return { ...s, coins: s.coins - price, decos: [...s.decos, id] }
    }
    if (kind==='toy') {
      const d = TOYS.find(x=>x.id===id); if (!d) return s; price = d.price
      if (s.coins < price) return s
      // 先入库（后续第4步在小游戏里消耗 uses）
      const inv = [...s.inventory]
      inv.push({ id, uses: d.uses })
      return { ...s, coins: s.coins - price, inventory: inv }
    }
    return s
  })
}

// 供 tick 逻辑使用：根据当前 decos 计算 cap
export function getEffectiveCaps() {
  const s = useGame.getState()
  return effectiveCapsFromDecos(s.decos)
}
