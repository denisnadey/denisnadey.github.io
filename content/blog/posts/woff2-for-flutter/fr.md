---
title: J’ai publié woff2 pour Flutter
description: Le FontLoader de Flutter attend du TTF ou de l’OTF. woff2 décode les .woff et .woff2 en bytes SFNT, puis les enregistre via le pipeline de polices standard.
---

J’ai publié woff2 pour Flutter afin de répondre à un problème courant : gérer les polices qui ne sont pas au format .ttf ou .otf et qui arrivent souvent en .woff ou .woff2, surtout dans un contexte web.

Le FontLoader de Flutter est conçu pour des polices SFNT non compressées, c’est-à-dire des bytes TTF/OTF. Charger directement un fichier WOFF2 pose problème. Pour y remédier, j’ai développé un package qui permet d’utiliser des polices .woff et .woff2 dans Flutter : il les décode en bytes SFNT, puis les enregistre via le pipeline de polices standard de Flutter.

Les principales fonctionnalités du package woff2 :

- Décodage WOFF1 et WOFF2
- Chargement de polices depuis des assets ou des bytes
- Un wrapper autour du FontLoader de Flutter
- Analyse des règles CSS @font-face
- Prise en charge des polices embarquées en data: URL
- Enregistrement en lot de plusieurs graisses et styles
- Aucun code de plugin natif requis dans votre app

Ce package est né de mon travail sur le rendu de SVG animés, où les polices sont souvent embarquées via CSS. Sans une vraie prise en charge du WOFF/WOFF2, le rendu visuel peut échouer alors même que l’analyse du SVG est correcte.

Il ne servira pas à toutes les apps Flutter, mais il est utile pour celles qui consomment du contenu externe : SVG, HTML, EPUB, aperçus de documents, exports de design, rendu d’e-mails ou pipelines de texte riche. Il peut vous épargner une étape de conversion frustrante.

Le package n’en est qu’à ses débuts, mais les fonctionnalités de base sont en place.

Pour découvrir le package : [pub.dev/packages/woff2](https://pub.dev/packages/woff2)

J’attends avec intérêt les retours des développeurs Flutter qui ont l’expérience des polices personnalisées, du rendu SVG, du rendu de documents ou des applications où la typographie occupe une place centrale.
