import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Stats = {
  hunger: number; mood: number; cleanliness: number; energy: number; health: number
}

type Progress = {
  date: string          // 'YYYY-MM-DD'
  signed: boolean
  tasks: { feed:number; play:number; clean:number }
  completed: { t1:boolean; t2:boolean; t3:boolean }
}
export type Pet = { species: 'cat' | 'dog'; stage: 'baby'|'teen'|'adult'|'elite'; exp: number; skinId: string }
export type InventoryItem = { id: string; qty?: number; uses?: number }

export type Store = {
  pet: Pet
  stats: Stats
  coins: number
  inventory: InventoryItem[]
  decos: string[]
  flags: { sleeping: boolean }
  timestamps: { lastTick: number; lastLogin: number }
  lang: 'zh'|'ja'|'en'
  progress: Progress
  setLang: (l: 'zh'|'ja'|'en') => void
  reset: () => void
}

const nowSec = () => Math.floor(Date.now()/1000)

const today = (()=> {
  const d = new Date(); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${day}`
})()

const initial: Omit<Store,'setLang'|'reset'> = {
  pet: { species:'cat', stage:'baby', exp:0, skinId:'default' },
  stats: { hunger:70, mood:70, cleanliness:70, energy:80, health:100 },
  coins: 100,
  inventory: [{id:'food_apple', qty:3}, {id:'toy_ball', uses:10}],
  decos: [],
  flags: { sleeping: false },
  timestamps: { lastTick: nowSec(), lastLogin: nowSec() },
  lang: 'zh',
  progress: {
    date: today,
    signed: false,
    tasks: { feed: 0, play: 0, clean: 0 },
    completed: { t1:false, t2:false, t3:false }
  }
}

export const useGame = create<Store>()(
  persist(
    (set) => ({
      ...initial,
      setLang: (l)=> set({ lang: l }),
      reset: ()=> set({ ...initial, timestamps: { lastTick: nowSec(), lastLogin: nowSec() } })
    }),
    { name:'pixel-pet-save', storage: createJSONStorage(()=>localStorage) }
  )
)
