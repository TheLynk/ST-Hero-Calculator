# À tester et à vérifier

Ce fichier donne les règles de calcul que l'outil n'a pas encore vérifiées dans le jeu.
Chaque test dit quoi préparer, quoi faire, quoi noter et comment lire le résultat.

Mise à jour : 27/11/2026 · version 1.5.6 · tests 1, 2 et 3 vérifiés · version 1.5.8

---

## Règles communes à tous les tests

1. Utilisez un héros **au repos**. Il ne doit pas être en quête.
2. Changez **une seule chose** entre la capture « avant » et la capture « après ».
3. Pour chaque capture, notez ou capturez :
   - l'onglet **Infos** du héros : puissance, PV, ATQ, DEF, ESQ, élément ;
   - l'**info-bulle de l'ATQ** (touchez « ATQ ») : chances et dégâts critiques ;
   - la **fiche de l'objet testé** (touchez l'objet équipé) : ATQ, DEF, PV, élément.
4. Donnez aussi les réglages invisibles : **graines** (le « + » à côté de PV, ATQ et DEF), **niveau de la carte de collection**, **transcendance** et **starforge** de chaque objet.
5. Remettez ensuite le héros comme avant.

Le plus simple : exportez le preset du héros (bouton « Exporter ») et envoyez le fichier avec les captures.

---

## Tests prioritaires

### Test 1 — Idole : effet de l'esprit doublé ✅ VÉRIFIÉ le 27/11/2026

Vérifié sur PartoutV2 avec l'Idole primitive (T5), sans esprit puis avec un Esprit de lion :
- l'effet est doublé : +10 % ATQ et +2 % ESQ au lieu de +5 % et +1 % ;
- les stats de l'esprit (DEF, PV) ne sont pas doublées.

Outil : 275 073 → 281 365. Jeu : 275 065 → 281 356.

---

### Test 2 — Esprit de dinosaure dans la puissance ✅ VÉRIFIÉ le 27/11/2026

