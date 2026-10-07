---
title: Major library update for full_svg_flutter.
description: full_svg_flutter now renders animated SVGs with inline scripts, including SVGator exports, so the original SVG can stay SVG inside a Flutter app.
---

It now supports animated SVGs with scripts, including SVGator exports.

So instead of converting animations to Lottie, Rive, GIF, or using a WebView, you can keep the original SVG and render it directly in Flutter.

That was the main idea behind this package: SVG should stay SVG.

The package already supports SMIL, CSS animations, path morphing, filters, masks, text, playback control, and now inline scripts.

If you build Flutter apps and ever had problems with animated SVGs, I’d love to hear your feedback.

full_svg_flutter is available on pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)
