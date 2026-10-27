// =====================================================================
//  STAGE 2 DATA: the other seven cities' creatures, more moves, new orbs & items
//  All designs and names are original, inspired only by traditional folklore.
// =====================================================================
const CITIES = {
  india: { name: 'Indrapuri', culture: 'India', color: '#ff9f1a' },
  greece: { name: 'Olympos', culture: 'Greece', color: '#7fb0ff' },
  norse: { name: 'Asgard', culture: 'Norse', color: '#9fd0e8' },
  egypt: { name: 'Heliopolis', culture: 'Egypt', color: '#ffd040' },
  japan: { name: 'Takama', culture: 'Japan', color: '#ff7a9a' },
  celtic: { name: 'Tir na nOg', culture: 'Celtic', color: '#5ad08a' },
  meso: { name: 'Babylon', culture: 'Mesopotamia', color: '#5a8ae8' },
  slavic: { name: 'Kitezh', culture: 'Slavic', color: '#e85a5a' },
};
const CITY_ORDER = ['india', 'greece', 'norse', 'egypt', 'japan', 'celtic', 'meso', 'slavic'];

Object.assign(MOVES, {
  tailwind: { name: 'Tailwind', type: 'Sky', cat: 'status', acc: 100, pp: 15, fx: { self: { spd: 2 } } },
  cyclone: { name: 'Cyclone', type: 'Sky', pow: 75, acc: 95, pp: 10, fx: { foe: { spd: -1 }, foeCh: .3 } },
  frostfang: { name: 'Frost Fang', type: 'Tide', pow: 60, acc: 100, pp: 15, fx: { stun: .15 } },
  healingtide: { name: 'Healing Tide', type: 'Tide', cat: 'status', acc: 100, pp: 10, fx: { heal: .35 } },
  firewing: { name: 'Fire Wing', type: 'Ember', pow: 60, acc: 100, pp: 20, fx: { status: { kind: 'burn', ch: .1 } } },
  sunpyre: { name: 'Sun Pyre', type: 'Ember', pow: 100, acc: 85, pp: 5, fx: { status: { kind: 'burn', ch: .1 } } },
  cinderdance: { name: 'Cinder Dance', type: 'Ember', cat: 'status', acc: 100, pp: 15, fx: { self: { atk: 1, spd: 1 } } },
  leafblade: { name: 'Leaf Blade', type: 'Grove', pow: 70, acc: 100, pp: 15, crit: 2 },
  spore: { name: 'Sleep Spore', type: 'Grove', cat: 'status', acc: 75, pp: 10, fx: { status: { kind: 'sleep', ch: 1 } } },
  barkskin: { name: 'Barkskin', type: 'Grove', cat: 'status', acc: 100, pp: 15, fx: { self: { def: 2 } } },
  quake: { name: 'Quake Stomp', type: 'Stone', pow: 90, acc: 90, pp: 10 },
  boulderslam: { name: 'Boulder Slam', type: 'Stone', pow: 80, acc: 90, pp: 10, fx: { stun: .1 } },
  petrigaze: { name: 'Stone Gaze', type: 'Stone', cat: 'status', acc: 70, pp: 10, fx: { stun: 1 } },
  hexbolt: { name: 'Hex Bolt', type: 'Shade', pow: 80, acc: 100, pp: 10, fx: { foe: { def: -1 }, foeCh: .2 } },
  nightmare: { name: 'Night Terror', type: 'Shade', cat: 'status', acc: 90, pp: 10, fx: { foe: { atk: -2 } } },
  soulsiphon: { name: 'Soul Siphon', type: 'Shade', pow: 60, acc: 100, pp: 15, fx: { drain: .5 } },
  solarflare: { name: 'Solar Flare', type: 'Light', pow: 100, acc: 85, pp: 5 },
  blessing: { name: 'Blessing', type: 'Light', cat: 'status', acc: 100, pp: 10, fx: { self: { atk: 1, def: 1 } } },
  dawnlance: { name: 'Dawn Lance', type: 'Light', pow: 70, acc: 100, pp: 15, crit: 2 },
  staticrush: { name: 'Static Rush', type: 'Storm', pow: 40, acc: 100, pp: 30, pri: 1 },
  tempest: { name: 'Tempest', type: 'Storm', pow: 95, acc: 80, pp: 10, fx: { stun: .3 } },
  chargeup: { name: 'Charge Up', type: 'Storm', cat: 'status', acc: 100, pp: 15, fx: { self: { atk: 2 } } },
  bash: { name: 'Heavy Bash', type: 'Neutral', pow: 70, acc: 100, pp: 15 },
  howl: { name: 'Battle Howl', type: 'Neutral', cat: 'status', acc: 100, pp: 15, fx: { self: { atk: 1 }, foe: { atk: -1 } } },
});

// compact species definition: pal = [base, accent, belly, eye, glow, horn]
function defSp(id, city, name, types, base, rarity, xp, art, lore, learn, extra = {}) {
  const [tpl, size, pal, pattern, acc] = art;
  SPECIES[id] = Object.assign({ name, types, base, xp, rarity, city, lore, learn,
    art: { tpl, size, pal: { base: pal[0], accent: pal[1], belly: pal[2], eye: pal[3], glow: pal[4], horn: pal[5] }, pattern, acc } }, extra);
  SPECIES_ORDER.push(id);
}
// ---------------- GREECE (Olympos) ----------------
defSp('pegafoal', 'greece', 'Pegafoal', ['Sky'], [48, 52, 46, 64], 'uncommon', 64, ['quadruped', .8, ['#f4f0ff', '#9fd4ff', '#ffffff', '#1a1a3a', '#ffe36a', '#e8d8a0'], 'none', ['wingsBig', 'longSnout', 'maneFlow', 'ears', 'noMuzzle', 'tall']],
  'A winged foal born from sea-foam and storm cloud. It practises flying by leaping off temple steps.', [[1, 'gust'], [1, 'tackle'], [5, 'quickdart'], [10, 'wingslash'], [14, 'tailwind'], [18, 'cyclone']], { evo: ['pegasorn', 18] });
