// =====================================================================
//  UI: scene stack, overlays, windows, typewriter dialog, cursor menus
// =====================================================================
const Scenes = {
  stack: [],
  push(s) { this.stack.push(s); Input.clear(); return s; },
  remove(s) { const i = this.stack.indexOf(s); if (i >= 0) this.stack.splice(i, 1); Input.clear(); },
  top() { return this.stack[this.stack.length - 1]; },
  replaceAll(s) { this.stack = [s]; Input.clear(); },
};
const Overlay = { fade: 0, swirl: 0, flash: 0, flashColor: '#fff', shake: 0 };
async function fadeOut(n = 18) { await tween(Overlay, 'fade', 1, n); }
async function fadeIn(n = 18) { await tween(Overlay, 'fade', 0, n); }
function flash(color = '#fff', n = 10) { Overlay.flashColor = color; Overlay.flash = 1; tween(Overlay, 'flash', 0, n); }
function shake(n = 12) { Overlay.shake = Math.max(Overlay.shake, n); }
function drawOverlay(ctx) {
  if (Overlay.swirl > 0) { // spiral of blocks closing in
    const n = 20 * 15, cnt = Math.floor(Overlay.swirl * n);
    ctx.fillStyle = '#0b0714';
    for (let i = 0; i < cnt; i++) { const p = SWIRL_ORDER[i]; ctx.fillRect(p[0] * 16, p[1] * 16, 16, 16); }
  }
  if (Overlay.flash > 0) { ctx.globalAlpha = Overlay.flash; ctx.fillStyle = Overlay.flashColor; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (Overlay.fade > 0) { ctx.globalAlpha = Overlay.fade; ctx.fillStyle = '#0b0714'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
}
const SWIRL_ORDER = (() => { // outside-in spiral over a 20x15 grid
  const out = []; let x0 = 0, y0 = 0, x1 = 19, y1 = 14;
  while (x0 <= x1 && y0 <= y1) {
    for (let x = x0; x <= x1; x++) out.push([x, y0]); y0++;
    for (let y = y0; y <= y1; y++) out.push([x1, y]); x1--;
    if (y0 <= y1) { for (let x = x1; x >= x0; x--) out.push([x, y1]); y1--; }
    if (x0 <= x1) { for (let y = y1; y >= y0; y--) out.push([x0, y]); x0++; }
  }
  return out;
})();

// ---- drawing helpers -------------------------------------------------
const UI = { gold: '#e8b84a', ink: '#f4ead2', dim: '#9a8fae', red: '#ff6a5a', green: '#7be07b', bg1: '#2a1d44', bg2: '#170f28' };
function drawWin(ctx, x, y, w, h, opt = {}) {
  x |= 0; y |= 0; w |= 0; h |= 0;
  ctx.fillStyle = '#0b0714'; ctx.fillRect(x, y, w, h);
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, opt.c1 || UI.bg1); g.addColorStop(1, opt.c2 || UI.bg2);
  ctx.fillStyle = g; ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  ctx.fillStyle = opt.border || UI.gold;
  ctx.fillRect(x + 1, y + 1, w - 2, 1); ctx.fillRect(x + 1, y + h - 2, w - 2, 1); ctx.fillRect(x + 1, y + 1, 1, h - 2); ctx.fillRect(x + w - 2, y + 1, 1, h - 2);
  ctx.fillStyle = '#6b4a1a'; ctx.fillRect(x + 2, y + 2, w - 4, 1); ctx.fillRect(x + 2, y + 2, 1, h - 4);
  ctx.fillStyle = opt.border || UI.gold;
  for (const [cx, cy] of [[x + 1, y + 1], [x + w - 2, y + 1], [x + 1, y + h - 2], [x + w - 2, y + h - 2]]) { ctx.fillRect(cx - 1, cy, 3, 1); ctx.fillRect(cx, cy - 1, 1, 3); }
}
function drawCursor(ctx, x, y, color = UI.gold) { const o = (Math.floor(Game.frames / 12) % 2); Font.draw(ctx, '▶', x + o, y, color); }
function drawBar(ctx, x, y, w, h, frac, color, back = '#3a2a4a') {
  ctx.fillStyle = '#0b0714'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = back; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color; ctx.fillRect(x, y, Math.round(w * clamp(frac, 0, 1)), h);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(x, y, Math.round(w * clamp(frac, 0, 1)), 1);
}
function hpColor(f) { return f > .5 ? '#58d858' : f > .2 ? '#f0c030' : '#f04838'; }
function typeBadge(ctx, t, x, y) {
  const w = Font.measure(t.toUpperCase()) + 6;
  ctx.fillStyle = '#0b0714'; ctx.fillRect(x - 1, y - 1, w + 2, 11);
  ctx.fillStyle = TYPE_COLOR[t] || '#888'; ctx.fillRect(x, y, w, 9);
  Font.draw(ctx, t.toUpperCase(), x + 3, y + 1, '#120b1c');
  return w + 3;
}
function drawCreature(ctx, spId, x, y, opt = {}) { // x,y = bottom centre
  const fr = creatureFrames(spId);
  const img = opt.dark ? fr.dark : opt.sil ? fr.sil : fr.frames[opt.frame !== undefined ? opt.frame : (Math.floor(Game.frames / 30) % 2)];
  const sc = opt.scale || 1, w = SPR * sc;
  ctx.save();
  if (opt.alpha !== undefined) ctx.globalAlpha = opt.alpha;
  if (opt.flip) { ctx.translate(Math.round(x), 0); ctx.scale(-1, 1); ctx.drawImage(img, Math.round(-w / 2), Math.round(y - w), w, w); }
  else ctx.drawImage(img, Math.round(x - w / 2), Math.round(y - w), w, w);
  ctx.restore();
}

// ---- dialog ----------------------------------------------------------
class DialogScene {
  constructor(texts, opt = {}) {
    this.pages = []; this.opt = opt; this.resolve = null;
    const lines = [];
    for (const t of [].concat(texts)) { const ls = Font.wrap(Font.sanitize(t, 2000), 296); for (let i = 0; i < ls.length; i += 3) this.pages.push(ls.slice(i, i + 3)); }
    this.pi = 0; this.chars = 0; this.done = false; this.choice = 0; this.waitT = 0;
  }
  get pageLen() { return this.pages[this.pi].join('').length; }
  update() {
    const sp = [0.5, 1, 2, 4][Settings.textSpeed] || 2;
    if (!this.done) {
      const before = Math.floor(this.chars); this.chars += sp;
      if (Math.floor(this.chars) !== before && Math.floor(this.chars) % 3 === 0) Sound.sfx('text');
      if (this.chars >= this.pageLen) { this.chars = this.pageLen; this.done = true; this.waitT = 0; }
      if (Input.p('a') || Input.p('b')) { this.chars = this.pageLen; this.done = true; this.waitT = 0; }
      return;
    }
    this.waitT++;
    const last = this.pi === this.pages.length - 1;
    if (last && this.opt.choices) {
      if (Input.p('up')) { this.choice = (this.choice + this.opt.choices.length - 1) % this.opt.choices.length; Sound.sfx('cursor'); }
      if (Input.p('down')) { this.choice = (this.choice + 1) % this.opt.choices.length; Sound.sfx('cursor'); }
      if (Input.p('a')) { Sound.sfx('confirm'); this.close(this.choice); }
      if (Input.p('b')) { Sound.sfx('cancel'); this.close(this.opt.choices.length - 1); }
      return;
    }
    const auto = this.opt.auto && this.waitT > this.opt.auto;
    if (Input.p('a') || Input.p('b') || auto) {
      if (!this.opt.auto) Sound.sfx('cursor');
      if (last) this.close(0); else { this.pi++; this.chars = 0; this.done = false; }
    }
  }
  close(v) { Scenes.remove(this); this.resolve && this.resolve(v); }
  draw(ctx) {
    const y = 176;
    drawWin(ctx, 0, y, W, 64);
    if (this.opt.speaker) { const sw = Font.measure(this.opt.speaker) + 12; drawWin(ctx, 6, y - 14, sw, 16); Font.draw(ctx, this.opt.speaker, 12, y - 10, UI.gold); }
    const page = this.pages[this.pi]; let left = Math.floor(this.chars);
    page.forEach((ln, i) => { const s = ln.slice(0, Math.max(0, left)); left -= ln.length; Font.draw(ctx, s, 12, y + 10 + i * 15, UI.ink, '#0b0714'); });
    if (this.done && !(this.pi === this.pages.length - 1 && this.opt.choices) && !this.opt.auto && Math.floor(Game.frames / 16) % 2) Font.draw(ctx, '▼', 300, y + 52, UI.gold);
    if (this.done && this.pi === this.pages.length - 1 && this.opt.choices) {
      const ch = this.opt.choices, w = Math.max(...ch.map(c => Font.measure(c))) + 28, h = ch.length * 13 + 10;
      drawWin(ctx, W - w - 6, y - h - 2, w, h);
      ch.forEach((c, i) => { Font.draw(ctx, c, W - w + 12, y - h + 5 + i * 13, UI.ink); if (i === this.choice) drawCursor(ctx, W - w + 2, y - h + 5 + i * 13); });
    }
  }
}
function say(texts, opt = {}) { return new Promise(r => { const d = new DialogScene(texts, opt); d.resolve = r; Scenes.push(d); }); }
async function ask(text, choices = ['Yes', 'No'], opt = {}) { return say(text, Object.assign({ choices }, opt)); }

// ---- generic cursor menu --------------------------------------------
class MenuScene {
  constructor(items, opt) {
    this.items = items.map(i => typeof i === 'string' ? { label: i } : i);
    this.opt = Object.assign({ x: 200, y: 20, w: 0, cols: 1, cancel: true, lineH: 14 }, opt);
    this.i = this.opt.start || 0; this.resolve = null;
    if (!this.opt.w) this.opt.w = Math.max(60, ...this.items.map(i => Font.measure(i.label) + (i.right ? Font.measure(i.right) + 12 : 0))) + 26;
    this.rows = Math.ceil(this.items.length / this.opt.cols);
    this.maxRows = this.opt.cols === 1 && this.opt.maxRows ? Math.min(this.opt.maxRows, this.rows) : this.rows;
    this.top = 0; this.scrollTo();
    this.opt.h = this.opt.h || this.maxRows * this.opt.lineH + 12 + (this.opt.title ? 14 : 0);
  }
  scrollTo() { if (this.i < this.top) this.top = this.i; if (this.i >= this.top + this.maxRows) this.top = this.i - this.maxRows + 1; }
  update() {
    const n = this.items.length, c = this.opt.cols; let moved = false;
    if (Input.p('up')) { this.i = (this.i - c + n) % n; moved = true; }
    if (Input.p('down')) { this.i = (this.i + c) % n; moved = true; }
    if (c > 1 && Input.p('left')) { this.i = (this.i - 1 + n) % n; moved = true; }
    if (c > 1 && Input.p('right')) { this.i = (this.i + 1) % n; moved = true; }
    if (moved) { Sound.sfx('cursor'); this.scrollTo(); this.opt.onMove && this.opt.onMove(this.i); }
    if (Input.p('a')) { if (this.items[this.i].disabled) Sound.sfx('bump'); else { Sound.sfx('confirm'); this.close(this.i); } }
    else if ((Input.p('b') || Input.p('start')) && this.opt.cancel) { Sound.sfx('cancel'); this.close(-1); }
  }
  close(v) { Scenes.remove(this); this.resolve && this.resolve(v); }
  draw(ctx) {
    const o = this.opt; drawWin(ctx, o.x, o.y, o.w, o.h);
    let y0 = o.y + 7;
    if (o.title) { Font.draw(ctx, o.title, o.x + 10, y0, UI.gold); y0 += 14; }
    const colW = (o.w - 12) / o.cols;
    if (this.maxRows < this.rows) {
      if (this.top > 0) Font.drawR(ctx, '▲', o.x + o.w - 4, o.y + 3, UI.gold);
      if (this.top + this.maxRows < this.rows) Font.drawR(ctx, '▼', o.x + o.w - 4, o.y + o.h - 10, UI.gold);
    }
    this.items.forEach((it, k) => {
      if (this.maxRows < this.rows && (k < this.top || k >= this.top + this.maxRows)) return;
      const cx = o.x + 16 + (k % o.cols) * colW, cy = y0 + Math.floor((k - (this.maxRows < this.rows ? this.top : 0)) / o.cols) * o.lineH;
      Font.draw(ctx, it.label, cx, cy, it.disabled ? UI.dim : (it.color || UI.ink));
      if (it.right) Font.drawR(ctx, it.right, o.x + o.w - 10, cy, UI.dim);
      if (k === this.i) drawCursor(ctx, cx - 10, cy);
    });
    o.extra && o.extra(ctx, this.i);
  }
}
function choose(items, opt = {}) { return new Promise(r => { const m = new MenuScene(items, opt); m.resolve = r; Scenes.push(m); }); }

// ---- custom attack text entry (HTML overlay so mobile keyboards work) ----
function promptIdea() {
  return new Promise(resolve => {
    const box = document.getElementById('ideaBox'), inp = document.getElementById('ideaInput'), cnt = document.getElementById('ideaCount');
    const ok = document.getElementById('ideaOk'), cancel = document.getElementById('ideaCancel');
    box.style.display = 'block'; inp.value = ''; cnt.textContent = '0/120'; Input.typing = true;
    setTimeout(() => inp.focus(), 30);
    const done = v => { box.style.display = 'none'; Input.typing = false; inp.blur(); inp.onkeydown = null; inp.oninput = null; ok.onclick = null; cancel.onclick = null; Input.clear(); resolve(v); };
    inp.oninput = () => { cnt.textContent = inp.value.length + '/120'; };
    inp.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); const v = inp.value.trim(); if (v) done(v.slice(0, 120)); } else if (e.key === 'Escape') { e.preventDefault(); done(null); } };
    ok.onclick = () => { const v = inp.value.trim(); if (v) done(v.slice(0, 120)); };
    cancel.onclick = () => done(null);
  });
}
