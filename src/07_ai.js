// =====================================================================
//  AI LAYER
//  askAI(task, payload) -> POSTs {task, payload} to AI_ENDPOINT (if set) and
//  returns parsed JSON or null. Every feature has a built-in offline fallback.
//  IMPORTANT: the AI only *describes* things. Game code validates and decides
//  every number (damage, accuracy, cost, cooldown, duration).
// =====================================================================
const AI = { status: AI_ENDPOINT ? 'online' : 'offline', lastError: '' };
async function askAI(task, payload, timeoutMs = 9000) {
  if (!AI_ENDPOINT) return null;
  const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(AI_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task, payload }), signal: ctl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    AI.status = 'online';
    if (j && j.ok === false) throw new Error(j.error || 'server error');
    return j && j.data !== undefined ? j.data : j;
  } catch (e) { AI.status = 'fallback'; AI.lastError = String(e.message || e); return null; }
  finally { clearTimeout(tm); }
}
// pull the first JSON object out of whatever came back
function coerceJSON(x) {
  if (x && typeof x === 'object') return x;
  if (typeof x !== 'string') return null;
  const m = x.match(/\{[\s\S]*\}/); if (!m) return null;
  try { return JSON.parse(m[0]); } catch (e) { return null; }
}

// ---------------------------------------------------------------------
//  CUSTOM ATTACKS
// ---------------------------------------------------------------------
const CA = {
  MAX_PER_BATTLE: 3,
  CATEGORIES: ['damage', 'shield', 'heal', 'dot', 'buff', 'debuff', 'terrain'],
  // whitelisted effect kinds and the category each implies when primary
  KINDS: { damage: 'damage', shield: 'shield', heal: 'heal', burn: 'dot', poison: 'dot', sleep: 'debuff', stun: 'debuff', bind: 'debuff', atk_up: 'buff', def_up: 'buff', spd_up: 'buff', atk_down: 'debuff', def_down: 'debuff', spd_down: 'debuff', terrain: 'terrain' },
  SYNONYMS: { attack: 'damage', strike: 'damage', hit: 'damage', dmg: 'damage', protect: 'shield', barrier: 'shield', ward: 'shield', guard: 'shield', block: 'shield', restore: 'heal', regen: 'heal', recover: 'heal', dot: 'burn', fire: 'burn', toxic: 'poison', venom: 'poison', paralyze: 'stun', paralysis: 'stun', freeze: 'stun', trap: 'bind', root: 'bind', slow: 'spd_down', push: 'spd_down', knockback: 'spd_down', weaken: 'atk_down', soften: 'def_down', haste: 'spd_up', empower: 'atk_up', harden: 'def_up', field: 'terrain', zone: 'terrain', drain: 'damage' },
  BANNED: /(instant|insta[- ]?(kill|win)|one[- ]?(hit|shot)|ohko|\bkill\b|auto[- ]?win|win the (battle|game|fight)|infinite|forever|unlimited|revive|resurrect|max(imum)? level|level up|\bmoney\b|\bcoins?\b|\bcapture (it|them|the)|\btame (it|them|the)|steal|delete|erase|destroy (the )?(world|game|universe)|god ?mode|invincib|immortal|invulnerab|100 ?%|guarantee|always hit|never miss|ignore (all|every)|skip (the|their) turn forever|end the (battle|game))/i,
};
const TYPE_WORDS = {
  Tide: /\b(wave|water|tide|flood|rain|river|ocean|sea|splash|torrent|monsoon|current|whirlpool|tsunami|bubble|mist)/i,
  Ember: /\b(fire|flame|burn|blaze|ember|scorch|inferno|heat|lava|magma|ash|sun ?fire|pyre|smoulder|smolder)/i,
  Grove: /\b(vine|leaf|leaves|thorn|root|tree|forest|grove|bloom|flower|petal|seed|moss|herb|banyan|lotus|grass|pollen)/i,
  Stone: /\b(stone|rock|earth|quake|boulder|mountain|sand|pebble|granite|ground|crag|landslide|wall of stone)/i,
  Sky: /\b(wind|gust|feather|sky|cloud|air|tornado|cyclone|wing|breeze|soar|dive|hurricane)/i,
  Shade: /\b(shadow|dark|curse|night|fear|nightmare|gloom|void|ghost|hex|dread|phantom|eclipse|riddle)/i,
  Light: /\b(light(?!ning)|radiant|holy|sacred|sun|dawn|glow|shine|halo|beam|prism|star|blessing|hymn|song)/i,
  Storm: /\b(storm|thunder|lightning|shock|spark|electric|bolt|static|zap|tempest|vajra)/i,
};
const KIND_WORDS = [
  ['shield', /\b(shield|barrier|protect|guard|ward|wall|armou?r|aegis|bubble|cover|block|deflect)/i],
  ['heal', /\b(heal|mend|restore|recover|regenerat|cure|soothe|rejuvenat|refresh|revitali)/i],
  ['burn', /\b(burn|scorch|ignite|sear|blaze)/i],
  ['poison', /\b(poison|venom|toxic|toxin|sting)/i],
  ['bind', /\b(bind|wrap|coil|entangle|chain|trap|snare|grip|ensnare|constrict|root)/i],
  ['sleep', /\b(sleep|lull|dream|drowsy|hypno|slumber|lullaby)/i],
  ['stun', /\b(stun|daze|paraly|shock|freeze|stagger|flinch)/i],
  ['spd_down', /\b(push(es|ing)? (it |them |the enemy |the foe )?back|slow|knock ?back|hinder|drag|mud|sticky)/i],
  ['atk_down', /\b(weaken|intimidat|frighten|scare|sap|demorali|blunt)/i],
  ['def_down', /\b(shatter|crack|break (their|its|the) (armou?r|defen[cs]e)|pierce|expose|corrode|melt)/i],
  ['atk_up', /\b(power ?up|strengthen|rage|focus|empower|charge up|pump|fury|sharpen)/i],
  ['def_up', /\b(harden|toughen|fortify|brace|steel)/i],
  ['spd_up', /\b(haste|speed up|swift|quicken|accelerat|faster|agile)/i],
  ['terrain', /\b(terrain|field|zone|arena|swamp|forest floor|battlefield|storm clouds over|fog|aura)/i],
];
const DAMAGE_WORDS = /\b(attack|strike|hit|slash|blast|bite|crash|smash|punch|kick|wave|beam|bolt|shot|lash|ram|charge|slam|pierce|stab|claw|tackle|burst|explo|surge|barrage|rain|storm|throw|hurl|summon|spear|arrow|fang|whip|dive)/i;
const NAME_ADJ = { Tide: ['Monsoon', 'Tidal', 'River', 'Lotus-Pool'], Ember: ['Cinder', 'Blazing', 'Pyre', 'Ember'], Grove: ['Banyan', 'Thorn', 'Verdant', 'Petal'], Stone: ['Granite', 'Temple', 'Boulder', 'Crag'], Sky: ['Gale', 'Feather', 'Cloud', 'Zephyr'], Shade: ['Night', 'Umbral', 'Hollow', 'Moonless'], Light: ['Dawn', 'Radiant', 'Sunlit', 'Hymn'], Storm: ['Thunder', 'Lightning', 'Tempest', 'Vajra'], Neutral: ['Spirit', 'Mantra', 'Will', 'Kindred'] };
const NAME_NOUN = { damage: ['Surge', 'Strike', 'Crash', 'Lash', 'Burst'], shield: ['Aegis', 'Ward', 'Bulwark'], heal: ['Mend', 'Balm', 'Blessing'], burn: ['Brand'], poison: ['Venom'], sleep: ['Lullaby'], stun: ['Jolt'], bind: ['Coil', 'Snare'], atk_up: ['Fury'], def_up: ['Bastion'], spd_up: ['Haste'], atk_down: ['Hex'], def_down: ['Rend'], spd_down: ['Drag'], terrain: ['Field', 'Domain'] };
const KIND_LABEL = { damage: 'Damage', shield: 'Shield', heal: 'Heal', burn: 'Burn', poison: 'Poison', sleep: 'Sleep', stun: 'Stun', bind: 'Bind', atk_up: 'ATK Up', def_up: 'DEF Up', spd_up: 'SPD Up', atk_down: 'Foe ATK Down', def_down: 'Foe DEF Down', spd_down: 'Foe SPD Down', terrain: 'Terrain' };

