type Option = {
    onMounted?: Function
}
import { touchStart, touchMove, touchEnd, getTouchDeltaY } from './touch'
import { scrollEffect, onScroll, SizeMap, sizeMap, is } from './on-scroll'
type OnResizeCallBack = (payload: { is: Function; process: number }) => void
export default class SuperWheel {
    static instance?: SuperWheel | null
    static debugEl?: HTMLElement | null
    static onResizeListeners: OnResizeCallBack[] = []
    root: HTMLElement
    trap: HTMLElement
    firstChildren: HTMLElement
    touch: {}
    topValue: number
    onUpdates: Function[]
    // fadeElements: []
    totalHeight: number
    getTouchDeltaY: Function
    listeners: Function[]
    onScroll: { dispatch: Function }
    constructor(root: HTMLElement) {
        this.root = root
        // const trapRect = trap?.getBoundingClientRect()

        this.setupRoot()

        this.firstChildren = null
        this.setUpFirstChildren()

        this.root.onwheel = this.update.bind(this)

        this.touch = {
            startAt: null,
            lastY: null,
            lastX: null,
            startY: null,
            distance: null,
            speed: null,
            lastMoveTime: null,
            lastDuration: null,
            canAnimate: true
        }

        this.mobile()

        this.topValue = 0

        this.onUpdates = []

        // this.fadeElements = []

        this.totalHeight = 0

        window.addEventListener('resize', () => {
            this.setupRoot()
            SuperWheel.onResizeListeners.forEach(cb => cb({ is, process: this.process }))
        })

        this.getTouchDeltaY = getTouchDeltaY.bind(this)
        this.listeners = []
        this.onScroll = onScroll()
    }

    static debug() {
        const div = window.document.createElement('div')
        div.setAttribute('style', 'position: fixed; bottom: 0; right: 0; color: white; background: black; z-index: 999')
        document.body.appendChild(div)
        SuperWheel.debugEl = div
        SuperWheel.updateDebug()
    }

    static updateDebug() {
        if (this.debugEl) {
            this.debugEl.textContent = SuperWheel.getInstance().process.toFixed(3)
        }
    }

    static getInstance() {
        if (!SuperWheel.instance) {
            throw 'please create a SuperWheel instance'
        }
        return SuperWheel.instance
    }

    static create(root: HTMLElement, option: Option) {
        const instance = new this(root)
        SuperWheel.instance = instance
        option?.onMounted && instance.onMounted(option?.onMounted)
        instance.mounted()
        return instance
    }

    static in<T>(...params: T[]) {
        const cb: Function =
            params[params.length - 1] instanceof Function ? (params[params.length - 1] as Function) : () => {}

        return scrollEffect(cb).in(...params)
    }

    mounted() {
        this.listeners.forEach(cb => cb(this))
    }

    get process(): number {
        if (!this.totalHeight) return 0
        return Math.round(Math.abs(-this.topValue / this.totalHeight) * 1000) / 1000
    }

    onMounted(fn: Function) {
        this.listeners.push(fn)
    }

    setTotalHeight() {
        this.totalHeight = this.firstChildren.getBoundingClientRect().height - window.innerHeight
        if (!this.totalHeight) {
            throw 'totalHeight can not be 0'
        }
    }

    setUpFirstChildren() {
        if (!this.root.children.length) {
            throw 'can not found first children of root'
        }

        this.firstChildren = this.root.children[0] as HTMLElement

        this.firstChildren.style.position = 'absolute'
        this.firstChildren.style.left = '0px'
        this.firstChildren.style.width = '100%'
        setTimeout(() => {
            this.setTotalHeight()
        })
    }

    updateChildTop(top: number) {
        this.firstChildren.style.top = `${top}px`
    }

    setupRoot() {
        const windowH = window.innerHeight
        this.root.setAttribute('style', `height: ${windowH}px; position: fixed; overflow: hidden; width: 100%`)
    }

    move(distance: number) {
        let topValue = this.topValue - distance
        if (topValue > 0) topValue = 0
        if (-topValue > this.totalHeight) return
        this.topValue = topValue

        this.updateChildTop(this.topValue)

        this.onScroll.dispatch({ process: this.process, value: this.topValue })
        for (const callback of this.onUpdates) {
            callback(this)
        }

        /* for (const element of this.fadeElements) {
            element.update(this.topValue)
        } */
        SuperWheel.updateDebug()
    }

    mobile() {
        this.root.addEventListener('touchstart', touchStart.bind(this))

        this.root.addEventListener('touchmove', touchMove.bind(this))

        this.root.addEventListener('touchend', touchEnd.bind(this))
    }

    update(e: Event) {
        e.preventDefault()
        e.stopPropagation()

        const distance = e.deltaY
        this.move(distance)
    }

    onUpdate(callback: Function) {
        this.onUpdates.push(callback)
    }

    fade(someEl, options) {
        /* const fadeEl = new FadeElment(someEl, this.trap, options)
        this.fadeElements.push(fadeEl)
        return fadeEl */
    }

    clearUp() {
        // this.fadeElements.forEach(fade => fade.clearUp())
        this.onUpdates = []
        this.updateChildTop(0)
    }

    static onResize(cb: OnResizeCallBack) {
        SuperWheel.onResizeListeners.push(cb)
    }
}
