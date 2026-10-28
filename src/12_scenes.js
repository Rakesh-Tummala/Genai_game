// =====================================================================
//  TITLE, CHARACTER SELECT, STARTER, FIELD MENUS
// =====================================================================
const SKYLINE = (() => { // eight silhouettes hinting at the eight mythic cities
  const c = mkCanvas(W, 70), x = c.getContext('2d'); x.fillStyle = '#1a0f2e';
  const ground = 70; x.fillRect(0, 56, W, 14);
  const shapes = [
    b => { x.fillRect(b, 30, 26, 30); x.beginPath(); x.moveTo(b - 2, 32); x.quadraticCurveTo(b + 13, -4, b + 28, 32); x.fill(); },               // shikhara (India)
    b => { x.fillRect(b, 40, 34, 20); x.beginPath(); x.moveTo(b - 3, 41); x.lineTo(b + 17, 28); x.lineTo(b + 37, 41); x.fill(); for (let i = 0; i < 5; i++) x.clearRect(b + 3 + i * 7, 44, 3, 12); }, // temple (Greece)
    b => { x.beginPath(); x.moveTo(b, 56); x.lineTo(b, 40); x.lineTo(b + 15, 26); x.lineTo(b + 30, 40); x.lineTo(b + 30, 56); x.fill(); },     // longhouse (Norse)
    b => { x.beginPath(); x.moveTo(b - 4, 58); x.lineTo(b + 16, 22); x.lineTo(b + 36, 58); x.fill(); },                                     // pyramid (Egypt)
    b => { for (let i = 0; i < 3; i++) { x.fillRect(b + 4 + i * 2, 50 - i * 11, 20 - i * 4, 8); x.fillRect(b - 2 + i * 3, 46 - i * 11, 32 - i * 6, 3); } x.fillRect(b + 13, 12, 2, 10); }, // pagoda (Japan)
    b => { for (let i = 0; i < 4; i++) x.fillRect(b + i * 9, 38 + (i % 2) * 4, 6, 20); x.fillRect(b - 1, 36, 34, 4); },                       // standing stones (Celtic)
    b => { for (let i = 0; i < 4; i++) x.fillRect(b + i * 4, 56 - (i + 1) * 9, 36 - i * 8, 9); },                                            // ziggurat (Mesopotamia)
    b => { x.fillRect(b + 6, 34, 18, 24); x.beginPath(); x.ellipse(b + 15, 32, 11, 10, 0, 0, 7); x.fill(); x.fillRect(b + 14, 12, 2, 12); },   // onion dome (Slavic)
  ];
  shapes.forEach((f, i) => f(8 + i * 39));
  return c;
})();
class TitleScene {
  constructor() {
    this.opaque = true; this.lanterns = []; this.ready = false; this.t = 0; this.saveInfo = null;
    try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (d && d.player) { const s = Math.floor((d.frames || 0) / 60); this.saveInfo = { name: d.player.name, seals: ['beatIndra', 'beatZeus', 'beatOdin', 'beatRa', 'beatAmaterasu', 'beatDagda', 'beatMarduk', 'beatPerun'].filter(f => d.flags && d.flags[f]).length, tamed: Object.keys(d.tamed || {}).length, time: Math.floor(s / 3600) + ':' + String(Math.floor(s / 60) % 60).padStart(2, '0') }; } } catch (e) { }
  }
  update() {
    this.t++;
    if (this.lanterns.length < 14 && chance(.04)) this.lanterns.push({ x: Math.random() * W, y: H + 5, v: .2 + Math.random() * .3, ph: Math.random() * 6 });
    for (const l of this.lanterns) { l.y -= l.v; l.ph += .03; }
    this.lanterns = this.lanterns.filter(l => l.y > -10);
    if (!this.ready && this.t > 30 && (Input.p('a') || Input.p('start'))) { this.ready = true; Sound.init(); Sound.play('title'); Sound.sfx('confirm'); this.menu(); }
  }
  async menu() {
    while (true) {
      const items = []; if (hasSave()) items.push('CONTINUE'); items.push('NEW GAME', 'OPTIONS');
      const i = await choose(items, { x: 110, y: 150, w: 100, cancel: false, lineH: 15 });
      const pickd = items[i];
      if (pickd === 'CONTINUE') { if (loadGame()) { await fadeOut(); Scenes.replaceAll(World); World.load(Game.player.map, Game.player.x, Game.player.y, Game.player.dir); await fadeIn(); return; } await say('The save data could not be read.'); }
      if (pickd === 'NEW GAME') { if (hasSave()) { const c = await ask('Start a new journey? Your old save stays until you save again.'); if (c !== 0) continue; } const ok = await newGameFlow(); if (ok) return; }
      if (pickd === 'OPTIONS') await openOptions();
    }
  }
  draw(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b0620'); g.addColorStop(.6, '#3a1d5a'); g.addColorStop(1, '#a8503a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r = mulberry32(7); for (let i = 0; i < 70; i++) { const tw = (Math.sin(Game.frames / 20 + i) + 1) / 2; ctx.fillStyle = `rgba(255,240,200,${.3 + tw * .7})`; ctx.fillRect(r() * W | 0, r() * 130 | 0, 1, 1); }
    ctx.fillStyle = '#fff4d8'; ctx.beginPath(); ctx.arc(160, 128, 26, 0, 7); ctx.fill(); ctx.fillStyle = '#3a1d5a'; ctx.globalAlpha = .2; ctx.beginPath(); ctx.arc(152, 122, 7, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.drawImage(SKYLINE, 0, H - 70);
    for (const l of this.lanterns) { const x = l.x + Math.sin(l.ph) * 3; ctx.fillStyle = 'rgba(255,170,60,.25)'; ctx.fillRect(x - 3, l.y - 3, 8, 9); ctx.fillStyle = '#ffb040'; ctx.fillRect(x, l.y, 3, 4); ctx.fillStyle = '#fff0a0'; ctx.fillRect(x + 1, l.y + 1, 1, 2); }
    const bob = Math.sin(Game.frames / 30) * 2;
    Font.drawBig(ctx, 'MYTHBOUND', 160 - Font.measure('MYTHBOUND') * 2, 38 + bob, '#3a1a08', 4);
    Font.drawBig(ctx, 'MYTHBOUND', 160 - Font.measure('MYTHBOUND') * 2 - 2, 36 + bob, '#ffd040', 4);
    Font.drawC(ctx, 'TAMERS OF THE EIGHT MYTHIC CITIES', 160, 76, '#f4c8a0', '#1a0f2e');
    drawCreature(ctx, STARTERS[Math.floor(Game.frames / 240) % 3], 60, 150, {});
    drawCreature(ctx, 'garudin', 262, 146, { flip: true });
    if (!this.ready && Math.floor(Game.frames / 30) % 2) Font.drawC(ctx, 'PRESS Z / ENTER', 160, 168, '#ffffff', '#1a0f2e');
    Font.draw(ctx, 'v1.0', 4, H - 10, '#c8a8d8');
    if (this.ready && this.saveInfo) { const si = this.saveInfo; Font.drawC(ctx, `Save: ${si.name}  |  Seals ${si.seals}/8  |  Tamed ${si.tamed}  |  ${si.time}`, 160, 136, '#f4c8a0', '#1a0f2e'); }
    Font.drawR(ctx, AI_ENDPOINT ? 'AI: server mode' : 'AI: offline mode', W - 4, H - 10, '#c8a8d8');
  }
}