defSp('pegasorn', 'greece', 'Pegasorn', ['Sky', 'Light'], [72, 80, 66, 92], 'rare', 160, ['quadruped', 1.02, ['#f8f6ff', '#ffd86a', '#ffffff', '#1a1a3a', '#ffe36a', '#e8d8a0'], 'none', ['wingsBig', 'longSnout', 'maneFlow', 'ears', 'noMuzzle', 'gem', 'tall']],
  'A grown sky-steed that carries thunder for the clouds. Only riders with honest hearts may touch its golden mane.', [[1, 'wingslash'], [1, 'tailwind'], [18, 'dawnlance'], [22, 'cyclone'], [28, 'garudadive'], [34, 'solarflare']]);
defSp('hydrelle', 'greece', 'Hydrelle', ['Tide', 'Shade'], [56, 58, 54, 52], 'rare', 150, ['serpentine', .9, ['#3f8a5a', '#9fd060', '#e0e8a0', '#200a0a', '#ff5050', '#e0d8b0'], 'scales', ['heads3', 'frills', 'tongue']],
  'A three-headed marsh serpent. When one head naps, the other two argue about where to swim.', [[1, 'splashjet'], [1, 'nighthiss'], [7, 'venomfang'], [11, 'whirlbind'], [17, 'hexbolt'], [24, 'monsooncrash']]);
defSp('gorgling', 'greece', 'Gorgling', ['Stone', 'Shade'], [50, 56, 58, 46], 'uncommon', 66, ['humanoid', .85, ['#7a9a6a', '#4a8a3a', '#c8d8a8', '#3a2a08', '#ffe060', '#d0c090'], 'none', ['snakeHair', 'cloak']],
  'Its gaze can stiffen joints like stone for a moment. Its hair-snakes are shy and hide behind its ears.', [[1, 'tackle'], [1, 'pebbleshot'], [5, 'nighthiss'], [10, 'petrigaze'], [15, 'rockcrush'], [21, 'hexbolt']]);
defSp('minotot', 'greece', 'Minotot', ['Stone'], [62, 68, 60, 36], 'uncommon', 66, ['humanoid', .9, ['#8a5a3a', '#c8402a', '#d8b090', '#1a0a04', '#ffb040', '#f0e0c0'], 'none', ['bullHead', 'bullHorns', 'sash', 'hammer']],
  'A bull-headed calf raised in a maze of hedges. It never gets lost - it simply walks through the walls.', [[1, 'tackle'], [1, 'roar'], [8, 'bash'], [12, 'rockcrush'], [18, 'boulderslam'], [26, 'quake']]);
defSp('cerbepup', 'greece', 'Cerbepup', ['Ember', 'Shade'], [54, 62, 48, 58], 'rare', 140, ['quadruped', .86, ['#4a3434', '#ff5a1f', '#8a5a4a', '#ff3a1a', '#ff7a1a', '#e0d0c0'], 'none', ['heads3', 'ears', 'fangs', 'snakeTail']],
  'A three-headed guard pup from the gates of the underworld. Each head barks at a different kind of stranger.', [[1, 'emberspit'], [1, 'nighthiss'], [8, 'flamefang'], [12, 'howl'], [16, 'shadowbite'], [24, 'kilnblast']]);
defSp('chimerant', 'greece', 'Chimerant', ['Ember', 'Stone'], [60, 64, 56, 50], 'rare', 145, ['quadruped', .85, ['#d0902a', '#8a4a1a', '#f0d090', '#2a1408', '#ff4a1a', '#f0e0c0'], 'none', ['mane', 'hornsSmall', 'snakeTail', 'ears']],
  'Lion in front, goat in the middle, serpent at the tail - and all three disagree about lunch.', [[1, 'emberspit'], [1, 'tackle'], [6, 'roar'], [10, 'flamefang'], [15, 'rockcrush'], [28, 'sunpyre']]);
defSp('cyclite', 'greece', 'Cyclite', ['Stone', 'Storm'], [78, 84, 76, 40], 'rare', 170, ['humanoid', 1.05, ['#a8b0c8', '#6a4a2a', '#d0d8e8', '#20203a', '#ffe060', '#c0c8d8'], 'none', ['cyclops', 'noEye', 'hammer', 'sash']],
  'A one-eyed smith of the mountain forges. Its hammer blows ring out like thunder across the valleys.', [[1, 'pebbleshot'], [1, 'spark'], [12, 'rockcrush'], [20, 'thunderclap'], [26, 'boulderslam'], [32, 'tempest']]);
