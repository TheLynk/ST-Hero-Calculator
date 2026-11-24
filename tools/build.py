# construit index.html (français) et en.html (anglais) à partir du modèle
# usage : build.py <src_dir> <out_dir> <data.json|none>
#   src_dir : template.html, sheet.js, game.json, atlas.json, uiatlas.json, precomp.json (facultatif)
#   data    : données intégrées (page publiée) ou « none » (version téléchargeable : données lues depuis le Google Sheet)
import sys,json,os,re
src,outdir,data=sys.argv[1:4]
os.makedirs(outdir,exist_ok=True)
tpl=os.path.join(src,'template.html')
P={'version':'','builds':{}}
pre=os.path.join(src,'precomp.json')
if os.path.exists(pre): P=json.load(open(pre,encoding='utf-8'))
print('builds stockés',len(P['builds']),'version',P.get('version'))
t=open(tpl,encoding='utf-8').read()
t=t.replace('/*SHOTJS*/',open(os.path.join(src,'shot.js'),encoding='utf-8').read())
EN=[
("Créer depuis des captures","Create from screenshots"),
("Ajoutez une ou plusieurs captures du jeu : l'onglet Infos du héros et, en option, l'onglet Capacités et la carte de collection. Vous pouvez aussi les glisser ici ou les coller (Ctrl+V). Tout reste dans votre navigateur. Les graines, la transcendance et le starforge ne sont pas visibles : réglez-les à gauche.",
 "Add one or more game screenshots: the hero Info tab and, optionally, the Abilities tab and the collection card. You can also drop them here or paste them (Ctrl+V). Everything stays in your browser. Seeds, transcendence and starforge are not visible: set them on the left."),
('<h2>Mes héros (presets)</h2>','<h2>My heroes (presets)</h2>'),
("41 emplacements, comme le nombre maximum de héros dans Shop Titans. Un preset garde la classe, les réglages de gauche (niveau, qualité, graines, carte…), le build du mode manuel et les valeurs du jeu.","41 slots, like the maximum number of heroes in Shop Titans. A preset keeps the class, the settings on the left (level, quality, seeds, card…), the manual build and the game values."),
('class="sr">Emplacement</label>','class="sr">Slot</label>'),
('placeholder="Nom du héros (ex. PartoutV2)" aria-label="Nom du héros"','placeholder="Hero name (e.g. PartoutV2)" aria-label="Hero name"'),
('>Enregistrer</button><button type="button" id="pLoad">Charger</button><button type="button" id="pDel">Supprimer</button><button type="button" id="pExp">Exporter tous</button><label class="fbtn">Importer<','>Save</button><button type="button" id="pLoad">Load</button><button type="button" id="pDel">Delete</button><button type="button" id="pExp">Export all</button><label class="fbtn">Import<'),
('Valeurs du jeu (pour comparer)','Game values (to compare)'),
('%%power%% Puissance<input','%%power%% Power<input'),('%%hp%% PV<input','%%hp%% HP<input'),('%%atk%% ATQ<input','%%atk%% ATK<input'),('%%eva%% ESQ %<input','%%eva%% EVA %<input'),('%%elall%% Élément<input','%%elall%% Element<input'),
("`jeu ${fr(g)} · ${e>=0?'+':''}${e.toFixed(1).replace('.',',')} %`","`game ${fr(g)} · ${e>=0?'+':''}${e.toFixed(1)}%`"),
("'— vide —'","'— empty —'"),
("`Preset ${i+1} enregistré : ${p.name}.`","`Preset ${i+1} saved: ${p.name}.`"),("'Le navigateur refuse d’enregistrer le preset.'","'The browser refuses to save the preset.'"),
("'Cet emplacement est vide.'","'This slot is empty.'"),("'Classe inconnue dans ces données : '","'Unknown class in this data: '"),
("`Preset ${i+1} chargé : ${p.name}.`","`Preset ${i+1} loaded: ${p.name}.`"),("'Cet emplacement est déjà vide.'","'This slot is already empty.'"),
("`Preset ${i+1} supprimé : ${n}.`","`Preset ${i+1} deleted: ${n}.`"),("`${a.filter(Boolean).length} preset(s) exporté(s).`","`${a.filter(Boolean).length} preset(s) exported.`"),
("`${a.filter(Boolean).length} preset(s) importé(s).`","`${a.filter(Boolean).length} preset(s) imported.`"),("'Fichier de presets invalide.'","'Invalid preset file.'"),
("'title=\"Relique\"'","'title=\"Artifact\"'"),
('aria-label="Qualité">','aria-label="Quality">'),
("[['1','q_common','Normale'],['1.25','q_uncommon','Supérieure'],['1.5','q_flawless','Impeccable'],['2','q_epic','Épique'],['3','q_legendary','Légendaire']]","[['1','q_common','Normal'],['1.25','q_uncommon','Superior'],['1.5','q_flawless','Flawless'],['2','q_epic','Epic'],['3','q_legendary','Legendary']]"),
('title="Journal des modifications">','title="Changelog">'),
('Mode manuel : choisir mes objets et mes compétences','Manual mode: choose my items and skills'),
("Choisissez chaque objet, élément, esprit et compétence. Le calcul utilise les réglages de gauche (niveau, qualité, graines, carte…). Utile pour comparer l'outil avec le jeu.","Choose each item, element, spirit and skill. The calculation uses the settings on the left (level, quality, seeds, card…). Useful to compare the tool with the game."),
('>Copier le meilleur build<','>Copy the best build<'),
('<h2 style="margin-top:14px">Compétences</h2>','<h2 style="margin-top:14px">Skills</h2>'),
('<h2 style="margin-top:14px">Résultat de mon build</h2>','<h2 style="margin-top:14px">My build result</h2>'),
("(intégré)</option>","(built-in)</option>"),
('aria-label="Élément">${opt(\'\',\'— Aucun élément —\'','aria-label="Element">${opt(\'\',\'— No element —\''),
('aria-label="Esprit">${opt(\'\',\'— Aucun esprit —\'','aria-label="Spirit">${opt(\'\',\'— No spirit —\''),
('aria-label="Objet ${i+1}"','aria-label="Item ${i+1}"'),
('<span class="alt">(innée)</span>','<span class="alt">(innate)</span>'),
('aria-label="Compétence ${k+1}">${opt(\'\',\'— Aucune compétence —\'','aria-label="Skill ${k+1}">${opt(\'\',\'— No skill —\''),
("(t?'Rang '+t.tier:'Rang —')","(t?'Rank '+t.tier:'Rank —')"),
("[['pw','Puissance',fr(R.power)],['hp','PV',fr(R.hp)],['atk','ATQ',fr(R.atk)],['def','DEF',fr(R.def)],['eva','ESQ',Math.round(R.eva)+' %'],['el','ÉLÉMENT',R.el]]","[['pw','Power',fr(R.power)],['hp','HP',fr(R.hp)],['atk','ATK',fr(R.atk)],['def','DEF',fr(R.def)],['eva','EVA',Math.round(R.eva)+'%'],['el','ELEMENT',R.el]]"),
("<div><span>Crit</span><b>${R.crit.toFixed(0)} % · ×${R.cm.toFixed(2)}</b></div><div><span>Menace</span>","<div><span>Crit</span><b>${R.crit.toFixed(0)}% · ×${R.cm.toFixed(2)}</b></div><div><span>Threat</span>"),
("`${uniq.length<fams.length?'Compétence en double ignorée. ':''}Écart avec le meilleur build : ${d>=0?'+':''}${d.toFixed(1).replace('.',',')} % (${isP?'puissance':'menace'} ${fr(a)} contre ${fr(b)})`",
 "`${uniq.length<fams.length?'Duplicate skill ignored. ':''}Difference with the best build: ${d>=0?'+':''}${d.toFixed(1)}% (${isP?'power':'threat'} ${fr(a)} vs ${fr(b)})`"),
("const LANG_UI='fr';","const LANG_UI='en';"),
('title="Puissance" aria-label="Puissance">%%power%% Puissance</button>','title="Power" aria-label="Power">%%power%% Power</button>'),
('title="Menace" aria-label="Menace">%%defense%% Menace</button>','title="Threat" aria-label="Threat">%%defense%% Threat</button>'),
('<option value="power" selected>Puissance</option>','<option value="power" selected>Power</option>'),
('%%xp%% Niveau</label>','%%xp%% Level</label>'),
('%%seedhp%% PV','%%seedhp%% HP'),('Graines (0–80) et carte','Seeds (0–80) and card'),
('title="Normale" aria-label="Normale"','title="Normal" aria-label="Normal"'),('title="Supérieure" aria-label="Supérieure"','title="Superior" aria-label="Superior"'),
('title="Impeccable" aria-label="Impeccable"','title="Flawless" aria-label="Flawless"'),('title="Épique" aria-label="Épique"','title="Epic" aria-label="Epic"'),
('title="Légendaire" aria-label="Légendaire"','title="Legendary" aria-label="Legendary"'),
('%%book%% Carte de collection de la classe','%%book%% Class collection card'),
('<option value="0">Pas de carte (aucun bonus)</option><option value="1">Niveau 1 (+5 %)</option><option value="2">Niveau 2 (+10 %)</option><option value="3" selected>Niveau 3 (+25 %)</option>',
 '<option value="0">No card (no bonus)</option><option value="1">Level 1 (+5%)</option><option value="2">Level 2 (+10%)</option><option value="3" selected>Level 3 (+25%)</option>'),
('%%paragon%% 5e emplacement de compétence : automatique pour une classe évoluée au niveau 100 (Paragon 50).','%%paragon%% 5th skill slot: automatic for a promoted class at level 100 (Paragon 50).'),
("'⚡ Résultat stocké (pré-calculé)':'⚡ Résultat stocké (déjà calculé sur cet appareil)'","'⚡ Stored result (precomputed)':'⚡ Stored result (already computed on this device)'"),
("'Résultat calculé maintenant, puis stocké sur cet appareil'","'Result computed now, then stored on this device'"),
('<html lang="fr">','<html lang="en">'),
('<a class="lang" href="en.html">English</a>','<a class="lang" href="index.html">Français</a>'),
("const LANG='fr';","const LANG='en';"),
("toLocaleString('fr-FR')","toLocaleString('en-US')"),
('Meilleur équipement et compétences par classe · données :','Best gear and skills per class · data:'),
('<h2>Héros</h2>','<h2>Hero</h2>'),
('>Objectif<','>Goal<'),
('<option value="threat">Menace</option>','<option value="threat">Threat</option>'),
('<label>Classe</label>','<label>Class</label>'),
('aria-label="Version de la classe"','aria-label="Class version"'),
('>Classe normale<','>Base class<'),('>Classe évoluée<','>Promoted class<'),
('Tier max objets','Max item tier'),
('Qualité des objets','Item quality'),
('<option value="1">Normale</option><option value="1.25">Supérieure</option><option value="1.5">Impeccable</option><option value="2">Épique</option><option value="3" selected>Légendaire</option>',
 '<option value="1">Normal</option><option value="1.25">Superior</option><option value="1.5">Flawless</option><option value="2">Epic</option><option value="3" selected>Legendary</option>'),
('Transcendance des objets','Item transcendence'),
('<option value="0">Aucune</option><option value="1">Palier 1</option><option value="2">Palier 2</option><option value="3" selected>Palier 3 (max)</option>',
 '<option value="0">None</option><option value="1">Level 1</option><option value="2">Level 2</option><option value="3" selected>Level 3 (max)</option>'),
("%%starforge%% Objets starforgés (+25 % de base si l'objet le permet)","%%starforge%% Starforged items (+25% base if the item allows it)"),
('Tier max enchantements','Max enchant tier'),


('Stats de base du héros','Hero base stats'),
('Valeurs sans objets ni compétences. Vide = estimation.','Values without items or skills. Empty = estimate.'),
('<label for="bHp">PV</label>','<label for="bHp">HP</label>'),
('Sources autorisées','Allowed sources'),('Objets fabricables','Craftable items'),('Objets de coffres','Chest items'),('Packs, pass, événements','Packs, passes, events'),
('<h2 style="margin-top:18px">Règles</h2>','<h2 style="margin-top:18px">Rules</h2>'),
("L'élément Or compte pour tous les héros","Gold element counts for all heroes"),

('<h2>Équipement optimal</h2>','<h2>Best gear</h2>'),
('<th>Objet</th><th>Élément</th><th>Esprit</th><th class="n">Élém.</th><th class="n">ATK objet</th><th class="n">DEF objet</th><th class="n">PV objet</th>',
 '<th>Item</th><th>Element</th><th>Spirit</th><th class="n">Elem.</th><th class="n">Item ATK</th><th class="n">Item DEF</th><th class="n">Item HP</th>'),
('<h2>Compétences</h2>','<h2>Skills</h2>'),
('<th>Emplacement</th><th>Compétence</th><th>Rang</th><th>Effet</th>','<th>Slot</th><th>Skill</th><th>Rank</th><th>Effect</th>'),
('<h2>Toutes les stats</h2>','<h2>All stats</h2>'),
('<h2>Règles de calcul</h2>','<h2>Calculation rules</h2>'),
("<li>Puissance = puissance d'attaque + puissance de défense (formule publiée par ST Central).</li>","<li>Power = attack power + defense power (formula published by ST Central).</li>"),
("<li>Puissance d'attaque = ATK × (1 + crit % × (multiplicateur crit − 1)) × 0,8. Des ajustements existent pour Ninja, Sensei, Samurai, Daimyo, Dancer, Acrobat, Conquistador, Berserker et Jarl. Tisse-Sort : +15 % de puissance (compétence innée). Bonus conditionnels (Esprit de requin, Esprit de Mundra contre les boss) : comptés pour moitié dans la puissance.</li>",
 "<li>Attack power = ATK × (1 + crit % × (crit multiplier − 1)) × 0.8. Adjustments exist for Ninja, Sensei, Samurai, Daimyo, Dancer, Acrobat, Conquistador, Berserker and Jarl. Fateweaver: +15% power (innate skill). Conditional bonuses (Shark Spirit, Mundra's Spirit against bosses): counted at half in power.</li>"),
("<li>Puissance de défense = Menace × PV / (1 − Esq) × 0,025 + Menace × DEF × 0,008 + PV / (1 − Esq) × 5 + DEF × 1,2 (esquive max 75 %).</li>",
 "<li>Defense power = Threat × HP / (1 − Eva) × 0.025 + Threat × DEF × 0.008 + HP / (1 − Eva) × 5 + DEF × 1.2 (evasion max 75%).</li>"),
("<li>Stat = (base + graines + objets × (1 + bonus d'objet) + bonus fixes) × (1 + bonus %) × carte de collection. Les enchantements sont inclus dans la valeur des objets.</li>",
 "<li>Stat = (base + seeds + items × (1 + item bonus) + flat bonuses) × (1 + % bonus) × collection card. Enchantments are included in the item value.</li>"),
("<li>Graines : +4 ATK, +4 DEF ou +1 PV par graine, 80 max par stat avec les Blossoms. Carte de collection : chaque exemplaire de la carte de la classe donne de l'XP (commune 1, rare 5, mythique 10). Niveau 1 dès 1 exemplaire (×1,05), niveau 2 à 50 XP (×1,10), niveau 3 à 250 XP (×1,25).</li>",
 "<li>Seeds: +4 ATK, +4 DEF or +1 HP per seed, max 80 per stat with Blossoms. Collection card: each copy of the class card gives XP (common 1, rare 5, mythic 10). Level 1 from 1 copy (×1.05), level 2 at 50 XP (×1.10), level 3 at 250 XP (×1.25).</li>"),
("<li>Menace = menace de la classe + compétence innée + esprits (les esprits identiques se cumulent).</li>","<li>Threat = class threat + innate skill + spirits (identical spirits stack).</li>"),
("<li>Stat d'un objet = ((base + bonus de transcendance) × qualité + enchantements) × (1 + % de base de transcendance et starforge) × (1 + bonus d'objet des compétences). Formule vérifiée sur 6 objets réels.</li>",
 "<li>Item stat = ((base + transcendence flat bonus) × quality + enchantments) × (1 + transcendence and starforge base %) × (1 + item bonus from skills). Formula checked on 6 real items.</li>"),
("<li>Affinité d'élément : +10 de valeur d'élément au tier 14 (+5 avant), +5 seulement pour l'affinité « Tous ». L'affinité et l'élément ou l'esprit intégré multiplient ses stats : ×2 pour un enchantement T14 et plus, ×1,5 en dessous. Élément + esprit : au plus 2 × la stat de base de l'objet, sans la qualité. Le Google Sheet compte l'élément intégré dans les stats de base : l'outil reprend les stats du jeu.</li>",
 "<li>Element affinity: +10 element value at tier 14 (+5 before), only +5 for the \"All\" affinity. Affinity and built-in elements or spirits multiply their stats: ×2 for a T14+ enchantment, ×1.5 below. Element + spirit: at most 2 × the item base stat, without quality. The Google Sheet counts the built-in element in the base stats: the tool uses the game stats.</li>"),
("<li>Geomancer et Astramancer : +1 % ATK par point d'élément, tous éléments comptés. Velite et Praetorian : la DEF du bouclier s'ajoute à l'ATK. Spellknight : tout le bonus des objets à élément intégré est multiplié par 1,5 (vérifié en jeu).</li>",
 "<li>Geomancer and Astramancer: +1% ATK per element point, all elements count. Velite and Praetorian: shield DEF is added to ATK. Spellknight: the whole bonus of items with a built-in element is multiplied by 1.5 (checked in game).</li>"),
("<li>Stats de base : valeurs du jeu aux niveaux 1, 40, 50 et Paragon 50 (niveau 100 ici). Entre les niveaux 1 et 40, courbe ((niveau − 1) / 39)^1,55, vérifiée sur 3 héros. Artefacts : compétence propre de l'objet (ex. Capuchon de réflexion : 50 % du bonus d'XP devient de l'ATQ).</li>",
 "<li>Base stats: game values at levels 1, 40, 50 and Paragon 50 (level 100 here). Between levels 1 and 40, curve ((level − 1) / 39)^1.55, checked on 3 heroes. Artifacts: the item's own skill (e.g. Thinkin' Cap: 50% of the XP bonus becomes ATK).</li>"),
("<li>Vous pouvez entrer les vraies stats de base dans les champs « Hero base stats ».</li>","<li>You can enter the real base stats in the \"Hero base stats\" fields.</li>"),
("const FR = {Fighter:'Combattant',Rogue:'Roublard',Spellcaster:'Lanceur de sorts'};","const FR = {Fighter:'Fighter',Rogue:'Rogue',Spellcaster:'Spellcaster'};"),
("const ELFR = {Fire:'Feu',Water:'Eau',Air:'Air',Earth:'Terre',Light:'Lumière',Dark:'Ténèbres',Gold:'Or',Any:'Tous'};","const ELFR = {Fire:'Fire',Water:'Water',Air:'Air',Earth:'Earth',Light:'Light',Dark:'Dark',Gold:'Gold',Any:'Any'};"),
("const FAMFR={Fighter:'Guerriers',Rogue:'Roublards',Spellcaster:'Mages'};","const FAMFR={Fighter:'Fighters',Rogue:'Rogues',Spellcaster:'Spellcasters'};"),
("' · évoluée de '","' · promoted from '"),("' · évolue en '","' · promotes to '"),
("$('busy').textContent='Calcul en cours…'","$('busy').textContent='Calculating…'"),
("Aucun objet disponible pour un emplacement. Élargissez les sources ou le niveau.","No item available for a slot. Allow more sources or raise the level."),
("isP?'Puissance estimée':'Score de menace'","isP?'Estimated power':'Threat score'"),
(" · élément <b>"," · element <b>"),(" · niveau ${lvl} · objets tier ≤ "," · level ${lvl} · items tier ≤ "),(" · valeur d'élément <b>"," · element value <b>"),
(" · tous éléments <b>${R.anyEl}</b> (+${R.T.atkPerEl*R.anyEl} % ATK)"," · all elements <b>${R.anyEl}</b> (+${R.T.atkPerEl*R.anyEl}% ATK)"),
("<span class=\"pill\">Puissance d'attaque <b>","<span class=\"pill\">Attack power <b>"),("<span class=\"pill\">Puissance de défense <b>","<span class=\"pill\">Defense power <b>"),
("<span class=\"pill\">Menace <b>","<span class=\"pill\">Threat <b>"),("<span class=\"pill\">Classe <b>","<span class=\"pill\">Class <b>"),
("<span class=\"pill\">Innée et compétences <b>","<span class=\"pill\">Innate and skills <b>"),("<span class=\"pill\">Esprits <b>","<span class=\"pill\">Spirits <b>"),
("<span class=\"pill\">Puissance <b>","<span class=\"pill\">Power <b>"),
("['hp','PV',fr(R.hp)],['atk','ATQ',fr(R.atk)],['def','DEF',fr(R.def)],['eva','ESQ',Math.round(R.eva)+' %'],['el','ÉLÉMENT',R.el]",
 "['hp','HP',fr(R.hp)],['atk','ATK',fr(R.atk)],['def','DEF',fr(R.def)],['eva','EVA',Math.round(R.eva)+'%'],['el','ELEMENT',R.el]"),
("'<span class=\"tag chest\">coffre</span>'","'<span class=\"tag chest\">chest</span>'"),
("`<div class=\"alt\">Affinité : ","`<div class=\"alt\">Affinity: "),
("'<span class=\"tag plus\">affinité</span>'","'<span class=\"tag plus\">affinity</span>'"),
("' (intégré)'","' (built-in)'"),
("menace</span>`","threat</span>`"),
("<tr><td>Innée</td>","<tr><td>Innate</td>"),("<tr><td>Compétence ${i+1}</td>","<tr><td>Skill ${i+1}</td>"),
("`${ctx.nSlots} emplacement(s) de compétence au niveau ${lvl}. Le rang de chaque compétence dépend de la valeur d'élément (${R.el}).`",
 "`${ctx.nSlots} skill slot(s) at level ${lvl}. Each skill rank depends on the element value (${R.el}).`"),
("[['Puissance',fr(R.power)],['Menace',fr(R.threat)],['ATK',fr(R.atk)],['DEF',fr(R.def)],['PV',fr(R.hp)],['Crit %',R.crit.toFixed(0)],['Mult. crit',R.cm.toFixed(2)+'x'],['Esquive %',R.eva.toFixed(0)]]",
 "[['Power',fr(R.power)],['Threat',fr(R.threat)],['ATK',fr(R.atk)],['DEF',fr(R.def)],['HP',fr(R.hp)],['Crit %',R.crit.toFixed(0)],['Crit mult.',R.cm.toFixed(2)+'x'],['Evasion %',R.eva.toFixed(0)]]"),
]
d=open(data,encoding='utf-8').read() if data!='none' else 'null'
rd=lambda n:open(os.path.join(src,n),encoding='utf-8').read()
a=rd('atlas.json'); ua=rd('uiatlas.json'); gm=rd('game.json'); sj=rd('sheet.js'); CL=json.loads(rd('changelog.json')); VER=CL['version']
print('version de l\'outil',VER)
sa=rd('scanatlas.json')
fill=lambda s:s.replace('/*SCANATLAS*/null',sa).replace('/*DATA*/null',d).replace('/*ATLAS*/null',a).replace('/*UIATLAS*/null',ua).replace('/*GAME*/null',gm).replace('/*VERSTR*/',VER).replace('/*CHANGELOG*/null',json.dumps(CL,ensure_ascii=False)).replace('/*SHEETJS*/',sj).replace("/*PRECOMP*/{version:'',builds:{}}",json.dumps(P,separators=(',',':')))
open(os.path.join(outdir,'index.html'),'w',encoding='utf-8').write(fill(t))
e=t
for fr_,en in EN:
    n=e.count(fr_)
    if n==0: print('MANQUE:',fr_[:70])
    e=e.replace(fr_,en)
open(os.path.join(outdir,'en.html'),'w',encoding='utf-8').write(fill(e))
import re
for i,l in enumerate(e.split('\n')):
    s=re.sub(r'//.*|/\*.*?\*/','',l)
    pass
# journaux des modifications (Markdown)
for lang,fn,title in (('fr','CHANGELOG.md','Journal des modifications'),('en','CHANGELOG.en.md','Changelog')):
    md=f'# {title} — ST Hero Calculator\n'
    for e in CL['entries']: md+=f"\n## v{e['v']} — {e['date']}\n\n"+''.join(f'- {x}\n' for x in e[lang])
    open(os.path.join(outdir,fn),'w',encoding='utf-8').write(md)
import shutil
if os.path.exists(os.path.join(src,'ocr.js')): shutil.copyfile(os.path.join(src,'ocr.js'),os.path.join(outdir,'ocr.js'))
print('ok')
