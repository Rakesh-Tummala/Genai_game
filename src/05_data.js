// =====================================================================
//  GAME DATA: types, moves, creatures, items, orbs, characters, trainers
//  All creatures are original designs inspired only by traditional folklore.
// =====================================================================
const TYPES = ['Sky', 'Tide', 'Ember', 'Grove', 'Stone', 'Shade', 'Light', 'Storm'];
const TYPE_COLOR = { Sky: '#9fe4ff', Tide: '#3a7bff', Ember: '#ff5a1f', Grove: '#46c35a', Stone: '#b58a52', Shade: '#8a5bd4', Light: '#ffe36a', Storm: '#20d6c8', Neutral: '#c8c0b0' };
// attacker -> defender multipliers (missing = 1x)
const CHART = {
  Sky: { Grove: 2, Storm: .5, Stone: .5 },
  Tide: { Ember: 2, Stone: 2, Tide: .5, Grove: .5 },
  Ember: { Grove: 2, Shade: 2, Ember: .5, Tide: .5, Stone: .5 },
  Grove: { Tide: 2, Stone: 2, Ember: .5, Sky: .5, Grove: .5 },
  Stone: { Ember: 2, Sky: 2, Storm: 2, Grove: .5, Tide: .5 },
  Shade: { Light: 2, Shade: .5, Stone: .5 },
  Light: { Shade: 2, Light: .5, Storm: .5 },
  Storm: { Tide: 2, Sky: 2, Stone: 0, Storm: .5, Grove: .5 },
  Neutral: { Shade: 0, Stone: .5 },
};
function typeMult(atkType, defTypes) { let m = 1; for (const d of defTypes) { const r = (CHART[atkType] || {})[d]; if (r !== undefined) m *= r; } return m; }

