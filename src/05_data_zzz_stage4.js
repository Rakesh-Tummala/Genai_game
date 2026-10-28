// =====================================================================
//  STAGE 4 DATA: seven more playable characters (10 in total)
//  Each is an original character from one of the eight cultures, with a small perk.
// =====================================================================
CHARACTERS.push(
  { id: 'eleni', name: 'Eleni', home: 'Olympos', perk: 'heal', perkText: 'Healing items heal 20% more',
    story: 'A sponge-diver\'s daughter from the Aegean islands. She can hold her breath longer than anyone - and patch up anyone, too.',
    look: { hair: '#3a2014', skin: '#d8a880', outfit: '#2a5ab0', accent: '#ffffff', pants: '#f0e8d8', shoes: '#5a3a20', style: 'ponytail' } },
  { id: 'leif', name: 'Leif', home: 'Asgard', perk: 'orbs', perkText: 'Starts with 5 Bana and 2 Agneyastra Orbs extra',
    story: 'A trapper\'s son from the frozen north who always packs twice as much as he needs. Just in case.',
    look: { hair: '#e8c060', skin: '#f0c8a8', outfit: '#6a4a2a', accent: '#c8402a', pants: '#3a3a4a', shoes: '#2a1a10', style: 'braids' } },
  { id: 'amunet', name: 'Amunet', home: 'Heliopolis', perk: 'custom', perkText: '+1 custom attack per battle (4)',
    story: 'A temple scribe\'s apprentice who copies old stories by lamplight - and loves inventing brand-new ones.',
    look: { hair: '#1a1210', skin: '#b87a40', outfit: '#f8f0dc', accent: '#2a8a9a', pants: '#e8c040', shoes: '#8a6a30', style: 'short', band: true } },
  { id: 'haruto', name: 'Haruto', home: 'Takama', perk: 'crit', perkText: 'Your critical hits happen twice as often',
    story: 'A young swordsman who trains at dawn beneath the cherry trees and believes every strike should count.',
    look: { hair: '#1a1210', skin: '#f0d0b0', outfit: '#2a3a6a', accent: '#ffffff', pants: '#2a2a3a', shoes: '#1a1a1a', style: 'spiky' } },
  { id: 'orla', name: 'Orla', home: 'Tir na nOg', perk: 'money', perkText: '+25% coins from battles',
    story: 'A harper\'s granddaughter who plays in every market square and somehow always earns more than expected.',
    look: { hair: '#c84a1a', skin: '#f4d0b8', outfit: '#2a6a3a', accent: '#e8c040', pants: '#5a4a30', shoes: '#3a2a1a', style: 'braids' } },
  { id: 'iltani', name: 'Iltani', home: 'Babylon', perk: 'rare', perkText: 'Rare creatures appear more often',
    story: 'A stargazer from the river cities who reads the sky to know which nights bring rare creatures out of hiding.',
    look: { hair: '#1a1210', skin: '#c08a58', outfit: '#3a5a9a', accent: '#e8c050', pants: '#c8a878', shoes: '#6a4a28', style: 'long', band: true } },
  { id: 'mirko', name: 'Mirko', home: 'Kitezh', perk: 'energy', perkText: 'Companions get +4 max EN and regain EN faster',
    story: 'A blacksmith\'s son with endless energy. He once hammered horseshoes all night and still beat everyone at the morning race.',
    look: { hair: '#8a5a2a', skin: '#f0c8a8', outfit: '#c83a2a', accent: '#f0e8d8', pants: '#3a3a4a', shoes: '#2a1a10', style: 'short', cap: true } },
);
CHARACTERS.find(c => c.id === 'ira').home = 'Indrapuri';
CHARACTERS.find(c => c.id === 'tarun').home = 'Indrapuri';
CHARACTERS.find(c => c.id === 'saanvi').home = 'Indrapuri';
