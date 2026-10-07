---
title: "quickjs_engine 0.1.6: دعم Swift Package Manager و Android Gradle Plugin 9"
description: يضيف quickjs_engine 0.1.6 دعم Swift Package Manager على iOS و macOS، ويُبنى مع Android Gradle Plugin 9، ويصلح جسر CocoaPods على iOS الذي كان يتعذّر تحميله.
---

يمنح quickjs_engine منصة Flutter محرك JavaScript حديثاً واحداً، هو QuickJS-NG، على Android و iOS و macOS و Linux و Windows. ويشغّل أيضاً تصديرات SVGator والـ scripts المضمّنة في full_svg_flutter. وهذه المهمة الثانية تجعل مشكلات البناء الأصلي ظاهرة للعيان: فعندما لا يُحمَّل الجسر، تتوقف ملفات SVG المتحركة عن الحركة.

الإصدارات من 0.1.4 إلى 0.1.6 تدور كلها حول الطبقة الأصلية. وإليك ما يصلحه كل منها.

## دعم Swift Package Manager على iOS و macOS (0.1.6)

يعمل Flutter على نقل الـ plugins على iOS و macOS من CocoaPods إلى Swift Package Manager. وحتى هذا الإصدار، كان quickjs_engine يظهر ضمن «The following plugins do not support Swift Package Manager»، فيلجأ Flutter بسببه إلى CocoaPods.

يأتي الإصدار 0.1.6 بملفات manifest لـ Swift Package Manager على iOS و macOS. ويُضمَّن الجسر بوصفه إطار عمل ديناميكياً صغيراً، فتبقى رموزه المُصدَّرة سليمة بعد `flutter build ipa` وأرشفة تطبيقات macOS. ويعمل manifest واحد مع Flutter 3.38، الذي لا يولّد حزمة `FlutterFramework`، ومع 3.41 وما بعده أيضاً.

Swift Package Manager مفعّل افتراضياً في إصدارات Flutter المستقرة الحديثة. أما في الإصدارات الأقدم، فبدءاً من Flutter 3.35 يمكنك تفعيله لكل مشروع على حدة:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

وفي Flutter من 3.32 إلى 3.34، فعّله بدلاً من ذلك على مستوى تثبيت Flutter بأكمله:

```bash
flutter config --enable-swift-package-manager
```

شكراً لـ ‎[@DomingoMG](https://github.com/DomingoMG) على الإبلاغ عن ذلك في [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## نسخة CocoaPods من الجسر صارت تصدّر دواله فعلاً (0.1.6)

هذا هو الإصلاح الأهم إذا كان تطبيقك على iOS يستخدم CocoaPods. فقد كان CocoaPods يتجاهل بصمت مصادر `../native/cxx` المذكورة في الـ podspec، فلم يكن إطار عمل الـ pod يصدّر شيئاً من جسر FFI. وفي الإصدار 0.1.5 وما قبله، كان كل استدعاء لـ `evaluate()` على iOS يفشل بالخطأ:

```text
Failed to lookup symbol 'jsNewRuntime'
```

صار الـ pod يجمّع هذه المصادر الآن. وإذا كان ملف Podfile لديك يربط الـ pods ربطاً ساكناً، فستجد في README حلاً بديلاً قصيراً لملف Podfile: إذ يعثر Dart على الجسر عبر `DynamicLibrary.process()`، لذا يجب أن يبقى الـ pod إطار عمل ديناميكياً.

## دعم Android Gradle Plugin 9 (0.1.6)

لم يعد الـ plugin يطبّق Kotlin Gradle Plugin، لأن صنف الـ plugin صار مكتوباً بلغة Java. وصارت التطبيقات على Android Gradle Plugin 9 تُبنى سواء كان Kotlin المدمج مفعّلاً أو معطّلاً، بدلاً من أن تفشل بالخطأ «The 'org.jetbrains.kotlin.android' plugin is no longer required» أو تُظهر تحذيراً بأن الـ plugin يطبّق KGP. ويتبع `compileSdk` قيمة `flutter.compileSdkVersion` في التطبيق، ويُجمَّع الـ plugin باستخدام Java 17.

شكراً لـ ‎[@sufiyansayyed](https://github.com/sufiyansayyed) على الإبلاغ عن المشكلة في [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) وعلى الترحيل الأولي في [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## إصلاحات أصغر في 0.1.6

- لم يعد `QuickJsRuntime2(memoryLimit: ...)` مع حدٍّ موجب يرمي الخطأ «Failed to lookup symbol 'jsSetMemoryLimit'‎». فالجسر صار يصدّر هذه الدالة على كل المنصات.
- صارت عمليات البناء المحسّنة على iOS و macOS تعرّف `NDEBUG`، كما تفعل عمليات بناء release المعتمدة على CMake في المنصات الأخرى، فلم تعد assertions الخاصة بـ QuickJS وكود التصحيح تدخل في الملف المُجمَّع.

## Windows و macOS universal (0.1.4، 0.1.5)

- **0.1.4** يصلح البناء على Windows. صار ملف manifest الخاص بـ Flutter يعلن عن صنف الـ plugin المُصدَّر بواجهة C API، فتستدعي ملفات التسجيل المولَّدة `QuickjsEnginePluginCApiRegisterWithRegistrar` بدلاً من رمز غير موجود. شكراً لـ ‎[@dariyooo](https://github.com/dariyooo) على الإبلاغ عن المشكلة والمساهمة بالإصلاح في [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- **0.1.5** يجعل جسر macOS المبني مسبقاً universal، بشريحتي `arm64` و `x86_64` معاً، ويبنيه مع deployment target محدد صراحةً. شكراً لـ ‎[@OrPudding](https://github.com/OrPudding) على الإصلاح في [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## CI يحرس كل ذلك

معظم هذه المشكلات لا تظهر إلا في بناء release نظيف على سلسلة أدوات بعينها، ولهذا صار CI يبني ذلك تحديداً:

- مهمة لـ Android Gradle Plugin 9 تبني تطبيقاً جديداً على أحدث إصدار مستقر من Flutter مع تفعيل Kotlin المدمج وتعطيله؛
- مسار عمل لـ Swift Package Manager على Flutter 3.38.1 و 3.41.6 و 3.47.4، يبني تطبيقاً لمحاكي iOS وأرشيف iOS وتطبيق macOS بنسخة release، ويتحقق من تصدير كل دالة في الجسر وكل رمز يبحث عنه جانب Dart، ثم يشغّل تطبيق macOS؛
- فحص يحرس الرموز التي يصدّرها الـ pod الخاص بـ iOS في CocoaPods، إلى جانب مسارات عمل لبناء release نظيف على Windows و macOS.

## الترقية

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

إذا كنت تستخدم full_svg_flutter، فحدِّثه إلى الإصدار 1.5.2، الذي يتطلب quickjs_engine ^0.1.6. وتجد بقية ما تغيّر فيه في [ملاحظات إصدار full_svg_flutter 1.5](post:full-svg-flutter-1-5).

سجل التغييرات الكامل: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