// ---- MOVES -----------------------------------------------------------
// cat: 'atk' | 'status'.  fx: status{kind,ch} self{stat:stages} foe{stat:stages,ch} heal bind stun cure
const MOVES = {
  tackle: { name: 'Tackle', type: 'Neutral', pow: 40, acc: 100, pp: 35 },
  quickdart: { name: 'Quick Dart', type: 'Neutral', pow: 40, acc: 100, pp: 30, pri: 1 },
  roar: { name: 'Roar', type: 'Neutral', cat: 'status', acc: 100, pp: 20, fx: { foe: { atk: -1 } } },
  focus: { name: 'Focus', type: 'Neutral', cat: 'status', acc: 100, pp: 20, fx: { self: { atk: 1 } } },
  guard: { name: 'Guard Stance', type: 'Neutral', cat: 'status', acc: 100, pp: 20, fx: { self: { def: 1 } } },
  cloudtusk: { name: 'Cloud Tusk', type: 'Neutral', pow: 80, acc: 95, pp: 10 },
  emberspit: { name: 'Ember Spit', type: 'Ember', pow: 40, acc: 100, pp: 25, fx: { status: { kind: 'burn', ch: .1 } } },
  flamefang: { name: 'Flame Fang', type: 'Ember', pow: 65, acc: 95, pp: 15, fx: { status: { kind: 'burn', ch: .15 } } },
  kilnblast: { name: 'Kiln Blast', type: 'Ember', pow: 90, acc: 85, pp: 10, fx: { status: { kind: 'burn', ch: .2 } } },
  emberveil: { name: 'Ember Veil', type: 'Ember', cat: 'status', acc: 85, pp: 15, fx: { status: { kind: 'burn', ch: 1 } } },
  splashjet: { name: 'Splash Jet', type: 'Tide', pow: 40, acc: 100, pp: 25 },
  lotuscurrent: { name: 'Lotus Current', type: 'Tide', pow: 65, acc: 100, pp: 15, fx: { foe: { spd: -1 }, foeCh: .3 } },
  monsooncrash: { name: 'Monsoon Crash', type: 'Tide', pow: 90, acc: 85, pp: 10 },
  whirlbind: { name: 'Whirl Bind', type: 'Tide', pow: 35, acc: 90, pp: 15, fx: { bind: 1 } },
  vinelash: { name: 'Vine Lash', type: 'Grove', pow: 40, acc: 100, pp: 25 },
  banyangrip: { name: 'Banyan Grip', type: 'Grove', pow: 60, acc: 95, pp: 15, fx: { bind: .3 } },
  tulsibloom: { name: 'Tulsi Bloom', type: 'Grove', cat: 'status', acc: 100, pp: 10, fx: { heal: .4 } },
  thornstorm: { name: 'Thorn Storm', type: 'Grove', pow: 85, acc: 90, pp: 10 },
  pebbleshot: { name: 'Pebble Shot', type: 'Stone', pow: 40, acc: 100, pp: 25 },
  rockcrush: { name: 'Rock Crush', type: 'Stone', pow: 70, acc: 90, pp: 15, fx: { foe: { def: -1 }, foeCh: .25 } },
  templewall: { name: 'Temple Wall', type: 'Stone', cat: 'status', acc: 100, pp: 15, fx: { self: { def: 2 } } },
  gust: { name: 'Gust', type: 'Sky', pow: 40, acc: 100, pp: 25 },
  wingslash: { name: 'Wing Slash', type: 'Sky', pow: 60, acc: 100, pp: 20, crit: 2 },
  garudadive: { name: 'Eagle Dive', type: 'Sky', pow: 90, acc: 90, pp: 10 },
  nighthiss: { name: 'Night Hiss', type: 'Shade', pow: 40, acc: 100, pp: 25, fx: { foe: { atk: -1 }, foeCh: .1 } },
  riddlecurse: { name: 'Riddle Curse', type: 'Shade', cat: 'status', acc: 75, pp: 10, fx: { status: { kind: 'sleep', ch: 1 } } },
  shadowbite: { name: 'Shadow Bite', type: 'Shade', pow: 65, acc: 100, pp: 15, fx: { foe: { atk: -1 }, foeCh: .2 } },
  venomfang: { name: 'Venom Fang', type: 'Shade', pow: 55, acc: 100, pp: 20, fx: { status: { kind: 'poison', ch: .3 } } },
  glimmer: { name: 'Glimmer', type: 'Light', pow: 40, acc: 100, pp: 25 },
  sunhymn: { name: 'Sun Hymn', type: 'Light', pow: 65, acc: 100, pp: 15, fx: { self: { atk: 1 }, selfCh: .2 } },
  celestialchord: { name: 'Celestial Chord', type: 'Light', cat: 'status', acc: 100, pp: 10, fx: { heal: .3, cure: true } },
  radiantray: { name: 'Radiant Ray', type: 'Light', pow: 85, acc: 95, pp: 10 },
  spark: { name: 'Spark', type: 'Storm', pow: 40, acc: 100, pp: 25, fx: { stun: .1 } },
  thunderclap: { name: 'Thunderclap', type: 'Storm', pow: 70, acc: 90, pp: 15, fx: { stun: .2 } },
  vajra: { name: 'Vajra Thunderbolt', type: 'Storm', pow: 110, acc: 95, pp: 5, sig: true, fx: { stun: .3, breakShield: true } },
};