// ---------------- NORSE (Asgard) ----------------
defSp('fenrisk', 'norse', 'Fenrisk', ['Shade'], [52, 60, 46, 62], 'uncommon', 64, ['quadruped', .82, ['#5a5a6a', '#2a2a3a', '#b8b8c8', '#ffd040', '#9fe4ff', '#e8e8f0'], 'none', ['ears', 'fangs', 'maneFlow', 'noMuzzle', 'longSnout']],
  'A wolf pup with a growl far bigger than itself. Tie it with a silk ribbon and it will sulk, not struggle.', [[1, 'tackle'], [1, 'nighthiss'], [5, 'quickdart'], [10, 'shadowbite'], [14, 'howl'], [18, 'frostfang']], { evo: ['fenrimaw', 20] });
defSp('fenrimaw', 'norse', 'Fenrimaw', ['Shade', 'Stone'], [80, 92, 70, 82], 'rare', 170, ['quadruped', 1.06, ['#3a3a4a', '#1a1a2a', '#9a9aaa', '#ffd040', '#9fe4ff', '#e8e8f0'], 'none', ['ears', 'fangs', 'maneFlow', 'spikes', 'noMuzzle', 'longSnout']],
  'A giant wolf whose jaws could swallow the moon\'s reflection. It honours only oaths sworn sincerely.', [[1, 'shadowbite'], [1, 'frostfang'], [20, 'hexbolt'], [25, 'boulderslam'], [30, 'nightmare']]);
defSp('jormlet', 'norse', 'Jormlet', ['Tide', 'Stone'], [60, 54, 62, 44], 'uncommon', 66, ['serpentine', .9, ['#2a6a7a', '#7ad0c0', '#d0e8d0', '#0a1a20', '#7affd0', '#e0e0d0'], 'scales', ['finsBack', 'frills']],
  'A young world-serpent that coils around fishing boats to keep them steady. It will grow until it can bite its own tail.', [[1, 'splashjet'], [1, 'whirlbind'], [7, 'pebbleshot'], [12, 'frostfang'], [20, 'monsooncrash'], [28, 'quake']]);
defSp('sleipra', 'norse', 'Sleipra', ['Sky', 'Storm'], [58, 60, 52, 78], 'rare', 150, ['quadruped', .95, ['#8a8a9a', '#d8e0f0', '#c8c8d8', '#1a1a2a', '#9fe4ff', '#e0e0e8'], 'none', ['legs8', 'longSnout', 'maneFlow', 'ears', 'noMuzzle', 'tall']],
  'An eight-legged grey steed that gallops between worlds. Its hoofbeats sound like rain on a roof.', [[1, 'tackle'], [1, 'gust'], [6, 'staticrush'], [12, 'wingslash'], [16, 'tailwind'], [26, 'tempest']]);
defSp('huginix', 'norse', 'Huginix', ['Sky', 'Shade'], [46, 56, 42, 72], 'common', 58, ['avian', .85, ['#2a2a3a', '#3a3a5a', '#4a4a6a', '#9fe4ff', '#9fe4ff', '#c8c8d0'], 'none', ['crest']],
  'A thought-raven that flies over the world each day and returns at dusk to whisper what it saw.', [[1, 'gust'], [1, 'nighthiss'], [5, 'quickdart'], [9, 'wingslash'], [15, 'hexbolt'], [21, 'cyclone']]);
defSp('draugrim', 'norse', 'Draugrim', ['Shade', 'Stone'], [62, 58, 64, 34], 'uncommon', 64, ['humanoid', .92, ['#6a7a6a', '#3a3a4a', '#8a9a8a', '#7affd0', '#7affd0', '#a8a8b0'], 'none', ['helmet', 'cloak', 'spear']],
  'A barrow guardian that keeps watch over old treasure mounds. Grumpy, but loyal to anyone who honours the dead.', [[1, 'tackle'], [1, 'nighthiss'], [6, 'guard'], [10, 'shadowbite'], [16, 'boulderslam'], [22, 'soulsiphon']]);
defSp('ratatusk', 'norse', 'Ratatusk', ['Grove', 'Sky'], [42, 44, 40, 74], 'common', 56, ['quadruped', .7, ['#c8702a', '#f0a050', '#f8e0c0', '#1a0a04', '#9fe060', '#e8d8c0'], 'none', ['bushyTail', 'ears', 'noMuzzle']],
  'A chattering squirrel that runs up and down the world tree, carrying insults between the eagle and the dragon.', [[1, 'tackle'], [1, 'vinelash'], [4, 'quickdart'], [8, 'gust'], [14, 'leafblade'], [18, 'tailwind']]);
defSp('tanngrit', 'norse', 'Tanngrit', ['Storm', 'Stone'], [64, 62, 58, 52], 'uncommon', 68, ['quadruped', .9, ['#d8d0c0', '#8a6a4a', '#f0e8d8', '#2a1a0a', '#ffe060', '#c8b890'], 'none', ['horns', 'beard', 'ears']],
  'A sturdy goat that pulls thunder-chariots. It is whole again every morning - though it never forgets a slight.', [[1, 'tackle'], [1, 'spark'], [6, 'roar'], [10, 'bash'], [15, 'thunderclap'], [20, 'chargeup']]);
// ---------------- EGYPT (Heliopolis) ----------------
defSp('scarabix', 'egypt', 'Scarabix', ['Stone', 'Light'], [52, 46, 62, 40], 'common', 58, ['quadruped', .72, ['#2a4a6a', '#3a8ab8', '#5a7a8a', '#0a1a2a', '#ffd040', '#e0d0a0'], 'none', ['shell', 'noMuzzle', 'hornsSmall', 'noTail', 'legs8']],
  'A sacred beetle that rolls a little ball of sunlight across the sand each dawn.', [[1, 'tackle'], [1, 'pebbleshot'], [5, 'glimmer'], [9, 'guard'], [14, 'rockcrush'], [26, 'solarflare']]);
