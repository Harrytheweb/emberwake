/**
 * Keyboard, pointer-lock look, and real touch on #stick / #look / buttons.
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
    this.locked = false;
    this.sens = 0.0020;
    this.touchSens = 0.0036;
    this.touching = false;
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
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    }, { passive: false });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); this.fireHeld = false; });
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

  _bindTouch() {
    const stick = document.getElementById('stick');
    const base = document.getElementById('stickbase');
    const nub = document.getElementById('sticknub');
    const lookPad = document.getElementById('look');
    let sid = null, ox = 0, oy = 0;
    const R = 48;
    const show = (el, on) => { if (el) el.classList.toggle('dn', on); };

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

    const hold = (id, set) => {
      const el = document.getElementById(id);
      el.addEventListener('touchstart', (e) => { set(true); show(el, true); e.preventDefault(); }, { passive: false });
      el.addEventListener('touchend', () => { set(false); show(el, false); });
      el.addEventListener('touchcancel', () => { set(false); show(el, false); });
    };
    hold('bfire', (v) => { this.fireHeld = v; if (v) this.fireTap = true; });
    hold('bmount', (v) => { if (v) this.mountTap = true; });
    hold('bsneak', (v) => { this.sneak = v; });
  }

  sample() {
    let x = this.move.x, y = this.move.y;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    const m = Math.hypot(x, y);
    if (m > 1) { x /= m; y /= m; }
    if (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight')) this.sneak = true;
    else if (!this.wantsTouch) this.sneak = this.sneak && this.touching ? this.sneak : (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight'));
    if (!this.wantsTouch) this.sneak = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    return { x, y, sneak: this.sneak };
  }

  consumeLook() {
    const o = { x: this.look.x, y: this.look.y };
    this.look.x = this.look.y = 0;
    return o;
  }
}
