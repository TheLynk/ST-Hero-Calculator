# Changelog — ST Hero Calculator

## v1.6.3 — 2026-11-28

- Champion: real game rank (rank 1 to 11 + reinforcements, for example 11 +18), level and titan soul.
- Champion: familiar and aurasong can be equipped, with quality, element and spirit. The tool computes HP, ATK, DEF, evasion and element with the game rule (Hero.GetUpgradeForStory code): level base + rank upgrades × story stat (× 1.5 with titan), each reinforcement adds +5%.
- The aurasong also gives its quest bonus (it replaces the separate aurastone choice).
- The “Correct the stats” fields are still available and replace the computed values. The tool keeps all the settings of each champion.

## v1.6.2 — 2026-11-28

- Team & quests: the champion stats (HP, ATK, DEF, evasion, element) are now always visible. Copy the champion Info tab from the game. The tool keeps them for each champion, and “Best champion” uses them.
- Champion: evasion added. The stat estimate is still used when the fields are empty, but it ignores reinforcements and the familiar.
- First test compared with the game (Elysium Hard, boss, Yami): the 4 faces are the same, and the barrier gives the same total (458 / 260).

## v1.6.1 — 2026-11-28

- Team & quests: each hero's rating is also shown with the game face (purple D, red C, orange B, yellow A, green S, sunglasses SSS). Images extracted from the game files (tools/faces.py tool). The “Best team” and “Best champion” rankings also show the face of the hero most at risk.

## v1.6.0 — 2026-11-27

- New “Team & quests” tab: combat simulation of a team of 3 or 4 heroes (your presets) and a champion, against a quest (Easy to Extreme), a boss, a flash quest or the Lost City of Gold. Result: win rate, rounds, death risk and rating per hero, damage of each hero, barrier shattered or not.
- Combat rules taken from the game code (Quest.DoCombat), read without running the game: attack order, area attacks, target by threat, DEF effect, evasion and accuracy, critical hits, elemental barrier (−80%), class abilities (Samurai, Daimyo, Dancer, Ninja, Sensei, Berserker, Lord, Cleric, Conquistador, Dark Knight, Chronomancer), champion leader skills, aurastones, ATK boosters and mini-bosses.
- “Best team” (all combinations of your presets) and “Best champion” (the 11 champions for the chosen team) buttons.
- Quest, champion and modifier data extracted from the game files (tools/simdata.py tool).

## v1.5.10 — 2026-11-27

- Items with a built-in spirit (Mundra) with an added element: the element counts ×1.5, and element + spirit do not go above the item's sheet stat (base + built-in spirit). Checked on Mundra's Skull + Oblivion: 864 DEF and 97 HP in game, 863 and 97 in the tool (before: 809 and 89). Rule taken from one item only: to be confirmed.
- The stored best builds are recalculated.

## v1.5.9 — 2026-11-27

- Affinity, fix of 1.5.8: from tier 12 the element value does get +10, but stats stay ×1.5 up to tier 13. Stats ×2 start at tier 14. Checked on the Darkness Millennium sheet (Abyssal T12): 3,289 ATK and 138 HP, like the game.
- The stored best builds are recalculated.

## v1.5.8 — 2026-11-27

- Affinity: the big bonus (+10 element value, stats ×2) starts at tier 12, not tier 14. Checked with the Abyssal Element (T12) on Darkness Millennium: element 220 like the game.
- Dark Knight and Death Knight: power counts +10% for “defeat any enemy below 10% HP”. Checked on R1: 138,802 vs 138,964 (before: −9.2%).
- The stored best builds are recalculated.

## v1.5.7 — 2026-11-27

- Screenshot reading: the “Death Knight” class was read as “Knight”. On a tie, the page now keeps the longest class name. With the right class, the 6 items are recognized.
- Screenshot reading: quality is more reliable. A dark edge or the item's own color (ice sword, fire item) is no longer read as a quality glow. Tested on 10 screenshots: all known qualities are right.

## v1.5.6 — 2026-11-27

- Power: Dinosaur Spirit (+25% Attack on the first round) counts at 1/5, not at half. Checked in game on a Spellknight (Dinosaur on an idol: 281,326 vs 281,317) and on a Berserker.
- Idol: spirit effect doubled, checked in game (Lion Spirit: 281,365 vs 281,356).
- Berserker and Jarl: conditional attack bonuses also enter the rage adjustment of the power formula.
- Optimizer: it now uses exactly the same stat rules as the manual mode (affinity ×2 or ×1.5, element + spirit limit, built-in spirits). Before, the search still used the old rules.
- French version: 24 effects were still in English. They are translated.
- French version: item affinities show in French.
- The stored best builds are recalculated.

## v1.5.5 — 2026-11-27

- Quiver: without a bow, crossbow or gun, the quiver is disabled and gives nothing (game rule). The tool no longer suggests a quiver with a sword.
- Quiver with a bow: “Bow Synergy”, +30% item bonus on the bow (value from the game files).
- Idol: the effect of the enchanted spirit is doubled (game text).
- Dinosaur Spirit: counted at half in power, like Shark Spirit (same effect in the game files).
- The stored best builds are recalculated.

## v1.5.4 — 2026-11-24