defSp('bennuling', 'egypt', 'Bennuling', ['Ember', 'Light'], [48, 54, 44, 60], 'uncommon', 64, ['avian', .82, ['#a8a8b0', '#ff8a3a', '#e8e0d0', '#1a1a1a', '#ffd040', '#e0d0a0'], 'none', ['longNeck', 'crestTall']],
  'A heron chick that hatched from embers on a sacred stone. It cries at sunrise to call the day.', [[1, 'emberspit'], [1, 'gust'], [5, 'glimmer'], [10, 'firewing'], [16, 'sunhymn'], [20, 'cinderdance']], { evo: ['bennurah', 22] });
defSp('bennurah', 'egypt', 'Bennurah', ['Ember', 'Light'], [74, 82, 66, 86], 'rare', 170, ['avian', 1.0, ['#c87a2a', '#ffd040', '#fff0c0', '#1a0a04', '#ff6a1a', '#e0d0a0'], 'none', ['longNeck', 'crestTall', 'flameTail', 'sunDisk']],
  'Reborn from its own ashes every five hundred years, it carries the morning sun on its crest.', [[1, 'firewing'], [1, 'sunhymn'], [22, 'solarflare'], [28, 'sunpyre'], [32, 'blessing']]);
defSp('sobeken', 'egypt', 'Sobeken', ['Tide', 'Stone'], [66, 66, 64, 38], 'uncommon', 68, ['aquatic', .95, ['#4a7a4a', '#2a5a8a', '#d8d8a0', '#1a1a0a', '#ffd040', '#e0d8b0'], 'scales', ['snout', 'legs', 'nemesA', 'dorsal']],
  'A river crocodile in a striped headdress. Farmers pray it keeps the floods gentle and the fields green.', [[1, 'tackle'], [1, 'splashjet'], [6, 'whirlbind'], [10, 'rockcrush'], [15, 'lotuscurrent'], [22, 'monsooncrash']]);
defSp('ammitar', 'egypt', 'Ammitar', ['Shade', 'Stone'], [70, 72, 66, 36], 'rare', 150, ['quadruped', .95, ['#8a6a3a', '#c89a4a', '#c8b080', '#1a0a04', '#ff4a3a', '#f0e0c0'], 'none', ['crocSnout', 'maneLion', 'noMuzzle']],
  'It waits beside the scales of judgement and only bites hearts heavier than a feather - so be kind.', [[1, 'tackle'], [1, 'nighthiss'], [8, 'shadowbite'], [14, 'rockcrush'], [20, 'soulsiphon'], [26, 'hexbolt']]);
defSp('sphinxel', 'egypt', 'Sphinxel', ['Light', 'Stone'], [62, 60, 64, 52], 'rare', 150, ['quadruped', .95, ['#d8b070', '#3a6ab8', '#e8c890', '#1a0a04', '#ffd040', '#e0d0a0'], 'none', ['humanFace', 'nemes', 'wingsSmall', 'noMuzzle']],
  'A lion with a calm face who guards desert roads. It asks riddles, but always gives hints to tired travellers.', [[1, 'tackle'], [1, 'glimmer'], [6, 'roar'], [12, 'rockcrush'], [18, 'dawnlance'], [24, 'blessing']]);
defSp('uraeling', 'egypt', 'Uraeling', ['Ember', 'Light'], [48, 58, 44, 58], 'common', 58, ['serpentine', .85, ['#d8902a', '#c8402a', '#f0d080', '#1a0a04', '#ffe060', '#ffd84a'], 'none', ['hood', 'sunDisk', 'tongue']],
  'A golden cobra that rears up to spit sparks at anyone who threatens the sun-boat.', [[1, 'emberspit'], [1, 'nighthiss'], [5, 'glimmer'], [9, 'venomfang'], [14, 'firewing'], [20, 'sunhymn']]);
defSp('apepling', 'egypt', 'Apepling', ['Shade', 'Tide'], [72, 78, 64, 62], 'rare', 170, ['serpentine', 1.0, ['#3a2a4a', '#6a3a8a', '#8a7aa0', '#ff3a3a', '#c060ff', '#d0c0e0'], 'rings', ['finsBack', 'frills', 'tongue']],
  'A coil of the chaos serpent that tries to swallow the setting sun each night. Each morning it fails, and sulks in the reeds.', [[1, 'nighthiss'], [1, 'whirlbind'], [12, 'hexbolt'], [18, 'nightmare'], [24, 'monsooncrash'], [30, 'soulsiphon']]);
// ---------------- JAPAN (Takama) ----------------
defSp('kitsunko', 'japan', 'Kitsunko', ['Ember', 'Light'], [46, 50, 44, 64], 'uncommon', 64, ['quadruped', .8, ['#e88a3a', '#ffffff', '#fff0e0', '#1a0a04', '#7ad0ff', '#f0e0c0'], 'none', ['earsTall', 'noMuzzle', 'longSnout']],
  'A fox kit that lights tiny blue foxfires to find its way home. Each century it lives, it grows another tail.', [[1, 'emberspit'], [1, 'quickdart'], [5, 'glimmer'], [10, 'firewing'], [14, 'cinderdance'], [20, 'dawnlance']], { evo: ['kyubirei', 24] });
