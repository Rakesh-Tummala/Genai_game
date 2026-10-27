// =====================================================================
//  STAGE 3 DATA (part 1): Greece (Olympos) and Norse (Asgard)
//  Trainers, lieutenants and god trials. Gods are portrayed respectfully,
//  as fictional ceremonial trials, using traditional depictions only.
// =====================================================================
// which cities exist in this build, how to unlock them, and where you arrive
const CITY_INFO = {
  india: { built: true, unlock: () => true, arrive: ['route', 12, 42, 'up'], god: 'Indra' },
  greece: { built: true, unlock: () => !!Game.flags.beatIndra, arrive: ['greece', 15, 27, 'up'], god: 'Zeus', needs: 'Pass Indra\'s trial in Indrapuri' },
  norse: { built: true, unlock: () => !!Game.flags.beatZeus, arrive: ['norse', 15, 27, 'up'], god: 'Odin', needs: 'Pass Zeus\'s trial in Olympos' },
  egypt: { built: false, unlock: () => false, god: 'Ra', needs: 'Pass Odin\'s trial in Asgard' },
  japan: { built: false, unlock: () => false, god: 'Amaterasu' },
  celtic: { built: false, unlock: () => false, god: 'The Dagda' },
  meso: { built: false, unlock: () => false, god: 'Marduk' },
  slavic: { built: false, unlock: () => false, god: 'Perun' },
};
function cityUnlocked(id) { const c = CITY_INFO[id]; return !!(c && c.built && c.unlock()); }

Object.assign(MOVES, {
  keraunos: { name: 'Keraunos Bolt', type: 'Storm', pow: 115, acc: 95, pp: 5, sig: true, fx: { stun: .3, breakShield: true } },
  gungnir: { name: 'Gungnir Cast', type: 'Sky', pow: 110, acc: 100, pp: 5, sig: true, sure: true, fx: { foe: { def: -1 }, foeCh: .3 } },
});
defSp('aetonyx', 'greece', 'Aetonyx', ['Sky', 'Storm'], [86, 96, 78, 98], 'mythic', 250, ['avian', 1.06, ['#f0e8d0', '#e8c040', '#ffffff', '#1a1a2a', '#ffff80', '#ffd84a'], 'bolts', ['crestTall', 'crown', 'tailFan']],
  'The great eagle that perches beside the king of the gods and carries his thunderbolts across the sky.', [[1, 'gust'], [1, 'thunderclap'], [1, 'garudadive'], [1, 'keraunos']], { bossOnly: true });
// keep the Bestiary order grouped by city
SPECIES_ORDER.splice(SPECIES_ORDER.indexOf('cyclite') + 1, 0, SPECIES_ORDER.pop());

