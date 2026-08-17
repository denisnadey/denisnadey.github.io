import type { Locale } from "./types";

export type PackageSlug = "full-svg-flutter" | "woff2" | "quickjs-engine";

type PackageText = {
  tagline: string;
  problem: string;
  architecture: string;
  useCases: string[];
  limits: string[];
  apiDescriptions: string[];
};

type LocaleDocsText = {
  navLabel: string;
  title: string;
  intro: string;
  snapshot: string;
  labels: {
    problem: string;
    install: string;
    quickStart: string;
    capabilities: string;
    architecture: string;
    api: string;
    useWhen: string;
    limits: string;
    source: string;
    pub: string;
  };
  packages: Record<PackageSlug, PackageText>;
};

export type PackageDoc = PackageText & {
  slug: PackageSlug;
  name: string;
  version: string;
  license: string;
  pubPoints: string;
  install: string;
  quickStart: string;
  capabilities: string[];
  api: string[];
  sourceUrl: string;
  pubUrl: string;
};

export type DocsCopy = Omit<LocaleDocsText, "packages"> & {
  seo: { title: string; description: string };
  packages: PackageDoc[];
};

export const packageSlugs: PackageSlug[] = ["full-svg-flutter", "woff2", "quickjs-engine"];

const sourceUrl = "https://github.com/denisnadey/flutter_full_svg_support";
const meta: Record<PackageSlug, Omit<PackageDoc, keyof PackageText>> = {
  "full-svg-flutter": {
    slug: "full-svg-flutter",
    name: "full_svg_flutter",
    version: "1.4.2",
    license: "MIT",
    pubPoints: "140 / 160",
    install: "flutter pub add full_svg_flutter",
    quickStart: `import 'package:full_svg_flutter/full_svg_flutter.dart';

// Static or animated — the runtime detects the document.
FSvgPicture.asset(
  'assets/hero.svg',
  width: 240,
  semanticsLabel: 'Product illustration',
);

// Existing static flutter_svg usage can keep the familiar API.
SvgPicture.asset('assets/icon.svg');`,
    capabilities: ["Static SVG and DOM-preserving rendering", "SMIL and CSS @keyframes animation", "Path morphing and motion paths", "All 17 SVG filter primitives", "Masks, clipping, gradients, patterns, and rich text", "Inline JavaScript and SVGator exports", "Playback control and SVG <view> navigation", "flutter_svg-compatible static API"],
    api: ["FSvgPicture", "SvgPicture", "AnimatedSvgController", "renderSvgToPicture", "svg.cache"],
    sourceUrl,
    pubUrl: "https://pub.dev/packages/full_svg_flutter",
  },
  woff2: {
    slug: "woff2",
    name: "woff2",
    version: "0.1.0",
    license: "Apache-2.0",
    pubPoints: "150 / 160",
    install: "flutter pub add woff2",
    quickStart: `import 'package:flutter/material.dart';
import 'package:woff2/woff2.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await loadWoffFontFromAsset(
    fontFamily: 'Inter',
    assetPath: 'assets/fonts/Inter.woff2',
  );
  runApp(const MyApp());
}`,
    capabilities: ["WOFF1 and WOFF2 to SFNT decoding", "One-call Flutter FontLoader integration", "Pure-Dart font pipeline for app code", "CSS @font-face parsing", "Batch registration for weights and styles", "Embedded data: URL fonts", "Low-level byte decoder", "35 focused unit tests in the public package"],
    api: ["loadWoffFontFromAsset", "loadWoffFontFromBytes", "WoffFontRegistry", "extractFontFaceRules", "decodeFontIfWoff"],
    sourceUrl: `${sourceUrl}/tree/main/packages/woff2`,
    pubUrl: "https://pub.dev/packages/woff2",
  },
  "quickjs-engine": {
    slug: "quickjs-engine",
    name: "quickjs_engine",
    version: "0.1.3",
    license: "MIT",
    pubPoints: "120 / 160",
    install: "flutter pub add quickjs_engine",
    quickStart: `import 'package:quickjs_engine/quickjs_engine.dart';

final js = getJavascriptRuntime(xhr: false);
final result = js.evaluate('2 + 2');
print(result.stringResult); // 4

js.onMessage('bridge', (dynamic value) => 'pong');
js.evaluate('sendMessage("bridge", "ping")');
js.dispose();`,
    capabilities: ["QuickJS-NG 0.14.0 bundled with Flutter", "One engine across Android, iOS, macOS, Linux, and Windows", "Modern ES2020+ language features", "Dart ↔ JavaScript message bridge", "Optional fetch, XHR, and Promise helpers", "flutter_js-compatible entry points", "Native builds integrated with Flutter tooling", "16 KB Android ELF page alignment"],
    api: ["getJavascriptRuntime", "evaluate", "onMessage", "enableFetch", "enableHandlePromises"],
    sourceUrl: `${sourceUrl}/tree/main/packages/quickjs_engine`,
    pubUrl: "https://pub.dev/packages/quickjs_engine",
  },
};

