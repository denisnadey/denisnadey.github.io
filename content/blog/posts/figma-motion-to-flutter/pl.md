---
title: Figma Motion → Flutter działa już dziś.
description: Figma Motion eksportuje Animated SVG, a full_svg_flutter renderuje je bezpośrednio we Flutterze. Bez konwersji do Lottie, bez WebView, bez formatu pośredniego.
---

Bez konwersji do Lottie. Bez WebView. Bez ręcznego odtwarzania animacji. Bez jakiegokolwiek pośredniego formatu animacji.

Figma Motion potrafi teraz eksportować animacje bezpośrednio do **Animated SVG**.

A full_svg_flutter potrafi wyrenderować takie animowane SVG **bezpośrednio we Flutterze**.

Przekazanie pracy na linii designer → programista może więc wreszcie wyglądać tak:

**Designer**

Figma → Motion → animacja → eksport → **Animated SVG**

**Programista Flutter**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

Gotowe.

I tyle.

Moim zdaniem ma to dużo większe znaczenie, niż się wydaje.

Przez lata standardowy workflow animacji w aplikacjach mobilnych wyglądał mniej więcej tak:

```flow
Figma
After Effects / plugin / inne narzędzie do animacji
Lottie JSON
kolejny runtime
Flutter
```

Albo:

```flow
Figma Motion
eksport danych animacji
ręczne mapowanie węzłów z Figmy na widgety Fluttera
odtwarzanie części sceny w kodzie
```

Albo, w najgorszym przypadku:

```flow
animowane SVG
WebView 😐
```

Ale teraz **Animated SVG** generuje sama Figma.

Po co więc konwertować porządną animację wektorową do innego formatu tylko po to, żeby wrzucić ją do aplikacji Flutter?

Z full_svg_flutter to sam plik .svg trafia do aplikacji i jest w niej renderowany.

Pakiet już teraz obsługuje:

- **animowane SVG we Flutterze**
- animacje CSS @keyframes
- animacje SMIL
- animowane transformacje
- path morphing
- gradienty i wzory
- maski i ścieżki przycinania
- filtry SVG
- tekst
- animacje SVG sterowane JavaScriptem
- eksporty SVGator
- odtwarzanie / pauzę / seek
- regulację tempa odtwarzania
- statyczne i animowane SVG w tym samym rendererze
- bez konwersji do Lottie
- bez WebView

I to w szczególnie ciekawym momencie:

Figma Motion eksportuje obecnie do **MP4, GIF, WebM i Animated SVG**.

Według Figmy natywny **eksport do Lottie pojawi się dopiero później**.

Ale we Flutterze niekoniecznie musimy na niego czekać.

Eksport do Animated SVG może już teraz być finalnym plikiem do przekazania.

---

## Designerzy, witajcie we Flutterze. 💙

Twórzcie animację tam, gdzie już projektujecie interfejs.

Wyeksportujcie ją jako Animated SVG.

Wyślijcie programiście **jeden** plik .svg.

I tyle.

A wy, programiści Flutter:

jeśli szukacie w sieci haseł **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation** czy **Lottie alternative for Flutter** –

to jest dokładnie ten workflow, z myślą o którym buduję full_svg_flutter.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

Chcę pójść z tym dużo dalej.

Jeśli więc robisz motion design w **Figma Motion**, przyślij mi swój najbardziej wredny eksport Animated SVG.

Złożone maski. Filtry. Morphing. Dziwne transformacje. Długie osie czasu.

**Spróbuj go zepsuć.**

Wolę sam wyłapać przypadki brzegowe w rendererze, niż czekać, aż odkryjesz je na produkcji.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

Być może droga animacji od designu do Fluttera właśnie mocno się skróciła.