- Affinity, built-in element and built-in spirit: stats ×2 for a T14+ enchantment, ×1.5 below (checked on Bleakspire Roots and Mundra's Decree).
- Power: Shark Spirit (+20% Attack when the enemy is below 50% HP) and Mundra's Spirit (+20% Attack and Defense against bosses) count at half. Checked in game on a Geomancer, with and without Shark: 47,688 vs 47,684, and 46,312 vs 46,307.
- The optimizer now takes these spirits into account. The stored best builds are recalculated.

## v1.5.3 — 2026-11-24

- Fateweaver: power now includes the +15% bonus of the innate skill (“Chaos Control”). Checked in game: 150,227 vs 150,211 (before: −13%).

## v1.5.2 — 2026-11-24

- Element + spirit limit fixed: at most 2 × the item base stat, without quality. Checked on a 2nd Spellknight hero: HP and the sheets of the 6 items match the game.
- The stored best builds are recalculated with this rule.

## v1.5.1 — 2026-11-24

- Calculation fixed and checked on 2 real Spellknight builds and on the sheet of 7 items: the power gap goes from −0.8% to 0.0%.
- Items with a built-in element: the Google Sheet adds the built-in element to the item base stats. The tool now uses the game stats, then adds the doubled element.
- Element + spirit: their stats do not go above 2 × the item base stat.
- Spellknight: the +50% bonus multiplies the whole bonus of items with a built-in element (×1.5).
- The stored best builds are recalculated with these rules.
- Screenshot reading: 7 is no longer read as 1, empty slots are detected, a sheet without items is read, skill rarity is more reliable.

## v1.5.0 — 2026-11-24

- New “Create from screenshots” button in presets: the page reads one or more game screenshots and fills the manual mode.
- Info tab: class (Paragon name too), level, hero name, power, HP, ATK, DEF, EVA, element, the 6 items with their quality, element and spirit, and the skills.
- Abilities tab and collection card: skills and card level.
- Uncertain fields show in orange. Check them before you save.
- Everything stays in the browser. The text reader (Tesseract.js) is in the ocr.js file, loaded only at the first reading. Drag and drop and Ctrl+V work.

## v1.4.0 — 2026-11-24

- Hero presets in manual mode: 41 slots, the maximum number of heroes in Shop Titans.
- A preset keeps the hero name, the class, the settings (level, quality, transcendence, starforge, seeds, card, base stats, sources), the manual build and the game values.
- Game values (power, HP, ATK, DEF, EVA, element): the % gap shows under each stat of the manual build.
- Export and import of all presets in a .json file (backup or computer change).

## v1.3.1 — 2026-11-24

- Fix: an empty yellow bar was shown under the header when the tool was up to date.

## v1.3.0 — 2026-11-24

- Tool update from GitHub: the page compares its version with the TheLynk/ST-Hero-Calculator repository at start-up, then once a day.
- When a new version exists: banner with the list of changes, download button for the latest release zip and link to GitHub.
- "Check for tool updates" button in the changelog, and GitHub link in the header.

## v1.2.0 — 2026-11-24

- Starforge icon next to the "Starforged items" option.
- Animation during the calculation: spinning star, blinking numbers and progress bar, then an effect when the result appears. The animation is off if the system asks for reduced motion.
- Artifact icon on artifact items (Thinkin' Cap, Kiku-Ichimonji…).

## v1.1.2 — 2026-11-24

- Fix: an element built into an item counts as an affinity (+10 element value at tier 14, enchantment stats ×2). Checked on a real Spellknight: gap with the game from 12% to less than 1%.
- The 168 stored best builds are recomputed with this fix.

## v1.1.1 — 2026-11-24

- Manual mode: quality choice for each item (normal to legendary), with its icon.

## v1.1.0 — 2026-11-24

- Version number shown in the page header.
- Changelog (French and English) in the page and in the CHANGELOG files.
- Manual mode: free choice of items, elements, spirits and skills, compared with the best build.

## v1.0.0 — 2026-11-24

- Standalone tool in a zip: the page downloads the official Google Sheet itself in 1 click.
- Sheet version check at start-up, then once a day. "Update" button when a new version exists.
- make_release.bat script to create the zip of a GitHub release.

## v0.9.0 — 2026-11-24

- 168 precomputed best builds: result in less than one second.
- Computed builds stored in the browser.
- 5th skill slot added automatically at Paragon 50.

## v0.8.0 — 2026-11-24

- Game icons: power, HP, ATK, DEF, EVA, elements, skills, quality, seeds, XP, sources, Paragon.
- French skill names and effects.
- Collection card: choice of level 0 to 3.

## v0.7.0 — 2026-11-24

- English version (en.html) and French version (index.html).
- Item images and class icons.
- Class picker by family, with base / promoted class button.

## v0.6.0 — 2026-11-24

- Exact base stats of each class (game data, levels 1, 40, 50 and Paragon).
- Artifact skills (e.g. Thinkin' Cap: XP → ATK).
- Top 1 build reproduced within 0.05%.

## v0.5.0 — 2026-11-24

- Exact item stat formula: transcendence, starforge, affinities.
- Better optimizer (changes of 2 items at a time).

## v0.4.0 — 2026-11-23

- Seeds, collection card, hero base stats.
- HP / ATK / DEF / EVA / ELEMENT row like in the game.

## v0.3.0 — 2026-11-23

- Power objective (ST Central formula), in addition to threat.

## v0.1.0 — 2026-11-23

- First version: best gear for maximum threat.
