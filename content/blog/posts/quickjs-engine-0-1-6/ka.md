---
title: "quickjs_engine 0.1.6: Swift Package Manager და Android Gradle Plugin 9"
description: quickjs_engine 0.1.6 ამატებს Swift Package Manager-ს iOS-სა და macOS-ზე, იწყობა Android Gradle Plugin 9-ით და ასწორებს iOS-ზე CocoaPods-ის ხიდის ჩატვირთვას.
---

quickjs_engine Flutter-ს Android-ზე, iOS-ზე, macOS-ზე, Linux-სა და Windows-ზე ერთ თანამედროვე JavaScript-ძრავს აძლევს — QuickJS-NG-ს. ის ასევე უშვებს SVGator-ის ექსპორტებსა და ჩაშენებულ სკრიპტებს full_svg_flutter-ში. ამ მეორე ამოცანის გამო ნატიური აწყობის პრობლემები ძალიან თვალსაჩინო ხდება: როცა ხიდი არ იტვირთება, ანიმირებული SVG-ები მოძრაობას წყვეტს.

ვერსიები 0.1.4-დან 0.1.6-მდე მთლიანად ნატიურ ფენას ეძღვნება. აი, რას ასწორებს თითოეული მათგანი.

## Swift Package Manager iOS-სა და macOS-ზე (0.1.6)

Flutter iOS-ისა და macOS-ის plugin-ების CocoaPods-იდან Swift Package Manager-ზე გადატანის პროცესშია. ამ რელიზამდე quickjs_engine შეტყობინებაში „The following plugins do not support Swift Package Manager“ იყო ჩამოთვლილი და მის გამო Flutter CocoaPods-ს უბრუნდებოდა.

0.1.6 შეიცავს Swift Package Manager-ის მანიფესტებს iOS-ისა და macOS-ისთვის. ხიდი პატარა დინამიკური ფრეიმვორკის სახითაა ჩაშენებული, ამიტომ `flutter build ipa` ბრძანებისა და macOS-ის არქივირების შემდეგაც მისი ექსპორტირებული სიმბოლოები ადგილზე რჩება. ერთი და იგივე მანიფესტი მუშაობს როგორც Flutter 3.38-თან, რომელსაც გენერირებული `FlutterFramework` პაკეტი არ აქვს, ისე 3.41-თან და უფრო ახალ ვერსიებთან.

Flutter-ის ბოლო სტაბილურ რელიზებში Swift Package Manager ნაგულისხმევად ჩართულია. უფრო ძველ რელიზებში, Flutter 3.35-დან მოყოლებული, ის თითოეული პროექტისთვის ცალკე ჩართეთ:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

Flutter 3.32-დან 3.34-მდე ვერსიებზე კი ის Flutter-ის მთელი ინსტალაციისთვის ჩართეთ:

```bash
flutter config --enable-swift-package-manager
```

