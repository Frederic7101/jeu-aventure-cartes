"use strict";
/* Toutes les répliques du chapitre. Locuteurs : S Sacha, H Hélène, O Hélène dans l'oreillette, M Montclair,
   B Bruno, L Lenoir, K M. Lacote, d didascalie (non comptée dans le carnet). */
const D = {
  /* ---------- ouverture ---------- */
  'ouverture': [
    ['d', 'Plateau télé, lumière dorée. Une affiche géante : « LES CARTES OUBLIÉES 2 : CE QU\'ON VOUS CACHE ENCORE ». Valère Montclair sourit à la caméra.'],
    ['M', 'Vous avez aimé mes questions ? Vous allez adorer mes questions suivantes.']
  ],
  'ouverture2': [
    ['d', 'Une salle de rédaction, en fin de journée. Hélène Vasseur relève la tête en vous voyant arriver, portant deux cafés.'],
    ['H', 'Tu as vu ?'],
    ['S', 'J\'ai vu.'],
    ['H', 'Quatre millions de spectateurs. Moi, la dernière fois, c\'est ma mère qui a appelé. Pour se plaindre du son.']
  ],
  'accueil': [
    ['H', 'Mais finalement, la chaîne accepte que je propose mon propre documentaire ! Elle me demande trois séquences, et elle comparera avec ce que proposera ce crétin de Montclair.'],
    ['H', 'Tu trouves, tu vérifies, tu filmes. Je monte, je présente, je gagne. Pour la première fois depuis 2009, je souris.'],
    ['S', 'Et si on perd ?'],
    ['H', 'Tu travailleras pour lui. Et tu lui tiendras son écharpe.'],
    ['d', 'Elle vous tend une oreillette.'],
    ['O', 'Tu m\'entends ? Regarde son film sur le grand écran. La télécommande est sur la console. Trouve-moi ce qui cloche, puis reviens me voir.']
  ],

  /* ---------- rédaction : examiner ---------- */
  'eiffel': [['S', 'La tour Eiffel. Vue imprenable.'], ['O', 'C\'est pour ça que le loyer est plus élevé que nos salaires.']],
  'plante': [['S', 'Elle a l\'air en forme.'], ['O', 'C\'est la seule ici qui ait des racines vérifiables.']],
  'affiche': [['d', 'Une affiche de film : des montagnes, une rivière, un ciel d\'orage. Pas un mot dessus.'], ['S', 'Même pas de titre ?'], ['O', 'Le seul film d\'ici qui ne promet rien. Je l\'aime bien.']],
  'magazines': [['d', 'Montclair en couverture, cinq fois.'], ['S', 'Même veste. Même sourire.'], ['O', 'Même absence de sources.']],
  'crayons': [['S', 'Des crayons, et un stylo qui a l\'air de bien marcher.'], ['O', 'Rien de secret. Prends l\'habitude de vérifier quand même.']],
  'crayons_vide': [['S', 'Il ne reste que des crayons mâchouillés.']],
  'stylo_pris': [['S', 'Je prends le stylo. On ne sait jamais.'], ['O', 'Tu le rendras. Il est à la régie.']],
  'console_r': [['S', 'La console. La télécommande du grand écran est posée dessus.']],
  'console_vide': [['S', 'La console, sans sa télécommande. Elle a l\'air un peu nue.']],
  'mixage_r': [['S', 'Une table de mixage. Une clé USB est branchée dessus.']],
  'mag_prendre': [['S', 'Je n\'ai pas besoin de cinq fois le même sourire.']],
  'pot_prendre': [['K', 'Ces stylos sont en garde à vue. Pas en libre-service.']],
  'pot_l_prendre': [['L', 'Pas celui-là. Il enregistre.']],
  /* ---------- regarder un objet de l'inventaire ---------- */
  'r_cafe': [['S', 'Mon café. Froid depuis trois jours, mais c\'est le mien.']],
  'r_stylo': [['S', 'Un stylo. Fermé. Pour l\'instant.']],
  'r_telecommande': [['S', 'La télécommande du grand écran. Il y a deux piles dedans.']],
  'r_cle': [['S', 'Une petite clé. Hélène a dit : le caisson gris, au milieu de l\'open space.']],
  'r_bertha_vide': [['d', 'Un monstre de métal et de cuir. Le logement des piles est vide.']],
  'r_bertha_ok': [['d', 'Bertha. Son voyant rouge est allumé.'], ['S', 'Elle tient le coup. Pour l\'instant.']],
  'r_usb': [['S', '« ÉPISODE 112 : ILS ÉTAIENT PARTOUT ». Quatre heures de podcast.'], ['O', 'Je connais quelqu\'un que ça passionnerait. Il porte une écharpe.']],
  'r_gants': [['S', 'Des gants de coton. Un peu petits. Obligatoires.']],
  'casque': [['S', 'On entend encore le générique de son film.'], ['O', 'Enlève ça. Ça s\'attrape.']],
  'petit_ecran': [['d', 'Des éléphants sous un acacia, sans le son.'], ['S', 'Eux, au moins, ne commentent pas.'], ['O', 'Montclair leur trouverait un complot.']],
  'placard_ferme': [['S', 'Fermé.'], ['O', 'Pour une fois que quelque chose est en sécurité ici.']],
  'placard_vide': [['S', 'Il ne reste plus que de la poussière.'], ['O', 'Ne la filme pas. Il y en a qui en feraient un épisode.']],
  'boitier': [['S', 'Cette enceinte a l\'air de tout entendre.'], ['O', 'Non, tu ne peux pas l\'interviewer. Elle a pourtant plus de rigueur que lui.']],
  'telecommande_prise': [['S', 'La télécommande du grand écran. Je la prends.']],
  'telecommande_deja': [['S', 'Je l\'ai déjà. Et je n\'en ai pas trouvé d\'autre.']],
  'ecran_sans': [['S', 'Il me faut la télécommande. Elle doit être sur la console.']],
  'ecran_sans_piles': [['S', 'Bon. La télévision vient de prendre sa retraite.'], ['O', 'Une bonne nouvelle, enfin.']],
  'ecran_vu': [['S', 'J\'ai trouvé ses trois ruses. Je peux filmer l\'écran, maintenant.'], ['O', 'Prends Bertha. Si elle veut bien.']],

  /* ---------- Montclair à la rédaction ---------- */
  'mc_intro': [['d', 'Il attend, les mains dans les poches, comme s\'il posait pour une statue.'], ['M', 'Ah ! Le petit documentaliste d\'Hélène. Ne vous excusez pas d\'exister, j\'adore la concurrence. Ça me fait de belles images.']],
  'mc_a': [['M', 'Enfin, quelqu\'un de sérieux ! Je pars de faits. Toujours. Ensuite, je pose des questions. Et je laisse le public croire qu\'il a trouvé la réponse tout seul.'], ['O', 'Ne le flatte pas. Son ego n\'a pas besoin de vitamines.'], ['S', 'Note pour plus tard : il croit tout ce qui lui fait plaisir.']],
  'mc_b': [['M', 'Des sources. Beaucoup. Des très bonnes.'], ['S', 'Lesquelles ?'], ['M', 'Vous me demandez ça devant tout le monde ?'], ['S', 'Il n\'y a que nous deux.'], ['M', 'Justement. Il faut que ça reste entre nous.']],
  'mc_c': [['d', 'Il hésite une demi-seconde. C\'est la première fois de sa carrière.'], ['M', 'Je ne suis pas chimiste. Et personne n\'a jamais fait d\'audience avec du titane.']],
  'mc_d': [['M', 'Merci. Elle a son propre agent.']],
  'mc_bertha': [['M', 'Oh, comme c\'est touchant. C\'est pour un musée ?']],

  /* ---------- le film sur pause ---------- */
  'film_intro': [['d', 'Tempête, parchemin sous une lampe, voix grave. Quand une phrase vous semble louche, appuyez sur Pause. Sinon, passez à la suite.']],
  'film_passe': [['O', 'Tu laisses filer ? Il y avait peut-être quelque chose, là-dedans. Tant pis pour nous.']],
  'ecran_vu2': [['S', 'J\'ai vu tout son film. Je n\'ai pas tout relevé, mais je peux filmer l\'écran.'], ['O', 'Prends Bertha. Et la prochaine fois, ouvre l\'œil.']],
  'r1_ok': [['S', 'Si j\'écris un mot aujourd\'hui sur une vieille feuille, le mot n\'a pas 500 ans.'], ['O', 'Note-le. Mais pas sur une vieille feuille.']],
  'r1_a': [['O', 'Il existe. Ne deviens pas lui.']],
  'r1_b': [['O', 'Ça, c\'est un crime, mais pas celui qu\'on cherche.']],
  'r2_ok': [['S', 'Difficile d\'annoncer ce qui s\'est déjà passé.'], ['O', 'Pas pour lui. Il annonce aussi les matchs de la veille.']],
  'r2_a': [['O', 'Si, il y en a eu. C\'est bien ce qui rend sa ruse maligne : il colle un faux sur un vrai.']],
  'r2_b': [['O', 'Tu as dormi cette nuit ?']],
  'r3_ok': [['S', 'C\'est comme dire que l\'hiver arrive « soudain » en décembre.'], ['O', 'Je vais te laisser écrire les titres. Pas les textes.']],
  'r3_a': [['O', 'Yale apprécierait moyennement.']],
  'r3_b': [['O', 'Oui. Mais on ne gagne pas là-dessus.']],
  'film_fin': [['O', 'Pas mal. Viens me voir, j\'ai quelque chose pour toi. Ne t\'emballe pas, ce n\'est pas une augmentation.']],
  'film_fin2': [['O', 'Tu n\'as pas tout relevé. Tant pis, on fera avec. Viens me voir, j\'ai quelque chose pour toi.']],

  /* ---------- Hélène ---------- */
  'he_attend': [['H', 'Je t\'ai demandé de trouver ce qui cloche dans son film. Le grand écran, à gauche. La télécommande est sur la console.']],
  'he_cle': [['H', 'Dans le caisson gris, au milieu de l\'open space. Tout le matériel est parti chez lui. Il me reste celle-là.'], ['d', 'Elle vous tend une petite clé.']],
  'he_bertha': [['H', 'Le caisson gris, je te dis. Et ne lui parle pas mal, elle est sensible.']],
  'he_piles': [['H', 'Elle marche à piles. Regarde autour de toi. Non, je n\'ai pas de budget.']],
  'he_pistes': [['O', 'Deux pistes. Lenoir, le type du podcast, au sous-sol d\'une librairie derrière la gare de l\'Est : je ne l\'aime pas, mais il a parfois de drôles de tuyaux. Et la salle des cartes : il y a là le fac-similé et le dossier de Yale.'], ['O', 'Choisis. Le bouton « Plan de Paris » est en haut. Montclair, lui, a déjà choisi : il va là où il y a du monde.']],
  'he_manque': [['H', 'Il me faut trois séquences. Pas deux. Trois. Tu peux aussi filmer ses ruses sur le grand écran, avant que je le regrette.']],
  'he_pret': [['H', 'Tu as ce qu\'il faut ? Alors on passe au montage. Une fois là-bas, on ne revient plus chercher quoi que ce soit.']],

  /* ---------- placard et Bertha ---------- */
  'placard_ouvert': [['d', 'Un monstre de métal et de cuir, couvert d\'autocollants d\'un autre siècle.'], ['S', 'C\'est une caméra ou une arme de siège ?'], ['O', 'C\'est Bertha. Elle a couvert trois élections et un tremblement de terre. Elle ne marche plus depuis mardi.']],
  'bertha_vide': [['d', 'Clic.'], ['S', 'Plus de piles.']],
  'bertha_on': [['d', 'Sacha transfère les piles de la télécommande. Bertha s\'allume dans un bruit de moulin à café fatigué.'], ['O', 'Tu l\'entends ? Elle est contente.'], ['S', 'Tout l\'immeuble l\'entend.']],
  'classeurs': [['S', 'Ça fait beaucoup de classeurs.'], ['O', '« Archives presse ». Le seul endroit ici où les gens lisent encore.'], ['d', 'Vous tournez les pages : « Carte du Vinland : apparue sur le marché en 1957, vendue par un marchand. »'], ['S', 'Et avant 1957 ?'], ['O', 'Personne ne sait. C\'est écrit juste là. Admire : quelqu\'un qui écrit « personne ne sait ». Ça existe.']],
  'classeurs_vu': [['S', 'Carte apparue en 1957. C\'est noté.'], ['O', 'Tu vois, on peut être d\'accord.']],
  'film_ruses': [['d', 'Bertha ronronne devant le grand écran. Sacha filme les trois passages du film, et ses propres notes.'], ['S', 'Prise bouclée : « Les ruses du film ».'], ['O', 'Filmer sa télé. On en est là. Mais c\'est bien.']],
  'pas_bertha': [['S', 'Je ne sais pas si Bertha survivrait à ça.'], ['O', 'Elle a survécu à un tremblement de terre. Mais pas à tes idées, peut-être.']],

  /* ---------- fil de Montclair ---------- */
  'fil2': [['O', 'Il se filme dans la voiture. Bruno conduit.']],
  'fil5': [['O', 'Il va chez Lenoir. Dépêche-toi, ou ne te dépêche pas, mais fais-le bien.']],
  'fil8': [['O', 'Ils se sont trouvés, ces deux-là.']],
  'fil11': [['O', 'Il arrive à la salle des cartes.']],

  /* ---------- sous-sol de Lenoir ---------- */
  'le_avant': [['L', 'Vous êtes suivi ?'], ['S', 'Non.'], ['L', 'C\'est exactement ce que dirait quelqu\'un qui est suivi.']],
  'le_apres': [['d', 'Une serviette en papier est punaisée au mur, signée de Montclair.'], ['L', 'Vous avez raté un grand homme. Il a dit que j\'avais un regard de lanceur d\'alerte.'], ['S', 'Il vous a filmé ?'], ['L', 'Il m\'a fait signer une exclusivité. Là, sur la serviette.'], ['S', 'Une serviette, ça ne vaut rien.'], ['L', 'C\'est ce qu\'ils veulent vous faire croire.'], ['O', 'Tout ce que tu filmes ici sera déjà passé chez lui. Ça ne fera plus le même effet.']],
  'le_camera': [['L', 'Pas de caméra ici. Elles sont toutes connectées.']],
  'le_bertha': [['d', 'Il tourne autour. Il tapote le cuir. Il renifle.'], ['L', 'Pas de Wi-Fi ?'], ['S', 'Non.'], ['L', 'Pas de Bluetooth ?'], ['S', 'Elle n\'a pas de mémoire non plus. Elle a à peine des souvenirs.'], ['L', 'Enfin. Une caméra honnête.'], ['O', 'Tu vois ? C\'est la première fois que quelqu\'un dit du bien de Bertha.']],
  'le_tel': [['S', 'Et avec mon téléphone ?'], ['L', 'Posez-le dans le frigo.'], ['S', 'Vous avez un frigo ?'], ['L', 'Je n\'ai pas le droit de répondre.']],
  'le_menu': [['L', 'Posez vos questions. Ou ne les posez pas : ça revient au même, ils écoutent.']],
  'micro': [['S', 'Il est branché ?'], ['L', 'Toujours. Non, je plaisante. Peut-être.']],
  'casque_l': [['S', 'Une voix répète « demandez-vous pourquoi ».'], ['L', 'C\'est mon jingle.']],
  'pot_l': [['S', 'Des stylos.'], ['L', 'Ne les comptez pas. Ils n\'aiment pas ça.']],
  'livres': [['S', 'Vous les avez tous lus ?'], ['L', 'J\'ai lu leurs titres. Avec beaucoup d\'attention.']],
  'cartons': [['S', 'Il y a quoi là-dedans ?'], ['L', 'Si je vous le disais, il faudrait que je le découvre.']],
  'lampes': [['S', 'Jolie lumière.'], ['L', 'C\'est pour qu\'on ne voie pas ce qu\'il y a dans l\'ombre.'], ['S', 'Il y a quoi dans l\'ombre ?'], ['L', 'Vous voyez, ça marche.']],
  'ordi': [['d', 'Écran de veille : « ILS SAVENT ».'], ['S', 'Ils savent quoi ?'], ['L', 'Mon mot de passe, sûrement. C\'est aussi « ILS SAVENT ».']],
  'serviette': [['S', 'Une exclusivité mondiale. Sur une serviette. Avec une tache de moutarde.'], ['L', 'Ce n\'est pas de la moutarde.'], ['S', 'C\'est quoi ?'], ['L', 'C\'est de la moutarde. Mais vous y avez cru une seconde.']],
  'epingle112': [['d', 'Petit papier : « Voir épisode 112. »']],
  'epingle87': [['d', 'Petit papier : « Voir épisode 87 », qui renvoie à l\'épisode 112.']],
  'epingles_toutes': [['S', 'Toutes vos preuves renvoient à votre émission.'], ['L', 'Parce que tout est dedans !'], ['O', 'Il se cite lui-même. Je me demande où il a appris ça.']],
  'coupure_trouvee': [['d', '« Enzo Ferrajoli, le marchand qui a mis la carte sur le marché en 1957, a plus tard été condamné pour vol de livres et de manuscrits dans une bibliothèque de Saragosse. Les disparitions signalées datent de 1960 à 1965. Une partie des auteurs le présente comme un bouc émissaire. »'], ['S', 'Ça, c\'est un vrai article.'], ['L', 'Je n\'invente rien ! Filmez ça ! Dites-le à tout le monde !']],
  'casier': [['L', 'Le marchand ? Un voleur ! Condamné ! Et c\'est à lui qu\'on a acheté la carte ! Alors, qui dit la vérité ?'], ['d', 'C\'est excellent à l\'écran. On n\'a rien vérifié.'], ['O', 'C\'est du Montclair. Avec un moins beau pull.']],
  'dates': [['S', 'Les vols datent de 1960 à 1965. La carte, elle, est vendue en 1957.'], ['L', 'Et alors ?'], ['S', 'Alors ce qu\'il a volé plus tard ne dit rien de cette carte.'], ['L', 'Il a bien fallu qu\'il commence quelque part.'], ['S', 'Peut-être. Et ça dit quoi de l\'encre ?'], ['d', 'Long silence. Une ampoule grésille.'], ['L', 'Vous êtes sûr de ne pas être suivi ?'], ['O', 'Garde ça. Garde absolument ça.']],
  'film_fils': [['S', 'C\'est très beau.'], ['L', 'C\'est très vrai.'], ['S', 'J\'ai dit « beau ».']],
  'preuve': [['L', 'Rien ! Ils ont tout détruit ! S\'il n\'y a plus de traces, c\'est bien la preuve.'], ['S', 'Donc s\'il y a des traces, vous avez raison. Et s\'il n\'y en a pas, vous avez raison aussi.'], ['L', 'Vous voyez, vous commencez à comprendre.']],
  'cle_usb': [['d', 'Une clé marquée « ÉPISODE 112 : ILS ÉTAIENT PARTOUT ».'], ['S', 'Je peux l\'emprunter ?'], ['L', 'Prenez. J\'en ai des centaines. Diffusez la vérité.'], ['O', 'Pourquoi tu prends ça ?'], ['S', 'On ne sait jamais.'], ['O', 'Tu commences à parler comme lui.']],
  'table_mixage': [['S', 'Beaucoup de boutons. Aucun ne s\'appelle « Vérifier ».'], ['L', 'C\'est celui du milieu. Il n\'est pas branché.']],
  'japon': [['L', 'La logique ! Des gens qui traversent l\'Atlantique ne s\'arrêtent pas à Terre-Neuve !'], ['S', 'Vous avez un nom de site ? Un objet ?'], ['L', 'J\'ai beaucoup mieux : j\'ai une intuition.']],
  'deja_filme': [['S', 'J\'ai déjà ce qu\'il me faut, ici.']],

  /* ---------- salle des cartes ---------- */
  'sc_accueil': [['K', 'Bonjour. Vous parlez trop fort.'], ['S', 'Je n\'ai encore rien dit.'], ['K', 'Vous alliez le faire.']],
  'sc_panneau': [['d', '« SILENCE. PAS DE STYLO. PAS DE CAFÉ. PAS D\'OPINION. »'], ['O', 'Le dernier, c\'est pour Montclair. Ils l\'ont ajouté récemment.']],
  'sc_stylo': [['K', 'Le stylo, s\'il vous plaît.'], ['S', 'Il est fermé.'], ['K', 'Il a des intentions.'], ['d', 'Il le range dans son pot, avec les autres.']],
  'sc_cafe': [['K', 'Et ça ?'], ['S', 'C\'est mon café.']],
  'sc_cafe_bu': [['d', 'Sacha le finit d\'un trait. Il est froid depuis trois jours.'], ['K', 'Bien.']],
  'sc_cafe_jete': [['K', 'Non merci !'], ['d', 'Il prend le gobelet du bout des doigts et s\'en débarrasse aussitôt.']],
  'sc_gants': [['d', 'Il vous tend une paire de gants de coton.'], ['S', 'Ils sont un peu petits.'], ['K', 'Ils ne sont pas là pour votre confort.']],
  'sc_demande': [['K', 'Que désirez-vous ?'], ['S', 'Le dossier sur la carte du Vinland.'], ['K', 'Quelle cote ?'], ['S', 'Vous ne pouvez pas chercher ?'], ['K', 'Si je cherchais pour tout le monde, où irions-nous ? Le règlement est sur le comptoir, avec les molettes.']],
  'sc_cote_rappel': [['K', 'Les molettes. Sur le comptoir. Avec calme.']],
  'sc_sans_regles': [['K', 'Pas avant le règlement. Venez d\'abord me voir.']],
  'sc_sans_date': [['S', 'Il me manque l\'année d\'apparition sur le marché.'], ['O', 'Les classeurs, à la rédaction. Ou chez Lenoir. On ne te paie pas pour deviner.']],
  'c_a': [['K', 'A, c\'est l\'Amérique. Tout un continent. Votre carte montre un lieu plus précis.']],
  'c_g': [['K', 'G, le Groenland. Il est bien sur votre carte. Mais elle est célèbre pour une terre plus à l\'ouest.']],
  'c_f': [['K', 'F, Frisland. Une île qui n\'a jamais existé, mais qu\'on a dessinée pendant plus d\'un siècle. Ce n\'est pas votre dossier.'], ['d', 'Il pose tout de même une grande carte sur la table.'], ['K', 'Mercator, 1595. Elle y figure. Puisque vous aimez les îles.']],
  'c_1965': [['K', '1965, c\'est quand on l\'a présentée au public, pas quand elle est apparue chez les marchands. Mais voici le livre de 1965, puisque vous y êtes.']],
  'c_1492': [['K', '1492, c\'est Colomb. Votre carte, elle, est apparue chez les marchands bien plus tard.']],
  'c_1558': [['K', '1558, c\'est une autre carte du Nord, celle qu\'on attribue aux frères Zeno, publiée à Venise. Pas la vôtre.']],
  'c_1960': [['K', '1960, c\'est l\'année où l\'on a trouvé un site viking à Terre-Neuve. Votre carte était déjà sur le marché.']],
  'c_65': [['K', '65 ? En 1965, on a présenté la carte au public. Le règlement demande l\'année de la dernière analyse, celle qui a tranché.']],
  'c_87': [['K', '87 ? Une analyse des années 1980 a bien trouvé très peu de titane. Mais ce n\'est pas la dernière. Je veux celle qui a tranché.']],
  'c_95': [['K', '95 ? Je n\'ai aucune analyse de cette année-là dans ce dossier. La dernière, celle qui a tranché, est plus récente.']],
  'c_autre': [['K', 'Ceci n\'existe pas. Je suis désolé pour vous.']],
  'c_aide': [['O', 'Rouvre ton carnet. Une lettre, une date de vente, une année d\'analyse. Tu as tout.']],
  'c_ok': [['d', 'Il revient très lentement, avec un carton, le fac-similé et le dossier.'], ['K', 'La table du milieu. Avec les gants. Et en silence.']],
  'sc_avance': [['O', 'Il est en route. Filme. Vite. Mais bien.']],
  'mc_arrive': [['d', 'Les portes s\'ouvrent. Deux projecteurs, une écharpe, un cadreur.'], ['M', 'Mesdames et messieurs, je me trouve dans un lieu que peu d\'hommes…'], ['K', 'Monsieur.'], ['M', '… un lieu où l\'on cache…'], ['K', 'Monsieur. Vous parlez trop fort.'], ['M', 'Je cherche le parchemin mystère. Oh, c\'est celui-là ? Bruno, gros plan !'], ['d', 'Il se plante derrière l\'unique table, juste au-dessus du fac-similé.'], ['B', 'Désolé.']],
  'mc_table': [['M', 'Ne touchez à rien, je suis en train de découvrir quelque chose.'], ['O', 'Il faut le faire partir de cette table. Observe-le. Écoute-le. Il a des points faibles : il a surtout ça.']],
  'mc_sc': [['M', 'Ah, encore vous ! Un conseil de confrère : à la télévision, personne ne lit le dossier.']],
  'mc_poche': [['d', 'Un beau stylo doré dépasse de sa poche.'], ['S', 'Il a un stylo. Ici. Sur lui.'], ['O', 'Va raconter ça au monsieur du comptoir. Je veux tout entendre.']],
  'sol_a': [['S', 'Tenez. On m\'a dit que ça ne devait surtout pas sortir.'], ['M', '« Ils étaient partout ». Partout ? Bruno ! Partout ! Annule tout, on part au Japon !'], ['d', 'Il sort en courant. Le fac-similé reste sur la table, un peu froissé.'], ['O', 'Tu viens de lui donner quatre heures de Lenoir. Je t\'aime presque.']],
  'sol_b': [['S', 'Pardon. Monsieur a un stylo.'], ['d', 'Silence absolu. M. Lacote se lève pour la première fois de la journée.'], ['K', 'Monsieur. Vous avez des intentions.'], ['M', 'Vous savez qui je suis ?'], ['K', 'Quelqu\'un qui sort.'], ['O', 'Je veux ce monsieur dans mon équipe.']],
  'sol_c': [['S', 'Il y a une équipe du 20 heures dehors. Ils demandent un expert à l\'écharpe.'], ['M', 'Ils ont dit « expert » ?'], ['S', 'Ils ont dit « le meilleur ».'], ['M', 'Bruno, ma veste.'], ['B', 'Vous la portez.'], ['M', 'L\'autre.']],
  'sol_c_non': [['S', 'Il y a une équipe du 20 heures dehors.'], ['M', 'Bien essayé. Vous ne m\'avez même pas complimenté sur mon écharpe.']],
  'br1': [['B', '…'], ['S', 'Ça va ?'], ['B', 'Hier, il m\'a fait filmer une brume. Pendant deux heures. Il voulait que ce soit « une brume qui en sait trop ».']],
  'br2': [['S', 'Vous n\'avez jamais voulu lui dire ?'], ['B', 'Une fois. Il a monté ma phrase pour me faire dire le contraire.']],
  'br3': [['B', 'Elle a fait le tremblement de terre, c\'est vrai ?'], ['d', 'Il sort deux piles de sa poche.'], ['B', 'Prends. Il ne vérifie jamais rien, de toute façon.'], ['O', 'Qui est-ce ? Je l\'embauche, lui aussi.']],
  'br4': [['B', '…'], ['S', 'Merci encore.'], ['B', 'Ne le dis à personne. Surtout pas devant une brume.']],
  'prises': [['S', 'Il reste deux prises, peut-être. Après, la vieille Bertha s\'endort.']],
  'prises3': [['S', 'Avec les piles de Bruno, on gagne une prise.']],
  'prises_0': [['d', 'Clic.'], ['S', 'Elle dort. Tout le monde a ses limites.']],
  'et_ok1': [['S', 'Ses trous de vers correspondent à ceux d\'un manuscrit médiéval relié avec elle.']],
  'et_ok2': [['S', 'L\'anatase ressemble à un pigment fabriqué à partir des années 1920. Les encres médiévales, elles, sont riches en fer.']],
  'et_ok3': [['S', 'Yale reconnaît que ces analyses ne disent pas qui a fabriqué ce faux.'], ['O', '« On ne sait pas qui. » Ça, c\'est une phrase à mettre sur une affiche.']],
  'et_ko': [['O', 'Ça, c\'est le titre de son film. Recommence.']],
  'et_fin': [['S', 'Un vieux parchemin, avec une encre moderne. Une carte fausse sur une vraie vieille peau.'], ['O', 'Voilà. Ça tient en une phrase. Et lui, il lui a fallu deux heures pour ne pas la dire.']],
  'et_avant': [['O', 'Ne filme pas ce que tu ne comprends pas. Lis d\'abord le dossier : parchemin, encre, auteur.']],
  'p_yale': [['S', 'C\'est du texte. Des tableaux. C\'est très moche.'], ['O', 'C\'est magnifique.']],
  'p_fac': [['S', 'Celle-là, on la regarderait des heures.'], ['O', 'Et c\'est bien le problème.']],
  'p_livre': [['S', 'Trois grands savants, de beaux tableaux, et aucune analyse de l\'encre.'], ['O', 'Prestigieux et incomplet. C\'est le plus dangereux.']],
  'p_merc': [['S', 'Frisland. Une île que les plus grands ont dessinée. Elle n\'existe pas.'], ['O', 'Copier, ce n\'est pas vérifier. Mets-le sur le mur de la rédaction.']],
  'sc_sortie': [['K', 'Vous rendrez les gants.'], ['S', 'Bien sûr. Merci.'], ['K', 'Vous avez été moins bruyant que je ne le craignais.'], ['O', 'Chez lui, c\'est une déclaration d\'amour.']],
  'sc_k': [['K', 'Oui ?'], ['S', 'Rien. Je vérifiais que vous étiez là.'], ['K', 'Je suis toujours là. C\'est dans le règlement.']],
  'sc_pot': [['S', 'Le pot à stylos de M. Lacote. Il y a des stylos ici depuis 1987.'], ['K', 'Ils attendent leurs propriétaires. Certains ne sont jamais revenus.']],
  'sc_meuble': [['S', 'Des meubles à plans. Des milliers de cartes, à plat.'], ['K', 'Ne les regardez pas trop. Elles s\'usent.']],
  'sc_lampe': [['S', 'Ces lampes vertes sont très belles.'], ['K', 'Elles sont silencieuses. C\'est ce que nous apprécions chez elles.']],

  /* ---------- montage ---------- */
  'mt_intro': [['H', 'Trois cases. Ce qu\'on croit. Ce qu\'on a vérifié. Ce qu\'on ne sait pas. Tu ne mets qu\'une séquence dans chaque. Fais attention à la case du milieu : c\'est elle qui coule les gens.']],
  'mt_yale_verif': [['H', 'Bien. C\'est aride, mais c\'est bien.']],
  'mt_fac_verif': [['H', 'Tu as vérifié qu\'elle est jolie. C\'est tout ce que tu as vérifié.']],
  'mt_fils_verif': [['H', 'Non. Je n\'ai rien à dire. Non.']],
  'mt_dates_inc': [['H', 'Ah. Un marchand condamné, et pourtant, ça ne prouve rien sur la carte. Tu progresses.']],
  'mt_livre_croit': [['H', 'Oui. C\'est exactement ce qu\'on a cru, et de très bonne foi.']],
  'mt_ruses_croit': [['H', 'Montrer ce que les gens ont cru grâce à lui. Bien vu.']],
  'mt_casier_verif': [['H', 'Vérifié par qui ? Par lui ? Avec ce pull ?']],
  'mt_croit': [['H', 'Hum. On verra si ça passe.']],
  'mt_verif': [['H', 'Vérifié, tu es sûr ? Je ne dis rien. Je note.']],
  'mt_inc': [['H', 'Avouer qu\'on ne sait pas. C\'est rare, à la télévision.']],

  /* ---------- diffusion ---------- */
  'dif_cle': [['M', 'Ce soir, une révélation : ils étaient partout ! Je me trouve au Japon.'], ['d', 'Devant un temple en carton. Un passant parle français derrière lui.']],
  'dif_stylo': [['d', 'Sur un trottoir.'], ['M', 'On a voulu me réduire au silence. Dans une bibliothèque. Avec un règlement.']],
  'dif_faux20h': [['d', 'Seul devant un immeuble, la nuit. L\'écran indique : trois heures plus tard.'], ['M', 'J\'attends une équipe du 20 heures. Je pose la question : où sont-ils ? Qui a intérêt à ce qu\'ils ne viennent pas ?']],
  'dif_la': [['M', 'Regardez ce parchemin. Daté. Authentique.'], ['d', 'Gros plan sur M. Lacote qui lui demande de se taire.']],
  'fin_A': [['d', 'Les deux courbes montent. Le téléphone sonne : c\'est la chaîne.'], ['H', 'Ils veulent la suite.'], ['S', 'Et lui ?'], ['H', 'Il a demandé qui étaient nos sources. Je lui ai dit : la passion.'], ['d', 'Elle sourit. On entend un petit bruit de mécanisme rouillé.'], ['S', 'Vous souriez.'], ['H', 'Non. Ne le dis à personne.']],
  'fin_B': [['H', 'Pas d\'audience folle. Mais trois professeurs ont écrit, et ma mère a trouvé le son correct.'], ['S', 'C\'est bien ?'], ['H', 'C\'est le plus beau jour de ma vie. Enfin. Tu vois ce que je veux dire.'], ['M', 'Je tiens à féliciter ma consœur pour son émission. Je ne l\'ai pas regardée, mais on m\'a dit qu\'il y avait des tableaux.']],
  'fin_C': [['d', 'Tout le monde en parle. Hélène reste très calme, ce qui est mauvais signe.'], ['H', 'On a fait un excellent score. Montclair m\'a envoyé des fleurs.'], ['S', 'C\'est gentil, non ?'], ['H', 'Il a écrit : « Bienvenue ». C\'est ta lettre de démission. Je t\'ai épargné la peine de la rédiger. Mais je l\'ai sourcée.']],
  'fin_D': [['d', 'Écran de programmation : « 3 h 05 : LE PILOTE D\'HÉLÈNE VASSEUR, entre deux publicités pour des matelas. »'], ['H', 'Au moins, ma mère dort.'], ['S', 'Je suis désolé.'], ['H', 'Bertha aussi.']],
  'suite': [['d', 'Sacha rend le dossier de Yale. Un petit papier tombe du carton : « Pour le parchemin, demander à A. Penhallow, New Haven. Il a un calque. Il ne vous aimera pas. »'], ['O', 'New Haven. C\'est aux États-Unis, ça. Prends Bertha.'], ['S', 'Elle passe en cabine ?'], ['O', 'Elle ne passe nulle part. Et ne dis pas à Montclair où tu vas.'], ['d', 'Notification : « En route pour New Haven. Je n\'en dirai pas plus. Merci à mon écharpe. »']],

  /* ---------- actions absurdes ---------- */
  'x_plante': [['S', 'Tu sais quelque chose ?'], ['O', 'Elle a plus de sources que lui.']],
  'x_cafe_bertha': [['O', 'Je l\'ai vu. Pose ça.']],
  'x_cafe_mc': [['S', 'Un café, monsieur Montclair ?'], ['M', 'Je ne bois que de l\'eau de source. Une source que je ne citerai pas.']],
  'x_cafe_h': [['d', 'Elle le prend sans lever les yeux.'], ['H', 'Froid. Sucré. Volé à la régie. Parfait.']],
  'x_cafe_l': [['L', 'Qui l\'a préparé ? Non. Ne répondez pas.']],
  'x_cafe_b': [['B', 'Pour moi ? Merci. Depuis ce matin, personne ne m\'avait regardé.']],
  'x_refus_helene': [['H', 'Garde ça. Ce que je veux, ce sont des preuves.']],
  'x_refus_montclair': [['M', 'Merci, mon agent s\'occupe des cadeaux.']],
  'x_refus_lenoir': [['L', 'Qui vous l\'a donné, à vous ? Gardez-le.']],
  'x_refus_lacote': [['K', 'Je ne prends rien. Je prête, sous conditions.']],
  'x_refus_bruno': [['B', 'Garde-le. J\'ai déjà assez à porter. Désolé.']],
  'x_cafe_fils': [['L', 'Vous voyez ? Ils essaient de l\'effacer !']],
  'x_tel_mc': [['S', 'Dommage.'], ['O', 'Essaie encore.']],
  'x_tel_l': [['L', 'Je le savais. Je suis télécommandé.']],
  'x_tel_k': [['d', 'Il baisse encore le son.'], ['S', 'Ah, ça marche.']],
  'x_bertha_eiffel': [['S', 'Bon plan. Pas de preuve.'], ['O', 'Elle ne nous cache rien, celle-là.']],
  'x_gants_mc': [['S', 'Il ne faut surtout pas l\'abîmer.'], ['O', 'Si.']],
  'x_stylo_panneau': [['K', 'Je vous ai vu y penser.']],
  'x_usb_l': [['L', 'Gardez-la. Elle vous trouvera.']],
  'x_usb_k': [['K', 'Qu\'est-ce que c\'est ?'], ['S', 'Quatre heures de podcast.'], ['d', 'Il recule d\'un pas.'], ['K', 'Sortez ça d\'ici.']],
  'x_coupure_mc': [['M', 'Formidable. Vous pouvez me dire juste la partie avec le mot « voleur » ?']],
  'x_coupure_k': [['K', 'Une date, une source, un auteur. Vous pouvez rester.']],
  'x_coupure_h': [['H', 'Une date, un lieu, une nuance. Encadre-la, ça nous changera.']],
  'x_cafe_k': [['K', 'Non merci !'], ['d', 'Il prend le gobelet du bout des doigts et s\'en débarrasse aussitôt.']],
  'x_bertha_k': [['d', 'Bertha ronronne.'], ['K', 'Depuis 1987, personne n\'avait fait ça ici.']],
  'x_defaut1': [['S', 'Je ne vois pas trop ce que ça donnerait.']],
  'x_defaut2': [['S', 'Ça n\'a aucun sens.'], ['O', 'C\'est ce que je me dis tous les soirs devant son émission.']],
  'x_defaut3': [['O', 'Tu cherches, c\'est bien. Mais pas là.']]
};

