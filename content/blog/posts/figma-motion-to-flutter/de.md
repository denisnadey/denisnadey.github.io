---
title: Figma Motion → Flutter ist schon da.
description: Figma Motion exportiert Animated SVG, full_svg_flutter rendert es direkt in Flutter. Ohne Lottie-Konvertierung, ohne WebView, ohne Zwischenformat.
---

Keine Lottie-Konvertierung. Kein WebView. Kein Nachbau der Animation von Hand. Überhaupt kein Zwischenformat für Animationen.

Figma Motion kann jetzt direkt **Animated SVG** exportieren.

Und full_svg_flutter kann dieses animierte SVG **direkt in Flutter** rendern.

Damit kann die Übergabe Designer → Entwickler endlich so aussehen:

**Designer**

Figma → Motion → Animieren → Exportieren → **Animated SVG**

**Flutter-Entwickler**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

Fertig.

Das war’s.

Und ich glaube, das ist ein viel größerer Schritt, als es auf den ersten Blick aussieht.

Jahrelang sah der übliche Workflow für Animationen in Mobile-Apps ungefähr so aus:

```flow
Figma
After Effects / Plugin / ein anderes Animationstool
Lottie JSON
noch eine Runtime
Flutter
```

Oder:

```flow
Figma Motion
Animationsdaten exportieren
Figma-Nodes von Hand auf Flutter-Widgets abbilden
Teile der Szene im Code nachbauen
```

Oder, im schlimmsten Fall:

```flow
animiertes SVG
WebView 😐
```

Aber jetzt erzeugt Figma selbst **Animated SVG**.

Warum also eine einwandfreie Vektoranimation in ein anderes Format konvertieren, nur um sie in eine Flutter-App zu bringen?

Mit full_svg_flutter ist die .svg-Datei selbst das Runtime-Asset.

Das Paket unterstützt bereits:

- **Animiertes SVG in Flutter**
- CSS-@keyframes-Animationen
- SMIL-Animationen
- Animierte Transformationen
- Path Morphing
- Verläufe und Muster
- Masken und Clip-Pfade
- SVG-Filter
- Text
- JavaScript-gesteuerte SVG-Animationen
- SVGator-Exporte
- Abspielen / Pausieren / Springen
- Steuerung der Abspielgeschwindigkeit
- Statisches und animiertes SVG über denselben Renderer
- Keine Lottie-Konvertierung
- Kein WebView

Und der Zeitpunkt ist besonders spannend:

Figma Motion exportiert derzeit **MP4, GIF, WebM und Animated SVG**.

Laut Figma kommt der native **Lottie-Export erst später**.

Aber für Flutter müssen wir darauf nicht unbedingt warten.

Schon heute kann der Animated-SVG-Export genau das sein, was übergeben wird.

---

## An alle Designer: Willkommen bei Flutter. 💙

Erstellen Sie die Animation dort, wo Sie ohnehin das Interface gestalten.

Exportieren Sie das Animated SVG.

Schicken Sie dem Entwickler **eine einzige** .svg-Datei.

Das war’s.

Und an alle Flutter-Entwickler:

Falls Sie nach **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation** oder **Lottie alternative for Flutter** gesucht haben –

genau für diesen Workflow entwickle ich full_svg_flutter.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

Ich will das noch viel weiter vorantreiben.

Wenn Sie also als Motion Designer mit **Figma Motion** arbeiten, schicken Sie mir Ihren fiesesten Animated-SVG-Export.

Komplexe Masken. Filter. Morphing. Schräge Transformationen. Lange Timelines.

**Versuchen Sie, den Renderer kaputtzukriegen.**

Ich finde seine Grenzfälle lieber selbst, als dass Sie erst in Produktion darauf stoßen.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

Vielleicht ist der Weg einer Animation vom Design nach Flutter gerade deutlich kürzer geworden.
