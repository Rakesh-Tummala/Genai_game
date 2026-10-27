// =====================================================================
//  GAME STATE, CREATURE MODEL, SAVE / LOAD
// =====================================================================
const Game = {
  player: { name: 'Ira', charId: 'ira', money: 600, map: 'city', x: 15, y: 18, dir: 'down' },
  party: [], storage: [], bag: {}, flags: {}, seen: {}, tamed: {}, frames: 0, clock: 9 * 60, uid: 1,
};
const LEVEL_CAP = 50;
const xpForLevel = l => Math.floor(.8 * l * l * l);
const STAT_I = { hp: 0, atk: 1, def: 2, spd: 3 };
function stat(c, k) {
  const b = SPECIES[c.sp].base[STAT_I[k]];
  let v = k === 'hp' ? Math.floor(b * 2 * c.lv / 100) + c.lv + 10 : Math.floor(b * 2 * c.lv / 100) + 5;
  if (c.mythic) { if (c.mythic.up === k) v = Math.floor(v * 1.06) + 1; if (c.mythic.down === k) v = Math.floor(v * .97); }
  return v;
}
const maxHP = c => stat(c, 'hp');
const maxEN = c => 20 + Math.floor(c.lv / 5);
function cName(c) { return SPECIES[c.sp].name; }
function learnAt(spId, lv) { return SPECIES[spId].learn.filter(l => l[0] === lv).map(l => l[1]); }
function newCreature(spId, lv) {
  const sp = SPECIES[spId];
  const known = [];
  for (const [l, m] of sp.learn) if (l <= lv && !known.includes(m)) known.push(m);
  const c = { uid: Game.uid++, sp: spId, lv, xp: xpForLevel(lv), hp: 1, en: 20, moves: known.slice(-4).map(id => ({ id, pp: MOVES[id].pp })), mythic: null };
  c.hp = maxHP(c); c.en = maxEN(c);
  return c;
}
function healCreature(c) { c.hp = maxHP(c); c.en = maxEN(c); c.moves.forEach(m => m.pp = MOVES[m.id].pp); c.status = null; }
function healParty() { Game.party.forEach(healCreature); }
function firstAlive() { return Game.party.findIndex(c => c.hp > 0); }
function perk() { return (CHARACTERS.find(c => c.id === Game.player.charId) || {}).perk; }
function priceOf(id) { const p = ITEMS[id].price; return perk() === 'discount' ? Math.floor(p * .85) : p; }
function addItem(id, n = 1) { Game.bag[id] = (Game.bag[id] || 0) + n; }
function takeItem(id) { if (!Game.bag[id]) return false; if (--Game.bag[id] <= 0) delete Game.bag[id]; return true; }
function markSeen(sp) { Game.seen[sp] = true; }
function addCreature(c) {
  Game.tamed[c.sp] = true; Game.seen[c.sp] = true;
  if (Game.party.length < 6) { Game.party.push(c); return 'party'; }
  Game.storage.push(c); return 'storage';
}
function badgeCount() { return ['beatAgni', 'beatIndra'].filter(f => Game.flags[f]).length; }
function playTimeStr() { const s = Math.floor(Game.frames / 60), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return h + ':' + String(m).padStart(2, '0'); }
function clockStr() { const m = Math.floor(Game.clock) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
// 0 = day, 1 = deep night
function nightLevel() {
  const h = (Game.clock % 1440) / 60;
  if (h >= 7 && h < 17.5) return 0;
  if (h >= 17.5 && h < 20) return (h - 17.5) / 2.5;
  if (h >= 20 || h < 5) return 1;
  return 1 - (h - 5) / 2;
}
function saveGame() {
  try {
    const data = { v: 1, stage: BUILD_STAGE, player: Game.player, party: Game.party.map(stripBattle), storage: Game.storage.map(stripBattle), bag: Game.bag, flags: Game.flags, seen: Game.seen, tamed: Game.tamed, frames: Game.frames, clock: Game.clock, uid: Game.uid, savedAt: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data)); return true;
  } catch (e) { return false; }
}
function stripBattle(c) { const o = Object.assign({}, c); delete o.b; delete o.status; return o; }
function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
function loadGame() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (!d || d.v !== 1) return false;
    const valid = c => c && SPECIES[c.sp] && Array.isArray(c.moves) && c.moves.every(m => MOVES[m.id]);
    Object.assign(Game, { player: d.player, party: (d.party || []).filter(valid), storage: (d.storage || []).filter(valid), bag: d.bag || {}, flags: d.flags || {}, seen: d.seen || {}, tamed: d.tamed || {}, frames: d.frames || 0, clock: d.clock || 540, uid: d.uid || 1000 });
    for (const k in Game.bag) if (!ITEMS[k]) delete Game.bag[k];
    if (!Game.party.length) return false;
    return true;
  } catch (e) { return false; }
}
