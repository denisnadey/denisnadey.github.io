---
title: "quickjs_engine 0.1.6: Swift Package Manager i Android Gradle Plugin 9"
description: quickjs_engine 0.1.6 dodaje obsługę Swift Package Manager na iOS i macOS, buduje się z Android Gradle Plugin 9 i naprawia ładowanie mostu z CocoaPods na iOS.
---

quickjs_engine daje Flutterowi jeden nowoczesny silnik JavaScript – QuickJS-NG – na platformach Android, iOS, macOS, Linux i Windows. Uruchamia też eksporty SVGator i skrypty inline w full_svg_flutter. Przez tę drugą rolę problemy z natywnym buildem od razu rzucają się w oczy: gdy most się nie załaduje, animowane SVG przestają się animować.

Wersje od 0.1.4 do 0.1.6 dotyczą w całości warstwy natywnej. Oto, co naprawia każda z nich.

## Swift Package Manager na iOS i macOS (0.1.6)

Flutter przenosi pluginy dla iOS i macOS z CocoaPods na Swift Package Manager. Do tego wydania quickjs_engine figurował na liście „The following plugins do not support Swift Package Manager”, a Flutter z jego powodu wracał do CocoaPods.

0.1.6 zawiera manifesty Swift Package Manager dla iOS i macOS. Most jest osadzony jako mały dynamiczny framework, więc jego eksporty przetrwają `flutter build ipa` i archiwizację na macOS. Jeden manifest działa zarówno z Flutterem 3.38, w którym nie ma generowanego pakietu `FlutterFramework`, jak i z wersjami 3.41 i nowszymi.

W nowszych stabilnych wersjach Fluttera Swift Package Manager jest włączony domyślnie. W starszych można go włączyć dla pojedynczego projektu, począwszy od Fluttera 3.35:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

We Flutterze 3.32–3.34 trzeba go za to włączyć dla całej instalacji Fluttera:

```bash
flutter config --enable-swift-package-manager
```

Dziękuję [@DomingoMG](https://github.com/DomingoMG) za zgłoszenie w [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## Pod CocoaPods, który naprawdę eksportuje most (0.1.6)

To najważniejsza poprawka, jeśli aplikacja na iOS korzysta z CocoaPods. Źródła `../native/cxx` zadeklarowane w podspecu były po cichu ignorowane przez CocoaPods, więc framework poda nie eksportował żadnej części mostu FFI. W wersji 0.1.5 i starszych każde wywołanie `evaluate()` na iOS kończyło się błędem:

```text
Failed to lookup symbol 'jsNewRuntime'
```

Teraz pod kompiluje te źródła. Jeśli Podfile linkuje pody statycznie, w README znajdziesz krótkie obejście w Podfile'u: Dart odnajduje most przez `DynamicLibrary.process()`, więc pod musi pozostać dynamicznym frameworkiem.

## Android Gradle Plugin 9 (0.1.6)

Plugin nie stosuje już Kotlin Gradle Plugin, bo klasa pluginu jest teraz napisana w Javie. Aplikacje na Android Gradle Plugin 9 budują się zarówno z włączonym, jak i z wyłączonym wbudowanym Kotlinem, zamiast kończyć się błędem „The 'org.jetbrains.kotlin.android' plugin is no longer required” albo ostrzeżeniem, że plugin stosuje KGP. `compileSdk` przyjmuje wartość `flutter.compileSdkVersion` aplikacji, a plugin jest kompilowany z użyciem Javy 17.

Dziękuję [@sufiyansayyed](https://github.com/sufiyansayyed) za zgłoszenie w [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) i za pierwszą wersję migracji w [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## Mniejsze poprawki w 0.1.6

- `QuickJsRuntime2(memoryLimit: ...)` z dodatnim limitem nie rzuca już błędu „Failed to lookup symbol 'jsSetMemoryLimit'”. Most eksportuje teraz tę funkcję na każdej platformie.
- Zoptymalizowane buildy na iOS i macOS definiują `NDEBUG`, tak jak buildy release z CMake na pozostałych platformach, więc asercje i kod debugowy QuickJS nie są już wkompilowywane.

## Windows i uniwersalny macOS (0.1.4, 0.1.5)

- **0.1.4** naprawia buildy na Windowsie. Manifest Fluttera deklaruje teraz eksportowaną klasę pluginu z C API, więc wygenerowany kod rejestrujący pluginy wywołuje `QuickjsEnginePluginCApiRegisterWithRegistrar` zamiast nieistniejącego symbolu. Dziękuję [@dariyooo](https://github.com/dariyooo) za zgłoszenie problemu i poprawkę w [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- **0.1.5** sprawia, że prekompilowany most dla macOS jest uniwersalny – zawiera kod dla architektur `arm64` i `x86_64` – i buduje go z jawnie ustawionym deployment targetem. Dziękuję [@OrPudding](https://github.com/OrPudding) za poprawkę w [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## CI, które pilnuje tego wszystkiego

Większość tych problemów wychodzi dopiero w czystym buildzie release na konkretnym toolchainie, dlatego CI buduje teraz właśnie to:

- job z Android Gradle Plugin 9, który buduje świeżą aplikację na najnowszym stabilnym Flutterze z włączonym i wyłączonym wbudowanym Kotlinem;
- workflow ze Swift Package Manager na Flutterze 3.38.1, 3.41.6 i 3.47.4, który buduje aplikację na symulator iOS, archiwum iOS i aplikację release na macOS, sprawdza, czy eksportowane są wszystkie funkcje mostu i wszystkie symbole, których szuka strona Darta, oraz uruchamia aplikację na macOS;
- kontrola eksportów poda iOS w CocoaPods, a do tego workflow czystych buildów release na Windowsie i macOS.

## Aktualizacja

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

Jeśli korzystasz z full_svg_flutter, zaktualizuj go do 1.5.2 – ta wersja wymaga quickjs_engine ^0.1.6. Pozostałe zmiany w tym pakiecie znajdziesz w [informacjach o wydaniu full_svg_flutter 1.5](post:full-svg-flutter-1-5).

Pełny changelog: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
