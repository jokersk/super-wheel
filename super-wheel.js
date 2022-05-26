export default class SuperWheel {
    constructor(root) {
        this.root = root

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
        const fadeEl = new FadeElment(someEl)
        this.fadeElements.push(fadeEl)
        return fadeEl
    }
}

class FadeElment {
    constructor(el) {
        const selfRect = el.getBoundingClientRect()
        const parent = el.parentNode
        const parentRect = parent.getBoundingClientRect()
        const translateY = ((parentRect.height + selfRect.height) / 2) * -1
        parent.style.overflow = 'hidden'
        parent.style.position = 'relative'
        this.parentHeight = parentRect.height
        this.el = el
        this.parentTop = parentRect.top
        this.height = selfRect.height
        this.translateY = translateY
        this.top = selfRect.top + translateY
        this.el.style.transform = `translateY(${this.translateY}px)`
        this.callbacks = []
        // -100 : -400, -200: -300, -300: -200, -400 : -100,
        // -250 : 150 : -250
    }

    update(scrollTop) {
        const abs = Math.abs
        const currentParentTop = this.parentTop - abs(scrollTop)
        console.log(currentParentTop)
        this.el.style.transform = `translateY(${-currentParentTop}px)`

        /* for(const callback of this.callbacks) {
            callback(1)
        } */
    }

    onUpdate(callback) {
        this.callbacks.push(callback)
    }
}