const docsByLocale: Record<Locale, LocaleDocsText> = {
  en: {
    navLabel: "Docs",
    title: "Documentation for the runtimes behind real edge cases.",
    intro: "Three focused Flutter packages: a full SVG runtime, a WOFF/WOFF2 font pipeline, and one modern JavaScript engine across native platforms. Start with the problem, then copy the smallest working example.",
    snapshot: "Public package snapshot · 17 Aug 2026",
    labels: { problem: "Why it exists", install: "Install", quickStart: "Quick start", capabilities: "Coverage", architecture: "How it works", api: "API map", useWhen: "Use it when", limits: "Know before shipping", source: "Source & full README", pub: "Package on pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "Keep SVG as the source format inside Flutter.", problem: "Static icons are only a small part of SVG. Product assets may rely on SMIL, CSS animation, morphing, filters, text, or an inline JavaScript player. Converting them adds a second source of truth; a WebView adds a second rendering system.", architecture: "The package parses an SVG document into its own DOM-preserving model, evaluates style and animation state, then paints through Flutter. Static and animated content share the same engine. JavaScript starts lazily only when a script element is present.", useCases: ["You receive animated SVG or SVGator assets and cannot change the source format.", "You need filter, mask, text, or animation fidelity beyond static icon rendering.", "You want a familiar flutter_svg-style API and a migration path without a WebView."], limits: ["It is an SVG runtime, not a complete browser DOM; foreignObject and browser-dependent frameworks are outside scope.", "Validate complex filter and mixed-direction text assets visually before release."], apiDescriptions: ["Primary widget for static or animated assets from asset, network, string, file, or bytes.", "Static, flutter_svg-compatible entry point.", "Play, pause, seek, change rate or direction, and switch SVG views.", "Record an SVG into a Picture for custom painting or rasterization.", "Configurable decoded-source cache shared across widgets."] },
      woff2: { tagline: "Load web-font containers through Flutter's FontLoader.", problem: "Flutter accepts TTF/OTF through FontLoader but does not decode WOFF or WOFF2. Passing compressed web-font bytes directly can produce missing-glyph boxes without a useful error.", architecture: "The decoder reconstructs SFNT bytes from WOFF1/WOFF2, then registers the result with FontLoader. A CSS parser and registry cover SVG, HTML, EPUB, and other content pipelines that carry @font-face rules.", useCases: ["An SVG, EPUB, HTML export, or design asset embeds WOFF/WOFF2 fonts.", "You need to load a font downloaded at runtime or stored as a regular asset.", "You are building a renderer and need low-level WOFF bytes converted to SFNT."], limits: ["WOFF2 TTC collections are not supported in 0.1.0.", "Flutter Web already handles WOFF2 in the browser; the package targets native Flutter platforms."], apiDescriptions: ["Decode and register a bundled WOFF/WOFF2 asset in one call.", "Register font bytes fetched from network, disk, or memory.", "Batch-register families, weights, and styles.", "Extract @font-face rules, including data URLs and quoted values.", "Low-level container detection and conversion to SFNT bytes."] },
      "quickjs-engine": { tagline: "Run the same modern JavaScript engine on every Flutter platform.", problem: "A mixed JavaScriptCore/old-QuickJS setup can behave differently per platform, especially around numeric edge cases, Proxy, iteration, promises, or animation runtimes. That divergence is difficult to reproduce and harder to trust.", architecture: "The package bundles QuickJS-NG 0.14.0 and routes every supported native platform through the same engine and FFI bridge. Flutter's build pipeline compiles or bundles the native library; Dart owns evaluation, messaging, and optional web-style helpers.", useCases: ["A Flutter product needs embedded JavaScript evaluation with consistent cross-platform behavior.", "You are migrating from flutter_js and want its familiar entry points on a current engine.", "You need a small scripting layer, expression engine, validator, or SVG player without a WebView."], limits: ["Treat evaluated code as a deliberate trust boundary and expose only the host capabilities it needs.", "Desktop unit tests may require building or pointing to the native library outside the normal plugin pipeline."], apiDescriptions: ["Create the platform-consistent QuickJS runtime.", "Evaluate JavaScript and inspect the result.", "Expose named Dart callbacks to JavaScript.", "Opt into fetch/XHR behavior when the workload requires it.", "Bridge promise completion back into Dart." ] },
    },
  },
  ru: {
    navLabel: "Документация", title: "Документация runtime-пакетов для реальных edge cases.", intro: "Три сфокусированных Flutter-пакета: полный SVG runtime, WOFF/WOFF2 font pipeline и единый современный JavaScript engine для native-платформ. Сначала задача, затем минимальный рабочий пример.", snapshot: "Публичный снимок пакетов · 17 августа 2026", labels: { problem: "Зачем существует", install: "Установка", quickStart: "Быстрый старт", capabilities: "Покрытие", architecture: "Как устроено", api: "Карта API", useWhen: "Когда использовать", limits: "Перед продакшеном", source: "Исходники и полный README", pub: "Пакет на pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "Сохранить SVG исходным форматом внутри Flutter.", problem: "SVG — это не только статические иконки. Продуктовые ассеты используют SMIL, CSS animation, morphing, filters, text и inline JavaScript. Конвертация создаёт второй source of truth, а WebView — вторую систему рендеринга.", architecture: "Пакет разбирает документ в собственную DOM-preserving модель, вычисляет стили и состояние анимации и рисует через Flutter. Статический и анимированный контент используют один engine; JavaScript запускается лениво только при наличии script.", useCases: ["Вы получаете animated SVG или SVGator и не можете менять исходный формат.", "Нужна точность filters, masks, text или animation выше уровня статических иконок.", "Нужен знакомый flutter_svg-style API и миграция без WebView."], limits: ["Это SVG runtime, а не полный browser DOM; foreignObject и browser-dependent frameworks вне scope.", "Сложные filters и mixed-direction text стоит визуально проверить перед релизом."], apiDescriptions: ["Основной widget для asset, network, string, file и bytes.", "Статический flutter_svg-compatible entry point.", "Play, pause, seek, rate, direction и SVG views.", "Запись SVG в Picture для custom paint или rasterization.", "Настраиваемый cache декодированных исходников."] },
      woff2: { tagline: "Загружать web-font контейнеры через Flutter FontLoader.", problem: "Flutter FontLoader принимает TTF/OTF, но не декодирует WOFF/WOFF2. Прямой ввод сжатых байтов может дать пустые квадраты вместо глифов без полезной ошибки.", architecture: "Decoder восстанавливает SFNT из WOFF1/WOFF2 и регистрирует результат в FontLoader. CSS parser и registry покрывают SVG, HTML, EPUB и другие pipeline с @font-face.", useCases: ["SVG, EPUB, HTML export или design asset содержит WOFF/WOFF2.", "Нужно загрузить font из сети, файла или обычного asset.", "Вы строите renderer и нуждаетесь в низкоуровневом WOFF → SFNT."], limits: ["WOFF2 TTC collections не поддерживаются в 0.1.0.", "Flutter Web уже использует WOFF2 через браузер; пакет предназначен для native Flutter."], apiDescriptions: ["Decode и register bundled asset одним вызовом.", "Регистрация байтов из сети, диска или памяти.", "Batch registration для family, weight и style.", "Извлечение @font-face, включая data URLs.", "Низкоуровневое определение контейнера и SFNT conversion."] },
      "quickjs-engine": { tagline: "Один современный JavaScript engine на всех Flutter-платформах.", problem: "Смешение JavaScriptCore и старого QuickJS даёт различия между платформами в numeric edge cases, Proxy, iteration, promises и animation runtime. Такие дефекты сложно воспроизводить и опасно игнорировать.", architecture: "Пакет включает QuickJS-NG 0.14.0 и проводит все native-платформы через один engine и FFI bridge. Flutter build собирает или подключает native library; Dart управляет evaluation, messaging и optional helpers.", useCases: ["Flutter-продукту нужен embedded JavaScript с одинаковым поведением на платформах.", "Вы мигрируете с flutter_js и хотите знакомое API на современном engine.", "Нужен scripting layer, expression engine, validator или SVG player без WebView."], limits: ["Считайте evaluated code отдельной trust boundary и открывайте только нужные host capabilities.", "Desktop unit tests могут потребовать отдельной сборки native library."], apiDescriptions: ["Создание единого QuickJS runtime.", "Выполнение JavaScript и чтение результата.", "Именованные Dart callbacks для JavaScript.", "Опциональные fetch/XHR helpers.", "Связь Promise completion с Dart."] },
    },
  },
  de: {
    navLabel: "Docs", title: "Dokumentation für Runtimes hinter echten Edge Cases.", intro: "Drei fokussierte Flutter-Pakete: vollständiges SVG-Runtime, WOFF/WOFF2-Font-Pipeline und eine moderne JavaScript-Engine über native Plattformen.", snapshot: "Öffentlicher Paketstand · 17. Aug. 2026", labels: { problem: "Warum es existiert", install: "Installation", quickStart: "Schnellstart", capabilities: "Abdeckung", architecture: "Funktionsweise", api: "API-Übersicht", useWhen: "Einsetzen wenn", limits: "Vor dem Shipping", source: "Source & vollständiges README", pub: "Paket auf pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "SVG als Quellformat in Flutter behalten.", problem: "SVG kann SMIL, CSS-Animation, Morphing, Filter, Text oder JavaScript enthalten. Konvertierung schafft eine zweite Quelle; ein WebView eine zweite Rendering-Welt.", architecture: "Das Paket parst ein DOM-erhaltendes Modell, berechnet Style und Animation und zeichnet über Flutter. Statischer und animierter Inhalt teilen eine Engine; JavaScript startet nur bei script-Elementen.", useCases: ["Animierte SVG- oder SVGator-Assets müssen im Quellformat bleiben.", "Filter-, Masken-, Text- oder Animationstreue geht über statische Icons hinaus.", "flutter_svg-artiges API und Migration ohne WebView sind wichtig."], limits: ["Kein vollständiges Browser-DOM; foreignObject und browserabhängige Frameworks sind außerhalb des Scopes.", "Komplexe Filter und bidirektionalen Text vor Release visuell prüfen."], apiDescriptions: ["Widget für Asset, Netzwerk, String, Datei oder Bytes.", "Statischer flutter_svg-kompatibler Einstieg.", "Playback, Seek, Rate, Richtung und SVG-Views.", "SVG als Picture für Custom Painting.", "Konfigurierbarer Source-Cache."] },
      woff2: { tagline: "Webfont-Container über Flutters FontLoader laden.", problem: "FontLoader akzeptiert TTF/OTF, dekodiert aber WOFF/WOFF2 nicht. Komprimierte Bytes können lautlos leere Glyphen erzeugen.", architecture: "Der Decoder rekonstruiert SFNT und registriert es über FontLoader. CSS-Parser und Registry unterstützen @font-face in SVG, HTML oder EPUB.", useCases: ["Ein Asset enthält WOFF/WOFF2.", "Fonts kommen aus Netzwerk, Datei oder regulärem Asset.", "Eine Renderer-Pipeline braucht WOFF → SFNT."], limits: ["WOFF2-TTC-Collections sind in 0.1.0 nicht unterstützt.", "Für Flutter Web übernimmt der Browser WOFF2 bereits nativ."], apiDescriptions: ["Asset in einem Aufruf dekodieren und registrieren.", "Font-Bytes aus Netzwerk, Datei oder Speicher.", "Mehrere Weights und Styles registrieren.", "@font-face-Regeln extrahieren.", "Low-level Container- und SFNT-Konvertierung."] },
      "quickjs-engine": { tagline: "Dieselbe moderne JavaScript-Engine auf jeder Flutter-Plattform.", problem: "JavaScriptCore und altes QuickJS können bei Zahlen, Proxy, Iteration oder Promises unterschiedlich reagieren. Plattformdivergenz ist schwer reproduzierbar.", architecture: "QuickJS-NG 0.14.0 läuft über dieselbe FFI-Bridge auf allen nativen Plattformen. Flutter baut oder bündelt die Library; Dart steuert Evaluation, Messaging und optionale Helper.", useCases: ["Embedded JavaScript muss plattformübergreifend konsistent sein.", "Migration von flutter_js auf eine aktuelle Engine.", "Scripting, Expressions, Validatoren oder SVG-Player ohne WebView."], limits: ["Evaluierten Code als eigene Trust Boundary behandeln.", "Desktop-Unit-Tests können einen manuellen Library-Build brauchen."], apiDescriptions: ["QuickJS-Runtime erzeugen.", "JavaScript ausführen.", "Dart-Callbacks exponieren.", "Fetch/XHR aktivieren.", "Promises nach Dart überführen."] },
    },
  },
  fr: {
    navLabel: "Docs", title: "Documentation des runtimes conçus pour les vrais edge cases.", intro: "Trois packages Flutter ciblés : runtime SVG complet, pipeline WOFF/WOFF2 et même moteur JavaScript moderne sur les plateformes natives.", snapshot: "État public des packages · 17 août 2026", labels: { problem: "Pourquoi il existe", install: "Installation", quickStart: "Démarrage rapide", capabilities: "Couverture", architecture: "Fonctionnement", api: "Carte API", useWhen: "À utiliser quand", limits: "Avant la production", source: "Source et README complet", pub: "Package sur pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "Garder SVG comme format source dans Flutter.", problem: "Un SVG peut contenir SMIL, animation CSS, morphing, filtres, texte ou JavaScript. La conversion crée une seconde source de vérité ; le WebView, un second moteur de rendu.", architecture: "Le package parse un modèle préservant le DOM, calcule styles et animation puis peint via Flutter. Statique et animé partagent le même moteur ; JavaScript démarre seulement si nécessaire.", useCases: ["Des assets SVG animés ou SVGator doivent rester au format source.", "Filtres, masques, texte ou animation dépassent le rendu d'icônes statiques.", "Une API proche de flutter_svg et une migration sans WebView sont requises."], limits: ["Ce n'est pas un DOM navigateur complet ; foreignObject et frameworks dépendants du navigateur sont hors périmètre.", "Valider visuellement filtres complexes et texte bidirectionnel."], apiDescriptions: ["Widget principal pour asset, réseau, texte, fichier ou bytes.", "Entrée statique compatible flutter_svg.", "Lecture, pause, seek, vitesse, direction et views.", "Enregistrer vers Picture.", "Cache configurable des sources."] },
      woff2: { tagline: "Charger des web-fonts via FontLoader.", problem: "FontLoader accepte TTF/OTF mais ne décode pas WOFF/WOFF2. Des bytes compressés peuvent produire des glyphes vides sans erreur exploitable.", architecture: "Le décodeur reconstruit le SFNT et l'enregistre avec FontLoader. Parser CSS et registry couvrent @font-face dans SVG, HTML ou EPUB.", useCases: ["Un asset embarque WOFF/WOFF2.", "Une police vient du réseau, du disque ou d'un asset standard.", "Un renderer a besoin d'une conversion WOFF → SFNT."], limits: ["Les collections WOFF2 TTC ne sont pas supportées en 0.1.0.", "Sur Flutter Web, le navigateur gère déjà WOFF2."], apiDescriptions: ["Décoder et enregistrer un asset en un appel.", "Enregistrer des bytes externes.", "Gérer familles, weights et styles.", "Extraire @font-face.", "Conversion bas niveau vers SFNT."] },
      "quickjs-engine": { tagline: "Le même moteur JavaScript moderne sur chaque plateforme Flutter.", problem: "JavaScriptCore et un ancien QuickJS peuvent diverger sur nombres, Proxy, itération ou Promises. Ces écarts sont difficiles à reproduire.", architecture: "QuickJS-NG 0.14.0 passe par la même bridge FFI native. Flutter compile ou embarque la bibliothèque ; Dart pilote l'évaluation, les messages et helpers optionnels.", useCases: ["JavaScript embarqué doit être cohérent entre plateformes.", "Migration de flutter_js vers un moteur actuel.", "Scripting, expressions, validation ou player SVG sans WebView."], limits: ["Traiter le code évalué comme une frontière de confiance.", "Les tests desktop peuvent nécessiter un build manuel de la bibliothèque."], apiDescriptions: ["Créer le runtime QuickJS.", "Évaluer JavaScript.", "Exposer des callbacks Dart.", "Activer fetch/XHR.", "Relier les Promises à Dart."] },
    },
  },
  es: {
    navLabel: "Docs", title: "Documentación para runtimes detrás de edge cases reales.", intro: "Tres paquetes Flutter enfocados: runtime SVG completo, pipeline WOFF/WOFF2 y un motor JavaScript moderno en plataformas nativas.", snapshot: "Estado público · 17 ago 2026", labels: { problem: "Por qué existe", install: "Instalar", quickStart: "Inicio rápido", capabilities: "Cobertura", architecture: "Cómo funciona", api: "Mapa API", useWhen: "Úsalo cuando", limits: "Antes de producción", source: "Código y README completo", pub: "Paquete en pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "Mantén SVG como formato fuente dentro de Flutter.", problem: "SVG puede incluir SMIL, CSS, morphing, filtros, texto o JavaScript. Convertir crea otra fuente de verdad; WebView añade otro sistema de render.", architecture: "El paquete analiza un modelo que conserva el DOM, calcula estilos y animación y pinta con Flutter. Estático y animado comparten motor; JavaScript arranca solo si existe script.", useCases: ["Los assets animated SVG o SVGator deben conservar su formato.", "Necesitas fidelidad de filtros, máscaras, texto o animación.", "Quieres API estilo flutter_svg y migración sin WebView."], limits: ["No es un DOM completo de navegador; foreignObject queda fuera.", "Valida filtros complejos y texto bidireccional visualmente."], apiDescriptions: ["Widget para asset, red, string, archivo o bytes.", "Entrada estática compatible.", "Control de reproducción y views.", "Render a Picture.", "Caché configurable."] },
      woff2: { tagline: "Carga web-fonts con FontLoader.", problem: "FontLoader acepta TTF/OTF pero no decodifica WOFF/WOFF2; los bytes comprimidos pueden producir glifos vacíos.", architecture: "El decoder reconstruye SFNT y lo registra. Parser CSS y registry cubren @font-face en SVG, HTML y EPUB.", useCases: ["Un asset incluye WOFF/WOFF2.", "La fuente llega de red, disco o asset.", "Un renderer necesita WOFF → SFNT."], limits: ["WOFF2 TTC no está soportado en 0.1.0.", "Flutter Web ya usa WOFF2 mediante el navegador."], apiDescriptions: ["Decodificar y registrar asset.", "Registrar bytes externos.", "Batch de familias y estilos.", "Extraer @font-face.", "Conversión low-level a SFNT."] },
      "quickjs-engine": { tagline: "El mismo motor JavaScript moderno en cada plataforma Flutter.", problem: "JavaScriptCore y QuickJS antiguo pueden divergir en números, Proxy, iteración o Promises, creando bugs difíciles de reproducir.", architecture: "QuickJS-NG 0.14.0 usa el mismo bridge FFI. Flutter compila o incluye la librería; Dart controla evaluación, mensajes y helpers.", useCases: ["JavaScript embebido debe ser consistente entre plataformas.", "Migras desde flutter_js.", "Necesitas scripting, expresiones, validación o SVG sin WebView."], limits: ["Trata el código evaluado como frontera de confianza.", "Tests desktop pueden requerir build manual."], apiDescriptions: ["Crear runtime.", "Evaluar JavaScript.", "Exponer callbacks Dart.", "Activar fetch/XHR.", "Conectar Promises con Dart."] },
    },
  },
  it: {
    navLabel: "Docs", title: "Documentazione dei runtime per edge case reali.", intro: "Tre package Flutter mirati: runtime SVG completo, pipeline WOFF/WOFF2 e un motore JavaScript moderno su piattaforme native.", snapshot: "Snapshot pubblico · 17 ago 2026", labels: { problem: "Perché esiste", install: "Installa", quickStart: "Quick start", capabilities: "Copertura", architecture: "Come funziona", api: "Mappa API", useWhen: "Usalo quando", limits: "Prima della produzione", source: "Sorgente e README completo", pub: "Package su pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "Mantieni SVG come formato sorgente in Flutter.", problem: "SVG può includere SMIL, CSS, morphing, filtri, testo o JavaScript. La conversione crea una seconda fonte; WebView un secondo sistema di rendering.", architecture: "Il package crea un modello DOM-preserving, valuta stile e animazione e dipinge con Flutter. Statico e animato condividono il motore; JavaScript parte solo con script.", useCases: ["Asset SVG animati o SVGator devono restare sorgente.", "Servono filtri, maschere, testo o animazione fedeli.", "Vuoi API tipo flutter_svg e migrazione senza WebView."], limits: ["Non è un DOM browser completo; foreignObject è fuori scope.", "Verifica visivamente filtri complessi e testo bidi."], apiDescriptions: ["Widget per asset, rete, stringa, file o bytes.", "Entry point statico compatibile.", "Controllo playback e views.", "Render a Picture.", "Cache configurabile."] },
      woff2: { tagline: "Carica web-font tramite FontLoader.", problem: "FontLoader accetta TTF/OTF ma non decodifica WOFF/WOFF2; bytes compressi possono mostrare glifi vuoti.", architecture: "Il decoder ricostruisce SFNT e lo registra. Parser CSS e registry gestiscono @font-face in SVG, HTML ed EPUB.", useCases: ["Un asset include WOFF/WOFF2.", "Il font arriva da rete, disco o asset.", "Un renderer richiede WOFF → SFNT."], limits: ["WOFF2 TTC non supportato in 0.1.0.", "Flutter Web usa già WOFF2 via browser."], apiDescriptions: ["Decode e register in una chiamata.", "Registrare bytes esterni.", "Batch di family e style.", "Estrarre @font-face.", "Conversione low-level SFNT."] },
      "quickjs-engine": { tagline: "Lo stesso motore JavaScript moderno su ogni piattaforma Flutter.", problem: "JavaScriptCore e vecchio QuickJS possono divergere su numeri, Proxy, iteratori e Promise, creando bug difficili da riprodurre.", architecture: "QuickJS-NG 0.14.0 usa lo stesso bridge FFI. Flutter compila o include la libreria; Dart gestisce evaluation, messaging e helper.", useCases: ["JavaScript embedded deve essere coerente.", "Migrazione da flutter_js.", "Scripting, expression, validator o SVG senza WebView."], limits: ["Tratta il codice valutato come trust boundary.", "I test desktop possono richiedere build manuale."], apiDescriptions: ["Creare runtime.", "Valutare JavaScript.", "Esporre callback Dart.", "Attivare fetch/XHR.", "Collegare Promise a Dart."] },
    },
  },
  pl: {
    navLabel: "Docs", title: "Dokumentacja runtime'ów dla prawdziwych edge cases.", intro: "Trzy skupione pakiety Flutter: pełny runtime SVG, pipeline WOFF/WOFF2 i jeden nowoczesny silnik JavaScript na platformach natywnych.", snapshot: "Publiczny snapshot · 17 sie 2026", labels: { problem: "Dlaczego istnieje", install: "Instalacja", quickStart: "Quick start", capabilities: "Zakres", architecture: "Jak działa", api: "Mapa API", useWhen: "Użyj gdy", limits: "Przed produkcją", source: "Kod i pełne README", pub: "Pakiet na pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "Zachowaj SVG jako format źródłowy w Flutterze.", problem: "SVG może zawierać SMIL, CSS, morphing, filtry, tekst i JavaScript. Konwersja tworzy drugie źródło prawdy, WebView—drugi renderer.", architecture: "Pakiet parsuje model zachowujący DOM, oblicza style i animację, a następnie rysuje przez Flutter. Static i animated używają jednego silnika; JS uruchamia się tylko dla script.", useCases: ["Animated SVG lub SVGator musi pozostać w źródle.", "Potrzebujesz filtrów, masek, tekstu lub animacji.", "Chcesz API podobne do flutter_svg bez WebView."], limits: ["To nie pełny browser DOM; foreignObject jest poza zakresem.", "Złożone filtry i tekst bidi sprawdź wizualnie."], apiDescriptions: ["Widget dla asset, network, string, file i bytes.", "Kompatybilny static entry point.", "Playback i SVG views.", "Render do Picture.", "Konfigurowalny cache."] },
      woff2: { tagline: "Ładuj web-fonty przez FontLoader.", problem: "FontLoader przyjmuje TTF/OTF, ale nie dekoduje WOFF/WOFF2; skompresowane bytes mogą dać puste glify.", architecture: "Decoder rekonstruuje SFNT i rejestruje go. Parser CSS i registry obsługują @font-face w SVG, HTML i EPUB.", useCases: ["Asset osadza WOFF/WOFF2.", "Font przychodzi z sieci, dysku lub assetu.", "Renderer wymaga WOFF → SFNT."], limits: ["WOFF2 TTC nie jest wspierane w 0.1.0.", "Flutter Web używa WOFF2 natywnie przez browser."], apiDescriptions: ["Decode i register w jednym wywołaniu.", "Rejestracja zewnętrznych bytes.", "Batch family i style.", "Ekstrakcja @font-face.", "Low-level SFNT conversion."] },
      "quickjs-engine": { tagline: "Ten sam nowoczesny JavaScript engine na każdej platformie Flutter.", problem: "JavaScriptCore i stare QuickJS mogą różnić się w liczbach, Proxy, iteratorach i Promise, generując trudne do odtworzenia błędy.", architecture: "QuickJS-NG 0.14.0 używa tej samej FFI bridge. Flutter kompiluje lub bundluje library; Dart steruje evaluation, messaging i helperami.", useCases: ["Embedded JavaScript musi być spójny.", "Migrujesz z flutter_js.", "Potrzebujesz scripting, expressions, validatora lub SVG bez WebView."], limits: ["Traktuj eval code jako trust boundary.", "Desktop tests mogą wymagać manualnego buildu."], apiDescriptions: ["Tworzenie runtime.", "Wykonanie JavaScript.", "Dart callbacks.", "Fetch/XHR helpers.", "Promise bridge."] },
    },
  },
  pt: {
    navLabel: "Docs", title: "Documentação de runtimes para edge cases reais.", intro: "Três pacotes Flutter focados: runtime SVG completo, pipeline WOFF/WOFF2 e um motor JavaScript moderno nas plataformas nativas.", snapshot: "Snapshot público · 17 ago 2026", labels: { problem: "Por que existe", install: "Instalar", quickStart: "Quick start", capabilities: "Cobertura", architecture: "Como funciona", api: "Mapa da API", useWhen: "Use quando", limits: "Antes de produção", source: "Código e README completo", pub: "Pacote no pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "Mantenha SVG como formato fonte no Flutter.", problem: "SVG pode incluir SMIL, CSS, morphing, filtros, texto e JavaScript. Converter cria outra fonte de verdade; WebView adiciona outro renderer.", architecture: "O pacote analisa um modelo que preserva DOM, calcula estilo e animação e pinta com Flutter. Conteúdo estático e animado compartilha o motor; JS inicia só com script.", useCases: ["Animated SVG ou SVGator deve permanecer no formato original.", "Você precisa de filtros, máscaras, texto ou animação fiéis.", "Quer API estilo flutter_svg sem WebView."], limits: ["Não é um browser DOM completo; foreignObject está fora.", "Valide filtros complexos e texto bidi visualmente."], apiDescriptions: ["Widget para asset, rede, string, arquivo ou bytes.", "Entrada estática compatível.", "Playback e views.", "Render para Picture.", "Cache configurável."] },
      woff2: { tagline: "Carregue web-fonts pelo FontLoader.", problem: "FontLoader aceita TTF/OTF mas não decodifica WOFF/WOFF2; bytes comprimidos podem gerar glifos vazios.", architecture: "O decoder reconstrói SFNT e registra o resultado. Parser CSS e registry cobrem @font-face em SVG, HTML e EPUB.", useCases: ["Um asset inclui WOFF/WOFF2.", "A fonte vem de rede, disco ou asset.", "Um renderer precisa de WOFF → SFNT."], limits: ["WOFF2 TTC não é suportado em 0.1.0.", "Flutter Web já usa WOFF2 pelo browser."], apiDescriptions: ["Decode e register em uma chamada.", "Registrar bytes externos.", "Batch de family e style.", "Extrair @font-face.", "Conversão low-level SFNT."] },
      "quickjs-engine": { tagline: "O mesmo motor JavaScript moderno em cada plataforma Flutter.", problem: "JavaScriptCore e QuickJS antigo podem divergir em números, Proxy, iteração e Promises, criando bugs difíceis de reproduzir.", architecture: "QuickJS-NG 0.14.0 usa a mesma FFI bridge. Flutter compila ou inclui a library; Dart controla evaluation, messaging e helpers.", useCases: ["JavaScript embedded precisa ser consistente.", "Migração de flutter_js.", "Scripting, expressions, validator ou SVG sem WebView."], limits: ["Trate código avaliado como trust boundary.", "Testes desktop podem exigir build manual."], apiDescriptions: ["Criar runtime.", "Avaliar JavaScript.", "Expor callbacks Dart.", "Ativar fetch/XHR.", "Conectar Promises ao Dart."] },
    },
  },
  ka: {
    navLabel: "დოკუმენტაცია", title: "რეალური edge cases-ისთვის შექმნილი runtime-ების დოკუმენტაცია.", intro: "სამი მიზნობრივი Flutter package: სრული SVG runtime, WOFF/WOFF2 font pipeline და ერთი თანამედროვე JavaScript engine ყველა native platform-ზე. დაიწყეთ პრობლემით და შემდეგ დააკოპირეთ უმცირესი სამუშაო მაგალითი.", snapshot: "პაკეტების საჯარო მდგომარეობა · 17 აგვისტო 2026",
    labels: { problem: "რატომ არსებობს", install: "ინსტალაცია", quickStart: "სწრაფი დაწყება", capabilities: "შესაძლებლობები", architecture: "როგორ მუშაობს", api: "API რუკა", useWhen: "გამოიყენეთ, როცა", limits: "production-მდე გაითვალისწინეთ", source: "Source და სრული README", pub: "Package pub.dev-ზე" },
    packages: {
      "full-svg-flutter": { tagline: "შეინარჩუნეთ SVG როგორც source format Flutter-ში.", problem: "SVG მხოლოდ static icon არ არის. Product assets შეიძლება იყენებდეს SMIL, CSS animation, morphing, filters, text ან inline JavaScript player-ს. კონვერტაცია მეორე source of truth-ს ქმნის, WebView კი — მეორე rendering system-ს.", architecture: "Package SVG document-ს საკუთარ DOM-preserving model-ში ამუშავებს, style და animation state-ს ითვლის და Flutter-ით ხატავს. Static და animated content ერთ engine-ს იყენებს; JavaScript მხოლოდ script element-ის არსებობისას იწყება.", useCases: ["იღებთ animated SVG ან SVGator assets-ს და source format-ის შეცვლა არ შეგიძლიათ.", "გჭირდებათ filters, masks, text ან animation fidelity static icon rendering-ის ფარგლებს მიღმა.", "გსურთ flutter_svg-style API და მიგრაცია WebView-ს გარეშე."], limits: ["ეს SVG runtime-ია და არა სრული browser DOM; foreignObject და browser-dependent frameworks scope-ს გარეთაა.", "რთული filters და mixed-direction text release-მდე ვიზუალურად შეამოწმეთ."], apiDescriptions: ["მთავარი widget asset, network, string, file ან bytes წყაროსთვის.", "Static flutter_svg-compatible entry point.", "Play, pause, seek, rate, direction და SVG views.", "SVG-ის Picture-ში ჩაწერა custom painting-ისთვის.", "კონფიგურირებადი decoded-source cache."] },
      woff2: { tagline: "ჩატვირთეთ web-font containers Flutter FontLoader-ით.", problem: "Flutter FontLoader იღებს TTF/OTF-ს, მაგრამ WOFF/WOFF2-ს არ decode-ავს. Compressed web-font bytes-მა შეიძლება სასარგებლო error-ის გარეშე missing-glyph boxes გამოაჩინოს.", architecture: "Decoder WOFF1/WOFF2-დან SFNT bytes-ს აღადგენს და FontLoader-ში არეგისტრირებს. CSS parser და registry @font-face-ის მქონე SVG, HTML, EPUB და სხვა content pipelines-ს ფარავს.", useCases: ["SVG, EPUB, HTML export ან design asset WOFF/WOFF2 font-ს შეიცავს.", "Font network-იდან, disk-იდან ან ჩვეულებრივი asset-იდან runtime-ზე უნდა ჩაიტვირთოს.", "Renderer-ისთვის low-level WOFF → SFNT conversion გჭირდებათ."], limits: ["WOFF2 TTC collections 0.1.0-ში მხარდაჭერილი არ არის.", "Flutter Web-ში WOFF2-ს browser უკვე ამუშავებს; package native Flutter-ს ემსახურება."], apiDescriptions: ["Bundled asset-ის decode და register ერთი call-ით.", "Network, disk ან memory font bytes-ის რეგისტრაცია.", "Family, weight და style batch registration.", "@font-face rules-ის ამოღება data URLs-ის ჩათვლით.", "Low-level container detection და SFNT conversion."] },
      "quickjs-engine": { tagline: "იგივე თანამედროვე JavaScript engine ყველა Flutter platform-ზე.", problem: "JavaScriptCore და ძველი QuickJS სხვადასხვა platform-ზე განსხვავებულად შეიძლება მოიქცეს numeric edge cases, Proxy, iteration, promises ან animation runtimes-ში. ასეთი divergence რთულად აღსადგენია და არასანდოა.", architecture: "Package QuickJS-NG 0.14.0-ს შეიცავს და ყველა მხარდაჭერილ native platform-ს ერთ engine და FFI bridge-ზე ატარებს. Flutter build native library-ს აგებს ან აერთიანებს; Dart evaluation, messaging და optional helpers-ს მართავს.", useCases: ["Flutter product-ს embedded JavaScript-ის ერთნაირი cross-platform ქცევა სჭირდება.", "flutter_js-იდან გადადიხართ და თანამედროვე engine-ზე ნაცნობი entry points გსურთ.", "გჭირდებათ scripting layer, expression engine, validator ან SVG player WebView-ს გარეშე."], limits: ["Evaluated code ცალკე trust boundary-ად ჩათვალეთ და მხოლოდ საჭირო host capabilities გახსენით.", "Desktop unit tests-ს plugin pipeline-ის გარეთ native library build ან path შეიძლება დასჭირდეს."], apiDescriptions: ["Platform-consistent QuickJS runtime-ის შექმნა.", "JavaScript-ის evaluation და result inspection.", "Named Dart callbacks JavaScript-ისთვის.", "Optional fetch/XHR behavior.", "Promise completion-ის Dart-ში გადმოტანა."] },
    },
  },
  ar: {
    navLabel: "الوثائق", title: "وثائق runtimes صُممت لحالات الحافة الحقيقية.", intro: "ثلاث حزم Flutter مركزة: runtime كامل لـSVG، ومسار خطوط WOFF/WOFF2، ومحرك JavaScript حديث واحد عبر المنصات الأصلية. ابدأ بالمشكلة ثم انسخ أصغر مثال يعمل.", snapshot: "لقطة عامة للحزم · 17 أغسطس 2026",
    labels: { problem: "لماذا توجد", install: "التثبيت", quickStart: "بداية سريعة", capabilities: "التغطية", architecture: "كيف تعمل", api: "خريطة API", useWhen: "استخدمها عندما", limits: "اعرف قبل الإنتاج", source: "المصدر وREADME الكامل", pub: "الحزمة على pub.dev" },
    packages: {
      "full-svg-flutter": { tagline: "أبقِ SVG صيغة المصدر داخل Flutter.", problem: "SVG ليس مجرد أيقونات ثابتة. قد تعتمد أصول المنتج على SMIL أوCSS animation أوmorphing أوfilters أوtext أومشغل JavaScript مضمن. يضيف التحويل مصدراً ثانياً للحقيقة، ويضيف WebView نظام عرض ثانياً.", architecture: "تحلل الحزمة مستند SVG إلى نموذج يحافظ على DOM، وتحسب style وحالة الحركة، ثم ترسم عبر Flutter. يشترك المحتوى الثابت والمتحرك في engine واحد، ولا يبدأ JavaScript إلا عند وجود script element.", useCases: ["تستقبل animated SVG أوSVGator assets ولا يمكنك تغيير صيغة المصدر.", "تحتاج إلى دقة filters أوmasks أوtext أوanimation تتجاوز عرض الأيقونات الثابتة.", "تريد API مألوفة شبيهة بـflutter_svg ومسار ترحيل بلا WebView."], limits: ["إنه SVG runtime وليس browser DOM كاملاً؛ foreignObject والأطر المعتمدة على المتصفح خارج النطاق.", "تحقق بصرياً من filters المعقدة والنص mixed-direction قبل الإصدار."], apiDescriptions: ["الـwidget الرئيسي لمصادر asset وnetwork وstring وfile وbytes.", "Static entry point متوافق مع flutter_svg.", "Play وpause وseek والسرعة والاتجاه وSVG views.", "تسجيل SVG في Picture للرسم المخصص.", "Decoded-source cache قابل للضبط."] },
      woff2: { tagline: "حمّل حاويات web-font عبر Flutter FontLoader.", problem: "يقبل Flutter ملفات TTF/OTF عبر FontLoader لكنه لا يفك WOFF أوWOFF2. قد يؤدي تمرير bytes مضغوطة مباشرة إلى مربعات glyphs مفقودة من دون خطأ مفيد.", architecture: "يعيد decoder بناء SFNT bytes من WOFF1/WOFF2 ثم يسجل النتيجة مع FontLoader. يغطي CSS parser وregistry مسارات SVG وHTML وEPUB وغيرها التي تحمل قواعد @font-face.", useCases: ["يتضمن SVG أوEPUB أوHTML export أوdesign asset خطوط WOFF/WOFF2.", "تحتاج إلى تحميل خط من network أوdisk أوasset عادي وقت التشغيل.", "تبني renderer وتحتاج إلى تحويل WOFF bytes إلى SFNT على مستوى منخفض."], limits: ["مجموعات WOFF2 TTC غير مدعومة في 0.1.0.", "يتعامل المتصفح مع WOFF2 في Flutter Web؛ تستهدف الحزمة منصات Flutter الأصلية."], apiDescriptions: ["فك وتسجيل asset مضمّن بنداء واحد.", "تسجيل font bytes من network أوdisk أوmemory.", "تسجيل دفعات من families وweights وstyles.", "استخراج قواعد @font-face بما فيها data URLs.", "كشف container وتحويله إلى SFNT على مستوى منخفض."] },
      "quickjs-engine": { tagline: "شغّل محرك JavaScript الحديث نفسه على كل منصة Flutter.", problem: "قد يتصرف مزيج JavaScriptCore وQuickJS قديم بصورة مختلفة بين المنصات، خصوصاً في numeric edge cases وProxy وiteration وpromises وanimation runtimes. يصعب إعادة إنتاج هذا التباعد والثقة به.", architecture: "تضم الحزمة QuickJS-NG 0.14.0 وتوجه كل منصة أصلية مدعومة عبر engine وFFI bridge نفسيهما. يبني Flutter أويدمج native library، ويدير Dart التقييم والرسائل وweb-style helpers الاختيارية.", useCases: ["يحتاج منتج Flutter إلى embedded JavaScript بسلوك ثابت عبر المنصات.", "تنتقل من flutter_js وتريد entry points المألوفة على engine حديث.", "تحتاج إلى scripting layer أوexpression engine أوvalidator أومشغل SVG من دون WebView."], limits: ["تعامل مع evaluated code بوصفه trust boundary متعمداً ولا تعرض إلا host capabilities المطلوبة.", "قد تتطلب desktop unit tests بناء native library أوتحديد مساره خارج plugin pipeline العادي."], apiDescriptions: ["إنشاء QuickJS runtime موحد عبر المنصات.", "تقييم JavaScript وفحص النتيجة.", "إتاحة named Dart callbacks إلى JavaScript.", "تفعيل fetch/XHR اختيارياً.", "إعادة اكتمال Promise إلى Dart."] },
    },
  },
};

export function getDocsCopy(locale: Locale): DocsCopy {
  const text = docsByLocale[locale];
  return {
    ...text,
    seo: {
      title: `${text.navLabel} · full_svg_flutter, woff2 & quickjs_engine`,
      description: text.intro,
    },
    packages: packageSlugs.map((slug) => ({ ...meta[slug], ...text.packages[slug] })),
  };
}
