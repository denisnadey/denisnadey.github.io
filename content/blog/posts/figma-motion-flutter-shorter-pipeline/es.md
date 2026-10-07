---
title: Figma Motion → Flutter acaba de convertirse en un pipeline mucho más corto.
description: Figma Motion exporta Animated SVG y full_svg_flutter lo renderiza en una app Flutter. El diseñador crea la animación y el desarrollador recibe un solo .svg.
---

Y creo que muchos equipos que trabajan con Flutter todavía no se han dado cuenta.

Figma Motion puede exportar Animated SVG.

full_svg_flutter puede renderizar ese Animated SVG directamente dentro de una aplicación Flutter.

- Sin conversión a Lottie.
- Sin WebView.
- Sin rehacer la animación en Flutter.
- Sin formatos de animación intermedios.

El flujo de trabajo puede ser, literalmente, este:

**Figma Motion → Exportar Animated SVG → Flutter**

El diseñador crea la animación.
El desarrollador recibe un solo archivo .svg.
Flutter renderiza la animación directamente.

Durante años, buscar «Figma Motion to Flutter», «Figma animation export Flutter», «animated SVG Flutter» o «Flutter SVG animation» solía acabar en otro paso de conversión más.

- Lottie.
- Rive.
- JSON.
- Un plugin.
- Un WebView.

O recrear la animación a mano.

Pero si el asset de origen ya es un Animated SVG, ¿qué sentido tiene convertirlo?

Justo para resolver ese problema creé full_svg_flutter.
Soporta SVG animado directamente en Flutter, incluidos SMIL, animaciones CSS, transformaciones, path morphing, máscaras, degradados, filtros, exportaciones de SVGator y control de reproducción.

Y ahora, con Figma Motion, este flujo de trabajo se vuelve mucho más interesante.

Diseñadores: bienvenidos a Flutter.

He escrito un análisis más a fondo sobre cómo funciona Figma Motion → Animated SVG → Flutter, por qué importa para el traspaso de diseño a desarrollo y hacia dónde podría evolucionar.

[Leer el artículo](post:figma-motion-to-flutter)

Y si usas Figma Motion, envíame tu exportación a Animated SVG más compleja.

De verdad quiero que intentes romper el renderizador.
