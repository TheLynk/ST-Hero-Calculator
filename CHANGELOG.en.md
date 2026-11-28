# Changelog — ST Hero Calculator

## v1.9.6 — 2026-11-28

- Champion summary (Champions tab and Team and quests tab): each icon stays next to its value when the line wraps (before, the DEF icon could stay alone at the end of a line). Skill and aurasong effects are no longer cut in the middle (e.g. “+5 HP/round”).

## v1.9.5 — 2026-11-28

- Team and quests tab: the “Quest booster” menu becomes 3 buttons with the game icon (Power Booster, Super Power Booster, Mega Power Booster), like item quality. A 2nd click on the active button removes the booster. Name and effect show on hover.

## v1.9.4 — 2026-11-28

- Team and quests tab: game icons added. The “Best teams” and “Best champions” tables show each hero's class icon and the champion icon (new Champion column). The Heroes, Win, Rounds, Monster HP removed and Death risk columns have their icon, like the result cards (with the element barrier icon).

## v1.9.3 — 2026-11-28

- Flash quest calendar: the displayed start time now follows daylight saving time. Before, the hour list always used winter time; in summer it would have shown 1 hour less. Calendar dates and timers were already correct.

## v1.9.2 — 2026-11-28

- Flash quest calendar: the start time now shows only in your local time, with your time zone name (example: “Europe/Paris, UTC+1”). The confusing UTC time in brackets is no longer shown.

## v1.9.1 — 2026-11-28

- Flash quest calendar: simpler time setting. Enter the time left shown on the timer of the current flash quest (hours and minutes), then click “Set”: the tool finds the start time by itself. The hour list now shows your local time first, with UTC in brackets.

## v1.9.0 — 2026-11-28

- Ninja and Sensei power: new formula, taken from the game code (Character.CalculateRawEvasionPower and CalculateCriticalRatePower). The “until damaged” innate skill bonuses count ×0.5 for the Ninja and ×0.75 for the Sensei. Example Sibyle (Sensei): the tool computes 404,753, the game shows 404,730 (before: 455,145, +12%).
- Ninja and Sensei displayed evasion: it now includes the innate evasion bonus, like the game Info tab (Sibyle: 74%).
- The precomputed best builds of Ninjas and Senseis are recomputed with the new formula. Builds stored in your browser will be recomputed once.

## v1.8.5 — 2026-11-28

- Team and quests tab, result table: new Power column (saved game power, otherwise computed power with “≈” in front). Each column now has the game icon: power, ATK, DEF, HP, crit, evasion, threat, damage and death risk.

## v1.8.4 — 2026-11-28

- Team and quests tab: the power of each chosen hero shows next to its preset, with the total team power. The tool shows the game power saved in the preset; without it, it shows the computed power, with “≈” in front.

## v1.8.3 — 2026-11-28

- Screenshot import (heroes): the tool now finds the sheet when the evasion reading gets the “%” sign wrong (example: “48%” read as “489,”). The evasion is then marked in orange, to check.

## v1.8.2 — 2026-11-28

- Champions: power (star) now shows in the champion list, in the champion sheet and in the summary of the Team and quests tab. It counts the leader skill and the aurasong, like the game (Malady: 35,518 vs 35,516 in game).

## v1.8.1 — 2026-11-28

- Best champion gear, Barrier breaker mode: the tool now shows a variant with a little less element (at most −10) but more power. An “all elements” affinity (Cyberdragon X, Aura of Inspiration) gives only half the element bonus (+5 instead of +10, game constant affinity_all_bonus_mult = 0.5), but better stats.
- The fast ranking now counts spirit effects (+% DEF, +% crit, threat). The result is more accurate: Argon goes from 105,137 to 114,199 power in Power mode.

## v1.8.0 — 2026-11-28

- Champions tab: new “Best champion gear” calculator. For each champion, the tool looks for the best familiar and the best aurasong, with their element and spirit, for 3 goals: Power (default), Barrier breaker (highest element) or Fast (aurasong that cuts quest time the most). You choose the item quality and the max enchantment tier. The “Apply” button saves the gear in the champion sheet.
- Champion power: the tool computes power like the game, with the leader skill and the aurasong (Malady: 35,518 vs 35,516 in game).
- Aurasong and leader skill effects now show quest time, rest and XP (example: A.U.R.A. Assistant, −5% quest time).

## v1.7.11 — 2026-11-28

- Champions tab: seed help text fixed. Game version 26.12.0 is not out yet: it is only announced. With it, champions will appear in the seed list opened from the inventory. Until then, the “Find the seeds from the game stats” button is the only way to know their seeds.

## v1.7.10 — 2026-11-28