defSp('kyubirei', 'japan', 'Kyubirei', ['Ember', 'Light'], [76, 80, 70, 92], 'rare', 170, ['quadruped', 1.0, ['#f4e8d0', '#ffd040', '#ffffff', '#1a0a04', '#7ad0ff', '#f0e0c0'], 'none', ['earsTall', 'longSnout', 'noMuzzle', 'tailsMany', 'gem']],
  'A nine-tailed fox who has lived a thousand years. Its tails glow like lanterns at a summer festival.', [[1, 'firewing'], [1, 'dawnlance'], [24, 'sunpyre'], [30, 'solarflare'], [34, 'blessing']]);
defSp('kappling', 'japan', 'Kappling', ['Tide', 'Grove'], [54, 54, 58, 46], 'common', 58, ['humanoid', .78, ['#5aa05a', '#4a6a3a', '#c8e0a0', '#0a1a0a', '#9fe4ff', '#e0d8b0'], 'none', ['shellBack', 'dish', 'beakH']],
  'A river imp with a water-filled dish on its head. Bow to it politely - it will bow back and spill its strength.', [[1, 'splashjet'], [1, 'vinelash'], [5, 'guard'], [9, 'whirlbind'], [14, 'leafblade'], [18, 'healingtide']]);
defSp('tanukin', 'japan', 'Tanukin', ['Grove', 'Shade'], [58, 48, 52, 50], 'common', 58, ['quadruped', .8, ['#8a6a4a', '#4a3a2a', '#e8d0b0', '#1a0a04', '#9fe060', '#e0d0b0'], 'none', ['leafHead', 'ears', 'bushyTail']],
  'A round raccoon-dog that puts a leaf on its head to change shape. It mostly turns into teapots.', [[1, 'tackle'], [1, 'vinelash'], [6, 'spore'], [10, 'nighthiss'], [15, 'leafblade'], [20, 'nightmare']]);
defSp('tengumi', 'japan', 'Tengumi', ['Sky', 'Storm'], [56, 64, 50, 68], 'uncommon', 66, ['humanoid', .9, ['#d84a3a', '#3a3a5a', '#e8c8a0', '#1a0a04', '#ffe060', '#e0d0b0'], 'none', ['wings', 'longNose', 'cloak', 'staff']],
  'A mountain goblin with a long red nose and crow wings. It teaches staff drills to anyone who sweeps its shrine.', [[1, 'gust'], [1, 'quickdart'], [6, 'staticrush'], [10, 'wingslash'], [16, 'cyclone'], [24, 'tempest']]);
defSp('raikitt', 'japan', 'Raikitt', ['Storm'], [50, 60, 44, 72], 'uncommon', 64, ['quadruped', .8, ['#3a5ab8', '#ffe040', '#a8c8ff', '#0a0a2a', '#ffff80', '#f0f0c0'], 'bolts', ['earsTall', 'spikes', 'noMuzzle']],
  'A thunder kitten that falls from the sky with the lightning. It loves to nap in warm places during storms.', [[1, 'spark'], [1, 'quickdart'], [5, 'staticrush'], [11, 'thunderclap'], [15, 'chargeup'], [24, 'tempest']]);
defSp('ryugo', 'japan', 'Ryugo', ['Tide', 'Storm'], [66, 70, 62, 66], 'rare', 160, ['serpentine', .98, ['#2a8a9a', '#ffd040', '#f0f0c0', '#0a1a20', '#9fe4ff', '#f0e8c0'], 'scales', ['hornsS', 'whiskers', 'maneS', 'finsBack']],
  'A young sea-dragon from the palace beneath the waves. It keeps a pearl that controls the tides - mostly for splashing.', [[1, 'splashjet'], [1, 'spark'], [8, 'whirlbind'], [14, 'thunderclap'], [20, 'monsooncrash'], [28, 'tempest']]);
defSp('chochibi', 'japan', 'Chochibi', ['Ember', 'Shade'], [44, 56, 40, 62], 'common', 58, ['spirit', .85, ['#f0d8a0', '#d84a3a', '#fff0c8', '#1a0a04', '#ff6a2a', '#e8c050'], 'none', ['lantern']],
  'An old paper lantern that came alive after a hundred festivals. It sticks out its tongue at people who forget to light it.', [[1, 'emberspit'], [1, 'nighthiss'], [6, 'emberveil'], [11, 'firewing'], [17, 'hexbolt'], [22, 'nightmare']]);
// ---------------- CELTIC (Tir na nOg) ----------------
defSp('selkin', 'celtic', 'Selkin', ['Tide'], [56, 46, 54, 52], 'common', 60, ['aquatic', .82, ['#6a7a8a', '#4a5a6a', '#c8d0d8', '#0a0a1a', '#9fe4ff', '#e8e8e8'], 'spots', ['sealFace']],
  'A seal pup that sheds its skin on moonlit beaches to dance. Hide its skin and it will follow you for days.', [[1, 'tackle'], [1, 'splashjet'], [5, 'guard'], [10, 'frostfang'], [15, 'healingtide'], [19, 'lotuscurrent']], { evo: ['selkara', 22] });
defSp('selkara', 'celtic', 'Selkara', ['Tide', 'Light'], [80, 70, 76, 72], 'rare', 165, ['aquatic', 1.02, ['#4a5a7a', '#9fd0c0', '#d8e0f0', '#0a0a1a', '#ffe36a', '#e8e8e8'], 'spots', ['sealFace', 'weedMane', 'crown']],
  'A grown seal-folk who sings ships safely past the rocks. Its song can be heard in seashells.', [[1, 'frostfang'], [1, 'healingtide'], [22, 'dawnlance'], [26, 'monsooncrash'], [30, 'blessing']]);
