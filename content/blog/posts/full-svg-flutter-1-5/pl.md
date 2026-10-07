---
title: "full_svg_flutter 1.5: inspektor DevTools do podglądu SVG na żywo"
description: full_svg_flutter 1.5 dodaje inspektor Flutter DevTools dla działających rendererów SVG, poprawia geometrię procentów i bounding boxów oraz natywne buildy.
---

Od wersji 1.4.2 full_svg_flutter doczekał się pięciu wydań: dwóch poprawek platformowych, nowego narzędzia dla programistów, dużej rundy poprawek geometrii i wydania, dzięki któremu SVG sterowane JavaScriptem działają na iOS. Oto, co się zmieniło i dlaczego to ważne.

## Inspektor FullSVG dla DevTools (1.5.0)

Kiedy animowane SVG wygląda dobrze w przeglądarce, a źle w aplikacji, trzeba zobaczyć, co faktycznie zrobił renderer. Od wersji 1.5.0 full_svg_flutter zawiera oficjalne rozszerzenie Flutter DevTools. Łączy się ono z działającą aplikacją w trybie debug i podgląda prawdziwe renderery: ten sam dokument, tę samą oś czasu animacji i ten sam painter, które rysują ekran.

Co dostajesz:

- **Instancje na żywo.** Każdy zamontowany renderer ma osobną pozycję na liście – nawet gdy ten sam asset jest zamontowany dwa razy – razem ze źródłem, stanem animacji i liczbą węzłów DOM.
- **DOM SVG ładowany leniwie.** Węzły potomne ładują się dopiero po rozwinięciu wiersza, więc nawet duże dokumenty działają płynnie. Po wybraniu węzła widać jego tag, id, klasy, surowe i przeliczone wartości atrybutów, atrybuty animowane w danej chwili oraz animacje SMIL i CSS, które na niego działają.
- **Kontrola odtwarzania.** Odtwarzanie, pauza, restart, seek i tempo od 0,25× do 2×. Kontrolki sterują własnym, deterministycznym zegarem renderera, zamiast tworzyć drugą oś czasu.
- **Podświetlanie węzłów.** Wybrany węzeł jest obrysowywany w działającej aplikacji na podstawie jego rzeczywistej geometrii renderowania, bez ruszania atrybutów SVG.
- **Uczciwe statystyki.** Węzły DOM, liczba animacji, aktywne animacje, prymitywy filtrów, maski, gradienty, ścieżki przycinania, obecność JavaScriptu, bieżący czas i czas trwania. Inspektor nie zmyśla czasów parsowania ani rysowania, których renderer nie mierzy.

Jak go otworzyć:

1. Uruchom aplikację w trybie debug.
2. Otwórz Flutter DevTools z IDE albo z tego, co wypisuje `flutter run`.
3. Gdy pojawi się prośba, włącz rozszerzenia DevTools.
4. Wybierz rozszerzenie full_svg_flutter. Inspektor przedstawia się jako **FullSVG**.

Niczego nie trzeba konfigurować. Most działa wyłącznie w trybie debug: buildy release nie rejestrują rendererów, nie przechowują drzew DOM i nie zbierają danych dla inspektora. Śledzenie instancji opiera się na słabych referencjach i podąża za cyklem życia widgetu, a po hot restarcie rozszerzenie łączy się ponownie.

Warto znać kilka ograniczeń. Główny izolat musi działać, a nie stać na breakpoincie. Inspektor raportuje obecność JavaScriptu, ale celowo nie pozwala wykonywać dowolnego kodu JavaScript. Obliczone style CSS, pochodzenie wartości w kaskadzie, wybieranie pojedynczych instancji `<use>` i czasy klatek to plany na przyszłość.

