---
title: Lancei o woff2 para Flutter
description: O FontLoader do Flutter espera TTF ou OTF. O woff2 decodifica .woff e .woff2 em bytes SFNT e os registra pelo pipeline padrão de fontes do Flutter.
---

Lancei o woff2 para Flutter com o objetivo de resolver um desafio comum: trabalhar com fontes que não estão em .ttf nem em .otf e que, principalmente em contextos web, costumam chegar como .woff ou .woff2.

O FontLoader do Flutter foi feito para fontes SFNT sem compressão, ou seja, bytes TTF/OTF. Tentar carregar um arquivo WOFF2 diretamente causa problemas. Para lidar com isso, desenvolvi um pacote que permite usar arquivos de fonte .woff e .woff2 no Flutter: ele os decodifica em bytes SFNT e os registra pelo pipeline padrão de fontes do Flutter.

Principais recursos do pacote woff2:

- Decodificação de WOFF1 e WOFF2
- Carregamento de fontes a partir de assets e de bytes
- Um wrapper para o FontLoader do Flutter
- Parsing de @font-face em CSS
- Suporte a fontes embutidas via data: URL
- Registro em lote de vários pesos e estilos
- Sem necessidade de código nativo de plugin no seu app

O pacote nasceu do meu trabalho com renderização de SVG animado, em que as fontes muitas vezes vêm embutidas via CSS. Sem suporte adequado a WOFF/WOFF2, a renderização visual pode falhar mesmo quando o parsing do SVG está correto.

Nem todo app Flutter vai precisar disso, mas o pacote é útil para aplicativos que consomem conteúdo externo, como SVG, HTML, EPUB, pré-visualização de documentos, exportações de design, renderização de e-mails ou pipelines de texto rico. Ele pode eliminar uma etapa de conversão frustrante.

O pacote ainda está em estágio inicial, mas a funcionalidade principal já está consolidada.

Conheça o pacote aqui: [pub.dev/packages/woff2](https://pub.dev/packages/woff2)

Feedback de desenvolvedores Flutter com experiência em fontes customizadas, renderização de SVG, renderização de documentos ou aplicativos com muita tipografia é muito bem-vindo.
