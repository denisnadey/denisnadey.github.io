---
title: "full_svg_flutter 1.5 : un inspecteur DevTools pour le SVG en direct"
description: full_svg_flutter 1.5 ajoute un inspecteur DevTools pour le SVG en direct, corrige les pourcentages et les boîtes englobantes, et fiabilise les builds natifs.
---

Depuis la 1.4.2, cinq versions de full_svg_flutter sont sorties : deux correctifs de plateforme, un nouvel outil pour les développeurs, une importante passe de corrections géométriques et une version qui fait fonctionner sur iOS les SVG pilotés par JavaScript. Voici ce qui a changé, et pourquoi c’est important.

## L’inspecteur DevTools FullSVG (1.5.0)

Quand un SVG animé s’affiche bien dans un navigateur mais mal dans l’app, il faut pouvoir voir ce que le moteur de rendu a réellement fait. Depuis la 1.5.0, full_svg_flutter embarque une extension Flutter DevTools officielle. Elle se connecte à une app lancée en mode debug et inspecte les instances de rendu réelles : le document, la timeline d’animation et le painter qui dessinent effectivement votre écran.

Au programme :

- **Instances en direct.** Chaque instance de rendu montée apparaît séparément, y compris lorsqu’un asset est monté deux fois, avec sa source, l’état de son animation et son nombre de nœuds DOM.
- **Le DOM SVG, chargé à la demande.** Les nœuds enfants ne se chargent que lorsque vous dépliez une ligne, si bien que les gros documents restent réactifs. Sélectionner un nœud affiche sa balise, son id, ses classes, les valeurs brutes et résolues de ses attributs, les attributs animés à cet instant, ainsi que les animations SMIL et CSS qui le ciblent.
- **Contrôle de la lecture.** Lecture, pause, relance, seek et vitesses de 0,25× à 2×. Les commandes pilotent l’horloge déterministe du moteur de rendu lui-même au lieu de créer une seconde timeline.
- **Mise en surbrillance des nœuds.** Le nœud sélectionné est entouré d’un contour dans l’app en cours d’exécution, d’après sa géométrie de rendu réelle, sans toucher aux attributs du SVG.
- **Des statistiques honnêtes.** Nœuds DOM, nombre d’animations, animations actives, primitives de filtre, masques, dégradés, clip paths, présence de JavaScript, position de lecture et durée. L’inspecteur n’invente pas de temps d’analyse ou de dessin que le moteur de rendu ne mesure pas.

Pour l’ouvrir :

1. Lancez votre app en mode debug.
2. Ouvrez Flutter DevTools depuis votre IDE ou depuis la sortie de `flutter run`.
3. Activez les extensions DevTools quand on vous le demande.
4. Sélectionnez l’extension full_svg_flutter. L’inspecteur s’affiche sous le nom **FullSVG**.

Il n’y a rien à configurer. Le pont est réservé au mode debug : les builds release n’enregistrent aucune instance de rendu, ne conservent aucun arbre DOM et ne collectent aucune donnée pour l’inspecteur. Le suivi des instances s’appuie sur des références faibles et épouse le cycle de vie des widgets, et l’extension se reconnecte après un hot restart.

Quelques limites sont bonnes à connaître. L’isolate principal doit être en cours d’exécution, et non en pause sur un point d’arrêt. La présence de JavaScript est signalée, mais l’évaluation de JavaScript arbitraire n’est volontairement pas exposée. Le CSS calculé, l’origine des valeurs dans la cascade, la sélection d’instances `<use>` individuelles et les temps par frame sont des chantiers pour la suite.

