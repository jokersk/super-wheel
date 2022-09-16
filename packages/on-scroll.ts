type ScrollEvent = {
    process: number
    value: number
}
let listeners: Function[] = []
export const onScroll = () => {
    return {
        listen(fn: Function) {
            listeners.push(fn)
        },
        dispatch(e: ScrollEvent) {
            for (const fn of listeners) {
                fn(e)
            }
        },
        clear() {
            listeners = []
        }
    }
}

// from 0 to 1
const getPrecent = (min: number, max: number, current: number) => {
    return (((100 / (max - min)) * (current - min)) / 100).toFixed(6)
}

const emptyFunc = () => {}

export const scrollEffect = (cb?: Function | null) => {
    const initHandler = () => {
        const handler = {
            ranges: [],
            otherwises: [],
            get lastRange() {
                return this.ranges[this.ranges.length - 1]
            },
            inFromObject(obj) {
                if (!obj.hasOwnProperty('default')) {
                    throw 'responsive must has default key'
                }

                const responsive = obj

                let start = obj.default[0]
                let end = obj.default[1]

                for (const key of Object.keys(sizeMap).reverse()) {
                    if (key in obj && window.innerWidth >= sizeMap[key]) {
                        start = obj[key][0]
                        end = obj[key][1]
                        break
                    }
                }

                if (start === 'auto') {
                    start = this.lastRange.end
                }
                if (typeof end === 'string' && end.includes('+')) {
                    end = start + parseFloat(end.slice(1))
                }

                const range = {
                    start,
                    end,
                    callback: emptyFunc,
                    responsive
                }
                this.ranges.push(range)
            },
            in(start: {} | string, end?: string | number) {
                if (arguments.length === 1 && typeof start === 'object') {
                    this.inFromObject(start)
                    return this
                }
                if (start === 'auto') {
                    start = this.lastRange.end
                }
                if (typeof end === 'string' && end.includes('+')) {
                    end = (start as number) + parseFloat(end.slice(1))
                }
                const range = {
                    start,
                    end,
                    callback: emptyFunc,
                    responsive: null
                }
                this.ranges.push(range)
                return this
            },
            once(fn: Function) {
                let func = () => {
                    func = emptyFunc
                    fn()
                }
                this.lastRange.callback = () => func()
                return this
            },
            do(fn: Function) {
                this.lastRange.callback = fn
                return this
            },
            fadeIn(onFadeIn?: Function) {
                this.lastRange.callback = (ratio: number) => {
                    cb && cb(ratio)
                    onFadeIn && onFadeIn(ratio)
                }
                return this
            },
            fadeOut(onFadeOut?: Function) {
                this.lastRange.callback = (ratio: number)=> {
                    const payload: number = +(1 - ratio).toFixed(2)
                    cb && cb(payload)
                    onFadeOut && onFadeOut(payload)
                }
                return this
            },
            otherwise(fn: Function) {
                this.otherwises.push(fn)
                return this
            }
        }
        onScroll().listen(({ process, value }) => {
            let otherwise = () => handler.otherwises.forEach(fn => fn())

            const handleReponsive = (range, callback) => {
                for (const key of Object.keys(sizeMap).reverse()) {
                    if (range.responsive[key] && window.innerWidth >= sizeMap[key]) {
                        return callback(range.responsive[key][0], range.responsive[key][1])
                    }
                }
            }

            const handleRange = handler => (start, end) => {
                if (process > start && process <= end) {
                    return handler(start, end, process)
                }
            }

            handler.ranges.forEach(range => {
                let handler = handleRange((start, end, process) => {
                    range.callback(getPrecent(start, end, process), { process, value })
                    otherwise = emptyFunc
                })

                if (range.responsive) {
                    handleReponsive(range, handler)
                    return
                }

                handler(range.start, range.end)
            })
            otherwise()
        })
        return handler
    }

    return initHandler()
}

const sizeMap = {
    default: 0,
    sm: 640,

    md: 768,

    lg: 1024,

    xl: 1280,

    '2xl': 1536
}
