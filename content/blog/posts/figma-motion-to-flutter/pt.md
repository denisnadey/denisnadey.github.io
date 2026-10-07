---
title: Figma Motion → Flutter já é realidade.
description: O Figma Motion exporta Animated SVG, e o full_svg_flutter o renderiza direto no Flutter. Sem conversão para Lottie, sem WebView, sem formato intermediário.
---

Sem conversão para Lottie. Sem WebView. Sem refazer a animação na mão. Sem nenhum formato intermediário de animação.

O Figma Motion agora consegue exportar **Animated SVG** diretamente.

E o full_svg_flutter consegue renderizar esse SVG animado **direto dentro do Flutter**.

Então o handoff designer → desenvolvedor pode, finalmente, ficar assim:

**Designer**

Figma → Motion → Animar → Exportar → **Animated SVG**

**Desenvolvedor Flutter**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

Pronto.

Só isso.

E acho que isso é bem mais importante do que parece.

Durante anos, o fluxo padrão de animação no mobile foi mais ou menos assim:

```flow
Figma
After Effects / plugin / outra ferramenta de animação
JSON do Lottie
mais um runtime
Flutter
```

Ou:

```flow
Figma Motion
exportar os dados da animação
mapear à mão os nós do Figma para widgets Flutter
recriar partes da cena em código
```

Ou, no pior dos casos:

```flow
SVG animado
WebView 😐
```

Mas agora o próprio Figma gera **Animated SVG**.

Por que, então, converter para outro formato uma animação vetorial que já funciona muito bem, só para colocá-la em um app Flutter?

Com o full_svg_flutter, o próprio .svg é o asset usado em runtime.

Ele já suporta:

- **SVG animado no Flutter**
- animações CSS @keyframes
- animações SMIL
- transformações animadas
- path morphing
- gradientes e patterns
- máscaras e clip paths
- filtros SVG
- texto
- animações SVG controladas por JavaScript
- exportações do SVGator
- play / pause / seek
- controle da velocidade de reprodução
- SVG estático e animado pelo mesmo renderizador
- sem conversão para Lottie
- sem WebView

E o momento é especialmente interessante:

Hoje, o Figma Motion exporta **MP4, GIF, WebM e Animated SVG**.

Segundo o Figma, a **exportação nativa para Lottie ainda vai chegar mais tarde**.

Mas, no caso do Flutter, não precisamos necessariamente esperar por ela.

A exportação em Animated SVG já pode ser o entregável.

---

## Designers: bem-vindos ao Flutter. 💙

Crie a animação onde você já cria a interface.

Exporte o Animated SVG.

Envie ao desenvolvedor **um único** arquivo .svg.

Só isso.

E vocês, desenvolvedores Flutter:

se andam pesquisando **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation** ou uma **Lottie alternative for Flutter** –

é exatamente para esse fluxo de trabalho que venho construindo o full_svg_flutter.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

Quero levar isso muito mais longe.

Então, se você é motion designer e usa o **Figma Motion**, me mande a exportação em Animated SVG mais cabeluda que você tiver.

Máscaras complexas. Filtros. Morphing. Transformações bizarras. Linhas do tempo longas.

**Tente quebrar.**

Prefiro encontrar os edge cases no renderizador a deixar que você os descubra em produção.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

Talvez o handoff de animação do design para o Flutter tenha acabado de ficar muito mais curto.
