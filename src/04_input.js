// =====================================================================
//  INPUT: keyboard (arrows/WASD, Z/Enter/Space = A, X/Backspace = B, Esc/C/M = MENU) + touch pad
// =====================================================================
const Input = (() => {
  const held = {}, pressed = {};
  const KEYS = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    KeyZ: 'a', Enter: 'a', Space: 'a', KeyX: 'b', Backspace: 'b', Escape: 'start', KeyC: 'start', KeyM: 'start',
    ShiftLeft: 'run', ShiftRight: 'run',
  };
  let typing = false;
  function press(k) { if (!held[k]) pressed[k] = true; held[k] = true; Sound.init(); }
  function release(k) { held[k] = false; }
  window.addEventListener('keydown', e => {
    if (typing) return;
    if (e.code === 'KeyN') { toggleMuteUI(); return; }
    const k = KEYS[e.code]; if (!k) return;
    e.preventDefault();
    if (e.repeat && (k === 'up' || k === 'down' || k === 'left' || k === 'right')) { pressed[k] = true; return; }
    if (e.repeat) return;
    press(k);
  });
  window.addEventListener('keyup', e => { const k = KEYS[e.code]; if (k) release(k); });
  window.addEventListener('blur', () => { for (const k in held) held[k] = false; });
  // touch / mouse on-screen pad
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || (window.matchMedia && matchMedia('(pointer: coarse)').matches);
  const enableTouch = () => { if (!document.body.classList.contains('touch')) { document.body.classList.add('touch'); window.dispatchEvent(new Event('resize')); } };
  if (isTouch) enableTouch();
  window.addEventListener('touchstart', enableTouch, { passive: true });
  document.querySelectorAll('.tbtn').forEach(el => {
    const k = el.dataset.k;
    const down = e => { e.preventDefault(); el.classList.add('on'); press(k); };
    const up = e => { e.preventDefault(); el.classList.remove('on'); release(k); };
    el.addEventListener('pointerdown', down); el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up); el.addEventListener('pointercancel', up);
  });
  document.getElementById('game').addEventListener('pointerdown', () => Sound.init());
  return {
    held, pressed,
    p(k) { return !!pressed[k]; },
    h(k) { return !!held[k]; },
    endFrame() { for (const k in pressed) pressed[k] = false; },
    clear() { for (const k in pressed) pressed[k] = false; },
    set typing(v) { typing = v; if (v) for (const k in held) held[k] = false; },
    get typing() { return typing; },
  };
})();
function toggleMuteUI() { Sound.init(); const m = Sound.toggleMute(); document.getElementById('mute').textContent = m ? 'x' : '♪'; }
document.getElementById('mute').addEventListener('click', e => { e.preventDefault(); toggleMuteUI(); e.target.blur(); });
document.getElementById('mute').textContent = Settings.muted ? 'x' : '♪';