defSp('kelpling', 'celtic', 'Kelpling', ['Tide', 'Shade'], [60, 62, 52, 62], 'uncommon', 66, ['quadruped', .9, ['#3a6a6a', '#4a8a3a', '#8ab0a0', '#0a1a1a', '#7affd0', '#d0e0d0'], 'none', ['longSnout', 'maneFlow', 'ears', 'noMuzzle', 'tall']],
  'A water horse that offers rides beside dark lochs. Never climb on - its back grows sticky and it heads for deep water.', [[1, 'splashjet'], [1, 'tackle'], [6, 'whirlbind'], [10, 'nighthiss'], [15, 'lotuscurrent'], [22, 'soulsiphon']]);
defSp('pookin', 'celtic', 'Pookin', ['Shade', 'Grove'], [50, 56, 46, 66], 'uncommon', 64, ['quadruped', .8, ['#2a2a3a', '#4a4a6a', '#5a5a7a', '#ffd040', '#ffe060', '#e0d8c0'], 'none', ['earsTall', 'hornsSmall', 'noMuzzle']],
  'A shape-shifting trickster that appears as a black goat or hare. Leave it the last of the harvest and it leaves you in peace.', [[1, 'tackle'], [1, 'nighthiss'], [5, 'quickdart'], [9, 'spore'], [15, 'hexbolt'], [21, 'nightmare']]);
defSp('keenwail', 'celtic', 'Keenwail', ['Shade', 'Sky'], [48, 62, 40, 66], 'uncommon', 64, ['spirit', .9, ['#c8d0e8', '#eeeefa', '#ffffff', '#9fe4ff', '#9fe4ff', '#e0e0f0'], 'none', ['hairFlow', 'glowEyes']],
  'A keening spirit whose song warns families of coming storms. Its wail is sad, but it means to help.', [[1, 'nighthiss'], [1, 'gust'], [7, 'nightmare'], [12, 'hexbolt'], [18, 'cyclone'], [23, 'soulsiphon']]);
defSp('cusith', 'celtic', 'Cusith', ['Grove', 'Shade'], [66, 70, 58, 64], 'rare', 150, ['quadruped', .86, ['#3a7a4a', '#2a5a3a', '#8ac08a', '#0a1a0a', '#9fff9a', '#e0e8d0'], 'none', ['ears', 'fangs', 'bushyTail', 'longSnout', 'noMuzzle']],
  'A great green fairy hound that roams the moors. It barks three times - only the first is a warning.', [[1, 'tackle'], [1, 'vinelash'], [6, 'howl'], [11, 'shadowbite'], [16, 'leafblade'], [24, 'quake']]);
defSp('sidhel', 'celtic', 'Sidhel', ['Light', 'Grove'], [40, 48, 44, 78], 'common', 56, ['spirit', .66, ['#c8f0c8', '#ff9fd0', '#ffffff', '#1a1020', '#ffe36a', '#f0e0c0'], 'none', ['wingsFairy', 'arms']],
  'A tiny fae from the hollow hills. It trades glittering gifts that turn into leaves by morning.', [[1, 'glimmer'], [1, 'vinelash'], [5, 'quickdart'], [9, 'spore'], [14, 'dawnlance'], [20, 'blessing']]);
defSp('hartwyn', 'celtic', 'Hartwyn', ['Grove', 'Light'], [74, 72, 70, 74], 'rare', 165, ['quadruped', 1.0, ['#f0ece0', '#c8e0a0', '#ffffff', '#1a1a0a', '#ffe36a', '#e8d0a0'], 'none', ['antlers', 'longSnout', 'noMuzzle', 'ears', 'tall']],
  'A white stag of the deep forest. Hunters who chase it get lost, then find their way home years wiser.', [[1, 'tackle'], [1, 'vinelash'], [10, 'bash'], [16, 'leafblade'], [22, 'dawnlance'], [28, 'blessing']]);
// ---------------- MESOPOTAMIA (Babylon) ----------------
defSp('lamassel', 'meso', 'Lamassel', ['Stone', 'Light'], [60, 52, 62, 40], 'uncommon', 66, ['quadruped', .84, ['#c8a878', '#4a6ab8', '#e8d0a8', '#1a0a04', '#ffd040', '#5a3a2a'], 'none', ['humanFace', 'beard', 'wingsSmall', 'noMuzzle']],
  'A winged guardian calf with a wise face. It practises standing perfectly still beside doorways.', [[1, 'tackle'], [1, 'pebbleshot'], [5, 'guard'], [9, 'glimmer'], [14, 'rockcrush'], [20, 'blessing']], { evo: ['lamassar', 24] });
defSp('lamassar', 'meso', 'Lamassar', ['Stone', 'Light'], [86, 78, 90, 48], 'rare', 175, ['quadruped', 1.04, ['#d8b888', '#3a5ab8', '#f0dcb8', '#1a0a04', '#ffd040', '#3a2414'], 'none', ['humanFace', 'beard', 'wingsBig', 'noMuzzle', 'crown']],
  'A great winged bull with a crowned human head. It guards city gates and lets in only honest guests.', [[1, 'rockcrush'], [1, 'blessing'], [24, 'dawnlance'], [30, 'quake'], [36, 'solarflare']]);
