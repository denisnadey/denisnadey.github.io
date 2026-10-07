---
title: Figma Motion → Flutter, c’est déjà possible.
description: Figma Motion exporte en Animated SVG, que full_svg_flutter affiche directement dans Flutter. Sans conversion Lottie, sans WebView, sans format intermédiaire.
---

Pas de conversion en Lottie. Pas de WebView. Pas d’animation à reconstruire à la main. Pas le moindre format d’animation intermédiaire.

Figma Motion sait désormais exporter directement en **Animated SVG**.

Et full_svg_flutter sait afficher ce SVG animé **directement dans Flutter**.

Le passage de relais designer → développeur peut donc enfin ressembler à ceci :

**Designer**

Figma → Motion → Animer → Exporter → **Animated SVG**

**Développeur Flutter**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

Terminé.

C’est tout.

Et je pense que c’est beaucoup plus important qu’il n’y paraît.

Pendant des années, le workflow classique de l’animation mobile ressemblait à peu près à ça :

```flow
Figma
After Effects / plugin / un autre outil d’animation
Lottie JSON
un autre runtime
Flutter
```

Ou :

```flow
Figma Motion
exporter les données d’animation
associer à la main les nœuds Figma à des widgets Flutter
recréer une partie de la scène dans le code
```

Ou, dans le pire des cas :

```flow
SVG animé
WebView 😐
```

Mais désormais, c’est Figma lui-même qui produit de l’**Animated SVG**.

Alors pourquoi convertir une animation vectorielle parfaitement valable dans un autre format, juste pour l’intégrer à une app Flutter ?

Avec full_svg_flutter, c’est le .svg lui-même qui sert d’asset à l’exécution.

Il prend déjà en charge :

- **SVG animé dans Flutter**
- animations CSS @keyframes
- animations SMIL
- transformations animées
- path morphing
- dégradés et motifs
- masques et clip paths
- filtres SVG
- texte
- animations SVG pilotées par JavaScript
- exports SVGator
- lecture / pause / seek
- contrôle de la vitesse de lecture
- SVG statique et animé avec le même moteur de rendu
- sans conversion en Lottie
- sans WebView

Et le moment est particulièrement intéressant :

Aujourd’hui, Figma Motion exporte en **MP4, GIF, WebM et Animated SVG**.

Figma annonce que l’**export Lottie natif n’arrivera que plus tard**.

Mais côté Flutter, on n’a pas forcément besoin de l’attendre.

L’export Animated SVG peut déjà servir de livrable.

---

## Designers, bienvenue dans Flutter. 💙

Créez l’animation là où vous créez déjà l’interface.

Exportez en Animated SVG.

Envoyez au développeur **un seul** fichier .svg.

C’est tout.

Et vous, développeurs Flutter :

si vous avez cherché **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation** ou **Lottie alternative for Flutter** –

c’est exactement pour ce workflow que je développe full_svg_flutter.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

Je veux aller beaucoup plus loin.

Alors si vous êtes motion designer et que vous utilisez **Figma Motion**, envoyez-moi votre export Animated SVG le plus tordu.

Masques complexes. Filtres. Morphing. Transformations improbables. Timelines à rallonge.

**Essayez de le casser.**

Je préfère débusquer moi-même les cas limites du moteur de rendu plutôt que de vous laisser les découvrir en production.

**full_svg_flutter**

- GitHub : [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev : [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

Du design à Flutter, le chemin de l’animation vient peut-être de raccourcir considérablement.