- Champions tab: seed help text updated. Since game version 26.12.0, champions appear in the seed list opened from the inventory (game bug fix). The seed counter of a champion is visible there.

## v1.7.9 — 2026-11-28

- Champions tab: new “Find the seeds from the game stats” button. The game does not show the seeds of a champion. The tool deduces them from the game HP, ATK and DEF, then fills the 3 fields. Example: Malady has 80 ATK, 65 DEF and 74 HP seeds.

## v1.7.8 — 2026-11-28

- Champions tab: new “Export all” and “Import” buttons. Export creates a backup file with all champions, hero presets and settings. Import replaces the browser data with the file data, then reloads the page (it also accepts old preset files).
- Heroes tab: the preset “Import” button also accepts this full backup file.

## v1.7.7 — 2026-11-28

- Champions: leader skill level fixed. The game does not cap this level at 3 without a titan soul (Hero.GetCurrentActiveSkillUid): it is 1 + the number of unlocked skill upgrades. At rank 11 a champion has skill 4/5 (gold icon), even without a titan soul. The simulator now uses the correct values (Rudo example: +50% crit instead of +40%).

## v1.7.6 — 2026-11-28

- Champions: the orange message “The simulator uses the game stats” no longer shows when the gap is green (under 1%).

## v1.7.5 — 2026-11-28

- Champions: exact computation. The tool uses the exact game level curve (CharacterData.ScaleStatToLevel: +1%, 2%, 3%, 4% per level up to level 40, then linear) with the game fixed-point numbers (0.01 is 0.0099945). Rank upgrades are no longer rounded, and the stats of each item are rounded to a whole number.
- Argon: 2,053 HP, 7,438 ATK, 15,573 DEF, element 135, exactly as in game (before: 7,440 ATK and 15,575 DEF).

## v1.7.4 — 2026-11-28

- Champions: champion collection card added (common +5%, rare +10%, mythic +25%, as for heroes).
- Checked on Argon (rank 11 +20, level 50, titan, 80 seeds of each, epic Avatar + Light Element, epic Aura Reactor, rare card): 2,053 HP, 7,440 ATK, 15,575 DEF, element 135. The game shows 2,053, 7,438, 15,573 and 135: 0.0% gap. Without the card, the gap was −9.1% on the 3 stats.

## v1.7.3 — 2026-11-28

- Champions: “Paragon soul” box. Without it, the level stops at 50. With it, the level goes up to 100 (game Paragon curve) and, at level 100, the leader skill gains 1 rank (upgPrgnlvl100 upgrade from the game data). Not checked in game yet.
- Champions: new “Stats shown in game” block. The tool compares its result with the game values and shows the gap for HP, ATK, DEF, evasion and element (green under 1%, yellow under 5%, red above). The champion list shows the largest gap.
- A box chooses whether the simulator uses the game values or the computed ones. Values already entered are still used.

## v1.7.2 — 2026-11-28

- Tabs aligned with the page content (same width and margin), with a separator line under the tabs.

## v1.7.1 — 2026-11-28

- New tab order: Hero, Champions, Team & quests.

## v1.7.0 — 2026-11-28

- New “Champions” tab: set each champion once (rank, reinforcements, level, titan soul, seeds, familiar, aurasong, corrected stats). Everything is saved in the browser.
- The list shows the 11 champions with their rank, level and computed stats. A champion that is not set uses the default values.
- Team & quests: just choose the champion. The simulator and “Best champion” use the saved settings. The “Edit this champion” button opens the Champions tab.
- Preset export and import also contain the champion settings.

## v1.6.6 — 2026-11-28

- Champion: ATK, DEF and HP seeds added (+4 ATK, +4 DEF, +1 HP per seed, as for heroes: the game stores seeds in the same record for heroes and champions). The tool keeps them for each champion.

## v1.6.5 — 2026-11-28

- Flash quests: the list shows the monster name (Gold Golem, Scholarly Harpy…), the day of the month and the starting level, in calendar order.
- New flash quest calendar with timers: live quest (time left) and next quests (time before the start). Tap a quest to simulate it.
- Days of the month taken from Kabam's version 12.0.0 release notes. Paragon Dungeon and Nullysium: every other weekend (to be confirmed). The start time is set once.
- Game icons for each flash quest. The Paragon Dungeon now has a real name (the French game text was a description).

## v1.6.4 — 2026-11-28

- Team & quests: game icons for the area, the champion, its leader skill, the titan soul, the familiar, the aurasong, the quality, the element and the spirit (icons extracted from the game files, tools/teamatlas.py tool).
- Champion: the lists are no longer cut. Each choice (item, quality, element, spirit) has its own line, and rank, reinforcements and level are on 2 columns.
- Computed champion stats shown with the HP, ATK, DEF, evasion and element icons.

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
