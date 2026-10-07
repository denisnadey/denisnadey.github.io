---
title: Figma Motion → Flutter is already here.
description: Figma Motion exports Animated SVG, and full_svg_flutter renders it directly in Flutter. No Lottie conversion, no WebView, no intermediate format.
---

No Lottie conversion. No WebView. No rebuilding the animation by hand. No intermediate animation format at all.

Figma Motion can now export **Animated SVG** directly.

And full_svg_flutter can render that animated SVG **directly inside Flutter**.

So the designer → developer handoff can finally look like this:

**Designer**

Figma → Motion → Animate → Export → **Animated SVG**

**Flutter developer**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

Done.

That’s it.

And I think this is a much bigger deal than it looks.

For years, the standard mobile animation workflow has been something like:

```flow
Figma
After Effects / plugin / another animation tool
Lottie JSON
another runtime
Flutter
```

Or:

```flow
Figma Motion
export animation data
manually map Figma nodes to Flutter widgets
recreate parts of the scene in code
```

Or, in the worst case:

```flow
animated SVG
WebView 😐
```

But now Figma itself produces **Animated SVG**.

So why convert a perfectly good vector animation into another format just to put it into a Flutter app?

With full_svg_flutter, the .svg itself is the runtime asset.

It already supports:

- **Animated SVG in Flutter**
- CSS @keyframes animations
- SMIL animations
- animated transforms
- path morphing
- gradients and patterns
- masks and clip paths
- SVG filters
- text
- JavaScript-driven SVG animations
- SVGator exports
- play / pause / seek
- playback speed control
- static and animated SVG through the same renderer
- no Lottie conversion
- no WebView

And this timing is particularly interesting:

Figma Motion currently exports **MP4, GIF, WebM and Animated SVG**.

Figma says native **Lottie export is still coming later**.

But for Flutter, we don’t necessarily need to wait for it.

The Animated SVG export can already be the deliverable.

---

## Designers: welcome to Flutter. 💙

Create the animation where you already create the interface.

Export the Animated SVG.

Send the developer **one** .svg file.

That’s it.

And Flutter developers:

if you’ve been searching for **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation**, or a **Lottie alternative for Flutter** —

this is exactly the workflow I’ve been building full_svg_flutter for.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

I want to push this much further.

So if you’re a motion designer using **Figma Motion**, send me your nastiest Animated SVG export.

Complex masks. Filters. Morphing. Weird transforms. Long timelines.

**Try to break it.**

I’d rather find the edge cases in the renderer than have you discover them in production.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

Maybe the design-to-Flutter animation handoff just got a lot shorter.
