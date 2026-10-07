---
title: مسار Figma Motion → Flutter صار أقصر بكثير.
description: يصدّر Figma Motion ملفات Animated SVG، ويعرضها full_svg_flutter داخل تطبيق Flutter. المصمم يصنع الحركة، والمطوّر يستلم ملف SVG واحداً.
---

وأظن أن كثيراً من فرق Flutter لم تنتبه لذلك بعد.

يستطيع Figma Motion التصدير بصيغة Animated SVG.

ويستطيع full_svg_flutter عرض ملف Animated SVG هذا مباشرةً داخل تطبيق Flutter.

- لا تحويل إلى Lottie.
- لا WebView.
- لا إعادة بناء للحركة في Flutter.
- لا صيغة حركة وسيطة.

يمكن أن يكون المسار حرفياً:

**Figma Motion ← تصدير Animated SVG ← العرض في Flutter**

المصمم يصنع الحركة.
المطوّر يستلم ملف ‎.svg واحداً.
Flutter يعرض الحركة مباشرةً.

لسنوات، كان البحث عن «Figma Motion to Flutter» أو «Figma animation export Flutter» أو «animated SVG Flutter» أو «Flutter SVG animation» ينتهي عادةً بخطوة تحويل إضافية.

- عبر Lottie.
- عبر Rive.
- عبر JSON.
- عبر plugin.
- عبر WebView.

أو بإعادة صنع الحركة يدوياً.

لكن إذا كان الملف المصدر بصيغة Animated SVG من البداية، فلماذا نحوّله أصلاً؟

وهذه بالضبط هي المشكلة التي بنيت full_svg_flutter لحلّها.
فهو يدعم SVG المتحرك مباشرةً في Flutter، بما في ذلك SMIL وحركات CSS والتحويلات و path morphing والأقنعة والتدرجات اللونية والفلاتر وتصديرات SVGator والتحكم في التشغيل.

والآن يجعل Figma Motion هذا المسار أكثر إثارة للاهتمام بكثير.

أيها المصممون: أهلاً بكم في Flutter.

كتبت شرحاً أعمق لطريقة عمل مسار Figma Motion → Animated SVG → Flutter، ولماذا يهمّ ذلك في التسليم بين المصمم والمطوّر، وإلى أين يمكن أن يتجه الأمر بعد ذلك.

[اقرأ المقال](post:figma-motion-to-flutter)

وإن كنت تستخدم Figma Motion، فأرسل إليّ أعقد ملف Animated SVG صدّرته.

أريد فعلاً أن تحاول كسر الـ renderer.
