# Le Grand Duel des cartes : images à générer (chapitre 1)

**État :** les 7 images ont été générées et intégrées au jeu. Les fichiers d'origine sont dans `images/sources/`, et `construire.ps1` les recadre et les nomme. La colonne « État dans le jeu » ci-dessous date d'avant l'intégration. Ces descriptions restent utiles pour regénérer une image.

Chaque description se copie telle quelle dans le générateur d'images : elle contient déjà le style.

**Pour garder le même style :** joignez à chaque demande une image existante comme référence, par exemple `images/sources/portrait_monclair.png` pour une scène et `images/sources/Storyboard aquarelle entre mer et mémoire.png` pour un portrait.

## Récapitulatif

| Fichier à déposer dans `images/` | Format | État dans le jeu |
|---|---|---|
| `scene_salle_cartes` (.png ou .jpg) | Paysage 3:2 (1536 × 1024) | Lu automatiquement, remplace le dessin provisoire |
| `scene_plateau` | Paysage 3:2 (1536 × 1024) | Lu automatiquement, fond de l'écran de diffusion |
| `portrait_lacote` | Carré (1024 × 1024) | Lu automatiquement, remplace l'initiale |
| `portrait_bruno` | Carré (1024 × 1024) | Lu automatiquement, remplace l'initiale |
| `portrait_sacha` | Carré (1024 × 1024) | **Pas encore lu**, proposition à valider |
| `objet_bertha` | Carré (1024 × 1024) | **Pas encore lu** |
| `scene_montage` | Paysage 3:2 (1536 × 1024) | **Pas encore lu** |

Après le dépôt des images, lancez `construire.ps1` pour reconstruire `jeu.html`.

---

## Scènes

### 1. `scene_salle_cartes`

**Point important :** la salle doit être vide. Le jeu pose lui-même les portraits de M. Lacote, de Montclair et de Bruno par-dessus le décor, et un personnage peint apparaîtrait en double. Les éléments doivent aussi rester aux emplacements indiqués, car les zones cliquables y sont déjà calées.

```text
Illustration de décor pour un jeu d'aventure en point-and-click, tout public, au format paysage 3:2 (1536 × 1024). Style roman graphique : encre fine et aquarelle, couleurs chaudes et légèrement désaturées. Aucun personnage. Aucun texte lisible, aucune lettre, aucun chiffre.

Une grande salle de lecture ancienne et fictive à Paris, boisée, très calme, dédiée aux cartes anciennes, vue de face à hauteur d'œil, à la lumière tamisée.

Disposition précise :
- à gauche, dans le cinquième gauche de l'image, à mi-hauteur : de grands meubles à plans en bois, à larges tiroirs plats avec poignées en laiton ;
- au centre gauche, au premier plan, du quart de la largeur jusqu'aux trois cinquièmes, dans le bas de l'image : une longue table de lecture en bois, avec une grande feuille de parchemin vierge posée à plat et un carton d'archives fermé ;
- sur cette table, vers le tiers gauche de l'image : une lampe de bibliothèque à abat-jour vert, allumée, dont l'abat-jour se situe à mi-hauteur de l'image ;
- à droite, du deux tiers de la largeur jusqu'au bord, dans le tiers bas : un comptoir de bibliothèque en bois sombre, vu de face, portant trois petites molettes de laiton côte à côte ;
- au bout droit de ce comptoir : un petit pot en métal rempli de vieux stylos ;
- en haut à droite, sur le mur, au-dessus du comptoir : un grand panneau de règlement encadré, couleur crème, entièrement vierge ;
- derrière le comptoir et derrière la table : un espace libre, sobre et un peu sombre, avec un mur de boiseries, sans aucun objet important, car des personnages y seront ajoutés.

Atmosphère solennelle, un peu comique par son excès de sérieux, comme une salle où l'on n'ose pas respirer.
```

### 2. `scene_plateau`