// ---- offline keyword interpreter -> same JSON shape the AI returns ----
function interpretIdeaOffline(idea, ctx) {
  const text = String(idea || '');
  // type detection: earliest match wins
  // prefer the creature's own type if the idea mentions it anywhere, else the earliest type word
  let type = ctx.types.find(t => TYPE_WORDS[t] && TYPE_WORDS[t].test(text)) || null, best = 1e9;
  if (!type) for (const t in TYPE_WORDS) { const m = TYPE_WORDS[t].exec(text); if (m && m.index < best) { best = m.index; type = t; } }
  if (!type) type = ctx.types[0];
  const found = [];
  for (const [kind, re] of KIND_WORDS) { const m = re.exec(text); if (m) found.push({ kind, at: m.index }); }
  // 'burn' implied by fire-flavoured damage only if explicitly asked; avoid double counting shock as both type and stun
  const dm = DAMAGE_WORDS.exec(text);
  let primary, secondary;
  const PRIO = ['shield', 'heal', 'burn', 'poison', 'bind', 'sleep', 'stun', 'def_down', 'atk_down', 'spd_down', 'atk_up', 'def_up', 'spd_up', 'terrain'];
  found.sort((a, b) => PRIO.indexOf(a.kind) - PRIO.indexOf(b.kind));
  if (dm || !found.length) { primary = 'damage'; secondary = found[0] && found[0].kind; }
  else { const byPos = [...found].sort((a, b) => a.at - b.at); primary = byPos[0].kind; secondary = found.find(f => f.kind !== primary); secondary = secondary && secondary.kind; }
  let r1 = 3, r2 = 2;
  if (/\b(huge|massive|mighty|giant|devastating|ultimate|great|powerful|tremendous|colossal|enormous|epic|mega|supreme)\b/i.test(text)) { r1++; r2++; }
  if (/\b(small|little|light|gentle|quick|tiny|minor|weak|soft|brief)\b/i.test(text)) { r1--; r2--; }
  const effects = [{ kind: primary, rating: r1 }];
  if (secondary) effects.push({ kind: secondary, rating: r2 });
  const adjs = NAME_ADJ[type] || NAME_ADJ.Neutral;
  const nounM = /\b(wave|beam|bolt|blast|slash|bite|fang|claw|strike|punch|kick|spear|arrow|storm|surge|burst|crash|lash|whip|dive|torrent|flood|quake|tornado|gale|inferno|blaze|thorn|vine|meteor|comet|roar|hymn|song|nova|ray|flare)/i.exec(text);
  const kw = nounM ? nounM[1][0].toUpperCase() + nounM[1].slice(1).toLowerCase() : pick(NAME_NOUN[primary] || ['Art']);
  let name = adjs[hashStr(text) % adjs.length] + ' ' + (primary === 'damage' ? kw : pick(NAME_NOUN[primary]));
  if (secondary && NAME_NOUN[secondary] && name.length < 14) name += ' ' + NAME_NOUN[secondary][0];
  const desc = `${ctx.name} channels ${type === 'Neutral' ? 'its spirit' : type + ' power'}: ${KIND_LABEL[primary].toLowerCase()}${secondary ? ' with ' + KIND_LABEL[secondary].toLowerCase() : ''}.`;
  return { name, type, category: CA.KINDS[primary], effects, description: desc };
}

