// =====================================================================
//  BATTLE SYSTEM
// =====================================================================
const POS = { e: { x: 236, y: 108 }, p: { x: 84, y: 172 } };
const stageMult = s => s >= 0 ? (2 + s) / 2 : 2 / (2 - s);
function initB(c) { c.b = { st: { atk: 0, def: 0, spd: 0 }, shield: null, bind: 0, stun: false, stunImm: 0, sleep: 0, burn: 0, poison: 0 }; }
function spd(c) { return stat(c, 'spd') * stageMult(c.b.st.spd); }

const BG_CACHE = {};
function battleBG(kind) {
  if (BG_CACHE[kind]) return BG_CACHE[kind];
  const c = mkCanvas(W, H), x = c.getContext('2d'), r = mulberry32(hashStr(kind));
  if (kind === 'hall' || kind === 'palace') {
    const pal = kind === 'hall' ? ['#3a0e08', '#8a2a10', '#ff7a1a'] : ['#1a1450', '#4a3a9a', '#ffd040'];
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal[0]); g.addColorStop(1, pal[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) { const px = 10 + i * 60; x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(px, 0, 22, 140); x.fillStyle = pal[2]; x.globalAlpha = .35; x.fillRect(px, 0, 22, 4); x.fillRect(px, 130, 22, 6); x.globalAlpha = 1; }
    x.fillStyle = 'rgba(0,0,0,.3)'; x.fillRect(0, 140, W, 100);
  } else {
    const g = x.createLinearGradient(0, 0, 0, 150); g.addColorStop(0, '#5fa8e8'); g.addColorStop(1, '#f8dcb0'); x.fillStyle = g; x.fillRect(0, 0, W, 150);
    x.fillStyle = '#fff4d0'; x.beginPath(); x.arc(270, 34, 14, 0, 7); x.fill();
    for (let i = 0; i < 5; i++) { x.fillStyle = 'rgba(255,255,255,.7)'; const cx = r() * W, cy = 20 + r() * 50; x.beginPath(); x.ellipse(cx, cy, 22, 6, 0, 0, 7); x.ellipse(cx + 12, cy - 4, 14, 6, 0, 0, 7); x.fill(); }
    // distant temple and palms
    x.fillStyle = '#8aa0b8'; x.beginPath(); x.moveTo(0, 120); for (let i = 0; i <= W; i += 20) x.lineTo(i, 108 + r() * 14); x.lineTo(W, 150); x.lineTo(0, 150); x.fill();
    x.fillStyle = '#6a7f98'; x.fillRect(40, 92, 26, 30); x.beginPath(); x.moveTo(36, 94); x.quadraticCurveTo(53, 60, 70, 94); x.fill(); x.fillRect(51, 58, 4, 8);
    x.fillStyle = '#4a8a4a'; x.fillRect(0, 128, W, 112);
    x.fillStyle = '#5aa04a'; for (let i = 0; i < 60; i++) x.fillRect(r() * W, 130 + r() * 110, 3, 1);
    for (const px of [150, 300, 12]) { x.fillStyle = '#4a3a24'; x.fillRect(px, 96, 3, 34); x.fillStyle = '#2f6a34'; for (let k = 0; k < 5; k++) { x.beginPath(); x.ellipse(px + 1 + Math.cos(k * 1.3) * 8, 96 + Math.sin(k * 1.3) * 3, 10, 3, k * 1.3, 0, 7); x.fill(); } }
  }
  // platforms
  const plat = (cx, cy, rx, ry) => { x.fillStyle = 'rgba(0,0,0,.25)'; x.beginPath(); x.ellipse(cx, cy + 3, rx, ry, 0, 0, 7); x.fill(); x.fillStyle = kind === 'route' ? '#7ab858' : '#c8a868'; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); x.fill(); x.fillStyle = kind === 'route' ? '#9ad070' : '#e8c888'; x.beginPath(); x.ellipse(cx, cy - 2, rx - 6, ry - 3, 0, 0, 7); x.fill(); };
  plat(POS.e.x, POS.e.y - 4, 48, 11); plat(POS.p.x, POS.p.y - 4, 54, 12);
  return BG_CACHE[kind] = c;
}

const TYPE_FX = {
  Ember: ['#ff5a1f', '#ffd040', '#ff9f1a'], Tide: ['#3a7bff', '#9fd0ff', '#ffffff'], Grove: ['#46c35a', '#9be060', '#2f8a3a'], Stone: ['#b58a52', '#7a5a32', '#d8b07a'],
  Sky: ['#ffffff', '#9fe4ff', '#d8f4ff'], Shade: ['#8a5bd4', '#3a1f6a', '#c8a0ff'], Light: ['#ffe36a', '#ffffff', '#fff0a0'], Storm: ['#20d6c8', '#ffff80', '#ffffff'], Neutral: ['#ffffff', '#f4ead2', '#c8c0b0'],
};

