---
title: Figma Motion → Flutter acaba de virar um pipeline muito mais curto.
description: O Figma Motion exporta Animated SVG, e o full_svg_flutter o renderiza em um app Flutter. O designer cria a animação; o desenvolvedor recebe um único .svg.
---

E acho que muitos times Flutter ainda não se deram conta disso.

O Figma Motion consegue exportar Animated SVG.

O full_svg_flutter consegue renderizar esse Animated SVG direto dentro de um aplicativo Flutter.

- Sem conversão para Lottie.
- Sem WebView.
- Sem refazer a animação no Flutter.
- Sem formato intermediário de animação.

O fluxo pode ser, literalmente:

**Figma Motion → Exportar Animated SVG → Flutter**

O designer cria a animação.
O desenvolvedor recebe um único arquivo .svg.
O Flutter renderiza a animação diretamente.

Durante anos, pesquisar “Figma Motion to Flutter”, “Figma animation export Flutter”, “animated SVG Flutter” ou “Flutter SVG animation” geralmente significava encontrar mais uma etapa de conversão.

- Lottie.
- Rive.
- JSON.
- Um plugin.
- Uma WebView.

Ou recriar a animação manualmente.

Mas, se o asset de origem já é um Animated SVG, para que convertê-lo?

Foi exatamente para resolver esse problema que criei o full_svg_flutter.
Ele suporta SVG animado direto no Flutter, incluindo SMIL, animações CSS, transformações, path morphing, máscaras, gradientes, filtros, exportações do SVGator e controle de reprodução.

E agora o Figma Motion deixa esse fluxo muito mais interessante.

Designers: bem-vindos ao Flutter.

Escrevi uma análise mais aprofundada sobre como funciona o fluxo Figma Motion → Animated SVG → Flutter, por que isso importa para o handoff entre designer e desenvolvedor e para onde isso pode ir daqui para a frente.

[Ler o artigo](post:figma-motion-to-flutter)

E, se você usa o Figma Motion, me mande a sua exportação em Animated SVG mais complexa.

Quero de verdade que você tente quebrar o renderizador.
