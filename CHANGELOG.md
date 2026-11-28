# Journal des modifications — ST Hero Calculator

## v1.8.2 — 2026-11-28

- Champions : la puissance (étoile) s'affiche maintenant dans la liste des champions, dans la fiche du champion et dans le résumé de l'onglet Équipe et quêtes. Elle compte la compétence de chef et le chant d'aura, comme le jeu (Maladie : 35 518 contre 35 516 en jeu).

## v1.8.1 — 2026-11-28

- Meilleur équipement des champions, mode Briseur de barrière : l'outil propose maintenant une variante avec un peu moins d'élément (au plus −10) mais plus de puissance. Une affinité « tous éléments » (Cyberdragon X, Aura d'inspiration) ne donne que la moitié du bonus d'élément (+5 au lieu de +10, constante du jeu affinity_all_bonus_mult = 0,5), mais de meilleures stats.
- Le tri rapide compte maintenant les effets des esprits (+% DEF, +% crit, menace). Le résultat est plus juste : Argon passe de 105 137 à 114 199 de puissance en mode Puissance.

## v1.8.0 — 2026-11-28

- Onglet Champions : nouveau calculateur « Meilleur équipement des champions ». Pour chaque champion, l'outil cherche le meilleur familier et le meilleur chant d'aura, avec leur élément et leur esprit, selon 3 objectifs : Puissance (par défaut), Briseur de barrière (élément le plus haut) ou Rapide (chant d'aura qui réduit le plus le temps de quête). Vous choisissez la qualité des objets et le tier max des enchantements. Le bouton « Appliquer » enregistre l'équipement dans la fiche du champion.
- Puissance des champions : l'outil calcule la puissance comme le jeu, avec la compétence de chef et le chant d'aura (Maladie : 35 518 contre 35 516 en jeu).
- Les effets des chants d'aura et des compétences de chef montrent maintenant le temps de quête, le repos et l'XP (exemple : Assistant A.U.R.A., −5 % temps de quête).

## v1.7.11 — 2026-11-28

- Onglet Champions : texte d'aide des graines corrigé. La version 26.12.0 du jeu n'est pas encore sortie : elle est seulement annoncée. Avec elle, les champions apparaîtront dans la liste des graines ouverte depuis l'inventaire. En attendant, le bouton « Trouver les graines avec les stats du jeu » reste le seul moyen de connaître leurs graines.

## v1.7.10 — 2026-11-28

- Onglet Champions : texte d'aide des graines mis à jour. Depuis la version 26.12.0 du jeu, les champions apparaissent dans la liste des graines ouverte depuis l'inventaire (correction d'un bug du jeu). Le compteur de graines d'un champion y est donc visible.

## v1.7.9 — 2026-11-28

- Onglet Champions : nouveau bouton « Trouver les graines avec les stats du jeu ». Le jeu ne montre pas les graines d'un champion. L'outil les déduit des PV, de l'ATQ et de la DEF du jeu, puis remplit les 3 cases. Exemple : Maladie a 80 ATQ, 65 DEF et 74 PV en graines.

## v1.7.8 — 2026-11-28

- Onglet Champions : nouveaux boutons « Exporter tout » et « Importer ». L'export crée un fichier de sauvegarde avec tous les champions, les presets de héros et les réglages. L'import remplace les données du navigateur par celles du fichier, puis recharge la page (il accepte aussi les anciens fichiers de presets).
- Onglet Héros : le bouton « Importer » des presets accepte aussi ce fichier de sauvegarde complet.

## v1.7.7 — 2026-11-28

- Champions : correction du niveau de la compétence de chef. Le jeu ne limite pas ce niveau à 3 sans âme de titan (Hero.GetCurrentActiveSkillUid) : il vaut 1 + le nombre d'améliorations « compétence » débloquées. Au rang 11, un champion a donc sa compétence 4/5 (icône dorée), même sans âme de titan. Le simulateur utilise maintenant les bonnes valeurs (exemple Rudo : +50 % crit au lieu de +40 %).

## v1.7.6 — 2026-11-28

- Champions : le message orange « Le simulateur utilise les stats du jeu » ne s'affiche plus quand l'écart est en vert (moins de 1 %).

## v1.7.5 — 2026-11-28

- Champions : calcul au point près. L'outil reprend la courbe de niveau exacte du jeu (CharacterData.ScaleStatToLevel : +1 %, 2 %, 3 %, 4 % par niveau jusqu'au niveau 40, puis linéaire) avec la virgule fixe du jeu (0,01 vaut 0,0099945). Les améliorations de rang ne sont plus arrondies, et les stats de chaque objet sont arrondies à l'entier.
- Argon : 2 053 PV, 7 438 ATQ, 15 573 DEF, élément 135, exactement comme dans le jeu (avant : 7 440 ATQ et 15 575 DEF).

## v1.7.4 — 2026-11-28

- Champions : ajout de la carte de collection du champion (commune +5 %, rare +10 %, mythique +25 %, comme pour les héros).
- Vérifié sur Argon (rang 11 +20, niveau 50, titan, 80 graines de chaque, Avatar épique + Élément Lumière, Réacteur d'aura épique, carte rare) : 2 053 PV, 7 440 ATQ, 15 575 DEF, élément 135. Le jeu affiche 2 053, 7 438, 15 573 et 135 : écart de 0,0 %. Sans la carte, l'écart était de −9,1 % sur les 3 stats.

## v1.7.3 — 2026-11-28

- Champions : case « Âme de Parangon ». Sans elle, le niveau s'arrête à 50. Avec elle, le niveau va jusqu'à 100 (courbe Parangon du jeu) et, au niveau 100, la compétence de chef gagne 1 rang (amélioration upgPrgnlvl100 des données du jeu). Pas encore vérifié dans le jeu.
- Champions : nouveau bloc « Stats affichées dans le jeu ». L'outil compare son calcul avec les valeurs du jeu et affiche l'écart pour PV, ATQ, DEF, esquive et élément (vert sous 1 %, jaune sous 5 %, rouge au-delà). La liste des champions montre l'écart le plus grand.
- Une case choisit si le simulateur utilise les valeurs du jeu ou le calcul. Les valeurs déjà entrées restent utilisées.

## v1.7.2 — 2026-11-28

- Onglets alignés sur le contenu de la page (même largeur et même marge), avec une ligne de séparation sous les onglets.

## v1.7.1 — 2026-11-28

- Nouvel ordre des onglets : Héros, Champions, Équipe et quêtes.

## v1.7.0 — 2026-11-28

- Nouvel onglet « Champions » : configurez chaque champion une seule fois (rang, renforts, niveau, âme de titan, graines, familier, chant d'aura, stats corrigées). Tout est enregistré dans le navigateur.
- La liste montre les 11 champions avec leur rang, leur niveau et leurs stats calculées. Un champion non configuré utilise les valeurs par défaut.
- Équipe et quêtes : il suffit de choisir le champion. Le simulateur et « Meilleur champion » utilisent les réglages enregistrés. Le bouton « Modifier ce champion » ouvre l'onglet Champions.
- L'export et l'import des presets contiennent aussi la configuration des champions.

## v1.6.6 — 2026-11-28

- Champion : ajout des graines d'ATQ, de DEF et de PV (+4 ATQ, +4 DEF, +1 PV par graine, comme pour les héros : le jeu range les graines dans la même fiche pour les héros et les champions). L'outil les garde pour chaque champion.

## v1.6.5 — 2026-11-28

- Quêtes éclair : la liste montre le nom du monstre (Golem d'or, Harpie érudite…), le jour du mois et le niveau de départ, dans l'ordre du calendrier.
- Nouveau calendrier des quêtes éclair avec minuteurs : quête en cours (temps restant) et prochaines quêtes (temps avant le début). Touchez une quête pour la simuler.
- Jours du mois repris des notes de version 12.0.0 de Kabam. Donjon Parangon et Nullysium : 1 week-end sur 2 (à confirmer). L'heure de début se règle une fois.
- Icônes du jeu pour chaque quête éclair. Le Donjon Parangon a maintenant un vrai nom (le texte français du jeu était une description).

## v1.6.4 — 2026-11-28

- Équipe et quêtes : icônes du jeu pour la zone, le champion, sa compétence de chef, l'âme de titan, le familier, le chant d'aura, la qualité, l'élément et l'esprit (icônes extraites des fichiers du jeu, outil tools/teamatlas.py).
- Champion : les listes ne sont plus coupées. Chaque choix (objet, qualité, élément, esprit) a sa propre ligne, et le rang, les renforts et le niveau sont sur 2 colonnes.
- Stats calculées du champion affichées avec les icônes PV, ATQ, DEF, esquive et élément.

## v1.6.3 — 2026-11-28

- Champion : rang réel du jeu (rang 1 à 11 + renforts, par exemple 11 +18), niveau et âme de titan.
- Champion : familier et chant d'aura équipables, avec qualité, élément et esprit. L'outil calcule PV, ATQ, DEF, esquive et élément avec la règle du jeu (code Hero.GetUpgradeForStory) : base du niveau + améliorations de rang × stat d'histoire (× 1,5 avec titan), chaque renfort ajoute +5 %.
- Le chant d'aura donne aussi son bonus de quête (il remplace le choix séparé de la pierre d'aura).
- Les champs « Corriger les stats » restent disponibles et remplacent le calcul. L'outil garde tous les réglages de chaque champion.

## v1.6.2 — 2026-11-28

- Équipe et quêtes : les stats du champion (PV, ATQ, DEF, esquive, élément) sont maintenant toujours visibles. Recopiez l'onglet Infos du champion dans le jeu. L'outil les garde pour chaque champion, et « Meilleur champion » les utilise.
- Champion : ajout de l'esquive. L'estimation des stats reste disponible si les champs sont vides, mais elle ignore les renforcements et le familier.
- Premier test comparé au jeu (Elysium Difficile, boss, Yami) : les 4 visages sont identiques, et la barrière donne le même total (458 / 260).

## v1.6.1 — 2026-11-28

- Équipe et quêtes : la note de chaque héros s'affiche aussi avec le visage du jeu (violet D, rouge C, orange B, jaune A, vert S, lunettes SSS). Images extraites des fichiers du jeu (outil tools/faces.py). Le classement « Meilleure équipe » et « Meilleur champion » montre aussi le visage du héros le plus en danger.

## v1.6.0 — 2026-11-27

- Nouvel onglet « Équipe et quêtes » : simulation de combat d'une équipe de 3 ou 4 héros (vos presets) et d'un champion, contre une quête (Facile à Extrême), un boss, une quête éclair ou la Mystérieuse cité d'or. Résultat : taux de victoire, tours, risque de mort et note par héros, dégâts de chaque héros, barrière brisée ou non.
- Règles de combat reprises du code du jeu (Quest.DoCombat), lu sans lancer le jeu : ordre des attaques, attaques de zone, cible selon la menace, effet de la DEF, esquive et précision, coups critiques, barrière élémentaire (−80 %), capacités des classes (Samouraï, Daimyo, Danseur, Ninja, Sensei, Berserker, Seigneur, Clerc, Conquistador, Chevalier noir, Chronomancien), compétences de chef des champions, pierres d'aura, bonus d'ATQ et mini-boss.
- Boutons « Meilleure équipe » (toutes les combinaisons de vos presets) et « Meilleur champion » (les 11 champions pour l'équipe choisie).
- Données des quêtes, des champions et des modificateurs extraites des fichiers du jeu (outil tools/simdata.py).

## v1.5.10 — 2026-11-27

- Objets à esprit intégré (Mundra) avec un élément ajouté : l'élément compte ×1,5, et élément + esprit ne dépassent pas la stat de la fiche de l'objet (base + esprit intégré). Vérifié sur le Crâne de Mundra + Oubli : 864 DEF et 97 PV dans le jeu, 863 et 97 dans l'outil (avant : 809 et 89). Règle tirée d'un seul objet : à confirmer.
- Les meilleurs builds stockés sont recalculés.

## v1.5.9 — 2026-11-27

- Affinité, correction de la 1.5.8 : dès le tier 12, la valeur d'élément prend bien +10, mais les stats restent ×1,5 jusqu'au tier 13. Les stats ×2 commencent au tier 14. Vérifié sur la fiche de Ténèbres millénaires (Abysse T12) : 3 289 ATQ et 138 PV, comme le jeu.
- Les meilleurs builds stockés sont recalculés.

## v1.5.8 — 2026-11-27

- Affinité : le grand bonus (+10 de valeur d'élément, stats ×2) commence dès le tier 12, et non au tier 14. Vérifié avec l'Élément Abysse (T12) sur Ténèbres millénaires : élément 220 comme le jeu.
- Chevalier noir et Chevalier de la mort : la puissance compte +10 % pour « achève tout ennemi sous 10 % de PV ». Vérifié sur R1 : 138 802 contre 138 964 (avant : −9,2 %).
- Les meilleurs builds stockés sont recalculés.

## v1.5.7 — 2026-11-27

- Lecture des captures : la classe « Chevalier de la mort » était lue « Chevalier ». À égalité, la page garde maintenant le nom de classe le plus long. Avec la bonne classe, les 6 objets de la capture sont reconnus.
- Lecture des captures : la qualité est plus fiable. Un bord sombre ou la couleur propre de l'objet (épée de glace, objet de feu) n'est plus lu comme une lueur de qualité. Testé sur 10 captures : toutes les qualités connues sont justes.

## v1.5.6 — 2026-11-27

- Puissance : l'Esprit de dinosaure (+25 % d'attaque au 1er tour) compte pour 1/5, et non pour moitié. Vérifié en jeu sur une Sorceguerre (Dinosaure sur une idole : 281 326 contre 281 317) et sur un Berserker.
- Idole : effet de l'esprit doublé, vérifié en jeu (Esprit de lion : 281 365 contre 281 356).
- Berserker et Jarl : les bonus d'attaque conditionnels entrent aussi dans l'ajustement de rage de la formule de puissance.
- Optimiseur : il utilise maintenant exactement les mêmes règles de stats que le mode manuel (affinité ×2 ou ×1,5, limite élément + esprit, esprits intégrés). Avant, la recherche utilisait encore les anciennes règles.
- Version française : 24 effets restaient en anglais (Berserker, Samouraï, Tisse-Sort, esprits de requin, dinosaure et Mundra, compétences « coups critiques consécutifs »…). Ils sont traduits.
- Version française : les affinités des objets s'affichent en français (« Terre · Esprit de tigre » au lieu de « Earth · Tiger Power »).
- Les meilleurs builds stockés sont recalculés.

## v1.5.5 — 2026-11-27

- Carquois : sans arc, arbalète ou fusil, le carquois est désactivé et n'apporte rien (règle du jeu). L'outil ne propose plus un carquois avec une épée.
- Carquois avec un arc : « Synergie de l'arc », +30 % de bonus d'objet sur l'arc (valeur des fichiers du jeu).
- Idole : l'effet de l'esprit enchanté est doublé (texte du jeu).
- Esprit de dinosaure : compté pour moitié dans la puissance, comme l'Esprit de requin (même effet dans les fichiers du jeu).
- Les meilleurs builds stockés sont recalculés.

## v1.5.4 — 2026-11-24

- Affinité, élément intégré et esprit intégré : stats ×2 pour un enchantement T14 et plus, ×1,5 en dessous (vérifié sur la Racine de Mornefleche et le Décret de Mundra).
- Puissance : l'Esprit de requin (+20 % d'attaque si l'ennemi a moins de 50 % de PV) et l'Esprit de Mundra (+20 % d'attaque et de défense contre les boss) comptent pour moitié. Vérifié en jeu sur un Géomancien, avec et sans Requin : 47 688 contre 47 684, et 46 312 contre 46 307.
- L'optimiseur prend maintenant en compte ces esprits. Les meilleurs builds stockés sont recalculés.

## v1.5.3 — 2026-11-24

- Tisse-Sort : la puissance compte le bonus de +15 % de la compétence innée (« Contrôle du chaos »). Vérifié en jeu : 150 227 contre 150 211 (avant : −13 %).

## v1.5.2 — 2026-11-24

- Limite élément + esprit corrigée : au plus 2 × la stat de base de l'objet, sans la qualité. Vérifié sur un 2e héros Sorceguerre : les PV et les fiches des 6 objets correspondent au jeu.
- Les meilleurs builds stockés sont recalculés avec cette règle.

## v1.5.1 — 2026-11-24

- Calcul corrigé et vérifié sur 2 builds réels de Sorceguerre et sur la fiche de 7 objets : l'écart de puissance passe de −0,8 % à 0,0 %.
- Objets à élément intégré : le Google Sheet ajoute l'élément intégré aux stats de base de l'objet. L'outil reprend maintenant les stats du jeu, puis ajoute l'élément doublé.
- Élément + esprit : leurs stats ne dépassent pas 2 × la stat de base de l'objet.
- Sorceguerre : le bonus de +50 % multiplie tout le bonus des objets à élément intégré (×1,5).
- Les meilleurs builds stockés sont recalculés avec ces règles.
- Lecture des captures : le 7 n'est plus lu comme un 1, les cases vides sont reconnues, une fiche sans objets est lue, la rareté des compétences est plus fiable.

## v1.5.0 — 2026-11-24

- Nouveau bouton « Créer depuis des captures » dans les presets : la page lit une ou plusieurs captures du jeu et remplit le mode manuel.
- Onglet Infos : classe (aussi le nom Paragon), niveau, nom du héros, puissance, PV, ATQ, DEF, ESQ, élément, les 6 objets avec leur qualité, leur élément et leur esprit, et les compétences.
- Onglet Capacités et carte de collection : compétences et niveau de la carte.
- Les champs incertains s'affichent en orange. Vérifiez-les avant d'enregistrer.
- Tout reste dans le navigateur. Le lecteur de texte (Tesseract.js) est dans le fichier ocr.js, chargé seulement à la première lecture. Glisser-déposer et Ctrl+V acceptés.

## v1.4.0 — 2026-11-24

- Presets de héros dans le mode manuel : 41 emplacements, le nombre maximum de héros dans Shop Titans.
- Un preset garde le nom du héros, la classe, les réglages (niveau, qualité, transcendance, starforge, graines, carte, stats de base, sources), le build manuel et les valeurs du jeu.
- Valeurs du jeu (puissance, PV, ATQ, DEF, ESQ, élément) : l'écart en % s'affiche sous chaque stat du build manuel.
- Export et import de tous les presets dans un fichier .json (sauvegarde ou changement d'ordinateur).

## v1.3.1 — 2026-11-24

- Correction : une barre jaune vide s'affichait sous l'en-tête quand l'outil était à jour.

## v1.3.0 — 2026-11-24

- Mise à jour de l'outil depuis GitHub : la page compare sa version avec celle du dépôt TheLynk/ST-Hero-Calculator à l'ouverture, puis 1 fois par jour.
- Si une nouvelle version existe : bannière avec la liste des nouveautés, bouton de téléchargement du zip de la dernière release et lien vers GitHub.
- Bouton « Vérifier les mises à jour de l'outil » dans le journal des modifications, et lien GitHub dans l'en-tête.

## v1.2.0 — 2026-11-24

- Icône starforge à côté de l'option « Objets starforgés ».
- Animation pendant le calcul : étoile qui tourne, chiffres qui clignotent et barre de progression, puis effet à l'affichage du résultat. L'animation est coupée si le système demande moins de mouvements.
- Icône relique sur les objets reliques (Capuchon de réflexion, Kiku-Ichimonji…).

## v1.1.2 — 2026-11-24

- Correction : un élément intégré à un objet compte comme une affinité (+10 de valeur d'élément au tier 14, stats de l'enchantement ×2). Vérifié sur un Sorceguerre réel : écart avec le jeu de 12 % à moins de 1 %.
- Les 168 meilleurs builds stockés sont recalculés avec cette correction.

## v1.1.1 — 2026-11-24

- Mode manuel : choix de la qualité de chaque objet (normale à légendaire), avec son icône.

## v1.1.0 — 2026-11-24

- Numéro de version affiché dans l'en-tête de la page.
- Journal des modifications (français et anglais) dans la page et dans les fichiers CHANGELOG.
- Mode manuel : choix libre des objets, éléments, esprits et compétences, avec comparaison au meilleur build.

## v1.0.0 — 2026-11-24

- Outil autonome dans un zip : la page télécharge elle-même le Google Sheet officiel en 1 clic.
- Vérification de la version du sheet à l'ouverture, puis 1 fois par jour. Bouton « Mettre à jour » si une nouvelle version existe.
- Script make_release.bat pour créer le zip d'une release GitHub.

## v0.9.0 — 2026-11-24

- 168 meilleurs builds pré-calculés : résultat en moins d'une seconde.
- Builds calculés stockés dans le navigateur.
- 5e emplacement de compétence automatique au Paragon 50.

## v0.8.0 — 2026-11-24

- Icônes du jeu : puissance, PV, ATQ, DEF, ESQ, éléments, compétences, qualité, graines, XP, sources, Paragon.
- Noms et effets des compétences en français.
- Carte de collection : choix du niveau 0 à 3.

## v0.7.0 — 2026-11-24

- Version anglaise (en.html) et version française (index.html).
- Images des objets et icônes des classes.
- Sélecteur de classe par famille, avec bouton classe normale / évoluée.

## v0.6.0 — 2026-11-24

- Stats de base exactes de chaque classe (données du jeu, niveaux 1, 40, 50 et Paragon).
- Compétences des artefacts (ex. Capuchon de réflexion : XP → ATQ).
- Build du top 1 reproduit à 0,05 % près.

## v0.5.0 — 2026-11-24

- Formule exacte des stats d'objet : transcendance, starforge, affinités.
- Optimiseur amélioré (changements de 2 objets à la fois).

## v0.4.0 — 2026-11-23

- Graines, carte de collection, stats de base du héros.
- Ligne PV / ATQ / DEF / ESQ / ÉLÉMENT comme dans le jeu.

## v0.3.0 — 2026-11-23

- Objectif puissance (formule de ST Central), en plus de la menace.

## v0.1.0 — 2026-11-23

- Première version : meilleur équipement pour la menace maximale.
