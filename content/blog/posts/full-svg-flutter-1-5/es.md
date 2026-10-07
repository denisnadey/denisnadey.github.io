---
title: "full_svg_flutter 1.5: un inspector de DevTools para SVG en vivo"
description: full_svg_flutter 1.5 trae un inspector de DevTools para SVG en vivo, corrige la geometría con porcentajes y bounding box, y refuerza las compilaciones nativas.
---

Desde la 1.4.2 han salido cinco versiones de full_svg_flutter: dos correcciones de plataforma, una nueva herramienta para desarrolladores, una gran tanda de correcciones de geometría y una versión con la que los SVG controlados por JavaScript funcionan en iOS. Esto es lo que ha cambiado y por qué importa.

## Inspector FullSVG para DevTools (1.5.0)

Cuando un SVG animado se ve bien en el navegador pero mal en la app, necesitas ver qué ha hecho realmente el renderizador. A partir de la 1.5.0, full_svg_flutter incluye una extensión oficial para Flutter DevTools. Se conecta a una app que se está ejecutando en modo debug e inspecciona los renderizadores reales: el mismo documento, la misma línea de tiempo de animación y el mismo painter que dibujan tu pantalla.

Lo que incluye:

- **Instancias en vivo.** Cada renderizador montado aparece por separado, incluso cuando el mismo asset está montado dos veces, con su origen, el estado de la animación y el número de nodos del DOM.
- **El DOM del SVG, con carga diferida.** Los nodos hijos solo se cargan al expandir una fila, así que los documentos grandes siguen respondiendo con fluidez. Al seleccionar un nodo se muestran su etiqueta, su id, sus clases, los valores en bruto y resueltos de sus atributos, qué atributos se están animando en ese momento y las animaciones SMIL y CSS dirigidas a él.
- **Control de reproducción.** Reproducir, pausar, reiniciar, hacer seek y cambiar la velocidad entre 0,25× y 2×. Los controles actúan sobre el reloj determinista del propio renderizador, en lugar de crear una segunda línea de tiempo.
- **Resaltado de nodos.** El nodo seleccionado se marca con un contorno en la app en ejecución a partir de su geometría de renderizado real, sin tocar los atributos del SVG.
- **Estadísticas honestas.** Nodos del DOM, número de animaciones, animaciones activas, primitivas de filtro, máscaras, degradados, trazados de recorte, presencia de JavaScript, tiempo actual y duración. El inspector no se inventa tiempos de parseo ni de pintado que el renderizador no mide.

Para abrirlo:

1. Ejecuta tu app en modo debug.
2. Abre Flutter DevTools desde tu IDE o desde la salida de `flutter run`.
3. Activa las extensiones de DevTools cuando se te pida.
4. Selecciona la extensión full_svg_flutter. El inspector se identifica como **FullSVG**.

No hay nada que configurar. El puente solo existe en modo debug: las compilaciones release no registran renderizadores, no conservan árboles DOM ni recopilan datos para el inspector. El seguimiento de instancias usa referencias débiles y sigue el ciclo de vida del widget, y la extensión se reconecta tras un hot restart.

Conviene conocer algunas limitaciones. El isolate principal tiene que estar en ejecución, no detenido en un punto de interrupción. El inspector indica si hay JavaScript, pero, de forma deliberada, no permite evaluar JavaScript arbitrario. El CSS computado, la procedencia en la cascada, la selección de instancias `<use>` individuales y los tiempos por fotograma quedan para más adelante.