defSp('anzoo', 'meso', 'Anzoo', ['Storm', 'Sky'], [56, 66, 50, 70], 'rare', 150, ['avian', .92, ['#8a6a3a', '#3a5a8a', '#e8d0a0', '#1a0a04', '#ffe060', '#e0d0a0'], 'none', ['maneLion', 'earsLion', 'lionMuzzle', 'tailFan']],
  'A lion-headed thunderbird. Long ago it stole the tablet of destinies - now it guards tablets for scribes.', [[1, 'gust'], [1, 'spark'], [6, 'roar'], [10, 'wingslash'], [15, 'thunderclap'], [26, 'tempest']]);
defSp('mushush', 'meso', 'Mushush', ['Ember', 'Shade'], [64, 70, 58, 60], 'rare', 155, ['quadruped', .95, ['#3a5a9a', '#e8c050', '#8aa0d0', '#1a0a04', '#ff6a2a', '#e8c050'], 'scales', ['stingerTail', 'hornSingle', 'longSnout', 'noMuzzle', 'spikes']],
  'A horned serpent-dragon glazed in blue and gold on the city gates. It patrols the walls at night.', [[1, 'emberspit'], [1, 'nighthiss'], [8, 'venomfang'], [12, 'flamefang'], [18, 'hexbolt'], [26, 'sunpyre']]);
defSp('humbabo', 'meso', 'Humbabo', ['Grove', 'Stone'], [72, 62, 70, 36], 'uncommon', 68, ['humanoid', .95, ['#5a6a3a', '#2f7a3a', '#a8b080', '#1a1a0a', '#9fe060', '#3a4a2a'], 'none', ['leafHair', 'beard']],
  'Guardian of the cedar forest, its face is a tangle of roots. It lets in travellers who promise not to cut a single tree.', [[1, 'tackle'], [1, 'vinelash'], [5, 'roar'], [10, 'barkskin'], [15, 'leafblade'], [24, 'quake']]);
defSp('girtab', 'meso', 'Girtab', ['Stone', 'Shade'], [60, 66, 62, 44], 'uncommon', 66, ['humanoid', .92, ['#8a6a3a', '#3a2a1a', '#c8a878', '#1a0a04', '#ff4a3a', '#c8c0a0'], 'none', ['stingerTail', 'helmet', 'spear']],
  'A scorpion-tailed guard who opens the mountain gates for the rising sun. It has never once been late.', [[1, 'tackle'], [1, 'pebbleshot'], [7, 'venomfang'], [12, 'rockcrush'], [18, 'boulderslam'], [24, 'hexbolt']]);
defSp('apkalu', 'meso', 'Apkalu', ['Tide', 'Light'], [56, 46, 60, 52], 'common', 58, ['humanoid', .88, ['#e8e0c8', '#3a8ab8', '#e0b080', '#1a0a04', '#ffe36a', '#e0d0b0'], 'none', ['fishHat', 'fishCloak', 'lanternHand']],
  'A fish-cloaked sage who rose from the sea to teach people writing. It still corrects everyone\'s spelling.', [[1, 'splashjet'], [1, 'glimmer'], [5, 'guard'], [10, 'healingtide'], [16, 'dawnlance'], [22, 'blessing']]);
defSp('gugalan', 'meso', 'Gugalan', ['Storm', 'Stone'], [90, 94, 84, 52], 'mythic', 240, ['quadruped', 1.08, ['#5a4a8a', '#ffe060', '#8a7ab8', '#ffff80', '#ffff80', '#f0e8d0'], 'bolts', ['bullHorns', 'spikes', 'noMuzzle']],
  'The great Bull of Heaven whose stamping shakes the earth. Its breath is the hot wind before a storm.', [[1, 'bash'], [1, 'thunderclap'], [1, 'quake'], [1, 'tempest']], { bossOnly: true });
// ---------------- SLAVIC (Kitezh) ----------------
defSp('zharling', 'slavic', 'Zharling', ['Ember', 'Light'], [48, 56, 44, 62], 'uncommon', 64, ['avian', .82, ['#ff8a2a', '#ffd040', '#fff0a0', '#1a0a04', '#ff4a1a', '#ffd84a'], 'none', ['crestTall', 'tailLong']],
  'A firebird chick whose feathers glow even in daylight. A single dropped feather can light a whole cottage.', [[1, 'emberspit'], [1, 'gust'], [5, 'glimmer'], [10, 'firewing'], [15, 'cinderdance'], [20, 'sunhymn']], { evo: ['zharplume', 24] });
defSp('zharplume', 'slavic', 'Zharplume', ['Ember', 'Light'], [74, 84, 66, 88], 'rare', 170, ['avian', 1.04, ['#ff6a1a', '#ffe060', '#fff0c0', '#1a0a04', '#ff3a1a', '#ffd84a'], 'none', ['crestTall', 'flameTail', 'crown']],
  'The firebird of the far kingdom. Heroes chase it for years; it lets them, because it enjoys the company.', [[1, 'firewing'], [1, 'sunhymn'], [24, 'sunpyre'], [30, 'solarflare'], [34, 'tailwind']]);
defSp('leshko', 'slavic', 'Leshko', ['Grove', 'Shade'], [66, 58, 62, 50], 'uncommon', 66, ['humanoid', .95, ['#6a5a3a', '#3a8a3a', '#a89a70', '#1a1a0a', '#9fe060', '#5a8a4a'], 'none', ['antlers', 'leafHair', 'beard', 'cloak']],
  'The forest\'s keeper, tall as a tree or small as a mushroom. It leads rude travellers in circles until they say sorry.', [[1, 'vinelash'], [1, 'tackle'], [6, 'spore'], [11, 'barkskin'], [16, 'leafblade'], [22, 'nightmare']]);
