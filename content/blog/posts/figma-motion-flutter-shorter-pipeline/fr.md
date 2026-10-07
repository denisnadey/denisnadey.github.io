---
title: Le pipeline Figma Motion → Flutter vient de raccourcir considérablement.
description: Figma Motion exporte en Animated SVG, que full_svg_flutter affiche dans une app Flutter. Le designer anime ; le développeur reçoit un seul fichier .svg.
---

Et je pense que beaucoup d’équipes Flutter ne s’en sont pas encore rendu compte.

Figma Motion sait exporter en Animated SVG.

full_svg_flutter sait afficher ce SVG animé directement dans une application Flutter.

- Pas de conversion en Lottie.
- Pas de WebView.
- Pas d’animation à reconstruire dans Flutter.
- Pas de format d’animation intermédiaire.

Le workflow peut littéralement se résumer à :

**Figma Motion → Export en Animated SVG → Flutter**

Le designer crée l’animation.
Le développeur reçoit un seul fichier .svg.
Flutter affiche directement l’animation.

Pendant des années, chercher « Figma Motion to Flutter », « Figma animation export Flutter », « animated SVG Flutter » ou « Flutter SVG animation » revenait le plus souvent à tomber sur une énième étape de conversion.

- Lottie.
- Rive.
- JSON.
- Un plugin.
- Un WebView.

Ou à recréer l’animation à la main.

Mais si l’asset source est déjà au format Animated SVG, à quoi bon le convertir ?

C’est exactement pour résoudre ce problème que j’ai créé full_svg_flutter.
Il prend en charge le SVG animé directement dans Flutter : SMIL, animations CSS, transformations, path morphing, masques, dégradés, filtres, exports SVGator et contrôle de la lecture.

Et avec Figma Motion, ce workflow devient bien plus intéressant.

Designers, bienvenue dans Flutter.

J’ai écrit une analyse plus détaillée : comment fonctionne la chaîne Figma Motion → Animated SVG → Flutter, pourquoi c’est important pour le passage de relais entre designers et développeurs, et jusqu’où tout cela pourrait aller.

[Lire l’article](post:figma-motion-to-flutter)

Et si vous utilisez Figma Motion, envoyez-moi votre export Animated SVG le plus complexe.

Je veux vraiment que vous essayiez de casser le moteur de rendu.