Pełny przewodnik znajdziesz w [dokumentacji inspektora](https://github.com/denisnadey/flutter_full_svg_support/blob/main/doc/en/devtools.md).

## Geometria, która zachowuje się jak w przeglądarce (1.5.1)

1.5.1 to wydanie poświęcone poprawności, w dużej mierze zbudowane na pull requestach od społeczności.

- **Wartości procentowe są liczone względem właściwego viewportu.** Podstawowe kształty, geometria `<use>` i viewporty instancji, zagnieżdżone `<svg>`, współrzędne tekstu, regiony masek i hit testing korzystają z poprawnego viewportu – także w przypadku głównego elementu SVG bez własnego rozmiaru, którego viewportem jest widget.
- **Animacje zachowują jednostki.** Animacje SMIL między wartościami procentowymi a bezwzględnymi zachowują obie jednostki przy interpolacji, składaniu addytywnym i timingu `calcMode="paced"`.
- **objectBoundingBox korzysta z właściwego prostokąta.** `clipPathUnits`, `maskUnits` i `maskContentUnits` używają granic samej geometrii obiektu, więc obrys nie powiększa już prostokąta, a elementy tekstowe wnoszą swoje granice z layoutu, zamiast być wycinane.
- **Animowane regiony filtrów i masek są uwzględniane.** Animowane wartości procentowe w regionach `<filter>` i `<mask>` są odczytywane na bieżąco w trakcie animacji, a nie parsowane raz ze źródła.
- **Timing dla każdej instancji.** Animacje z timingiem paced we współdzielonej zawartości `<symbol>` są wyliczane dla viewportu każdej instancji `<use>`.

Jeśli grafika opiera się na długościach procentowych – a to częste w eksportowanych i responsywnych SVG – to wydanie znacznie zbliża wynik do tego, co renderuje przeglądarka.

## Natywne buildy na każdej platformie (1.4.3, 1.4.4, 1.5.2)

full_svg_flutter uruchamia skrypty inline i eksporty SVGator przez [quickjs_engine](page:docs#quickjs-engine), mój pakiet z QuickJS-NG dla Fluttera. Trzy wydania służyły temu, żeby ta natywna warstwa stała się nudna:

- **1.4.3, Windows.** Buildy od zera na Windowsie kończyły się błędem, bo wygenerowany przez Fluttera kod rejestrujący pluginy wywoływał symbol, który nie istniał. Naprawione dzięki quickjs_engine 0.1.4.
- **1.4.4, uniwersalny macOS.** Uniwersalne aplikacje na macOS dostają teraz most QuickJS w wersji dla obu architektur: Apple Silicon i Intel.
- **1.5.2, iOS, Swift Package Manager i Android Gradle Plugin 9.** SVG sterowane JavaScriptem inicjalizują się teraz na iOS z CocoaPods. Wcześniejsze wersje poda nie eksportowały żadnej funkcji mostu, więc każde SVG z `<script>` kończyło się błędem „Failed to lookup symbol 'jsNewRuntime'”. Flutter nie wraca już też do CocoaPods z powodu quickjs_engine, a aplikacje na Androida z AGP 9 budują się z wbudowanym Kotlinem.

Szczegóły warstwy natywnej są w osobnym wpisie: [quickjs_engine 0.1.6](post:quickjs-engine-0-1-6).

## Aktualizacja

```yaml
dependencies:
  full_svg_flutter: ^1.5.2
```

Albo uruchom `flutter pub upgrade full_svg_flutter`. Pakiet wymaga Fluttera 3.32 lub nowszego, a changelog nie wymienia między 1.4.2 a 1.5.2 żadnych zmian łamiących kompatybilność API.

## Podziękowania

Cztery z tych pięciu wydań zawierają wkład społeczności: zgłoszenia błędów, przykłady do ich odtworzenia i pull requesty. Dziękuję [@oierxjn](https://github.com/oierxjn), [@remtrik](https://github.com/remtrik), [@dariyooo](https://github.com/dariyooo), [@OrPudding](https://github.com/OrPudding), [@sufiyansayyed](https://github.com/sufiyansayyed) i [@DomingoMG](https://github.com/DomingoMG).

Jeśli jakieś SVG renderuje się inaczej niż w przeglądarce, otwórz inspektor, sprawdź przeliczone wartości atrybutów i [przyślij mi plik](https://github.com/denisnadey/flutter_full_svg_support/issues). To wciąż najszybszy sposób, żeby ulepszyć renderer.

Pełny changelog: [pub.dev/packages/full_svg_flutter/changelog](https://pub.dev/packages/full_svg_flutter/changelog)
