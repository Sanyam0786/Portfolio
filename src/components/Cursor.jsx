import React, { useEffect, useRef } from 'react'

export default function Cursor() {
	const dotRef = useRef(null)
	const ringRef = useRef(null)
	const rafRef = useRef(null)

	useEffect(() => {
		if (typeof window === 'undefined') return
		// Disable on touch devices
		const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches
		if (isTouch) return

		const dot = dotRef.current
		const ring = ringRef.current
		let mouseX = 0
		let mouseY = 0
		let ringX = 0
		let ringY = 0

		function onMove(e) {
			const x = e.touches ? e.touches[0].clientX : e.clientX
			const y = e.touches ? e.touches[0].clientY : e.clientY
			mouseX = x
			mouseY = y
			if (dot) {
				dot.style.left = `${mouseX}px`
				dot.style.top = `${mouseY}px`
			}
		}

		function loop() {
			ringX += (mouseX - ringX) * 0.12
			ringY += (mouseY - ringY) * 0.12
			if (ring) {
				ring.style.left = `${ringX}px`
				ring.style.top = `${ringY}px`
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
		function handleOver(e) {
			if (e.target && e.target.closest && e.target.closest(interactiveSelector)) onEnterInteractive()
		}
		function handleOut(e) {
			if (e.target && e.target.closest && e.target.closest(interactiveSelector)) onLeaveInteractive()
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
			cancelAnimationFrame(rafRef.current)
		}
	}, [])

	return (
		<>
			<div ref={ringRef} className="cursor-ring" aria-hidden />
			<div ref={dotRef} className="cursor-dot" aria-hidden />
		</>
	)
}
