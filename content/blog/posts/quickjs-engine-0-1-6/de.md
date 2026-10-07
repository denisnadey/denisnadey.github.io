---
title: "quickjs_engine 0.1.6: Swift Package Manager und Android Gradle Plugin 9"
description: quickjs_engine 0.1.6 unterstützt Swift Package Manager auf iOS und macOS sowie Android Gradle Plugin 9 und behebt einen Ladefehler der CocoaPods-Bridge auf iOS.
---

quickjs_engine gibt Flutter auf Android, iOS, macOS, Linux und Windows dieselbe moderne JavaScript-Engine: QuickJS-NG. Außerdem führt das Paket SVGator-Exporte und Inline-Skripte in full_svg_flutter aus. Durch diese zweite Aufgabe fallen native Build-Probleme sofort auf: Lädt die Bridge nicht, bleiben animierte SVGs stehen.

In den Versionen 0.1.4 bis 0.1.6 dreht sich alles um die native Schicht. Hier die Fixes im Einzelnen.

## Swift Package Manager auf iOS und macOS (0.1.6)

Flutter stellt iOS- und macOS-Plugins von CocoaPods auf Swift Package Manager um. Bis zu diesem Release stand quickjs_engine unter „The following plugins do not support Swift Package Manager“, und Flutter fiel deshalb auf CocoaPods zurück.

0.1.6 liefert Swift-Package-Manager-Manifeste für iOS und macOS mit. Die Bridge wird als kleines dynamisches Framework eingebettet, damit ihre Exporte `flutter build ipa` und macOS-Archive überstehen. Ein einziges Manifest funktioniert sowohl mit Flutter 3.38, das kein generiertes `FlutterFramework`-Paket hat, als auch mit 3.41 und neuer.

In aktuellen stabilen Flutter-Releases ist Swift Package Manager standardmäßig eingeschaltet. In älteren aktivieren Sie ihn ab Flutter 3.35 pro Projekt:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

Unter Flutter 3.32 bis 3.34 aktivieren Sie ihn stattdessen für die gesamte Flutter-Installation:

```bash
flutter config --enable-swift-package-manager
```

Danke an [@DomingoMG](https://github.com/DomingoMG) für die Meldung in [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## Eine CocoaPods-Bridge, die tatsächlich die Bridge exportiert (0.1.6)

Wenn Ihre iOS-App CocoaPods verwendet, ist das der wichtigste Fix. CocoaPods hat die in der Podspec eingetragenen Quellen unter `../native/cxx` stillschweigend ignoriert, deshalb exportierte das Pod-Framework nichts von der FFI-Bridge. Bis einschließlich 0.1.5 schlug auf iOS jeder Aufruf von `evaluate()` mit diesem Fehler fehl:

```text
Failed to lookup symbol 'jsNewRuntime'
```

Jetzt kompiliert der Pod diese Quellen. Wenn Ihr Podfile Pods statisch linkt, finden Sie im README einen kurzen Podfile-Workaround: Dart findet die Bridge über `DynamicLibrary.process()`, deshalb muss der Pod ein dynamisches Framework bleiben.

## Android Gradle Plugin 9 (0.1.6)

Das Plugin wendet das Kotlin Gradle Plugin nicht mehr an, weil seine Plugin-Klasse jetzt in Java geschrieben ist. Apps mit Android Gradle Plugin 9 bauen jetzt mit und ohne integriertes Kotlin, statt mit „The 'org.jetbrains.kotlin.android' plugin is no longer required“ abzubrechen oder zu warnen, dass das Plugin KGP anwendet. `compileSdk` richtet sich nach `flutter.compileSdkVersion` der App, und das Plugin kompiliert mit Java 17.

Danke an [@sufiyansayyed](https://github.com/sufiyansayyed) für die Meldung in [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) und die erste Migration in [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## Kleinere Fixes in 0.1.6

- `QuickJsRuntime2(memoryLimit: ...)` mit einem positiven Limit wirft nicht mehr „Failed to lookup symbol 'jsSetMemoryLimit'“. Die Bridge exportiert diese Funktion jetzt auf allen Plattformen.
- Optimierte iOS- und macOS-Builds definieren `NDEBUG` – wie die CMake-Release-Builds auf den anderen Plattformen –, sodass QuickJS-Assertions und Debug-Code nicht mehr mitkompiliert werden.

## Windows und macOS Universal (0.1.4, 0.1.5)

- **0.1.4** behebt die Windows-Builds. Das Flutter-Manifest deklariert jetzt die exportierte C-API-Plugin-Klasse, sodass die generierten Registrants `QuickjsEnginePluginCApiRegisterWithRegistrar` aufrufen statt eines fehlenden Symbols. Danke an [@dariyooo](https://github.com/dariyooo) für die Meldung und den Fix in [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- **0.1.5** macht die vorkompilierte macOS-Bridge universal, mit Slices sowohl für `arm64` als auch für `x86_64`, und baut sie mit einem expliziten Deployment Target. Danke an [@OrPudding](https://github.com/OrPudding) für den Fix in [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## Eine CI, die all das absichert

Die meisten dieser Probleme zeigen sich nur in einem sauberen Release-Build mit einer bestimmten Toolchain. Genau solche Builds laufen jetzt in der CI:

- ein Job für Android Gradle Plugin 9, der eine frisch erzeugte App mit der neuesten stabilen Flutter-Version baut, mit und ohne integriertes Kotlin;
- ein Swift-Package-Manager-Workflow mit Flutter 3.38.1, 3.41.6 und 3.47.4, der eine iOS-Simulator-App, ein iOS-Archiv und eine macOS-Release-App baut, prüft, dass jede Bridge-Funktion und jedes Symbol, nach dem die Dart-Seite sucht, exportiert wird, und die macOS-App startet;
- eine Prüfung, die die Exporte des CocoaPods-Pods für iOS absichert, dazu saubere Release-Build-Workflows für Windows und macOS.

## Upgrade

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

Wenn Sie full_svg_flutter nutzen, aktualisieren Sie auf 1.5.2; diese Version setzt quickjs_engine ^0.1.6 voraus. Alles andere, was sich dort geändert hat, steht in den [Release Notes zu full_svg_flutter 1.5](post:full-svg-flutter-1-5).

Alle Änderungen: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