defSp('rusalin', 'slavic', 'Rusalin', ['Tide', 'Shade'], [54, 56, 50, 60], 'uncommon', 64, ['humanoid', .9, ['#a8c8d0', '#3a8a8a', '#e0f0f0', '#0a1a1a', '#9fe4ff', '#e0e8e8'], 'none', ['fishTail', 'hairBack']],
  'A river spirit who combs her green hair on willow branches. She tickles swimmers who splash too loudly.', [[1, 'splashjet'], [1, 'nighthiss'], [6, 'whirlbind'], [11, 'frostfang'], [15, 'healingtide'], [21, 'soulsiphon']]);
defSp('domovik', 'slavic', 'Domovik', ['Light', 'Stone'], [56, 48, 60, 44], 'common', 58, ['humanoid', .72, ['#8a5a3a', '#c83a2a', '#e8c8a0', '#1a0a04', '#ffd040', '#eeeae0'], 'none', ['beard', 'sash']],
  'A little bearded house spirit who lives behind the stove. Leave it porridge and your house stays warm and lucky.', [[1, 'tackle'], [1, 'glimmer'], [5, 'guard'], [10, 'blessing'], [14, 'pebbleshot'], [20, 'dawnlance']]);
defSp('zmeyok', 'slavic', 'Zmeyok', ['Ember', 'Sky'], [66, 74, 60, 62], 'rare', 160, ['quadruped', .95, ['#4a8a3a', '#d8b040', '#c8d890', '#1a0a04', '#ff5a1f', '#f0e8c0'], 'scales', ['heads3', 'wingsBig', 'spikes', 'longSnout', 'noMuzzle']],
  'A three-headed dragon hatchling. Its heads take turns breathing fire so none of them gets a sore throat.', [[1, 'emberspit'], [1, 'gust'], [8, 'flamefang'], [13, 'wingslash'], [18, 'firewing'], [28, 'sunpyre']]);
defSp('vodyan', 'slavic', 'Vodyan', ['Tide', 'Grove'], [68, 56, 62, 38], 'common', 60, ['humanoid', .9, ['#5a8a5a', '#3a5a3a', '#c8d8a0', '#0a1a0a', '#9fe4ff', '#8aa060'], 'spots', ['frogHead', 'noEye', 'beard']],
  'An old frog-faced water grandfather who lives in mill-ponds. Fishermen leave him gifts; he leaves them fish.', [[1, 'splashjet'], [1, 'vinelash'], [5, 'guard'], [9, 'whirlbind'], [14, 'healingtide'], [22, 'monsooncrash']]);
defSp('kikimor', 'slavic', 'Kikimor', ['Shade'], [44, 56, 42, 68], 'common', 58, ['spirit', .8, ['#6a6a4a', '#3a5a2a', '#9a9a7a', '#ff6a2a', '#ffb040', '#d0c8a0'], 'none', ['mossy', 'hornsSp', 'arms']],
  'A tiny night spirit that tangles yarn and rattles pots. Brew it fern tea and it will spin your thread instead.', [[1, 'nighthiss'], [1, 'tackle'], [5, 'spore'], [10, 'nightmare'], [15, 'hexbolt'], [20, 'soulsiphon']]);

// ---------------- remaining orbs and items (Stage 2) ----------------
Object.assign(ITEMS, {
  vayavyastra: { name: 'Vayavyastra Orb', price: 500, desc: 'Wind-bound orb. Very strong against Sky creatures.', orb: true, mult: 1, vsType: 'Sky', vsMult: 3 },
  gandiva: { name: 'Gandiva Orb', price: 1200, desc: 'A masterwork orb with a very high taming rate.', orb: true, mult: 2.4, unlock: 'beatAgni' },
  brahmastra: { name: 'Brahmastra Orb', price: 0, desc: 'Tames any wild creature without fail. Only one exists.', orb: true, mult: 1, guaranteed: true, unique: true },
  gangajal: { name: 'Ganga Jal', price: 600, desc: 'Holy water. Cures every status of every companion. Battle only.', use: 'cureAll', battleOnly: true, noTarget: true },
  kavach: { name: 'Kavach Charm', price: 350, desc: 'Sharply raises the active companion\'s Defense. Battle only.', use: 'defUp', battleOnly: true, noTarget: true },
});
ITEMS.tulsi.desc = 'Cures one status condition (burn, poison or sleep first).';
SHOP_STOCK.splice(0, SHOP_STOCK.length, 'bana', 'agneyastra', 'varunastra', 'vayavyastra', 'nagastra', 'gandiva', 'soma', 'tulsi', 'gangajal', 'kavach', 'akshaya', 'sanjivani', 'amrita');

// sanity check (developer console only)
(function validateData() {
  const errs = [];
  for (const id of SPECIES_ORDER) {
    const sp = SPECIES[id]; if (!sp) { errs.push('missing species ' + id); continue; }
    for (const [, m] of sp.learn) if (!MOVES[m]) errs.push(id + ' learns unknown move ' + m);
    if (sp.evo && !SPECIES[sp.evo[0]]) errs.push(id + ' evolves into unknown ' + sp.evo[0]);
    if (!CITIES[sp.city]) errs.push(id + ' has unknown city');
    for (const t of sp.types) if (!TYPES.includes(t)) errs.push(id + ' has unknown type ' + t);
  }
  if (errs.length) console.warn('MYTHBOUND data problems:', errs);
})();