Le Dinosaure ne change pas l'ATQ affichée. Il compte pour **1/5** de son effet dans la puissance (pas pour moitié comme le Requin).
- PartoutV2, Idole primitive sans esprit puis avec Dinosaure (effet doublé par l'idole) : outil 281 326, jeu 281 317.
- Berserker Samson, Dinosaure sur le Canon tue-wyrm : écart de puissance outil +561, jeu +546.

À vérifier plus tard : les stats de Samson (PV et DEF trop bas dans l'outil, sans doute un esprit ou une qualité mal lus à l'import). Il faut les fiches des Poings croc-de-dragon, de l'Armure BIT.Runner et des Jambières feu-maudit.

---

### Test 3 — Synergie de l'arc (carquois + arc) ✅ VÉRIFIÉ le 27/11/2026

Vérifié sur Agatha (Baladin niv. 39), Grand Monarque (arc T13, supérieur) + Sac à cadeaux du Père Noël (carquois) :
- fiche de l'arc sans carquois : 1 745 ATQ = 930 × 1,25 × (1 + 0,50 « Maître archer ») ;
- fiche de l'arc avec carquois : 2 093 ATQ = 930 × 1,25 × (1 + 0,50 + **0,30**).

Le +30 % s'ajoute aux autres bonus d'objet de l'arc. Les stats du héros correspondent aussi (ATQ +916, DEF avec +90 % de défense).

Reste à tester : la même chose avec une **arbalète** (l'outil ne donne pas le +30 %).

---

### Test 4 — Carquois désactivé

**Ce que l'outil fait :** sans arc, arbalète ou fusil, le carquois ne donne rien : pas de stats, pas de valeur d'élément, pas d'effet d'esprit.

**Héros possibles :** **une de vos Sorceguerres** avec une **épée** ou un **bâton**, et un carquois dans le 6e emplacement. Autres classes : Samouraï, Daimyo, Ninja, Sensei, Druide, Archidruide, Mage, Archimage, Chevalier noir, Chevalier de la mort.

**Étapes :**
1. Équipez l'épée et le carquois (avec un élément et un esprit). Capture « avant ».
2. Enlevez le carquois. Capture « après ».

**Ce qu'il faut comparer :**
- PV, ATQ, DEF : ils doivent être **identiques** dans les 2 captures.
- **Valeur d'élément :** est-elle identique ? Sinon, le carquois désactivé compte encore pour l'élément.
- **Rang des compétences** (onglet Capacités) : identique ?
- Fiche du carquois : le jeu écrit-il « désactivé » ? Quelles stats montre-t-il ?

---

### Test 5 — Esprit né de la tombe : DEF trop basse

**Ce que l'outil fait :** l'esprit donne 133 DEF (valeur des fichiers du jeu), puis +20 % de bonus sur l'objet. Sur les Sabots du père Fouettard de PassePartout, la fiche montre **1 611 DEF**. L'outil calcule **1 592** (−19). L'ATQ de la même fiche est juste (801).

**Préparer :** l'Esprit né de la tombe sur un **autre objet avec de la DEF** : armure, casque, bottes, bouclier. Évitez un objet avec une petite stat de base (la limite élément + esprit peut cacher l'effet).

**Étapes :**
1. Fiche de l'objet **avec** l'Esprit né de la tombe : notez ATQ, DEF, PV.
2. Fiche du même objet avec un autre esprit T16 connu, ou sans esprit.
3. Notez les compétences du héros qui donnent un bonus d'objet (ex. Sorceguerre : +30 %).

**Ce que je vérifie :** la valeur réelle de DEF de l'esprit (133 ou environ 145), et si le +20 % agit pareil sur la DEF et sur l'ATQ.

---

### Test 6 — Esprit de Kirin

**Ce que l'outil fait :** le Google Sheet donne seulement « +10 % XP ». Les fichiers du jeu ajoutent un bonus d'attaque conditionnel de +25 %, comme le Dinosaure. L'outil ignore ce bonus.

**Étapes :** même méthode que le test 2, avec un Esprit de Kirin.

**Ce qu'il faut comparer :** si la puissance baisse d'environ 4 à 5 % sans le Kirin, alors que l'ATQ ne change pas, il faut ajouter le bonus.

---

### Test 7 — Esprit intégré T14 ou plus

**Ce que l'outil fait :** les stats d'un esprit intégré T14 ou plus sont ×2. Seul le cas T9 est vérifié (Décret de Mundra : ×1,5).

**Préparer :** un objet T14 à T16 avec un **esprit intégré** (le cadenas est sur la case de l'esprit dans la fiche).

**Étapes :** une seule capture de la **fiche de l'objet** suffit. Notez sa qualité.

**Ce que je vérifie :** la fiche montre ATQ, DEF, PV. Je calcule les 2 cas (×1,5 et ×2) et je garde celui du jeu.

---

## Tests de priorité moyenne

### Test 8 — Transcendance et limite élément + esprit

**Ce que l'outil fait :** élément + esprit ne dépassent pas 2 × (stat de base + bonus fixes de transcendance), sans la qualité.

**Préparer :** un objet **transcendé** avec une **petite** stat de base dans une stat (ex. bottes avec peu d'ATQ), avec un élément en affinité.

**Étapes :** capture de la fiche de l'objet. Indiquez le **niveau de transcendance**.

---

### Test 9 — Starforge

**Ce que l'outil fait :** le starforge ajoute un % à toute la stat de l'objet (base + enchantements).

**Étapes :** fiche d'un objet starforgé. Indiquez son % de starforge. Une 2e fiche du même objet non starforgé aide beaucoup.

---

### Test 9b — Chevalier de la mort R1 : DEF trop basse (−1,3 %)

**Constat :** avec le preset de R1 (niveau 39, 40 graines partout, carte niveau 1), l'outil donne DEF 10 353, le jeu 10 485. PV et ATQ sont justes (±0,3 %). Il manque environ 57 DEF « brute » (avant les % de défense).

**Causes possibles :** la DEF de base d'une classe promue au niveau 39, ou l'Esprit de Mundra intégré au Crâne de Mundra.

**Test :** déséquipez tous les objets de R1, capture de l'onglet Infos (comme le test sans objets de PartoutV2). Puis, si la base est juste, la fiche du Crâne de Mundra.

**Aussi à tester :** le seuil exact du grand bonus d'affinité (T10 ou T11 ? Vérifié : T9 = petit bonus, T12 = grand bonus).

---

### Test 10 — Classes avec ajustement de puissance

**Ce que l'outil fait :** la formule de puissance de ST Central a un ajustement pour ces classes : Ninja, Sensei, Samouraï, Daimyo, Baladin, Acrobate, Conquistador, Berserker, Jarl. Aucune n'est vérifiée.

**Étapes :** pour chaque classe disponible, une capture de l'onglet Infos + l'info-bulle de l'ATQ + le preset exporté.

**Ce que je vérifie :** si les stats sont justes et la puissance fausse, l'ajustement de cette classe est faux.

---

### Test 11 — Niveaux Paragon (51 à 100)

**Ce que l'outil fait :** les stats de base montent en ligne droite du niveau 50 au niveau 100.

**Étapes :** un héros Paragon, **sans aucun objet** (comme le test de PartoutV2 sans objets). Capture de l'onglet Infos. Indiquez son **niveau Paragon exact** : la fiche montre seulement 50.

---

### Test 12 — Niveaux bas

**Ce que l'outil fait :** courbe des fichiers du jeu du niveau 1 au niveau 40. Vérifiée seulement au niveau 39 (Albin) et 40.

**Étapes :** un héros de niveau 10 à 30, **sans aucun objet**. Capture de l'onglet Infos + son niveau + les graines + la carte.

---

### Test 13 — Bonus d'XP de guilde

**Ce que l'outil fait :** il l'ignore. Le test de PartoutV2 l'a confirmé : le Capuchon de réflexion change seulement les +300 % de « Super génie » en ATQ.

**À refaire seulement si** le jeu change le Capuchon de réflexion ou les bonus de guilde.

---

## Lecture des captures (import)

| # | Test | Quoi envoyer |
|---|---|---|
| 14 | Jeu en **anglais** | 1 capture de l'onglet Info et 1 de l'onglet Abilities, jeu réglé en anglais |
| 15 | Qualité **Impeccable** (bleu) et **Épique** (violet) | 1 capture d'un héros avec ces qualités. Dites quelle qualité a chaque objet |
| 16 | Objet de **feu** ou de **glace** lu avec une fausse qualité | Corrigé en 1.5.7 (Couronne pyroclastique, Kiku-Ichimonji). Envoyez une capture si le problème revient |
| 17 | **Esprits** presque identiques | Connu : l'Esprit de lion sur l'idole de PartoutV2 est lu « Bélier ». Si un esprit est mal lu : la capture et le bon esprit |
| 18b | **Traductions** : textes anglais restants dans la version française | Signalez la phrase et l'endroit (capture). Contrôle automatique fait le 27/11/2026 sur tous les effets |
| 18 | **Page publiée** en ligne | Ouvrez la page publiée, cliquez sur « Créer depuis des captures », et dites si un message d'erreur apparaît |

---

## Déjà vérifié dans le jeu

| Règle | Héros de test |
|---|---|
| Formule de puissance (ST Central) | Astromancien top 1, Sorceguerre PartoutV2 |
| Stats de base (fichiers du jeu, niveau 40) | Sorceguerre sans objets |
| Élément intégré : le Sheet ajoute déjà l'élément aux stats de base (106 stats) | Fichiers du jeu |
| Élément intégré et affinité T14+ : stats ×2 | 6 fiches d'objets de PartoutV2 |
| Affinité et intégré en dessous de T14 : ×1,5 | Racine de Mornefleche, Décret de Mundra (Albin) |
| Sorceguerre : ×1,5 sur tout le bonus des objets à élément intégré | PartoutV2 |
| Limite élément + esprit : 2 × la stat de base, sans la qualité | Sabots du père Fouettard, Couronne pyroclastique, Kiku-Ichimonji |
| Esprit né de la tombe : +20 % ajouté aux autres bonus d'objet (ATQ) | Sabots de PassePartout |
| « Dieu de la guerre ancien » : +250 % sur l'arme seulement | Kiku-Ichimonji de PassePartout |
| Capuchon de réflexion : 50 % de l'XP en ATQ, sans le bonus de guilde | PartoutV2 |
| Tisse-Sort : +15 % de puissance | Tisse-Sort B1 |
| Requin et Mundra : comptés pour moitié dans la puissance | Albin, avec et sans Requin |
| Carte de collection : niveau 1, 2 et 3 (×1,05, ×1,10, ×1,25) | Albin (niveau 2), PartoutV2 (niveau 1) |
| Graines : +4 ATQ par graine | PassePartout (12 graines) |
| Stats de base au niveau 39 | Albin |
| Affinité : +10 et stats ×2 dès le tier 12 | R1 (Abysse T12 sur Ténèbres millénaires) |
| Chevalier de la mort : +10 % de puissance (achève sous 10 % de PV) | R1 |
| Idole : effet de l'esprit doublé, stats de l'esprit non doublées | PartoutV2 + Idole primitive + Esprit de lion |
| Dinosaure : 1/5 de son effet dans la puissance | PartoutV2 (idole), Berserker Samson |
| Carquois + arc : +30 % de bonus d'objet sur l'arc, ajouté aux autres bonus | Agatha (Baladin), Grand Monarque |
