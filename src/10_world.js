// =====================================================================
//  WORLD: maps, NPCs, overworld scene
// =====================================================================
const SOLID = new Set(['T', '|', 'L', 'S', 'R', '~', 'o', 'w', 'C', 'F', 'P', 'K', 'A', 'X']);
function blank(w, h, ch) { return Array.from({ length: h }, () => Array(w).fill(ch)); }
function R(t, x, y, w, h, ch) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (t[j] && t[j][i] !== undefined) t[j][i] = ch; }
function fromRows(rows) { return rows.map(r => r.split('')); }
const LOOKS = {
  guard: { hair: '#1a1210', skin: '#b87a4b', outfit: '#e8e0c8', accent: '#e8b030', pants: '#8a2a1a', style: 'short', crown: false, beard: true },
  acolyte: { hair: '#1a1210', skin: '#a86a3b', outfit: '#ff7a1a', accent: '#ffd040', pants: '#c8502a', style: 'short', style2: 'robe' },
  flower: { hair: '#2a1410', skin: '#c98a5a', outfit: '#e85a8a', accent: '#ffd040', pants: '#3a2a6a', style: 'long' },
  kid: { hair: '#14100e', skin: '#d9a066', outfit: '#3a8ad8', accent: '#ffffff', pants: '#5a4632', style: 'short' },
  oldman: { hair: '#e8e8e8', skin: '#b87a4b', outfit: '#f2ead8', accent: '#c8a060', pants: '#f2ead8', style: 'short', beard: true, style2: 'robe' },
  clerk: { hair: '#2a1410', skin: '#c98a5a', outfit: '#2a6fb0', accent: '#ffffff', pants: '#1a3a60', style: 'bun' },
  priest: { hair: '#14100e', skin: '#b87a4b', outfit: '#fbf6ea', accent: '#ff7a1a', pants: '#fbf6ea', style: 'long', style2: 'robe' },
  elder: { hair: '#d8d8d8', skin: '#a86a3b', outfit: '#ff9f1a', accent: '#8a2a1a', pants: '#ff9f1a', style: 'short', beard: true, style2: 'robe' },
  pilgrim: { hair: '#14100e', skin: '#a86a3b', outfit: '#d87a2a', accent: '#5a3a20', pants: '#e8dcc0', style: 'short', beard: true },
  sage: { hair: '#c8c8c8', skin: '#9a5a2b', outfit: '#c8502a', accent: '#5a3a20', pants: '#c8502a', style: 'long', beard: true, style2: 'robe' },
  agni: { hair: '#ff5a1f', skin: '#c8502a', outfit: '#ff7a1a', accent: '#ffd040', pants: '#8a1a0a', style: 'short', flame: true, beard: true, style2: 'robe' },
  indra: { hair: '#1a1210', skin: '#e0b080', outfit: '#3a6ad8', accent: '#ffd040', pants: '#ffd040', style: 'long', crown: true, style2: 'robe' },
  stone: null,
};
const MAPS = {};
function buildMaps() {
  // ---------------- INDRAPURI (city) ----------------
  {
    const w = 30, h = 26, t = blank(w, h, '.');
    R(t, 0, 0, w, 2, 'T'); R(t, 0, h - 1, w, 1, 'T'); R(t, 0, 0, 1, h, 'T'); R(t, w - 1, 0, 1, h, 'T');
    R(t, 2, 9, 26, 3, '='); R(t, 14, 12, 2, 14, '_');
    R(t, 4, 8, 1, 1, '_'); R(t, 24, 8, 1, 1, '_');
    R(t, 5, 17, 1, 1, '_'); R(t, 5, 18, 9, 1, '_'); R(t, 23, 17, 1, 1, '_'); R(t, 16, 18, 8, 1, '_');
    R(t, 5, 24, 9, 1, '_'); R(t, 24, 24, 1, 1, '_'); R(t, 16, 24, 9, 1, '_');
    R(t, 8, 12, 6, 1, 'f'); R(t, 9, 13, 4, 3, '~'); t[14][10] = 'o'; t[13][12] = 'o'; t[15][9] = 'o'; R(t, 8, 16, 6, 1, 'f');
    R(t, 17, 13, 3, 2, 'f'); R(t, 2, 18, 2, 1, 'f'); R(t, 26, 18, 2, 1, 'f');
    for (const [x, y] of [[2, 12], [27, 12], [9, 21], [19, 21], [10, 22], [18, 22], [1, 2], [28, 2], [1, 3], [28, 3], [8, 2], [21, 2], [9, 3], [20, 3]]) t[y][x] = 'T';
    for (const [x, y] of [[2, 9], [27, 9], [10, 11], [19, 11]]) t[y][x] = 'L';
    t[22][16] = 'S'; t[10][13] = 'f';
    MAPS.city = {
      id: 'city', name: 'Indrapuri', outdoor: true, music: 'city', t, w, h,
      buildings: [
        { x: 11, y: 2, w: 8, h: 7, style: 'palace', door: 14, to: ['palace', 6, 12] },
        { x: 2, y: 3, w: 6, h: 5, style: 'hall', door: 4, to: ['hall', 5, 10] },
        { x: 22, y: 3, w: 6, h: 5, style: 'shrine', door: 24, to: ['shrine', 4, 6] },
        { x: 3, y: 13, w: 6, h: 4, style: 'shop', door: 5, to: ['shop', 4, 6] },
        { x: 21, y: 13, w: 6, h: 4, style: 'house', door: 23, to: ['house', 4, 6] },
        { x: 3, y: 20, w: 5, h: 4, style: 'house2', door: 5, locked: 'The door is latched. Someone is singing inside.' },
        { x: 22, y: 20, w: 5, h: 4, style: 'house', door: 24, locked: 'A note on the door: "Gone to the monsoon fair."' },
      ],
      warps: [{ x: 14, y: 25, to: ['route', 11, 1, 'down'] }, { x: 15, y: 25, to: ['route', 12, 1, 'down'] }],
      signs: { '16,22': 'SOUTH: Monsoon Trail. Wild creatures roam the tall grass. Pilgrims gather by the river.' },
      npcs: [
        { id: 'guard', name: 'Palace Guard', look: 'guard', x: 14, y: 9, dir: 'down', when: () => !Game.flags.beatAgni, lines: ['Halt! Only those who have passed through Agni\'s flame may enter Vaijayanta.', 'The Fire Hall stands on the west side of the plaza.'] },
        { id: 'guard2', name: 'Palace Guard', look: 'guard', x: 13, y: 9, dir: 'right', when: () => !!Game.flags.beatAgni, lines: ['Agni\'s fire did not stop you. Enter - the King of the Heavens awaits.'] },
        { id: 'acolyte', name: 'Fire Acolyte', look: 'acolyte', x: 4, y: 8, dir: 'down', when: () => !Game.flags.beatRohan, lines: ['Lord Agni receives only Tamers who have proven their bond on the road.', 'Pilgrim Rohan waits by the river on the Monsoon Trail. Defeat him first!'] },
        { id: 'acolyte2', name: 'Fire Acolyte', look: 'acolyte', x: 3, y: 9, dir: 'right', when: () => !!Game.flags.beatRohan, lines: ['Rohan spoke well of you. Lord Agni is ready.'] },
        { id: 'flower', name: 'Malini', look: 'flower', x: 13, y: 16, dir: 'left', ai: 'flower seller at the lotus pond who loves Nagling', wander: 1, lines: ['Marigolds for the temple, lotuses for the pond! Have you seen the Naglings? They guard pearls under the lotus leaves.'] },
        { id: 'kid', name: 'Chotu', look: 'kid', x: 10, y: 18, dir: 'up', ai: 'excited child who explains how custom attacks work', wander: 2, lines: ['In battle, pick CUSTOM and type any attack you can imagine! The spirits decide how strong it really is.', 'You only get a few custom attacks per battle, and they need energy (EN) and cool down between uses.'] },
        { id: 'oldman', name: 'Old Vishnu-das', look: 'oldman', x: 20, y: 10, dir: 'down', ai: 'old storyteller who tells respectful tales of Indra and the monsoon', lines: ['They say Indra rides the white elephant Airavat across the monsoon clouds.', 'His trial is not about winning. It is about standing steady when the thunder comes.'] },
        { id: 'tipster', name: 'Traveller', look: 'pilgrim', x: 25, y: 11, dir: 'left', ai: 'traveller who explains type advantages', wander: 1, lines: ['Tide beats Ember, Ember beats Grove, Grove beats Tide. Storm sparks Tide and Sky but fizzles on Stone.', 'Light and Shade each cut deep into the other.'] },
      ],
      encounters: null, items: [],
    };
  }
  // ---------------- MONSOON TRAIL (route) ----------------
  {
    const w = 24, h = 46, t = blank(w, h, '.');
    R(t, 0, 0, 2, h, 'T'); R(t, w - 2, 0, 2, h, 'T'); R(t, 0, 0, w, 1, 'T'); R(t, 0, h - 1, w, 1, 'T');
    t[0][11] = '_'; t[0][12] = '_';
    R(t, 11, 0, 2, 44, '_');
    R(t, 3, 3, 7, 6, ','); R(t, 14, 3, 7, 6, ',');
    R(t, 2, 10, 9, 1, 'T'); R(t, 13, 10, 9, 1, 'T');
    R(t, 2, 13, 20, 2, '~'); R(t, 11, 13, 2, 2, 'B'); t[13][4] = 'o'; t[14][18] = 'o';
    R(t, 3, 18, 7, 7, ','); R(t, 14, 19, 7, 6, ',');
    R(t, 15, 27, 5, 3, '~'); t[28][17] = 'o'; t[27][15] = 'o';
    R(t, 3, 27, 3, 2, 'f'); R(t, 7, 11, 2, 1, 'f');
    R(t, 2, 32, 9, 1, 'T'); R(t, 13, 32, 9, 1, 'T'); t[31][10] = 'S';
    R(t, 3, 34, 7, 8, ':'); R(t, 14, 34, 7, 8, ':');
    R(t, 2, 43, 20, 1, 'R'); t[42][13] = 'S';
    for (const [x, y] of [[2, 16], [21, 16], [21, 26], [2, 30], [21, 30], [9, 26], [13, 26]]) t[y][x] = 'T';
    MAPS.route = {
      id: 'route', name: 'Monsoon Trail', outdoor: true, music: 'route', t, w, h, buildings: [],
      warps: [{ x: 11, y: 0, to: ['city', 14, 24, 'up'] }, { x: 12, y: 0, to: ['city', 15, 24, 'up'] }],
      signs: { '10,31': 'SACRED GROVE ahead. The blue-green grass hides stronger creatures (Lv 10-16).', '13,42': 'The road beyond is sealed by a wall of monsoon mist. (Other cities arrive in a later stage of MYTHBOUND.)' },
      npcs: [
        { id: 'rohan', name: 'Pilgrim Rohan', look: 'pilgrim', x: 14, y: 17, dir: 'left', trainer: 'rohan', sight: 4, lines: ['May your road be gentle. The Fire Hall in Indrapuri is open to you now.'] },
        { id: 'sage', name: 'Wandering Sage', look: 'sage', x: 7, y: 30, dir: 'down', ai: 'wandering sage who gives advice about taming creatures', lines: ['Weaken a creature before you throw an orb. Sleep or Bind makes the Nagastra Orb sing.', 'A Varunastra Orb calms Ember creatures as water calms fire.'] },
      ],
      encounters: {
        ',': { lv: [3, 7], table: [['nagling', 30], ['kinnarel', 30], ['gandharin', 22], ['vetalix', 15, 'night'], ['garudin', 3]] },
        ':': { lv: [10, 16], table: [['nagling', 18], ['vetalix', 18, 'night'], ['gandharin', 18], ['kinnarel', 16], ['garudin', 12], ['yalicub', 6], ['makarin', 6], ['vanarling', 6]] },
      },
      items: [{ id: 'r1', x: 4, y: 8, item: 'soma', n: 2 }, { id: 'r2', x: 19, y: 29, item: 'agneyastra', n: 1 }, { id: 'r3', x: 4, y: 40, item: 'nagastra', n: 2 }, { id: 'r4', x: 20, y: 37, item: 'akshaya', n: 1 }],
    };
  }
  // ---------------- INTERIORS ----------------
  MAPS.shop = { id: 'shop', name: 'Bazaar', music: 'city', t: fromRows(['wwwwwwwwww', 'wKKwwwwKKw', 'pppppppppp', 'ppCCCCCCpp', 'pppppppppp', 'ppcccccppp', 'pppppppppp', 'wwwwmwwwww']), buildings: [], signs: {}, items: [],
    npcs: [{ id: 'clerk', name: 'Shopkeeper Lakshmi', look: 'clerk', x: 4, y: 2, dir: 'down', role: 'shop' }], exit: ['city', 5, 17, 'down'] };
  MAPS.shrine = { id: 'shrine', name: 'Shrine of Dhanvantari', music: 'city', t: fromRows(['wwwwwwwwww', 'wwwAAwwwKw', 'ppppppppKp', 'ppppccpppp', 'ppppccpppp', 'ppppccpppp', 'ppppccpppp', 'wwwwmwwwww']), buildings: [], signs: {}, items: [],
    npcs: [{ id: 'priest', name: 'Priestess Gauri', look: 'priest', x: 4, y: 2, dir: 'down', role: 'heal' }, { id: 'sanctum', name: 'Sanctum Stone', look: 'stone', x: 7, y: 2, dir: 'down', role: 'storage' }], exit: ['city', 24, 8, 'down'] };
  MAPS.house = { id: 'house', name: 'Elder\'s House', music: 'city', t: fromRows(['wwwwwwwwww', 'wKKwwwwKKw', 'pppppppppp', 'ppcccccppp', 'ppcccccppp', 'pppppppppp', 'pppppppppp', 'wwwwmwwwww']), buildings: [], signs: {}, items: [],
    npcs: [{ id: 'elder', name: 'Elder Bhaskar', look: 'elder', x: 4, y: 2, dir: 'down', role: 'elder', ai: 'kind village elder who gave the player their first creature' }], exit: ['city', 23, 17, 'down'] };
  MAPS.hall = { id: 'hall', name: 'Fire Hall of Agni', music: 'boss', t: fromRows(['wwwwwwwwwwww', 'wwwwFAAFwwww', 'pFppcccppFpp', 'ppppcccppppp', 'pFppcccppFpp', 'ppppcccppppp', 'pFppcccppFpp', 'ppppcccppppp', 'pFppcccppFpp', 'ppppcccppppp', 'ppppcccppppp', 'wwwwwmwwwwww']), buildings: [], signs: {}, items: [],
    npcs: [{ id: 'agni', name: 'Agni', look: 'agni', x: 5, y: 2, dir: 'down', trainer: 'agni', boss: true }], exit: ['city', 4, 8, 'down'] };
  MAPS.palace = { id: 'palace', name: 'Vaijayanta Palace', music: 'boss', t: fromRows(['wwwwwwwwwwwwww', 'wwwwwwAAwwwwww', 'gPgggcccgggPgg', 'gggggcccgggggg', 'gPgggcccgggPgg', 'gggggcccgggggg', 'gPgggcccgggPgg', 'gggggcccgggggg', 'gPgggcccgggPgg', 'gggggcccgggggg', 'gPgggcccgggPgg', 'gggggcccgggggg', 'gggggcccgggggg', 'wwwwwwmwwwwwww']), buildings: [], signs: {}, items: [],
    npcs: [{ id: 'indra', name: 'Indra', look: 'indra', x: 6, y: 2, dir: 'down', trainer: 'indra', boss: true }], exit: ['city', 14, 9, 'down'] };
  for (const id in MAPS) { const m = MAPS[id]; m.h = m.t.length; m.w = m.t[0].length; m.buildings.forEach(b => b.img = renderBuilding(b)); }
}

