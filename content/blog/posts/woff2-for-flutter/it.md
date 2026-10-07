---
title: Ho rilasciato woff2 per Flutter
description: Il FontLoader di Flutter si aspetta TTF o OTF. woff2 decodifica .woff e .woff2 in byte SFNT e li registra tramite la pipeline standard dei font di Flutter.
---

Ho rilasciato woff2 per Flutter per risolvere un problema frequente: gestire i font che non sono in formato .ttf o .otf e che spesso arrivano come .woff o .woff2, soprattutto in ambito web.

Il FontLoader di Flutter è pensato per font SFNT non compressi, cioè byte TTF/OTF. Caricare direttamente un file WOFF2 crea problemi. Per ovviare al problema ho sviluppato un package che permette di usare in Flutter i file di font .woff e .woff2, decodificandoli in byte SFNT e registrandoli tramite la pipeline standard dei font di Flutter.

Tra le funzionalità principali del package woff2:

- Decodifica di WOFF1 e WOFF2
- Caricamento dei font da asset e da byte
- Un wrapper per il FontLoader di Flutter
- Parsing delle regole CSS @font-face
- Supporto per i font incorporati come data: URL
- Registrazione in batch di più pesi e stili
- Nessun codice nativo di plugin necessario nella tua app

Il package è nato dal mio lavoro sul rendering degli SVG animati, dove i font sono spesso incorporati tramite CSS. Senza un supporto adeguato a WOFF/WOFF2, il rendering visivo può fallire anche quando il parsing dell'SVG è corretto.

Non tutte le app Flutter ne avranno bisogno, ma è utile per le applicazioni che gestiscono contenuti esterni come SVG, HTML, EPUB, anteprime di documenti, export di design, rendering di e-mail o pipeline di rich text. Questo package può eliminare un passaggio di conversione frustrante.

Il package è ancora in fase iniziale, ma le funzionalità di base sono già consolidate.

Trovi il package qui: [pub.dev/packages/woff2](https://pub.dev/packages/woff2)

Mi farebbe piacere ricevere feedback da sviluppatori Flutter esperti di font custom, rendering SVG, rendering di documenti o applicazioni in cui la tipografia ha un ruolo centrale.
