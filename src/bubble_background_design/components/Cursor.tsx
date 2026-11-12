import React, { useEffect, useRef } from 'react'

export default function Cursor(): React.JSX.Element {
	const dotRef = useRef<HTMLDivElement | null>(null)
	const ringRef = useRef<HTMLDivElement | null>(null)
	const rafRef = useRef<number | null>(null)

	useEffect(() => {
		if (typeof window === 'undefined') return
		// Disable on touch devices
		const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches
		if (isTouch) return

		const dot = dotRef.current
		const ring = ringRef.current
		let mouseX = -100
		let mouseY = -100
		let ringX = -100
		let ringY = -100
		let hasMoved = false

		function onMove(e: MouseEvent | TouchEvent) {
			const touch = 'touches' in e && e.touches.length > 0 ? e.touches[0] : null
			const x = touch ? touch.clientX : (e as MouseEvent).clientX
			const y = touch ? touch.clientY : (e as MouseEvent).clientY
			mouseX = x
			mouseY = y

			if (!hasMoved) {
				hasMoved = true
				ringX = mouseX
				ringY = mouseY
				if (dot) dot.style.opacity = '1'
				if (ring) ring.style.opacity = '1'
			}

			if (dot) {
				dot.style.left = `${mouseX}px`
				dot.style.top = `${mouseY}px`
			}
		}

		function loop() {
			if (hasMoved) {
				ringX += (mouseX - ringX) * 0.12
				ringY += (mouseY - ringY) * 0.12
				if (ring) {
					ring.style.left = `${ringX}px`
					ring.style.top = `${ringY}px`
				}
			}
			rafRef.current = requestAnimationFrame(loop)
		}

		function onDown() {
			if (dot) dot.classList.add('cursor-active')
			if (ring) ring.classList.add('cursor-active')
		}
		function onUp() {
			if (dot) dot.classList.remove('cursor-active')
			if (ring) ring.classList.remove('cursor-active')
		}

		function onEnterInteractive() {
			if (dot) dot.classList.add('cursor-hover')
			if (ring) ring.classList.add('cursor-hover')
		}
		function onLeaveInteractive() {
			if (dot) dot.classList.remove('cursor-hover')
			if (ring) ring.classList.remove('cursor-hover')
		}

		document.addEventListener('mousemove', onMove)
		document.addEventListener('mousedown', onDown)
		document.addEventListener('mouseup', onUp)

		const interactiveSelector = 'a,button,[data-cursor],.project-card'
		function handleOver(e: MouseEvent) {
			const target = e.target as HTMLElement | null
			if (target && target.closest && target.closest(interactiveSelector)) onEnterInteractive()
		}
		function handleOut(e: MouseEvent) {
			const target = e.target as HTMLElement | null
			if (target && target.closest && target.closest(interactiveSelector)) onLeaveInteractive()
		}
		document.addEventListener('mouseover', handleOver)
		document.addEventListener('mouseout', handleOut)

		rafRef.current = requestAnimationFrame(loop)

		return () => {
			document.removeEventListener('mousemove', onMove)
			document.removeEventListener('mousedown', onDown)
			document.removeEventListener('mouseup', onUp)
			document.removeEventListener('mouseover', handleOver)
			document.removeEventListener('mouseout', handleOut)
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
		}
	}, [])

	return (
		<>
			<div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden />
			<div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden />
		</>
	)
}