// =====================================================================
class Overworld {
  constructor() {
    this.map = null; this.p = { x: 0, y: 0, dir: 'down', moving: false, prog: 0, from: null, step: 0 };
    this.npcs = []; this.parts = []; this.cam = { x: 0, y: 0 }; this.busy = false; this.opaque = true;
  }
  load(mapId, x, y, dir) {
    this.map = MAPS[mapId]; Game.player.map = mapId; Game.player.x = x; Game.player.y = y;
    Object.assign(this.p, { x, y, dir: dir || this.p.dir, moving: false, prog: 0 });
    this.npcs = this.map.npcs.filter(n => !n.when || n.when()).map(n => Object.assign({}, n, { ox: n.x, oy: n.y, moving: false, prog: 0, wt: randi(60, 200) }));
    this.parts = [];
    Sound.play(this.map.music);
  }
  refreshNPCs() { const m = this.map.id, p = this.p; this.load(m, p.x, p.y, p.dir); }
  tileAt(x, y) { const m = this.map; if (x < 0 || y < 0 || x >= m.w || y >= m.h) return 'X'; return m.t[y][x]; }
  buildingAt(x, y) { return this.map.buildings.find(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h); }
  blocked(x, y, ignoreNpc) {
    const t = this.tileAt(x, y); if (SOLID.has(t)) return true;
    const b = this.buildingAt(x, y); if (b && !(y === b.y + b.h - 1 && x === b.door)) return true;
    if (!ignoreNpc && this.npcs.some(n => n.x === x && n.y === y)) return true;
    if (this.p.x === x && this.p.y === y) return true;
    return false;
  }
  update() {
    Game.clock += 1 / 60;
    this.updateParticles();
    for (const n of this.npcs) this.updateNPC(n);
    const p = this.p;
    if (p.moving) {
      p.prog += Input.h('run') || Input.h('b') ? 2 : 1.34;
      if (p.prog >= 16) { p.moving = false; p.prog = 0; this.arrive(); }
      return;
    }
    if (this.busy) return;
    if (Input.p('start')) { this.openMenu(); return; }
    if (Input.p('a')) { this.interact(); return; }
    for (const d of ['up', 'down', 'left', 'right']) if (Input.h(d)) { this.tryMove(d); break; }
  }
  tryMove(d) {
    const p = this.p; p.dir = d;
    const [dx, dy] = DIRV[d], nx = p.x + dx, ny = p.y + dy;
    // locked doors
    const b = this.buildingAt(nx, ny);
    if (b && b.locked && ny === b.y + b.h - 1 && nx === b.door) { this.run(async () => { await say(b.locked); }); return; }
    if (this.blocked(nx, ny)) { if (!this._bumpT || Game.frames - this._bumpT > 20) { Sound.sfx('bump'); this._bumpT = Game.frames; } return; }
    p.from = [p.x, p.y]; p.x = nx; p.y = ny; p.moving = true; p.prog = 0; p.step++;
  }
  async arrive() {
    const p = this.p, m = this.map; Game.player.x = p.x; Game.player.y = p.y; Game.player.dir = p.dir;
    // door into building
    const b = this.buildingAt(p.x, p.y);
    if (b && b.to) { Sound.sfx('door'); return this.run(() => this.warp(b.to[0], b.to[1], b.to[2], 'up')); }
    const wp = (m.warps || []).find(w => w.x === p.x && w.y === p.y);
    if (wp) return this.run(() => this.warp(...wp.to));
    if (this.tileAt(p.x, p.y) === 'm' && m.exit) { Sound.sfx('door'); return this.run(() => this.warp(...m.exit)); }
    // item pickup
    const it = (m.items || []).find(i => i.x === p.x && i.y === p.y && !Game.flags['item_' + i.id]);
    if (it) { Game.flags['item_' + it.id] = true; addItem(it.item, it.n); Sound.sfx('pickup'); return this.run(() => say(`Found ${it.n > 1 ? it.n + 'x ' : ''}${ITEMS[it.item].name}!`)); }
    // trainer line of sight
    for (const n of this.npcs) {
      if (!n.trainer || !n.sight || Game.flags[TRAINERS[n.trainer].flag]) continue;
      const [dx, dy] = DIRV[n.dir];
      for (let k = 1; k <= n.sight; k++) {
        const tx = n.x + dx * k, ty = n.y + dy * k;
        if (tx === p.x && ty === p.y) { return this.run(() => this.trainerSpotted(n, k)); }
        if (this.blocked(tx, ty, true)) break;
      }
    }
    // wild encounters
    const enc = m.encounters && m.encounters[this.tileAt(p.x, p.y)];
    if (enc && chance(.11)) {
      const night = nightLevel() > .5;
      const table = enc.table.map(e => [e[0], e[1] * (e[2] === 'night' && night ? 2.5 : 1)]);
      let tot = table.reduce((a, e) => a + e[1], 0), r = Math.random() * tot, sp = table[0][0];
      for (const e of table) { if ((r -= e[1]) < 0) { sp = e[0]; break; } }
      const lv = randi(enc.lv[0], enc.lv[1]);
      return this.run(() => startBattle({ kind: 'wild', team: [newCreature(sp, lv)] }));
    }
  }
  async trainerSpotted(n, dist) {
    Sound.sfx('encounter'); n.alert = 40; await wait(40);
    // walk up to the player
    const [dx, dy] = DIRV[n.dir];
    for (let k = 1; k < dist; k++) { n.from = [n.x, n.y]; n.x += dx; n.y += dy; n.moving = true; n.prog = 0; await wait(12); n.moving = false; }
    this.p.dir = OPP[n.dir];
    await this.trainerBattle(n);
  }
  async trainerBattle(n) {
    const tr = TRAINERS[n.trainer];
    await say(tr.intro, { speaker: tr.name });
    const res = await startBattle({ kind: 'trainer', trainerId: n.trainer, team: tr.team.map(([s, l]) => newCreature(s, l)) });
    if (res === 'win') this.refreshNPCs();
  }
  run(fn) { this.busy = true; return Promise.resolve().then(fn).catch(e => console.error(e)).finally(() => { this.busy = false; Input.clear(); }); }
  async warp(mapId, x, y, dir) {
    await fadeOut(12); this.load(mapId, x, y, dir); await fadeIn(12);
  }
  facing() { const [dx, dy] = DIRV[this.p.dir]; return [this.p.x + dx, this.p.y + dy]; }
  interact() {
    let [fx, fy] = this.facing();
    if (this.tileAt(fx, fy) === 'C') { fx += DIRV[this.p.dir][0]; fy += DIRV[this.p.dir][1]; }
    const n = this.npcs.find(q => q.x === fx && q.y === fy);
    if (n) { n.dir = OPP[this.p.dir]; return this.run(() => this.talk(n)); }
    const sign = this.map.signs[fx + ',' + fy];
    if (sign) return this.run(() => say(sign));
  }
  async talk(n) {
    if (n.trainer) {
      const tr = TRAINERS[n.trainer];
      if (Game.flags[tr.flag]) { await say(n.boss ? (n.trainer === 'indra' ? ['INDRA: The rains will follow you, Tamer.', 'Other gods watch from distant cities. Their roads are still sealed by mist - for now.'] : ['AGNI: Carry the flame with you. Vaijayanta awaits.']) : n.lines, { speaker: n.name }); return; }
      if (n.boss) {
        const c = await ask(n.trainer === 'indra' ? 'The air hums with thunder. Begin the Trial of the Heavens?' : 'The sacred fire roars. Challenge Agni, Lieutenant of Indra?');
        if (c !== 0) return;
      }
      return this.trainerBattle(n);
    }
    if (n.role === 'shop') { await say('Welcome to the Bazaar! Orbs, herbs and holy water - all fairly priced.', { speaker: n.name }); await openShop(); return; }
    if (n.role === 'heal') {
      const c = await ask('Shall I let your companions rest in the shrine\'s light?', ['Yes', 'No'], { speaker: n.name });
      if (c === 0) { Game.flags.lastShrine = true; await fadeOut(10); healParty(); Sound.sfx('heal'); await wait(30); await fadeIn(10); await say('Your companions are fully restored. Return whenever you need.', { speaker: n.name }); }
      return;
    }
    if (n.role === 'storage') { await say('The Sanctum Stone glows. Creatures beyond your party of six rest here.'); await openSanctum(); return; }
    if (n.role === 'elder') {
      if (!Game.flags.elderGift) { Game.flags.elderGift = true; addItem('bana', 5); addItem('soma', 3); Sound.sfx('pickup'); await say(['Take these: 5 Bana Orbs and 3 Soma Drops.', 'Weaken a wild creature, then choose TAME in battle to throw an orb.', 'When you are ready, beat Pilgrim Rohan on the Monsoon Trail, then face Agni in the Fire Hall. Only then will Indra receive you.'], { speaker: n.name }); return; }
      const line = await npcLine(n, Game.flags.beatIndra ? 'You passed Indra\'s trial! The whole city heard the thunder of your victory.' : 'Your journey begins on the Monsoon Trail, to the south.');
      await say(line, { speaker: n.name }); return;
    }
    const fallback = n.lines[(n.talkI = ((n.talkI || 0) + 1)) % n.lines.length] || n.lines[0];
    const line = await npcLine(n, fallback);
    await say(line, { speaker: n.name });
  }
  updateNPC(n) {
    if (n.alert) n.alert--;
    if (n.moving) { n.prog += 1.4; if (n.prog >= 16) { n.moving = false; n.prog = 0; } return; }
    if (!n.wander || this.busy || Scenes.top() !== this) return;
    if (--n.wt > 0) return;
    n.wt = randi(90, 240);
    const d = pick(['up', 'down', 'left', 'right']), [dx, dy] = DIRV[d];
    n.dir = d;
    const nx = n.x + dx, ny = n.y + dy;
    if (Math.abs(nx - n.ox) > n.wander || Math.abs(ny - n.oy) > n.wander) return;
    if (this.blocked(nx, ny) || this.tileAt(nx, ny) === ',' ) return;
    n.from = [n.x, n.y]; n.x = nx; n.y = ny; n.moving = true; n.prog = 0;
  }
  async openMenu() {
    this.busy = true; Sound.sfx('confirm');
    try { await openStartMenu(); } finally { this.busy = false; Input.clear(); }
  }
  // ---------------- drawing ----------------
  entityPos(e) {
    if (!e.moving || !e.from) return [e.x * 16, e.y * 16];
    const t = e.prog / 16; return [lerp(e.from[0], e.x, t) * 16, lerp(e.from[1], e.y, t) * 16];
  }
  updateParticles() {
    if (!this.map.outdoor) return;
    const night = nightLevel();
    if (this.parts.length < 26 && chance(.2)) {
      if (night > .5) this.parts.push({ k: 'fly', x: this.cam.x + Math.random() * W, y: this.cam.y + Math.random() * H, vx: 0, vy: 0, life: 300, ph: Math.random() * 6 });
      else this.parts.push({ k: 'petal', x: this.cam.x + Math.random() * (W + 80) - 40, y: this.cam.y - 8, vx: .2 + Math.random() * .3, vy: .35 + Math.random() * .3, life: 700, ph: Math.random() * 6, c: pick(['#ff9f1a', '#ffd23a', '#ff6a3a']) });
    }
    for (const q of this.parts) { q.life--; q.ph += .05; if (q.k === 'petal') { q.x += q.vx + Math.sin(q.ph) * .4; q.y += q.vy; } else { q.x += Math.sin(q.ph * 1.3) * .3; q.y += Math.cos(q.ph) * .25; } }
    this.parts = this.parts.filter(q => q.life > 0 && q.y < this.cam.y + H + 10);
  }
  draw(ctx) {
    const m = this.map, [px, py] = this.entityPos(this.p);
    const mw = m.w * 16, mh = m.h * 16;
    this.cam.x = mw <= W ? (mw - W) / 2 : clamp(px + 8 - W / 2, 0, mw - W);
    this.cam.y = mh <= H ? (mh - H) / 2 : clamp(py + 8 - H / 2, 0, mh - H);
    const cx = Math.round(this.cam.x), cy = Math.round(this.cam.y);
    ctx.fillStyle = '#0b0714'; ctx.fillRect(0, 0, W, H);
    const x0 = Math.max(0, Math.floor(cx / 16)), y0 = Math.max(0, Math.floor(cy / 16)), x1 = Math.min(m.w - 1, x0 + 21), y1 = Math.min(m.h - 1, y0 + 16);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) ctx.drawImage(Tiles.get(m.t[y][x], Game.frames, x, y), x * 16 - cx, y * 16 - cy);
    // buildings
    for (const b of m.buildings) ctx.drawImage(b.img.canvas, b.x * 16 - cx, b.y * 16 - cy - b.img.top);
    // items
    for (const it of m.items || []) if (!Game.flags['item_' + it.id]) {
      const ix = it.x * 16 - cx + 8, iy = it.y * 16 - cy + 9 + Math.sin(Game.frames / 10) * 1.5;
      ctx.fillStyle = '#1a1020'; ctx.beginPath(); ctx.arc(ix, iy, 4.5, 0, 7); ctx.fill();
      ctx.fillStyle = ITEMS[it.item].orb ? '#e8b030' : '#5fd0a0'; ctx.beginPath(); ctx.arc(ix, iy, 3.5, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillRect(ix - 2, iy - 2, 2, 1);
    }
    // entities sorted by y
    const ents = this.npcs.map(n => ({ e: n, look: n.look })).concat([{ e: this.p, player: true }]);
    ents.sort((a, b) => this.entityPos(a.e)[1] - this.entityPos(b.e)[1]);
    for (const en of ents) {
      const [ex, ey] = this.entityPos(en.e);
      if (en.look === 'stone') { drawSanctumStone(ctx, ex - cx, ey - cy); continue; }
      const look = en.player ? CHARACTERS.find(c => c.id === Game.player.charId).look : LOOKS[en.look];
      const fr = personFrames(look), dir = en.e.dir;
      const walkF = en.e.moving ? (en.e.prog < 8 ? 1 + ((en.e.step || (en.e.x + en.e.y)) & 1) : 0) : 0;
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(ex - cx + 3, ey - cy + 13, 10, 3);
      ctx.drawImage(fr[dir][walkF], Math.round(ex - cx), Math.round(ey - cy - 3));
      if (en.e.alert) { drawWin(ctx, ex - cx + 3, ey - cy - 20, 11, 13); Font.draw(ctx, '!', ex - cx + 8, ey - cy - 17, UI.red); }
      if (en.e.boss && !Game.flags[TRAINERS[en.e.trainer].flag]) { const a = .5 + .5 * Math.sin(Game.frames / 15); ctx.globalAlpha = a * .5; ctx.fillStyle = en.e.trainer === 'indra' ? '#9fe4ff' : '#ff7a1a'; ctx.beginPath(); ctx.arc(ex - cx + 8, ey - cy + 6, 11, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.drawImage(fr[dir][walkF], Math.round(ex - cx), Math.round(ey - cy - 3)); }
    }
    // day / night tint + lamp glow
    if (m.outdoor) {
      const n = nightLevel();
      if (n > 0) {
        const col = n < .5 ? mixHex('#ffffff', '#ffb888', n * 2) : mixHex('#ffb888', '#4648a0', (n - .5) * 2);
        ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (m.t[y][x] === 'L') {
          const gx = x * 16 - cx + 8, gy = y * 16 - cy + 2, rr = 26 + Math.sin(Game.frames / 9 + x) * 2;
          const g = ctx.createRadialGradient(gx, gy, 1, gx, gy, rr); g.addColorStop(0, `rgba(255,190,90,${.55 * n})`); g.addColorStop(1, 'rgba(255,150,50,0)');
          ctx.fillStyle = g; ctx.fillRect(gx - rr, gy - rr, rr * 2, rr * 2);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      for (const q of this.parts) {
        const qx = Math.round(q.x - cx), qy = Math.round(q.y - cy);
        if (q.k === 'petal') { ctx.fillStyle = q.c; ctx.fillRect(qx, qy, 2, 1); ctx.fillRect(qx + (Math.sin(q.ph) > 0 ? 1 : 0), qy + 1, 1, 1); }
        else { const a = .5 + .5 * Math.sin(q.ph * 3); ctx.fillStyle = `rgba(220,255,140,${a})`; ctx.fillRect(qx, qy, 1, 1); ctx.fillStyle = `rgba(220,255,140,${a * .3})`; ctx.fillRect(qx - 1, qy - 1, 3, 3); }
      }
    }
    // location banner
    if (this.banner === undefined || this.bannerMap !== m.id) { this.banner = 150; this.bannerMap = m.id; }
    if (this.banner > 0) { this.banner--; const y = this.banner > 130 ? -18 + (150 - this.banner) : this.banner < 20 ? -18 + this.banner : 2; drawWin(ctx, 4, y, Font.measure(m.name) + 20, 16); Font.draw(ctx, m.name, 14, y + 4, UI.gold); }
  }
}
const DIRV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
function drawSanctumStone(ctx, x, y) {
  ctx.fillStyle = '#1a1020'; ctx.fillRect(x + 2, y - 4, 12, 19);
  ctx.fillStyle = '#7a7a8a'; ctx.fillRect(x + 3, y - 3, 10, 17); ctx.fillStyle = '#a8a8b8'; ctx.fillRect(x + 3, y - 3, 10, 2);
  const a = .5 + .5 * Math.sin(Game.frames / 12); ctx.fillStyle = `rgba(120,220,255,${.4 + a * .5})`; ctx.fillRect(x + 6, y + 1, 4, 6); ctx.fillRect(x + 7, y, 2, 8);
}