La guía completa está en la [documentación del inspector](https://github.com/denisnadey/flutter_full_svg_support/blob/main/doc/en/devtools.md).

## Geometría que se comporta como en un navegador (1.5.1)

La 1.5.1 se centra en que la geometría sea correcta y se apoya en gran parte en pull requests de la comunidad.

- **Los porcentajes se resuelven respecto al viewport correcto.** Las formas básicas, la geometría de `<use>` y los viewports de sus instancias, los `<svg>` anidados, las coordenadas de texto, las regiones de máscara y el hit testing usan todos el viewport correcto, incluido el de un SVG raíz sin tamaño propio, cuyo viewport es el widget.
- **Las animaciones conservan sus unidades.** Las animaciones SMIL entre valores porcentuales y absolutos mantienen ambas unidades durante la interpolación, la composición aditiva y la temporización `calcMode="paced"`.
- **objectBoundingBox usa la caja correcta.** `clipPathUnits`, `maskUnits` y `maskContentUnits` usan los límites del objeto sin pintar, así que el trazo ya no agranda la caja, y los textos a los que se aplican aportan sus límites de layout en lugar de quedar recortados del todo.
- **Las regiones animadas de filtros y máscaras ya se aplican.** Los porcentajes animados en las regiones de `<filter>` y `<mask>` se vuelven a leer durante la animación, en lugar de parsearse una sola vez a partir del código fuente.
- **Temporización por instancia.** Las animaciones paced dentro de contenido `<symbol>` compartido se evalúan para el viewport de cada instancia de `<use>`.

Si tus gráficos dependen de longitudes en porcentaje, algo habitual en los SVG exportados y responsive, esta versión los acerca mucho más a lo que renderiza un navegador.

## Compilaciones nativas en todas las plataformas (1.4.3, 1.4.4, 1.5.2)

full_svg_flutter ejecuta los scripts inline y las exportaciones de SVGator a través de [quickjs_engine](page:docs#quickjs-engine), mi paquete de QuickJS-NG para Flutter. Tres versiones han servido para que esa capa nativa sea aburrida, sin sorpresas:

- **1.4.3, Windows.** Las compilaciones desde cero en Windows fallaban porque el código de registro de plugins que genera Flutter llamaba a un símbolo que no existía. Se corrigió con quickjs_engine 0.1.4.
- **1.4.4, macOS universal.** Las apps universales de macOS ahora incluyen un puente de QuickJS con las dos arquitecturas, Apple Silicon e Intel.
- **1.5.2, iOS, Swift Package Manager y Android Gradle Plugin 9.** Los SVG controlados por JavaScript ya se inicializan en iOS con CocoaPods. Las versiones anteriores del pod no exportaban ninguna función del puente, así que todos los SVG con un `<script>` fallaban con «Failed to lookup symbol 'jsNewRuntime'». Además, Flutter ya no recurre a CocoaPods por culpa de quickjs_engine, y las apps Android con AGP 9 compilan con el Kotlin integrado.

Los detalles de la parte nativa están en un artículo aparte: [quickjs_engine 0.1.6](post:quickjs-engine-0-1-6).

## Cómo actualizar

```yaml
dependencies:
  full_svg_flutter: ^1.5.2
```

O ejecuta `flutter pub upgrade full_svg_flutter`. El paquete necesita Flutter 3.32 o posterior, y el registro de cambios no recoge cambios incompatibles en la API entre la 1.4.2 y la 1.5.2.

## Gracias

Cuatro de estas cinco versiones incluyen contribuciones de la comunidad: reportes de errores, casos de reproducción y pull requests. Gracias, [@oierxjn](https://github.com/oierxjn), [@remtrik](https://github.com/remtrik), [@dariyooo](https://github.com/dariyooo), [@OrPudding](https://github.com/OrPudding), [@sufiyansayyed](https://github.com/sufiyansayyed) y [@DomingoMG](https://github.com/DomingoMG).

Si un SVG se renderiza de forma distinta que en un navegador, abre el inspector, revisa los atributos resueltos y [envíame el archivo](https://github.com/denisnadey/flutter_full_svg_support/issues). Sigue siendo la forma más rápida de mejorar el renderizador.

Registro de cambios completo: [pub.dev/packages/full_svg_flutter/changelog](https://pub.dev/packages/full_svg_flutter/changelog)
