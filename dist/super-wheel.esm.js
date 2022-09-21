const m = function(s) {
  s.target.hasAttribute("super:ignore") || (s.preventDefault(), s.stopPropagation(), !(s.touches.length > 1) && (this.touch.canAnimate = !1, this.touch.speed = 0, this.touch.startY = s.touches[0].clientY, this.touch.lastX = s.touches[0].clientX, this.touch.lastY = this.touch.startY, this.touch.startAt = s.timeStamp));
}, v = function(s) {
  if (s.touches.length > 1)
    return;
  s.preventDefault(), s.stopPropagation();
  const t = this.getTouchDeltaY(s);
  t > window.innerHeight * 0.3 || this.move(t);
}, y = function(s) {
  if (s.target.hasAttribute("super:ignore") || (s.preventDefault(), s.stopPropagation(), s.touches.length > 1))
    return;
  this.touch.canAnimate = !0;
  const t = window.innerHeight * 2.5;
  let i = this.touch.speed * window.innerHeight;
  if (Math.abs(i) < 100)
    return;
  i > t && (i = t), i < -t && (i = -t);
  let e = 0, o = 0;
  function h(n, l, a, p) {
    return a * ((n = n / p - 1) * n * n + 1) + l;
  }
  const r = 100, u = () => {
    const n = h(e, 0, i, r);
    this.move(n - o), o = n, e += 1, e < r && this.touch.canAnimate && requestAnimationFrame(u);
  };
  requestAnimationFrame(u);
}, k = function(s) {
  const t = this.touch.lastX - s.touches[0].clientX, i = this.touch.lastY - s.touches[0].clientY;
  return Math.abs(t) > Math.abs(i) ? 0 : (this.touch.lastY = s.touches[0].clientY, this.touch.lastX = s.touches[0].clientX, this.touch.distance = i, this.touch.lastDuration = s.timeStamp - this.touch.lastMoveTime, this.touch.lastMoveTime = s.timeStamp, this.touch.speed = this.touch.distance / this.touch.lastDuration, i);
};
let g = [];
const b = () => ({
  listen(s) {
    g.push(s);
  },
  dispatch(s) {
    for (const t of g)
      t(s);
  },
  clear() {
    g = [];
  }
}), H = (s, t, i) => (100 / (t - s) * (i - s) / 100).toFixed(6), f = () => {
}, C = (s) => (() => {
  const i = {
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
      for (const n of Object.keys(d).reverse())
        if (n in e && window.innerWidth >= d[n]) {
          h = e[n][0], r = e[n][1];
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
      const o = {
        is: (h) => window.innerWidth >= d[h]
      };
      return this.lastRange.callback = (h) => {
        s && s(h, o), e && e(h, o);
      }, this;
    },
    fadeOut(e) {
      return this.lastRange.callback = (o) => {
        const h = +(1 - o).toFixed(2);
        s && s(h), e && e(h);
      }, this;
    },
    otherwise(e) {
      return this.otherwises.push(e), this;
    }
  };
  return b().listen(({ process: e, value: o }) => {
    let h = () => i.otherwises.forEach((n) => n());
    const r = (n, l) => {
      for (const a of Object.keys(d).reverse())
        if (n.responsive[a] && window.innerWidth >= d[a])
          return l(n.responsive[a][0], n.responsive[a][1]);
    }, u = (n) => (l, a) => {
      if (e > l && e <= a)
        return n(l, a, e);
    };
    i.ranges.forEach((n) => {
      let l = u((a, p, w) => {
        n.callback(H(a, p, w), { process: w, value: o }), h = f;
      });
      if (n.responsive) {
        r(n, l);
        return;
      }
      l(n.start, n.end);
    }), h();
  }), i;
})(), d = {
  default: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};
class c {
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
    }, this.mobile(), this.topValue = 0, this.onUpdates = [], this.totalHeight = 0, window.addEventListener("resize", this.setupRoot.bind(this)), this.getTouchDeltaY = k.bind(this), this.listeners = [], this.onScroll = b();
  }
  static debug() {
    const t = window.document.createElement("div");
    t.setAttribute("style", "position: fixed; bottom: 0; right: 0; color: white; background: black; z-index: 999"), document.body.appendChild(t), c.debugEl = t, c.updateDebug();
  }
  static updateDebug() {
    this.debugEl && (this.debugEl.textContent = c.getInstance().process.toFixed(3));
  }
  static getInstance() {
    if (!c.instance)
      throw "please create a SuperWheel instance";
    return c.instance;
  }
  static create(t, i) {
    const e = new this(t);
    return c.instance = e, i != null && i.onMounted && e.onMounted(i == null ? void 0 : i.onMounted), e.mounted(), e;
  }
  static in(...t) {
    const i = t[t.length - 1] instanceof Function ? t[t.length - 1] : () => {
    };
    return C(i).in(...t);
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
    let i = this.topValue - t;
    if (i > 0 && (i = 0), !(-i > this.totalHeight)) {
      this.topValue = i, this.updateChildTop(this.topValue), this.onScroll.dispatch({ process: this.process, value: this.topValue });
      for (const e of this.onUpdates)
        e(this);
      c.updateDebug();
    }
  }
  mobile() {
    this.root.addEventListener("touchstart", m.bind(this)), this.root.addEventListener("touchmove", v.bind(this)), this.root.addEventListener("touchend", y.bind(this));
  }
  update(t) {
    t.preventDefault(), t.stopPropagation();
    const i = t.deltaY;
    this.move(i);
  }
  onUpdate(t) {
    this.onUpdates.push(t);
  }
  fade(t, i) {
  }
  clearUp() {
    this.onUpdates = [], this.updateChildTop(0);
  }
}
export {
  c as default
};
