---
title: "quickjs_engine 0.1.6: Swift Package Manager и Android Gradle Plugin 9"
description: В quickjs_engine 0.1.6 — Swift Package Manager на iOS и macOS, сборка с Android Gradle Plugin 9 и исправленный мост для CocoaPods на iOS, который не загружался.
---

quickjs_engine даёт Flutter один современный JavaScript-движок — QuickJS-NG — на Android, iOS, macOS, Linux и Windows. Ещё он выполняет экспорты SVGator и встроенные скрипты в full_svg_flutter. Из-за этой второй роли проблемы нативной сборки сразу бросаются в глаза: если мост не загрузился, анимированные SVG замирают.

Версии с 0.1.4 по 0.1.6 целиком посвящены нативному слою. Вот что исправляет каждая из них.

## Swift Package Manager на iOS и macOS (0.1.6)

Flutter переводит плагины для iOS и macOS с CocoaPods на Swift Package Manager. До этого релиза quickjs_engine попадал в список «The following plugins do not support Swift Package Manager», и из-за него Flutter откатывался на CocoaPods.

В 0.1.6 появились манифесты Swift Package Manager для iOS и macOS. Мост встраивается как небольшой динамический фреймворк, поэтому его экспорты не теряются при `flutter build ipa` и архивации под macOS. Один и тот же манифест работает и с Flutter 3.38, где нет сгенерированного пакета `FlutterFramework`, и с 3.41 и новее.

Swift Package Manager включён по умолчанию в свежих стабильных релизах Flutter. На более старых, начиная с Flutter 3.35, включите его на уровне проекта:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

На Flutter 3.32–3.34 его придётся включить для всей установки Flutter:

```bash
flutter config --enable-swift-package-manager
```

Спасибо [@DomingoMG](https://github.com/DomingoMG) за репорт в [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## CocoaPods-мост, который наконец экспортирует мост (0.1.6)

Если ваше iOS-приложение использует CocoaPods, это самое важное исправление. CocoaPods молча игнорировал исходники `../native/cxx` из podspec, поэтому фреймворк пода не экспортировал ни одной функции FFI-моста. В 0.1.5 и раньше любой вызов `evaluate()` на iOS падал с ошибкой:

```text
Failed to lookup symbol 'jsNewRuntime'
```

Теперь под компилирует эти исходники. Если ваш Podfile линкует поды статически, в README есть короткое обходное решение: Dart находит мост через `DynamicLibrary.process()`, поэтому под должен оставаться динамическим фреймворком.

## Android Gradle Plugin 9 (0.1.6)

Плагин больше не подключает Kotlin Gradle Plugin, потому что класс плагина теперь написан на Java. Приложения на Android Gradle Plugin 9 собираются и с включённым, и с выключенным встроенным Kotlin, вместо того чтобы падать с «The 'org.jetbrains.kotlin.android' plugin is no longer required» или предупреждать, что плагин подключает KGP. `compileSdk` берётся из `flutter.compileSdkVersion` приложения, а сам плагин компилируется с Java 17.

Спасибо [@sufiyansayyed](https://github.com/sufiyansayyed) за репорт в [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) и первую версию миграции в [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## Мелкие исправления в 0.1.6

- `QuickJsRuntime2(memoryLimit: ...)` с положительным лимитом больше не выбрасывает «Failed to lookup symbol 'jsSetMemoryLimit'». Теперь мост экспортирует эту функцию на всех платформах.
- Оптимизированные сборки под iOS и macOS определяют `NDEBUG`, как и релизные CMake-сборки на других платформах, поэтому ассерты и отладочный код QuickJS больше не попадают в сборку.

## Windows и универсальные сборки macOS (0.1.4, 0.1.5)

- **0.1.4** чинит сборки под Windows. Манифест Flutter теперь объявляет экспортируемый класс плагина с C API, поэтому сгенерированные регистраторы вызывают `QuickjsEnginePluginCApiRegisterWithRegistrar`, а не отсутствующий символ. Спасибо [@dariyooo](https://github.com/dariyooo) за репорт и исправление в [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- **0.1.5** делает предсобранный мост для macOS универсальным — со слайсами `arm64` и `x86_64` — и собирает его с явно заданным deployment target. Спасибо [@OrPudding](https://github.com/OrPudding) за исправление в [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## CI, который за всем этим следит

Большинство этих проблем проявляется только в чистой релизной сборке на конкретном тулчейне, поэтому именно такие сборки CI теперь и делает:

- джоба для Android Gradle Plugin 9: собирает только что созданное приложение на последнем стабильном Flutter с включённым и выключенным встроенным Kotlin;
- воркфлоу для Swift Package Manager на Flutter 3.38.1, 3.41.6 и 3.47.4: собирает приложение для симулятора iOS, iOS-архив и релизное приложение для macOS, проверяет, что экспортируется каждая функция моста и каждый символ, который ищет сторона Dart, и запускает приложение для macOS;
- проверка экспортов CocoaPods-пода для iOS, а также воркфлоу чистых релизных сборок под Windows и macOS.

## Как обновиться

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

Если вы используете full_svg_flutter, обновитесь до 1.5.2: эта версия требует quickjs_engine ^0.1.6. Всё остальное, что там изменилось, — в [заметках о релизе full_svg_flutter 1.5](post:full-svg-flutter-1-5).

Полный ченджлог: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
