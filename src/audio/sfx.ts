let ctx: AudioContext | null = null
const ensure = () => (ctx ??= new (window.AudioContext || (window as typeof window & {webkitAudioContext: typeof AudioContext}).webkitAudioContext)())

function tone(freq:number, dur=0.12, type:OscillatorType='square', gain=0.08){
  const ac = ensure()
  const t0 = ac.currentTime
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.value = gain
  osc.connect(g).connect(ac.destination)
  osc.start()
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.stop(t0 + dur + 0.02)
}
function seq(fs:number[], step=0.09){ fs.forEach((f,i)=> setTimeout(()=>tone(f), i*step*1000)) }

export const sfx = {
  click: () => tone(800, 0.05, 'square', 0.06),
  eat:   () => seq([420,520,380], 0.07),
  clean: () => seq([900,700,900], 0.06),
  buy:   () => seq([600,760], 0.09),
  reward:() => seq([660,880,990], 0.09),
  start: () => seq([500,650,800,950], 0.08),
  error: () => seq([220,180], 0.12)
}
