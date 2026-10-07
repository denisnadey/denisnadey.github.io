---
title: تحديث كبير لمكتبة full_svg_flutter.
description: صار full_svg_flutter يعرض ملفات SVG المتحركة ذات الـ scripts المضمّنة، ومنها تصديرات SVGator، ليبقى SVG الأصلي بصيغة SVG داخل تطبيق Flutter.
---

أصبحت المكتبة تدعم الآن ملفات SVG المتحركة التي تعمل بالـ scripts، بما فيها تصديرات SVGator.

فبدلاً من تحويل الحركة إلى Lottie أو Rive أو GIF، أو اللجوء إلى WebView، يمكنك الإبقاء على ملف SVG الأصلي وعرضه مباشرةً في Flutter.

وهذه كانت الفكرة الأساسية وراء الحزمة: SVG يجب أن يبقى SVG.

تدعم الحزمة أصلاً SMIL وحركات CSS و path morphing والفلاتر والأقنعة والنصوص والتحكم في التشغيل، والآن الـ scripts المضمّنة أيضاً.

إذا كنت تبني تطبيقات Flutter وواجهت يوماً مشكلات مع ملفات SVG المتحركة، فيسعدني أن أسمع رأيك.

تجد full_svg_flutter على pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)
