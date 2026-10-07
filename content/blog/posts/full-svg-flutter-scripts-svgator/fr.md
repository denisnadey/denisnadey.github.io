---
title: Mise à jour majeure de la bibliothèque full_svg_flutter.
description: "full_svg_flutter affiche désormais les SVG animés avec scripts inline, exports SVGator compris : le SVG d’origine reste un SVG dans une app Flutter."
---

Elle prend désormais en charge les SVG animés avec scripts, y compris les exports SVGator.

Au lieu de convertir vos animations en Lottie, Rive ou GIF, ou de passer par un WebView, vous pouvez donc garder le SVG d’origine et l’afficher directement dans Flutter.

C’était l’idée centrale de ce package : un SVG doit rester un SVG.

Le package gère déjà SMIL, les animations CSS, le path morphing, les filtres, les masques, le texte, le contrôle de la lecture et, désormais, les scripts inline.

Si vous développez des apps Flutter et que les SVG animés vous ont déjà posé problème, vos retours m’intéressent beaucoup.

full_svg_flutter est disponible sur pub.dev : [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)