// ---- validator + balancer: the ONLY place custom attack numbers are made ----
function buildCustomMove(raw, creature, idea) {
  const sp = SPECIES[creature.sp], notes = [];
  const o = coerceJSON(raw) || {};
  // whitelist fields
  let name = Font.sanitize(typeof o.name === 'string' ? o.name : '', 22) || 'Custom Art';
  let description = Font.sanitize(typeof o.description === 'string' ? o.description : '', 140);
  let type = typeof o.type === 'string' ? o.type.trim() : 'Neutral';
  type = [...TYPES, 'Neutral'].find(t => t.toLowerCase() === type.toLowerCase()) || 'Neutral';
  if (type !== 'Neutral' && !sp.types.includes(type)) { notes.push(`${type} is not natural to ${sp.name}: cast as Neutral.`); type = 'Neutral'; }
  // effects: whitelist kinds, clamp ratings, dedupe, max 2 (one primary + one secondary)
  let effects = [];
  for (const e of Array.isArray(o.effects) ? o.effects.slice(0, 6) : []) {
    if (!e || typeof e !== 'object') continue;
    let k = String(e.kind || '').toLowerCase().trim().replace(/[\s-]+/g, '_');
    k = CA.SYNONYMS[k] || k;
    if (!CA.KINDS[k] || effects.some(x => x.kind === k)) continue;
    let r = Math.round(Number(e.rating)); if (!isFinite(r)) r = 2;
    effects.push({ kind: k, rating: clamp(r, 1, 5) });
  }
  if (!effects.length) { const cat = String(o.category || '').toLowerCase(); const map = { damage: 'damage', shield: 'shield', heal: 'heal', dot: 'burn', buff: 'atk_up', debuff: 'atk_down', terrain: 'terrain' }; effects.push({ kind: map[cat] || 'damage', rating: 2 }); }
  if (effects.length > 2) { notes.push('Only one primary and one secondary effect allowed.'); effects = effects.slice(0, 2); }
  // implausible ideas are downgraded
  const blob = (idea || '') + ' ' + name + ' ' + description;
  if (CA.BANNED.test(blob)) { notes.push('Too absolute for a trial - the spirits weaken it.'); effects.forEach(e => e.rating = Math.min(e.rating, 2)); if (CA.BANNED.test(name)) name = 'Humbled Art'; }
  // power budget from level and stats: total rating points available
  const bst = sp.base.reduce((a, b) => a + b, 0);
  const budget = clamp(3 + Math.floor(creature.lv / 10) + (bst < 220 ? 1 : 0), 3, 9);
  let total = effects.reduce((a, e) => a + e.rating, 0);
  if (total > budget) {
    notes.push(`Power budget at Lv${creature.lv} is ${budget}: ratings scaled down.`);
    if (effects[1]) effects[1].rating = Math.max(1, budget - effects[0].rating);
    total = effects.reduce((a, e) => a + e.rating, 0);
    if (total > budget) { effects[0].rating = Math.max(1, budget - (effects[1] ? effects[1].rating : 0)); }
  }
  const p = effects[0], s = effects[1];
  const category = CA.KINDS[p.kind];
  // ---- numbers, all computed here ----
  const r1 = p.rating, r2 = s ? s.rating : 0;
  const bstScale = clamp(250 / bst, .9, 1.15);
  const move = {
    custom: true, name, type, category, effects, description, notes,
    pow: p.kind === 'damage' ? Math.round((30 + 12 * r1) * bstScale) : (s && s.kind === 'damage' ? Math.round((20 + 8 * r2) * bstScale) : 0),
    acc: 100, cost: 3 + 2 * r1 + r2, cooldown: 1 + Math.floor((r1 + r2) / 3), duration: 0,
  };
  const selfKinds = ['shield', 'heal', 'atk_up', 'def_up', 'spd_up', 'terrain'];
  if (p.kind === 'damage') move.acc = 100 - 3 * r1 - (s ? 3 : 0);
  else if (!selfKinds.includes(p.kind)) move.acc = 92 - 3 * r1;
  const timed = effects.filter(e => ['shield', 'burn', 'poison', 'bind', 'terrain', 'sleep'].includes(e.kind));
  if (timed.length) move.duration = 2 + Math.ceil(Math.max(...timed.map(e => e.rating)) / 2);
  move.cost = clamp(move.cost, 4, 18);
  move.cooldown = clamp(move.cooldown, 1, 4);
  if (!description) description = move.description = `${sp.name} unleashes ${name}.`;
  if (move.name.length < 2) move.name = 'Custom Art';
  return move;
}
// strength of one effect, used during execution
function effectAmount(e, primary) {
  const r = e.rating;
  switch (e.kind) {
    case 'shield': return (primary ? 8 : 5) * r;          // % of max HP absorbed
    case 'heal': return (primary ? 7 : 4) * r;            // % of max HP healed
    case 'burn': case 'poison': return primary ? 60 + 8 * r : 15 + 10 * r;   // % chance
    case 'sleep': return primary ? 40 + 8 * r : 10 + 6 * r;
    case 'stun': return primary ? 40 + 8 * r : 10 + 8 * r;
    case 'bind': return primary ? 70 + 6 * r : 20 + 10 * r;
    case 'atk_up': case 'def_up': case 'spd_up': case 'atk_down': case 'def_down': case 'spd_down': return r >= 4 ? 2 : 1;  // stages
    case 'terrain': return 10 + 5 * r;                    // % boost to matching-type moves
  }
  return 0;
}
async function generateCustomAttack(idea, creature, battleSummary) {
  idea = Font.sanitize(idea, 120);
  const sp = SPECIES[creature.sp];
  const ctx = { name: sp.name, types: sp.types };
  const payload = { idea, creature: { name: sp.name, types: sp.types, level: creature.lv, moves: creature.moves.map(m => MOVES[m.id].name) }, battle: battleSummary };
  let raw = await askAI('custom_attack', payload);
  let source = 'ai';
  if (!coerceJSON(raw)) { raw = interpretIdeaOffline(idea, ctx); source = AI_ENDPOINT ? 'fallback' : 'offline'; }
  const mv = buildCustomMove(raw, creature, idea);
  mv.source = source;
  return mv;
}

