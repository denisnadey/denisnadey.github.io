---
title: Figma Motion → Flutter صار واقعاً بالفعل.
description: يصدّر Figma Motion ملفات Animated SVG، ويعرضها full_svg_flutter مباشرةً في Flutter. بلا تحويل إلى Lottie، وبلا WebView، وبلا أي صيغة وسيطة.
---

لا تحويل إلى Lottie. لا WebView. لا إعادة بناء للحركة يدوياً. ولا أي صيغة حركة وسيطة على الإطلاق.

صار بإمكان Figma Motion الآن التصدير مباشرةً بصيغة **Animated SVG**.

ويستطيع full_svg_flutter عرض ملف SVG المتحرك هذا **مباشرةً داخل Flutter**.

وهكذا يمكن أخيراً أن يبدو التسليم «المصمم ← المطوّر» على هذا النحو:

**المصمم**

Figma ← وضع Motion ← التحريك ← التصدير ← **Animated SVG**

**مطوّر Flutter**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

انتهى.

هذا كل شيء.

وأظن أن الأمر أكبر بكثير مما يبدو.

لسنوات، كان المسار المعتاد لإضافة الحركة إلى تطبيقات Mobile يشبه ما يلي:

```flow
Figma
After Effects أو plugin أو أداة حركة أخرى
Lottie JSON
runtime آخر
Flutter
```

أو:

```flow
Figma Motion
تصدير بيانات الحركة
ربط عناصر Figma يدوياً بـ widgets في Flutter
إعادة بناء أجزاء من المشهد بالكود
```

أو، في أسوأ الأحوال:

```flow
SVG متحرك
WebView 😐
```

لكن Figma نفسه صار اليوم يُنتج **Animated SVG**.

فلماذا نحوّل حركة متجهية سليمة تماماً إلى صيغة أخرى لمجرد وضعها في تطبيق Flutter؟

مع full_svg_flutter، يصبح ملف ‎.svg نفسه هو الأصل الذي يحمّله التطبيق وقت التشغيل.

وهو يدعم أصلاً:

- **Animated SVG في Flutter**
- حركات CSS @keyframes
- حركات SMIL
- التحويلات المتحركة
- path morphing
- التدرجات اللونية والأنماط
- الأقنعة ومسارات القص
- فلاتر SVG
- النصوص
- حركات SVG المعتمدة على JavaScript
- تصديرات SVGator
- التشغيل / الإيقاف المؤقت / seek
- التحكم في سرعة التشغيل
- SVG الثابت والمتحرك عبر الـ renderer نفسه
- بلا تحويل إلى Lottie
- بلا WebView

والتوقيت هنا مثير للاهتمام بشكل خاص:

يصدّر Figma Motion حالياً بصيغ **MP4 و GIF و WebM و Animated SVG**.

وتقول شركة Figma إن **التصدير المدمج إلى Lottie سيأتي لاحقاً**.

لكننا في Flutter لسنا مضطرين بالضرورة إلى انتظاره.

فتصدير Animated SVG يمكن أن يكون منذ الآن هو المُخرَج الذي يُسلَّم.

---

## أيها المصممون: أهلاً بكم في Flutter. 💙

اصنعوا الحركة حيث تصممون الواجهة أصلاً.

صدّروها بصيغة Animated SVG.

أرسلوا إلى المطوّر ملف ‎.svg **واحداً**.

هذا كل شيء.

وأنتم يا مطوري Flutter:

إن كنتم تبحثون عن **Figma Motion to Flutter** أو **Figma animation export for Flutter** أو **animated SVG in Flutter** أو **Flutter SVG animation** أو **Lottie alternative for Flutter** —

فهذا بالضبط هو مسار العمل الذي أبني full_svg_flutter من أجله.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

أريد أن أمضي بهذا إلى أبعد من ذلك بكثير.

لذا، إن كنت مصمم حركة وتستخدم **Figma Motion**، فأرسل إليّ أشرس ملف Animated SVG صدّرته.

أقنعة معقدة. فلاتر. Morphing. تحويلات غريبة. خطوط زمنية طويلة.

**جرّب أن تكسره.**

أفضّل أن أكتشف الحالات الحدّية في الـ renderer بنفسي على أن تكتشفها أنت في الإنتاج.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter**

ربما صار تسليم الحركة من التصميم إلى Flutter أقصر بكثير.