/* Les trois passages du film (énigme 1) : réponse juste en premier */
const FILM = [
  { cite: '« Un parchemin du XVe siècle, daté au carbone 14. Une carte médiévale. Authentique. Datée par la science. »', rep: [['On a daté le parchemin, pas le dessin.', 'r1_ok', true], ['Le carbone 14 n\'existe pas.', 'r1_a'], ['Sa voix est trop grave.', 'r1_b']] },
  { cite: '« Et en 1960, on découvre à Terre-Neuve les ruines d\'un village viking. Exactement ce que la carte du Vinland annonçait. »', rep: [['Il n\'y a jamais eu de Vikings à Terre-Neuve.', 'r2_a'], ['La carte n\'a été présentée au public qu\'en 1965, après la découverte.', 'r2_ok', true], ['Terre-Neuve n\'existe pas.', 'r2_b']] },
  { cite: '« Alors, en 2021, coup de théâtre : Yale déclare soudain la carte du Vinland fausse. »', rep: [['Yale n\'est pas une vraie université.', 'r3_a'], ['Il prononce mal Yale.', 'r3_b'], ['Ce n\'est pas soudain : on en débattait depuis des décennies.', 'r3_ok', true]] }
];

/* Séquences : [buzz, crédibilité] dans les cases Croit / Vérifié / Inconnu */
const SEQ = {
  ruses: { nom: 'Les ruses du film', v: [[2, 2], [1, 0], [1, -1]] },
  fils: { nom: 'La carte aux fils rouges', v: [[3, 1], [3, -3], [3, -1]], apres: true },
  casier: { nom: 'Le marchand au casier', v: [[3, 0], [3, -2], [2, -1]], apres: true },
  dates: { nom: 'Lenoir et les dates', v: [[2, 1], [2, 2], [2, 3]], apres: true },
  fac: { nom: 'Le fac-similé de la carte', v: [[2, 2], [2, -1], [1, 0]] },
  yale: { nom: 'Le dossier de Yale', v: [[0, -1], [0, 4], [0, 3]] },
  livre: { nom: 'Le livre de 1965', v: [[1, 2], [1, -2], [0, 0]] },
  merc: { nom: 'Mercator et Frisland', v: [[3, 1], [2, 1], [1, 0]] }
};
const CASES = [['croit', 'Ce qu\'on croit'], ['verif', 'Ce qu\'on a vérifié'], ['inc', 'Ce qu\'on ne sait pas']];
const REACT = { yale_verif: 'mt_yale_verif', fac_verif: 'mt_fac_verif', fils_verif: 'mt_fils_verif', dates_inc: 'mt_dates_inc', livre_croit: 'mt_livre_croit', ruses_croit: 'mt_ruses_croit', casier_verif: 'mt_casier_verif' };
const SEUIL = { buzz: 5, cred: 5 };