class BattleScene {
  constructor(cfg) {
    this.cfg = cfg; this.kind = cfg.kind; this.tr = cfg.trainerId ? TRAINERS[cfg.trainerId] : null;
    this.foes = cfg.team; this.ei = 0; this.pi = firstAlive();
    this.opaque = true; this.parts = []; this.floats = []; this.proj = [];
    this.anim = { p: { dx: -300, dy: 0, alpha: 1, sil: 0, scale: 1, blink: 0, hide: false }, e: { dx: 300, dy: 0, alpha: 1, sil: 0, scale: 1, blink: 0, hide: false } };
    this.hpShow = { p: 0, e: 0 }; this.xpShow = 0;
    this.custom = { used: 0, cd: 0 }; this.terrain = null; this.parts4 = new Set(); this.runTries = 0;
    this.prompt = ''; this.thinking = false; this.result = null; this.trainerSprite = null; this.orb = null; this.leveled = new Set();
    this.bg = battleBG(cfg.bg || 'route');
    Game.party.forEach(initB); this.foes.forEach(initB);
  }
  get P() { return Game.party[this.pi]; }
  get E() { return this.foes[this.ei]; }
  label(c, side) { return side === 'e' ? (this.kind === 'wild' ? 'Wild ' : 'Foe ') + cName(c) : cName(c); }
  msg(t, auto = 50) { return say(t, { auto }); }
  // ---------------- frame update / draw ----------------
  update() {
    for (const s of ['p', 'e']) if (this.anim[s].blink > 0) this.anim[s].blink--;
    for (const q of this.parts) { q.x += q.vx; q.y += q.vy; q.vy += q.g || 0; q.life--; }
    this.parts = this.parts.filter(q => q.life > 0);
    for (const f of this.floats) { f.y -= .5; f.life--; }
    this.floats = this.floats.filter(f => f.life > 0);
    for (const pr of this.proj) pr.t++;
    if (this.P) this.hpShow.p += (this.P.hp - this.hpShow.p) * .15;
    if (this.E) this.hpShow.e += (this.E.hp - this.hpShow.e) * .15;
  }
  drawMon(ctx, side) {
    const c = side === 'p' ? this.P : this.E, a = this.anim[side]; if (!c || a.hide) return;
    if (a.blink && (a.blink % 6) < 3) return;
    const sp = SPECIES[c.sp], bob = sp.art.tpl === 'spirit' ? Math.sin(Game.frames / 14) * 2 : 0;
    const x = POS[side].x + a.dx, y = POS[side].y + a.dy + bob;
    if (c.b && c.b.shield) { ctx.globalAlpha = .28 + .1 * Math.sin(Game.frames / 6); ctx.fillStyle = TYPE_COLOR.Tide; ctx.beginPath(); ctx.ellipse(x, y - 30, 38, 36, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = '#bfe8ff'; ctx.beginPath(); ctx.ellipse(x, y - 30, 38, 36, 0, 0, 7); ctx.stroke(); }
    const opt = { flip: side === 'p', alpha: a.alpha, scale: a.scale };
    if (a.scale !== 1) { drawCreature(ctx, c.sp, x, y, opt); }
    else drawCreature(ctx, c.sp, x, y, opt);
    if (a.sil > 0) drawCreature(ctx, c.sp, x, y, Object.assign({}, opt, { sil: true, alpha: a.sil * a.alpha }));
  }
  draw(ctx) {
    ctx.drawImage(this.bg, 0, 0);
    if (this.terrain) { ctx.globalAlpha = .18; ctx.fillStyle = TYPE_COLOR[this.terrain.type]; ctx.fillRect(0, 120, W, 56); ctx.globalAlpha = 1; }
    if (this.trainerSprite) { const t = this.trainerSprite; ctx.save(); if (t.aura) { ctx.globalAlpha = .4 + .2 * Math.sin(Game.frames / 8); ctx.fillStyle = t.aura; ctx.beginPath(); ctx.arc(t.x, 70, 34, 0, 7); ctx.fill(); ctx.globalAlpha = 1; } ctx.drawImage(personFrames(t.look).down[0], t.x - 24, 44 - 8, 48, 48); ctx.restore(); }
    this.drawMon(ctx, 'e'); this.drawMon(ctx, 'p');
    if (this.orb) drawOrb(ctx, this.orb.x, this.orb.y, this.orb.id, this.orb.rot || 0);
    for (const pr of this.proj) { const t = Math.min(1, pr.t / pr.dur), x = lerp(pr.x0, pr.x1, t), y = lerp(pr.y0, pr.y1, t) - Math.sin(t * Math.PI) * 18; const cs = TYPE_FX[pr.type]; ctx.fillStyle = cs[0]; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); ctx.fillStyle = cs[1]; ctx.beginPath(); ctx.arc(x - 1, y - 1, 2.5, 0, 7); ctx.fill(); }
    for (const q of this.parts) { ctx.globalAlpha = Math.min(1, q.life / 15); ctx.fillStyle = q.c; if (q.bolt) { ctx.fillRect(q.x, q.y, q.w || 2, q.h || 2); } else ctx.fillRect(Math.round(q.x), Math.round(q.y), q.s, q.s); }
    ctx.globalAlpha = 1;
    if (this.bolt) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); this.bolt.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.strokeStyle = '#20d6c8'; ctx.lineWidth = 1; ctx.stroke(); }
    this.drawBoxes(ctx);
    for (const f of this.floats) { Font.drawBig(ctx, f.text, f.x - Font.measure(f.text), f.y, f.color, 2, '#0b0714'); }
    if (this.terrain) { const s = `${this.terrain.type} Terrain (${this.terrain.turns})`; drawWin(ctx, 160 - Font.measure(s) / 2 - 8, 48, Font.measure(s) + 16, 15); Font.drawC(ctx, s, 160, 52, TYPE_COLOR[this.terrain.type]); }
    if (Scenes.top() === this || this.state === 'menu' || this.thinking) {
      drawWin(ctx, 0, 176, W, 64);
      const t = this.thinking ? 'The spirits weigh your idea' + '...'.slice(0, (Game.frames >> 4) % 4) : this.prompt;
      Font.wrap(t, this.state === 'menu' ? 150 : 296).forEach((ln, i) => Font.draw(ctx, ln, 12, 188 + i * 13, UI.ink, '#0b0714'));
    }
  }
  drawBoxes(ctx) {
    const E = this.E, P = this.P;
    if (E && !this.anim.e.hide && this.anim.e.dx > -200) {
      drawWin(ctx, 6, 8, 150, 38);
      Font.draw(ctx, cName(E), 14, 14, UI.ink); Font.drawR(ctx, 'Lv' + E.lv, 148, 14, UI.gold);
      let bx = 14; for (const t of SPECIES[E.sp].types) bx += typeBadge(ctx, t, bx, 25) + 1;
      Font.draw(ctx, 'HP', bx + 2, 26, UI.gold);
      drawBar(ctx, bx + 16, 27, 146 - bx - 18, 4, this.hpShow.e / maxHP(E), hpColor(this.hpShow.e / maxHP(E)));
      this.statusTags(ctx, E, 14, 36);
      if (this.kind === 'wild' && Game.tamed[E.sp]) Font.draw(ctx, '★', 140, 36, UI.gold);
    }
    if (P && !this.anim.p.hide && this.anim.p.dx > -200) {
      drawWin(ctx, 164, 118, 152, 54);
      Font.draw(ctx, cName(P), 172, 124, UI.ink); Font.drawR(ctx, 'Lv' + P.lv, 308, 124, UI.gold);
      Font.draw(ctx, 'HP', 172, 136, UI.gold); drawBar(ctx, 188, 137, 120, 4, this.hpShow.p / maxHP(P), hpColor(this.hpShow.p / maxHP(P)));
      Font.drawR(ctx, `${Math.max(0, Math.round(this.hpShow.p))}/${maxHP(P)}`, 308, 144, UI.ink);
      Font.draw(ctx, 'EN', 172, 153, '#7fe0ff'); drawBar(ctx, 188, 155, 60, 2, P.en / maxEN(P), '#40c8ff');
      Font.draw(ctx, 'XP', 254, 153, '#9fa0ff');
      const lo = xpForLevel(P.lv), hi = xpForLevel(P.lv + 1); drawBar(ctx, 268, 155, 40, 2, P.lv >= LEVEL_CAP ? 1 : (P.xp - lo) / (hi - lo), '#6a7aff');
      this.statusTags(ctx, P, 172, 144);
    }
  }
  statusTags(ctx, c, x, y) {
    if (!c.b) return;
    const tags = [];
    if (c.b.burn) tags.push(['BRN', '#ff7a3a']); if (c.b.poison) tags.push(['PSN', '#b060e0']); if (c.b.sleep) tags.push(['SLP', '#8a9ab8']);
    if (c.b.stun) tags.push(['STN', '#f0d030']); if (c.b.bind) tags.push(['BND', '#5ab060']); if (c.b.shield) tags.push(['SHD', '#6ac8ff']);
    for (const s of ['atk', 'def', 'spd']) if (c.b.st[s]) tags.push([s.toUpperCase() + (c.b.st[s] > 0 ? '+' : '') + c.b.st[s], c.b.st[s] > 0 ? '#7be07b' : '#ff8a7a']);
    let cx = x;
    for (const [t, col] of tags.slice(0, 4)) { const w = Font.measure(t) + 4; ctx.fillStyle = col; ctx.fillRect(cx, y - 1, w, 9); Font.draw(ctx, t, cx + 2, y, '#120b1c'); cx += w + 2; }
  }
  // ---------------- effects helpers ----------------
  emit(side, type, n = 22, kind = 'burst') {
    const cs = TYPE_FX[type] || TYPE_FX.Neutral, cx = POS[side].x + this.anim[side].dx, cy = POS[side].y - 30;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 2.5, c = pick(cs);
      let q = { x: cx + (Math.random() - .5) * 20, y: cy + (Math.random() - .5) * 20, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 25 + Math.random() * 15, c, s: 2 + (Math.random() * 2 | 0) };
      if (kind === 'up') { q.vx *= .3; q.vy = -1 - Math.random() * 1.5; q.y += 20; }
      if (kind === 'down') { q.vx *= .3; q.vy = 1 + Math.random(); q.y -= 30; }
      if (type === 'Ember' && kind === 'burst') { q.vy = -Math.abs(q.vy) - .5; q.g = -.02; }
      if (type === 'Tide' && kind === 'burst') q.g = .15;
      if (type === 'Stone' && kind === 'burst') { q.y = cy - 60 - Math.random() * 30; q.vy = 2 + Math.random() * 2; q.vx *= .2; q.s = 3 + (Math.random() * 2 | 0); q.g = .2; }
      if (type === 'Sky' && kind === 'burst') { q.vx = (side === 'e' ? 1 : -1) * (3 + Math.random() * 3); q.vy *= .2; q.bolt = true; q.w = 6; q.h = 1; }
      this.parts.push(q);
    }
  }
  async attackFX(type, from, to) {
    const a = this.anim[from];
    await tween(a, 'dx', (from === 'p' ? 10 : -10), 5); tween(a, 'dx', 0, 6);
    if (type === 'Storm') {
      const tx = POS[to].x + this.anim[to].dx, pts = [[tx + 10, 0]]; let y = 0;
      while (y < POS[to].y - 30) { y += 14; pts.push([tx + (Math.random() - .5) * 24, y]); }
      this.bolt = pts; flash('#ffffff', 8); Sound.sfx('thunder'); await wait(10); this.bolt = null;
    } else if (type === 'Stone') { /* rocks fall from above */ }
    else {
      const pr = { x0: POS[from].x, y0: POS[from].y - 30, x1: POS[to].x, y1: POS[to].y - 30, t: 0, dur: 16, type };
      this.proj.push(pr); await wait(16); this.proj = this.proj.filter(p => p !== pr);
    }
    this.emit(to, type, 26);
  }
  async hit(t, side, dmg, eff, crit) {
    this.anim[side].blink = 24;
    Sound.sfx(crit ? 'crit' : eff > 1 ? 'crit' : eff < 1 ? 'weak' : 'hit');
    shake(crit || eff > 1 ? 14 : 8);
    this.floats.push({ text: String(dmg), x: POS[side].x + 12 + Font.measure(String(dmg)), y: POS[side].y - 64, color: crit ? '#ffd040' : eff > 1 ? '#ff7a5a' : '#ffffff', life: 50 });
    t.hp = Math.max(0, t.hp - dmg);
    await wait(28);
  }
  // ---------------- main flow ----------------
  async run() {
    Sound.play(this.tr ? this.tr.music : 'battle');
    await this.intro();
    while (!this.result) {
      this.custom.cd = Math.max(0, this.custom.cd);
      const act = await this.chooseAction();
      await this.resolveTurn(act);
    }
    return this.result;
  }
  async intro() {
    const E = this.E; markSeen(E.sp);
    if (this.tr) {
      const look = LOOKS[this.cfg.trainerId === 'rohan' ? 'pilgrim' : this.cfg.trainerId];
      this.trainerSprite = { look, x: 400, aura: this.tr.god ? '#9fe4ff' : this.tr.lieutenant ? '#ff7a1a' : null };
      this.anim.e.hide = true;
      tween(this.anim.p, 'dx', 0, 30); await tween(this.trainerSprite, 'x', 236, 30);
      if (this.tr.god) { Sound.sfx('thunder'); flash('#ffffff', 16); shake(20); }
      await this.msg(`${this.tr.title} ${this.tr.name} wants to battle!`, 60);
      await tween(this.trainerSprite, 'x', 400, 20); this.trainerSprite = null;
      await this.sendOut('e', true);
    } else {
      this.anim.p.dx = -300; tween(this.anim.p, 'dx', 0, 30); await tween(this.anim.e, 'dx', 0, 30);
      this.hpShow.e = E.hp;
      await this.msg(`A wild ${cName(E)} appeared!`, 50);
    }
    this.anim.p.hide = true;
    await this.sendOut('p', true);
  }
  async sendOut(side, first) {
    const c = side === 'p' ? this.P : this.E, a = this.anim[side];
    if (side === 'p') { this.parts4.add(c.uid); this.hpShow.p = c.hp; if (this.E && this.E.b) this.E.b.bind = 0; }
    else { markSeen(c.sp); this.hpShow.e = c.hp; if (this.P && this.P.b) this.P.b.bind = 0; }
    if (side === 'e' && this.tr && !first) await this.msg(`${this.tr.name} sent out ${cName(c)}!`, 40);
    if (side === 'p') await this.msg(`Go, ${cName(c)}${c.mythic ? ' ' + c.mythic.epithet : ''}!`, 30);
    a.hide = false; a.dx = 0; a.dy = 0; a.alpha = 1; a.sil = 1; a.scale = 1;
    Sound.sfx('magic'); this.emit(side, 'Light', 14);
    await tween(a, 'sil', 0, 20);
    if (side === 'e' && c.sp === 'airavat' && this.tr && this.tr.sigLine) { Sound.sfx('thunder'); flash('#ffffff', 14); shake(18); await this.msg(this.tr.sigLine, 70); }
  }
  async chooseAction() {
    const P = this.P;
    while (true) {
      this.state = 'menu'; this.prompt = `What will ${cName(P)} do?`;
      const cleft = CA.MAX_PER_BATTLE - this.custom.used;
      const items = [{ label: 'FIGHT' }, { label: 'CUSTOM', color: cleft > 0 && !this.custom.cd ? '#ffd040' : UI.dim }, { label: 'BAG' }, { label: 'TAME', color: this.tr ? UI.dim : UI.ink }, { label: 'SWITCH' }, { label: 'RUN', color: this.tr ? UI.dim : UI.ink }];
      const i = await choose(items, { x: 166, y: 176, w: 154, h: 64, cols: 2, cancel: false, lineH: 16, start: this.lastMenu || 0 });
      this.lastMenu = i; this.state = '';
      if (i === 0) { const a = await this.fightMenu(); if (a) return a; }
      if (i === 1) { const a = await this.customMenu(); if (a) return a; }
      if (i === 2) { const a = await this.bagMenu(); if (a) return a; }
      if (i === 3) { if (this.tr) { await this.msg('You cannot tame another Tamer\'s companion!'); continue; } const a = await this.tameMenu(); if (a) return a; }
      if (i === 4) { const idx = await this.partyPick(false); if (idx >= 0) return { t: 'switch', idx }; }
      if (i === 5) { if (this.tr) { await this.msg('There is no running from a trial!'); continue; } return { t: 'run' }; }
    }
  }
  async fightMenu() {
    const P = this.P;
    if (P.moves.every(m => m.pp <= 0)) return { t: 'move', i: -1 };
    const items = P.moves.map(m => ({ label: MOVES[m.id].name, color: m.pp > 0 ? UI.ink : UI.dim }));
    const extra = (ctx, i) => { const m = P.moves[i], mv = MOVES[m.id]; drawWin(ctx, 222, 176, 98, 64); typeBadge(ctx, mv.type, 230, 184); Font.draw(ctx, `PP ${m.pp}/${mv.pp}`, 230, 198, UI.ink); Font.draw(ctx, mv.pow ? `POW ${mv.pow}` : 'STATUS', 230, 210, UI.dim); Font.draw(ctx, `ACC ${mv.acc}`, 230, 222, UI.dim); };
    while (true) {
      const i = await choose(items, { x: 0, y: 176, w: 222, h: 64, cols: 2, lineH: 18, extra });
      if (i < 0) return null;
      if (P.moves[i].pp <= 0) { await this.msg('No PP left for that move!'); continue; }
      return { t: 'move', i };
    }
  }
  async customMenu() {
    const P = this.P;
    if (this.custom.used >= CA.MAX_PER_BATTLE) { await this.msg(`You have used all ${CA.MAX_PER_BATTLE} custom attacks this battle.`); return null; }
    if (this.custom.cd > 0) { await this.msg(`Custom attacks are cooling down (${this.custom.cd} more turn${this.custom.cd > 1 ? 's' : ''}).`); return null; }
    const idea = await promptIdea();
    if (!idea) return null;
    this.thinking = true;
    const summary = { you: { name: cName(P), hpPct: Math.round(P.hp / maxHP(P) * 100), en: P.en }, foe: { name: cName(this.E), types: SPECIES[this.E.sp].types, level: this.E.lv, hpPct: Math.round(this.E.hp / maxHP(this.E) * 100) }, customLeft: CA.MAX_PER_BATTLE - this.custom.used };
    const [mv] = await Promise.all([generateCustomAttack(idea, P, summary), wait(40)]);
    this.thinking = false;
    const ok = await previewCard(mv, P);
    if (!ok) return null;
    if (P.en < mv.cost) { await this.msg(`${cName(P)} needs ${mv.cost} EN but only has ${P.en}.`); return null; }
    return { t: 'custom', mv };
  }
  async bagMenu() {
    const ids = Object.keys(Game.bag).filter(k => !ITEMS[k].orb && Game.bag[k] > 0);
    if (!ids.length) { await this.msg('No usable items in your bag.'); return null; }
    const i = await choose(ids.map(k => ({ label: ITEMS[k].name, right: 'x' + Game.bag[k] })), { x: 120, y: 20, w: 196, title: 'BAG', extra: (ctx, i) => { drawWin(ctx, 0, 176, W, 64); Font.wrap(ITEMS[ids[i]].desc, 296).forEach((l, k) => Font.draw(ctx, l, 12, 188 + k * 13, UI.ink)); } });
    if (i < 0) return null;
    const id = ids[i];
    const t = await this.partyPick(true, `Use ${ITEMS[id].name} on?`);
    if (t < 0) return null;
    const c = Game.party[t], it = ITEMS[id];
    if (it.use === 'revive' ? c.hp > 0 : c.hp <= 0) { await this.msg(it.use === 'revive' ? 'It isn\'t fainted.' : 'It has fainted - only a Sanjivani Herb can help.'); return null; }
    return { t: 'item', id, target: t };
  }
  async tameMenu() {
    const ids = Object.keys(Game.bag).filter(k => ITEMS[k].orb && Game.bag[k] > 0);
    if (!ids.length) { await this.msg('You have no orbs! Buy some at the Bazaar.'); return null; }
    const i = await choose(ids.map(k => ({ label: ITEMS[k].name, right: 'x' + Game.bag[k] })), { x: 120, y: 20, w: 196, title: 'ORBS', extra: (ctx, i) => { drawWin(ctx, 0, 176, W, 64); Font.wrap(ITEMS[ids[i]].desc, 296).forEach((l, k) => Font.draw(ctx, l, 12, 188 + k * 13, UI.ink)); } });
    if (i < 0) return null;
    return { t: 'tame', id: ids[i] };
  }
  async partyPick(any, title) {
    const items = Game.party.map((c, k) => ({ label: `${cName(c)} Lv${c.lv}${k === this.pi ? ' *' : ''}`, right: `${c.hp}/${maxHP(c)}`, color: c.hp <= 0 ? UI.red : UI.ink }));
    while (true) {
      const i = await choose(items, { x: 40, y: 16, w: 240, title: title || 'Switch to which companion?' });
      if (i < 0) return -1;
      if (any) return i;
      if (i === this.pi) { await this.msg(`${cName(this.P)} is already battling!`); continue; }
      if (Game.party[i].hp <= 0) { await this.msg('It has fainted and cannot battle.'); continue; }
      if (this.P.hp > 0 && this.P.b.bind) { await this.msg(`${cName(this.P)} is bound and can't be switched out!`); return -1; }
      return i;
    }
  }
  enemyAction() {
    const E = this.E, P = this.P, opts = E.moves.filter(m => m.pp > 0);
    if (!opts.length) return { mv: MOVES.tackle, struggle: true };
    let best = null, bs = -1;
    for (const m of opts) {
      const mv = MOVES[m.id], fx = mv.fx || {};
      let s;
      if (mv.pow) { s = mv.pow * typeMult(mv.type, SPECIES[P.sp].types) * (SPECIES[E.sp].types.includes(mv.type) ? 1.5 : 1) * mv.acc / 100; if (mv.sig) s *= (this.sigUsed ? 1.2 : 6); if (P.b.shield && fx.breakShield) s *= 1.5; }
      else {
        s = 20;
        if (fx.heal) s = E.hp < maxHP(E) * .5 ? 130 : 5;
        if (fx.self) s = Object.keys(fx.self).some(k => E.b.st[k] < 2) ? 45 : 5;
        if (fx.foe) s = 35;
        if (fx.status) s = (P.b.burn || P.b.poison || P.b.sleep) ? 2 : 70;
      }
      s *= .75 + Math.random() * .5;
      if (s > bs) { bs = s; best = m; }
    }
    return { m: best, mv: MOVES[best.id] };
  }
  async resolveTurn(act) {
    const P0 = this.P, E0 = this.E;
    const eAct = this.enemyAction();
    // non-move actions first
    if (act.t === 'run') {
      if (P0.b.bind) await this.msg(`${cName(P0)} is bound and can't escape!`);
      else {
        this.runTries++;
        if (spd(P0) >= spd(E0) || chance(.45 + this.runTries * .15)) { Sound.sfx('run'); await this.msg('Got away safely!'); this.result = 'run'; return; }
        await this.msg('Couldn\'t get away!');
      }
    }
    if (act.t === 'switch') { await this.msg(`${cName(P0)}, come back!`, 30); await tween(this.anim.p, 'dx', -200, 14); this.pi = act.idx; await this.sendOut('p'); }
    if (act.t === 'item') { await this.useItem(act.id, Game.party[act.target]); }
    if (act.t === 'tame') { const ok = await this.throwOrb(act.id); if (ok || this.result) return; }
    // moves in order
    const queue = [];
    if (act.t === 'move' || act.t === 'custom') {
      const pm = act.t === 'custom' ? act.mv : (act.i < 0 ? MOVES.tackle : MOVES[P0.moves[act.i].id]);
      queue.push({ side: 'p', who: P0, mv: pm, slot: act.i, pri: pm.pri || 0 });
    }
    queue.push({ side: 'e', who: E0, mv: eAct.mv, m: eAct.m, pri: eAct.mv.pri || 0 });
    if (eAct.mv.sig) this.sigUsed = true;
    queue.sort((a, b) => (b.pri - a.pri) || (spd(b.who) - spd(a.who)) || (Math.random() - .5));
    for (const q of queue) {
      if (this.result) return;
      if (q.who.hp <= 0 || (q.side === 'p' ? this.P !== q.who : this.E !== q.who)) continue;
      const tSide = q.side === 'p' ? 'e' : 'p', target = tSide === 'p' ? this.P : this.E;
      if (q.side === 'p' && q.mv.custom) { P0.en -= q.mv.cost; this.custom.used++; this.custom.cd = q.mv.cooldown + 1; }
      else if (q.side === 'p' && q.slot >= 0) P0.moves[q.slot].pp--;
      else if (q.side === 'e' && q.m) q.m.pp--;
      await this.useMove(q.who, q.side, target, tSide, q.mv);
      if (await this.checkFaints()) return;
    }
    if (!this.result) await this.endTurn();
  }
  async checkFaints() {
    if (this.E.hp <= 0) { await this.enemyFainted(); if (this.result) return true; }
    if (this.P.hp <= 0) { await this.playerFainted(); if (this.result) return true; }
    return false;
  }
  async useMove(u, uSide, t, tSide, mv) {
    const un = this.label(u, uSide), tn = this.label(t, tSide);
    if (u.b.sleep > 0) { u.b.sleep--; if (u.b.sleep > 0) { this.emit(uSide, 'Shade', 8, 'up'); await this.msg(`${un} is fast asleep.`, 40); return; } await this.msg(`${un} woke up!`, 35); }
    if (u.b.stun) { u.b.stun = false; u.b.stunImm = 2; await this.msg(`${un} is stunned and can't move!`, 40); return; }
    await this.msg(`${un} used ${mv.name}!`, 30);
    if (mv.custom) return this.execCustom(u, uSide, t, tSide, mv);
    const fx = mv.fx || {};
    const selfOnly = mv.cat === 'status' && !fx.foe && !fx.status;
    if (!selfOnly && Math.random() * 100 >= mv.acc) { await this.msg('But it missed!', 35); return; }
    if (mv.pow) {
      if (mv.sig) { shake(20); flash('#ffffff', 20); }
      await this.attackFX(mv.type, uSide, tSide);
      const r = this.damage(u, t, mv, mv.pow);
      if (r.eff === 0) { await this.msg(`It doesn't affect ${tn}...`, 40); return; }
      let dmg = this.absorb(t, r.dmg, mv);
      if (dmg.absorbed) await this.msg(`${tn}'s shield absorbed ${dmg.absorbed} damage!`, 35);
      if (dmg.broke) await this.msg(`${tn}'s shield shattered!`, 35);
      if (dmg.left > 0) await this.hit(t, tSide, dmg.left, r.eff, r.crit);
      if (r.crit) await this.msg('A critical hit!', 30);
      if (r.eff > 1) await this.msg('It\'s super effective!', 30); else if (r.eff < 1) await this.msg('It\'s not very effective...', 30);
      if (t.hp <= 0) return;
    } else {
      this.emit(fx.self || fx.heal ? uSide : tSide, mv.type, 18, fx.self || fx.heal ? 'up' : 'down');
      await wait(16);
    }
    if (fx.status && (mv.pow ? chance(fx.status.ch) : true)) await this.applyStatus(t, tSide, fx.status.kind, fx.status.kind === 'sleep' ? randi(1, 3) + 1 : 4, !mv.pow);
    if (fx.bind && chance(fx.bind)) await this.applyStatus(t, tSide, 'bind', randi(2, 4), fx.bind >= 1);
    if (fx.stun && chance(fx.stun)) await this.applyStatus(t, tSide, 'stun', 1, false);
    if (fx.foe && (!fx.foeCh || chance(fx.foeCh))) for (const k in fx.foe) await this.stage(t, tSide, k, fx.foe[k]);
    if (fx.self && (!fx.selfCh || chance(fx.selfCh))) for (const k in fx.self) await this.stage(u, uSide, k, fx.self[k]);
    if (fx.heal) await this.heal(u, uSide, Math.floor(maxHP(u) * fx.heal));
    if (fx.cure && (u.b.burn || u.b.poison || u.b.sleep || u.b.bind)) { Object.assign(u.b, { burn: 0, poison: 0, sleep: 0, bind: 0 }); await this.msg(`${un} was cleansed of ailments!`, 35); }
  }
  damage(u, t, mv, power) {
    const A = stat(u, 'atk') * stageMult(u.b.st.atk) * (u.b.burn ? .85 : 1), D = stat(t, 'def') * stageMult(t.b.st.def);
    const base = Math.floor(Math.floor(2 * u.lv / 5 + 2) * power * A / D / 50) + 2;
    const stab = SPECIES[u.sp].types.includes(mv.type) ? 1.5 : 1, eff = typeMult(mv.type, SPECIES[t.sp].types);
    const crit = chance((mv.crit || 1) / 16);
    const terr = this.terrain && this.terrain.type === mv.type ? 1 + this.terrain.boost / 100 : 1;
    return { dmg: eff === 0 ? 0 : Math.max(1, Math.floor(base * stab * eff * (crit ? 1.5 : 1) * terr * (.85 + Math.random() * .15))), eff, crit };
  }
  absorb(t, dmg, mv) {
    const s = t.b.shield; if (!s) return { left: dmg };
    if (mv.fx && mv.fx.breakShield) { t.b.shield = null; return { left: dmg, broke: true }; }
    const a = Math.min(s.hp, dmg); s.hp -= a;
    const broke = s.hp <= 0; if (broke) t.b.shield = null;
    return { left: dmg - a, absorbed: a, broke };
  }
  async applyStatus(t, side, kind, turns, loud) {
    const n = this.label(t, side), b = t.b;
    if (t.hp <= 0) return false;
    const major = ['burn', 'poison', 'sleep'];
    if (major.includes(kind) && (b.burn || b.poison || b.sleep)) { if (loud) await this.msg(`${n} is already afflicted - it had no effect.`, 35); return false; }
    if (kind === 'stun' && (b.stun || b.stunImm)) { if (loud) await this.msg(`${n} resisted being stunned.`, 35); return false; }
    if (kind === 'bind' && b.bind) { if (loud) await this.msg(`${n} is already bound.`, 35); return false; }
    if (kind === 'burn' && SPECIES[t.sp].types.includes('Ember')) { if (loud) await this.msg(`${n} cannot be burned!`, 35); return false; }
    b[kind] = kind === 'stun' ? true : turns;
    Sound.sfx('status');
    const txt = { burn: 'was burned!', poison: 'was poisoned!', sleep: 'fell asleep!', stun: 'is stunned!', bind: 'is bound tight!' }[kind];
    this.emit(side, { burn: 'Ember', poison: 'Shade', sleep: 'Sky', stun: 'Storm', bind: 'Grove' }[kind], 16, 'down');
    await this.msg(`${n} ${txt}`, 35);
    return true;
  }
  async stage(c, side, k, d) {
    const n = this.label(c, side), before = c.b.st[k];
    c.b.st[k] = clamp(before + d, -4, 4);
    const nm = { atk: 'Attack', def: 'Defense', spd: 'Speed' }[k];
    if (c.b.st[k] === before) { await this.msg(`${n}'s ${nm} won't go any ${d > 0 ? 'higher' : 'lower'}!`, 30); return; }
    Sound.sfx(d > 0 ? 'buff' : 'debuff'); this.emit(side, d > 0 ? 'Light' : 'Shade', 14, d > 0 ? 'up' : 'down');
    await this.msg(`${n}'s ${nm} ${d > 0 ? 'rose' : 'fell'}${Math.abs(d) > 1 ? ' sharply' : ''}!`, 30);
  }
  async heal(c, side, amt) {
    const n = this.label(c, side), room = maxHP(c) - c.hp;
    if (room <= 0) { await this.msg(`${n}'s HP is already full.`, 30); return; }
    amt = Math.min(room, Math.max(1, amt)); c.hp += amt;
    Sound.sfx('heal'); this.emit(side, 'Grove', 16, 'up');
    this.floats.push({ text: '+' + amt, x: POS[side].x + 20, y: POS[side].y - 64, color: '#7be07b', life: 45 });
    await this.msg(`${n} recovered ${amt} HP.`, 30);
  }
  // ---------------- custom attack execution (numbers come from buildCustomMove) ----------------
  async execCustom(u, uSide, t, tSide, mv) {
    const un = this.label(u, uSide), tn = this.label(t, tSide);
    const selfKinds = ['shield', 'heal', 'atk_up', 'def_up', 'spd_up', 'terrain'];
    const primarySelf = selfKinds.includes(mv.effects[0].kind);
    if (!primarySelf && Math.random() * 100 >= mv.acc) { await this.msg('But it missed!', 35); return; }
    for (let i = 0; i < mv.effects.length; i++) {
      const e = mv.effects[i], primary = i === 0, amt = effectAmount(e, primary);
      if (t.hp <= 0 && !selfKinds.includes(e.kind)) continue;
      switch (e.kind) {
        case 'damage': {
          await this.attackFX(mv.type, uSide, tSide);
          const r = this.damage(u, t, mv, mv.pow);
          if (r.eff === 0) { r.eff = .5; r.dmg = Math.max(1, Math.floor(this.damage(u, Object.assign({}, t, { sp: 'gandharin' }), Object.assign({}, mv, { type: 'Neutral' }), mv.pow).dmg * .5)); await this.msg(`Spirit-forged power slips past ${tn}'s immunity!`, 35); }
          const capped = Math.min(r.dmg, Math.floor(maxHP(t) * .5));   // hard rule: never more than half max HP (no one-hit KO)
          const d = this.absorb(t, capped, mv);
          if (d.absorbed) await this.msg(`${tn}'s shield absorbed ${d.absorbed} damage!`, 35);
          if (d.left > 0) await this.hit(t, tSide, d.left, r.eff, r.crit);
          if (r.crit) await this.msg('A critical hit!', 30);
          if (r.eff > 1) await this.msg('It\'s super effective!', 30); else if (r.eff < 1) await this.msg('It\'s not very effective...', 30);
          break;
        }
        case 'shield': {
          const hp = Math.max(3, Math.min(Math.floor(maxHP(u) * .4), Math.floor(maxHP(u) * amt / 100)));
          u.b.shield = { hp, turns: mv.duration || 3 }; Sound.sfx('shield'); this.emit(uSide, mv.type, 18, 'up');
          await this.msg(`${un} is protected by a shield (${hp} HP, ${u.b.shield.turns} turns).`, 40); break;
        }
        case 'heal': await this.heal(u, uSide, Math.floor(maxHP(u) * amt / 100)); break;
        case 'burn': case 'poison': case 'sleep': case 'stun': case 'bind': {
          if (chance(amt / 100)) await this.applyStatus(t, tSide, e.kind, e.kind === 'stun' ? 1 : e.kind === 'sleep' ? clamp((mv.duration || 3) - 1, 1, 3) + 1 : (mv.duration || 3), primary);
          else if (primary) await this.msg(`${tn} resisted the ${KIND_LABEL[e.kind].toLowerCase()}.`, 35);
          break;
        }
        case 'atk_up': case 'def_up': case 'spd_up': await this.stage(u, uSide, e.kind.slice(0, 3), amt); break;
        case 'atk_down': case 'def_down': case 'spd_down': await this.stage(t, tSide, e.kind.slice(0, 3), -amt); break;
        case 'terrain': {
          this.terrain = { type: mv.type, turns: mv.duration || 3, boost: amt }; Sound.sfx('magic'); flash(TYPE_COLOR[mv.type], 14);
          await this.msg(`The battlefield became ${mv.type} Terrain! ${mv.type} moves are ${amt}% stronger.`, 45); break;
        }
      }
    }
  }
  // ---------------- items & taming ----------------
  async useItem(id, c) {
    const it = ITEMS[id]; takeItem(id);
    const side = c === this.P ? 'p' : null;
    await this.msg(`You used a ${it.name}.`, 30);
    const healMul = 1;
    if (it.use === 'heal') { if (side) await this.heal(c, 'p', it.amt * healMul); else { c.hp = Math.min(maxHP(c), c.hp + it.amt); await this.msg(`${cName(c)} recovered HP.`, 30); } }
    if (it.use === 'full') { c.hp = maxHP(c); Object.assign(c.b, { burn: 0, poison: 0, sleep: 0, bind: 0, stun: false }); Sound.sfx('heal'); if (side) this.emit('p', 'Grove', 20, 'up'); await this.msg(`${cName(c)} is fully restored!`, 35); }
    if (it.use === 'revive') { c.hp = Math.floor(maxHP(c) / 2); Sound.sfx('heal'); await this.msg(`${cName(c)} was revived!`, 35); }
    if (it.use === 'cure') { const b = c.b; const had = b.burn || b.poison || b.sleep || b.bind || b.stun; Object.assign(b, { burn: 0, poison: 0, sleep: 0, bind: 0, stun: false }); await this.msg(had ? `${cName(c)} was cured!` : 'It had no effect.', 35); }
    if (it.use === 'pp') { c.moves.forEach(m => m.pp = MOVES[m.id].pp); c.en = maxEN(c); Sound.sfx('heal'); await this.msg(`${cName(c)}'s PP and energy were restored!`, 35); }
  }
  async throwOrb(id) {
    const E = this.E, it = ITEMS[id]; takeItem(id);
    await this.msg(`You threw a ${it.name}!`, 25);
    Sound.sfx('throw');
    this.orb = { x: 90, y: 140, id, rot: 0 };
    const sx = 90, sy = 140, tx = POS.e.x, ty = POS.e.y - 40;
    for (let f = 0; f <= 24; f++) { const t = f / 24; this.orb.x = lerp(sx, tx, t); this.orb.y = lerp(sy, ty, t) - Math.sin(t * Math.PI) * 50; this.orb.rot = t * 10; await wait(1); }
    flash('#ffffff', 10); Sound.sfx('magic');
    this.anim.e.sil = 1; tween(this.anim.e, 'scale', .1, 16); await tween(this.anim.e, 'alpha', 0, 16);
    this.anim.e.hide = true;
    for (let f = 0; f <= 12; f++) { this.orb.y = lerp(ty, POS.e.y - 6, f / 12); await wait(1); }
    // capture odds: HP, status, rarity, orb, perk
    let mult = it.mult;
    if (it.vsType && SPECIES[E.sp].types.includes(it.vsType)) mult = it.vsMult;
    if (it.vsStatus && (E.b.sleep || E.b.bind)) mult = it.vsMult;
    const stBonus = E.b.sleep ? 2 : (E.b.bind || E.b.stun || E.b.burn || E.b.poison) ? 1.5 : 1;
    const mx = maxHP(E);
    let a = (3 * mx - 2 * E.hp) * RARITY_RATE[SPECIES[E.sp].rarity] * mult * stBonus / (3 * mx);
    if (perk() === 'capture') a *= 1.1;
    const p = Math.min(1, a / 255), q = Math.pow(p, 1 / 4);
    let shakes = 0; while (shakes < 4 && chance(q)) shakes++;
    for (let s = 0; s < Math.min(3, shakes); s++) {
      await wait(18); Sound.sfx('shake');
      for (let f = 0; f < 16; f++) { this.orb.rot = Math.sin(f / 16 * Math.PI * 2) * .5; this.orb.x = POS.e.x + Math.sin(f / 16 * Math.PI * 2) * 3; await wait(1); }
      this.orb.rot = 0; this.orb.x = POS.e.x;
    }
    await wait(20);
    if (shakes >= 4) {
      Sound.sfx('tamed'); this.emit('e', 'Light', 30);
      await this.msg(`${cName(E)} was tamed!`, 60);
      const mf = await mythicForm(E);
      E.mythic = mf;
      const upN = { hp: 'HP', atk: 'ATK', def: 'DEF', spd: 'SPD' };
      const newMax = maxHP(E); E.hp = Math.min(E.hp, newMax);
      await this.msg(`Its Mythic Form awakens: ${cName(E)} ${mf.epithet}! (+${upN[mf.up]} / -${upN[mf.down]})`, 80);
      delete E.b; const where = addCreature(E);
      if (where === 'storage') await this.msg(`Your party is full. ${cName(E)} was sent to the Sanctum Stone.`, 60);
      this.orb = null; this.result = 'tamed';
      await this.awardXP(E, .5);
      return true;
    }
    Sound.sfx('breakout'); flash('#ffffff', 8);
    this.orb = null; this.anim.e.hide = false; this.anim.e.scale = 1; this.anim.e.alpha = 1; tween(this.anim.e, 'sil', 0, 12);
    await this.msg(['Oh no! It broke free!', 'Argh! Almost had it!', 'So close!', 'It shook free at the last moment!'][Math.min(3, shakes)], 45);
    return false;
  }
  // ---------------- fainting, xp, end of turn ----------------
  async enemyFainted() {
    const E = this.E;
    Sound.sfx('faint'); tween(this.anim.e, 'dy', 40, 20); await tween(this.anim.e, 'alpha', 0, 20);
    this.anim.e.hide = true; this.anim.e.dy = 0; this.anim.e.alpha = 1;
    await this.msg(`${this.label(E, 'e')} fainted!`, 40);
    await this.awardXP(E, 1);
    const next = this.foes.findIndex(c => c.hp > 0);
    if (next < 0) { this.result = 'win'; return; }
    this.ei = next; this.terrain = this.terrain;
    await this.sendOut('e');
  }
  async awardXP(E, mul) {
    const sp = SPECIES[E.sp];
    const base = Math.floor(sp.xp * E.lv / 5 * (this.tr ? 1.5 : 1) * (perk() === 'xp' ? 1.1 : 1) * mul);
    const got = Game.party.filter(c => c.hp > 0 && this.parts4.has(c.uid));
    if (!got.length) return;
    const each = Math.max(1, Math.floor(base / got.length));
    for (const c of got) {
      if (c.lv >= LEVEL_CAP) continue;
      await this.msg(`${cName(c)} gained ${each} XP!`, 30);
      c.xp += each;
      while (c.lv < LEVEL_CAP && c.xp >= xpForLevel(c.lv + 1)) await this.levelUp(c);
    }
    this.parts4 = new Set([this.P.uid]);
  }
  async levelUp(c) {
    const oldMax = maxHP(c); c.lv++; c.hp += maxHP(c) - oldMax; c.en = Math.min(maxEN(c), c.en + 1);
    this.leveled.add(c.uid);
    Sound.sfx('levelup'); if (c === this.P) this.emit('p', 'Light', 18, 'up');
    await this.msg(`${cName(c)} grew to Lv ${c.lv}!`, 45);
    for (const mid of learnAt(c.sp, c.lv)) await learnMove(c, mid, t => this.msg(t, 40));
  }
  async playerFainted() {
    const P = this.P;
    Sound.sfx('faint'); tween(this.anim.p, 'dy', 40, 20); await tween(this.anim.p, 'alpha', 0, 20);
    this.anim.p.hide = true; this.anim.p.dy = 0; this.anim.p.alpha = 1;
    await this.msg(`${cName(P)} fainted!`, 40);
    if (firstAlive() < 0) { this.result = 'lose'; return; }
    let idx = -1;
    while (idx < 0) {
      const items = Game.party.map(c => ({ label: `${cName(c)} Lv${c.lv}`, right: `${c.hp}/${maxHP(c)}`, color: c.hp <= 0 ? UI.red : UI.ink }));
      const i = await choose(items, { x: 40, y: 16, w: 240, title: 'Choose your next companion', cancel: false });
      if (Game.party[i].hp > 0) idx = i; else await this.msg('It has fainted!', 30);
    }
    this.pi = idx; await this.sendOut('p');
  }
  async endTurn() {
    for (const [c, side] of [[this.P, 'p'], [this.E, 'e']]) {
      if (!c || c.hp <= 0) continue;
      const n = this.label(c, side), b = c.b;
      for (const [k, div, txt] of [['burn', 12, 'is hurt by its burn'], ['poison', 10, 'is hurt by poison'], ['bind', 16, 'is squeezed by the bind']]) {
        if (!b[k] || c.hp <= 0) continue;
        const d = Math.max(1, Math.floor(maxHP(c) / div));
        this.emit(side, { burn: 'Ember', poison: 'Shade', bind: 'Grove' }[k], 10);
        await this.msg(`${n} ${txt}!`, 30); await this.hit(c, side, d, 1, false);
        b[k]--; if (!b[k] && c.hp > 0) await this.msg(`${n} is free of its ${k}.`, 30);
      }
      if (b.shield && --b.shield.turns <= 0) { b.shield = null; await this.msg(`${n}'s shield faded.`, 30); }
      if (b.stunImm) b.stunImm--;
      c.en = Math.min(maxEN(c), c.en + 2);
    }
    if (await this.checkFaints()) return;
    if (this.terrain && --this.terrain.turns <= 0) { await this.msg(`The ${this.terrain.type} Terrain faded.`, 30); this.terrain = null; }
    if (this.custom.cd > 0) this.custom.cd--;
  }
}
async function learnMove(c, mid, msg) {
  const name = cName(c), mv = MOVES[mid];
  if (c.moves.some(m => m.id === mid)) return;
  if (c.moves.length < 4) { c.moves.push({ id: mid, pp: mv.pp }); Sound.sfx('levelup'); await msg(`${name} learned ${mv.name}!`); return; }
  const k = await ask(`${name} wants to learn ${mv.name}. Forget a move to make room?`);
  if (k !== 0) { await msg(`${name} did not learn ${mv.name}.`); return; }
  const i = await choose(c.moves.map(m => MOVES[m.id].name).concat(['Keep all']), { x: 160, y: 40, title: 'Forget which move?' });
  if (i < 0 || i >= 4) { await msg(`${name} did not learn ${mv.name}.`); return; }
  const old = MOVES[c.moves[i].id].name; c.moves[i] = { id: mid, pp: mv.pp };
  await msg(`${name} forgot ${old} and learned ${mv.name}!`);
}
function drawOrb(ctx, x, y, id, rot) {
  const col = { bana: '#c8a060', agneyastra: '#ff6a2a', varunastra: '#3a7bff', nagastra: '#3fae5a' }[id] || '#e8b030';
  ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.rotate(rot);
  ctx.fillStyle = '#1a1020'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, 5, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#f4ead2'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI); ctx.fill();
  ctx.fillStyle = '#1a1020'; ctx.fillRect(-5, -1, 10, 2); ctx.fillStyle = '#ffd040'; ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}
