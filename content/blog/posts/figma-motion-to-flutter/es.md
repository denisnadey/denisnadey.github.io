---
title: Figma Motion → Flutter ya está aquí.
description: Figma Motion exporta Animated SVG y full_svg_flutter lo renderiza directamente en Flutter. Sin convertir a Lottie, sin WebView y sin formatos intermedios.
---

Sin conversión a Lottie. Sin WebView. Sin rehacer la animación a mano. Sin ningún formato de animación intermedio.

Figma Motion ya puede exportar **Animated SVG** directamente.

Y full_svg_flutter puede renderizar ese SVG animado **directamente dentro de Flutter**.

De modo que el traspaso diseñador → desarrollador por fin puede quedar así:

**Diseñador**

Figma → Motion → Animar → Exportar → **Animated SVG**

**Desarrollador Flutter**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

Listo.

Eso es todo.

Y creo que esto es mucho más importante de lo que parece.

Durante años, el flujo de trabajo habitual para las animaciones en móvil ha sido algo así:

```flow
Figma
After Effects / plugin / otra herramienta de animación
Lottie JSON
otro runtime
Flutter
```

O bien:

```flow
Figma Motion
exportar los datos de la animación
mapear a mano los nodos de Figma a widgets de Flutter
recrear partes de la escena en código
```

O, en el peor de los casos:

```flow
SVG animado
WebView 😐
```

Pero ahora es el propio Figma el que genera **Animated SVG**.

Entonces, ¿por qué convertir una animación vectorial perfectamente válida a otro formato solo para meterla en una app Flutter?

Con full_svg_flutter, el propio .svg es el asset que se usa en tiempo de ejecución.

Ya soporta:

- **SVG animado en Flutter**
- animaciones CSS @keyframes
- animaciones SMIL
- transformaciones animadas
- path morphing
- degradados y patrones
- máscaras y trazados de recorte
- filtros SVG
- texto
- animaciones SVG controladas por JavaScript
- exportaciones de SVGator
- reproducción / pausa / seek
- control de la velocidad de reproducción
- SVG estático y animado con el mismo renderizador
- sin conversión a Lottie
- sin WebView

Y el momento es especialmente interesante:

Ahora mismo, Figma Motion exporta **MP4, GIF, WebM y Animated SVG**.

Figma dice que la **exportación nativa a Lottie llegará más adelante**.

Pero en Flutter no tenemos por qué esperarla.

La exportación a Animated SVG ya puede ser el entregable.

---

## Diseñadores: bienvenidos a Flutter. 💙

Crea la animación donde ya creas la interfaz.

Exporta el Animated SVG.

Envía al desarrollador **un solo** archivo .svg.

Eso es todo.

Y tú, desarrollador Flutter:

si has estado buscando **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation** o **Lottie alternative for Flutter** –

este es exactamente el flujo de trabajo para el que llevo tiempo construyendo full_svg_flutter.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

Quiero llevar esto mucho más lejos.

Así que, si eres motion designer y usas **Figma Motion**, envíame el Animated SVG más retorcido que hayas exportado.

Máscaras complejas. Filtros. Morphing. Transformaciones raras. Líneas de tiempo largas.

**Intenta romperlo.**

Prefiero encontrar los casos límite del renderizador a que los descubras tú en producción.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

Puede que el traspaso de animaciones del diseño a Flutter se acabe de acortar, y mucho.
