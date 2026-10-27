// =====================================================================
//  STAGE 3 WORLD (part 1): Olympos (Greece) and Asgard (Norse), world map travel
// =====================================================================
Object.assign(LOOKS, {
  vayu: { hair: '#e8f0f8', skin: '#c8a888', outfit: '#9fe4ff', accent: '#ffffff', pants: '#5a8ab8', style: 'long', crown: true, style2: 'robe' },
  varuna: { hair: '#1a2a4a', skin: '#5a7ab8', outfit: '#1e5a9a', accent: '#e8c040', pants: '#0e3a6a', style: 'long', crown: true, beard: true, style2: 'robe' },
  hoplite: { hair: '#2a1a10', skin: '#c89070', outfit: '#c8402a', accent: '#e8c040', pants: '#f0e8d8', style: 'short', crown: true },
  oracle: { hair: '#2a1a2a', skin: '#d8a880', outfit: '#7a4ab8', accent: '#e8c040', pants: '#7a4ab8', style: 'long', style2: 'robe' },
  philosopher: { hair: '#d8d8d8', skin: '#c89070', outfit: '#f4f2ea', accent: '#2a5ab0', pants: '#f4f2ea', style: 'short', beard: true, style2: 'robe' },
  fisher: { hair: '#3a2a1a', skin: '#b87a50', outfit: '#3a6ab8', accent: '#e8e0c8', pants: '#5a4a3a', style: 'short', beard: true },
  potter: { hair: '#2a1a10', skin: '#d8a070', outfit: '#c8683a', accent: '#f4f2ea', pants: '#7a5030', style: 'short' },
  gr_clerk: { hair: '#4a2a1a', skin: '#d8a880', outfit: '#2a5ab0', accent: '#ffffff', pants: '#1a3a80', style: 'bun' },
  gr_priest: { hair: '#2a1a10', skin: '#d8a880', outfit: '#ffffff', accent: '#e8c040', pants: '#ffffff', style: 'long', style2: 'robe' },
  ares: { hair: '#3a1a10', skin: '#c88a60', outfit: '#a82a1a', accent: '#e8c040', pants: '#5a1a10', style: 'short', crown: true, beard: true },
  poseidon: { hair: '#d8e0e8', skin: '#c8a080', outfit: '#1e78d0', accent: '#e8c040', pants: '#1e78d0', style: 'long', beard: true, crown: true, style2: 'robe' },
  hades: { hair: '#1a1020', skin: '#b8a0b0', outfit: '#3a2a4a', accent: '#c8a0ff', pants: '#2a1a3a', style: 'long', beard: true, crown: true, style2: 'robe' },
  zeus: { hair: '#f0f0f0', skin: '#d8a880', outfit: '#f4f2ea', accent: '#e8c040', pants: '#2a5ab0', style: 'long', beard: true, crown: true, style2: 'robe' },
  viking: { hair: '#c8902a', skin: '#e8c0a0', outfit: '#6a4a2a', accent: '#c8c0b0', pants: '#3a3a4a', style: 'long', beard: true },
  shieldmaiden: { hair: '#e8c060', skin: '#f0c8a8', outfit: '#5a6a7a', accent: '#c8402a', pants: '#3a2a20', style: 'long' },
  skald: { hair: '#8a4a20', skin: '#e8c0a0', outfit: '#2a5a3a', accent: '#c8a040', pants: '#3a2a20', style: 'short', beard: true },
  carver: { hair: '#c8c8c8', skin: '#e0b898', outfit: '#4a5a6a', accent: '#c8a040', pants: '#2a2a3a', style: 'short', beard: true },
  sledkid: { hair: '#f0d070', skin: '#f0c8a8', outfit: '#c84a3a', accent: '#ffffff', pants: '#2a3a5a', style: 'short' },
  no_clerk: { hair: '#c8702a', skin: '#f0c8a8', outfit: '#3a5a7a', accent: '#e8d8b0', pants: '#3a2a20', style: 'bun' },
  no_priest: { hair: '#f0e8d0', skin: '#f0c8a8', outfit: '#e8e8f0', accent: '#5a8a6a', pants: '#e8e8f0', style: 'long', style2: 'robe' },
  einherjar: { hair: '#6a4a2a', skin: '#e0b898', outfit: '#7a7a8a', accent: '#c8a040', pants: '#3a3a4a', style: 'short', beard: true, crown: true },
  thor: { hair: '#c8402a', skin: '#e8b090', outfit: '#5a6a7a', accent: '#c8402a', pants: '#3a3a4a', style: 'long', beard: true },
  tyr: { hair: '#6a4a2a', skin: '#e0b898', outfit: '#7a7a8a', accent: '#c8a040', pants: '#4a3a2a', style: 'short', beard: true },
  heimdall: { hair: '#f0e8c0', skin: '#e8c0a0', outfit: '#e8e8f0', accent: '#e8c040', pants: '#c8a040', style: 'long' },
  odin: { hair: '#c8c8c8', skin: '#d8b090', outfit: '#2a3a6a', accent: '#8a8a9a', pants: '#2a3a6a', style: 'long', beard: true, style2: 'robe' },
});
const HALL_ROWS = ['wwwwwwwwwwww', 'wwwwDAADwwww', 'pDppcccppDpp', 'ppppcccppppp', 'pDppcccppDpp', 'ppppcccppppp', 'pDppcccppDpp', 'ppppcccppppp', 'pDppcccppDpp', 'ppppcccppppp', 'ppppcccppppp', 'wwwwwmwwwwww'];
const PALACE_ROWS = ['wwwwwwwwwwwwww', 'wwwwwwAAwwwwww', 'gDgggcccgggDgg', 'gggggcccgggggg', 'gDgggcccgggDgg', 'gggggcccgggggg', 'gDgggcccgggDgg', 'gggggcccgggggg', 'gDgggcccgggDgg', 'gggggcccgggggg', 'gDgggcccgggDgg', 'gggggcccgggggg', 'gggggcccgggggg', 'wwwwwwmwwwwwww'];
const SHOP_ROWS = ['wwwwwwwwww', 'wKKwwwwKKw', 'pppppppppp', 'ppCCCCCCpp', 'pppppppppp', 'ppcccccppp', 'pppppppppp', 'wwwwmwwwww'];
const SHRINE_ROWS = ['wwwwwwwwww', 'wwwAAwwwKw', 'ppppppppKp', 'ppppccpppp', 'ppppccpppp', 'ppppccpppp', 'ppppccpppp', 'wwwwmwwwww'];
function interior(id, name, theme, rows, deco, npcs, exit, extra = {}) {
  MAPS[id] = Object.assign({ id, name, theme, music: extra.music || theme, t: fromRows(rows.map(r => r.replace(/D/g, deco))), buildings: [], signs: {}, items: [], npcs, exit }, extra);
}
function buildMoreCities() {
  // ======================= OLYMPOS (Greece) =======================
  {
    const w = 32, h = 30, t = blank(w, h, '.');
    R(t, 0, 0, w, 2, 'T'); R(t, 0, h - 1, w, 1, 'T'); R(t, 0, 0, 1, h, 'T'); R(t, w - 1, 0, 1, h, 'T');
    R(t, 2, 8, 28, 3, '='); R(t, 15, 11, 2, 19, '_');
    R(t, 5, 16, 1, 1, '_'); R(t, 25, 16, 1, 1, '_'); R(t, 11, 16, 1, 1, '_'); R(t, 20, 16, 1, 1, '_');
    R(t, 5, 17, 10, 1, '_'); R(t, 17, 17, 9, 1, '_');
    R(t, 2, 19, 11, 7, ','); R(t, 18, 18, 5, 4, ':');
    R(t, 21, 22, 10, 1, '_'); R(t, 21, 23, 10, 6, '~'); R(t, 26, 22, 1, 6, 'B');
    R(t, 8, 11, 5, 1, 'f'); R(t, 18, 11, 5, 1, 'f'); R(t, 2, 26, 4, 1, 'f');
    for (const [x, y] of [[2, 11], [29, 11], [13, 25], [18, 26], [19, 27], [2, 27], [10, 27], [6, 27], [1, 2], [30, 2], [10, 2], [21, 2]]) t[y][x] = 'T';
    for (const [x, y] of [[2, 8], [29, 8], [12, 10], [19, 10]]) t[y][x] = 'L';
    t[27][14] = 'S';
    MAPS.greece = {
      id: 'greece', name: 'Olympos', outdoor: true, music: 'greece', theme: 'greece', bg: 'greece', particles: 'leaves', t, w, h,
      buildings: [
        { x: 12, y: 2, w: 8, h: 6, style: 'zeustemple', door: 15, to: ['zeus_temple', 6, 12] },
        { x: 2, y: 3, w: 7, h: 5, style: 'arena', door: 5, to: ['ares_hall', 5, 10] },
        { x: 23, y: 3, w: 7, h: 5, style: 'hadesgate', door: 26, to: ['hades_hall', 5, 10] },
        { x: 3, y: 12, w: 6, h: 4, style: 'gr_shop', door: 5, to: ['greece_shop', 4, 6] },
        { x: 23, y: 12, w: 6, h: 4, style: 'gr_shrine', door: 25, to: ['greece_shrine', 4, 6] },
        { x: 9, y: 12, w: 5, h: 4, style: 'gr_house', door: 11, locked: 'Someone inside is practising the lyre. Badly.' },
        { x: 18, y: 12, w: 5, h: 4, style: 'gr_house2', door: 20, locked: 'A sign: "Gone to the theatre. Back after the tragedy."' },
      ],
      warps: [{ x: 15, y: 29, to: ['@travel'] }, { x: 16, y: 29, to: ['@travel'] }],
      signs: { '14,27': 'SOUTH GATE: the Mist Road. Walk through the gate to travel to other cities.' },
      npcs: [
        { id: 'gr_guard', name: 'Temple Guard', look: 'hoplite', x: 15, y: 8, dir: 'down', when: () => !(Game.flags.beatAres && Game.flags.beatPoseidon && Game.flags.beatHades), lines: ['Only those who have faced Ares, Poseidon and Hades may climb to the Temple of Zeus.', 'Ares fights in the arena to the west, Hades waits behind the gate to the east, and Poseidon stands at the end of the pier.'] },
        { id: 'gr_guard2', name: 'Temple Guard', look: 'hoplite', x: 14, y: 8, dir: 'right', when: () => !!(Game.flags.beatAres && Game.flags.beatPoseidon && Game.flags.beatHades), lines: ['The three have spoken for you. Go up - the King of Olympos is waiting.'] },
        { id: 'poseidon', name: 'Poseidon', look: 'poseidon', x: 26, y: 27, dir: 'up', trainer: 'poseidon', boss: true },
        { id: 'nikos', name: 'Hoplite Nikos', look: 'hoplite', x: 13, y: 21, dir: 'right', trainer: 'nikos', sight: 2, lines: ['A good fight! The lieutenants are ready for you.'] },
        { id: 'kallisto', name: 'Oracle Kallisto', look: 'oracle', x: 19, y: 24, dir: 'left', trainer: 'kallisto', sight: 3, lines: ['I foresee... that you should visit the shrine. Just a hunch.'] },
        { id: 'philo', name: 'Philosopher Theon', look: 'philosopher', x: 20, y: 9, dir: 'down', ai: 'cheerful philosopher in the agora who answers questions with more questions', lines: ['Is a creature tamed because it obeys you, or because it trusts you? Think about it!', 'They say Zeus tests hospitality. Be kind to strangers - one of them might be a god.'] },
        { id: 'fisher', name: 'Fisherman Petros', look: 'fisher', x: 23, y: 21, dir: 'left', ai: 'old fisherman who tells respectful tales of Poseidon and his sea-horses', lines: ['Poseidon himself stands on that pier some days. Bow before you challenge him!', 'Pegafoals are born from sea-foam. Watch the waves at dawn.'] },
        { id: 'potter', name: 'Little Daphne', look: 'potter', x: 10, y: 17, dir: 'down', wander: 2, ai: 'child potter who paints creatures on vases', lines: ['I paint creatures on vases! Gorglings are hard - their hair keeps hiding.', 'Water beats fire, but did you know Stone shrugs off Storm completely?'] },
        { id: 'gr_gate', name: 'Gatekeeper', look: 'hoplite', x: 17, y: 28, dir: 'left', lines: ['The Mist Road connects the eight mythic cities. Walk through the gate behind me to travel.', 'You can also travel from your menu while outdoors.'] },
      ],
      encounters: {
        ',': { lv: [16, 22], table: [['pegafoal', 25], ['gorgling', 25], ['minotot', 22], ['hydrelle', 10], ['chimerant', 8], ['cerbepup', 10, 'night']] },
        ':': { lv: [22, 27], table: [['hydrelle', 18], ['cerbepup', 18, 'night'], ['chimerant', 18], ['gorgling', 14], ['minotot', 14], ['pegafoal', 10], ['cyclite', 6]] },
      },
      items: [{ id: 'g1', x: 4, y: 24, item: 'soma', n: 3 }, { id: 'g2', x: 22, y: 19, item: 'vayavyastra', n: 2 }, { id: 'g3', x: 9, y: 26, item: 'gangajal', n: 1 }],
    };
    interior('greece_shop', 'Agora Market', 'greece', SHOP_ROWS, 'p', [{ id: 'gr_clerk', name: 'Shopkeeper Eleni', look: 'gr_clerk', x: 4, y: 2, dir: 'down', role: 'shop' }], ['greece', 5, 16, 'down']);
    interior('greece_shrine', 'Shrine of Asclepius', 'greece', SHRINE_ROWS, 'p', [{ id: 'gr_priest', name: 'Priestess Ione', look: 'gr_priest', x: 4, y: 2, dir: 'down', role: 'heal' }, { id: 'sanctum', name: 'Sanctum Stone', look: 'stone', x: 7, y: 2, dir: 'down', role: 'storage' }], ['greece', 25, 16, 'down']);
    interior('ares_hall', 'Arena of Ares', 'greece', HALL_ROWS, 'F', [{ id: 'ares', name: 'Ares', look: 'ares', x: 5, y: 2, dir: 'down', trainer: 'ares', boss: true }], ['greece', 5, 8, 'down'], { music: 'boss', bg: 'arena' });
    interior('hades_hall', 'Halls of Hades', 'greece', HALL_ROWS, 'F', [{ id: 'hades', name: 'Hades', look: 'hades', x: 5, y: 2, dir: 'down', trainer: 'hades', boss: true }], ['greece', 26, 8, 'down'], { music: 'boss', bg: 'underworld' });
    interior('zeus_temple', 'Temple of Zeus', 'greece', PALACE_ROWS, 'P', [{ id: 'zeus', name: 'Zeus', look: 'zeus', x: 6, y: 2, dir: 'down', trainer: 'zeus', boss: true }], ['greece', 15, 8, 'down'], { music: 'boss', bg: 'olympos' });
  }
  // ======================= ASGARD (Norse) =======================
  {
    const w = 32, h = 30, t = blank(w, h, '.');
    R(t, 0, 0, w, 2, 'T'); R(t, 0, h - 1, w, 1, 'T'); R(t, 0, 0, 1, h, 'T'); R(t, w - 1, 0, 1, h, 'T');
    R(t, 2, 8, 28, 3, '='); R(t, 15, 11, 2, 19, '_');
    R(t, 5, 16, 1, 1, '_'); R(t, 25, 16, 1, 1, '_'); R(t, 11, 16, 1, 1, '_'); R(t, 20, 16, 1, 1, '_');
    R(t, 5, 17, 10, 1, '_'); R(t, 17, 17, 9, 1, '_');
    R(t, 2, 18, 11, 5, ','); R(t, 18, 18, 5, 3, ':');
    R(t, 2, 24, 9, 5, '~'); for (const [x, y] of [[4, 25], [7, 26], [3, 27], [9, 25], [6, 28]]) t[y][x] = 'i';
    R(t, 21, 22, 10, 7, '~'); R(t, 26, 22, 1, 6, 'Y');
    R(t, 18, 11, 4, 1, 'f'); R(t, 8, 11, 4, 1, 'f');
    for (const [x, y] of [[2, 11], [29, 11], [13, 25], [19, 27], [14, 23], [12, 27], [1, 2], [30, 2], [9, 2], [22, 2], [21, 20]]) t[y][x] = 'T';
    for (const [x, y] of [[2, 8], [29, 8], [12, 10], [19, 10]]) t[y][x] = 'L';
    t[27][14] = 'S';
    MAPS.norse = {
      id: 'norse', name: 'Asgard', outdoor: true, music: 'norse', theme: 'norse', bg: 'norse', particles: 'snow', t, w, h,
      buildings: [
        { x: 11, y: 2, w: 10, h: 6, style: 'valgrind', door: 16, to: ['valgrind_hall', 6, 12] },
        { x: 2, y: 3, w: 7, h: 5, style: 'forge', door: 5, to: ['thor_forge', 5, 10] },
        { x: 23, y: 3, w: 7, h: 5, style: 'oathhall', door: 26, to: ['tyr_hall', 5, 10] },
        { x: 3, y: 12, w: 6, h: 4, style: 'no_shop', door: 5, to: ['norse_shop', 4, 6] },
        { x: 23, y: 12, w: 6, h: 4, style: 'no_shrine', door: 25, to: ['norse_shrine', 4, 6] },
        { x: 9, y: 12, w: 5, h: 4, style: 'no_house', door: 11, locked: 'Loud snoring comes from inside. Best not to wake a sleeping skald.' },
        { x: 18, y: 12, w: 5, h: 4, style: 'no_house2', door: 20, locked: 'The door is frozen shut. Someone has written "SPRING?" in the frost.' },
      ],
      warps: [{ x: 15, y: 29, to: ['@travel'] }, { x: 16, y: 29, to: ['@travel'] }],
      signs: { '14,27': 'SOUTH GATE: the Mist Road. Walk through the gate to travel to other cities.' },
      npcs: [
        { id: 'no_guard', name: 'Einherjar Guard', look: 'einherjar', x: 16, y: 8, dir: 'down', when: () => !(Game.flags.beatThor && Game.flags.beatTyr && Game.flags.beatHeimdall), lines: ['Valgrind is closed to those who have not faced Thor, Tyr and Heimdall.', 'Thor works at the forge to the west. Tyr keeps the Hall of Oaths to the east. Heimdall guards the rainbow bridge.'] },
        { id: 'no_guard2', name: 'Einherjar Guard', look: 'einherjar', x: 17, y: 8, dir: 'left', when: () => !!(Game.flags.beatThor && Game.flags.beatTyr && Game.flags.beatHeimdall), lines: ['The All-Father has heard of you. Enter Valgrind.'] },
        { id: 'heimdall', name: 'Heimdall', look: 'heimdall', x: 26, y: 27, dir: 'up', trainer: 'heimdall', boss: true },
        { id: 'sigrun', name: 'Shieldmaiden Sigrun', look: 'shieldmaiden', x: 13, y: 20, dir: 'right', trainer: 'sigrun', sight: 2, lines: ['Your shield arm is strong. Go and face the lieutenants!'] },
        { id: 'bjorn', name: 'Skald Bjorn', look: 'skald', x: 19, y: 24, dir: 'left', trainer: 'bjorn', sight: 3, lines: ['I am still writing the verse about your victory. It rhymes with "orb".'] },
        { id: 'carver', name: 'Rune-carver Ragna', look: 'carver', x: 20, y: 9, dir: 'down', ai: 'patient rune-carver who explains Norse myths respectfully', lines: ['Odin gave an eye for a drink from the well of wisdom. Knowledge always has a price.', 'Two ravens fly out each morning and tell Odin all they see. Mind your manners!'] },
        { id: 'lakefisher', name: 'Ice-fisher Leif', look: 'viking', x: 11, y: 25, dir: 'left', ai: 'ice fisherman who loves telling stories about the world-serpent', lines: ['Jormlets nibble my lines all winter. One day one of them will circle the whole world.', 'Thor once went fishing for the world-serpent. He caught it - and then let it go.'] },
        { id: 'sledkid', name: 'Little Astrid', look: 'sledkid', x: 9, y: 17, dir: 'down', wander: 2, ai: 'excited child who loves Ratatusk squirrels', lines: ['Ratatusks run up and down the great tree carrying gossip! I want one!', 'Heimdall can hear wool growing on sheep. So whisper!'] },
        { id: 'no_gate', name: 'Gatekeeper', look: 'einherjar', x: 17, y: 28, dir: 'left', lines: ['The Mist Road leads to the other cities. Walk through the gate behind me to travel.'] },
      ],
      encounters: {
        ',': { lv: [22, 28], table: [['huginix', 25], ['ratatusk', 25], ['fenrisk', 22], ['draugrim', 15, 'night'], ['tanngrit', 13]] },
        ':': { lv: [28, 33], table: [['fenrisk', 18], ['draugrim', 15, 'night'], ['jormlet', 18], ['tanngrit', 18], ['huginix', 12], ['sleipra', 8], ['fenrimaw', 4]] },
      },
      items: [{ id: 'n1', x: 4, y: 22, item: 'kavach', n: 2 }, { id: 'n2', x: 22, y: 19, item: 'gandiva', n: 1 }, { id: 'n3', x: 12, y: 26, item: 'amrita', n: 1 }],
    };
    interior('norse_shop', 'Trading Post', 'norse', SHOP_ROWS, 'p', [{ id: 'no_clerk', name: 'Trader Hilde', look: 'no_clerk', x: 4, y: 2, dir: 'down', role: 'shop' }], ['norse', 5, 16, 'down']);
    interior('norse_shrine', 'Shrine of Eir', 'norse', SHRINE_ROWS, 'p', [{ id: 'no_priest', name: 'Healer Solveig', look: 'no_priest', x: 4, y: 2, dir: 'down', role: 'heal' }, { id: 'sanctum', name: 'Sanctum Stone', look: 'stone', x: 7, y: 2, dir: 'down', role: 'storage' }], ['norse', 25, 16, 'down']);
    interior('thor_forge', 'Thunder Forge', 'norse', HALL_ROWS, 'F', [{ id: 'thor', name: 'Thor', look: 'thor', x: 5, y: 2, dir: 'down', trainer: 'thor', boss: true }], ['norse', 5, 8, 'down'], { music: 'boss', bg: 'forge' });
    interior('tyr_hall', 'Hall of Oaths', 'norse', HALL_ROWS, 'P', [{ id: 'tyr', name: 'Tyr', look: 'tyr', x: 5, y: 2, dir: 'down', trainer: 'tyr', boss: true }], ['norse', 26, 8, 'down'], { music: 'boss', bg: 'oaths' });
    interior('valgrind_hall', 'Valgrind', 'norse', PALACE_ROWS, 'F', [{ id: 'odin', name: 'Odin', look: 'odin', x: 6, y: 2, dir: 'down', trainer: 'odin', boss: true }], ['norse', 16, 8, 'down'], { music: 'boss', bg: 'valgrind' });
  }
  // shop/shrine greetings per city
  for (const id of ['greece_shop', 'norse_shop']) MAPS[id].greet = id === 'greece_shop' ? 'Welcome to the Agora! Orbs from every city, fair prices.' : 'Welcome, frost-walker! Warm herbs and strong orbs here.';
}