// ---------------- new game ----------------
function resetGame() {
  Object.assign(Game, { player: { name: 'Ira', charId: 'ira', money: 600, map: 'house', x: 4, y: 4, dir: 'up' }, party: [], storage: [], bag: {}, flags: {}, seen: {}, tamed: {}, frames: 0, clock: 9 * 60, uid: 1 });
}
class CharSelectScene {
  constructor() { this.opaque = true; this.i = 0; this.resolve = null; }
  update() {
    const n = CHARACTERS.length, cols = 5;
    if (Input.p('left')) { this.i = (this.i + n - 1) % n; Sound.sfx('cursor'); }
    if (Input.p('right')) { this.i = (this.i + 1) % n; Sound.sfx('cursor'); }
    if (Input.p('up') || Input.p('down')) { this.i = (this.i + cols) % n; Sound.sfx('cursor'); }
    if (Input.p('a')) { Sound.sfx('confirm'); this.done(CHARACTERS[this.i]); }
    if (Input.p('b')) { Sound.sfx('cancel'); this.done(null); }
  }
  done(v) { Scenes.remove(this); this.resolve(v); }
  draw(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#24123e'); g.addColorStop(1, '#5a2a3a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    Font.drawC(ctx, 'CHOOSE YOUR TAMER', 160, 5, UI.gold, '#0b0714');
    CHARACTERS.forEach((c, i) => {
      const x = 6 + (i % 5) * 62, y = 16 + Math.floor(i / 5) * 58, sel = i === this.i;
      drawWin(ctx, x, y, 60, 56, sel ? { c1: '#4a2a6a', c2: '#2a1640', border: '#ffd040' } : {});
      const dir = sel ? ['down', 'left', 'up', 'right'][Math.floor(Game.frames / 40) % 4] : 'down';
      const fr = personFrames(c.look)[dir][sel ? (Math.floor(Game.frames / 10) % 3) : 0];
      ctx.drawImage(fr, x + 14, y + 6, 32, 32);
      Font.drawC(ctx, c.name, x + 30, y + 42, sel ? '#ffffff' : UI.ink);
    });
    const c = CHARACTERS[this.i];
    drawWin(ctx, 0, 134, W, 106);
    ctx.drawImage(personFrames(c.look).down[Math.floor(Game.frames / 12) % 3], 8, 146, 48, 48);
    Font.draw(ctx, c.name, 64, 142, UI.gold);
    Font.drawR(ctx, 'from ' + (c.home || 'Indrapuri'), 312, 142, UI.dim);
    Font.wrap(c.story, 246).slice(0, 4).forEach((l, k) => Font.draw(ctx, l, 64, 155 + k * 11, UI.ink));
    Font.draw(ctx, 'Perk: ' + c.perkText, 12, 204, UI.green);
    Font.draw(ctx, 'Arrows choose   Z confirm   X back', 12, 224, UI.dim);
  }
}
class CreditsScene {
  constructor() { this.opaque = true; this.y = H; this.resolve = null; this.t = 0;
    const seals = [['Indrapuri', 'Indra', 'Vajra Seal'], ['Olympos', 'Zeus', 'Aegis Seal'], ['Asgard', 'Odin', 'Raven Seal'], ['Heliopolis', 'Ra', 'Sun Seal'], ['Takama', 'Amaterasu', 'Mirror Seal'], ['Tir na nOg', 'The Dagda', 'Harp Seal'], ['Babylon', 'Marduk', 'Star Seal'], ['Kitezh', 'Perun', 'Oak Seal']];
    this.lines = [['MYTHBOUND', 'big'], ['Tamers of the Eight Mythic Cities', 'dim'], [''], [`${Game.player.name}, Tamer of the Mist Road`, 'gold'], [''], ['THE EIGHT SEALS', 'gold'], ...seals.map(([c, g, s]) => [`${s} - ${g} of ${c}`]), [''],
      ['YOUR COMPANIONS', 'gold'], ...Game.party.map(m => [`${cName(m)}${m.mythic ? ' ' + m.mythic.epithet : ''}  Lv ${m.lv}`]), [''],
      ['BESTIARY', 'gold'], [`Seen ${SPECIES_ORDER.filter(id => Game.seen[id]).length} / ${SPECIES_ORDER.length}    Tamed ${SPECIES_ORDER.filter(id => Game.tamed[id]).length} / ${SPECIES_ORDER.length}`], [''],
      ['All creatures, cities and characters are original,', 'dim'], ['inspired by the folklore of India, Greece, the Norse lands,', 'dim'], ['Egypt, Japan, the Celtic lands, Mesopotamia', 'dim'], ['and the Slavic lands.', 'dim'], [''],
      ['Every sprite, sound and note was made in code.', 'dim'], [''], ['THANK YOU FOR PLAYING', 'gold'], [''], ['Keep exploring - your journey continues.', 'dim']];
  }
  update() { this.t++; this.y -= Input.h('a') ? 1.6 : .4; const end = -this.lines.length * 14 + 60; if (this.y < end) { this.y = end; if (Input.p('a') || Input.p('b')) this.finish(); } if (Input.p('b')) this.finish(); }
  finish() { if (this.closed) return; this.closed = true; Scenes.remove(this); this.resolve(); }
  draw(ctx) {
    ctx.fillStyle = '#0b0620'; ctx.fillRect(0, 0, W, H);
    const r = mulberry32(11); for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,240,200,${.2 + (Math.sin(this.t / 20 + i) + 1) * .3})`; ctx.fillRect(r() * W | 0, r() * H | 0, 1, 1); }
    this.lines.forEach(([txt, kind], k) => {
      const y = this.y + k * 14; if (y < -20 || y > H) return;
      if (kind === 'big') Font.drawBig(ctx, txt, 160 - Font.measure(txt) * 1.5, y - 4, '#ffd040', 3, '#3a1a08');
      else Font.drawC(ctx, txt, 160, y + 6, kind === 'gold' ? UI.gold : kind === 'dim' ? '#b8a8d0' : '#ffffff', '#0b0714');
    });
    if (this.y <= -this.lines.length * 14 + 60 && Math.floor(this.t / 30) % 2) Font.drawC(ctx, 'Press Z', 160, 228, UI.dim);
  }
}
function playCredits() { return new Promise(r => { const s = new CreditsScene(); s.resolve = r; Scenes.push(s); }); }
class StarterScene {
  constructor() { this.opaque = true; this.i = 1; this.resolve = null; this.busy = false; }
  async update() {
    if (this.busy) return;
    if (Input.p('left')) { this.i = (this.i + 2) % 3; Sound.sfx('cursor'); }
    if (Input.p('right')) { this.i = (this.i + 1) % 3; Sound.sfx('cursor'); }
    if (Input.p('a')) {
      this.busy = true; Sound.sfx('confirm');
      const sp = STARTERS[this.i];
      const c = await ask(`Will you bond with ${SPECIES[sp].name}, the ${SPECIES[sp].types.join('/')} creature?`);
      this.busy = false;
      if (c === 0) { Scenes.remove(this); this.resolve(sp); }
    }
  }
  draw(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2414'); g.addColorStop(1, '#14080a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(255,200,120,.08)'; ctx.fillRect(20 + i * 80, 0, 30, 140); }
    Font.drawC(ctx, 'CHOOSE YOUR FIRST COMPANION', 160, 8, UI.gold, '#0b0714');
    STARTERS.forEach((sp, i) => {
      const x = 56 + i * 104, sel = i === this.i;
      ctx.fillStyle = '#5a4a3a'; ctx.fillRect(x - 26, 112, 52, 10); ctx.fillStyle = '#8a7a64'; ctx.fillRect(x - 28, 108, 56, 5);
      if (sel) { ctx.globalAlpha = .3 + .15 * Math.sin(Game.frames / 10); ctx.fillStyle = TYPE_COLOR[SPECIES[sp].types[0]]; ctx.beginPath(); ctx.ellipse(x, 90, 34, 40, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      drawCreature(ctx, sp, x, 110, { frame: sel ? undefined : 0, alpha: sel ? 1 : .6 });
      typeBadge(ctx, SPECIES[sp].types[0], x - 16, 126);
    });
    drawWin(ctx, 0, 146, W, 94);
    const sp = SPECIES[STARTERS[this.i]];
    Font.draw(ctx, sp.name, 12, 154, UI.gold);
    Font.drawR(ctx, `HP ${sp.base[0]}  ATK ${sp.base[1]}  DEF ${sp.base[2]}  SPD ${sp.base[3]}`, 308, 154, UI.dim);
    Font.wrap(sp.lore, 296).forEach((l, k) => Font.draw(ctx, l, 12, 170 + k * 12, UI.ink));
    Font.draw(ctx, `Evolves into ${SPECIES[sp.evo[0]].name} at Lv ${sp.evo[1]}.`, 12, 210, UI.green);
    Font.draw(ctx, '<  >  choose     Z confirm', 12, 224, UI.dim);
  }
}
class BlankScene { constructor(c) { this.opaque = true; this.c = c || '#0b0714'; } update() { } draw(ctx) { ctx.fillStyle = this.c; ctx.fillRect(0, 0, W, H); const r = mulberry32(3); for (let i = 0; i < 50; i++) { ctx.fillStyle = `rgba(255,240,200,${.2 + r() * .5})`; ctx.fillRect(r() * W | 0, r() * H | 0, 1, 1); } } }
async function newGameFlow() {
  await fadeOut(12);
  const cs = new CharSelectScene(); const picked = new Promise(r => cs.resolve = r);
  Scenes.push(cs); await fadeIn(12);
  const ch = await picked;
  if (!ch) return false;
  resetGame(); Game.player.charId = ch.id; Game.player.name = ch.name;
  const bl = new BlankScene(); Scenes.push(bl);
  await say(['Long ago, eight mythic cities rose where the old stories were strongest.', 'In each city, creatures of folklore live beside the people - and a great god watches over a sacred trial.', `In Indrapuri, city of the monsoon, a young Tamer named ${ch.name} is about to begin a journey...`]);
  await say(['Elder Bhaskar: Ah, you are here at last! Three young creatures have chosen to wait for you.', 'Look carefully. A companion chosen with the heart walks with you for life.'], { speaker: 'Elder Bhaskar' });
  Scenes.remove(bl);
  const st = new StarterScene(); Scenes.push(st);
  const sp = await new Promise(r => st.resolve = r);
  const c = newCreature(sp, 5); addCreature(c);
  if (perk() === 'orbs') { addItem('bana', 5); addItem('agneyastra', 2); }
  await fadeOut(14);
  Scenes.replaceAll(World); World.load('house', 4, 3, 'up');
  await fadeIn(14);
  Sound.sfx('tamed');
  await say([`${ch.name} and ${SPECIES[sp].name} are now bonded!`, 'Elder Bhaskar wants to speak with you. Press Z while facing him. Press ESC, C or M (or MENU) to open your menu.']);
  return true;
}

// ---------------- start menu ----------------
async function openStartMenu() {
  while (true) {
    const extra = ctx => {
      drawWin(ctx, 4, 4, 150, 104);
      Font.draw(ctx, Game.player.name, 14, 12, UI.gold);
      Font.draw(ctx, `Coins   ${Game.player.money}`, 14, 26, UI.ink);
      Font.draw(ctx, `Seals   ${badgeCount()} / 8`, 14, 38, UI.ink);
      Font.draw(ctx, `Tamed   ${Object.keys(Game.tamed).length} / ${SPECIES_ORDER.length}`, 14, 50, UI.ink);
      Font.draw(ctx, `Time    ${playTimeStr()}`, 14, 62, UI.ink);
      Font.draw(ctx, `Clock   ${clockStr()}`, 14, 74, UI.ink);
      Font.draw(ctx, 'AI: ' + (AI_ENDPOINT ? (AI.status === 'fallback' ? 'server unreachable' : 'server') : 'offline mode'), 14, 90, UI.dim);
    };
    const canTravel = CITY_ORDER.filter(cityUnlocked).length > 1;
    const labels = ['PARTY', 'BESTIARY', 'BAG', 'SAVE', 'OPTIONS', 'TITLE', 'CLOSE'];
    if (canTravel) labels.splice(2, 0, 'TRAVEL');
    const pickL = labels[await choose(labels, { x: 228, y: 4, w: 88, extra })];
    if (pickL === 'TRAVEL') { if (!World.map.outdoor) { await say('Step outside to see the Mist Road.'); continue; } await openWorldMap(); return; }
    const i = ['PARTY', 'BESTIARY', 'BAG', 'SAVE', 'OPTIONS', 'TITLE', 'CLOSE'].indexOf(pickL);
    if (i < 0 || i === 6) return;
    if (i === 0) await openParty();
    if (i === 1) await openBestiary();
    if (i === 2) await openBag();
    if (i === 3) { const c = await ask('Save your journey?'); if (c === 0) await say(saveGame() ? 'Your journey was saved.' : 'Saving failed (storage may be blocked).'); }
    if (i === 4) await openOptions();
    if (i === 5) { const c = await ask('Return to the title screen? Unsaved progress will be lost.'); if (c === 0) { await fadeOut(); Scenes.replaceAll(new TitleScene()); Sound.play('title'); await fadeIn(); return; } }
  }
}
async function openParty() {
  while (true) {
    const items = Game.party.map(c => ({ label: `${cName(c)}`, right: `Lv${c.lv}  ${c.hp}/${maxHP(c)}`, color: c.hp <= 0 ? UI.red : UI.ink }));
    const extra = (ctx, i) => { const c = Game.party[i]; drawWin(ctx, 196, 120, 120, 116); drawCreature(ctx, c.sp, 256, 200, {}); let x = 204; for (const t of SPECIES[c.sp].types) x += typeBadge(ctx, t, x, 206) + 1; drawBar(ctx, 204, 222, 104, 3, c.hp / maxHP(c), hpColor(c.hp / maxHP(c))); };
    const i = await choose(items, { x: 4, y: 4, w: 190, title: 'PARTY', lineH: 15, extra });
    if (i < 0) return;
    const j = await choose(['SUMMARY', 'MOVE UP', 'CANCEL'], { x: 196, y: 4, w: 90 });
    if (j === 0) await showSummary(Game.party[i]);
    if (j === 1 && i > 0) { const t = Game.party[i]; Game.party[i] = Game.party[i - 1]; Game.party[i - 1] = t; }
  }
}
class SummaryScene {
  constructor(c) { this.c = c; this.opaque = true; this.lore = null; this.resolve = null; this.loading = false; }
  update() {
    if (Input.p('b') || Input.p('start')) { Sound.sfx('cancel'); Scenes.remove(this); this.resolve(); }
    if (Input.p('a') && !this.lore && !this.loading) { this.loading = true; Sound.sfx('magic'); expandedLore(this.c.sp).then(t => { this.lore = t; this.loading = false; }); }
  }
  draw(ctx) {
    const c = this.c, sp = SPECIES[c.sp];
    ctx.fillStyle = '#170f28'; ctx.fillRect(0, 0, W, H);
    drawWin(ctx, 4, 4, 120, 120); drawCreature(ctx, c.sp, 64, 112, { scale: 1.4 });
    drawWin(ctx, 128, 4, 188, 120);
    Font.draw(ctx, sp.name, 136, 12, '#ffffff'); Font.drawR(ctx, 'Lv ' + c.lv, 308, 12, UI.gold);
    if (c.mythic) Font.draw(ctx, c.mythic.epithet, 136, 23, '#ffb0e0');
    let x = 136; for (const t of sp.types) x += typeBadge(ctx, t, x, 35) + 1;
    Font.drawR(ctx, sp.rarity.toUpperCase(), 308, 36, UI.dim);
    const rows = [['HP', `${c.hp}/${maxHP(c)}`], ['ATK', stat(c, 'atk')], ['DEF', stat(c, 'def')], ['SPD', stat(c, 'spd')], ['EN', maxEN(c)], ['XP', `${c.xp}/${c.lv >= LEVEL_CAP ? '-' : xpForLevel(c.lv + 1)}`]];
    rows.forEach(([k, v], i) => { const yy = 50 + i * 11; const tilt = c.mythic && (c.mythic.up === k.toLowerCase() ? '+' : c.mythic.down === k.toLowerCase() ? '-' : ''); Font.draw(ctx, k + (tilt || ''), 136, yy, tilt === '+' ? UI.green : tilt === '-' ? UI.red : UI.gold); Font.draw(ctx, String(v), 170, yy, UI.ink); });
    c.moves.forEach((m, i) => { const mv = MOVES[m.id]; Font.draw(ctx, mv.name, 222, 46 + i * 19, UI.ink); Font.draw(ctx, `${mv.type} ${m.pp}/${mv.pp}`, 228, 55 + i * 19, TYPE_COLOR[mv.type]); });
    drawWin(ctx, 4, 128, 312, 108);
    Font.draw(ctx, 'LORE', 12, 135, UI.gold);
    const txt = this.lore || sp.lore;
    Font.wrap(txt, 296).slice(0, 6).forEach((l, i) => Font.draw(ctx, l, 12, 148 + i * 12, UI.ink));
    Font.draw(ctx, this.loading ? 'Consulting the archives...' : this.lore ? 'X back' : 'Z expanded lore     X back', 12, 224, UI.dim);
  }
}
function showSummary(c) { return new Promise(r => { const s = new SummaryScene(c); s.resolve = r; Scenes.push(s); }); }
async function openBag() {
  while (true) {
    const ids = Object.keys(Game.bag).filter(k => Game.bag[k] > 0);
    if (!ids.length) { await say('Your bag is empty.'); return; }
    const extra = (ctx, i) => { drawWin(ctx, 0, 176, W, 64); Font.wrap(ITEMS[ids[i]].desc, 296).forEach((l, k) => Font.draw(ctx, l, 12, 188 + k * 13, UI.ink)); };
    const i = await choose(ids.map(k => ({ label: ITEMS[k].name, right: 'x' + Game.bag[k] })), { x: 60, y: 4, w: 200, title: 'BAG', extra, maxRows: 10 });
    if (i < 0) return;
    const id = ids[i], it = ITEMS[id];
    if (it.orb) { await say('Orbs are thrown in battle with TAME.'); continue; }
    if (it.battleOnly) { await say(`${it.name} can only be used in battle.`); continue; }
    const t = await choose(Game.party.map(c => ({ label: cName(c), right: `${c.hp}/${maxHP(c)}` })), { x: 60, y: 30, w: 200, title: `Use ${it.name} on?` });
    if (t < 0) continue;
    const c = Game.party[t];
    if (it.use === 'revive') { if (c.hp > 0) { await say('It isn\'t fainted.'); continue; } takeItem(id); c.hp = Math.floor(maxHP(c) * (perk() === 'heal' ? .6 : .5)); }
    else if (c.hp <= 0) { await say('It has fainted. Use a Sanjivani Herb or visit the shrine.'); continue; }
    else if (it.use === 'heal') { if (c.hp >= maxHP(c)) { await say('HP is already full.'); continue; } takeItem(id); c.hp = Math.min(maxHP(c), c.hp + Math.round(it.amt * (perk() === 'heal' ? 1.2 : 1))); }
    else if (it.use === 'full') { takeItem(id); c.hp = maxHP(c); }
    else if (it.use === 'pp') { takeItem(id); c.moves.forEach(m => m.pp = MOVES[m.id].pp); c.en = maxEN(c); }
    else if (it.use === 'cure') { await say('Status conditions only last during battle.'); continue; }
    Sound.sfx('heal'); await say(`Used ${it.name} on ${cName(c)}.`);
  }
}
async function openShop() {
  while (true) {
    const stock = SHOP_STOCK.filter(k => !ITEMS[k].unlock || Game.flags[ITEMS[k].unlock]);
    const extra = (ctx, i) => { drawWin(ctx, 0, 176, W, 64); Font.wrap(ITEMS[stock[i]].desc, 296).forEach((l, k) => Font.draw(ctx, l, 12, 186 + k * 12, UI.ink)); Font.draw(ctx, `Coins: ${Game.player.money}${perk() === 'discount' ? '   (15% discount!)' : ''}   You have: ${Game.bag[stock[i]] || 0}`, 12, 224, UI.gold); };
    const i = await choose(stock.map(k => ({ label: ITEMS[k].name, right: priceOf(k) + 'c' })), { x: 70, y: 4, w: 180, title: 'BAZAAR', extra, maxRows: 10 });
    if (i < 0) { await say('Come again! May your orbs fly true.'); return; }
    const id = stock[i], price = priceOf(id);
    const q = await pickQty(id, price);
    if (q <= 0) continue;
    if (q * price > Game.player.money) { Sound.sfx('bump'); await say('You don\'t have enough coins.'); continue; }
    Game.player.money -= q * price; addItem(id, q); Sound.sfx('buy');
    await say(`You bought ${q} ${ITEMS[id].name}${q > 1 ? 's' : ''}.`);
  }
}
function pickQty(id, price) {
  return new Promise(resolve => {
    const s = {
      q: 1, update() {
        const max = Math.max(1, Math.min(99, Math.floor(Game.player.money / price)));
        if (Input.p('up') || Input.p('right')) { this.q = this.q >= max ? 1 : this.q + 1; Sound.sfx('cursor'); }
        if (Input.p('down') || Input.p('left')) { this.q = this.q <= 1 ? max : this.q - 1; Sound.sfx('cursor'); }
        if (Input.p('a')) { Sound.sfx('confirm'); Scenes.remove(this); resolve(this.q); }
        if (Input.p('b')) { Sound.sfx('cancel'); Scenes.remove(this); resolve(0); }
      },
      draw(ctx) { drawWin(ctx, 180, 120, 136, 50); Font.draw(ctx, 'Quantity', 190, 128, UI.gold); Font.draw(ctx, `< ${this.q} >`, 190, 142, '#ffffff'); Font.drawR(ctx, `${this.q * price}c`, 306, 142, UI.ink); Font.draw(ctx, 'Z buy  X cancel', 190, 156, UI.dim); },
    };
    Scenes.push(s);
  });
}
async function openSanctum() {
  while (true) {
    const i = await choose(['DEPOSIT', 'WITHDRAW', 'LEAVE'], { x: 200, y: 20, w: 100, title: `Stored: ${Game.storage.length}` });
    if (i < 0 || i === 2) return;
    if (i === 0) {
      if (Game.party.length <= 1) { await say('You must keep at least one companion with you.'); continue; }
      const k = await choose(Game.party.map(c => ({ label: cName(c), right: 'Lv' + c.lv })), { x: 20, y: 20, w: 170, title: 'Deposit which?' });
      if (k < 0) continue;
      const c = Game.party.splice(k, 1)[0]; healCreature(c); Game.storage.push(c); Sound.sfx('magic'); await say(`${cName(c)} rests in the Sanctum Stone.`);
    } else {
      if (!Game.storage.length) { await say('The Sanctum Stone is empty.'); continue; }
      if (Game.party.length >= 6) { await say('Your party is full.'); continue; }
      const k = await choose(Game.storage.map(c => ({ label: cName(c), right: 'Lv' + c.lv })), { x: 20, y: 20, w: 170, title: 'Withdraw which?' });
      if (k < 0) continue;
      const c = Game.storage.splice(k, 1)[0]; Game.party.push(c); Sound.sfx('magic'); await say(`${cName(c)} joined your party.`);
    }
  }
}
async function openOptions() {
  let i = 0;
  while (true) {
    const sp = ['Slow', 'Normal', 'Fast', 'Instant'][Settings.textSpeed];
    const bar = v => v ? '|'.repeat(v) + '.'.repeat(4 - v) : 'Off';
    const items = [{ label: 'Text speed', right: sp }, { label: 'Music volume', right: bar(Settings.musicVol) }, { label: 'Sound FX volume', right: bar(Settings.sfxVol) }, { label: 'Mute all', right: Settings.muted ? 'Yes' : 'No' }, { label: 'Bestiary preview', right: Settings.bestiaryPreview ? 'On' : 'Off' }, { label: 'Back' }];
    const extra = ctx => { drawWin(ctx, 0, 176, W, 64); Font.wrap(AI_ENDPOINT ? `AI endpoint: ${AI_ENDPOINT} (status: ${AI.status})` : 'AI: offline mode. Custom attacks, lore and dialogue use built-in fallbacks. See README to enable the optional server.', 296).forEach((l, k) => Font.draw(ctx, l, 12, 186 + k * 12, UI.ink)); Font.draw(ctx, 'Keys: arrows/WASD move, Z/Enter confirm, X back, ESC/C/M menu, Shift run, N mute', 12, 224, UI.dim); };
    i = await choose(items, { x: 60, y: 30, w: 200, title: 'OPTIONS', start: i, extra });
    if (i < 0 || i === 5) { saveSettings(); return; }
    if (i === 4) { Settings.bestiaryPreview = !Settings.bestiaryPreview; if (Settings.bestiaryPreview) await say('Bestiary preview reveals every creature, including those from cities that are not playable yet. It does not change your seen/tamed progress.'); }
    if (i === 0) Settings.textSpeed = (Settings.textSpeed + 1) % 4;
    if (i === 1) Settings.musicVol = (Settings.musicVol + 1) % 5;
    if (i === 2) { Settings.sfxVol = (Settings.sfxVol + 1) % 5; Sound.applyVolumes(); Sound.sfx('confirm'); }
    if (i === 3) { toggleMuteUI(); }
    Sound.applyVolumes(); saveSettings();
  }
}

// ---------------- BESTIARY ----------------
class BestiaryScene {
  constructor() { this.opaque = true; this.ci = 0; this.i = 0; this.top = 0; this.resolve = null; this.busy = false; }
  list() { return SPECIES_ORDER.filter(id => SPECIES[id].city === CITY_ORDER[this.ci]); }
  seen(id) { return Settings.bestiaryPreview || !!Game.seen[id]; }
  async update() {
    if (this.busy) return;
    const L = this.list();
    if (Input.p('left') || Input.p('right')) { this.ci = (this.ci + (Input.p('left') ? 7 : 1)) % 8; this.i = 0; this.top = 0; Sound.sfx('cursor'); return; }
    if (Input.p('up')) { this.i = (this.i + L.length - 1) % L.length; Sound.sfx('cursor'); }
    if (Input.p('down')) { this.i = (this.i + 1) % L.length; Sound.sfx('cursor'); }
    if (this.i < this.top) this.top = this.i; if (this.i >= this.top + 12) this.top = this.i - 11;
    if (Input.p('b') || Input.p('start')) { Sound.sfx('cancel'); Scenes.remove(this); this.resolve(); return; }
    if (Input.p('a')) {
      const id = L[this.i];
      if (!this.seen(id)) { Sound.sfx('bump'); return; }
      this.busy = true; Sound.sfx('magic');
      const lore = await expandedLore(id);
      await say(lore, { speaker: SPECIES[id].name });
      this.busy = false;
    }
  }
  draw(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#24123e'); g.addColorStop(1, '#120a20'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const total = SPECIES_ORDER.length, nSeen = SPECIES_ORDER.filter(id => Game.seen[id]).length, nTamed = SPECIES_ORDER.filter(id => Game.tamed[id]).length;
    Font.draw(ctx, 'BESTIARY', 6, 4, UI.gold, '#0b0714');
    Font.drawR(ctx, `Seen ${nSeen}/${total}   Tamed ${nTamed}/${total}`, 314, 4, UI.ink, '#0b0714');
    if (Settings.bestiaryPreview) { ctx.fillStyle = '#c8402a'; ctx.fillRect(70, 3, 50, 10); Font.draw(ctx, 'PREVIEW', 75, 4, '#ffffff'); }
    const city = CITIES[CITY_ORDER[this.ci]], L = this.list();
    drawWin(ctx, 2, 15, 316, 17, { border: city.color });
    const cs = SPECIES_ORDER.filter(id => SPECIES[id].city === CITY_ORDER[this.ci]), cSeen = cs.filter(id => Game.seen[id]).length;
    Font.drawC(ctx, `<  ${city.name} (${city.culture})  ${cSeen}/${cs.length}  >`, 160, 20, city.color);
    // list
    drawWin(ctx, 2, 33, 132, 205);
    L.slice(this.top, this.top + 12).forEach((id, k) => {
      const idx = SPECIES_ORDER.indexOf(id) + 1, y = 42 + k * 16, sel = this.top + k === this.i, sn = this.seen(id);
      if (sel) { ctx.fillStyle = 'rgba(232,184,74,.18)'; ctx.fillRect(6, y - 3, 124, 14); }
      Font.draw(ctx, String(idx).padStart(3, '0'), 18, y, UI.dim);
      Font.draw(ctx, sn ? SPECIES[id].name : '??????', 40, y, sn ? UI.ink : UI.dim);
      if (Game.tamed[id]) Font.draw(ctx, '★', 120, y, UI.gold); else if (Game.seen[id]) Font.draw(ctx, '·', 122, y, UI.ink);
      if (sel) drawCursor(ctx, 7, y);
    });
    // detail
    const id = L[this.i], sp = SPECIES[id], sn = this.seen(id);
    drawWin(ctx, 136, 33, 182, 205);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(227, 100, 40, 7, 0, 0, 7); ctx.fill();
    drawCreature(ctx, id, 227, 102, sn ? {} : { dark: true, frame: 0 });
    Font.draw(ctx, sn ? sp.name : '??????', 144, 108, '#ffffff');
    if (sn) {
      let x = 144; for (const t of sp.types) x += typeBadge(ctx, t, x, 119) + 1;
      Font.drawR(ctx, sp.rarity.toUpperCase() + (sp.bossOnly ? ' - TRIAL ONLY' : ''), 312, 108, UI.dim);
      Font.wrap(sp.lore, 166).slice(0, 4).forEach((l, k) => Font.draw(ctx, l, 144, 133 + k * 10, '#e8dcc0'));
      const evoFrom = SPECIES_ORDER.find(o => SPECIES[o].evo && SPECIES[o].evo[0] === id);
      const evoTxt = sp.evo ? `Evolves into ${this.seen(sp.evo[0]) ? SPECIES[sp.evo[0]].name : '???'} at Lv ${sp.evo[1]}` : evoFrom ? `Evolves from ${this.seen(evoFrom) ? SPECIES[evoFrom].name : '???'}` : 'Does not evolve';
      Font.draw(ctx, evoTxt, 144, 175, UI.green);
      if (Game.tamed[id] || Settings.bestiaryPreview) ['HP', 'ATK', 'DEF', 'SPD'].forEach((k, j) => { const y = 187 + j * 9; Font.draw(ctx, k, 144, y, UI.gold); drawBar(ctx, 170, y + 2, 100, 3, sp.base[j] / 100, '#6ac8ff'); Font.drawR(ctx, String(sp.base[j]), 304, y, UI.ink); });
      else Font.draw(ctx, 'Tame it to record its stats.', 144, 192, UI.dim);
    } else Font.wrap('Not yet encountered.' + (sp.city !== 'india' ? ` Lives in ${CITIES[sp.city].name}, whose road is still sealed.` : ''), 166).forEach((l, k) => Font.draw(ctx, l, 144, 124 + k * 11, UI.dim));
    Font.draw(ctx, sn ? 'Z lore   X back' : 'X back', 144, 227, UI.dim);
  }
}
function openBestiary() { return new Promise(r => { const s = new BestiaryScene(); s.resolve = r; Scenes.push(s); }); }
