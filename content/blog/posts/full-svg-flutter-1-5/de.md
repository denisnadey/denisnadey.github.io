---
title: "full_svg_flutter 1.5: ein DevTools-Inspector für SVGs zur Laufzeit"
description: full_svg_flutter 1.5 bringt einen DevTools-Inspector für laufende SVG-Renderer, korrigiert Prozent- und Bounding-Box-Geometrie und macht native Builds robuster.
---

Seit 1.4.2 gab es fünf Releases von full_svg_flutter: zwei Plattform-Fixes, ein neues Entwicklerwerkzeug, eine umfangreiche Korrekturrunde bei der Geometrie und einen Release, mit dem JavaScript-gesteuerte SVGs auf iOS funktionieren. Hier lesen Sie, was sich geändert hat und warum das wichtig ist.

## FullSVG DevTools Inspector (1.5.0)

Wenn ein animiertes SVG im Browser richtig aussieht, in der App aber falsch, müssen Sie sehen, was der Renderer tatsächlich gemacht hat. Ab 1.5.0 bringt full_svg_flutter eine offizielle Erweiterung für Flutter DevTools mit. Die Erweiterung verbindet sich mit einer laufenden Debug-App und untersucht die echten Renderer: dasselbe Dokument, dieselbe Animations-Timeline und denselben Painter, die auch Ihren Bildschirm zeichnen.

Was Sie bekommen:

- **Live-Instanzen.** Jeder gemountete Renderer wird einzeln aufgeführt, auch wenn dasselbe Asset zweimal gemountet ist – jeweils mit Quelle, Animationszustand und Anzahl der DOM-Knoten.
- **Das SVG-DOM, bei Bedarf geladen.** Kindknoten werden erst geladen, wenn Sie eine Zeile aufklappen, damit auch große Dokumente flüssig bedienbar bleiben. Wählen Sie einen Knoten aus, sehen Sie Tag, id, Klassen, rohe und aufgelöste Attributwerte, welche Attribute gerade animiert werden und welche SMIL- und CSS-Animationen auf ihn wirken.
- **Playback-Steuerung.** Abspielen, Pausieren, Neustarten, Springen und Geschwindigkeiten von 0,25× bis 2×. Die Steuerung treibt die eigene deterministische Uhr des Renderers an, statt eine zweite Timeline anzulegen.
- **Hervorhebung von Knoten.** Der ausgewählte Knoten wird in der laufenden App anhand seiner echten Render-Geometrie umrandet, ohne die Attribute des SVG anzufassen.
- **Ehrliche Statistiken.** DOM-Knoten, Anzahl der Animationen, aktive Animationen, Filterprimitive, Masken, Verläufe, Clip-Pfade, ob JavaScript enthalten ist, aktuelle Zeit und Dauer. Der Inspector erfindet keine Parse- oder Paint-Zeiten, die der Renderer gar nicht misst.

So öffnen Sie den Inspector:

1. Starten Sie Ihre App im Debug-Modus.
2. Öffnen Sie Flutter DevTools in Ihrer IDE oder über die Ausgabe von `flutter run`.
3. Aktivieren Sie die DevTools-Erweiterungen, wenn Sie dazu aufgefordert werden.
4. Wählen Sie die Erweiterung full_svg_flutter aus. Der Inspector erscheint dort als **FullSVG**.

Konfigurieren müssen Sie nichts. Die Bridge ist nur im Debug-Modus aktiv: Release-Builds registrieren keine Renderer, halten keine DOM-Bäume im Speicher und sammeln keine Inspector-Daten. Das Tracking der Instanzen arbeitet mit schwachen Referenzen und folgt dem Lebenszyklus der Widgets, und nach einem Hot Restart verbindet sich die Erweiterung neu.

Ein paar Einschränkungen sollten Sie kennen. Das Haupt-Isolate muss laufen und darf nicht an einem Breakpoint angehalten sein. Der Inspector zeigt an, ob JavaScript vorhanden ist, bietet aber bewusst keine Auswertung beliebigen JavaScript-Codes an. Berechnetes CSS, die Herkunft von Werten in der Kaskade, die Auswahl einzelner `<use>`-Instanzen und Frame-Timings sind für später geplant.

