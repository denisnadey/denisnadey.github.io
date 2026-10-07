---
title: "quickjs_engine 0.1.6: Swift Package Manager and Android Gradle Plugin 9"
description: quickjs_engine 0.1.6 adds Swift Package Manager on iOS and macOS, builds with Android Gradle Plugin 9, and fixes an iOS CocoaPods bridge that failed to load.
---

quickjs_engine gives Flutter one modern JavaScript engine, QuickJS-NG, on Android, iOS, macOS, Linux, and Windows. It also runs SVGator exports and inline scripts in full_svg_flutter. That second job makes native build problems very visible: when the bridge does not load, animated SVGs stop animating.

Versions 0.1.4 to 0.1.6 are all about the native layer. Here is what each one fixes.

## Swift Package Manager on iOS and macOS (0.1.6)

Flutter is moving iOS and macOS plugins from CocoaPods to Swift Package Manager. Until this release, quickjs_engine was listed under “The following plugins do not support Swift Package Manager”, and Flutter fell back to CocoaPods because of it.

0.1.6 ships Swift Package Manager manifests for iOS and macOS. The bridge is embedded as a small dynamic framework, so its exports survive `flutter build ipa` and macOS archives. One manifest works with Flutter 3.38, which has no generated `FlutterFramework` package, as well as with 3.41 and later.

Swift Package Manager is on by default in recent stable Flutter releases. On older ones, enable it per project from Flutter 3.35:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

On Flutter 3.32 to 3.34, enable it for the whole Flutter installation instead:

```bash
flutter config --enable-swift-package-manager
```

Thanks to [@DomingoMG](https://github.com/DomingoMG) for reporting it in [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## A CocoaPods bridge that exports the bridge (0.1.6)

This is the fix that matters most if your iOS app uses CocoaPods. CocoaPods silently ignored the podspec’s `../native/cxx` sources, so the pod framework exported none of the FFI bridge. On 0.1.5 and earlier, every `evaluate()` on iOS failed with:

```text
Failed to lookup symbol 'jsNewRuntime'
```

The pod now compiles those sources. If your Podfile links pods statically, the README has a short Podfile workaround: Dart finds the bridge through `DynamicLibrary.process()`, so the pod has to stay a dynamic framework.

## Android Gradle Plugin 9 (0.1.6)

The plugin no longer applies the Kotlin Gradle Plugin, because its plugin class is now Java. Apps on Android Gradle Plugin 9 build with built-in Kotlin on or off, instead of failing with “The 'org.jetbrains.kotlin.android' plugin is no longer required” or warning that the plugin applies KGP. `compileSdk` follows the app’s `flutter.compileSdkVersion`, and the plugin compiles with Java 17.

Thanks to [@sufiyansayyed](https://github.com/sufiyansayyed) for reporting it in [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) and for the initial migration in [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## Smaller fixes in 0.1.6

- `QuickJsRuntime2(memoryLimit: ...)` with a positive limit no longer throws “Failed to lookup symbol 'jsSetMemoryLimit'”. The bridge now exports that function on every platform.
- Optimized iOS and macOS builds define `NDEBUG`, like the CMake release builds on the other platforms, so QuickJS assertions and debug code are no longer compiled in.

## Windows and universal macOS (0.1.4, 0.1.5)

- **0.1.4** fixes Windows builds. The Flutter manifest now declares the exported C API plugin class, so generated registrants call `QuickjsEnginePluginCApiRegisterWithRegistrar` instead of a missing symbol. Thanks to [@dariyooo](https://github.com/dariyooo) for reporting the issue and contributing the fix in [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- **0.1.5** makes the prebuilt macOS bridge universal, with both `arm64` and `x86_64` slices, and builds it with an explicit deployment target. Thanks to [@OrPudding](https://github.com/OrPudding) for the fix in [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## CI that guards all of this

Most of these issues only show up in a clean release build on a specific toolchain, so that is what CI builds now:

- an Android Gradle Plugin 9 job that builds a fresh app on the latest stable Flutter with built-in Kotlin on and off;
- a Swift Package Manager workflow on Flutter 3.38.1, 3.41.6, and 3.47.4 that builds an iOS simulator app, an iOS archive, and a macOS release app, checks that every bridge function and every symbol the Dart side looks up is exported, and runs the macOS app;
- a guard for the CocoaPods iOS pod exports, plus clean Windows and macOS release-build workflows.

## Upgrade

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

If you use full_svg_flutter, upgrade to 1.5.2, which requires quickjs_engine ^0.1.6. Everything else that changed there is in the [full_svg_flutter 1.5 release notes](post:full-svg-flutter-1-5).

Full changelog: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