მადლობა [@DomingoMG](https://github.com/DomingoMG)-ს, რომელმაც ამის შესახებ [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55)-ში შემატყობინა.

## CocoaPods-ის ხიდი, რომელიც ხიდს აექსპორტებს (0.1.6)

თუ თქვენი iOS-აპლიკაცია CocoaPods-ს იყენებს, ეს ყველაზე მნიშვნელოვანი შესწორებაა. CocoaPods ჩუმად უგულებელყოფდა podspec-ში მითითებულ `../native/cxx` საწყის კოდს, ამიტომ pod-ის ფრეიმვორკი FFI-ხიდის არცერთ სიმბოლოს არ აექსპორტებდა. 0.1.5 და უფრო ადრეულ ვერსიებში iOS-ზე ყოველი `evaluate()` გამოძახება ამ შეცდომით მთავრდებოდა:

```text
Failed to lookup symbol 'jsNewRuntime'
```

ახლა pod-ი ამ საწყის კოდს აკომპილირებს. თუ თქვენი Podfile pod-ებს სტატიკურად ლინკავს, README-ში ნახავთ Podfile-ისთვის მოკლე გამოსავალს: Dart ხიდს `DynamicLibrary.process()` გამოძახებით პოულობს, ამიტომ pod-ი დინამიკურ ფრეიმვორკად უნდა დარჩეს.

## Android Gradle Plugin 9 (0.1.6)

ახლა plugin-ი Kotlin Gradle Plugin-ს აღარ იყენებს, რადგან მისი plugin-კლასი Java-ზეა დაწერილი. Android Gradle Plugin 9-ზე აპლიკაციები იწყობა, ჩაშენებული Kotlin ჩართულია თუ გამორთული: აღარ ჩნდება არც შეცდომა „The 'org.jetbrains.kotlin.android' plugin is no longer required“ და არც გაფრთხილება, რომ plugin-ი KGP-ს იყენებს. `compileSdk` აპლიკაციის `flutter.compileSdkVersion` მნიშვნელობას მიჰყვება, plugin-ი კი Java 17-ით კომპილირდება.

მადლობა [@sufiyansayyed](https://github.com/sufiyansayyed)-ს, რომელმაც ამის შესახებ [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52)-ში შემატყობინა და საწყისი მიგრაცია [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53)-ში შეასრულა.

## მცირე შესწორებები 0.1.6-ში

- `QuickJsRuntime2(memoryLimit: ...)` დადებითი ლიმიტით აღარ აგდებს შეცდომას „Failed to lookup symbol 'jsSetMemoryLimit'“. ხიდი ახლა ამ ფუნქციას ყველა პლატფორმაზე აექსპორტებს.
- iOS-ისა და macOS-ის ოპტიმიზებული build-ები `NDEBUG` მაკროს განსაზღვრავს, ისევე როგორც CMake-ის release build-ები სხვა პლატფორმებზე, ამიტომ QuickJS-ის assert-ები და debug-კოდი build-ში აღარ ხვდება.

## Windows და უნივერსალური macOS (0.1.4, 0.1.5)

- **0.1.4** Windows-ზე აწყობას ასწორებს. Flutter-ის მანიფესტი ახლა ექსპორტირებულ C API plugin-კლასს აცხადებს, ამიტომ გენერირებული registrant-ები არარსებული სიმბოლოს ნაცვლად `QuickjsEnginePluginCApiRegisterWithRegistrar` ფუნქციას იძახებს. მადლობა [@dariyooo](https://github.com/dariyooo)-ს, რომელმაც პრობლემის შესახებ შემატყობინა და შესწორებაც შემოიტანა [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36)-ში.
- **0.1.5** macOS-ის წინასწარ აწყობილ ხიდს უნივერსალურს ხდის — `arm64` და `x86_64` slice-ებით — და მას ცალსახად მითითებული deployment target-ით აწყობს. მადლობა [@OrPudding](https://github.com/OrPudding)-ს შესწორებისთვის [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40)-ში.

## CI, რომელიც ამ ყველაფერს იცავს

ამ პრობლემების უმეტესობა მხოლოდ კონკრეტულ toolchain-ზე, სუფთა release build-ში იჩენს თავს, ამიტომ CI ახლა სწორედ ასეთ build-ებს აწყობს:

- Android Gradle Plugin 9-ის job, რომელიც Flutter-ის უახლეს სტაბილურ ვერსიაზე ახალ აპლიკაციას აწყობს ჩაშენებული Kotlin-ით და მის გარეშე;
- Swift Package Manager-ის სამუშაო პროცესი Flutter 3.38.1-ზე, 3.41.6-სა და 3.47.4-ზე, რომელიც აწყობს iOS-სიმულატორის აპლიკაციას, iOS-არქივსა და macOS-ის release-აპლიკაციას, ამოწმებს ხიდის ყველა ფუნქციისა და Dart-ის მხარის მიერ მოძიებული ყველა სიმბოლოს ექსპორტს და macOS-აპლიკაციას უშვებს;
- CocoaPods-ის iOS pod-ის ექსპორტირებული სიმბოლოების დამცავი შემოწმება, ასევე Windows-ისა და macOS-ის სუფთა release build-ის სამუშაო პროცესები.

## განახლება

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

თუ full_svg_flutter-ს იყენებთ, განაახლეთ ის 1.5.2 ვერსიამდე, რომელიც quickjs_engine ^0.1.6-ს მოითხოვს. იქ შეტანილი ყველა სხვა ცვლილება აღწერილია [full_svg_flutter 1.5-ის რელიზის შენიშვნებში](post:full-svg-flutter-1-5).

ცვლილებების სრული ჟურნალი: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
