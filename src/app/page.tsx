'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const ICONS = ['/01.png', '/02.png', '/03.png', '/04.png', '/05.png']

const LAYOUT: { type: 'icon' | 'text'; text?: string }[] = [
  { type: 'icon' },
  { type: 'text', text: 'Your letter has arrived,' },
  { type: 'text', text: 'Unlock ancient spells ' },
  { type: 'icon' },
  { type: 'text', text: 'Master every potion ' },
  { type: 'icon' },
  { type: 'text', text: 'and discover magical secrets' },
  { type: 'icon' },
  { type: 'text', text: 'from the wizarding world' },
  { type: 'icon' },
  { type: 'text', text: 'Enjoy' },
]

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const heroHeader = headerRef.current
    const animatedIcons = iconsRef.current
    if (!hero || !heroHeader || !animatedIcons) return

    const iconElements = Array.from(
      animatedIcons.querySelectorAll<HTMLDivElement>('.animated-icon'),
    )
    const textSegments = Array.from(
      textRef.current?.querySelectorAll<HTMLSpanElement>('.text-segment') ?? [],
    )
    const placeholders = Array.from(
      textRef.current?.querySelectorAll<HTMLDivElement>('.placeholder-icon') ?? [],
    )

    const textAnimationOrder = textSegments.map((segment, originalIndex) => ({
      segment,
      originalIndex,
    }))

    for (let i = textAnimationOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[textAnimationOrder[i], textAnimationOrder[j]] = [
        textAnimationOrder[j],
        textAnimationOrder[i],
      ]
    }

    const isMobile = window.innerWidth <= 1000
    const headerIconSize = isMobile ? 30 : 60
    const currentIconSize = iconElements[0].getBoundingClientRect().width
    const exactScale = headerIconSize / currentIconSize

    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    let duplicateIcons: HTMLDivElement[] | null = null

    const clearDuplicates = () => {
      if (!duplicateIcons) return
      duplicateIcons.forEach((duplicate) => {
        if (duplicate.parentNode) duplicate.parentNode.removeChild(duplicate)
      })
      duplicateIcons = null
    }

    const createDuplicates = () => {
      if (duplicateIcons) return
      duplicateIcons = []
      iconElements.forEach((icon) => {
        const duplicate = icon.cloneNode(true) as HTMLDivElement
        duplicate.className = 'duplicate-icon'
        duplicate.style.position = 'absolute'
        duplicate.style.width = headerIconSize + 'px'
        duplicate.style.height = headerIconSize + 'px'
        document.body.appendChild(duplicate)
        duplicateIcons?.push(duplicate)
      })
    }

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: () => `+=${window.innerHeight * 8}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress

        textSegments.forEach((segment) => {
          gsap.set(segment, { opacity: 0 })
        })

        if (progress <= 0.3) {
          const moveProgress = progress / 0.3
          const containerMoveY = -window.innerHeight * 0.3 * moveProgress

          if (progress <= 0.15) {
            const headerProgress = progress / 0.15
            const headerMoveY = -50 * headerProgress
            const headerOpacity = 1 - headerProgress

            gsap.set(heroHeader, {
              transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`,
              opacity: headerOpacity,
            })
          } else {
            gsap.set(heroHeader, {
              transform: 'translate(-50%, calc(-50% + -50px))',
              opacity: 0,
            })
          }

          clearDuplicates()

          gsap.set(animatedIcons, {
            x: 0,
            y: containerMoveY,
            scale: 1,
            opacity: 1,
          })

          iconElements.forEach((icon, index) => {
            const staggerDelay = index * 0.1
            const iconStart = staggerDelay
            const iconEnd = staggerDelay + 0.5

            const iconProgress = gsap.utils.mapRange(
              iconStart,
              iconEnd,
              0,
              1,
              moveProgress,
            )
            const clampedProgress = Math.max(0, Math.min(1, iconProgress))

            const startOffset = -containerMoveY
            const individualY = startOffset * (1 - clampedProgress)

            gsap.set(icon, {
              x: 0,
              y: individualY,
            })
          })
        } else if (progress <= 0.6) {
          const scaleProgress = (progress - 0.3) / 0.3

          gsap.set(heroHeader, {
            transform: 'translate(-50%, calc(-50% + -50px))',
            opacity: 0,
          })

          if (scaleProgress >= 0.5) {
            hero.style.backgroundColor = '#e3e3db'
          } else {
            hero.style.backgroundColor = '#141414'
          }

          clearDuplicates()

          const targetCenterY = window.innerHeight / 2
          const targetCenterX = window.innerWidth / 2
          const containerRect = animatedIcons.getBoundingClientRect()
          const currentCenterX = containerRect.left + containerRect.width / 2
          const currentCenterY = containerRect.top + containerRect.height / 2
          const deltaX = (targetCenterX - currentCenterX) * scaleProgress
          const deltaY = (targetCenterY - currentCenterY) * scaleProgress
          const baseY = -window.innerHeight * 0.3
          const currentScale = 1 + (exactScale - 1) * scaleProgress

          gsap.set(animatedIcons, {
            x: deltaX,
            y: baseY + deltaY,
            scale: currentScale,
            opacity: 1,
          })

          iconElements.forEach((icon) => {
            gsap.set(icon, { x: 0, y: 0 })
          })
        } else if (progress <= 0.75) {
          const moveProgress = (progress - 0.6) / 0.15

          gsap.set(heroHeader, {
            transform: 'translate(-50%, calc(-50% + -50px))',
            opacity: 0,
          })

          hero.style.backgroundColor = '#e3e3db'

          const targetCenterY = window.innerHeight / 2
          const targetCenterX = window.innerWidth / 2
          const containerRect = animatedIcons.getBoundingClientRect()
          const currentCenterX = containerRect.left + containerRect.width / 2
          const currentCenterY = containerRect.top + containerRect.height / 2
          const deltaX = targetCenterX - currentCenterX
          const deltaY = targetCenterY - currentCenterY
          const baseY = -window.innerHeight * 0.3

          gsap.set(animatedIcons, {
            x: deltaX,
            y: baseY + deltaY,
            scale: exactScale,
            opacity: 0,
          })

          iconElements.forEach((icon) => {
            gsap.set(icon, { x: 0, y: 0 })
          })

          createDuplicates()

          duplicateIcons?.forEach((duplicate, index) => {
            if (index < placeholders.length) {
              const iconRect = iconElements[index].getBoundingClientRect()
              const startCenterX = iconRect.left + iconRect.width / 2
              const startCenterY = iconRect.top + iconRect.height / 2
              const startPageX = startCenterX + window.pageXOffset
              const startPageY = startCenterY + window.pageYOffset

              const targetRect = placeholders[index].getBoundingClientRect()
              const targetCenterX2 = targetRect.left + targetRect.width / 2
              const targetCenterY2 = targetRect.top + targetRect.height / 2
              const targetPageX = targetCenterX2 + window.pageXOffset
              const targetPageY = targetCenterY2 + window.pageYOffset

              const moveX = targetPageX - startPageX
              const moveY = targetPageY - startPageY

              let currentX = 0
              let currentY = 0

              if (moveProgress <= 0.5) {
                const verticalProgress = moveProgress / 0.5
                currentY = moveY * verticalProgress
              } else {
                const horizontalProgress = (moveProgress - 0.5) / 0.5
                currentY = moveY
                currentX = moveX * horizontalProgress
              }

              const finalPageX = startPageX + currentX
              const finalPageY = startPageY + currentY

              duplicate.style.left = finalPageX - headerIconSize / 2 + 'px'
              duplicate.style.top = finalPageY - headerIconSize / 2 + 'px'
              duplicate.style.opacity = '1'
              duplicate.style.display = 'flex'
            }
          })
        } else {
          gsap.set(heroHeader, {
            transform: 'translate(-50%, calc(-50% + -100px))',
            opacity: 0,
          })

          hero.style.backgroundColor = '#e3e3db'

          gsap.set(animatedIcons, { opacity: 0 })

          if (duplicateIcons) {
            duplicateIcons.forEach((duplicate, index) => {
              if (index < placeholders.length) {
                const targetRect = placeholders[index].getBoundingClientRect()
                const targetCenterX = targetRect.left + targetRect.width / 2
                const targetCenterY = targetRect.top + targetRect.height / 2
                const targetPageX = targetCenterX + window.pageXOffset
                const targetPageY = targetCenterY + window.pageYOffset

                duplicate.style.left = targetPageX - headerIconSize / 2 + 'px'
                duplicate.style.top = targetPageY - headerIconSize / 2 + 'px'
                duplicate.style.opacity = '1'
                duplicate.style.display = 'flex'
              }
            })
          }

          textAnimationOrder.forEach((item, randomIndex) => {
            const segmentStart = 0.75 + randomIndex * 0.03
            const segmentEnd = segmentStart + 0.015

            const segmentProgress = gsap.utils.mapRange(
              segmentStart,
              segmentEnd,
              0,
              1,
              progress,
            )
            const clampedProgress = Math.max(0, Math.min(1, segmentProgress))

            gsap.set(item.segment, {
              opacity: clampedProgress,
            })
          })
        }
      },
    })

    ScrollTrigger.refresh()

    return () => {
      trigger.kill()
      clearDuplicates()
      lenis.destroy()
      gsap.ticker.remove(raf)
    }
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-header" ref={headerRef}>
        <h1>Welcome to Hogwarts</h1>
        <p>This GSAP experience was designed for use on PC</p>
      </div>

      <div className="animated-icons" ref={iconsRef}>
        {ICONS.map((src, index) => (
          <div className="animated-icon" key={src}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>

      <h1 className="animated-text" ref={textRef}>
        {LAYOUT.map((item, index) =>
          item.type === 'icon' ? (
            <div className="placeholder-icon" key={`ph-${index}`} />
          ) : (
            <span className="text-segment" key={`seg-${index}`}>
              {item.text}
            </span>
          ),
        )}
      </h1>
    </section>
  )
}
