---
title: Großes Update für full_svg_flutter.
description: full_svg_flutter rendert jetzt animierte SVGs mit Inline-Skripten, auch SVGator-Exporte. So bleibt das Original-SVG auch in der Flutter-App ein SVG.
---

Die Bibliothek unterstützt jetzt animierte SVGs mit Skripten, darunter SVGator-Exporte.

Statt Animationen nach Lottie, Rive oder GIF zu konvertieren oder ein WebView zu verwenden, können Sie also das Original-SVG behalten und direkt in Flutter rendern.

Das war die Grundidee hinter dem Paket: SVG soll SVG bleiben.

Das Paket unterstützt bereits SMIL, CSS-Animationen, Path Morphing, Filter, Masken, Text, Playback-Steuerung und jetzt auch Inline-Skripte.

Wenn Sie Flutter-Apps bauen und schon einmal Ärger mit animierten SVGs hatten, freue ich mich über Ihr Feedback.

full_svg_flutter gibt es auf pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)
