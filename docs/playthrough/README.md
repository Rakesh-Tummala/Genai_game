# MYTHBOUND Playthrough Guide

A complete walkthrough of MYTHBOUND v1.0, from choosing your Tamer to the eighth seal and the ending credits. Every screenshot was taken from the real game. The AI text (villager lines, custom attacks, lore and Mythic Forms) was written live by a local Ollama model, so your game will word these differently.

<p align="center"><img src="img/01_title.png" width="640" alt="Title screen"></p>

## Contents

1. [Before you start](#1-before-you-start)
2. [Starting a new game](#2-starting-a-new-game)
3. [How battles work](#3-how-battles-work)
4. [Taming creatures](#4-taming-creatures)
5. [Menus, shops and shrines](#5-menus-shops-and-shrines)
6. [Chapter 1: Indrapuri (India)](#6-chapter-1-indrapuri-india)
7. [The Mist Road](#7-the-mist-road)
8. [Chapter 2: Olympos (Greece)](#8-chapter-2-olympos-greece)
9. [Chapter 3: Asgard (Norse)](#9-chapter-3-asgard-norse)
10. [Chapter 4: Heliopolis (Egypt)](#10-chapter-4-heliopolis-egypt)
11. [Chapter 5: Takama (Japan)](#11-chapter-5-takama-japan)
12. [Chapter 6: Tir na nOg (Celtic)](#12-chapter-6-tir-na-nog-celtic)
13. [Chapter 7: Babylon (Mesopotamia)](#13-chapter-7-babylon-mesopotamia)
14. [Chapter 8: Kitezh (Slavic)](#14-chapter-8-kitezh-slavic)
15. [The ending and after](#15-the-ending-and-after)
16. [Quick reference](#16-quick-reference)

---

## 1. Before you start

**Two ways to play**

- **Offline:** open `mythbound.html` in a browser. Everything works. Custom attacks, villager lines, lore and Mythic Forms use the game's built-in offline text.
- **With AI:** run `node server.js` and open <http://localhost:8787>. For free local AI, see the main README's "Free local AI (Ollama)" section. The bottom-right of the title screen shows `AI: server mode` or `AI: offline mode`.

**Controls**

| Action | Keyboard | Touch |
|---|---|---|
| Move | Arrow keys / WASD | D-pad |
| Confirm, talk | Z, Enter, Space | A |
| Back, cancel | X, Backspace | B |
| Menu | Esc, C or M | MENU |
| Run | Hold Shift (or X) while walking | hold B |
| Mute | N | music-note button |

During long text, hold Z to speed it up. You can also raise **Text speed** in Options.

---

## 2. Starting a new game

Press Z on the title screen and choose **NEW GAME**.

<p align="center"><img src="img/02_title_menu.png" width="49%" alt="Title menu"> <img src="img/03_character_select.png" width="49%" alt="Character select"></p>

### Choosing your Tamer

There are 10 Tamers. The story is the same for all of them; only the sprite, backstory and **perk** change.

| Tamer | From | Perk | Good for |
|---|---|---|---|
| Ira | Indrapuri | +10% taming chance | Filling the Bestiary |
| Tarun | Indrapuri | +10% experience | Less grinding |
| Saanvi | Indrapuri | 15% shop discount | Buying lots of orbs and potions |
| Eleni | Olympos | Healing items heal 20% more; revives restore 60% | Tough god fights |
| Leif | Asgard | Starts with 5 extra Bana Orbs and 2 Agneyastra Orbs | A fast early team |
| Amunet | Heliopolis | 4 custom attacks per battle instead of 3 | Players who love custom attacks |
| Haruto | Takama | Critical hits happen twice as often | Fast, aggressive fights |
| Orla | Tir na nOg | +25% coins from battles | Money for orbs and items |
| Iltani | Babylon | Uncommon and rare creatures appear more often | Finding rare creatures |
| Mirko | Kitezh | Companions get +4 max EN and regain EN faster | More custom attacks and big moves |

**Recommendation:** for a first run, pick **Tarun** (less grinding) or **Ira** (easier taming). This guide plays as Ira.

### The story begins

A short intro tells you about the eight mythic cities. Then Elder Bhaskar asks you to choose your first companion.

<p align="center"><img src="img/04_story_intro.png" width="49%" alt="Story intro"> <img src="img/05_starter_choice.png" width="49%" alt="Starter choice"></p>

### Choosing a starter

| Starter | Type | Evolves into (Lv 16) | Notes |
|---|---|---|---|
| Yalicub | Ember | Yalidhar | Strong attacker. Weak to Tide and Stone. |
| **Makarin** | **Tide** | **Makaraja** | High Defense. Strong against Agni, the first lieutenant (Ember). |
| Vanarling | Grove | Vanaveer | Hits Tide and Stone hard. Weak to Sky and Ember. |

**Recommendation:** **Makarin**. Its Tide moves are super effective against Agni's fire team, and Makaraja stays useful against the many Ember and Stone creatures later on. This guide uses Makarin.

You wake up in the Elder's House. Talk to Elder Bhaskar (face him and press Z): he gives you **5 Bana Orbs and 3 Soma Drops** and points you south to the Monsoon Trail.

<p align="center"><img src="img/07_elder_talk.png" width="640" alt="Elder Bhaskar"></p>

---

## 3. How battles work

Walking through tall grass starts **wild battles**. Trainers start **trainer battles** when they spot you or when you talk to them.

<p align="center"><img src="img/11_wild_battle.png" width="640" alt="Battle screen"></p>

**The battle menu**

| Option | What it does |
|---|---|
| FIGHT | Use one of your companion's moves (up to 4). Each move has PP (uses). |
| CUSTOM | Type your own attack idea. The AI (or the offline interpreter) turns it into a move. |
| BAG | Use an item. |
| TAME | Throw an orb at a wild creature (not in trainer battles). |
| SWITCH | Swap to another companion. This uses your turn. |
| RUN | Escape a wild battle (not trainer battles). |

**Bars:** HP (health), **EN** (energy, spent by custom attacks and some strong moves; it refills slowly) and XP.

<p align="center"><img src="img/12_moves.png" width="640" alt="Move list"></p>

### Types

There are 8 types plus Neutral. Super-effective hits deal 2x damage, resisted hits 0.5x. A move matching its user's type gets a 1.5x bonus (STAB).

| Attacking type | Strong against (2x) | Weak against (0.5x) |
|---|---|---|
| Sky | Grove | Stone, Storm |
| Tide | Ember, Stone | Tide, Grove |
| Ember | Grove, Shade | Tide, Ember, Stone |
| Grove | Tide, Stone | Sky, Ember, Grove |
| Stone | Sky, Ember, Storm | Tide, Grove |
| Shade | Light | Stone, Shade |
| Light | Shade | Light, Storm |
| Storm | Sky, Tide | Grove, Storm (**no effect on Stone**) |

**What beats what** (handy for boss fights):

| To beat... | Use |
|---|---|
| Sky | Stone, Storm |
| Tide | Storm, Grove |
| Ember | Tide, Stone |
| Grove | Sky, Ember |
| Stone | Tide, Grove |
| Shade | Ember, Light |
| Light | Shade |
| Storm | Stone |

### Custom attacks

Choose **CUSTOM** and type any idea (up to 120 characters), for example *"Summon a monsoon wave that crashes down and shields me"*. A text box pops up over the game for typing. Press Enter to send it.

A **preview card** shows what you would get: name, type, effects with star ratings, accuracy, EN cost, cooldown and how many custom attacks you have left. Choose **Confirm** to use it or **Cancel** to keep your turn (no use is spent).

<p align="center"><img src="img/13_custom_preview.png" width="49%" alt="Custom attack preview"> <img src="img/14_custom_attack_used.png" width="49%" alt="Custom attack used"></p>

Rules to know:

- **3 per battle** (4 for Amunet), with a cooldown between uses, and each one costs EN.
- The game, not the AI, sets every number. A **power budget** grows with your companion's level; at low levels ratings are scaled down (the red note in the preview).
- No instant wins: a custom hit can never deal more than half of the target's max HP. Ideas like "instantly win" get low ratings.
- The move's type must be one of your creature's types or Neutral.
- Good uses: shields, stat drops on a boss, burn/poison on a bulky foe, or sleep/bind before taming.

---

## 4. Taming creatures

Weaken a wild creature, then choose **TAME** and pick an orb. The orb shakes up to three times. If it holds, the creature joins you.

<p align="center"><img src="img/15_taming_orb.png" width="49%" alt="Orb shaking"> <img src="img/16_tame_success.png" width="49%" alt="Tamed"></p>

**Improve your odds:**

- Lower its HP (red HP gives the best chance).
- Give it a status: **sleep doubles the chance**; bind, stun, burn or poison give 1.5x.
- Common creatures are easier than rare ones.
- Use a better orb.

| Orb | Price | Notes |
|---|---|---|
| Bana Orb | 100 | Basic orb. |
| Agneyastra Orb | 400 | Better than Bana. |
| Varunastra Orb | 500 | Very strong against Ember creatures. |
| Vayavyastra Orb | 500 | Very strong against Sky creatures. |
| Nagastra Orb | 500 | Very strong on sleeping or bound targets. |
| Gandiva Orb | 1200 | Very high rate. Sold after you beat Agni. |
| Brahmastra Orb | not sold | Never fails. Only one exists (Indra gives it to you). Save it for a rare creature. |

### Mythic Forms

Every tamed creature awakens a **Mythic Form**: a title (like "the Hill-Songstress") and a small stat tilt (one stat up, another down). With AI on, the title is written by the AI.

<p align="center"><img src="img/17_mythic_form.png" width="640" alt="Mythic Form"></p>

Your party holds 6. Extra creatures go to the **Sanctum Stone** in any healing shrine, where you can swap them in and out.

---

## 5. Menus, shops and shrines

Press **Esc / C / M** to open the menu. It shows your coins, seals, tamed count, play time and the AI status.

<p align="center"><img src="img/18_start_menu.png" width="49%" alt="Start menu"> <img src="img/19_party.png" width="49%" alt="Party"></p>

- **PARTY:** view companions, reorder them (MOVE UP), and open **SUMMARY** for stats, moves and lore.
- **BESTIARY:** all 70 creatures grouped by city. Press Z on a tamed creature for **expanded lore** (written by the AI when it's on).
- **TRAVEL:** the world map (appears after your first seal; use it outdoors).
- **BAG**, **SAVE**, **OPTIONS** (text speed, music and sound volume, mute, Bestiary preview).

<p align="center"><img src="img/20_summary.png" width="49%" alt="Summary"> <img src="img/23_ai_lore.png" width="49%" alt="AI lore"></p>

<p align="center"><img src="img/22_bestiary_entry.png" width="49%" alt="Bestiary entry"> <img src="img/24_bag.png" width="49%" alt="Bag"></p>

**Shops** sell orbs and items. **Shrines** heal your whole party for free and hold the Sanctum Stone. If every companion faints, you wake up at the last shrine you used.

<p align="center"><img src="img/25_shop_menu.png" width="49%" alt="Shop"> <img src="img/26_shrine.png" width="49%" alt="Shrine"></p>

| Item | Price | Effect |
|---|---|---|
| Soma Drop | 200 | Restores 30 HP. |
| Tulsi Leaf | 150 | Cures one status (burn, poison or sleep first). |
| Ganga Jal | 600 | Cures every status of every companion. Battle only. |
| Kavach Charm | 350 | Sharply raises the active companion's Defense. Battle only. |
| Akshaya Patra Meal | 400 | Restores all PP and EN. |
| Sanjivani Herb | 1000 | Revives a fainted companion with half HP. |
| Amrita Vial | 1500 | Full HP and cures status. |

**Remember to SAVE** from the menu. The title screen shows your save's name, seals, tamed count and time.

---

## 6. Chapter 1: Indrapuri (India)

<p align="center"><img src="img/08_indrapuri.png" width="640" alt="Indrapuri"></p>

**Indrapuri** is your home city:

- Vaijayanta Palace is in the north.
- The Fire Hall of Agni is on the west side of the plaza.
- The Bazaar (shop) and the lotus pond are in the middle, and the Shrine of Dhanvantari is nearby.
- The south gate leads to the **Monsoon Trail**.

Talk to the villagers. Some of them (like Chotu) speak with AI-written lines.

<p align="center"><img src="img/09_ai_npc_dialogue.png" width="640" alt="AI villager line"></p>

**Order of the trial:** Pilgrim Rohan, then Agni, then Vayu and Varuna (either order), then Indra.

### The Monsoon Trail

<p align="center"><img src="img/10_monsoon_trail.png" width="640" alt="Monsoon Trail"></p>

- **First grass (Lv 3-7):** Nagling, Kinnarel, Gandharin, Vetalix, Garudin.
- **Sacred Grove (blue-green grass further south, Lv 10-16):** the same creatures plus wild Yalicub, Makarin and Vanarling.
- **Pickups:** 2 Soma Drops, 1 Agneyastra Orb, 2 Nagastra Orbs, 1 Akshaya Patra Meal (look for the glowing items).

**Who to tame first:**

- **Garudin** (Sky/Light) for Sky moves against Grove.
- **Nagling** (Tide/Shade), which evolves into Nagaraja.
- **Vanarling** (Grove) from the Sacred Grove, for Grove moves.

Aim for four or five companions before Agni.

### Pilgrim Rohan (trainer)

Rohan waits by the river and stops you when he sees you. Team: Nagling 7, Kinnarel 7, Vetalix 8, Gandharin 8. **Suggested level: 9-10.**

<p align="center"><img src="img/27_rohan_intro.png" width="49%" alt="Rohan"> <img src="img/28_rohan_battle.png" width="49%" alt="Rohan battle"></p>

### Agni, Lieutenant of Indra (Fire Hall)

The Fire Hall's acolytes let you in once you have beaten Rohan.

- **Team:** Yalicub 11, Garudin 11, Vetalix 12, Yalidhar 14 (mostly **Ember**).
- **Bring:** Tide (Makarin) and Stone.
- **Suggested level:** 14-15.
- **Reward:** the Bazaar starts selling the Gandiva Orb.

<p align="center"><img src="img/29_agni_intro.png" width="49%" alt="Agni"> <img src="img/30_agni_battle.png" width="49%" alt="Agni battle"></p>

### Vayu and Varuna (inside Vaijayanta Palace)

The palace guards let you in after Agni.

| Lieutenant | Team | Main types | Bring |
|---|---|---|---|
| Vayu | Kinnarel 14, Garudin 15, Gandharin 15, Kinnarel 16 | Sky, Grove, Light | Stone, Storm |
| Varuna | Makarin 14, Nagling 15, Makaraja 16, Nagaraja 16 | Tide, Shade | Grove, Storm |

**Suggested level: 17-18.** Your starter evolves at Lv 16.

<p align="center"><img src="img/31_palace_vayu.png" width="640" alt="Vayu"></p>

### Indra's trial (god)

After Vayu and Varuna, approach the throne.

- **Team:** Garudin 18, Gandharin 18, Nagaraja 19, Makaraja 19, and **Airavat 21** (Storm/Light), his sacred elephant.
- **Signature move:** Airavat's *Vajra Thunderbolt*.
- **Bring:** Stone against Airavat and Garudin; Grove or Storm against the Tide creatures.
- **Suggested level:** 21-22, plus a few Soma Drops.

<p align="center"><img src="img/33_indra_intro.png" width="49%" alt="Indra intro"> <img src="img/34_indra_battle.png" width="49%" alt="Indra battle"></p>

<p align="center"><img src="img/35_indra_signature.png" width="49%" alt="Vajra Thunderbolt"> <img src="img/36_indra_seal.png" width="49%" alt="Vajra Seal"></p>

**Rewards:**

- The **Vajra Seal**, which opens the Mist Road.
- The **Brahmastra Orb**, the only orb that never fails.

<p align="center"><img src="img/37_brahmastra.png" width="640" alt="Brahmastra Orb"></p>

---

## 7. The Mist Road

Open the world map with **Menu > TRAVEL** (outdoors) or by walking through a city's south gate. In Indrapuri, the sealed rocks at the end of the Monsoon Trail lead there. Each god you beat clears the mist to the next city, and you can return to any unlocked city at any time.

<p align="center"><img src="img/38_world_map.png" width="640" alt="World map"></p>

**City order:** Indrapuri > Olympos > Asgard > Heliopolis > Takama > Tir na nOg > Babylon > Kitezh.

**Every new city has the same layout:**

| Where | What |
|---|---|
| North, centre | The god's temple (the final trial) |
| North-west and north-east | Two lieutenant halls |
| South-east pier or bridge | The third lieutenant |
| West / east | Shop and healing shrine |
| South | Two trainers near the grass; the south gate opens the world map |

**Order in each city:**

1. Beat both trainers.
2. Beat the three lieutenants (any order).
3. Face the god.

Each city's wild creatures appear in its two grass zones. Taming a few local creatures gives you fresh types for that city's bosses.

---

## 8. Chapter 2: Olympos (Greece)

<p align="center"><img src="img/city_greece.png" width="640" alt="Olympos"></p>

White marble agora, olive leaves in the wind. **Wild:** Lv 16-22 (Pegafoal, Gorgling, Minotot, Hydrelle, Chimerant, Cerbepup), and Lv 22-27 in the second grass (adds Cyclite).

| Battle | Team | Main types | Bring |
|---|---|---|---|
| Hoplite Nikos | Minotot 22, Gorgling 22, Pegafoal 23, Chimerant 23 | mixed | your best |
| Oracle Kallisto | Hydrelle 23, Gorgling 23, Pegafoal 24, Cerbepup 24 | mixed | your best |
| Ares (Arena of Ares) | Minotot 25, Cerbepup 25, Chimerant 26, Cyclite 27 | Stone, Ember | Tide, Grove |
| Poseidon (pier) | Hydrelle 25, Pegafoal 25, Minotot 26, Hydrelle 26, Pegasorn 27 | Tide, Shade, Sky | Storm |
| Hades (Gate of Hades) | Gorgling 25, Hydrelle 26, Chimerant 26, Cerbepup 28 | Shade, Stone, Ember | Tide, Light |

### Zeus's trial (Temple of Zeus)

- **Team:** Pegasorn 28, Cyclite 28, Chimerant 28, Hydrelle 29, Cerbepup 29, **Aetonyx 31** (Sky/Storm), his eagle.
- **Signature move:** *Keraunos Bolt*.
- **Bring:** Stone for Aetonyx and Pegasorn; Tide for Cyclite and Chimerant.
- **Suggested level:** 34-36. In testing, a Lv 32 team lost and a Lv 37 team won.
- **Reward:** the Aegis Seal, which opens Asgard.

<p align="center"><img src="img/god_greece_intro.png" width="49%" alt="Zeus"> <img src="img/god_greece_signature.png" width="49%" alt="Keraunos Bolt"></p>

---

## 9. Chapter 3: Asgard (Norse)

<p align="center"><img src="img/city_norse.png" width="640" alt="Asgard"></p>

A snowy log town with turf roofs, a frozen lake and the rainbow bridge. **Wild:** Lv 22-28 (Huginix, Ratatusk, Fenrisk, Draugrim, Tanngrit), and Lv 28-33 in the second grass (adds Jormlet, Sleipra, Fenrimaw).

| Battle | Team | Main types | Bring |
|---|---|---|---|
| Shieldmaiden Sigrun | Fenrisk 28, Draugrim 28, Tanngrit 29, Huginix 29 | mixed | your best |
| Skald Bjorn | Ratatusk 28, Jormlet 29, Huginix 29, Tanngrit 30 | mixed | your best |
| Thor (Thunder Forge) | Tanngrit 30, Ratatusk 30, Tanngrit 31, Draugrim 31, Fenrimaw 32 | Stone, Storm | Tide, Grove |
| Tyr (Hall of Oaths) | Fenrisk 30, Draugrim 31, Fenrisk 31, Fenrimaw 33 | Shade, Stone | Ember, Light |
| Heimdall (rainbow bridge) | Huginix 31, Ratatusk 31, Jormlet 32, Sleipra 32 | Sky | Stone, Storm |

### Odin's trial (Valgrind)

- **Team:** Huginix 34, Huginix 34, Fenrimaw 35, Draugrim 35, Jormlet 35, **Sleipra 37** (Sky/Storm).
- **Signature move:** *Gungnir Cast*, which **never misses**.
- **Bring:** Stone for Sleipra and the ravens, Ember or Light for the Shade creatures, and healing items.
- **Suggested level:** 40-42. Odin is the hardest early god.
- **Reward:** the Raven Seal.

<p align="center"><img src="img/god_norse_intro.png" width="49%" alt="Odin"> <img src="img/god_norse_signature.png" width="49%" alt="Gungnir Cast"></p>

---

## 10. Chapter 4: Heliopolis (Egypt)

<p align="center"><img src="img/city_egypt.png" width="640" alt="Heliopolis"></p>

Sandstone streets, the pylon Temple of Ra and the Nile. **Wild:** Lv 26-32 (Scarabix, Uraeling, Sobeken, Bennuling, Ammitar, Sphinxel), and Lv 32-36 (adds Apepling).

| Battle | Team | Main types | Bring |
|---|---|---|---|
| Scribe Nefer | Scarabix 32, Uraeling 32, Bennuling 33, Sobeken 33 | mixed | your best |
| Charioteer Khafra | Sobeken 33, Ammitar 33, Sphinxel 34, Scarabix 34 | mixed | your best |
| Anubis (Tomb of Anubis) | Ammitar 35, Scarabix 36, Sphinxel 36, Uraeling 36, Ammitar 37 | Stone, Light | Tide, Grove, Shade |
| Sekhmet (Hall of Sekhmet) | Sphinxel 36, Bennuling 36, Uraeling 37, Sphinxel 38 | Light, Stone, Ember | Shade, Tide |
| Set (sun-barque pier) | Apepling 36, Sobeken 37, Ammitar 37, Apepling 38 | Shade, Tide | Storm, Ember |

### Ra's trial (Temple of Ra)

- **Team:** Sphinxel 39, Uraeling 39, Scarabix 40, Sobeken 40, Ammitar 40, **Bennurah 41** (Ember/Light).
- **Signature move:** *Solar Barque*.
- **Bring:** Tide (great against Bennurah and the Stone creatures) and Shade for the Light creatures.
- **Suggested level:** 44-45.
- **Reward:** the Sun Seal.

<p align="center"><img src="img/god_egypt_battle.png" width="49%" alt="Ra battle"> <img src="img/god_egypt_signature.png" width="49%" alt="Solar Barque"></p>

---

## 11. Chapter 5: Takama (Japan)

<p align="center"><img src="img/city_japan.png" width="640" alt="Takama"></p>

Curved roofs, the Sun Shrine and falling cherry blossoms. **Wild:** Lv 30-35 (Kitsunko, Kappling, Tanukin, Chochibi, Tengumi, Raikitt), and Lv 35-38 (adds Ryugo, Kyubirei).

| Battle | Team | Main types | Bring |
|---|---|---|---|
| Shrine Maiden Hana | Kitsunko 36, Chochibi 36, Kappling 37, Tanukin 37 | mixed | your best |
| Ronin Kenji | Tengumi 37, Raikitt 37, Tanukin 38, Ryugo 38 | mixed | your best |
| Tsukuyomi (Moon Hall) | Chochibi 39, Tanukin 40, Kitsunko 40, Chochibi 41, Kyubirei 42 | Ember, Shade | Tide |
| Raijin (Hall of Thunder) | Raikitt 40, Tengumi 40, Raikitt 41, Ryugo 42 | Storm | Stone |
| Susanoo (pier) | Ryugo 39, Raikitt 40, Kappling 40, Ryugo 41 | Tide, Storm | Grove, Stone |

### Amaterasu's trial (Sun Shrine)

- **Team:** Kitsunko 43, Tengumi 43, Kappling 43, Ryugo 44, Chochibi 44, **Kyubirei 45** (Ember/Light).
- **Signature move:** *Sacred Mirror Ray*, which **never misses**.
- **Bring:** Tide for Kyubirei and the fire creatures, and Stone for the Storm creatures.
- **Suggested level:** 48-50.
- **Reward:** the Mirror Seal.

<p align="center"><img src="img/god_japan_intro.png" width="49%" alt="Amaterasu"> <img src="img/god_japan_signature.png" width="49%" alt="Sacred Mirror Ray"></p>

---

## 12. Chapter 6: Tir na nOg (Celtic)

<p align="center"><img src="img/city_celtic.png" width="640" alt="Tir na nOg"></p>

Thatched halls, a loch and heather. **Wild:** Lv 34-39 (Selkin, Sidhel, Pookin, Keenwail, Kelpling, Cusith), and Lv 38-42 (adds Hartwyn, Selkara).

By now your team will be close to the **level cap (50)**. From here on, type matchups and items matter more than levels.

| Battle | Team | Main types | Bring |
|---|---|---|---|
| Bard Ciaran | Sidhel 40, Selkin 40, Pookin 41, Kelpling 41 | mixed | your best |
| Druid Aisling | Cusith 41, Keenwail 41, Sidhel 42, Hartwyn 42 | mixed | your best |
| The Morrigan | Keenwail 43, Pookin 43, Cusith 44, Keenwail 45 | Shade | Ember, Light |
| Lugh | Sidhel 43, Hartwyn 44, Selkara 44, Sidhel 44, Hartwyn 45 | Light, Grove | Shade, Ember, Sky |
| Manannan (pier) | Selkin 43, Kelpling 44, Selkara 45, Kelpling 45 | Tide | Storm, Grove |

### The Dagda's trial (Hall of the Dagda)

- **Team:** Cusith 46, Selkara 46, Kelpling 46, Pookin 46, Keenwail 47, **Hartwyn 47** (Grove/Light).
- **Signature move:** *Harp of Seasons*, which **heals Hartwyn as it hits**. Use your strongest attacks so its healing can't keep up.
- **Bring:** Ember (against Hartwyn and the Shade creatures) and Storm for the Tide creatures.
- **Suggested level:** 50.
- **Reward:** the Harp Seal.

<p align="center"><img src="img/god_celtic_intro.png" width="49%" alt="The Dagda"> <img src="img/god_celtic_signature.png" width="49%" alt="Harp of Seasons"></p>

---

## 13. Chapter 7: Babylon (Mesopotamia)

<p align="center"><img src="img/city_meso.png" width="640" alt="Babylon"></p>

Mud-brick streets, the blue Ishtar Gate and the ziggurat Esagila. **Wild:** Lv 36-40 (Apkalu, Lamassel, Humbabo, Girtab, Anzoo, Mushush), and Lv 40-44 (adds Lamassar).

| Battle | Team | Main types | Bring |
|---|---|---|---|
| Scribe Ludin | Apkalu 43, Lamassel 43, Girtab 44, Humbabo 44 | mixed | your best |
| Archer Ishmi | Anzoo 43, Girtab 44, Mushush 44, Lamassel 44 | mixed | your best |
| Ishtar (Gate of Ishtar) | Anzoo 45, Mushush 46, Lamassar 46, Gugalan 47 (the Bull of Heaven) | Storm, Stone, mixed | Stone, Tide |
| Nergal (Hall of Nergal) | Girtab 45, Mushush 46, Girtab 46, Humbabo 47 | Stone, Shade | Tide, Grove, Ember |
| Enlil (river pier) | Anzoo 46, Apkalu 46, Anzoo 47, Lamassar 47, Humbabo 47 | Sky, Storm, Stone | Stone, Tide |

### Marduk's trial (Esagila)

- **Team:** Lamassar 48, Anzoo 48, Girtab 48, Apkalu 48, Humbabo 48, **Mushush 49** (Ember/Shade).
- **Signature move:** *Seven Winds*.
- **Bring:** Tide (Mushush and the Stone creatures) and a full bag of healing items. His team covers almost every type.
- **Suggested level:** 50.
- **Reward:** the Star Seal.

<p align="center"><img src="img/god_meso_intro.png" width="49%" alt="Marduk"> <img src="img/god_meso_signature.png" width="49%" alt="Seven Winds"></p>

---

## 14. Chapter 8: Kitezh (Slavic)

<p align="center"><img src="img/city_slavic.png" width="640" alt="Kitezh"></p>

Carved log houses, onion domes and birch woods in autumn. **Wild:** Lv 38-42 (Domovik, Vodyan, Kikimor, Zharling, Rusalin, Leshko), and Lv 42-46 (adds Zmeyok, Zharplume).

| Battle | Team | Main types | Bring |
|---|---|---|---|
| Hunter Bogdan | Leshko 45, Zharling 45, Kikimor 46, Zmeyok 46 | mixed | your best |
| Weaver Milena | Rusalin 45, Domovik 45, Vodyan 46, Kikimor 46 | mixed | your best |
| Svarog (Forge of Svarog) | Zharling 47, Domovik 48, Zmeyok 48, Zharplume 49 | Ember, Light | Tide, Shade |
| Mokosh (Hall of Mokosh) | Domovik 47, Leshko 48, Rusalin 48, Kikimor 48, Leshko 49 | Shade, Grove | Ember |
| Veles (river pier) | Vodyan 47, Rusalin 47, Leshko 48, Zmeyok 49 | Tide, Grove, Shade | Ember, Storm |

### Perun's final trial (Oak Hall of Perun)

- **Team:** all Lv 50: Zmeyok, Leshko, Vodyan, Domovik, Rusalin and **Zharplume** (Ember/Light).
- **Signature move:** *Thunder Axe*.
- **Bring:** a balanced Lv 50 team (Tide against Zharplume, Ember against Leshko and the Shade creatures), Amrita Vials and Sanjivani Herbs. Save custom attacks for Defense drops or shields on Zharplume.
- **Reward:** the Oak Seal, the last of the eight.

<p align="center"><img src="img/god_slavic_intro.png" width="49%" alt="Perun"> <img src="img/god_slavic_battle.png" width="49%" alt="Zharplume"></p>

<p align="center"><img src="img/god_slavic_signature.png" width="49%" alt="Thunder Axe"> <img src="img/god_slavic_all_seals.png" width="49%" alt="All eight seals"></p>

---

## 15. The ending and after

Beating Perun plays the **credits**: your eight seals, your companions with their Mythic Forms, and your Bestiary progress. Hold Z to scroll faster.

<p align="center"><img src="img/credits_a.png" width="49%" alt="Credits"> <img src="img/credits_b.png" width="49%" alt="Thank you for playing"></p>

The world stays open afterwards. Every city can be visited from the Mist Road, so you can keep taming and fill all 70 Bestiary entries.

<p align="center"><img src="img/39_world_map_all.png" width="640" alt="World map, all cities"></p>

---

## 16. Quick reference

### All eight trials

| # | City | God | Signature creature | Seal | Suggested level |
|---|---|---|---|---|---|
| 1 | Indrapuri (India) | Indra | Airavat (Storm/Light) | Vajra | 21-22 |
| 2 | Olympos (Greece) | Zeus | Aetonyx (Sky/Storm) | Aegis | 34-36 |
| 3 | Asgard (Norse) | Odin | Sleipra (Sky/Storm) | Raven | 40-42 |
| 4 | Heliopolis (Egypt) | Ra | Bennurah (Ember/Light) | Sun | 44-45 |
| 5 | Takama (Japan) | Amaterasu | Kyubirei (Ember/Light) | Mirror | 48-50 |
| 6 | Tir na nOg (Celtic) | The Dagda | Hartwyn (Grove/Light) | Harp | 50 |
| 7 | Babylon (Mesopotamia) | Marduk | Mushush (Ember/Shade) | Star | 50 |
| 8 | Kitezh (Slavic) | Perun | Zharplume (Ember/Light) | Oak | 50 |

The suggested levels come from simulated runs. A careful player with good type matchups can win a few levels lower.

### General tips

- **Heal before every lieutenant and god.** Shrines are free.
- **Use the bench.** Companions who don't fight still earn a third of the XP, so a full party of 6 levels up together.
- **Rotate your lead creature** in wild battles to spread XP.
- **Tame locally.** Each city's grass has creatures whose types match up well against the next bosses.
- **Custom attacks are best for support:** shields, Defense or Attack drops on a boss, sleep before taming.
- **Save often**, especially before a god.
