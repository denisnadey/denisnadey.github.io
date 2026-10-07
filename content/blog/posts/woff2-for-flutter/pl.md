---
title: Wypuściłem woff2 dla Fluttera
description: FontLoader Fluttera oczekuje TTF lub OTF. woff2 dekoduje pliki .woff i .woff2 do bajtów SFNT i rejestruje je przez standardowy pipeline fontów Fluttera.
---

Wypuściłem woff2 dla Fluttera, żeby rozwiązać częsty problem: obsługę fontów spoza formatów .ttf i .otf, które – zwłaszcza w kontekście webowym – często przychodzą jako .woff lub .woff2.

FontLoader Fluttera jest przeznaczony dla nieskompresowanych fontów SFNT, czyli bajtów TTF/OTF. Próba bezpośredniego załadowania pliku WOFF2 kończy się problemami. Żeby to rozwiązać, stworzyłem pakiet, który pozwala używać we Flutterze plików fontów .woff i .woff2: dekoduje je do bajtów SFNT i rejestruje przez standardowy pipeline fontów Fluttera.

Najważniejsze możliwości pakietu woff2:

- Dekodowanie WOFF1 i WOFF2
- Ładowanie fontów z assetów i z bajtów
- Wrapper na FontLoader Fluttera
- Parsowanie reguł CSS @font-face
- Obsługa fontów osadzonych jako data: URL
- Hurtowa rejestracja wielu grubości i stylów
- Bez natywnego kodu pluginu w aplikacji

Ten pakiet wyrósł z mojej pracy nad renderowaniem animowanych SVG, w których fonty często są osadzane przez CSS. Bez porządnej obsługi WOFF/WOFF2 renderowanie może wizualnie zawieść, mimo że SVG zostało sparsowane poprawnie.

Nie każda aplikacja Flutter będzie tego potrzebować, ale przydaje się to w aplikacjach, które korzystają z treści z zewnątrz: SVG, HTML, EPUB, podglądów dokumentów, eksportów z narzędzi projektowych, renderowania e-maili czy pipeline'ów tekstu formatowanego. Pakiet pozwala pozbyć się frustrującego kroku konwersji.

To wciąż wczesna wersja, ale trzon funkcjonalności jest już gotowy.

Pakiet znajdziesz tutaj: [pub.dev/packages/woff2](https://pub.dev/packages/woff2)

Chętnie poznam opinie programistów Flutter, którzy mają doświadczenie z własnymi fontami, renderowaniem SVG, renderowaniem dokumentów albo aplikacjami z rozbudowaną typografią.