// ---------------------------------------------------------------------
//  MYTHIC FORMS, NPC DIALOGUE, LORE  (each with fallback text)
// ---------------------------------------------------------------------
const STATS4 = ['hp', 'atk', 'def', 'spd'];
const EPITHETS = {
  Tide: ['the Monsoon-Born', 'the Lotus-Keeper', 'of the Seven Rivers', 'the Rain-Caller'], Ember: ['the Hearth-Flame', 'the Ash-Crowned', 'of the Sacred Pyre', 'the Lamp-Bearer'],
  Grove: ['the Banyan-Rooted', 'the Bloom-Singer', 'of the Deep Forest', 'the Tulsi-Kin'], Stone: ['the Gate-Warden', 'the Mountain-Hearted', 'of Carved Halls', 'the Unmoved'],
  Sky: ['the Cloud-Strider', 'the Wind-Sworn', 'of the High Peaks', 'the Feather-Light'], Shade: ['the Moonless', 'the Riddle-Keeper', 'of the Long Night', 'the Whisperer'],
  Light: ['the Dawn-Touched', 'the Hymn-Bright', 'of the Morning Star', 'the Lantern-Soul'], Storm: ['the Thunder-Heart', 'the Vajra-Marked', 'of the First Monsoon', 'the Sky-Drummer'],
};
async function mythicForm(creature) {
  const sp = SPECIES[creature.sp];
  const raw = coerceJSON(await askAI('mythic_form', { species: sp.name, types: sp.types, lore: sp.lore }));
  let epithet = raw && Font.sanitize(raw.epithet, 22);
  let up = raw && String(raw.up || '').toLowerCase(), down = raw && String(raw.down || '').toLowerCase();
  if (!epithet || epithet.length < 3) epithet = pick(EPITHETS[sp.types[0]]);
  if (!STATS4.includes(up)) up = pick(STATS4);
  if (!STATS4.includes(down) || down === up) down = pick(STATS4.filter(s => s !== up));
  return { epithet, up, down };   // game applies +6% / -3%
}
const npcLineCache = {};
async function npcLine(npc, fallback) {
  if (!AI_ENDPOINT || !npc.ai) return fallback;
  if (npcLineCache[npc.id]) return npcLineCache[npc.id];
  const raw = coerceJSON(await askAI('npc_dialogue', { npc: { name: npc.name, role: npc.ai, city: 'Indrapuri (India)' }, player: Game.player.name, progress: { beatRohan: !!Game.flags.beatRohan, beatAgni: !!Game.flags.beatAgni, beatIndra: !!Game.flags.beatIndra } }));
  const line = raw && Font.sanitize(raw.line, 180);
  if (line && line.length > 4) { npcLineCache[npc.id] = line; return line; }
  return fallback;
}
const loreCache = {};
async function expandedLore(spId) {
  const sp = SPECIES[spId];
  if (loreCache[spId]) return loreCache[spId];
  const raw = coerceJSON(await askAI('lore', { species: sp.name, types: sp.types, lore: sp.lore, city: 'India' }));
  const t = raw && Font.sanitize(raw.lore, 300);
  if (t && t.length > 10) return loreCache[spId] = t;
  const extra = { Tide: 'Fishermen leave a marigold on the water to thank it for safe passage.', Ember: 'Temple lamps are said to burn brighter when one sleeps nearby.', Grove: 'Villagers tie threads to banyan roots where it was last seen.', Stone: 'Masons carve its likeness above doorways for protection.', Sky: 'Kite-flyers claim it steals their strings for its nest.', Shade: 'Children are told to answer its riddles politely, just in case.', Light: 'Its hum is said to keep the beat of evening prayers.', Storm: 'Its footsteps are the thunder that comes before the first rain.' };
  return loreCache[spId] = sp.lore + ' ' + extra[sp.types[0]];
}
