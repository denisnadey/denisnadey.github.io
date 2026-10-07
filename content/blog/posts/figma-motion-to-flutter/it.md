---
title: Figma Motion → Flutter è già realtà.
description: Figma Motion esporta in Animated SVG e full_svg_flutter lo renderizza direttamente in Flutter. Senza passare da Lottie, da una WebView o da formati intermedi.
---

Niente conversione in Lottie. Niente WebView. Niente animazioni da rifare a mano. Zero formati di animazione intermedi.

Figma Motion ora può esportare direttamente in **Animated SVG**.

E full_svg_flutter può renderizzare quell'SVG animato **direttamente dentro Flutter**.

Quindi il passaggio di consegne designer → sviluppatore può finalmente funzionare così:

**Designer**

Figma → Motion → Anima → Esporta → **Animated SVG**

**Sviluppatore Flutter**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

Fatto.

Tutto qui.

E secondo me è una novità molto più importante di quanto sembri.

Per anni il workflow standard per le animazioni mobile è stato più o meno questo:

```flow
Figma
After Effects / plugin / un altro strumento di animazione
Lottie JSON
un altro runtime
Flutter
```

Oppure:

```flow
Figma Motion
esportare i dati dell'animazione
mappare a mano i nodi di Figma sui widget Flutter
ricreare in codice parti della scena
```

Oppure, nel caso peggiore:

```flow
SVG animato
WebView 😐
```

Ma adesso è Figma stesso a produrre **Animated SVG**.

E allora perché convertire un'animazione vettoriale perfettamente valida in un altro formato, solo per metterla in un'app Flutter?

Con full_svg_flutter, l'asset usato a runtime è proprio il file .svg.

Supporta già:

- **SVG animati in Flutter**
- animazioni CSS @keyframes
- animazioni SMIL
- trasformazioni animate
- path morphing
- gradienti e pattern
- maschere e clip path
- filtri SVG
- testo
- animazioni SVG guidate da JavaScript
- export SVGator
- play / pausa / seek
- controllo della velocità di riproduzione
- SVG statici e animati con lo stesso renderer
- nessuna conversione in Lottie
- nessuna WebView

E il tempismo è particolarmente interessante:

Al momento Figma Motion esporta in **MP4, GIF, WebM e Animated SVG**.

Secondo Figma, l'**export nativo in Lottie arriverà più avanti**.

Ma per Flutter non dobbiamo per forza aspettarlo.

L'export in Animated SVG può già essere il file da consegnare.

---

## Designer, benvenuti nel mondo Flutter. 💙

Create l'animazione dove create già l'interfaccia.

Esportate in Animated SVG.

Mandate allo sviluppatore **un solo** file .svg.

Tutto qui.

E voi, sviluppatori Flutter:

se da tempo cercate **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation** o **Lottie alternative for Flutter** –

questo è esattamente il workflow per cui sto sviluppando full_svg_flutter.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

Voglio spingermi molto più in là.

Quindi, se sei un motion designer e usi **Figma Motion**, mandami l'export in Animated SVG più rognoso che hai.

Maschere complesse. Filtri. Morphing. Trasformazioni strane. Timeline lunghe.

**Prova a romperlo.**

Preferisco trovare io i casi limite del renderer, piuttosto che lasciarteli scoprire in produzione.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

Forse il passaggio di consegne delle animazioni dal design a Flutter si è appena accorciato di parecchio.
