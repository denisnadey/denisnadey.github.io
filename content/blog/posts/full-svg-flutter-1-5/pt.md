---
title: "full_svg_flutter 1.5: um inspetor no DevTools para SVG em execução"
description: O full_svg_flutter 1.5 traz um inspetor no DevTools para SVG em execução, corrige a geometria com porcentagens e bounding box e reforça os builds nativos.
---

Desde a 1.4.2, o full_svg_flutter teve cinco releases: duas correções de plataforma, uma nova ferramenta para desenvolvedores, uma grande rodada de acertos na geometria e uma release que faz SVGs controlados por JavaScript funcionarem no iOS. Veja o que mudou e por que isso importa.

## Inspetor FullSVG no DevTools (1.5.0)

Quando um SVG animado aparece certo no navegador, mas errado no app, você precisa ver o que o renderizador realmente fez. A partir da 1.5.0, o full_svg_flutter vem com uma extensão oficial para o Flutter DevTools. Ela se conecta a um app rodando em modo debug e inspeciona os renderizadores reais: o mesmo documento, a mesma linha do tempo de animação e o mesmo painter que desenham a sua tela.

O que você ganha:

- **Instâncias em execução.** Cada renderizador montado aparece separadamente, inclusive quando o mesmo asset é montado duas vezes, com a sua origem, o estado da animação e o número de nós do DOM.
- **O DOM do SVG, carregado sob demanda.** Os nós filhos só são carregados quando você expande uma linha, então documentos grandes continuam responsivos. Ao selecionar um nó, você vê a tag, o id, as classes, os valores brutos e resolvidos dos atributos, quais atributos estão sendo animados naquele instante e as animações SMIL e CSS que têm esse nó como alvo.
- **Controle de reprodução.** Reproduzir, pausar, reiniciar, fazer seek e ajustar a velocidade de 0,25× a 2×. Os controles comandam o próprio relógio determinístico do renderizador, em vez de criar uma segunda linha do tempo.
- **Destaque de nós.** O nó selecionado ganha um contorno no app em execução, desenhado a partir da sua geometria real de renderização, sem mexer nos atributos do SVG.
- **Estatísticas honestas.** Nós do DOM, contagem de animações, animações ativas, primitivas de filtro, máscaras, gradientes, clip paths, presença de JavaScript, tempo atual e duração. O inspetor não inventa tempos de parsing ou de pintura que o renderizador não mede.

Para abrir:

1. Rode o app em modo debug.
2. Abra o Flutter DevTools pela sua IDE ou pela saída do `flutter run`.
3. Habilite as extensões do DevTools quando for solicitado.
4. Selecione a extensão full_svg_flutter. O inspetor se identifica como **FullSVG**.

Não há nada para configurar. A ponte só existe em debug: builds de release não registram renderizadores, não mantêm árvores DOM e não coletam dados para o inspetor. O rastreamento de instâncias usa referências fracas e acompanha o ciclo de vida do widget, e a extensão se reconecta depois de um hot restart.

Vale conhecer algumas limitações. O isolate principal precisa estar rodando, e não pausado em um breakpoint. A presença de JavaScript é informada, mas o inspetor deliberadamente não permite avaliar JavaScript arbitrário. CSS computado, a procedência dos valores na cascata, a seleção de instâncias `<use>` individuais e os tempos de frame ficam para versões futuras.

O guia completo está na [documentação do inspetor](https://github.com/denisnadey/flutter_full_svg_support/blob/main/doc/en/devtools.md).

## Geometria que se comporta como no navegador (1.5.1)

A 1.5.1 é uma release focada em corretude, feita em grande parte a partir de pull requests da comunidade.

- **As porcentagens são resolvidas em relação à viewport certa.** Formas básicas, a geometria de `<use>` e as viewports das suas instâncias, `<svg>` aninhado, coordenadas de texto, regiões de máscara e hit testing: tudo usa a viewport correta, inclusive no caso de um SVG raiz sem tamanho próprio, cuja viewport é o widget.
- **As animações mantêm suas unidades.** Animações SMIL entre valores percentuais e absolutos preservam as duas unidades na interpolação, na composição aditiva e no timing `calcMode="paced"`.
- **objectBoundingBox usa a caixa certa.** `clipPathUnits`, `maskUnits` e `maskContentUnits` usam os limites do objeto sem considerar a pintura, então o traçado não infla mais a caixa, e alvos de texto contribuem com seus limites de layout em vez de desaparecerem no recorte.
- **Regiões animadas de filtro e de máscara passam a ter efeito.** Porcentagens animadas nas regiões de `<filter>` e `<mask>` são relidas durante a animação, em vez de serem lidas uma única vez do SVG de origem.
- **Timing por instância.** Animações em modo paced dentro de conteúdo `<symbol>` compartilhado são avaliadas para a viewport de cada instância de `<use>`.

Se a sua arte depende de comprimentos em porcentagem, algo comum em SVGs exportados e responsivos, esta release deixa o resultado muito mais próximo do que um navegador renderiza.

## Builds nativos em todas as plataformas (1.4.3, 1.4.4, 1.5.2)

O full_svg_flutter executa scripts inline e exportações do SVGator por meio do [quickjs_engine](page:docs#quickjs-engine), o meu pacote de QuickJS-NG para Flutter. Três releases foram dedicadas a deixar essa camada nativa sem drama:

- **1.4.3, Windows.** Builds limpos no Windows falhavam porque o código de registro de plugins gerado pelo Flutter chamava um símbolo que não existia. Corrigido com o quickjs_engine 0.1.4.
- **1.4.4, macOS universal.** Apps universais para macOS agora incluem uma ponte QuickJS com slices tanto para Apple Silicon quanto para Intel.
- **1.5.2, iOS, Swift Package Manager e Android Gradle Plugin 9.** SVGs controlados por JavaScript agora inicializam no iOS com CocoaPods. As versões anteriores do pod não exportavam nenhuma função da ponte, então todo SVG com `<script>` falhava com “Failed to lookup symbol 'jsNewRuntime'”. Além disso, o Flutter não recorre mais ao CocoaPods por causa do quickjs_engine, e apps Android no AGP 9 compilam com o Kotlin integrado.

Os detalhes da camada nativa estão em um post à parte: [quickjs_engine 0.1.6](post:quickjs-engine-0-1-6).

## Como atualizar

```yaml
dependencies:
  full_svg_flutter: ^1.5.2
```

Ou rode `flutter pub upgrade full_svg_flutter`. O pacote exige Flutter 3.32 ou superior, e o changelog não registra nenhuma mudança incompatível na API entre a 1.4.2 e a 1.5.2.

## Obrigado

Quatro dessas cinco releases incluem contribuições da comunidade: relatos de bugs, casos de reprodução e pull requests. Obrigado, [@oierxjn](https://github.com/oierxjn), [@remtrik](https://github.com/remtrik), [@dariyooo](https://github.com/dariyooo), [@OrPudding](https://github.com/OrPudding), [@sufiyansayyed](https://github.com/sufiyansayyed) e [@DomingoMG](https://github.com/DomingoMG).

Se um SVG renderizar diferente do navegador, abra o inspetor, confira os atributos resolvidos e [me mande o arquivo](https://github.com/denisnadey/flutter_full_svg_support/issues). Essa continua sendo a forma mais rápida de melhorar o renderizador.

Changelog completo: [pub.dev/packages/full_svg_flutter/changelog](https://pub.dev/packages/full_svg_flutter/changelog)
