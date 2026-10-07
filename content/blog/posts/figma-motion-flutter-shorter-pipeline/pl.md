---
title: Pipeline Figma Motion → Flutter właśnie mocno się skrócił.
description: Figma Motion eksportuje Animated SVG, a full_svg_flutter renderuje je w aplikacji Flutter. Designer tworzy animację, programista dostaje jeden plik .svg.
---

I mam wrażenie, że wiele zespołów pracujących z Flutterem jeszcze tego nie zauważyło.

Figma Motion potrafi eksportować do Animated SVG.

full_svg_flutter potrafi wyrenderować to Animated SVG bezpośrednio w aplikacji Flutter.

- Bez konwersji do Lottie.
- Bez WebView.
- Bez odtwarzania animacji od nowa we Flutterze.
- Bez pośredniego formatu animacji.

Workflow może dosłownie wyglądać tak:

**Figma Motion → eksport do Animated SVG → Flutter**

Designer tworzy animację.
Programista dostaje jeden plik .svg.
Flutter renderuje ją bezpośrednio.

Przez lata wpisanie w wyszukiwarkę „Figma Motion to Flutter”, „Figma animation export Flutter”, „animated SVG Flutter” czy „Flutter SVG animation” zwykle kończyło się znalezieniem kolejnego kroku konwersji.

- Lottie.
- Rive.
- JSON.
- Plugin.
- WebView.

Albo ręczne odtwarzanie animacji.

Ale skoro źródłowy asset to już Animated SVG, po co w ogóle go konwertować?

Dokładnie ten problem chciałem rozwiązać, budując full_svg_flutter.
Pakiet obsługuje animowane SVG bezpośrednio we Flutterze, w tym SMIL, animacje CSS, transformacje, path morphing, maski, gradienty, filtry, eksporty SVGator i kontrolę odtwarzania.

A teraz Figma Motion sprawia, że ten workflow robi się dużo ciekawszy.

Designerzy, witajcie we Flutterze.

Napisałem dokładniejsze omówienie tego, jak działa Figma Motion → Animated SVG → Flutter, dlaczego ma to znaczenie dla przekazywania pracy od designera do programisty i dokąd to może dalej zmierzać.

[Przeczytaj artykuł](post:figma-motion-to-flutter)

A jeśli pracujesz w Figma Motion, przyślij mi swój najbardziej złożony eksport Animated SVG.

Naprawdę zachęcam: spróbuj zepsuć ten renderer.