Le guide complet se trouve dans la [documentation de l’inspecteur](https://github.com/denisnadey/flutter_full_svg_support/blob/main/doc/en/devtools.md).

## Une géométrie qui se comporte comme dans un navigateur (1.5.1)

La 1.5.1 est une version axée sur la justesse du rendu, bâtie en grande partie sur des pull requests de la communauté.

- **Les pourcentages sont résolus par rapport au bon viewport.** Formes de base, géométrie des `<use>` et viewports de leurs instances, `<svg>` imbriqués, coordonnées du texte, régions de masque et hit testing utilisent tous le bon viewport, y compris pour un SVG racine sans taille propre, dont le viewport est le widget.
- **Les animations gardent leurs unités.** Les animations SMIL entre une valeur en pourcentage et une valeur absolue conservent les deux unités tout au long de l’interpolation, de la composition additive et du timing `calcMode="paced"`.
- **objectBoundingBox utilise la bonne boîte.** `clipPathUnits`, `maskUnits` et `maskContentUnits` s’appuient sur les limites géométriques de l’objet, hors peinture, si bien qu’un contour ne gonfle plus la boîte, et les textes ciblés fournissent leurs limites de mise en page au lieu de disparaître au clipping.
- **Les régions animées de filtre et de masque sont prises en compte.** Les pourcentages animés sur les régions de `<filter>` et de `<mask>` sont relus pendant l’animation au lieu d’être analysés une seule fois à partir de la source.
- **Un timing par instance.** Les animations en mode paced dans un contenu `<symbol>` partagé sont évaluées pour le viewport de chaque instance `<use>`.

Si vos visuels reposent sur des longueurs en pourcentage, ce qui est courant dans les SVG exportés et responsives, cette version rapproche nettement leur rendu de celui d’un navigateur.

## Des builds natifs sur toutes les plateformes (1.4.3, 1.4.4, 1.5.2)

full_svg_flutter exécute les scripts inline et les exports SVGator via [quickjs_engine](page:docs#quickjs-engine), mon package QuickJS-NG pour Flutter. Trois versions visaient à faire de cette couche native un non-sujet :

- **1.4.3, Windows.** Un build Windows à partir de zéro échouait, car le code d’enregistrement des plugins généré par Flutter appelait un symbole qui n’existait pas. Corrigé via quickjs_engine 0.1.4.
- **1.4.4, macOS universel.** Les apps macOS universelles embarquent désormais un pont QuickJS doté des deux slices, Apple Silicon et Intel.
- **1.5.2, iOS, Swift Package Manager et Android Gradle Plugin 9.** Les SVG pilotés par JavaScript s’initialisent désormais sur iOS avec CocoaPods. Les versions précédentes du pod n’exportaient aucune fonction du pont, si bien que chaque SVG contenant un `<script>` échouait avec « Failed to lookup symbol 'jsNewRuntime' ». Par ailleurs, Flutter ne se rabat plus sur CocoaPods à cause de quickjs_engine, et les apps Android sous AGP 9 se compilent avec le Kotlin intégré.

Les détails côté natif font l’objet d’un article à part : [quickjs_engine 0.1.6](post:quickjs-engine-0-1-6).

## Mise à jour

```yaml
dependencies:
  full_svg_flutter: ^1.5.2
```

Ou lancez `flutter pub upgrade full_svg_flutter`. Le package nécessite Flutter 3.32 ou une version plus récente, et le changelog ne signale aucun changement d’API cassant entre la 1.4.2 et la 1.5.2.

## Merci

Quatre de ces cinq versions intègrent des contributions de la communauté : rapports de bugs, cas de reproduction et pull requests. Merci à [@oierxjn](https://github.com/oierxjn), [@remtrik](https://github.com/remtrik), [@dariyooo](https://github.com/dariyooo), [@OrPudding](https://github.com/OrPudding), [@sufiyansayyed](https://github.com/sufiyansayyed) et [@DomingoMG](https://github.com/DomingoMG).

Si un SVG ne s’affiche pas comme dans un navigateur, ouvrez l’inspecteur, vérifiez les attributs résolus et [envoyez-moi le fichier](https://github.com/denisnadey/flutter_full_svg_support/issues). C’est toujours le moyen le plus rapide d’améliorer le moteur de rendu.

Changelog complet : [pub.dev/packages/full_svg_flutter/changelog](https://pub.dev/packages/full_svg_flutter/changelog)