Cette image sert de fond à l'écran des résultats : le titre et les deux jauges s'affichent par-dessus, au centre.

```text
Illustration de décor pour un jeu d'aventure en point-and-click, tout public, au format paysage 3:2 (1536 × 1024). Style roman graphique : encre fine et aquarelle. Aucun personnage. Aucun texte lisible, aucune lettre, aucun chiffre.

Un plateau de télévision clinquant et vide, vu de face, juste avant le direct : grand écran géant allumé sur un dégradé doré sans image, rampes de projecteurs dorés, sol brillant, fauteuil de présentateur un peu trop luxueux, caméras de studio sur pied sur les côtés.

Composition : le centre de l'image reste sombre et calme, sans détail marqué, pour accueillir du texte clair en surimpression. La lumière et les détails se concentrent sur les bords et dans le haut. Ambiance de grand spectacle légèrement ridicule, tons or, ambre et noir profond.
```

### 3. `scene_montage` (pas encore lue par le jeu)

```text
Illustration de décor pour un jeu d'aventure en point-and-click, tout public, au format paysage 3:2 (1536 × 1024). Style roman graphique : encre fine et aquarelle. Aucun personnage. Aucun texte lisible, aucune lettre, aucun chiffre.

Une petite salle de montage de télévision, sombre et encombrée, la nuit. Au centre, un grand écran allumé affiche trois grands rectangles lumineux vides, côte à côte. Devant, une table de montage avec un clavier, des boutons et un mug de café. Des piles de cartons d'archives sur les côtés, une lampe de bureau basse. Ambiance studieuse et tardive, tons bleu nuit et ambre.
```

---

## Portraits

Ils s'affichent en petit (environ 70 pixels dans les dialogues) : le visage doit être lisible et bien cadré.

### 4. `portrait_lacote`

```text
Portrait de personnage fictif pour un jeu d'aventure tout public, format carré (1024 × 1024). Style roman graphique : encre fine et aquarelle. Cadrage en buste, visage bien centré, fond sombre uni. Aucun texte.

M. Lacote, bibliothécaire fictif d'une soixantaine d'années, très maigre, lunettes demi-lune posées bas sur le nez, blouse grise impeccable, gants de coton blanc, mains jointes. Il regarde le spectateur par-dessus ses lunettes avec une expression à la fois polie et menaçante. Effet comique discret : on sent qu'il va vous demander votre stylo.
```

### 5. `portrait_bruno`

```text
Portrait de personnage fictif pour un jeu d'aventure tout public, format carré (1024 × 1024). Style roman graphique : encre fine et aquarelle. Cadrage en buste, visage bien centré et entièrement visible, fond sombre uni. Aucun texte, aucun logo.

Bruno, cadreur de télévision fictif d'une quarantaine d'années, fatigué, barbe de deux jours, casquette usée, caméra moderne posée sur l'épaule mais sans cacher le visage. Il regarde le spectateur avec un regard plein de résignation, sympathique malgré tout : un homme qui en a vu d'autres et qui s'en excuse.
```

### 6. `portrait_sacha` (proposition à valider, pas encore lue par le jeu)

Sacha n'a pour l'instant ni portrait ni description : cette apparence est donc un **ajout fictif à valider**. Elle reste volontairement neutre, puisque le prénom a été choisi parce qu'il convient à tous.

```text
Portrait de personnage fictif pour un jeu d'aventure tout public, format carré (1024 × 1024). Style roman graphique : encre fine et aquarelle. Cadrage en buste, visage bien centré, fond sombre uni. Aucun texte.

Sacha, jeune documentaliste de télévision d'environ 25 ans, à l'allure volontairement androgyne, cheveux châtains courts un peu en désordre, veste de toile bleue pratique, petite oreillette discrète, carnet glissé dans la poche. Regard vif et curieux, léger sourire en coin, l'air de quelqu'un qui vient de remarquer une erreur dans ce qu'on lui raconte.
```