// ---------------- custom attack preview card ----------------
function previewCard(mv, P) {
  const stars = r => '★'.repeat(r) + '·'.repeat(5 - r);
  const fmtAmt = (e, i) => { const a = effectAmount(e, i === 0); switch (e.kind) { case 'damage': return `power ${mv.pow}, max 50% HP`; case 'shield': return `${Math.min(40, a)}% HP shield`; case 'heal': return `${a}% HP`; case 'terrain': return `+${a}% ${mv.type} moves`; default: return /_up|_down/.test(e.kind) ? `${a} stage${a > 1 ? 's' : ''}` : `${a}% chance`; } };
  const extra = ctx => {
    drawWin(ctx, 10, 6, 300, 168, { c1: '#2c1a4a', c2: '#120b22' });
    Font.draw(ctx, 'CUSTOM ATTACK PREVIEW', 20, 13, UI.gold);
    Font.drawR(ctx, mv.source === 'ai' ? 'via AI server' : mv.source === 'fallback' ? 'AI unreachable: offline spirits' : 'offline spirits', 300, 13, UI.dim);
    Font.drawBig(ctx, mv.name, 20, 25, '#ffffff', 2, '#0b0714');
    let bx = 20; bx += typeBadge(ctx, mv.type, bx, 47); Font.draw(ctx, mv.category.toUpperCase(), bx + 4, 48, UI.ink);
    mv.effects.forEach((e, i) => { const y = 62 + i * 12; Font.draw(ctx, (i ? 'Secondary: ' : 'Primary: ') + KIND_LABEL[e.kind], 20, y, UI.ink); Font.draw(ctx, stars(e.rating), 160, y, UI.gold); Font.draw(ctx, fmtAmt(e, i), 200, y, UI.dim); });
    const y2 = 88;
    const col = (lab, val, x) => { Font.draw(ctx, lab, x, y2, UI.dim); Font.draw(ctx, String(val), x, y2 + 10, UI.ink); };
    col('ACCURACY', mv.acc + '%', 20); col('COST', mv.cost + ' EN', 80); col('COOLDOWN', mv.cooldown + ' turn' + (mv.cooldown > 1 ? 's' : ''), 132); col('DURATION', mv.duration ? mv.duration + ' turns' : '-', 200); col('LEFT', (CA.MAX_PER_BATTLE - (Scenes.stack.find(s => s instanceof BattleScene) || { custom: { used: 0 } }).custom.used) + '/' + CA.MAX_PER_BATTLE, 262);
    let y = 114; Font.wrap(mv.description, 280).slice(0, 2).forEach(l => { Font.draw(ctx, l, 20, y, '#e8dcc0'); y += 11; });
    mv.notes.slice(0, 2).forEach(n => { Font.draw(ctx, '! ' + n, 20, y, UI.red); y += 11; });
    if (P.en < mv.cost) Font.draw(ctx, `Not enough EN (${P.en}/${mv.cost})`, 20, 162, UI.red);
    drawWin(ctx, 0, 176, 210, 64);
    Font.wrap('Confirm to use this attack now. Cancel to keep your turn (no use is spent).', 190).forEach((l, i) => Font.draw(ctx, l, 12, 188 + i * 13, UI.ink));
  };
  return choose(['Confirm', 'Cancel'], { x: 214, y: 176, w: 106, h: 64, lineH: 18, extra }).then(i => i === 0);
}