const OBJETS = {
  cafe: ['☕', 'Café'], telecommande: ['<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" style="display:block"><rect x="10" y="2" width="12" height="28" rx="5" fill="#3a3f45" stroke="#15181b"/><circle cx="16" cy="7.5" r="2.2" fill="#d9483b"/><rect x="12.6" y="12" width="2.6" height="2.2" rx=".6" fill="#c9ced3"/><rect x="16.8" y="12" width="2.6" height="2.2" rx=".6" fill="#c9ced3"/><rect x="12.6" y="16" width="2.6" height="2.2" rx=".6" fill="#c9ced3"/><rect x="16.8" y="16" width="2.6" height="2.2" rx=".6" fill="#c9ced3"/><rect x="12.6" y="20" width="2.6" height="2.2" rx=".6" fill="#c9ced3"/><rect x="16.8" y="20" width="2.6" height="2.2" rx=".6" fill="#c9ced3"/><rect x="13" y="24.5" width="6" height="2.4" rx="1" fill="#7aa6d6"/></svg>', 'Télécommande'], cle: ['🗝️', 'Petite clé'], bertha: ['🎥', 'Bertha'],
  stylo: ['🖊️', 'Stylo'], coupure: ['📰', 'Coupure de presse'], usb: ['<svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" style="display:block"><rect x="1.5" y="10.5" width="10" height="11" rx="1" fill="#cfd4d8" stroke="#6d7276"/><rect x="4" y="13" width="2.5" height="2.5" fill="#4a4f53"/><rect x="4" y="17" width="2.5" height="2.5" fill="#4a4f53"/><rect x="10.5" y="7.5" width="20" height="17" rx="3" fill="#2f6fb0" stroke="#173f66"/><rect x="15" y="12" width="11" height="8" rx="1" fill="#e8eef4"/></svg>', 'Clé USB « Épisode 112 »'], gants: ['🧤', 'Gants de coton']
};

