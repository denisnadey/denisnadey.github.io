---
title: Figma Motion → Flutter უკვე რეალობაა.
description: Figma Motion აექსპორტებს Animated SVG-ს, full_svg_flutter კი პირდაპირ Flutter-ში ხატავს — Lottie-ში კონვერტაციის, WebView-სა და შუალედური ფორმატის გარეშე.
---

არანაირი კონვერტაცია Lottie-ში. არანაირი WebView. არანაირი ხელით თავიდან აწყობილი ანიმაცია. საერთოდ არანაირი შუალედური ფორმატი ანიმაციისთვის.

Figma Motion-ს ახლა უკვე შეუძლია **Animated SVG**-ის პირდაპირ ექსპორტი.

full_svg_flutter-ს კი შეუძლია ეს ანიმირებული SVG **პირდაპირ Flutter-ის შიგნით** დახატოს.

ანუ დიზაინერიდან → დეველოპერამდე ნამუშევრის გადაცემა, ბოლოს და ბოლოს, შეიძლება ასე გამოიყურებოდეს:

**დიზაინერი**

Figma → Motion → ანიმირება → ექსპორტი → **Animated SVG**

**Flutter-დეველოპერი**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

მზადაა.

სულ ესაა.

და ვფიქრობ, ეს გაცილებით მნიშვნელოვანია, ვიდრე ერთი შეხედვით ჩანს.

წლების განმავლობაში მობილური ანიმაციის სტანდარტული სამუშაო პროცესი დაახლოებით ასეთი იყო:

```flow
Figma
After Effects / plugin / ანიმაციის სხვა ინსტრუმენტი
Lottie JSON
კიდევ ერთი runtime
Flutter
```

ან:

```flow
Figma Motion
ანიმაციის მონაცემების ექსპორტი
Figma-ს კვანძების ხელით დაკავშირება Flutter-ის ვიჯეტებთან
სცენის ნაწილების კოდში თავიდან აწყობა
```

ან, უარეს შემთხვევაში:

```flow
ანიმირებული SVG
WebView 😐
```

ახლა კი თავად Figma ქმნის **Animated SVG**-ს.

მაშ, რატომ უნდა გადავიყვანოთ სავსებით ვარგისი ვექტორული ანიმაცია სხვა ფორმატში მხოლოდ იმისთვის, რომ Flutter-აპლიკაციაში ჩავსვათ?

full_svg_flutter-ის შემთხვევაში runtime-ასეტი თავად .svg ფაილია.

უკვე მხარდაჭერილია:

- **ანიმირებული SVG Flutter-ში**
- CSS @keyframes ანიმაციები
- SMIL-ანიმაციები
- ანიმირებული ტრანსფორმაციები
- path morphing
- გრადიენტები და პატერნები
- მასკები და ამოჭრის კონტურები
- SVG-ფილტრები
- ტექსტი
- JavaScript-ზე მომუშავე SVG-ანიმაციები
- SVGator-ის ექსპორტები
- დაკვრა / პაუზა / გადახვევა
- დაკვრის სიჩქარის მართვა
- სტატიკური და ანიმირებული SVG ერთი და იმავე რენდერერით
- Lottie-ში კონვერტაციის გარეშე
- WebView-ს გარეშე

და მომენტიც განსაკუთრებით საინტერესოა:

Figma Motion-ში ამჟამად შესაძლებელია ექსპორტი **MP4, GIF, WebM და Animated SVG** ფორმატებში.

Figma-ს თქმით, ნატიური **Lottie-ექსპორტი მოგვიანებით დაემატება**.

მაგრამ Flutter-ისთვის მისი ლოდინი აუცილებლად არ გვჭირდება.

Animated SVG-ექსპორტი უკვე შეიძლება იყოს ის, რასაც დიზაინერი საბოლოოდ აბარებს.

---

## დიზაინერებო, კეთილი იყოს თქვენი მობრძანება Flutter-ში. 💙

შექმენით ანიმაცია იქ, სადაც უკვე ქმნით ინტერფეისს.

გააკეთეთ Animated SVG-ის ექსპორტი.

დეველოპერს გაუგზავნეთ **ერთი** .svg ფაილი.

სულ ესაა.

თქვენ კი, Flutter-დეველოპერებო:

თუ საძიებოში ეძებდით **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation** ან **Lottie alternative for Flutter** —

სწორედ ამ სამუშაო პროცესისთვის ვავითარებ full_svg_flutter-ს.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

მინდა, ეს გაცილებით შორს წავიყვანო.

ამიტომ, თუ მოუშენ-დიზაინერი ხართ და **Figma Motion**-ს იყენებთ, გამომიგზავნეთ თქვენი ყველაზე ჭირვეული Animated SVG-ექსპორტი.

რთული მასკები. ფილტრები. მორფინგი. უცნაური ტრანსფორმაციები. გრძელი დროის ღერძები.

**სცადეთ, გატეხოთ.**

მირჩევნია, რენდერერის ზღვრული შემთხვევები მე ვიპოვო, ვიდრე თქვენ აღმოაჩინოთ ისინი პროდაქშენში.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

შესაძლოა, დიზაინიდან Flutter-ამდე ანიმაციის გადაცემის გზა ახლახან ბევრად შემოკლდა.
