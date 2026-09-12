/**
 * Keyboard, pointer-lock look, gamepad, and real touch on #stick / #look / buttons.
 * Stick drag-up is forward so the jam hold moves the rider.
 */
export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.move = { x: 0, y: 0 };
    this.look = { x: 0, y: 0 };
    this.fireHeld = false;
    this.fireTap = false;
    this.mountTap = false;
    this.sneak = false;
    this.jumpTap = false;
    this.shopTap = false;
    this.bookTap = false;
    this.camTap = false;
    this.gaitLock = 0;
    this.aimHeld = false;
    this._gpSneak = false;
    this.locked = false;
    this.sens = 0.0020;
    this.touchSens = 0.0036;
    this.touching = false;
    this._gpPrev = {};
    this._bindKeys();
    this._bindMouse();
    this._bindTouch();
  }

  get wantsTouch() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0);
  }

  _bindKeys() {
    addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      if (e.code === 'KeyE') this.mountTap = true;
      if (e.code === 'Space') { this.jumpTap = true; e.preventDefault(); }
      if (e.code === 'KeyF') this.shopTap = true;
      if (e.code === 'KeyB') this.bookTap = true;
      if (e.code === 'KeyC') this.camTap = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    }, { passive: false });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); this.fireHeld = false; this.aimHeld = false; });
  }

  _bindMouse() {
    const c = this.canvas;
    c.addEventListener('mousedown', (e) => {
      if (!this.locked && !this.wantsTouch) { this.requestLock(); return; }
      if (e.button === 0) { this.fireHeld = true; this.fireTap = true; }
    });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.fireHeld = false; });
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.look.x -= e.movementX * this.sens;
      this.look.y -= e.movementY * this.sens;
    });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === c;
    });
  }

  requestLock() {
    if (this.wantsTouch) return;
    const p = this.canvas.requestPointerLock?.({ unadjustedMovement: true });
    if (p && p.catch) p.catch(() => this.canvas.requestPointerLock());
  }

  _mark(el, on) {
    if (el) el.classList.toggle('dn', on);
  }

  _press(el, down, up) {
    if (!el) return;
    const start = (e) => { down(); this._mark(el, true); e.preventDefault(); };
    const end = (e) => { up(); this._mark(el, false); if (e) e.preventDefault(); };
    el.addEventListener('touchstart', start, { passive: false });
    el.addEventListener('touchend', end, { passive: false });
    el.addEventListener('touchcancel', end);
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', end);
  }

  _tap(el, fn) {
    if (!el) return;
    const fire = (e) => { fn(); this._mark(el, true); setTimeout(() => this._mark(el, false), 140); e.preventDefault(); };
    el.addEventListener('touchstart', fire, { passive: false });
    el.addEventListener('mousedown', fire);
  }

  _bindTouch() {
    const stick = document.getElementById('stick');
    const base = document.getElementById('stickbase');
    const nub = document.getElementById('sticknub');
    const lookPad = document.getElementById('look');
    let sid = null, ox = 0, oy = 0;
    const R = 48;

    stick.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      sid = t.identifier; ox = t.clientX; oy = t.clientY;
      const r = stick.getBoundingClientRect();
      base.style.left = nub.style.left = (ox - r.left) + 'px';
      base.style.top = nub.style.top = (oy - r.top) + 'px';
      base.style.opacity = '.8'; nub.style.opacity = '.95';
      this.touching = true;
      e.preventDefault();
    }, { passive: false });
    stick.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier !== sid) continue;
        let dx = t.clientX - ox, dy = t.clientY - oy;
        const d = Math.hypot(dx, dy);
        if (d > R) { dx = dx / d * R; dy = dy / d * R; }
        this.move.x = dx / R;
        this.move.y = -dy / R;
        const r = stick.getBoundingClientRect();
        nub.style.left = (ox - r.left + dx) + 'px';
        nub.style.top = (oy - r.top + dy) + 'px';
      }
      e.preventDefault();
    }, { passive: false });
    const stickEnd = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier !== sid) continue;
        sid = null; this.move.x = this.move.y = 0;
        base.style.opacity = nub.style.opacity = '0';
        this.touching = false;
      }
    };
    stick.addEventListener('touchend', stickEnd);
    stick.addEventListener('touchcancel', stickEnd);

    let lid = null, lx = 0, ly = 0;
    lookPad.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      lid = t.identifier; lx = t.clientX; ly = t.clientY;
      e.preventDefault();
    }, { passive: false });
    lookPad.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier !== lid) continue;
        this.look.x -= (t.clientX - lx) * this.touchSens;
        this.look.y -= (t.clientY - ly) * this.touchSens;
        lx = t.clientX; ly = t.clientY;
      }
      e.preventDefault();
    }, { passive: false });
    lookPad.addEventListener('touchend', (e) => {
      for (const t of e.changedTouches) if (t.identifier === lid) lid = null;
    });

    this._press(document.getElementById('bfire'), () => {
      this.fireHeld = true; this.fireTap = true;
    }, () => { this.fireHeld = false; });
    this._press(document.getElementById('baim'), () => { this.aimHeld = true; }, () => { this.aimHeld = false; });
    this._tap(document.getElementById('bmount'), () => { this.mountTap = true; });
    this._tap(document.getElementById('bjump'), () => { this.jumpTap = true; });
    this._tap(document.getElementById('bshop'), () => { this.shopTap = true; });
    this._tap(document.getElementById('bbook'), () => { this.bookTap = true; });
    this._tap(document.getElementById('bcam'), () => { this.camTap = true; });

    const sneak = document.getElementById('bsneak');
    this._tap(sneak, () => {
      this.sneak = !this.sneak;
      sneak.classList.toggle('on', this.sneak);
    });

    const setGait = (v, el) => {
      this.gaitLock = this.gaitLock === v ? 0 : v;
      for (const id of ['bwalk', 'bcanter', 'bgallop']) {
        const n = document.getElementById(id);
        if (n) n.classList.toggle('on', (id === 'bwalk' && this.gaitLock === 0.3) || (id === 'bcanter' && this.gaitLock === 0.55) || (id === 'bgallop' && this.gaitLock === 1));
      }
    };
    this._tap(document.getElementById('bwalk'), () => setGait(0.3));
    this._tap(document.getElementById('bcanter'), () => setGait(0.55));
    this._tap(document.getElementById('bgallop'), () => setGait(1));
  }

  _gamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = pads && pads[0];
    if (!gp) return { x: 0, y: 0 };
    const dead = (v) => Math.abs(v) < 0.18 ? 0 : v;
    const x = dead(gp.axes[0] || 0);
    const y = -dead(gp.axes[1] || 0);
    const lx = dead(gp.axes[2] || 0);
    const ly = dead(gp.axes[3] || 0);
    if (lx) this.look.x -= lx * 0.055;
    if (ly) this.look.y -= ly * 0.045;
    const edge = (i) => {
      const now = !!(gp.buttons[i] && gp.buttons[i].pressed);
      const was = !!this._gpPrev[i];
      this._gpPrev[i] = now;
      return now && !was;
    };
    if (edge(0)) this.jumpTap = true;
    if (edge(1)) { this._gpSneak = !this._gpSneak; this.sneak = this._gpSneak; }
    if (edge(2)) this.fireTap = true;
    if (edge(3)) this.mountTap = true;
    if (edge(8)) this.bookTap = true;
    if (edge(9)) this.shopTap = true;
    if (gp.buttons[6] && gp.buttons[6].pressed) this.aimHeld = true;
    if (gp.buttons[7] && gp.buttons[7].value > 0.4) { this.fireHeld = true; if (edge(7)) this.fireTap = true; }
    return { x, y };
  }

  sample() {
    let x = this.move.x, y = this.move.y;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    const gp = this._gamepad();
    x += gp.x; y += gp.y;
    if (this.gaitLock > 0 && y >= -0.15) y = Math.max(y, this.gaitLock);
    const m = Math.hypot(x, y);
    if (m > 1) { x /= m; y /= m; }
    const shift = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    if (this.wantsTouch) {
      if (shift) this.sneak = true;
    } else {
      this.sneak = shift || this._gpSneak;
    }
    return { x, y, sneak: this.sneak };
  }

  consumeLook() {
    const o = { x: this.look.x, y: this.look.y };
    this.look.x = this.look.y = 0;
    return o;
  }
}
