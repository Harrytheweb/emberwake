/** Procedural wind, hooves, string and trade — no audio files. */
export function createAudio() {
  let ctx = null;
  const ensure = () => {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  };

  const beep = (freq, dur, type, gain) => {
    const c = ensure(); if (!c) return;
    if (c.state === 'suspended') c.resume();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.0008, c.currentTime + dur);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  };

  let hoofT = 0;
  return {
    resume() { const c = ensure(); if (c && c.state === 'suspended') c.resume(); },
    hoof(dt, speed, mounted) {
      if (!mounted || speed < 1.2) { hoofT = 0; return; }
      const cadence = Math.max(0.11, 0.46 - speed * 0.018);
      hoofT += dt;
      if (hoofT >= cadence) {
        hoofT = 0;
        beep(70 + speed * 2.2, 0.07, 'triangle', 0.045 + Math.min(0.06, speed * 0.003));
      }
    },
    loose() { beep(420, 0.08, 'square', 0.04); setTimeout(() => beep(180, 0.12, 'sine', 0.05), 40); },
    hit() { beep(140, 0.16, 'sawtooth', 0.05); },
    take() { beep(520, 0.1, 'sine', 0.05); setTimeout(() => beep(660, 0.12, 'sine', 0.04), 70); },
    shop() { beep(300, 0.1, 'triangle', 0.04); },
    win() { beep(392, 0.2, 'sine', 0.06); setTimeout(() => beep(523, 0.25, 'sine', 0.05), 180); },
  };
}
