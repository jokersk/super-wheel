export default class SuperWheel {
    constructor(root, trap) {
        this.root = root
        const trapRect = trap.getBoundingClientRect()
        this.trap = {
            top: trapRect.top,
            height: trapRect.height
        }

        this.setupRoot()

        this.setUpFirstChildren()

        this.root.onwheel = this.update.bind(this)
        this.root.ontouchmove = this.update.bind(this)

        this.topValue = 0

        this.onUpdates = []

        this.fadeElements = []

        window.addEventListener('resize', this.setupRoot.bind(this))
    }

    setUpFirstChildren() {
        this.firstChildren = this.root.children[0]

        if (!this.firstChildren) {
            throw 'can not found first children of root'
        }

        this.firstChildren.style.position = 'absolute'
    }

    updateChildTop(top) {
        this.firstChildren.style.top = `${top}px`
    }

    setupRoot() {
        const windowH = window.innerHeight
        this.root.setAttribute('style', `height: ${windowH}px; position: fixed; overflow: hidden;`)
    }

    update(e) {
        e.preventDefault()
        e.stopPropagation() 
        const y = e.wheelDelta || -e.deltaY
        let topValue = this.topValue - y
        if (topValue > 0) topValue = 0
        this.topValue = topValue

        this.updateChildTop(this.topValue)

        for (const callback of this.onUpdates) {
            callback(this.topValue)
        }

        for (const element of this.fadeElements) {
            element.update(this.topValue)
        }
    }

    onUpdate(callback) {
        this.onUpdates.push(callback)
    }

    fade(someEl) {
        const fadeEl = new FadeElment(someEl, this.trap)
        this.fadeElements.push(fadeEl)
        return fadeEl
    }
}

class FadeElment {
    constructor(el, trap) {
        const parent = el.parentNode
        parent.style.overflow = 'hidden'
        parent.style.position = 'relative'
        this.trap = trap
        this.el = el
        const oldStyle = this.el.style
        this.el.style.display = 'none'
        setTimeout(() => {
            this.el.setAttribute('style', oldStyle)
            this.top = el.getBoundingClientRect().top
            this.translateY = this.trap.top - this.top 
            this.el.style.transform = `translateY(${this.translateY}px)`
        })
        this.callbacks = []
    }

    update(scrollTop) {
        const y = this.trap.top - ( this.top + scrollTop )
        this.el.style.transform = `translateY(${y}px)`

        for(const callback of this.callbacks) {
            callback(y - this.translateY)
        }
    }

    onUpdate(callback) {
        this.callbacks.push(callback)
    }
}