// ---------------- travel ----------------
async function travelGate() {
  const open = CITY_ORDER.filter(cityUnlocked);
  if (open.length < 2) { await say('A wall of thick mist hides the road. Pass this city\'s trial and the mist will thin.'); return; }
  await openWorldMap();
}
const MAP_POS = { celtic: [52, 70], norse: [122, 46], slavic: [196, 56], greece: [130, 118], egypt: [124, 176], meso: [190, 136], india: [250, 150], japan: [292, 84] };
function cityOf(mapId) { return { city: 'india', route: 'india', shop: 'india', shrine: 'india', house: 'india', hall: 'india', palace: 'india' }[mapId] || (MAPS[mapId] && MAPS[mapId].theme) || 'india'; }
class WorldMapScene {
  constructor() { this.opaque = true; this.resolve = null; this.here = cityOf(Game.player.map); this.i = Math.max(0, CITY_ORDER.indexOf(this.here)); }
  update() {
    if (Input.p('left') || Input.p('up')) { this.i = (this.i + 7) % 8; Sound.sfx('cursor'); }
    if (Input.p('right') || Input.p('down')) { this.i = (this.i + 1) % 8; Sound.sfx('cursor'); }
    if (Input.p('b') || Input.p('start')) { Sound.sfx('cancel'); this.close(null); }
    if (Input.p('a')) {
      const id = CITY_ORDER[this.i];
      if (!cityUnlocked(id)) { Sound.sfx('bump'); return; }
      if (id === this.here) { Sound.sfx('bump'); return; }
      Sound.sfx('confirm'); this.close(id);
    }
  }
  close(v) { Scenes.remove(this); this.resolve(v); }
  draw(ctx) {
    ctx.fillStyle = '#2a4a7a'; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 6) { ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fillRect(((y * 7 + (Game.frames >> 3)) % 40) - 20, y, W + 40, 1); }
    // land masses (stylised)
    const land = [[60, 70, 34, 26], [128, 50, 50, 22], [196, 60, 46, 26], [132, 118, 30, 18], [126, 176, 34, 26], [190, 138, 32, 22], [248, 150, 30, 30], [292, 86, 18, 34]];
    for (const [x, y, rx, ry] of land) { ctx.fillStyle = '#c8b88a'; ctx.beginPath(); ctx.ellipse(x, y, rx + 3, ry + 3, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#8ab06a'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); }
    // mist road (dotted)
    ctx.fillStyle = '#e8e0c8';
    for (let k = 0; k < CITY_ORDER.length - 1; k++) { const [x0, y0] = MAP_POS[CITY_ORDER[k]], [x1, y1] = MAP_POS[CITY_ORDER[k + 1]]; for (let t = 0; t < 1; t += .06) ctx.fillRect(lerp(x0, x1, t) | 0, lerp(y0, y1, t) | 0, 2, 2); }
    Font.draw(ctx, 'THE MIST ROAD', 6, 4, '#ffffff', '#0b0714');
    CITY_ORDER.forEach((id, k) => {
      const [x, y] = MAP_POS[id], open = cityUnlocked(id), sel = k === this.i, c = CITIES[id];
      ctx.fillStyle = '#0b0714'; ctx.fillRect(x - 6, y - 6, 12, 12);
      ctx.fillStyle = open ? c.color : '#6a6a7a'; ctx.fillRect(x - 5, y - 5, 10, 10);
      if (!open) { ctx.fillStyle = 'rgba(220,220,235,.55)'; ctx.beginPath(); ctx.ellipse(x, y, 14, 7, 0, 0, 7); ctx.fill(); }
      if (id === this.here) { ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 12 + Math.sin(Game.frames / 8) * 2, 3, 4); }
      Font.drawC(ctx, c.name, x, y + 8, sel ? '#ffd040' : open ? '#ffffff' : '#b0b0c0', '#0b0714');
      if (sel) { ctx.strokeStyle = '#ffd040'; ctx.strokeRect(x - 8.5, y - 8.5, 17, 17); }
    });
    const id = CITY_ORDER[this.i], info = CITY_INFO[id], c = CITIES[id];
    drawWin(ctx, 0, 196, W, 44);
    Font.draw(ctx, `${c.name} (${c.culture})`, 10, 203, c.color);
    Font.drawR(ctx, `God: ${info.god}`, 310, 203, UI.dim);
    const status = id === this.here ? 'You are here.' : cityUnlocked(id) ? 'The road is clear. Press Z to travel.' : !info.built ? 'Sealed by mist. This city arrives in a later update.' : `Sealed by mist. ${info.needs || ''} to open it.`;
    Font.draw(ctx, status, 10, 216, UI.ink);
    Font.draw(ctx, '< >  choose    Z travel    X back', 10, 228, UI.dim);
  }
}
async function openWorldMap() {
  const dest = await new Promise(r => { const s = new WorldMapScene(); s.resolve = r; Scenes.push(s); });
  if (!dest) return;
  const [m, x, y, d] = CITY_INFO[dest].arrive;
  Sound.sfx('door');
  await fadeOut(20); World.load(m, x, y, d); Game.flags['visited_' + dest] = true; await fadeIn(20);
}
