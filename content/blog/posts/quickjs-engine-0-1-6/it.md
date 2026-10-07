---
title: "quickjs_engine 0.1.6: Swift Package Manager e Android Gradle Plugin 9"
description: quickjs_engine 0.1.6 porta Swift Package Manager su iOS e macOS, supporta Android Gradle Plugin 9 e corregge il bridge CocoaPods per iOS che non si caricava.
---

quickjs_engine dà a Flutter un unico motore JavaScript moderno, QuickJS-NG, su Android, iOS, macOS, Linux e Windows. Esegue anche gli export SVGator e gli script inline in full_svg_flutter. Questo secondo compito rende molto visibili i problemi delle build native: quando il bridge non si carica, gli SVG animati smettono di animarsi.

Le versioni dalla 0.1.4 alla 0.1.6 riguardano tutte il livello nativo. Ecco cosa corregge ciascuna.

## Swift Package Manager su iOS e macOS (0.1.6)

Flutter sta migrando i plugin iOS e macOS da CocoaPods a Swift Package Manager. Fino a questa release quickjs_engine compariva nell'elenco «The following plugins do not support Swift Package Manager», e per questo Flutter ripiegava su CocoaPods.

La 0.1.6 include i manifest Swift Package Manager per iOS e macOS. Il bridge è incorporato come un piccolo framework dinamico, così i simboli che esporta sopravvivono a `flutter build ipa` e agli archivi macOS. Un unico manifest funziona sia con Flutter 3.38, che non ha il package `FlutterFramework` generato, sia con la 3.41 e successive.

Nelle release stabili recenti di Flutter, Swift Package Manager è attivo di default. In quelle meno recenti, a partire da Flutter 3.35, attivalo per singolo progetto:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

Con Flutter dalla 3.32 alla 3.34, invece, attivalo per l'intera installazione di Flutter:

```bash
flutter config --enable-swift-package-manager
```

Grazie a [@DomingoMG](https://github.com/DomingoMG) per la segnalazione nella [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## Un bridge CocoaPods che esporta il bridge (0.1.6)

Se la tua app iOS usa CocoaPods, questo è il fix più importante. CocoaPods ignorava in silenzio i sorgenti `../native/cxx` del podspec, quindi il framework del pod non esportava nulla del bridge FFI. Fino alla 0.1.5 compresa, ogni `evaluate()` su iOS falliva con:

```text
Failed to lookup symbol 'jsNewRuntime'
```

Ora il pod compila quei sorgenti. Se il tuo Podfile usa il linking statico dei pod, nel README trovi un breve workaround per il Podfile: Dart trova il bridge tramite `DynamicLibrary.process()`, quindi il pod deve restare un framework dinamico.

## Android Gradle Plugin 9 (0.1.6)

Il plugin non applica più il Kotlin Gradle Plugin, perché ora la sua classe plugin è in Java. Le app su Android Gradle Plugin 9 si compilano con il Kotlin integrato, attivo o disattivato che sia, invece di fallire con «The 'org.jetbrains.kotlin.android' plugin is no longer required» o di mostrare un avviso perché il plugin applica KGP. `compileSdk` segue il `flutter.compileSdkVersion` dell'app, e il plugin viene compilato con Java 17.

Grazie a [@sufiyansayyed](https://github.com/sufiyansayyed) per la segnalazione nella [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) e per la migrazione iniziale nella [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## Fix minori nella 0.1.6

- `QuickJsRuntime2(memoryLimit: ...)` con un limite positivo non lancia più «Failed to lookup symbol 'jsSetMemoryLimit'». Ora il bridge esporta quella funzione su tutte le piattaforme.
- Le build ottimizzate per iOS e macOS definiscono `NDEBUG`, come le build di release CMake sulle altre piattaforme, quindi le asserzioni e il codice di debug di QuickJS non vengono più inclusi nella compilazione.

## Windows e macOS universale (0.1.4, 0.1.5)

- La **0.1.4** corregge le build Windows. Il manifest Flutter ora dichiara la classe plugin C API esportata, così i registrant generati chiamano `QuickjsEnginePluginCApiRegisterWithRegistrar` invece di un simbolo mancante. Grazie a [@dariyooo](https://github.com/dariyooo) per aver segnalato il problema e contribuito con il fix nella [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- La **0.1.5** rende universale il bridge macOS precompilato, con le slice sia `arm64` sia `x86_64`, e lo compila con un deployment target esplicito. Grazie a [@OrPudding](https://github.com/OrPudding) per il fix nella [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## La CI che presidia tutto questo

La maggior parte di questi problemi emerge solo in una build di release pulita su una toolchain specifica, quindi ora la CI compila proprio questo:

- un job Android Gradle Plugin 9 che compila un'app creata da zero sull'ultima versione stabile di Flutter, con il Kotlin integrato sia attivo sia disattivato;
- un workflow Swift Package Manager su Flutter 3.38.1, 3.41.6 e 3.47.4 che compila un'app per il simulatore iOS, un archivio iOS e un'app macOS di release, verifica che ogni funzione del bridge e ogni simbolo cercato dal lato Dart siano esportati ed esegue l'app macOS;
- un controllo sui simboli esportati dal pod CocoaPods per iOS, oltre a workflow di build di release pulite per Windows e macOS.

## Aggiornamento

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

Se usi full_svg_flutter, aggiorna alla 1.5.2, che richiede quickjs_engine ^0.1.6. Tutte le altre novità di quel package sono nelle [note di rilascio di full_svg_flutter 1.5](post:full-svg-flutter-1-5).

Changelog completo: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
