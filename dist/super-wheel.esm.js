const v = function(t) {
  t.target.hasAttribute("super:ignore") || (t.preventDefault(), t.stopPropagation(), !(t.touches.length > 1) && (this.touch.canAnimate = !1, this.touch.speed = 0, this.touch.startY = t.touches[0].clientY, this.touch.lastX = t.touches[0].clientX, this.touch.lastY = this.touch.startY, this.touch.startAt = t.timeStamp));
}, y = function(t) {
  if (t.touches.length > 1)
    return;
  t.preventDefault(), t.stopPropagation();
  const s = this.getTouchDeltaY(t);
  s > window.innerHeight * 0.3 || this.move(s);
}, k = function(t) {
  if (t.target.hasAttribute("super:ignore") || (t.preventDefault(), t.stopPropagation(), t.touches.length > 1))
    return;
  this.touch.canAnimate = !0;
  const s = window.innerHeight * 2.5;
  let n = this.touch.speed * window.innerHeight;
  if (Math.abs(n) < 100)
    return;
  n > s && (n = s), n < -s && (n = -s);
  let e = 0, o = 0;
  function h(i, c, a, p) {
    return a * ((i = i / p - 1) * i * i + 1) + c;
  }
  const r = 100, u = () => {
    const i = h(e, 0, n, r);
    this.move(i - o), o = i, e += 1, e < r && this.touch.canAnimate && requestAnimationFrame(u);
  };
  requestAnimationFrame(u);
}, H = function(t) {
  const s = this.touch.lastX - t.touches[0].clientX, n = this.touch.lastY - t.touches[0].clientY;
  return Math.abs(s) > Math.abs(n) ? 0 : (this.touch.lastY = t.touches[0].clientY, this.touch.lastX = t.touches[0].clientX, this.touch.distance = n, this.touch.lastDuration = t.timeStamp - this.touch.lastMoveTime, this.touch.lastMoveTime = t.timeStamp, this.touch.speed = this.touch.distance / this.touch.lastDuration, n);
};
let g = [];
const b = () => ({
  listen(t) {
    g.push(t);
  },
  dispatch(t) {
    for (const s of g)
      s(t);
  },
  clear() {
    g = [];
  }
}), R = (t, s, n) => (100 / (s - t) * (n - t) / 100).toFixed(6), f = () => {
}, C = (t) => (() => {
  const n = {
    ranges: [],
    otherwises: [],
    get lastRange() {
      return this.ranges[this.ranges.length - 1];
    },
    inFromObject(e) {
      if (!e.hasOwnProperty("default"))
        throw "responsive must has default key";
      const o = e;
      let h = e.default[0], r = e.default[1];
      for (const i of Object.keys(d).reverse())
        if (i in e && window.innerWidth >= d[i]) {
          h = e[i][0], r = e[i][1];
          break;
        }
      h === "auto" && (h = this.lastRange.end), typeof r == "string" && r.includes("+") && (r = h + parseFloat(r.slice(1)));
      const u = {
        start: h,
        end: r,
        callback: f,
        responsive: o
      };
      this.ranges.push(u);
    },
    in(e, o) {
      if (arguments.length === 1 && typeof e == "object")
        return this.inFromObject(e), this;
      e === "auto" && (e = this.lastRange.end), typeof o == "string" && o.includes("+") && (o = e + parseFloat(o.slice(1)));
      const h = {
        start: e,
        end: o,
        callback: f,
        responsive: null
      };
      return this.ranges.push(h), this;
    },
    once(e) {
      let o = () => {
        o = f, e();
      };
      return this.lastRange.callback = () => o(), this;
    },
    do(e) {
      return this.lastRange.callback = e, this;
    },
    fadeIn(e) {
      return this.lastRange.callback = (o) => {
        t && t(o, { is: w }), e && e(o, { is: w });
      }, this;
    },
    fadeOut(e) {
      return this.lastRange.callback = (o) => {
        const h = +(1 - o).toFixed(2);
        t && t(h), e && e(h);
      }, this;
    },
    otherwise(e) {
      return this.otherwises.push(e), this;
    }
  };
  return b().listen(({ process: e, value: o }) => {
    let h = () => n.otherwises.forEach((i) => i());
    const r = (i, c) => {
      for (const a of Object.keys(d).reverse())
        if (i.responsive[a] && window.innerWidth >= d[a])
          return c(i.responsive[a][0], i.responsive[a][1]);
    }, u = (i) => (c, a) => {
      if (e > c && e <= a)
        return i(c, a, e);
    };
    n.ranges.forEach((i) => {
      let c = u((a, p, m) => {
        i.callback(R(a, p, m), { process: m, value: o }), h = f;
      });
      if (i.responsive) {
        r(i, c);
        return;
      }
      c(i.start, i.end);
    }), h();
  }), n;
})(), w = (t) => window.innerWidth >= d[t], d = {
  default: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
}, l = class {
  constructor(t) {
    this.root = t, this.setupRoot(), this.firstChildren = null, this.setUpFirstChildren(), this.root.onwheel = this.update.bind(this), this.touch = {
      startAt: null,
      lastY: null,
      lastX: null,
      startY: null,
      distance: null,
      speed: null,
      lastMoveTime: null,
      lastDuration: null,
      canAnimate: !0
    }, this.mobile(), this.topValue = 0, this.onUpdates = [], this.totalHeight = 0, window.addEventListener("resize", () => {
      this.setupRoot(), l.onResizeListeners.forEach((s) => s({ is: w, process: this.process }));
    }), this.getTouchDeltaY = H.bind(this), this.listeners = [], this.onScroll = b();
  }
  static debug() {
    const t = window.document.createElement("div");
    t.setAttribute("style", "position: fixed; bottom: 0; right: 0; color: white; background: black; z-index: 999"), document.body.appendChild(t), l.debugEl = t, l.updateDebug();
  }
  static updateDebug() {
    this.debugEl && (this.debugEl.textContent = l.getInstance().process.toFixed(3));
  }
  static getInstance() {
    if (!l.instance)
      throw "please create a SuperWheel instance";
    return l.instance;
  }
  static create(t, s) {
    const n = new this(t);
    return l.instance = n, s != null && s.onMounted && n.onMounted(s == null ? void 0 : s.onMounted), n.mounted(), n;
  }
  static in(...t) {
    const s = t[t.length - 1] instanceof Function ? t[t.length - 1] : () => {
    };
    return C(s).in(...t);
  }
  mounted() {
    this.listeners.forEach((t) => t(this));
  }
  get process() {
    return this.totalHeight ? Math.round(Math.abs(-this.topValue / this.totalHeight) * 1e3) / 1e3 : 0;
  }
  onMounted(t) {
    this.listeners.push(t);
  }
  setTotalHeight() {
    if (this.totalHeight = this.firstChildren.getBoundingClientRect().height - window.innerHeight, !this.totalHeight)
      throw "totalHeight can not be 0";
  }
  setUpFirstChildren() {
    if (!this.root.children.length)
      throw "can not found first children of root";
    this.firstChildren = this.root.children[0], this.firstChildren.style.position = "absolute", this.firstChildren.style.left = "0px", this.firstChildren.style.width = "100%", setTimeout(() => {
      this.setTotalHeight();
    });
  }
  updateChildTop(t) {
    this.firstChildren.style.top = `${t}px`;
  }
  setupRoot() {
    const t = window.innerHeight;
    this.root.setAttribute("style", `height: ${t}px; position: fixed; overflow: hidden; width: 100%`);
  }
  move(t) {
    let s = this.topValue - t;
    if (s > 0 && (s = 0), !(-s > this.totalHeight)) {
      this.topValue = s, this.updateChildTop(this.topValue), this.onScroll.dispatch({ process: this.process, value: this.topValue });
      for (const n of this.onUpdates)
        n(this);
      l.updateDebug();
    }
  }
  mobile() {
    this.root.addEventListener("touchstart", v.bind(this)), this.root.addEventListener("touchmove", y.bind(this)), this.root.addEventListener("touchend", k.bind(this));
  }
  update(t) {
    t.preventDefault(), t.stopPropagation();
    const s = t.deltaY;
    this.move(s);
  }
  onUpdate(t) {
    this.onUpdates.push(t);
  }
  fade(t, s) {
  }
  clearUp() {
    this.onUpdates = [], this.updateChildTop(0);
  }
  static onResize(t) {
    l.onResizeListeners.push(t);
  }
};
let E = l;
E.onResizeListeners = [];
export {
  E as default
};
