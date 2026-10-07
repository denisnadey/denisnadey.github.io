---
title: Figma Motion → Flutter ist gerade zu einer viel kürzeren Pipeline geworden.
description: Figma Motion exportiert Animated SVG, full_svg_flutter rendert es in der Flutter-App. Der Designer animiert, der Entwickler bekommt eine einzige .svg-Datei.
---

Und ich glaube, viele Flutter-Teams haben das noch gar nicht mitbekommen.

Figma Motion kann Animated SVG exportieren.

full_svg_flutter kann dieses Animated SVG direkt in einer Flutter-Anwendung rendern.

- Keine Lottie-Konvertierung.
- Kein WebView.
- Kein Nachbau der Animation in Flutter.
- Kein Zwischenformat für Animationen.

Der Workflow kann buchstäblich so aussehen:

**Figma Motion → Animated SVG exportieren → Flutter**

Der Designer gestaltet die Animation.
Der Entwickler bekommt eine einzige .svg-Datei.
Flutter rendert sie direkt.

Jahrelang führte die Suche nach „Figma Motion to Flutter“, „Figma animation export Flutter“, „animated SVG Flutter“ oder „Flutter SVG animation“ meist nur zu einem weiteren Konvertierungsschritt.

- Lottie.
- Rive.
- JSON.
- Ein Plugin.
- Ein WebView.

Oder man hat die Animation von Hand nachgebaut.

Aber wenn die Quelldatei schon ein Animated SVG ist – warum sie dann überhaupt konvertieren?

Genau für dieses Problem habe ich full_svg_flutter gebaut.
Das Paket unterstützt animiertes SVG direkt in Flutter, darunter SMIL, CSS-Animationen, Transformationen, Path Morphing, Masken, Verläufe, Filter, SVGator-Exporte und Playback-Steuerung.

Und mit Figma Motion wird dieser Workflow jetzt noch viel interessanter.

An alle Designer: Willkommen bei Flutter.

In einem ausführlicheren Artikel erkläre ich, wie Figma Motion → Animated SVG → Flutter funktioniert, warum das für die Übergabe vom Designer an den Entwickler wichtig ist und wohin die Reise gehen könnte.

[Artikel lesen](post:figma-motion-to-flutter)

Und wenn Sie Figma Motion nutzen: Schicken Sie mir Ihren komplexesten Animated-SVG-Export.

Ich meine es ernst: Versuchen Sie, den Renderer kaputtzukriegen.
