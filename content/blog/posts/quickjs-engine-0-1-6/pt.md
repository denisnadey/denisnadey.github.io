---
title: "quickjs_engine 0.1.6: Swift Package Manager e Android Gradle Plugin 9"
description: O quickjs_engine 0.1.6 adiciona Swift Package Manager no iOS e no macOS, compila com o Android Gradle Plugin 9 e faz a ponte via CocoaPods carregar no iOS.
---

O quickjs_engine dá ao Flutter um único motor JavaScript moderno, o QuickJS-NG, no Android, iOS, macOS, Linux e Windows. Ele também executa as exportações do SVGator e os scripts inline no full_svg_flutter. Esse segundo papel deixa os problemas de build nativo muito visíveis: quando a ponte não carrega, os SVGs animados param de animar.

As versões 0.1.4 a 0.1.6 são inteiramente dedicadas à camada nativa. Veja o que cada uma corrige.

## Swift Package Manager no iOS e no macOS (0.1.6)

O Flutter está migrando os plugins de iOS e macOS do CocoaPods para o Swift Package Manager. Até esta release, o quickjs_engine aparecia na lista “The following plugins do not support Swift Package Manager”, e o Flutter recorria ao CocoaPods por causa dele.

A 0.1.6 traz manifestos do Swift Package Manager para iOS e macOS. A ponte é embutida como um pequeno framework dinâmico, então os símbolos que ela exporta sobrevivem ao `flutter build ipa` e aos archives do macOS. Um único manifesto funciona tanto com o Flutter 3.38, que não tem o pacote `FlutterFramework` gerado, quanto com o 3.41 e posteriores.

O Swift Package Manager vem ativado por padrão nas versões estáveis recentes do Flutter. Nas mais antigas, a partir do Flutter 3.35, ative-o por projeto:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

Do Flutter 3.32 ao 3.34, ative-o para toda a instalação do Flutter, e não por projeto:

```bash
flutter config --enable-swift-package-manager
```

Obrigado a [@DomingoMG](https://github.com/DomingoMG) por relatar o problema na [#55](https://github.com/denisnadey/flutter_full_svg_support/issues/55).

## Uma ponte via CocoaPods que de fato exporta a ponte (0.1.6)

Esta é a correção mais importante se o seu app iOS usa CocoaPods. O CocoaPods ignorava silenciosamente os arquivos-fonte em `../native/cxx` declarados no podspec, então o framework do pod não exportava nada da ponte FFI. Na 0.1.5 e anteriores, todo `evaluate()` no iOS falhava com:

```text
Failed to lookup symbol 'jsNewRuntime'
```

Agora o pod compila esses arquivos. Se o seu Podfile usa linkagem estática para os pods, o README traz um workaround curto para o Podfile: o Dart encontra a ponte via `DynamicLibrary.process()`, então o pod precisa continuar sendo um framework dinâmico.

## Android Gradle Plugin 9 (0.1.6)

O plugin não aplica mais o Kotlin Gradle Plugin, porque a classe do plugin agora é escrita em Java. Apps no Android Gradle Plugin 9 compilam com o Kotlin integrado ligado ou desligado, em vez de falharem com “The 'org.jetbrains.kotlin.android' plugin is no longer required” ou de exibirem um aviso de que o plugin aplica o KGP. O `compileSdk` segue o `flutter.compileSdkVersion` do app, e o plugin compila com Java 17.

Obrigado a [@sufiyansayyed](https://github.com/sufiyansayyed) por relatar o problema na [#52](https://github.com/denisnadey/flutter_full_svg_support/issues/52) e pela migração inicial no [#53](https://github.com/denisnadey/flutter_full_svg_support/pull/53).

## Correções menores na 0.1.6

- `QuickJsRuntime2(memoryLimit: ...)` com um limite positivo não lança mais “Failed to lookup symbol 'jsSetMemoryLimit'”. A ponte agora exporta essa função em todas as plataformas.
- Builds otimizados de iOS e macOS definem `NDEBUG`, como os builds de release com CMake nas outras plataformas, então as asserções e o código de debug do QuickJS deixam de ser compilados no binário.

## Windows e macOS universal (0.1.4, 0.1.5)

- A **0.1.4** corrige os builds no Windows. O manifesto do Flutter agora declara a classe de plugin exportada via C API, então o código de registro gerado chama `QuickjsEnginePluginCApiRegisterWithRegistrar` em vez de um símbolo inexistente. Obrigado a [@dariyooo](https://github.com/dariyooo) por relatar o problema e contribuir com a correção no [#36](https://github.com/denisnadey/flutter_full_svg_support/pull/36).
- A **0.1.5** torna universal a ponte pré-compilada do macOS, com slices `arm64` e `x86_64`, e a compila com um deployment target explícito. Obrigado a [@OrPudding](https://github.com/OrPudding) pela correção no [#40](https://github.com/denisnadey/flutter_full_svg_support/pull/40).

## O CI que protege tudo isso

A maioria desses problemas só aparece em um build de release limpo, em uma toolchain específica, então é exatamente isso que o CI compila agora:

- um job de Android Gradle Plugin 9 que compila um app novo na versão estável mais recente do Flutter, com o Kotlin integrado ligado e desligado;
- um workflow de Swift Package Manager no Flutter 3.38.1, 3.41.6 e 3.47.4 que compila um app para o simulador de iOS, um archive de iOS e um app de release para macOS, verifica se todas as funções da ponte e todos os símbolos que o lado Dart procura estão exportados e executa o app de macOS;
- uma verificação dos símbolos exportados pelo pod de iOS no CocoaPods, além de workflows de build de release limpo para Windows e macOS.

## Como atualizar

```yaml
dependencies:
  quickjs_engine: ^0.1.6
```

Se você usa o full_svg_flutter, atualize para a 1.5.2, que exige quickjs_engine ^0.1.6. O resto do que mudou por lá está nas [notas de versão do full_svg_flutter 1.5](post:full-svg-flutter-1-5).

Changelog completo: [pub.dev/packages/quickjs_engine/changelog](https://pub.dev/packages/quickjs_engine/changelog)
