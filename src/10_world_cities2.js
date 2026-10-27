// =====================================================================
//  STAGE 3 WORLD (part 2): Heliopolis, Takama, Tir na nOg, Babylon, Kitezh
//  Built by one generator from per-city settings (same layout as Olympos/Asgard).
// =====================================================================
Object.assign(LOOKS, {
  // Egypt
  eg_guard: { hair: '#1a1210', skin: '#a8703a', outfit: '#f0e8d0', accent: '#2a5ab0', pants: '#f0e8d0', style: 'short', crown: true },
  eg_villager: { hair: '#1a1210', skin: '#b87a40', outfit: '#f4ecd8', accent: '#e8c040', pants: '#f4ecd8', style: 'long', style2: 'robe' },
  eg_kid: { hair: '#1a1210', skin: '#c88a50', outfit: '#f4ecd8', accent: '#2a8a9a', pants: '#c8a060', style: 'short' },
  eg_scribe: { hair: '#1a1210', skin: '#b87a40', outfit: '#f8f0dc', accent: '#2a5ab0', pants: '#f8f0dc', style: 'short', style2: 'robe' },
  eg_charioteer: { hair: '#1a1210', skin: '#a8703a', outfit: '#2a5ab0', accent: '#e8c040', pants: '#f0e8d0', style: 'short' },
  anubis: { hair: '#1a1a1a', skin: '#2a2a2a', outfit: '#e8c040', accent: '#2a5ab0', pants: '#1a1a1a', style: 'long', crown: true, style2: 'robe' },
  sekhmet: { hair: '#c8803a', skin: '#c88a50', outfit: '#c8302a', accent: '#e8c040', pants: '#c8302a', style: 'long', crown: true, style2: 'robe' },
  set: { hair: '#8a3a1a', skin: '#b8703a', outfit: '#8a3a1a', accent: '#e8c040', pants: '#4a2a1a', style: 'short', crown: true },
  ra: { hair: '#e8c040', skin: '#c88a50', outfit: '#f8f0dc', accent: '#ff7a1a', pants: '#e8c040', style: 'long', crown: true, style2: 'robe' },
  // Japan
  jp_guard: { hair: '#1a1210', skin: '#e8c8a0', outfit: '#3a3a52', accent: '#c83a2a', pants: '#2a2a3a', style: 'bun' },
  jp_villager: { hair: '#1a1210', skin: '#f0d0b0', outfit: '#5a7ab8', accent: '#ffffff', pants: '#3a4a7a', style: 'bun', style2: 'robe' },
  jp_kid: { hair: '#1a1210', skin: '#f0d0b0', outfit: '#e85a7a', accent: '#ffe060', pants: '#3a3a5a', style: 'short' },
  jp_miko: { hair: '#1a1210', skin: '#f0d0b0', outfit: '#ffffff', accent: '#c83a2a', pants: '#c83a2a', style: 'long' },
  jp_ronin: { hair: '#1a1210', skin: '#e0b890', outfit: '#3a3a4a', accent: '#8a8aa0', pants: '#2a2a3a', style: 'bun' },
  tsukuyomi: { hair: '#c8d0f0', skin: '#e8e0f0', outfit: '#2a2a5a', accent: '#c8d0f0', pants: '#14143a', style: 'long', style2: 'robe' },
  raijin: { hair: '#f0f0f0', skin: '#c84a3a', outfit: '#3a5ab8', accent: '#ffe040', pants: '#2a2a5a', style: 'long', beard: true },
  susanoo: { hair: '#1a1210', skin: '#d8b090', outfit: '#2a5a8a', accent: '#e8e8f0', pants: '#1a3a5a', style: 'long', beard: true },
  amaterasu: { hair: '#1a1210', skin: '#f4dcc0', outfit: '#ffffff', accent: '#e8c040', pants: '#c83a2a', style: 'long', crown: true, style2: 'robe' },
  // Celtic
  ce_guard: { hair: '#8a4a20', skin: '#f0c8a8', outfit: '#2a6a3a', accent: '#e8c040', pants: '#5a4a30', style: 'long', beard: true },
  ce_villager: { hair: '#c86a2a', skin: '#f4d0b8', outfit: '#6a4a8a', accent: '#e8c040', pants: '#5a4a30', style: 'long' },
  ce_kid: { hair: '#e8a040', skin: '#f4d0b8', outfit: '#3a8a4a', accent: '#ffffff', pants: '#5a4a30', style: 'short' },
  ce_bard: { hair: '#5a3a1a', skin: '#f0c8a8', outfit: '#3a5a9a', accent: '#e8c040', pants: '#4a3a2a', style: 'short', beard: true },
  ce_druid: { hair: '#e8e0d0', skin: '#f0c8a8', outfit: '#f0f0e8', accent: '#3a8a4a', pants: '#f0f0e8', style: 'long', style2: 'robe' },
  morrigan: { hair: '#1a1a1a', skin: '#e8d8d8', outfit: '#2a2a2a', accent: '#8a1a2a', pants: '#1a1a1a', style: 'long', style2: 'robe' },
  lugh: { hair: '#e8c040', skin: '#f0c8a8', outfit: '#e8e0c8', accent: '#e8c040', pants: '#3a6a3a', style: 'short', crown: true },
  manannan: { hair: '#c8d8e8', skin: '#e8d0b8', outfit: '#3a6a8a', accent: '#c8d8e8', pants: '#2a4a6a', style: 'long', beard: true, style2: 'robe' },
  dagda: { hair: '#8a4a20', skin: '#e8b890', outfit: '#3a6a3a', accent: '#c8a040', pants: '#5a3a1a', style: 'short', beard: true },
  // Mesopotamia
  me_guard: { hair: '#1a1210', skin: '#c08a58', outfit: '#3a5a9a', accent: '#e8c050', pants: '#c8a878', style: 'long', beard: true },
  me_villager: { hair: '#1a1210', skin: '#c08a58', outfit: '#c8a878', accent: '#8a2a1a', pants: '#c8a878', style: 'long', style2: 'robe' },
  me_kid: { hair: '#1a1210', skin: '#c89a68', outfit: '#e8d0a8', accent: '#3a5a9a', pants: '#8a6a40', style: 'short' },
  me_scribe: { hair: '#1a1210', skin: '#c08a58', outfit: '#e8d8b8', accent: '#3a5a9a', pants: '#e8d8b8', style: 'short', beard: true, style2: 'robe' },
  me_archer: { hair: '#1a1210', skin: '#b87a48', outfit: '#8a2a1a', accent: '#e8c050', pants: '#c8a878', style: 'long' },
  ishtar: { hair: '#1a1210', skin: '#d8a070', outfit: '#3a5ab8', accent: '#e8c050', pants: '#3a5ab8', style: 'long', crown: true, style2: 'robe' },
  nergal: { hair: '#2a1a10', skin: '#b87048', outfit: '#8a3a2a', accent: '#e8c050', pants: '#4a1a10', style: 'long', beard: true, crown: true },
  enlil: { hair: '#e8e8e8', skin: '#c89a68', outfit: '#e8e0d0', accent: '#3a8ab8', pants: '#e8e0d0', style: 'long', beard: true, crown: true, style2: 'robe' },
  marduk: { hair: '#1a1210', skin: '#c89a68', outfit: '#2a4a98', accent: '#e8c050', pants: '#e8c050', style: 'long', beard: true, crown: true, style2: 'robe' },
  // Slavic
  sl_guard: { hair: '#8a5a2a', skin: '#f0c8a8', outfit: '#8a2a2a', accent: '#c8c8d0', pants: '#3a3a4a', style: 'short', beard: true, crown: true },
  sl_villager: { hair: '#c8902a', skin: '#f4d0b8', outfit: '#f0e8d8', accent: '#c83a2a', pants: '#3a5a9a', style: 'long' },
  sl_kid: { hair: '#f0d070', skin: '#f4d0b8', outfit: '#c83a2a', accent: '#f0e8d8', pants: '#3a3a4a', style: 'short' },
  sl_hunter: { hair: '#6a4a2a', skin: '#e8c0a0', outfit: '#5a6a3a', accent: '#8a5a2a', pants: '#3a3a2a', style: 'short', beard: true },
  sl_weaver: { hair: '#c8902a', skin: '#f4d0b8', outfit: '#f0e8d8', accent: '#c83a2a', pants: '#c83a2a', style: 'long', style2: 'robe' },
  svarog: { hair: '#e8e0d0', skin: '#e8b890', outfit: '#5a4a40', accent: '#ff7a1a', pants: '#3a2a20', style: 'short', beard: true },
  mokosh: { hair: '#5a3a1a', skin: '#f0c8a8', outfit: '#3a8a4a', accent: '#c83a2a', pants: '#3a8a4a', style: 'long', crown: true, style2: 'robe' },
  veles: { hair: '#4a3a2a', skin: '#d8b090', outfit: '#4a5a3a', accent: '#8a6a3a', pants: '#3a3a2a', style: 'long', beard: true, style2: 'robe' },
  perun: { hair: '#c8c8c8', skin: '#e8c0a0', outfit: '#2a4a8a', accent: '#e8b030', pants: '#3a2a20', style: 'long', beard: true, crown: true },
});
// The standard city layout (same as Olympos/Asgard): temple top-centre, two lieutenant halls,
// shop and shrine, two houses, two grass zones, a pier over water bottom-right (third lieutenant),
// optional lake bottom-left, and the Mist Road gate at the bottom.
function makeCity(c) {
  const w = 32, h = 30, t = blank(w, h, '.');
  R(t, 0, 0, w, 2, 'T'); R(t, 0, h - 1, w, 1, 'T'); R(t, 0, 0, 1, h, 'T'); R(t, w - 1, 0, 1, h, 'T');
  R(t, 2, 8, 28, 3, '='); R(t, 15, 11, 2, 19, '_');
  R(t, 5, 16, 1, 1, '_'); R(t, 25, 16, 1, 1, '_'); R(t, 11, 16, 1, 1, '_'); R(t, 20, 16, 1, 1, '_');
  R(t, 5, 17, 10, 1, '_'); R(t, 17, 17, 9, 1, '_');
  if (c.lake) { R(t, 2, 18, 11, 5, ','); R(t, 2, 24, 9, 5, '~'); } else R(t, 2, 19, 11, 7, ',');
  R(t, 18, 18, 5, 3, ':');
  R(t, 21, 22, 10, 1, '_'); R(t, 21, 23, 10, 6, '~'); R(t, 26, 22, 1, 6, 'B');
  R(t, 8, 11, 5, 1, 'f'); R(t, 18, 11, 5, 1, 'f');
  for (const [x, y] of [[2, 11], [29, 11], [13, 25], [19, 27], [14, 23], [12, 27], [1, 2], [30, 2], [10, 2], [21, 2], [21, 20]]) t[y][x] = 'T';
  if (!c.lake) for (const [x, y] of [[2, 27], [6, 27], [10, 27]]) t[y][x] = 'T';
  for (const [x, y] of [[2, 8], [29, 8], [12, 10], [19, 10]]) t[y][x] = 'L';
  t[27][14] = 'S';
  const [l1, l2, l3] = c.lts, god = c.god, allLt = () => [l1, l2, l3].every(id => Game.flags[TRAINERS[id].flag]);
  const tr1y = c.lake ? 20 : 21;
  MAPS[c.id] = {
    id: c.id, name: c.name, outdoor: true, music: c.id, theme: c.id, bg: c.id, particles: c.particles, pColors: c.pColors, t, w, h,
    buildings: [
      { x: 12, y: 2, w: 8, h: 6, style: c.styles.temple, door: 15, to: [c.id + '_temple', 6, 12] },
      { x: 2, y: 3, w: 7, h: 5, style: c.styles.lt1, door: 5, to: [c.id + '_lt1', 5, 10] },
      { x: 23, y: 3, w: 7, h: 5, style: c.styles.lt2, door: 26, to: [c.id + '_lt2', 5, 10] },
      { x: 3, y: 12, w: 6, h: 4, style: c.styles.shop, door: 5, to: [c.id + '_shop', 4, 6] },
      { x: 23, y: 12, w: 6, h: 4, style: c.styles.shrine, door: 25, to: [c.id + '_shrine', 4, 6] },
      { x: 9, y: 12, w: 5, h: 4, style: c.styles.house, door: 11, locked: c.locked[0] },
      { x: 18, y: 12, w: 5, h: 4, style: c.styles.house2, door: 20, locked: c.locked[1] },
    ],
    warps: [{ x: 15, y: 29, to: ['@travel'] }, { x: 16, y: 29, to: ['@travel'] }],
    signs: { '14,27': 'SOUTH GATE: the Mist Road. Walk through the gate to travel to other cities.' },
    npcs: [
      { id: c.id + '_guard', name: c.guard.name, look: c.guard.look, x: 15, y: 8, dir: 'down', when: () => !allLt(), lines: c.guard.lines },
      { id: c.id + '_guard2', name: c.guard.name, look: c.guard.look, x: 14, y: 8, dir: 'right', when: allLt, lines: [c.guard.open] },
      { id: l3, name: TRAINERS[l3].name, look: TRAINERS[l3].look, x: 26, y: 27, dir: 'up', trainer: l3, boss: true },
      { id: c.trainers[0], name: TRAINERS[c.trainers[0]].name, look: TRAINERS[c.trainers[0]].look, x: 13, y: tr1y, dir: 'right', trainer: c.trainers[0], sight: 2, lines: [c.trainerAfter[0]] },
      { id: c.trainers[1], name: TRAINERS[c.trainers[1]].name, look: TRAINERS[c.trainers[1]].look, x: 19, y: 24, dir: 'left', trainer: c.trainers[1], sight: 3, lines: [c.trainerAfter[1]] },
      Object.assign({ x: 20, y: 9, dir: 'down' }, c.villagers[0]),
      Object.assign({ x: 23, y: 21, dir: 'left' }, c.villagers[1]),
      Object.assign({ x: 10, y: 17, dir: 'down', wander: 2 }, c.villagers[2]),
      { id: c.id + '_gate', name: 'Gatekeeper', look: c.guard.look, x: 17, y: 28, dir: 'left', lines: ['The Mist Road connects the eight mythic cities. Walk through the gate behind me, or use TRAVEL in your menu.'] },
    ],
    encounters: c.encounters,
    items: c.items.map((it, k) => ({ id: c.id + '_i' + k, x: it[0], y: it[1], item: it[2], n: it[3] })),
    greet: c.shopGreet,
  };
  interior(c.id + '_shop', c.rooms.shop, c.id, SHOP_ROWS, 'p', [{ id: c.id + '_clerk', name: c.clerk[0], look: c.clerk[1], x: 4, y: 2, dir: 'down', role: 'shop' }], [c.id, 5, 16, 'down'], { greet: c.shopGreet });
  interior(c.id + '_shrine', c.rooms.shrine, c.id, SHRINE_ROWS, 'p', [{ id: c.id + '_priest', name: c.priest[0], look: c.priest[1], x: 4, y: 2, dir: 'down', role: 'heal' }, { id: 'sanctum', name: 'Sanctum Stone', look: 'stone', x: 7, y: 2, dir: 'down', role: 'storage' }], [c.id, 25, 16, 'down']);
  interior(c.id + '_lt1', c.rooms.lt1, c.id, HALL_ROWS, c.deco[0], [{ id: l1, name: TRAINERS[l1].name, look: TRAINERS[l1].look, x: 5, y: 2, dir: 'down', trainer: l1, boss: true }], [c.id, 5, 8, 'down'], { music: 'boss', bg: TRAINERS[l1].bg });
  interior(c.id + '_lt2', c.rooms.lt2, c.id, HALL_ROWS, c.deco[1], [{ id: l2, name: TRAINERS[l2].name, look: TRAINERS[l2].look, x: 5, y: 2, dir: 'down', trainer: l2, boss: true }], [c.id, 26, 8, 'down'], { music: 'boss', bg: TRAINERS[l2].bg });
  interior(c.id + '_temple', c.rooms.temple, c.id, PALACE_ROWS, c.deco[2], [{ id: god, name: TRAINERS[god].name, look: TRAINERS[god].look, x: 6, y: 2, dir: 'down', trainer: god, boss: true }], [c.id, 15, 8, 'down'], { music: 'boss', bg: TRAINERS[god].bg });
}
function buildCities2() {
  makeCity({
    id: 'egypt', name: 'Heliopolis', particles: 'sand', pColors: ['#f0d8a0', '#e8c888', '#d8b070'],
    styles: { temple: 'ra_temple', lt1: 'anubis_tomb', lt2: 'sekhmet_hall', shop: 'eg_shop', shrine: 'eg_shrine', house: 'eg_house', house2: 'eg_house2' },
    lts: ['anubis', 'sekhmet', 'set'], god: 'ra', trainers: ['nefer', 'khafra'], trainerAfter: ['My papyrus is full of your victory!', 'Next time I bring two horses.'],
    guard: { name: 'Temple Guard', look: 'eg_guard', lines: ['Only those who have faced Anubis, Sekhmet and Set may enter the Temple of Ra.', 'Anubis keeps the tomb to the west, Sekhmet the red hall to the east, and Set stands on the sun-barque by the Nile.'], open: 'The three have spoken for you. Enter the Temple of Ra.' },
    villagers: [{ id: 'eg_v1', name: 'Priestess Meret', look: 'eg_villager', ai: 'temple priestess who explains Egyptian myths respectfully', lines: ['Each night Ra sails through the underworld, and each dawn he rises again.', 'Bennu birds are said to be reborn in fire. Look for them at sunrise.'] },
      { id: 'eg_v2', name: 'Boatman Ahmose', look: 'eg_villager', ai: 'Nile boatman who talks about the river and crocodiles', lines: ['The Nile floods each year and makes the fields green. Sobekens keep the floods gentle.', 'Set stands on the sun-barque at the end of the pier. Bring water - it is hot!'] },
      { id: 'eg_v3', name: 'Little Tiy', look: 'eg_kid', ai: 'curious child who collects scarab beetles', lines: ['Scarabix roll little balls of sunlight! I have three.', 'Sphinxels ask riddles, but they always give hints.'] }],
    clerk: ['Merchant Hapu', 'eg_villager'], priest: ['Healer Tawaret', 'eg_villager'], shopGreet: 'Welcome to the bazaar of Heliopolis! Cool water and strong orbs.',
    locked: ['A sleepy voice: "Come back after the heat of the day."', 'A sign: "Gone to the festival of the Nile."'],
    rooms: { shop: 'Heliopolis Bazaar', shrine: 'House of Healing', lt1: 'Tomb of Anubis', lt2: 'Hall of Sekhmet', temple: 'Temple of Ra' }, deco: ['P', 'F', 'P'],
    encounters: { ',': { lv: [26, 32], table: [['scarabix', 25], ['uraeling', 25], ['sobeken', 20], ['bennuling', 12], ['ammitar', 8, 'night'], ['sphinxel', 6]] },
      ':': { lv: [32, 36], table: [['sobeken', 18], ['ammitar', 18, 'night'], ['sphinxel', 16], ['bennuling', 16], ['uraeling', 14], ['apepling', 6, 'night'], ['scarabix', 10]] } },
    items: [[4, 24, 'soma', 3], [22, 19, 'varunastra', 2], [9, 26, 'amrita', 1]],
  });
  makeCity({
    id: 'japan', name: 'Takama', particles: 'blossom', pColors: ['#ffb8d0', '#ff8ab0', '#ffffff'],
    styles: { temple: 'sun_shrine', lt1: 'moon_hall', lt2: 'thunder_hall', shop: 'jp_shop', shrine: 'jp_shrine', house: 'jp_house', house2: 'jp_house2' },
    lts: ['tsukuyomi', 'raijin', 'susanoo'], god: 'amaterasu', trainers: ['hana', 'kenji'], trainerAfter: ['Please rest at the shrine before the lieutenants.', 'The road taught me humility today.'],
    guard: { name: 'Shrine Guard', look: 'jp_guard', lines: ['The Sun Shrine opens only after Tsukuyomi, Raijin and Susanoo have tested you.', 'Tsukuyomi waits in the Moon Hall, Raijin in the Hall of Thunder, and Susanoo at the end of the pier.'], open: 'The three have spoken for you. Please enter the Sun Shrine.' },
    villagers: [{ id: 'jp_v1', name: 'Tea Master Sen', look: 'jp_villager', ai: 'calm tea master who shares respectful stories of Amaterasu', lines: ['When Amaterasu hid in a cave, the world went dark. Laughter and a mirror brought her back.', 'A battle is like tea - patience first, then warmth.'] },
      { id: 'jp_v2', name: 'Fisher Taro', look: 'jp_villager', ai: 'fisherman who tells stories about sea dragons', lines: ['A young Ryugo lives under the pier. It keeps a tide pearl.', 'Susanoo once faced an eight-headed serpent. He waits on the pier now.'] },
      { id: 'jp_v3', name: 'Little Yuki', look: 'jp_kid', ai: 'playful child who loves fox spirits', lines: ['Kitsunko light blue foxfires at night! So pretty!', 'If you see a teapot with a tail, it is probably a Tanukin.'] }],
    clerk: ['Shopkeeper Aiko', 'jp_villager'], priest: ['Priestess Haru', 'jp_miko'], shopGreet: 'Irasshaimase! Welcome! Orbs and herbs for every journey.',
    locked: ['Someone inside is practising calligraphy. Shh.', 'A note: "Gone to view the cherry blossoms."'],
    rooms: { shop: 'Takama Market', shrine: 'Shrine of Healing', lt1: 'Moon Hall', lt2: 'Hall of Thunder', temple: 'Sun Shrine' }, deco: ['P', 'F', 'P'],
    encounters: { ',': { lv: [30, 35], table: [['kitsunko', 22], ['kappling', 22], ['tanukin', 22], ['chochibi', 15, 'night'], ['tengumi', 10], ['raikitt', 9]] },
      ':': { lv: [35, 38], table: [['tengumi', 18], ['raikitt', 18], ['tanukin', 14], ['kitsunko', 14], ['chochibi', 14, 'night'], ['ryugo', 8], ['kyubirei', 3]] } },
    items: [[4, 24, 'gangajal', 2], [22, 19, 'gandiva', 1], [9, 26, 'akshaya', 2]],
  });
  makeCity({
    id: 'celtic', name: 'Tir na nOg', lake: true, particles: 'leaves', pColors: ['#6aa860', '#8ac870', '#e8e070'],
    styles: { temple: 'dagda_hall', lt1: 'crow_hall', lt2: 'lugh_hall', shop: 'ce_shop', shrine: 'ce_shrine', house: 'ce_house', house2: 'ce_house2' },
    lts: ['morrigan', 'lugh', 'manannan'], god: 'dagda', trainers: ['ciaran', 'aisling'], trainerAfter: ['I am still tuning the verse about you.', 'The oaks will remember your name.'],
    guard: { name: 'Hall Guard', look: 'ce_guard', lines: ['The Dagda feasts with those who have faced the Morrigan, Lugh and Manannan.', 'The Morrigan keeps the dark hall to the west, Lugh the bright hall to the east, and Manannan stands on the pier.'], open: 'The three have spoken for you. The Dagda says the stew is ready.' },
    villagers: [{ id: 'ce_v1', name: 'Storyteller Brigid', look: 'ce_villager', ai: 'warm storyteller who shares respectful Irish and Celtic myths', lines: ['The Dagda has a harp that plays the seasons and a cauldron that never empties.', 'Lugh can do every craft. Ask him about anything!'] },
      { id: 'ce_v2', name: 'Fisher Ronan', look: 'ce_villager', ai: 'fisherman who tells tales of selkies and the sea god Manannan', lines: ['Selkins dance on the beach on moonlit nights. Do not hide their skins!', 'Manannan wraps the islands in mist. He waits on the pier.'] },
      { id: 'ce_v3', name: 'Little Niamh', look: 'ce_kid', ai: 'child who believes in fairies', lines: ['Sidhel trade you shiny gifts, but they turn into leaves!', 'Never ride a Kelpling, my gran says.'] }],
    clerk: ['Trader Fergus', 'ce_bard'], priest: ['Healer Airmed', 'ce_druid'], shopGreet: 'Failte! Welcome! Fine orbs and healing herbs from the hollow hills.',
    locked: ['A peat fire crackles inside. The owner is napping.', 'A sign: "At the gathering on the hill. Back by sunset."'],
    rooms: { shop: 'Trading Hall', shrine: 'Well of Healing', lt1: 'Hall of the Morrigan', lt2: 'Hall of Lugh', temple: 'Hall of the Dagda' }, deco: ['F', 'P', 'F'],
    encounters: { ',': { lv: [34, 39], table: [['selkin', 22], ['sidhel', 22], ['pookin', 20], ['keenwail', 14, 'night'], ['kelpling', 12], ['cusith', 6]] },
      ':': { lv: [38, 42], table: [['kelpling', 18], ['cusith', 16], ['keenwail', 16, 'night'], ['pookin', 14], ['sidhel', 12], ['hartwyn', 6], ['selkara', 4]] } },
    items: [[4, 22, 'kavach', 2], [22, 19, 'nagastra', 3], [12, 26, 'amrita', 1]],
  });
  makeCity({
    id: 'meso', name: 'Babylon', particles: 'sand', pColors: ['#e8d0a0', '#d8c088', '#c8a878'],
    styles: { temple: 'esagila', lt1: 'ishtar_gate', lt2: 'nergal_hall', shop: 'me_shop', shrine: 'me_shrine', house: 'me_house', house2: 'me_house2' },
    lts: ['ishtar', 'nergal', 'enlil'], god: 'marduk', trainers: ['ludin', 'ishmi'], trainerAfter: ['I wrote a new tablet about your win.', 'I missed! That never happens.'],
    guard: { name: 'Gate Guard', look: 'me_guard', lines: ['Esagila is open only to those who faced Ishtar, Nergal and Enlil.', 'Ishtar waits at her blue gate to the west, Nergal in his hall to the east, and Enlil on the river pier.'], open: 'The three have spoken for you. Climb to Esagila.' },
    villagers: [{ id: 'me_v1', name: 'Astronomer Bel-ibni', look: 'me_villager', ai: 'astronomer who explains Mesopotamian myths and the stars respectfully', lines: ['Marduk set the stars in their paths. We still follow them to plant our barley.', 'Lamassu guard every great gate. They have human faces and very good manners.'] },
      { id: 'me_v2', name: 'Boatman Ur-Nanshe', look: 'me_villager', ai: 'river boatman who talks about the Euphrates and the wind god Enlil', lines: ['The river feeds the whole city. Apkalu sages say they came from its waters.', 'Enlil stands on the pier. Hold your hat!'] },
      { id: 'me_v3', name: 'Little Ninsa', look: 'me_kid', ai: 'child who is learning to write cuneiform', lines: ['I am learning to write! It is all little wedges.', 'Anzoo has a lion head and eagle wings. It is very loud.'] }],
    clerk: ['Merchant Kudur', 'me_villager'], priest: ['Healer Gula', 'me_villager'], shopGreet: 'Welcome to the markets of Babylon! Weighed fairly, sold gladly.',
    locked: ['Someone inside is counting barley. Out loud.', 'A clay tablet hangs on the door: "At the temple."'],
    rooms: { shop: 'Babylon Market', shrine: 'House of Healing', lt1: 'Gate of Ishtar', lt2: 'Hall of Nergal', temple: 'Esagila' }, deco: ['P', 'F', 'P'],
    encounters: { ',': { lv: [36, 40], table: [['apkalu', 22], ['lamassel', 22], ['humbabo', 20], ['girtab', 16, 'night'], ['anzoo', 10], ['mushush', 6]] },
      ':': { lv: [40, 44], table: [['girtab', 18, 'night'], ['humbabo', 16], ['anzoo', 16], ['mushush', 14], ['apkalu', 12], ['lamassel', 10], ['lamassar', 4]] } },
    items: [[4, 24, 'sanjivani', 2], [22, 19, 'gandiva', 2], [9, 26, 'akshaya', 2]],
  });
  makeCity({
    id: 'slavic', name: 'Kitezh', lake: true, particles: 'leaves', pColors: ['#e8b840', '#d87a2a', '#c8402a'],
    styles: { temple: 'perun_hall', lt1: 'svarog_forge', lt2: 'mokosh_hall', shop: 'sl_shop', shrine: 'sl_shrine', house: 'sl_house', house2: 'sl_house2' },
    lts: ['svarog', 'mokosh', 'veles'], god: 'perun', trainers: ['bogdan', 'milena'], trainerAfter: ['My snares are no match for you!', 'Your threads hold strong.'],
    guard: { name: 'Druzhina Guard', look: 'sl_guard', lines: ['Perun receives only those who have faced Svarog, Mokosh and Veles.', 'Svarog works at the forge to the west, Mokosh weaves in the green-domed hall to the east, and Veles waits on the river pier.'], open: 'The three have spoken for you. Enter the Oak Hall of Perun.' },
    villagers: [{ id: 'sl_v1', name: 'Grandmother Vesna', look: 'sl_villager', ai: 'kind grandmother who tells respectful Slavic folk tales', lines: ['Perun and Veles argue every year, and every year the spring rain comes.', 'Leave porridge for the Domovik and your house will stay warm.'] },
      { id: 'sl_v2', name: 'Ferryman Stepan', look: 'sl_villager', ai: 'ferryman who tells stories about river spirits', lines: ['Rusalins comb their hair on the willow branches. Do not splash!', 'Veles waits on the pier. He likes cattle and riddles.'] },
      { id: 'sl_v3', name: 'Little Ivan', look: 'sl_kid', ai: 'child who dreams of catching a firebird', lines: ['I saw a Zharling feather! It lit up my whole room!', 'Kikimors tangle my yarn every night.'] }],
    clerk: ['Merchant Lada', 'sl_villager'], priest: ['Healer Zhiva', 'sl_weaver'], shopGreet: 'Welcome, traveller! Bread, salt and orbs for the road.',
    locked: ['The smell of fresh bread drifts out, but the door is barred.', 'A carved sign: "At the harvest dance."'],
    rooms: { shop: 'Kitezh Market', shrine: 'Chapel of Healing', lt1: 'Forge of Svarog', lt2: 'Hall of Mokosh', temple: 'Oak Hall of Perun' }, deco: ['F', 'P', 'F'],
    encounters: { ',': { lv: [38, 42], table: [['domovik', 22], ['vodyan', 22], ['kikimor', 16, 'night'], ['zharling', 14], ['rusalin', 14], ['leshko', 12]] },
      ':': { lv: [42, 46], table: [['leshko', 18], ['rusalin', 16], ['zmeyok', 14], ['kikimor', 14, 'night'], ['zharling', 12], ['vodyan', 12], ['zharplume', 3]] } },
    items: [[4, 22, 'amrita', 2], [22, 19, 'gandiva', 2], [12, 26, 'sanjivani', 2]],
  });
}
