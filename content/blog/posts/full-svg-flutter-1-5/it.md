---
title: "full_svg_flutter 1.5: un inspector DevTools per gli SVG in esecuzione"
description: full_svg_flutter 1.5 aggiunge un inspector DevTools per gli SVG in esecuzione, corregge la geometria con percentuali e bounding box e rafforza le build native.
---

Dalla 1.4.2 a oggi sono uscite cinque release di full_svg_flutter: due fix per singole piattaforme, un nuovo strumento per sviluppatori, un ampio lavoro sulla correttezza della geometria e una release che fa funzionare su iOS gli SVG guidati da JavaScript. Ecco cosa è cambiato e perché è importante.

## L'inspector FullSVG per DevTools (1.5.0)

Quando un SVG animato appare corretto nel browser ma sbagliato nell'app, devi poter vedere che cosa ha fatto davvero il renderer. Dalla 1.5.0 full_svg_flutter include un'estensione ufficiale per Flutter DevTools. Si collega all'app in esecuzione in modalità debug e ispeziona i renderer veri e propri: lo stesso documento, la stessa timeline di animazione e lo stesso painter che disegnano la tua schermata.

Cosa ottieni:

- **Istanze live.** Ogni renderer montato è elencato separatamente, anche quando lo stesso asset è montato due volte, con sorgente, stato dell'animazione e numero di nodi DOM.
- **Il DOM SVG, caricato in modo lazy.** I nodi figli si caricano solo quando espandi una riga, così anche i documenti grandi restano reattivi. Selezionando un nodo vedi tag, id, classi, valori grezzi e risolti degli attributi, quali attributi sono animati in quel momento e le animazioni SMIL e CSS che lo hanno come target.
- **Controllo della riproduzione.** Play, pausa, riavvio, seek e velocità da 0,25× a 2×. I controlli pilotano il clock deterministico del renderer stesso, invece di creare una seconda timeline.
- **Evidenziazione dei nodi.** Il nodo selezionato compare contornato nell'app in esecuzione, in base alla sua reale geometria di rendering e senza toccare gli attributi dell'SVG.
- **Statistiche oneste.** Nodi DOM, numero di animazioni, animazioni attive, primitive di filtro, maschere, gradienti, clip path, presenza di JavaScript, tempo corrente e durata. L'inspector non inventa tempi di parsing o di painting che il renderer non misura.

Per aprirlo:

1. Avvia la tua app in modalità debug.
2. Apri Flutter DevTools dall'IDE o dall'output di `flutter run`.
3. Abilita le estensioni di DevTools quando ti viene chiesto.
4. Seleziona l'estensione full_svg_flutter. L'inspector compare con il nome **FullSVG**.

Non c'è nulla da configurare. Il bridge è attivo solo in debug: le build di release non registrano renderer, non conservano alberi DOM e non raccolgono dati per l'inspector. Il tracciamento delle istanze usa riferimenti deboli e segue il ciclo di vita dei widget, e l'estensione si ricollega dopo un hot restart.

Vale la pena conoscere alcuni limiti. L'isolate principale deve essere in esecuzione, non fermo su un breakpoint. La presenza di JavaScript viene segnalata, ma la valutazione di JavaScript arbitrario, per scelta, non è esposta. CSS calcolato, provenienza nella cascata, selezione di singole istanze `<use>` e tempi dei frame sono tra gli sviluppi futuri.

La guida completa è nella [documentazione dell'inspector](https://github.com/denisnadey/flutter_full_svg_support/blob/main/doc/en/devtools.md).

## Una geometria che si comporta come in un browser (1.5.1)

La 1.5.1 è una release dedicata alla correttezza, basata in gran parte su pull request della community.

- **Le percentuali si risolvono rispetto alla viewport giusta.** Forme di base, geometria di `<use>` e viewport delle istanze, `<svg>` annidati, coordinate del testo, regioni delle maschere e hit testing usano tutti la viewport corretta, compreso un SVG radice senza dimensioni proprie, la cui viewport è il widget.
- **Le animazioni mantengono le loro unità.** Le animazioni SMIL tra valori percentuali e assoluti conservano entrambe le unità nell'interpolazione, nella composizione additiva e nel timing `calcMode="paced"`.
- **objectBoundingBox usa il box giusto.** `clipPathUnits`, `maskUnits` e `maskContentUnits` usano i limiti puramente geometrici dell'oggetto, così il tratto non gonfia più il box, e i target di testo contribuiscono con i propri limiti di layout invece di venire tagliati via dal clipping.
- **Le regioni animate di filtri e maschere vengono applicate.** Le percentuali animate sulle regioni di `<filter>` e `<mask>` vengono rilette durante l'animazione, invece di essere lette una sola volta dalla sorgente.
- **Timing per singola istanza.** Le animazioni paced dentro contenuti `<symbol>` condivisi vengono valutate per la viewport di ogni istanza `<use>`.

Se la tua grafica si basa su lunghezze in percentuale, cosa frequente negli SVG esportati e responsive, questa release la avvicina molto a ciò che renderizza un browser.

## Build native su ogni piattaforma (1.4.3, 1.4.4, 1.5.2)

full_svg_flutter esegue gli script inline e gli export SVGator tramite [quickjs_engine](page:docs#quickjs-engine), il mio package QuickJS-NG per Flutter. Tre release sono servite a rendere quel livello nativo il più noioso possibile:

- **1.4.3, Windows.** Le build Windows da zero fallivano perché il registrant dei plugin generato da Flutter chiamava un simbolo inesistente. Risolto con quickjs_engine 0.1.4.
- **1.4.4, macOS universale.** Le app macOS universali ora includono un bridge QuickJS con le slice sia Apple Silicon sia Intel.
- **1.5.2, iOS, Swift Package Manager e Android Gradle Plugin 9.** Gli SVG guidati da JavaScript ora si inizializzano su iOS con CocoaPods. Le versioni precedenti del pod non esportavano nessuna funzione del bridge, quindi ogni SVG con uno `<script>` falliva con «Failed to lookup symbol 'jsNewRuntime'». Inoltre Flutter non ripiega più su CocoaPods a causa di quickjs_engine, e le app Android su AGP 9 si compilano con il Kotlin integrato.

I dettagli sulla parte nativa sono in un post a parte: [quickjs_engine 0.1.6](post:quickjs-engine-0-1-6).

## Aggiornamento

```yaml
dependencies:
  full_svg_flutter: ^1.5.2
```

Oppure esegui `flutter pub upgrade full_svg_flutter`. Il package richiede Flutter 3.32 o versioni successive, e il changelog non riporta breaking change dell'API tra la 1.4.2 e la 1.5.2.

## Grazie

Quattro di queste cinque release contengono contributi della community: segnalazioni di bug, casi di riproduzione e pull request. Grazie a [@oierxjn](https://github.com/oierxjn), [@remtrik](https://github.com/remtrik), [@dariyooo](https://github.com/dariyooo), [@OrPudding](https://github.com/OrPudding), [@sufiyansayyed](https://github.com/sufiyansayyed) e [@DomingoMG](https://github.com/DomingoMG).

Se un SVG viene renderizzato in modo diverso rispetto a un browser, apri l'inspector, controlla gli attributi risolti e [mandami il file](https://github.com/denisnadey/flutter_full_svg_support/issues). Resta il modo più rapido per migliorare il renderer.

Changelog completo: [pub.dev/packages/full_svg_flutter/changelog](https://pub.dev/packages/full_svg_flutter/changelog)