Die vollständige Anleitung steht in der [Inspector-Dokumentation](https://github.com/denisnadey/flutter_full_svg_support/blob/main/doc/en/devtools.md).

## Geometrie wie im Browser (1.5.1)

1.5.1 dreht sich um Korrektheit und basiert zum großen Teil auf Pull Requests aus der Community.

- **Prozentwerte beziehen sich auf den richtigen Viewport.** Grundformen, `<use>`-Geometrie und Instanz-Viewports, verschachtelte `<svg>`-Elemente, Textkoordinaten, Maskenbereiche und Hit-Testing verwenden alle den korrekten Viewport – auch bei einem Root-SVG ohne eigene Größe, dessen Viewport das Widget ist.
- **Animationen behalten ihre Einheiten.** SMIL-Animationen zwischen Prozent- und absoluten Werten behalten beide Einheiten – bei der Interpolation, bei additiver Komposition und beim Timing mit `calcMode="paced"`.
- **objectBoundingBox nutzt die richtige Box.** `clipPathUnits`, `maskUnits` und `maskContentUnits` verwenden die Grenzen der reinen Objektgeometrie. Eine Kontur bläht die Box also nicht mehr auf, und Textelemente als Ziel liefern ihre Layout-Grenzen, statt komplett weggeschnitten zu werden.
- **Animierte Filter- und Maskenbereiche greifen.** Animierte Prozentwerte für die Bereiche von `<filter>` und `<mask>` werden während der Animation neu gelesen, statt nur einmal aus dem Quelltext geparst zu werden.
- **Timing pro Instanz.** Paced-Animationen in gemeinsam genutzten `<symbol>`-Inhalten werden für den Viewport jeder einzelnen `<use>`-Instanz ausgewertet.

Wenn Ihre Grafiken auf prozentualen Längen beruhen – bei exportierten und responsiven SVGs ist das häufig –, rückt dieser Release sie deutlich näher an das heran, was ein Browser rendert.

## Native Builds auf allen Plattformen (1.4.3, 1.4.4, 1.5.2)

Inline-Skripte und SVGator-Exporte laufen in full_svg_flutter über [quickjs_engine](page:docs#quickjs-engine), mein QuickJS-NG-Paket für Flutter. In drei Releases ging es darum, diese native Schicht langweilig zu machen:

- **1.4.3, Windows.** Clean Builds unter Windows schlugen fehl, weil der von Flutter generierte Plugin-Registrant ein Symbol aufrief, das es nicht gab. Behoben mit quickjs_engine 0.1.4.
- **1.4.4, macOS Universal.** Universal-Apps für macOS liefern jetzt eine QuickJS-Bridge mit Slices sowohl für Apple Silicon als auch für Intel aus.
- **1.5.2, iOS, Swift Package Manager und Android Gradle Plugin 9.** JavaScript-gesteuerte SVGs werden jetzt auch auf iOS mit CocoaPods initialisiert. Frühere Versionen des Pods exportierten keine einzige Bridge-Funktion, deshalb schlug jedes SVG, das ein `<script>` enthielt, mit „Failed to lookup symbol 'jsNewRuntime'“ fehl. Außerdem fällt Flutter wegen quickjs_engine nicht mehr auf CocoaPods zurück, und Android-Apps mit AGP 9 lassen sich mit integriertem Kotlin bauen.

Die nativen Details stehen in einem eigenen Beitrag: [quickjs_engine 0.1.6](post:quickjs-engine-0-1-6).

## Upgrade

```yaml
dependencies:
  full_svg_flutter: ^1.5.2
```

Oder führen Sie `flutter pub upgrade full_svg_flutter` aus. Das Paket braucht Flutter 3.32 oder neuer, und laut Changelog gibt es zwischen 1.4.2 und 1.5.2 keine inkompatiblen API-Änderungen.

## Danke

Vier dieser fünf Releases enthalten Beiträge aus der Community: Bug-Reports, reproduzierbare Beispiele und Pull Requests. Danke an [@oierxjn](https://github.com/oierxjn), [@remtrik](https://github.com/remtrik), [@dariyooo](https://github.com/dariyooo), [@OrPudding](https://github.com/OrPudding), [@sufiyansayyed](https://github.com/sufiyansayyed) und [@DomingoMG](https://github.com/DomingoMG).

Wenn ein SVG anders gerendert wird als im Browser, öffnen Sie den Inspector, prüfen Sie die aufgelösten Attribute und [schicken Sie mir die Datei](https://github.com/denisnadey/flutter_full_svg_support/issues). Das ist nach wie vor der schnellste Weg, den Renderer besser zu machen.

Alle Änderungen: [pub.dev/packages/full_svg_flutter/changelog](https://pub.dev/packages/full_svg_flutter/changelog)