// ---------------- entry point ----------------
async function startBattle(cfg) {
  Sound.sfx('encounter');
  const mapId = Game.player.map;
  cfg.bg = mapId === 'hall' ? 'hall' : mapId === 'palace' ? 'palace' : 'route';
  await tween(Overlay, 'swirl', 1, 36);
  const B = new BattleScene(cfg);
  Scenes.push(B);
  Overlay.swirl = 0;
  let res;
  try { res = await B.run(); } catch (e) { console.error(e); res = 'run'; }
  // post battle
  if (res === 'win' && B.tr) {
    const tr = B.tr, money = tr.reward * Math.max(...B.foes.map(c => c.lv));
    Sound.play('victory');
    B.trainerSprite = { look: LOOKS[cfg.trainerId === 'rohan' ? 'pilgrim' : cfg.trainerId], x: 400, aura: null };
    await tween(B.trainerSprite, 'x', 236, 24);
    await say(tr.lose, { speaker: tr.name });
    Game.player.money += money; Game.flags[tr.flag] = true;
    await say(`You received ${money} coins for winning!`);
  } else if (res === 'win' || res === 'tamed') Sound.play('victory');
  for (const c of Game.party) {
    if (B.leveled.has(c.uid)) { const ev = SPECIES[c.sp].evo; if (ev && c.lv >= ev[1]) await evolve(c, B); }
  }
  await fadeOut(16);
  Scenes.remove(B);
  Game.party.forEach(c => { delete c.b; }); B.foes.forEach(c => { delete c.b; });
  if (res === 'lose') {
    Game.player.money = Math.floor(Game.player.money / 2);
    healParty(); World.load('shrine', 4, 4, 'up');
    await fadeIn(16);
    await say(['You blacked out and were carried back to the shrine...', 'Priestess Gauri tended your companions. Half of your coins were spent on offerings.'], { speaker: 'Priestess Gauri' });
  } else {
    Sound.play(World.map.music);
    await fadeIn(16);
    if (res === 'win' && cfg.trainerId === 'indra') await indraEnding();
  }
  return res;
}
async function evolve(c, B) {
  const from = c.sp, to = SPECIES[from].evo[0];
  await say(`What? ${cName(c)} is evolving!`);
  const sc = new EvolutionScene(from, to); Scenes.push(sc);
  Sound.sfx('evolve'); await sc.play(); Scenes.remove(sc);
  const oldMax = maxHP(c); c.sp = to; c.hp += maxHP(c) - oldMax;
  Game.seen[to] = true; Game.tamed[to] = true;
  Sound.sfx('tamed');
  await say(`Congratulations! Your ${SPECIES[from].name} evolved into ${SPECIES[to].name}!`);
  for (const mid of learnAt(to, c.lv)) await learnMove(c, mid, t => say(t));
}
class EvolutionScene {
  constructor(a, b) { this.a = a; this.b = b; this.t = 0; this.opaque = true; this.show = a; }
  update() { }
  async play() { for (let i = 0; i < 14; i++) { this.show = i % 2 ? this.b : this.a; await wait(Math.max(4, 22 - i * 1.4)); } this.show = this.b; flash('#ffffff', 30); await wait(40); this.done = true; }
  draw(ctx) {
    const g = ctx.createRadialGradient(160, 110, 10, 160, 110, 200); g.addColorStop(0, '#5a3a8a'); g.addColorStop(1, '#0b0714'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 12; i++) { const a = Game.frames / 30 + i * .52; ctx.fillStyle = 'rgba(255,220,120,.5)'; ctx.fillRect(160 + Math.cos(a) * 80, 100 + Math.sin(a) * 60, 2, 2); }
    drawCreature(ctx, this.show, 160, 150, { scale: 1.5, sil: !this.done });
  }
}
async function indraEnding() {
  Sound.play('title');
  await say(['The thunder softens into gentle rain. Across Indrapuri, lamps are lit in celebration.', 'INDRA: You have stood steady in the storm. Take the Vajra Seal - proof that the heavens of Indrapuri recognise you.', 'You received the VAJRA SEAL!'], { speaker: 'Indra' });
  await say(['TRIAL OF INDRAPURI COMPLETE.', 'This build (Stage 1) contains only the first city. The roads to Hellas, Asgard and the other mythic cities are still sealed by mist and arrive in later stages.', 'You can keep exploring, taming and levelling your companions. Remember to SAVE from the menu!']);
  Sound.play(World.map.music);
}
