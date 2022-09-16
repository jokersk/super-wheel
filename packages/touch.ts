type HTMLElementEvent = TouchEvent & { target: HTMLElement }
export const touchStart = function(e: HTMLElementEvent ) {
    if (e.target.hasAttribute('super:ignore')) {
        return
    }
    e.preventDefault()
    e.stopPropagation()
    if (e.touches.length > 1) return
    this.touch.canAnimate = false
    this.touch.speed = 0
    this.touch.startY = e.touches[0].clientY
    this.touch.lastX = e.touches[0].clientX
    this.touch.lastY = this.touch.startY
    this.touch.startAt = e.timeStamp
}

export const touchMove = function(e: HTMLElementEvent) {
    if (e.touches.length > 1) return
    e.preventDefault()
    e.stopPropagation()

    const distance = this.getTouchDeltaY(e)
    if (distance > window.innerHeight * 0.3) return
    this.move(distance)
}

export const touchEnd = function(e: HTMLElementEvent) {
    if (e.target.hasAttribute('super:ignore')) {
        return
    }
    e.preventDefault()
    e.stopPropagation()
    if (e.touches.length > 1) return
    this.touch.canAnimate = true
    const max = window.innerHeight * 2.5
    let offset = this.touch.speed * window.innerHeight

    if (Math.abs(offset) < 100) return
    if (offset > max) offset = max
    if (offset < -max) offset = -max

    let tick = 0
    let lastY = 0

    function easeOutCubic(t: number, b: number, c: number, d: number) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    }

    const duration = 100
    const animate = () => {
        const y = easeOutCubic(tick, 0, offset, duration)
        this.move(y - lastY)
        lastY = y
        tick += 1
        if (tick < duration && this.touch.canAnimate) {
            requestAnimationFrame(animate)
        }
    }
    requestAnimationFrame(animate)
}

export const getTouchDeltaY = function(e: HTMLElementEvent) {
    const distanceX = this.touch.lastX - e.touches[0].clientX
    const distance = this.touch.lastY - e.touches[0].clientY

    if (Math.abs(distanceX) > Math.abs(distance)) return 0

    this.touch.lastY = e.touches[0].clientY
    this.touch.lastX = e.touches[0].clientX

    this.touch.distance = distance
    this.touch.lastDuration = e.timeStamp - this.touch.lastMoveTime
    this.touch.lastMoveTime = e.timeStamp
    this.touch.speed = this.touch.distance / this.touch.lastDuration

    return distance
}