// ---- CREATURES -------------------------------------------------------
// art: template + palette + pattern + accessories for the procedural generator
const SPECIES = {
  yalicub: {
    name: 'Yalicub', types: ['Ember'], base: [45, 56, 46, 48], xp: 64, rarity: 'uncommon', city: 'india', evo: ['yalidhar', 16],
    lore: 'A temple-guardian cub with a lion\'s mane and a tiny elephant trunk. It naps on sun-warmed gate stones.',
    learn: [[1, 'tackle'], [1, 'emberspit'], [4, 'roar'], [8, 'flamefang'], [12, 'focus'], [15, 'pebbleshot']],
    art: { tpl: 'quadruped', size: .86, pal: { base: '#e07a2c', accent: '#ffcf3f', belly: '#f6d7a0', eye: '#2a1408', glow: '#ff3b1f', horn: '#fff1c8' }, pattern: 'stripes', acc: ['mane', 'ears', 'trunkSmall', 'tailFlame'] }
  },
  yalidhar: {
    name: 'Yalidhar', types: ['Ember', 'Stone'], base: [72, 84, 74, 58], xp: 165, rarity: 'rare', city: 'india',
    lore: 'Grown yalis stand watch at gateways for centuries. Its ember mane flares whenever an oath is broken nearby.',
    learn: [[1, 'tackle'], [1, 'flamefang'], [16, 'pebbleshot'], [18, 'rockcrush'], [22, 'kilnblast'], [27, 'templewall'], [34, 'emberveil']],
    art: { tpl: 'quadruped', size: 1.08, pal: { base: '#c95a22', accent: '#ffb02e', belly: '#f0c78a', eye: '#2a1408', glow: '#ff3b1f', horn: '#fff6dc' }, pattern: 'stripes', acc: ['maneBig', 'ears', 'trunk', 'tusks', 'horns', 'tailFlame', 'flames', 'gem'] }
  },
  makarin: {
    name: 'Makarin', types: ['Tide'], base: [50, 48, 55, 46], xp: 64, rarity: 'uncommon', city: 'india', evo: ['makaraja', 16],
    lore: 'A river calf with a crocodile snout and a fish\'s tail. It returns lost anklets to the riverbank.',
    learn: [[1, 'tackle'], [1, 'splashjet'], [4, 'guard'], [8, 'whirlbind'], [12, 'lotuscurrent'], [15, 'pebbleshot']],
    art: { tpl: 'aquatic', size: .86, pal: { base: '#2f8fa8', accent: '#7fe0d0', belly: '#e0f2c4', eye: '#10202a', glow: '#ff6fa8', horn: '#f6f0d8' }, pattern: 'scales', acc: ['snout', 'trunkSmall', 'dorsal', 'legs'] }
  },
  makaraja: {
    name: 'Makaraja', types: ['Tide', 'Stone'], base: [80, 72, 82, 56], xp: 165, rarity: 'rare', city: 'india',
    lore: 'Steed of river spirits, carved on every old water-spout. Its curled trunk can lift a fishing boat.',
    learn: [[1, 'splashjet'], [1, 'whirlbind'], [16, 'rockcrush'], [20, 'lotuscurrent'], [24, 'monsooncrash'], [30, 'templewall']],
    art: { tpl: 'aquatic', size: 1.08, pal: { base: '#1f6f8f', accent: '#ffcf4a', belly: '#d8efc0', eye: '#10202a', glow: '#ff5f9a', horn: '#fff3c0' }, pattern: 'scales', acc: ['snout', 'trunk', 'dorsal', 'legs', 'crown', 'horns'] }
  },
  vanarling: {
    name: 'Vanarling', types: ['Grove'], base: [46, 52, 42, 60], xp: 64, rarity: 'uncommon', city: 'india', evo: ['vanaveer', 16],
    lore: 'A young forest monkey-folk who swings between banyan roots, wearing a garland it braided itself.',
    learn: [[1, 'tackle'], [1, 'vinelash'], [4, 'quickdart'], [8, 'banyangrip'], [12, 'focus'], [15, 'glimmer']],
    art: { tpl: 'humanoid', size: .95, pal: { base: '#8a5a32', accent: '#5ec24e', belly: '#f0c890', eye: '#1a0e06', glow: '#ff9f2a', horn: '#ffd24a' }, pattern: 'none', acc: ['tail', 'muzzle', 'garland', 'earsSide'] }
  },
  vanaveer: {
    name: 'Vanaveer', types: ['Grove', 'Light'], base: [72, 84, 64, 84], xp: 165, rarity: 'rare', city: 'india',
    lore: 'A monkey-folk champion who carries a heavy mace and keeps its word above all things.',
    learn: [[1, 'vinelash'], [1, 'quickdart'], [16, 'sunhymn'], [20, 'banyangrip'], [24, 'thornstorm'], [30, 'radiantray']],
    art: { tpl: 'humanoid', size: 1.08, pal: { base: '#9a6232', accent: '#e8b02a', belly: '#f2cc94', eye: '#1a0e06', glow: '#ff6a2a', horn: '#ffd84a' }, pattern: 'none', acc: ['tail', 'muzzle', 'crown', 'mace', 'armband', 'earsSide', 'sash'] }
  },
  nagling: {
    name: 'Nagling', types: ['Tide', 'Shade'], base: [44, 52, 44, 56], xp: 60, rarity: 'common', city: 'india', evo: ['nagaraja', 20],
    lore: 'A hooded serpent of the lotus ponds. It guards a single pearl and hisses at anyone who stares too long.',
    learn: [[1, 'splashjet'], [1, 'nighthiss'], [5, 'whirlbind'], [9, 'venomfang'], [14, 'lotuscurrent'], [18, 'shadowbite']],
    art: { tpl: 'serpentine', size: .86, pal: { base: '#2a7a6a', accent: '#c8e05a', belly: '#efe2a0', eye: '#1a1408', glow: '#ff4a6a', horn: '#ffd84a' }, pattern: 'rings', acc: ['hood', 'gem', 'tongue'] }
  },
  nagaraja: {
    name: 'Nagaraja', types: ['Tide', 'Shade'], base: [74, 80, 72, 76], xp: 175, rarity: 'rare', city: 'india',
    lore: 'A serpent king whose five hoods shade sleeping sages from the monsoon. It rules a palace beneath the lake.',
    learn: [[1, 'venomfang'], [1, 'whirlbind'], [20, 'shadowbite'], [24, 'monsooncrash'], [28, 'riddlecurse'], [34, 'thunderclap']],
    art: { tpl: 'serpentine', size: .98, pal: { base: '#1d5f7a', accent: '#e6c65a', belly: '#f2e6b0', eye: '#1a1408', glow: '#ff3a5a', horn: '#ffd84a' }, pattern: 'rings', acc: ['multihood', 'crown', 'tongue'] }
  },
  garudin: {
    name: 'Garudin', types: ['Sky', 'Light'], base: [55, 72, 54, 86], xp: 150, rarity: 'rare', city: 'india',
    lore: 'Fledgling of the great eagle line, sworn rival of serpents. Its first feathers already shine like temple gold.',
    learn: [[1, 'gust'], [1, 'glimmer'], [6, 'quickdart'], [10, 'wingslash'], [15, 'sunhymn'], [21, 'garudadive'], [27, 'radiantray']],
    art: { tpl: 'avian', size: .95, pal: { base: '#d8902a', accent: '#d63a2a', belly: '#fff0c0', eye: '#1a0a04', glow: '#ffd84a', horn: '#ffd84a' }, pattern: 'none', acc: ['crest', 'crown', 'tailFan'] }
  },
  kinnarel: {
    name: 'Kinnarel', types: ['Sky', 'Grove'], base: [50, 50, 50, 64], xp: 58, rarity: 'common', city: 'india',
    lore: 'Half-bird, half-person musicians of the hills. Kinnarel always travel in pairs and finish each other\'s songs.',
    learn: [[1, 'gust'], [1, 'vinelash'], [6, 'quickdart'], [10, 'tulsibloom'], [14, 'wingslash'], [20, 'thornstorm']],
    art: { tpl: 'humanoid', size: .9, pal: { base: '#f2eedc', accent: '#3fae9a', belly: '#e8b48a', eye: '#1a1020', glow: '#ff7aa8', horn: '#e8b84a' }, pattern: 'none', acc: ['wings', 'birdLegs', 'veena', 'headdress'] }
  },
  vetalix: {
    name: 'Vetalix', types: ['Shade'], base: [48, 64, 40, 62], xp: 62, rarity: 'uncommon', city: 'india',
    lore: 'A riddling spirit that hangs from banyan branches at night. Answer its riddle wrong and it follows you home.',
    learn: [[1, 'nighthiss'], [1, 'tackle'], [5, 'riddlecurse'], [9, 'shadowbite'], [14, 'roar'], [19, 'venomfang']],
    art: { tpl: 'spirit', size: .92, pal: { base: '#6a5a8a', accent: '#2c1f40', belly: '#b8a8d0', eye: '#9cff6a', glow: '#9cff6a', horn: '#d8d0e8' }, pattern: 'none', acc: ['batWings', 'glowEyes', 'fangs', 'tailWisp'] }
  },
  gandharin: {
    name: 'Gandharin', types: ['Light'], base: [52, 48, 58, 60], xp: 60, rarity: 'common', city: 'india',
    lore: 'A celestial musician spirit. When it hums, the monsoon clouds come into tune and the rain falls in rhythm.',
    learn: [[1, 'glimmer'], [1, 'tackle'], [5, 'celestialchord'], [9, 'sunhymn'], [14, 'gust'], [20, 'radiantray']],
    art: { tpl: 'spirit', size: .92, pal: { base: '#ffe2a0', accent: '#ff8fb8', belly: '#fff6dc', eye: '#3a2010', glow: '#ffd84a', horn: '#ffcc40' }, pattern: 'none', acc: ['halo', 'ribbons', 'arms', 'flute'] }
  },
  airavat: {
    name: 'Airavat', types: ['Storm', 'Light'], base: [92, 88, 92, 58], xp: 250, rarity: 'mythic', city: 'india', bossOnly: true,
    lore: 'A white cloud-elephant with many tusks, said to be born from the churning of the ocean. It carries thunder on its back.',
    learn: [[1, 'cloudtusk'], [1, 'thunderclap'], [1, 'radiantray'], [1, 'vajra']],
    art: { tpl: 'quadruped', size: 1, pal: { base: '#eef0f6', accent: '#7fd0ff', belly: '#ffffff', eye: '#20202a', glow: '#40e0ff', horn: '#fff6c8' }, pattern: 'bolts', acc: ['elephant', 'trunk', 'tusksMany', 'crown', 'earsBig', 'cloud'] }
  },
};
const SPECIES_ORDER = ['yalicub', 'yalidhar', 'makarin', 'makaraja', 'vanarling', 'vanaveer', 'nagling', 'nagaraja', 'garudin', 'kinnarel', 'vetalix', 'gandharin', 'airavat'];
const STARTERS = ['yalicub', 'makarin', 'vanarling'];
const RARITY_RATE = { common: 190, uncommon: 120, rare: 55, mythic: 10 };

