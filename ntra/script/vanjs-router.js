var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
let protoOf = Object.getPrototypeOf;
let changedStates, derivedStates, curDeps, curNewDerives, alwaysConnectedDom = { isConnected: 1 };
let gcCycleInMs = 1e3, statesToGc, propSetterCache = {};
let objProto = protoOf(alwaysConnectedDom), funcProto = protoOf(protoOf), _undefined;
let addAndScheduleOnFirst = (set, s, f, waitMs) => (set ?? (setTimeout(f, waitMs), /* @__PURE__ */ new Set())).add(s);
let runAndCaptureDeps = (f, deps, arg) => {
  let prevDeps = curDeps;
  curDeps = deps;
  try {
    return f(arg);
  } catch (e) {
    console.error(e);
    return arg;
  } finally {
    curDeps = prevDeps;
  }
};
let keepConnected = (l) => l.filter((b) => {
  var _a;
  return (_a = b._dom) == null ? void 0 : _a.isConnected;
});
let addStatesToGc = (d) => statesToGc = addAndScheduleOnFirst(statesToGc, d, () => {
  for (let s of statesToGc)
    s._bindings = keepConnected(s._bindings), s._listeners = keepConnected(s._listeners);
  statesToGc = _undefined;
}, gcCycleInMs);
let stateProto = {
  get val() {
    var _a;
    (_a = curDeps == null ? void 0 : curDeps._getters) == null ? void 0 : _a.add(this);
    return this.rawVal;
  },
  get oldVal() {
    var _a;
    (_a = curDeps == null ? void 0 : curDeps._getters) == null ? void 0 : _a.add(this);
    return this._oldVal;
  },
  set val(v) {
    var _a;
    (_a = curDeps == null ? void 0 : curDeps._setters) == null ? void 0 : _a.add(this);
    if (v !== this.rawVal) {
      this.rawVal = v;
      this._bindings.length + this._listeners.length ? (derivedStates == null ? void 0 : derivedStates.add(this), changedStates = addAndScheduleOnFirst(changedStates, this, updateDoms)) : this._oldVal = v;
    }
  }
};
let state = (initVal) => ({
  __proto__: stateProto,
  rawVal: initVal,
  _oldVal: initVal,
  _bindings: [],
  _listeners: []
});
let bind = (f, dom) => {
  let deps = { _getters: /* @__PURE__ */ new Set(), _setters: /* @__PURE__ */ new Set() }, binding = { f }, prevNewDerives = curNewDerives;
  curNewDerives = [];
  let newDom = runAndCaptureDeps(f, deps, dom);
  newDom = (newDom ?? document).nodeType ? newDom : new Text(newDom);
  for (let d of deps._getters)
    deps._setters.has(d) || (addStatesToGc(d), d._bindings.push(binding));
  for (let l of curNewDerives) l._dom = newDom;
  curNewDerives = prevNewDerives;
  return binding._dom = newDom;
};
let derive = (f, s = state(), dom) => {
  let deps = { _getters: /* @__PURE__ */ new Set(), _setters: /* @__PURE__ */ new Set() }, listener = { f, s };
  listener._dom = dom ?? (curNewDerives == null ? void 0 : curNewDerives.push(listener)) ?? alwaysConnectedDom;
  s.val = runAndCaptureDeps(f, deps, s.rawVal);
  for (let d of deps._getters)
    deps._setters.has(d) || (addStatesToGc(d), d._listeners.push(listener));
  return s;
};
let add = (dom, ...children) => {
  for (let c of children.flat(Infinity)) {
    let protoOfC = protoOf(c ?? 0);
    let child = protoOfC === stateProto ? bind(() => c.val) : protoOfC === funcProto ? bind(c) : c;
    child != _undefined && dom.append(child);
  }
  return dom;
};
let tag = (ns, name, ...args) => {
  var _a;
  let [props, ...children] = protoOf(args[0] ?? 0) === objProto ? args : [{}, ...args];
  let dom = ns ? document.createElementNS(ns, name) : document.createElement(name);
  for (let [k, v] of Object.entries(props)) {
    let getPropDescriptor = (proto) => proto ? Object.getOwnPropertyDescriptor(proto, k) ?? getPropDescriptor(protoOf(proto)) : _undefined;
    let cacheKey = name + "," + k;
    let propSetter = propSetterCache[cacheKey] ?? (propSetterCache[cacheKey] = ((_a = getPropDescriptor(protoOf(dom))) == null ? void 0 : _a.set) ?? 0);
    let setter = k.startsWith("on") ? (v2, oldV) => {
      let event = k.slice(2);
      dom.removeEventListener(event, oldV);
      dom.addEventListener(event, v2);
    } : propSetter ? propSetter.bind(dom) : dom.setAttribute.bind(dom, k);
    let protoOfV = protoOf(v ?? 0);
    k.startsWith("on") || protoOfV === funcProto && (v = derive(v), protoOfV = stateProto);
    protoOfV === stateProto ? bind(() => (setter(v.val, v._oldVal), dom)) : setter(v);
  }
  return add(dom, children);
};
let handler = (ns) => ({ get: (_, name) => tag.bind(_undefined, ns, name) });
let update = (dom, newDom) => newDom ? newDom !== dom && dom.replaceWith(newDom) : dom.remove();
let updateDoms = () => {
  let iter = 0, derivedStatesArray = [...changedStates].filter((s) => s.rawVal !== s._oldVal);
  do {
    derivedStates = /* @__PURE__ */ new Set();
    for (let l of new Set(derivedStatesArray.flatMap((s) => s._listeners = keepConnected(s._listeners))))
      derive(l.f, l.s, l._dom), l._dom = _undefined;
  } while (++iter < 100 && (derivedStatesArray = [...derivedStates]).length);
  let changedStatesArray = [...changedStates].filter((s) => s.rawVal !== s._oldVal);
  changedStates = _undefined;
  for (let b of new Set(changedStatesArray.flatMap((s) => s._bindings = keepConnected(s._bindings))))
    update(b._dom, bind(b.f, b._dom)), b._dom = _undefined;
  for (let s of changedStatesArray) s._oldVal = s.rawVal;
};
const van = {
  tags: new Proxy((ns) => new Proxy(tag, handler(ns)), handler()),
  hydrate: (dom, f) => update(dom, bind(f, dom)),
  add,
  state,
  derive
};
const nowPath = () => {
  const path = location.pathname.slice(1) || "home";
  return path;
};
export const now = van.state(nowPath());
window.addEventListener("popstate", () => {
  now.val = nowPath();
});
class Handler {
  constructor(config) {
    __publicField(this, "rule");
    /** Route parameters received when the current route is matched */
    __publicField(this, "args", []);
    __publicField(this, "Loader");
    __publicField(this, "delayed", false);
    __publicField(this, "onFirst");
    __publicField(this, "onLoad");
    /** Root element of the route, exported for direct addition to DOM tree */
    __publicField(this, "element");
    /** Tracks if this is the first route match, determines whether to execute `onFirst` event */
    __publicField(this, "isFirstLoad", true);
    if (!config) throw new Error("config cannot be empty");
    if (!config.rule) throw new Error("rule cannot be empty");
    if (!config.Loader) throw new Error("Loader cannot be empty");
    this.rule = config.rule;
    this.Loader = config.Loader;
    this.delayed = config.delayed || false;
    this.onFirst = config.onFirst || (async () => {
    });
    this.onLoad = config.onLoad || (async () => {
    });
    this.element = this.Loader();
    this.element.hidden = true;
    van.derive(() => {
      const match = this.matchPath();
      if (!match) {
        this.hide();
      } else {
        const func = async () => {
          this.args.splice(0);
          this.args.push(...match.args);
          if (this.isFirstLoad) {
            this.isFirstLoad = false;
            await this.onFirst();
          }
          await this.onLoad();
          if (!this.delayed) this.show();
        };
        func();
      }
    });
  }
  /** Check if the current path matches this route's rule */
  matchPath() {
    if (this.rule instanceof RegExp) {
      const match = now.val.match(this.rule);
      if (!match) return false;
      return { path: now.val, args: [...match].slice(1) };
    }
    const parts = now.val.split("/").filter((i) => i.length > 0);
    if (parts.length < 1) parts.push("home");
    return parts[0] == this.rule ? { path: now.val, args: parts.slice(1) } : false;
  }
  /** Show the current route element */
  show() {
    this.element.hidden = false;
  }
  /** Hide the current route element */
  hide() {
    this.element.hidden = true;
  }
}
export const Route = (config) => new Handler(config).element;
export const goto = (name, ...args) => {
  const path = name === "home" && args.length === 0 ? "/" : `/${[name, ...args].join("/")}`;
  history.pushState(null, "", path);
  now.val = nowPath();
};
const router = { nowPath, now, Handler, Route, goto };
Object.defineProperty(window, "router", { value: router });
Object.defineProperty(window, "van", { value: van });
