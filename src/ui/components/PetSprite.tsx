import React, { useEffect, useRef, useState } from 'react'
import { useGame } from '../../game/state'

/** 像素坐标系（48x48），用 fillRect 画出简单像素宠 */
const W = 48, H = 48

export default function PetSprite(){
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stats = useGame(s=>s.stats)
  const sleeping = useGame(s=>s.flags.sleeping)
  const [frame, setFrame] = useState(0)

  // 动画时钟：idle 3帧，睡觉慢点
  useEffect(()=>{
    let id:number
    const tick = ()=>{
      setFrame(f=> (f+1) % 30) // 30 帧循环
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return ()=> cancelAnimationFrame(id)
  },[])

  useEffect(()=>{
    const c = canvasRef.current
    if (!c) return
    const px = Math.floor(Math.min(96, Math.min(c.clientWidth, c.clientHeight)) / 48) || 2
    c.width = W * px
    c.height = H * px
    const ctx = c.getContext('2d')!
    const scale = px
    const F = (x:number,y:number,w:number,h:number,color:string)=>{
      ctx.fillStyle = color
      ctx.fillRect(x*scale,y*scale,w*scale,h*scale)
    }
    // 背景透明；清屏
    ctx.clearRect(0,0,c.width,c.height)

    // 颜色
    const body = '#ffd166'
    const outline = '#000'
    const blush = '#ff5a3c'

    // 基础身体（一个圆角方形感觉）
    const bob = sleeping ? 0 : (frame%20<10?0:1)  // 呼吸/微动
    // 轮廓
    F(8,14+bob,32,20,body)
    // 头顶小耳朵
    F(10,12+bob,6,4,body)
    F(32,12+bob,6,4,body)

    // 眼睛/表情
    const mood = stats.mood
    if (sleeping){
      // 闭眼（横线）
      F(16,20+bob,6,2,outline); F(26,20+bob,6,2,outline)
    }else if (mood < 30){
      // 难过：倒八字
      F(16,20+bob,2,6,outline); F(20,20+bob,2,4,outline)
      F(28,20+bob,2,4,outline); F(32,20+bob,2,6,outline)
    }else if (mood > 70){
      // 开心：弯眼
      F(16,22+bob,6,2,outline); F(26,22+bob,6,2,outline)
    }else{
      // 普通：小点眼
      F(18,20+bob,2,4,outline); F(28,20+bob,2,4,outline)
    }

    // 嘴
    if (sleeping){
      // Zzz 冒泡
      if (frame%60<20){ F(10,18,2,2,outline) }
    }else if (mood > 70){
      F(22,28+bob,4,2,outline)
    }else if (mood < 30){
      F(22,30+bob,4,2,outline); F(22,28+bob,2,2,'#0e1014') // 下垂
    }else{
      F(22,29+bob,4,1,outline)
    }

    // 腮红（心情好才出现）
    if (!sleeping && mood > 70){
      F(14,24+bob,4,2,blush)
      F(30,24+bob,4,2,blush)
    }

    // 边框
    // 上边
    F(8,14+bob,32,1,outline)
    F(8,33+bob,32,1,outline)
    F(8,14+bob,1,20,outline)
    F(39,14+bob,1,20,outline)
  },[frame, stats.mood, sleeping])

  return <canvas ref={canvasRef} style={{ width:96, height:96, imageRendering:'pixelated', border:'2px solid #000' }} />
}