const VRAI = [
  ['Valère Montclair, Hélène Vasseur, Sacha, M. Lacote et Bruno existent.', 'i', 'Inventés pour le jeu.'],
  ['Gaspard Lenoir et son podcast existent.', 'i', 'Inventés pour le jeu.'],
  ['La carte du Vinland est une vraie carte, conservée à Yale.', 'v', 'Elle existe bien, mais c\'est un faux moderne.'],
  ['Yale a annoncé en 2021 qu\'elle était fausse.', 'v', 'Annonce publique, en septembre 2021.'],
  ['Son parchemin est vraiment ancien.', 'v', 'Il date du XVe siècle : c\'est l\'encre qui trahit le faux.'],
  ['L\'encre contient de l\'anatase et peu de fer.', 'v', 'D\'après les analyses publiées par Yale.'],
  ['On sait qui a fabriqué cette carte.', 'i', 'Non : personne ne l\'a prouvé.'],
  ['Enzo Ferrajoli a été condamné pour vol de manuscrits.', 'v', 'D\'après la presse. Mais rien ne le relie à l\'encre, et son rôle reste discuté.'],
  ['Les Vikings sont allés à Terre-Neuve.', 'v', 'On a retrouvé leurs traces à L\'Anse aux Meadows.'],
  ['La carte a aidé à découvrir Terre-Neuve.', 'i', 'Non : le site est trouvé en 1960, la carte présentée en 1965.'],
  ['Frisland est une vraie île.', 'i', 'Elle n\'existe pas, mais Mercator l\'a bien dessinée.'],
  ['Le dossier de Yale se trouve dans cette salle des cartes.', 'i', 'Cette salle n\'existe pas, et l\'annonce de Yale est publique.'],
  ['Il existe une règle pour les cotes comme V-1957-21.', 'i', 'Inventée pour le jeu.'],
  ['Bertha marche avec deux piles de télécommande.', 'i', 'Hélas.']
];
const SOURCES = [
  ['Yale News : l\'analyse de la carte du Vinland (2021)', 'https://news.yale.edu/2021/09/01/analysis-unlocks-secret-vinland-map-its-fake'],
  ['Vinland Map (Wikipedia)', 'https://en.wikipedia.org/wiki/Vinland_Map'],
  ['L\'Anse aux Meadows (Wikipedia)', 'https://en.wikipedia.org/wiki/L%27Anse_aux_Meadows'],
  ['Fine Books Magazine : la carte et Saragosse', 'https://www.finebooksmagazine.com/fine-books-news/vinland-map-saga-interview-author-john-paul-floyd'],
  ['Bibliothèque du Congrès : Frisland', 'https://blogs.loc.gov/maps/2019/10/the-mysterious-island/']
];