// ---- ITEMS & ORBS ----------------------------------------------------
const ITEMS = {
  soma: { name: 'Soma Drop', price: 200, desc: 'Restores 30 HP.', use: 'heal', amt: 30 },
  amrita: { name: 'Amrita Vial', price: 1500, desc: 'Fully restores HP and cures status.', use: 'full' },
  sanjivani: { name: 'Sanjivani Herb', price: 1000, desc: 'Revives a fainted creature with half HP.', use: 'revive' },
  tulsi: { name: 'Tulsi Leaf', price: 150, desc: 'Cures one status condition.', use: 'cure' },
  akshaya: { name: 'Akshaya Patra Meal', price: 400, desc: 'Restores all move PP and energy.', use: 'pp' },
  bana: { name: 'Bana Orb', price: 100, desc: 'A basic taming orb, shaped like an arrowhead.', orb: true, mult: 1 },
  agneyastra: { name: 'Agneyastra Orb', price: 400, desc: 'A fire-forged orb. Better than a Bana Orb.', orb: true, mult: 1.6 },
  varunastra: { name: 'Varunastra Orb', price: 500, desc: 'Water-bound orb. Very strong against Ember creatures.', orb: true, mult: 1, vsType: 'Ember', vsMult: 3 },
  nagastra: { name: 'Nagastra Orb', price: 500, desc: 'Serpent orb. Very strong on sleeping or bound targets.', orb: true, mult: 1, vsStatus: true, vsMult: 3.5 },
};
const SHOP_STOCK = ['bana', 'agneyastra', 'varunastra', 'nagastra', 'soma', 'tulsi', 'akshaya', 'sanjivani', 'amrita'];

