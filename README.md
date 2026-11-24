# ST Hero Calculator

Calculateur pour **Shop Titans** : il trouve le meilleur équipement (objets, éléments, esprits) et la meilleure combinaison de compétences pour une classe de héros, pour la **puissance** ou la **menace**.

- Versions : `index.html` (français) et `en.html` (anglais).
- Données : le [Shop Titans Data Spreadsheet](https://docs.google.com/spreadsheets/d/1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c) officiel, téléchargé par la page en 1 clic.
- Mise à jour : la page vérifie la version du sheet à l'ouverture, puis 1 fois par jour.

## Fonctions

- Optimiseur automatique (puissance ou menace) pour les 42 classes.
- **Mode manuel** : choix libre des objets, éléments, esprits et compétences, avec l'écart avec le meilleur build.
- Version de l'outil dans l'en-tête (clic = journal des modifications). Voir `CHANGELOG.md` / `CHANGELOG.en.md`.

## Utilisation

1. Téléchargez le zip dans **Releases**, puis décompressez-le.
2. Ouvrez `index.html` ou `en.html` dans le navigateur.
3. Cliquez sur **Télécharger les données**.

## Créer une release

Lancez `make_release.bat`. Le script reconstruit les pages (si Python est installé) et crée `release/STHeroCalculator-vX.Y.Z.zip` (version lue dans `tools/src/changelog.json`).

À chaque modification : ajoutez une entrée en tête de `tools/src/changelog.json` (français et anglais) et changez `version`.

## Structure

| Chemin | Rôle |
|---|---|
| `index.html`, `en.html` | Pages prêtes à l'emploi |
| `tools/src/template.html` | Modèle de la page (version française) |
| `tools/src/sheet.js` | Téléchargement et lecture du Google Sheet |
| `tools/src/game.json`, `atlas.json`, `uiatlas.json` | Données et images extraites du jeu |
| `tools/src/precomp.json` | Meilleurs builds pré-calculés |
| `tools/src/changelog.json` | Version de l'outil et journal des modifications (FR/EN) |
| `tools/build.py` | Construit `index.html` et `en.html` (textes anglais inclus) |
| `tools/precompute.py` | Recalcule les builds pré-calculés (Playwright + Chrome) |
| `tools/gamemap.py`, `sprites.py`, `atlas.py`, `ui_atlas.py` | Extraction depuis les fichiers du jeu |

Outil non officiel, sans lien avec Kabam. Shop Titans, ses noms et ses images appartiennent à Kabam.
