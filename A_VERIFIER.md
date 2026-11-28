# À tester et à vérifier

Ce fichier donne les règles de calcul que l'outil n'a pas encore vérifiées dans le jeu.
Chaque test dit quoi préparer, quoi faire, quoi noter et comment lire le résultat.

Mise à jour : 27/11/2026 · version 1.5.6 · tests 1 à 7 faits · version 1.5.8

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

### Test 4 — Carquois désactivé ✅ VÉRIFIÉ le 27/11/2026

Vérifié sur Agatha (Baladin niv. 39) avec un instrument (pas d'arc, d'arbalète ni de fusil), avec puis sans le Sac à cadeaux du Père Noël enchanté (élément Air) :
- puissance 20 713, PV 303, ATQ 2 898, DEF 8 404, ESQ 35 % : identiques dans les 2 captures ;
- **valeur d'élément 70 identique** : l'élément du carquois désactivé ne compte pas non plus.

L'outil fait exactement cela : un carquois désactivé ne donne ni stats, ni élément, ni effet d'esprit.

---

### Test 5 — Esprit né de la tombe ✅ VÉRIFIÉ le 27/11/2026

Vérifié sur R1 (Chevalier de la mort) avec le Manteau royal de Sia (T15, normal, Oubli), sans esprit puis avec l'Esprit né de la tombe :

| Fiche du manteau | Outil | Jeu |
|---|---|---|
| Sans esprit | 1 039 DEF · 91 PV | 1 039 · 91 ✓ |
| Avec l'Esprit né de la tombe | 1 406 DEF · 157 PV | 1 406 · 157 ✓ |

- Les stats de l'esprit sont bien 200 / 133 / 40 (fichiers du jeu).
- Son +20 % agit sur toute la stat de l'objet (base + élément + esprit) et s'ajoute aux autres bonus d'objet.
- Puissance du héros : écart outil +2 610, jeu +2 604.

**Reste inexpliqué (priorité basse) :** sur les Sabots du père Fouettard de PassePartout, la fiche montre 1 611 DEF et l'outil 1 592. L'ATQ de la même fiche est juste. À revoir si un autre objet donne un écart.

---

### Test 6 — Esprit de Kirin ✅ VÉRIFIÉ le 27/11/2026