// ---- PLAYABLE CHARACTERS (3 in Stage 1) ------------------------------
const CHARACTERS = [
  { id: 'ira', name: 'Ira', perk: 'capture', perkText: '+10% taming chance',
    story: 'A river-guide\'s daughter from the bathing ghats. She knows every current and every creature that hides in them.',
    look: { hair: '#1a1210', skin: '#c98a5a', outfit: '#2a9d8f', accent: '#f4a261', pants: '#264653', shoes: '#3a2418', style: 'long' } },
  { id: 'tarun', name: 'Tarun', perk: 'xp', perkText: '+10% experience',
    story: 'A scholar\'s apprentice who copied every bestiary in the temple library and now wants to see the creatures himself.',
    look: { hair: '#14100e', skin: '#b87a4b', outfit: '#ece6d2', accent: '#9b2335', pants: '#5a4632', shoes: '#2a1a10', style: 'short' } },
  { id: 'saanvi', name: 'Saanvi', perk: 'discount', perkText: '15% shop discount',
    story: 'Raised in her aunt\'s spice stall, she can talk any merchant down to a fair price - and usually a free snack.',
    look: { hair: '#3a2014', skin: '#d9a066', outfit: '#c2185b', accent: '#ffc107', pants: '#4a148c', shoes: '#2a1020', style: 'bun' } },
];

