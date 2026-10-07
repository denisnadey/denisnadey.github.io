---
title: Ich habe woff2 für Flutter veröffentlicht
description: Flutters FontLoader erwartet TTF oder OTF. woff2 dekodiert .woff und .woff2 zu SFNT-Bytes und registriert sie über die Standard-Font-Pipeline von Flutter.
---

Ich habe woff2 für Flutter veröffentlicht, um ein häufiges Problem zu lösen: den Umgang mit Schriften, die nicht als .ttf oder .otf vorliegen, sondern – gerade im Web-Umfeld – oft als .woff oder .woff2 geliefert werden.

Flutters FontLoader ist für unkomprimierte SFNT-Schriften gedacht, also für TTF/OTF-Bytes. Wer eine WOFF2-Datei direkt lädt, bekommt Probleme. Deshalb habe ich ein Paket entwickelt, mit dem sich .woff- und .woff2-Schriftdateien in Flutter nutzen lassen: Es dekodiert sie zu SFNT-Bytes und registriert sie über die Standard-Font-Pipeline von Flutter.

Die wichtigsten Funktionen des woff2-Pakets:

- Dekodierung von WOFF1 und WOFF2
- Laden von Schriften aus Assets und aus Bytes
- Ein Wrapper für Flutters FontLoader
- Parsen von @font-face-Regeln in CSS
- Unterstützung für eingebettete Schriften als data: URL
- Gesammelte Registrierung mehrerer Schnitte und Stile
- Kein nativer Plugin-Code in Ihrer App nötig

Das Paket ist aus meiner Arbeit am Rendering animierter SVGs entstanden, in denen Schriften oft per CSS eingebettet sind. Ohne saubere WOFF/WOFF2-Unterstützung kann die Darstellung scheitern, obwohl das SVG korrekt geparst wurde.

Nicht jede Flutter-App braucht das. Für Anwendungen, die externe Inhalte verarbeiten – etwa SVG, HTML, EPUB, Dokumentvorschauen, Design-Exporte, E-Mail-Rendering oder Rich-Text-Pipelines –, ist es aber nützlich. Das Paket kann einen lästigen Konvertierungsschritt überflüssig machen.

Noch ist das Paket in einem frühen Stadium, aber die Kernfunktionen stehen.

Hier geht es zum Paket: [pub.dev/packages/woff2](https://pub.dev/packages/woff2)

Ich freue mich über Feedback von Flutter-Entwicklern, die sich mit eigenen Schriften, SVG-Rendering, Dokument-Rendering oder typografielastigen Anwendungen auskennen.
