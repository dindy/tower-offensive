# 👾 Tower Offensive

---

## Présentation du projet

**Tower Offensive** est un jeu de [tower defense](https://fr.wikipedia.org/wiki/Tower_defense) dans lequel vous devez empêcher les capitalistes de s'emparer de la valeur économique créée par les travailleurs.

**Tower Offensive** est inspiré du travail de l'économiste et sociologue [Bernard Friot](https://fr.wikipedia.org/wiki/Bernard_Friot_(sociologue)) et a pour but de le faire découvrir aux joueurs. 

Le jeu est entièrement jouable dans un navigateur web moderne.

*N.B : Aucun développeur n'a été maltraité durant la réalisation du jeu.*

---

## Présentation technique

Le jeu est uniquement réalisé avec des technologies web [Open Source](https://fr.wikipedia.org/wiki/Open_source) (``HTML5``, ``JavaScript`` et ``CSS``).

Le rendu de la carte est réalisé grâce à l'API ``canvas``.

---

## Todo list

1. ✔️ ``A`` 🐞 Les cellules occupées devraient refuser le drag and drop de nouveaux batiments
1. ✔️ ``B`` ⚡️⚙️ Déplacer la création des layers de la classe `Level` vers la classe `Game`
1. ✔️ ``C`` 🐞 Les projectiles ne devraient pas être masqués par les batiments
1. ✔️ ``I`` 🌟 Créer un nouveau type de tour "sniper"
1. ✔️ ``J`` 🌟 Créer un nouveau type de tour "mortier"
1. ✔️ ``K`` 🌟 Créer un nouveau type de tour "balles téléguidées"
1. ✔️ ``L`` 🌟 Enchainer les vagues du level
1. ✔️ ``D`` 🌟 Rendre les tours sélectionnables pour afficher leur portée sur la map
1. ❌ ``E`` 📖 Trouver un meilleur nom au jeu
1. ✔️ ``F`` 📢 Rédiger une courte présentation du jeu
1. ❌ ``G`` 🎨 Créer un logo pour le jeu
1. ✔️ ``H`` ⚡️⚙️ Supprimer EaselJS
1. ✔️ ``M`` 🌟 Implémenter le zoom 
1. ❌ ``N`` 🎨 Séparer la flamme du canon dans les sprites 
1. ✔️ ``O`` 🌟 Les ennemis peuvent voler de la valeur 0
1. ✔️ ``P`` 🌟 Les eclairs secondaires ne peuvent pas s'éloigner trop de l'éclair principale
1. ✔️ ``Q`` 🌟 Adapter la vitesse d'animation des enemy a leur vitesse de déplacement
1. ❌ ``R`` 🌟 Créer un effet de perspective sur les rockets
1. ❌ ``S`` ⚙️ Refactorer availableBuildings en Classe

**Prochain code** : ``U``

| Emoji | Type de tache |
|---|---|
| 🌟 | Fonctionnalités |
| 🐞 | Bugs |
| 🎨 | Art work |
| ⚙️ | Refactoring |
| ⚡️ | Performances |
| 📐 | U.I |
| 📖 | Video game storytelling |
| 🎧 | Sound design |
| ⚖️ | Equilibrage |
| 📢 | Communication |

| Emoji | Statut de tache |
|---|---|
| ❌ | To do |
| 🔨 | Doing |
| ✔️ | Done |

---

## UI WIP 

- https://www.figma.com/file/UE7hejmb8fQTLWHBdpAXWi/Untitled?node-id=1%3A28

## Idées gameplay

- Laisser un délai entre 2 vagues
- Possibilité d'appeler la prochaine vague avec un bouton avant que la courante soit terminée
- Comment gagner un niveau ? Quand certaines technos (progrès social) sont débloquées -> possibilité de passer au niveau suivant sur la même carte (on garde les batiments).
- chaque carte = 1 boss qui tente de voler un village antiK
- Tuer des ennemis = expérience = dépense dans les technos = changement d'acte = augmentation de la difficulté
- PIB permet de construire des tours. Le joueur peut utiliser une fraction de la valeur.
- Valoriser le fait d'avoir protéger la valeur d'un acte (ou vague) à l'autre 
- Vocabulaire :
    - vague = plusieurs ennemis 
    - acte = niveau dans la map
    - scène = map 
- On perd quand il n'y a plus de valeur économique
- La valeur éco grandit à chaque vague (acte ?)