// ---- TRAINERS --------------------------------------------------------
const TRAINERS = {
  rohan: {
    name: 'Pilgrim Rohan', title: 'Trainer', team: [['nagling', 7], ['kinnarel', 7], ['vetalix', 8], ['gandharin', 8]], reward: 40, music: 'battle',
    intro: ['Halt, traveller! Every pilgrim on this road must prove their bond.', 'Four companions walk with me. Show me yours!'],
    lose: 'Your bond is true. Agni\'s Fire Hall will open its doors to you now.', flag: 'beatRohan',
  },
  agni: {
    name: 'Agni', title: 'Lieutenant of Indra', team: [['yalicub', 12], ['garudin', 12], ['vetalix', 13], ['yalidhar', 15]], reward: 70, music: 'boss', lieutenant: true,
    intro: ['The sacred fire carries every offering to the heavens.', 'I am Agni, keeper of the flame. A flame tests what is true and burns what is false.', 'Step into the light, Tamer, and let us see what remains!'],
    lose: 'Your spirit did not burn away. Go to Vaijayanta Palace - the King of the Heavens is waiting.', flag: 'beatAgni',
  },
  indra: {
    name: 'Indra', title: 'King of the Heavens', team: [['garudin', 18], ['gandharin', 18], ['nagaraja', 19], ['makaraja', 19], ['airavat', 21]], reward: 120, music: 'boss', god: true,
    intro: ['Thunder rolls through the hall of Vaijayanta. Lightning traces the pillars.', 'INDRA: Child of the mortal roads. You have crossed the river and passed through fire.', 'INDRA: The monsoon does not test strength alone - it tests steadiness. Hold firm through the storm, and the rains will bless you.', 'INDRA: Begin the trial of the heavens!'],
    lose: 'INDRA: The clouds part for you. You have weathered the storm with honour.', flag: 'beatIndra',
    sigLine: 'Airavat raises its trunk to the sky. The Vajra gathers lightning!',
  },
};