---

## Objet

### 7. `objet_bertha` (pas encore lue par le jeu)

```text
Illustration d'un objet pour un jeu d'aventure tout public, format carré (1024 × 1024). Style roman graphique : encre fine et aquarelle. Fond neutre clair et uni, objet entièrement visible et centré. Aucun personnage. Aucun texte lisible, aucune lettre, aucun logo.

Bertha, une très vieille caméra de reportage d'épaule en métal et cuir, massive, cabossée, surnommée « un monstre de métal et de cuir ». Elle est couverte d'autocollants d'un autre siècle, décolorés, ornés de simples formes colorées sans aucune écriture. Un petit voyant rouge sur le côté. Malgré son âge, elle a quelque chose d'attachant, comme une vieille mule fidèle.
```

---

## À vérifier sur les images obtenues

- **Texte parasite :** les générateurs ajoutent souvent de fausses lettres, surtout sur le panneau, les autocollants et l'écran.
- **Salle des cartes :** aucun personnage, et les meubles, la table, le comptoir et le panneau aux emplacements demandés. Si le résultat s'en écarte, les zones cliquables peuvent être recalées dans le jeu.
- **Personnes réelles :** tous ces personnages sont inventés et ne doivent ressembler à personne de connu.

---

## 8. `scene_redaction` (à regénérer, sans Montclair)

Le jeu pose lui-même Montclair, en pied, au centre droit de l'image. Le décor doit donc laisser cette zone libre. Les autres éléments sont à garder aux emplacements indiqués, car les zones cliquables y sont calées. Joindre le portrait d'Hélène (`images/sources/Storyboard aquarelle entre mer et mémoire.png`, premier visage) et, pour le style, l'ancien décor `images/sources/portrait_monclair.png`.

```text
Illustration de roman graphique européen, encrage fin et aquarelle, palette sourde et réaliste, éclairage de film d'enquête, atmosphère sérieuse et légèrement mélancolique, époque contemporaine. Aucun texte, aucune lettre, aucun logo, aucune signature, aucun filigrane. Personnages adultes aux proportions réalistes, sans caricature. Format paysage 3:2 (1536 × 1024).

Open space d'une société de production parisienne au sixième étage, en fin de journée : moquette grise, écrans allumés sur des chaînes muettes, grande baie vitrée sur les toits de Paris, la tour Eiffel au loin. Une seule personne dans l'image : Hélène Vasseur (portrait joint), une femme d'une soixantaine d'années, assise à sa table.

Disposition précise, à respecter :
- à gauche, dans le premier sixième de la largeur, à mi-hauteur : un poste de visionnage avec un grand écran allumé ; dessous, une console avec une télécommande posée dessus et un petit boîtier ;
- en haut à gauche : une plante verte ; à travers la vitre, la tour Eiffel, vers le quart gauche de l'image ;
- en haut, entre le tiers et la moitié de la largeur : une affiche de film sans aucun texte, collée sur la vitre ;
- sous l'affiche, à mi-hauteur : un petit écran sur un meuble, à côté d'une rangée de classeurs ;
- en bas, au même niveau horizontal que l'affiche : un placard bas fermé ;
- en bas à gauche, au premier plan : une pile de magazines, un pot à crayons et un casque audio posés sur un bureau ;
- à droite, dans le cinquième droit de l'image : un bureau vitré resté ouvert, où Hélène Vasseur est assise à sa table ;
- au centre droit (de la moitié aux trois quarts de la largeur, sur toute la hauteur) : un espace dégagé, moquette et baie vitrée seulement, sans meuble ni personne, car un personnage y sera ajouté.
```

Après génération : déposez l'image dans `images/sources/` et dites-le-moi. Je remplacerai le décor retouché, retirerai les retouches de `detourer.ps1` et recalerai les zones cliquables si besoin.
