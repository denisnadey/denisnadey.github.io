---
title: "quickjs_engine 0.1.6 : Swift Package Manager et Android Gradle Plugin 9"
description: quickjs_engine 0.1.6 ajoute Swift Package Manager sur iOS et macOS, se compile avec Android Gradle Plugin 9 et répare le chargement du pont CocoaPods sur iOS.
---

quickjs_engine apporte à Flutter un même moteur JavaScript moderne, QuickJS-NG, sur Android, iOS, macOS, Linux et Windows. C’est aussi lui qui exécute les exports SVGator et les scripts inline dans full_svg_flutter. Ce second rôle rend les problèmes de build natif très visibles : quand le pont ne se charge pas, les SVG animés ne s’animent plus.

Les versions 0.1.4 à 0.1.6 sont entièrement consacrées à la couche native. Voici ce que corrige chacune d’elles.

## Swift Package Manager sur iOS et macOS (0.1.6)

Flutter fait migrer les plugins iOS et macOS de CocoaPods vers Swift Package Manager. Jusqu’à cette version, quickjs_engine figurait dans la liste « The following plugins do not support Swift Package Manager », et Flutter se rabattait sur CocoaPods à cause de lui.

La 0.1.6 fournit des manifestes Swift Package Manager pour iOS et macOS. Le pont est embarqué sous la forme d’un petit framework dynamique, si bien que ses exports survivent à `flutter build ipa` et aux archives macOS. Un même manifeste fonctionne avec Flutter 3.38, qui ne génère pas de package `FlutterFramework`, comme avec la 3.41 et les versions suivantes.

Swift Package Manager est activé par défaut dans les versions stables récentes de Flutter. Sur les plus anciennes, activez-le projet par projet à partir de Flutter 3.35 :

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

De Flutter 3.32 à 3.34, activez-le plutôt pour toute l’installation Flutter :

```bash
flutter config --enable-swift-package-manager
```

Merci à [@DomingoMG](https://github.com/DomingoMG) de l’avoir signalé dans [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## Un pod CocoaPods qui exporte bel et bien le pont (0.1.6)

C’est le correctif le plus important si votre app iOS utilise CocoaPods. CocoaPods ignorait silencieusement les sources `../native/cxx` du podspec, si bien que le framework du pod n’exportait rien du pont FFI. Jusqu’à la 0.1.5 incluse, chaque `evaluate()` sur iOS échouait avec :

```text
Failed to lookup symbol 'jsNewRuntime'
```

Le pod compile désormais ces sources. Si votre Podfile lie les pods statiquement, le README propose un court contournement à ajouter au Podfile : Dart trouve le pont via `DynamicLibrary.process()`, le pod doit donc rester un framework dynamique.

## Android Gradle Plugin 9 (0.1.6)

Le plugin n’applique plus le Kotlin Gradle Plugin, car sa classe de plugin est désormais écrite en Java. Les apps sous Android Gradle Plugin 9 se compilent, que le Kotlin intégré soit activé ou non, au lieu d’échouer avec « The 'org.jetbrains.kotlin.android' plugin is no longer required » ou d’avertir que le plugin applique KGP. `compileSdk` suit le `flutter.compileSdkVersion` de l’app, et le plugin se compile avec Java 17.

Merci à [@sufiyansayyed](https://github.com/sufiyansayyed), qui l’a signalé dans [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) et a amorcé la migration dans [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## Petits correctifs de la 0.1.6

- `QuickJsRuntime2(memoryLimit: ...)` avec une limite positive ne lève plus l’erreur « Failed to lookup symbol 'jsSetMemoryLimit' ». Le pont exporte désormais cette fonction sur toutes les plateformes.
- Les builds iOS et macOS optimisés définissent `NDEBUG`, comme les builds release CMake des autres plateformes : les assertions et le code de debug de QuickJS ne sont donc plus compilés dans le binaire.

## Windows et macOS universel (0.1.4, 0.1.5)

- La **0.1.4** corrige les builds Windows. Le manifeste Flutter déclare désormais la classe de plugin exportée via l’API C, si bien que le code d’enregistrement généré appelle `QuickjsEnginePluginCApiRegisterWithRegistrar` au lieu d’un symbole manquant. Merci à [@dariyooo](https://github.com/dariyooo) d’avoir signalé le problème et proposé le correctif dans [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- La **0.1.5** rend universel le pont macOS précompilé, avec les slices `arm64` et `x86_64`, et le compile avec une cible de déploiement explicite. Merci à [@OrPudding](https://github.com/OrPudding) pour le correctif dans [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## Une CI qui veille sur tout ça

La plupart de ces problèmes n’apparaissent que sur un build release propre, avec une toolchain bien précise. C’est donc ce que la CI compile désormais :

- un job Android Gradle Plugin 9 qui compile une app fraîchement créée sur la dernière version stable de Flutter, avec et sans le Kotlin intégré ;
- un workflow Swift Package Manager sur Flutter 3.38.1, 3.41.6 et 3.47.4 qui compile une app pour le simulateur iOS, une archive iOS et une app macOS en release, vérifie que chaque fonction du pont et chaque symbole recherché côté Dart sont bien exportés, puis lance l’app macOS ;
- un garde-fou pour les exports du pod iOS CocoaPods, ainsi que des workflows de build release propres pour Windows et macOS.

## Mise à jour

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

Si vous utilisez full_svg_flutter, passez à la 1.5.2, qui requiert quickjs_engine ^0.1.6. Le reste des changements de cette version est détaillé dans les [notes de version de full_svg_flutter 1.5](post:full-svg-flutter-1-5).

Changelog complet : [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
