---
title: I have shipped woff2 for Flutter
description: Flutter’s FontLoader expects TTF or OTF. woff2 decodes .woff and .woff2 into SFNT bytes and registers them through Flutter’s standard font pipeline.
---

I have shipped woff2 for Flutter to address a common challenge: handling fonts that are not in .ttf or .otf formats, which are often delivered as .woff or .woff2, especially in web contexts.

Flutter’s FontLoader is designed for uncompressed SFNT fonts, meaning TTF/OTF bytes. Attempting to load a WOFF2 file directly results in issues. To tackle this, I developed a package that allows the use of .woff and .woff2 font files in Flutter by decoding them into SFNT bytes and registering them through Flutter’s standard font pipeline.

Key features of the woff2 package include:

- WOFF1 and WOFF2 decoding
- Asset and byte-based font loading
- A Flutter FontLoader wrapper
- CSS @font-face parsing
- Support for embedded data: URL fonts
- Batch registration for multiple weights and styles
- No native plugin code required in your app

This package emerged from my work on animated SVG rendering, where fonts are often embedded via CSS. Without proper WOFF/WOFF2 support, visual rendering can fail despite correct SVG parsing.

While not every Flutter app will need this, it is beneficial for applications that consume external content such as SVG, HTML, EPUB, document previews, design exports, email rendering, or rich text pipelines. This package can eliminate a frustrating conversion step.

The package is still in early release, but the core functionality is established.

Explore the package here: [pub.dev/packages/woff2](https://pub.dev/packages/woff2)

I welcome feedback from Flutter developers experienced with custom fonts, SVG rendering, document rendering, or typography-heavy applications.