Vérifié sur Albin (Géomancien) avec le Chapeau de tacticien (T7, normal), sans esprit puis avec l'Esprit de Kirin (T12) :
- fiche du chapeau : 120 → 189 DEF (+69, la DEF de l'esprit) ;
- héros : DEF 3 479 → 3 578, ATQ et PV identiques ;
- puissance : 45 287 → 45 422 (+135). Les +99 DEF expliquent seuls ces +135.

Le bonus d'attaque conditionnel du Kirin (présent dans les fichiers du jeu) **ne compte pas** dans la puissance. L'outil l'ignore déjà : rien à changer.

---

### Test 7 — Esprit intégré ✅ FAIT le 27/11/2026 (Crâne de Mundra corrigé en 1.5.10)

Dans le jeu, **tous** les esprits intégrés sont l'Esprit de Mundra (T9), sur 10 objets. Il n'existe aucun esprit intégré T12 ou plus : la règle « ×2 dès T12 » ne s'applique jamais aux esprits intégrés.

Objets T14 à T16 avec l'Esprit de Mundra intégré :

| Objet | Type · Tier | ATQ | DEF | PV |
|---|---|---|---|---|
| Crâne de Mundra | Casque · T14 | 0 | 699 | 56 |
| Décret de Mundra | Parchemin · T15 | 2 205 | 475 | 0 |
| Lance de Cristal de Mundra | Lance · T16 | 1 405 | 0 | 0 |

(Stats du Google Sheet : elles contiennent déjà l'esprit ×1,5.)

Le Décret de Mundra (T15) est déjà vérifié : esprit ×1,5 (Albin).

**Résultat du 27/11/2026 — écart trouvé :** fiche du Crâne de Mundra de R1 (normal, Oubli) : **864 DEF et 97 PV**. L'outil donne 809 DEF et 89 PV (+55 DEF et +8 PV dans le jeu).

- Ces +55 DEF expliquent presque toute la DEF qui manque à R1 (environ 57, test 9b).
- Aucune règle simple ne donne en même temps 864 et 97 : ×1,5 sur l'élément et l'esprit donne bien 864 DEF, mais 106 PV.
- Sur le Décret de Mundra (T15), l'esprit intégré est exact (×1,5). Le Crâne (T14) ne suit pas la même règle.

**Suite (27/11) :** la fiche de Ténèbres millénaires (3 289 ATQ, 138 PV) montre que l'Abysse T12 donne +10 de valeur mais seulement ×1,5 sur les stats. Corrigé en 1.5.9.

Avec les vraies stats du Crâne (864 DEF, 97 PV), R1 devient exact en PV (1 556 contre 1 554) et en DEF (10 480 contre 10 485). **Le Crâne de Mundra est donc la seule cause.**

**Suite (27/11, site officiel) :** le site officiel donne 699 DEF et 56 PV pour le Crâne. Ce sont les mêmes valeurs que les données de l'outil. L'hypothèse « stats de base changées » est donc **fausse**. L'écart vient d'une règle du jeu.

Calcul (base 650 DEF / 41 PV, Oubli T14 : 109 DEF / 33 PV, Esprit de Mundra ×1,5 : 49,5 DEF / 15 PV) :

| Hypothèse | DEF | PV |
|---|---|---|
| Outil (Oubli ×1) | 809 | 89 |
| Oubli ×1,5 | 863 ✓ | 105,5 ✗ |
| Oubli ×1,5, et l'élément ne dépasse pas la base de l'objet (PV : 41) | 863 ✓ | 97 ✓ |
| Jeu | 864 | 97 |

Seule la 3e ligne donne les 2 chiffres. Mais elle utilise 2 règles inconnues, sur 1 seul objet. Je ne change pas l'outil avant un 2e exemple.

**27/11 — fiches des plans de 8 objets de Mundra (sans élément) :** toutes égales aux données de l'outil, à 1 point près (arrondi : Égide 560/559, Tabard 136/135, Amulette 106/105). L'esprit intégré ×1,5 est donc juste sur tous les objets de Mundra. Ces fiches ne testent pas un élément ajouté.

**Test 7b ✅ (27/11) :** fiche du Crâne **ordinaire sans élément** : 700 DEF, 56 PV (= données). Avec Oubli : 864 DEF, 97 PV. L'Oubli ajoute donc +164 DEF (109 × 1,5) et +41 PV (et non 49,5).

- La règle « élément ≤ base » est fausse : elle casse les Sabots du père Fouettard de PartoutV2 (vérifiés).
- Règle retenue en **1.5.10**, seulement pour les objets à esprit intégré (Mundra) : élément ajouté ×1,5, et élément + esprit ≤ stat de la fiche (base + esprit intégré). Résultat : 863 DEF / 97 PV.
- Héros déjà vérifiés : inchangés (PartoutV2, idole, Albin, Tisse-Sort).
- **Reste à confirmer :** un 2e objet de Mundra fabriqué avec un élément (Égide, Lance, Remède…), si vous en avez un un jour.

**ATQ de R1 (−242) :** l'écart correspond exactement à 10 graines d'ATQ. Vérifier si R1 a 50 graines d'ATQ au lieu de 40.

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

### Test 14 — Simulation de quête (onglet « Équipe et quêtes », v1.6.0)

**Ce que l'outil fait :** il rejoue le combat avec les règles du code du jeu (`Quest.DoCombat`, lu sans lancer le jeu), 1 000 fois. Le jeu fait la même chose 50 fois pour la note de la quête.

**Règles reprises du jeu :**

- Le monstre attaque en premier, puis les héros dans l'ordre de l'équipe.
- Attaque de zone (si l'équipe a 2 héros vivants ou plus) : chance « aoeOdds » ; sinon une cible tirée au sort selon la menace.
- Dégâts reçus × multiplicateur de DEF : 1 + (DEF cible − DEF) / (2 × DEF cible), entre 0,5 et 2. Au-delà de 2 × la DEF cible : 50 % → 30 % → 25 %. Un coup critique ne descend jamais sous ×1.
- Esquive : esquive − précision de la quête, 75 % max (78 % Éclaireur).
- Barrière non brisée : −80 % de dégâts. Les éléments des héros vivants sont additionnés à chaque tour.
- Classes : Samouraï et Daimyo (1er tour), Danseur et Acrobate (critique après une esquive), Ninja et Sensei, Berserker et Jarl, Seigneur (protège un allié), Clerc et Évêque (survit une fois), Conquistador, Chevalier noir et de la mort (achève sous 10 %), Chronomancien et Tisse-Sort (2e essai).
- Champion : compétence de chef selon le rang, Mercenaire +25 %, Bjorn ×2 en quête éclair, Ashley ×2 contre un boss, Hemma (absorbe des PV).

**Ce qui n'est pas encore vérifié :**

1. Les stats des champions : l'outil ne sait pas les calculer (renforcements, familier). Recopiez l'onglet Infos du champion.
4. Le bouclier de mana des objets n'est pas compté.

**Étapes :**

1. Dans le jeu, préparez une quête avec 3 ou 4 héros enregistrés en presets dans l'outil.
2. Faites une capture de l'écran de préparation de la quête, avec la note de chaque héros (les visages de couleur).
3. Dans l'outil, ouvrez « Équipe et quêtes ». Choisissez la même zone, la même difficulté, le même champion (rang, niveau) et les mêmes héros.
4. Envoyez-moi la capture du jeu et la capture du résultat de l'outil.

**Ce que je vérifie :** la note de chaque héros dans le jeu doit correspondre au risque de mort de l'outil.

**Résultat 1 (28/11, Elysium Difficile, boss Avatar, champion Yami) : ✅ 4 visages sur 4 identiques**, avec les vraies stats de Yami.

| Héros | Jeu | Outil |
|---|---|---|
| B1 (Tisse-Sort) | vert | S (7 %) |
| PartoutV2 (Sorceguerre) | jaune | A (35 %) |
| Yami | vert | S (1 %) |
| PassePartout (Sorceguerre) | vert | S (2 %) |

- Barrière : le jeu affiche 458 / 260. L'outil trouve 263 pour les héros + 195 pour Yami = 458. ✓ Les Sorceguerres (« tous éléments ») comptent bien pour 50 %, et l'élément du champion compte en entier.
- Les stats estimées des champions étaient fausses (Yami : 7 134 ATK au lieu de 13 546). Elles dépendent des renforcements et du familier. Depuis la 1.6.2, recopiez l'onglet Infos du champion.
- Encore utile : une quête où un héros a un visage orange, rouge ou violet. Une quête facile (tous verts) et une quête difficile (au moins un héros en danger) sont les plus utiles.

### Test 15 — Stats des champions (v1.6.3)

**Ce que l'outil calcule** (code du jeu, `Hero.GetUpgradeForStory`) :

- base du niveau (même courbe que les héros) ;
- + somme des améliorations de rang × stat d'histoire du champion, × 1,5 avec l'âme de titan ;
- au-delà du rang 11, chaque renfort (+N) répète la dernière amélioration (+5 %) ;
- + familier et chant d'aura, avec qualité, élément et esprit (mêmes règles que les objets des héros) ;
- élément = valeur du rang (125 dès le rang 20) + éléments des objets.

**Déjà juste :** élément de Lilu (125) et niveau de compétence (4/5 au rang 11 avec titan).

**Étapes :**

1. Ouvrez un champion dans le jeu, onglet Infos.
2. Touchez le familier et le chant d'aura. Notez l'objet, la qualité, l'élément et l'esprit.
3. Entrez la même chose dans l'outil (rang, renforts, niveau, titan, familier, chant d'aura).
4. Comparez la ligne « Calcul » avec PV, ATQ, DEF, ESQ et élément du jeu.

**Ce que je vérifie :** les 5 valeurs doivent être égales à ±1 %. Lilu (Avatar seul) : 887 PV et 8 594 DEF sans le chant d'aura, contre 916 et 10 359 dans le jeu. Il manque donc le chant d'aura et les enchantements.

### Test 16 — Minuteurs des quêtes éclair (v1.6.5)

**Ce qui est sûr :** les jours du mois (notes de version 12.0.0 de Kabam) et le niveau de départ (données du jeu).

**Ce qui est à confirmer :**

1. L'heure de début. Elle n'est pas dans les fichiers du jeu. L'outil prend 00:00 UTC (01:00 en France en hiver).
2. Donjon Parangon et Nullysium : 1 week-end sur 2, dès le 14/11/2026, 48 h (source : Gemini).

**Étapes :**

1. Dans le jeu, ouvrez la quête éclair en cours (aujourd'hui : Champion d'Anubis, ou le Roi du Bling).
2. Notez le temps restant.
3. Comparez avec le minuteur de l'outil. S'il y a un écart d'heures entières, changez « Heure de début » et dites-moi la bonne valeur.
4. Pour le Donjon Parangon : notez le jour et l'heure de fin.

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
| Objet à esprit intégré + élément : élément ×1,5, élément + esprit ≤ stat de la fiche | Crâne de Mundra + Oubli (1 seul objet) |
| Esprit né de la tombe : +20 % ajouté aux autres bonus d'objet (ATQ) | Sabots de PassePartout |
| « Dieu de la guerre ancien » : +250 % sur l'arme seulement | Kiku-Ichimonji de PassePartout |
| Capuchon de réflexion : 50 % de l'XP en ATQ, sans le bonus de guilde | PartoutV2 |
| Tisse-Sort : +15 % de puissance | Tisse-Sort B1 |
| Requin et Mundra : comptés pour moitié dans la puissance | Albin, avec et sans Requin |
| Carte de collection : niveau 1, 2 et 3 (×1,05, ×1,10, ×1,25) | Albin (niveau 2), PartoutV2 (niveau 1) |
| Graines : +4 ATQ par graine | PassePartout (12 graines) |
| Stats de base au niveau 39 | Albin |
| Affinité T12 : valeur d'élément +10, stats ×1,5 (stats ×2 seulement dès T14) | R1, fiche de Ténèbres millénaires (Abysse T12) |
| Chevalier de la mort : +10 % de puissance (achève sous 10 % de PV) | R1 |
| Idole : effet de l'esprit doublé, stats de l'esprit non doublées | PartoutV2 + Idole primitive + Esprit de lion |
| Dinosaure : 1/5 de son effet dans la puissance | PartoutV2 (idole), Berserker Samson |
| Carquois + arc : +30 % de bonus d'objet sur l'arc, ajouté aux autres bonus | Agatha (Baladin), Grand Monarque |
| Carquois sans arc, arbalète ou fusil : aucune stat, aucune valeur d'élément | Agatha (Baladin) avec un instrument |
| Esprit né de la tombe : 133 DEF, 40 PV, +20 % sur toute la stat de l'objet | R1, Manteau royal de Sia |
| Esprit de Kirin : seulement ses stats, aucun bonus d'attaque dans la puissance | Albin, Chapeau de tacticien |
