---
title: "quickjs_engine 0.1.6: Swift Package Manager y Android Gradle Plugin 9"
description: quickjs_engine 0.1.6 añade Swift Package Manager en iOS y macOS, compila con Android Gradle Plugin 9 y corrige un puente de CocoaPods en iOS que no cargaba.
---

quickjs_engine ofrece a Flutter un único motor JavaScript moderno, QuickJS-NG, en Android, iOS, macOS, Linux y Windows. También ejecuta las exportaciones de SVGator y los scripts inline de full_svg_flutter. Ese segundo papel hace que los problemas de compilación nativa salten a la vista: si el puente no carga, los SVG animados dejan de animarse.

Las versiones de la 0.1.4 a la 0.1.6 giran por completo en torno a la capa nativa. Esto es lo que corrige cada una.

## Swift Package Manager en iOS y macOS (0.1.6)

Flutter está migrando los plugins de iOS y macOS de CocoaPods a Swift Package Manager. Hasta esta versión, quickjs_engine aparecía en la lista «The following plugins do not support Swift Package Manager», y por su culpa Flutter recurría a CocoaPods.

La 0.1.6 incluye manifiestos de Swift Package Manager para iOS y macOS. El puente va embebido como un pequeño framework dinámico, así que sus símbolos exportados sobreviven a `flutter build ipa` y a los archives de macOS. Un mismo manifiesto funciona con Flutter 3.38, que no tiene el paquete generado `FlutterFramework`, y también con la 3.41 y posteriores.

Swift Package Manager viene activado por defecto en las versiones estables recientes de Flutter. En las anteriores, a partir de Flutter 3.35, actívalo por proyecto:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

Entre Flutter 3.32 y 3.34, en cambio, actívalo para toda la instalación de Flutter:

```bash
flutter config --enable-swift-package-manager
```

Gracias a [@DomingoMG](https://github.com/DomingoMG) por reportarlo en [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## Un puente de CocoaPods que exporta el puente (0.1.6)

Esta es la corrección que más importa si tu app de iOS usa CocoaPods. CocoaPods ignoraba sin avisar los archivos fuente `../native/cxx` del podspec, así que el framework del pod no exportaba nada del puente FFI. En la 0.1.5 y anteriores, cualquier llamada a `evaluate()` en iOS fallaba con:

```text
Failed to lookup symbol 'jsNewRuntime'
```

Ahora el pod compila esos archivos fuente. Si tu Podfile enlaza los pods de forma estática, el README incluye una breve solución alternativa para el Podfile: Dart encuentra el puente mediante `DynamicLibrary.process()`, así que el pod tiene que seguir siendo un framework dinámico.

## Android Gradle Plugin 9 (0.1.6)

El plugin ya no aplica el Kotlin Gradle Plugin, porque su clase de plugin ahora está escrita en Java. Las apps con Android Gradle Plugin 9 compilan con el Kotlin integrado tanto activado como desactivado, en lugar de fallar con «The 'org.jetbrains.kotlin.android' plugin is no longer required» o de avisar de que el plugin aplica KGP. `compileSdk` sigue el `flutter.compileSdkVersion` de la app, y el plugin compila con Java 17.

Gracias a [@sufiyansayyed](https://github.com/sufiyansayyed) por reportarlo en [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) y por la migración inicial en [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## Correcciones menores en la 0.1.6

- `QuickJsRuntime2(memoryLimit: ...)` con un límite positivo ya no lanza «Failed to lookup symbol 'jsSetMemoryLimit'». Ahora el puente exporta esa función en todas las plataformas.
- Las compilaciones optimizadas de iOS y macOS definen `NDEBUG`, igual que las compilaciones release de CMake en las demás plataformas, así que las aserciones y el código de depuración de QuickJS ya no se incluyen en el binario.

## Windows y macOS universal (0.1.4, 0.1.5)

- La **0.1.4** corrige las compilaciones en Windows. El manifiesto de Flutter ahora declara la clase de plugin exportada de la API de C, así que el código de registro generado llama a `QuickjsEnginePluginCApiRegisterWithRegistrar` en lugar de a un símbolo inexistente. Gracias a [@dariyooo](https://github.com/dariyooo) por reportar el problema y aportar la corrección en [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- La **0.1.5** convierte en universal el puente precompilado de macOS, con las arquitecturas `arm64` y `x86_64`, y lo compila con un deployment target explícito. Gracias a [@OrPudding](https://github.com/OrPudding) por la corrección en [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## Una CI que vigila todo esto

La mayoría de estos problemas solo aparecen en una compilación release limpia y con una toolchain concreta, así que eso es justo lo que compila ahora la CI:

- un job de Android Gradle Plugin 9 que compila una app nueva con la última versión estable de Flutter, con el Kotlin integrado activado y desactivado;
- un flujo de trabajo de Swift Package Manager en Flutter 3.38.1, 3.41.6 y 3.47.4 que compila una app para el simulador de iOS, un archive de iOS y una app release de macOS, comprueba que se exportan todas las funciones del puente y todos los símbolos que busca la parte de Dart, y ejecuta la app de macOS;
- una comprobación de los símbolos que exporta el pod de CocoaPods para iOS, además de flujos de trabajo que hacen compilaciones release limpias en Windows y macOS.

## Cómo actualizar

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

Si usas full_svg_flutter, actualiza a la 1.5.2, que requiere quickjs_engine ^0.1.6. Todo lo demás que cambió en ese paquete está en las [notas de la versión 1.5 de full_svg_flutter](post:full-svg-flutter-1-5).

Registro de cambios completo: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