Object.assign(TRAINERS, {
  // ---------- India: the remaining lieutenants of Indra ----------
  vayu: {
    name: 'Vayu', title: 'Lieutenant of Indra', look: 'vayu', team: [['kinnarel', 14], ['garudin', 15], ['gandharin', 15], ['kinnarel', 16]], reward: 70, music: 'boss', lieutenant: true, flag: 'beatVayu',
    confirm: 'A sudden wind fills the hall. Accept Vayu\'s challenge?',
    intro: ['VAYU: I am the wind that carries every breath and every prayer.', 'VAYU: The wind cannot be held - only met. Show me how your companions move with it!'],
    lose: 'VAYU: You bent like grass in the gale, and did not break. Well done.', after: ['VAYU: Breathe steady, Tamer. Varuna and the King await.'],
  },
  varuna: {
    name: 'Varuna', title: 'Lieutenant of Indra', look: 'varuna', team: [['makarin', 14], ['nagling', 15], ['makaraja', 16], ['nagaraja', 16]], reward: 70, music: 'boss', lieutenant: true, flag: 'beatVaruna',
    confirm: 'The floor ripples like a river. Accept Varuna\'s challenge?',
    intro: ['VARUNA: The cosmic waters remember every oath ever spoken.', 'VARUNA: Let the tide test whether your bond with your companions is true.'],
    lose: 'VARUNA: The waters run clear around you. Your oath holds.', after: ['VARUNA: Go with the current, Tamer.'],
  },
  // ---------- Greece (Olympos) ----------
  nikos: {
    name: 'Hoplite Nikos', title: 'Trainer', look: 'hoplite', team: [['minotot', 22], ['gorgling', 22], ['pegafoal', 23], ['chimerant', 23]], reward: 45, music: 'battle', flag: 'beatNikos',
    intro: ['Shields up! Every visitor to Olympos is tested at the gate.', 'My phalanx of four will not break so easily!'], lose: 'You broke my line fair and square. The lieutenants will want to meet you.',
  },
  kallisto: {
    name: 'Oracle Kallisto', title: 'Trainer', look: 'oracle', team: [['hydrelle', 23], ['gorgling', 23], ['pegafoal', 24], ['cerbepup', 24]], reward: 45, music: 'battle', flag: 'beatKallisto',
    intro: ['I foresaw a stranger arriving from the mist today.', 'The vapours did not say who would win. Let us find out!'], lose: 'Ah. That part of the prophecy was blurry. Congratulations!',
  },
  ares: {
    name: 'Ares', title: 'Lieutenant of Zeus', look: 'ares', team: [['minotot', 26], ['cerbepup', 26], ['chimerant', 27], ['cyclite', 28]], reward: 80, music: 'boss', lieutenant: true, flag: 'beatAres', bg: 'arena',
    requires: ['beatNikos', 'beatKallisto'], blocked: 'ARES: Come back when you have beaten the city\'s trainers, Hoplite Nikos and Oracle Kallisto.',
    confirm: 'The arena sand trembles. Accept the challenge of Ares?',
    intro: ['ARES: So, a challenger walks into my arena!', 'ARES: I test courage, not cruelty. Stand your ground and fight with all your heart!'],
    lose: 'ARES: Ha! You have the courage of a true champion. I salute you.', after: ['ARES: Courage is a fire. Keep it fed, Tamer.'],
  },
  poseidon: {
    name: 'Poseidon', title: 'Lieutenant of Zeus', look: 'poseidon', team: [['hydrelle', 26], ['pegafoal', 26], ['minotot', 27], ['hydrelle', 27], ['pegasorn', 28]], reward: 80, music: 'boss', lieutenant: true, flag: 'beatPoseidon', bg: 'sea',
    requires: ['beatNikos', 'beatKallisto'], blocked: 'POSEIDON: The sea is patient. Beat the city\'s trainers first, then return to my pier.',
    confirm: 'Waves crash against the pier. Accept the challenge of Poseidon?',
    intro: ['POSEIDON: The sea gives and the sea takes, little Tamer.', 'POSEIDON: My horses were born from the foam. Ride the waves with them, if you can!'],
    lose: 'POSEIDON: The tide turns in your favour. Sail on, with my blessing.', after: ['POSEIDON: When the sea is calm, remember who calmed it.'],
  },
  hades: {
    name: 'Hades', title: 'Lieutenant of Zeus', look: 'hades', team: [['gorgling', 26], ['hydrelle', 27], ['chimerant', 27], ['cerbepup', 29]], reward: 80, music: 'boss', lieutenant: true, flag: 'beatHades', bg: 'underworld',
    requires: ['beatNikos', 'beatKallisto'], blocked: 'HADES: Even the dead wait their turn. Beat the city\'s trainers, then knock again.',
    confirm: 'A cold, quiet wind blows from below. Accept the challenge of Hades?',
    intro: ['HADES: Few walk through my gate willingly. Fewer walk back out.', 'HADES: I keep the order of the deep places. Show me that you understand balance.'],
    lose: 'HADES: Balanced and fair. You may leave my halls whenever you wish.', after: ['HADES: Treat endings with respect, Tamer. They are also beginnings.'],
  },
  zeus: {
    name: 'Zeus', title: 'King of Olympos', look: 'zeus', team: [['pegasorn', 30], ['cyclite', 30], ['chimerant', 30], ['hydrelle', 31], ['cerbepup', 31], ['aetonyx', 33]], reward: 130, music: 'boss', god: true, flag: 'beatZeus', bg: 'olympos', sigSp: 'aetonyx',
    requires: ['beatAres', 'beatPoseidon', 'beatHades'], blocked: 'ZEUS: Prove yourself to my brothers and my son first - Ares, Poseidon and Hades.',
    confirm: 'Thunder rolls across the marble sky. Begin the Trial of Olympos?',
    intro: ['Lightning splits the clouds above the temple. The air smells of rain.', 'ZEUS: Traveller from the land of the monsoon. Indra speaks well of you.', 'ZEUS: On Olympos we honour hospitality, honesty and courage. Let your companions show all three.', 'ZEUS: Begin the trial of the sky!'],
    lose: 'ZEUS: The thunder bows to you today. You have earned the respect of Olympos.', after: ['ZEUS: The road north is open. Odin waits in Asgard, where the snow never melts.'],
    sigLine: 'Aetonyx spreads its wings. The Keraunos thunderbolt crackles in its talons!',
    ending: ['The storm clouds part and sunlight pours over the marble city.', 'ZEUS: Take the Aegis Seal, mark of Olympos.', 'You received the AEGIS SEAL!', 'The mist on the northern road thins. ASGARD can now be reached from the world map (Menu > TRAVEL).'],
  },
  // ---------- Norse (Asgard) ----------
  sigrun: {
    name: 'Shieldmaiden Sigrun', title: 'Trainer', look: 'shieldmaiden', team: [['fenrisk', 28], ['draugrim', 28], ['tanngrit', 29], ['huginix', 29]], reward: 50, music: 'battle', flag: 'beatSigrun',
    intro: ['Ho, traveller! Cold hands make strong shields.', 'Face my shield wall of four!'], lose: 'You fight like a winter storm. Go see the lieutenants!',
  },
  bjorn: {
    name: 'Skald Bjorn', title: 'Trainer', look: 'skald', team: [['ratatusk', 28], ['jormlet', 29], ['huginix', 29], ['tanngrit', 30]], reward: 50, music: 'battle', flag: 'beatBjorn',
    intro: ['Every battle deserves a song, and I need new verses!', 'Give me a battle worth singing about!'], lose: 'What a saga! I will sing of this for three winters.',
  },
  thor: {
    name: 'Thor', title: 'Lieutenant of Odin', look: 'thor', team: [['tanngrit', 31], ['ratatusk', 31], ['tanngrit', 32], ['draugrim', 32], ['fenrimaw', 33]], reward: 90, music: 'boss', lieutenant: true, flag: 'beatThor', bg: 'forge',
    requires: ['beatSigrun', 'beatBjorn'], blocked: 'THOR: Ha! Beat Sigrun and Bjorn first. Then my hammer will be warm.',
    confirm: 'Sparks leap from the anvil. Accept Thor\'s challenge?',
    intro: ['THOR: Welcome to my forge, small one! Mind the sparks.', 'THOR: I protect the people of Midgard from the cold and the giants. Show me you can protect your companions!'],
    lose: 'THOR: Ha ha! A mighty bout! You have the strength of a whole village.', after: ['THOR: My goats will be jealous. Go on, Tyr and Heimdall are waiting.'],
  },
  tyr: {
    name: 'Tyr', title: 'Lieutenant of Odin', look: 'tyr', team: [['fenrisk', 31], ['draugrim', 32], ['fenrisk', 32], ['fenrimaw', 34]], reward: 90, music: 'boss', lieutenant: true, flag: 'beatTyr', bg: 'oaths',
    requires: ['beatSigrun', 'beatBjorn'], blocked: 'TYR: An oath first: beat Sigrun and Bjorn. Then we fight.',
    confirm: 'The hall falls silent, as if waiting for a promise. Accept Tyr\'s challenge?',
    intro: ['TYR: In this hall, every word is an oath and every oath is kept.', 'TYR: Swear to battle fairly, and I will do the same.'],
    lose: 'TYR: You kept your word in every move. That is the rarest courage.', after: ['TYR: A promise kept is stronger than any wolf.'],
  },
  heimdall: {
    name: 'Heimdall', title: 'Lieutenant of Odin', look: 'heimdall', team: [['huginix', 32], ['ratatusk', 32], ['jormlet', 33], ['sleipra', 33]], reward: 90, music: 'boss', lieutenant: true, flag: 'beatHeimdall', bg: 'bifrost',
    requires: ['beatSigrun', 'beatBjorn'], blocked: 'HEIMDALL: I heard you coming a mile away. Beat Sigrun and Bjorn, then return to the bridge.',
    confirm: 'The rainbow bridge hums underfoot. Accept Heimdall\'s challenge?',
    intro: ['HEIMDALL: I can hear the grass growing and the snow settling.', 'HEIMDALL: Nothing crosses the bridge unwatched. Show me you are worthy to pass!'],
    lose: 'HEIMDALL: I saw that victory coming - and I am still impressed.', after: ['HEIMDALL: The bridge will always be open to you.'],
  },
  odin: {
    name: 'Odin', title: 'All-Father of Asgard', look: 'odin', team: [['huginix', 35], ['huginix', 35], ['fenrimaw', 36], ['draugrim', 36], ['jormlet', 36], ['sleipra', 38, ['gungnir', 'tempest', 'wingslash', 'tailwind']]], reward: 140, music: 'boss', god: true, flag: 'beatOdin', bg: 'valgrind', sigSp: 'sleipra',
    requires: ['beatThor', 'beatTyr', 'beatHeimdall'], blocked: 'ODIN: Wisdom has an order. Face Thor, Tyr and Heimdall first.',
    confirm: 'Two ravens circle the high seat. Begin the Trial of Asgard?',
    intro: ['Torches flicker in the great hall. Two ravens land on the high seat.', 'ODIN: I gave much to gain wisdom, young Tamer. My ravens told me of your journey.', 'ODIN: Here we test wisdom - knowing when to strike, and when to wait.', 'ODIN: Let the trial of the All-Father begin!'],
    lose: 'ODIN: Wise, and brave besides. My ravens will carry your name across all nine worlds.', after: ['ODIN: The road south to the desert is still veiled. Its trial will open in time.'],
    sigLine: 'Sleipra paws the floor with eight hooves. Gungnir, the spear that never misses, is raised!',
    ending: ['The torches flare gold and the ravens cry out together.', 'ODIN: Take the Raven Seal, sign of Asgard\'s respect.', 'You received the RAVEN SEAL!', 'The next road leads to HELIOPOLIS, the city of Ra. It is still sealed in this build (Stage 3, part 1) and opens in a later update.'],
  },
});
TRAINERS.rohan.look = 'pilgrim';
TRAINERS.agni.look = 'agni';
TRAINERS.indra.look = 'indra';
TRAINERS.indra.requires = ['beatVayu', 'beatVaruna'];
TRAINERS.indra.blocked = 'INDRA: First stand before Vayu and Varuna, who wait in this hall. Then the heavens will answer.';
TRAINERS.indra.sigSp = 'airavat';
TRAINERS.indra.confirm = 'The air hums with thunder. Begin the Trial of the Heavens?';
TRAINERS.agni.confirm = 'The sacred fire roars. Challenge Agni, Lieutenant of Indra?';
TRAINERS.agni.after = ['AGNI: Carry the flame with you. Vayu and Varuna wait inside Vaijayanta.'];
TRAINERS.indra.after = ['INDRA: The rains will follow you, Tamer.', 'Your seal opens the Mist Road. Use TRAVEL in the menu to visit other cities.'];
function makeTeam(tr) {
  return tr.team.map(([s, l, moves]) => { const c = newCreature(s, l); if (moves) c.moves = moves.map(id => ({ id, pp: MOVES[id].pp })); return c; });
}
