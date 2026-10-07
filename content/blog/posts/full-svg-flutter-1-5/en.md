---
title: "full_svg_flutter 1.5: a DevTools inspector for live SVG"
description: full_svg_flutter 1.5 adds a Flutter DevTools inspector for live SVG renderers, fixes percentage and bounding-box geometry, and hardens native builds.
---

full_svg_flutter has had five releases since 1.4.2: two platform fixes, a new developer tool, a large geometry correctness pass, and a release that makes JavaScript-driven SVGs work on iOS. Here is what changed and why it matters.

## FullSVG DevTools Inspector (1.5.0)

When an animated SVG looks right in a browser but wrong in the app, you need to see what the renderer actually did. Starting with 1.5.0, full_svg_flutter ships an official Flutter DevTools extension. It connects to a running debug app and inspects the real renderers: the same document, animation timeline, and painter that draw your screen.

What you get:

- **Live instances.** Every mounted renderer is listed separately, even when the same asset is mounted twice, with its source, animation state, and DOM node count.
- **The SVG DOM, loaded lazily.** Child nodes load only when you expand a row, so large documents stay responsive. Selecting a node shows its tag, id, classes, raw and resolved attribute values, which attributes are animated right now, and the SMIL and CSS animations that target it.
- **Playback control.** Play, pause, restart, seek, and rates from 0.25× to 2×. The controls drive the renderer’s own deterministic clock instead of creating a second timeline.
- **Node highlighting.** The selected node is outlined in the running app using its real render geometry, without touching the SVG’s attributes.
- **Honest statistics.** DOM nodes, animation counts, active animations, filter primitives, masks, gradients, clip paths, JavaScript presence, current time, and duration. The inspector does not invent parse or paint timings that the renderer does not measure.

To open it:

1. Run your app in debug mode.
2. Open Flutter DevTools from your IDE or from the `flutter run` output.
3. Enable DevTools extensions when prompted.
4. Select the full_svg_flutter extension. The inspector identifies itself as **FullSVG**.

There is nothing to configure. The bridge is debug-only: release builds do not register renderers, retain DOM trees, or collect inspector data. Instance tracking uses weak references and follows the widget lifecycle, and the extension reconnects after a hot restart.

A few limits are worth knowing. The main isolate has to be running, not paused at a breakpoint. JavaScript presence is reported, but arbitrary JavaScript evaluation is deliberately not exposed. Computed CSS, cascade provenance, picking individual `<use>` instances, and frame timings are future work.

The full guide is in the [Inspector documentation](https://github.com/denisnadey/flutter_full_svg_support/blob/main/doc/en/devtools.md).

## Geometry that behaves like a browser (1.5.1)

1.5.1 is a correctness release, built largely on community pull requests.

- **Percentages resolve against the right viewport.** Basic shapes, `<use>` geometry and instance viewports, nested `<svg>`, text coordinates, mask regions, and hit testing all use the correct viewport, including a root SVG without its own size, whose viewport is the widget.
- **Animations keep their units.** SMIL animations between percentage and absolute values keep both units through interpolation, additive composition, and `calcMode="paced"` timing.
- **objectBoundingBox uses the right box.** `clipPathUnits`, `maskUnits`, and `maskContentUnits` use the unpainted object bounds, so a stroke no longer inflates the box, and text targets contribute their layout bounds instead of being clipped out.
- **Animated filter and mask regions take effect.** Animated percentages on `<filter>` and `<mask>` regions are re-read during the animation instead of being parsed once from the source.
- **Per-instance timing.** Paced animations inside shared `<symbol>` content are evaluated for each `<use>` instance viewport.

If your artwork relies on percentage lengths, which is common in exported and responsive SVG, this release brings it much closer to what a browser renders.

## Native builds on every platform (1.4.3, 1.4.4, 1.5.2)

full_svg_flutter runs inline scripts and SVGator exports through [quickjs_engine](page:docs#quickjs-engine), my QuickJS-NG package for Flutter. Three releases were about making that native layer boring:

- **1.4.3, Windows.** Fresh Windows builds failed because Flutter’s generated plugin registrant called a symbol that did not exist. Fixed through quickjs_engine 0.1.4.
- **1.4.4, universal macOS.** Universal macOS apps now ship a QuickJS bridge with both Apple Silicon and Intel slices.
- **1.5.2, iOS, Swift Package Manager, and Android Gradle Plugin 9.** JavaScript-driven SVGs now initialize on iOS with CocoaPods. Earlier versions of the pod exported none of the bridge functions, so every SVG with a `<script>` failed with “Failed to lookup symbol 'jsNewRuntime'”. Flutter also no longer falls back to CocoaPods because of quickjs_engine, and Android apps on AGP 9 build with built-in Kotlin.

The native details are in a separate post: [quickjs_engine 0.1.6](post:quickjs-engine-0-1-6).

## Upgrade

```yaml
dependencies:
  full_svg_flutter: ^1.5.2
```

Or run `flutter pub upgrade full_svg_flutter`. The package needs Flutter 3.32 or newer, and the changelog lists no breaking API changes between 1.4.2 and 1.5.2.

## Thank you

Four of these five releases include contributions from the community: bug reports, reproductions, and pull requests. Thank you, [@oierxjn](https://github.com/oierxjn), [@remtrik](https://github.com/remtrik), [@dariyooo](https://github.com/dariyooo), [@OrPudding](https://github.com/OrPudding), [@sufiyansayyed](https://github.com/sufiyansayyed), and [@DomingoMG](https://github.com/DomingoMG).

If an SVG renders differently from a browser, open the inspector, check the resolved attributes, and [send me the file](https://github.com/denisnadey/flutter_full_svg_support/issues). That is still the fastest way to make the renderer better.

Full changelog: [pub.dev/packages/full_svg_flutter/changelog](https://pub.dev/packages/full_svg_flutter/changelog)
