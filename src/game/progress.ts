import { useGame } from './state'
import { REWARDS } from '../config/constants'

const todayStr = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const day = String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${day}`
}

export function ensureDailyState() {
  useGame.setState(s=>{
    const today = todayStr()
    if (s.progress.date === today) return s
    // 重置当日任务
    return {
      ...s,
      progress: {
        date: today,
        signed: false,
        tasks: { feed: 0, play: 0, clean: 0 },
        completed: { t1:false, t2:false, t3:false }
      }
    }
  })
}

export function signInIfPossible() {
  useGame.setState(s=>{
    if (s.progress.signed) return s
    const addCoins = REWARDS.daily.signin.coins
    const addXp    = REWARDS.daily.signin.xp
    return {
      ...s,
      coins: s.coins + addCoins,
      pet: { ...s.pet, exp: s.pet.exp + addXp },
      progress: { ...s.progress, signed: true }
    }
  })
}

export function addTaskProgress(type: 'feed'|'play'|'clean') {
  useGame.setState(s=>{
    const p = s.progress
    const tasks = { ...p.tasks }
    tasks[type] = (tasks[type]||0) + 1

    let completed = { ...p.completed }
    let coins = 0, xp = 0

    // t1: 喂食x3
    if (!completed.t1 && tasks.feed >= 3) { completed.t1 = true; coins += REWARDS.daily.tasks.t1; }
    // t2: 小游戏x2
    if (!completed.t2 && tasks.play >= 2) { completed.t2 = true; coins += REWARDS.daily.tasks.t2; }
    // t3: 清洁x1
    if (!completed.t3 && tasks.clean >= 1){ completed.t3 = true; coins += REWARDS.daily.tasks.t3; }

    return {
      ...s,
      coins: s.coins + coins,
      pet: { ...s.pet, exp: s.pet.exp + xp },
      progress: { ...p, tasks, completed }
    }
  })
}

export function grantReward({coins=0,xp=0}:{coins?:number; xp?:number}) {
  useGame.setState(s=>({
    ...s,
    coins: s.coins + coins,
    pet: { ...s.pet, exp: s.pet.exp + xp }
  }))
}

export function onRhythmFinished(score:number) {
  const { coins, xp } = REWARDS.play(score)
  grantReward({coins, xp})
  addTaskProgress('play')
}

export function onBubbleFinished(popped:number) {
  const coins = 8 + Math.floor(popped / 3)
  const xp    = 4 + Math.floor(popped / 5)
  grantReward({coins, xp})
  addTaskProgress('play')
}
