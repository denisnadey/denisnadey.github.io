---
title: He publicado woff2 para Flutter
description: El FontLoader de Flutter espera TTF u OTF. woff2 decodifica .woff y .woff2 a bytes SFNT y los registra mediante el pipeline de fuentes estándar de Flutter.
---

He publicado woff2 para Flutter con el objetivo de resolver un problema habitual: cómo manejar fuentes que no vienen en formato .ttf ni .otf, sino que a menudo llegan como .woff o .woff2, sobre todo en contextos web.

El FontLoader de Flutter está pensado para fuentes SFNT sin comprimir, es decir, bytes TTF/OTF. Si intentas cargar un archivo WOFF2 directamente, te encuentras con problemas. Para solucionarlo, he desarrollado un paquete que permite usar archivos de fuente .woff y .woff2 en Flutter: los decodifica a bytes SFNT y los registra mediante el pipeline de fuentes estándar de Flutter.

Las principales características del paquete woff2 son:

- Decodificación de WOFF1 y WOFF2
- Carga de fuentes desde assets y desde bytes
- Un wrapper del FontLoader de Flutter
- Parseo de reglas CSS @font-face
- Soporte para fuentes incrustadas como data: URL
- Registro por lotes de varios pesos y estilos
- Sin código de plugin nativo en tu app

El paquete surgió de mi trabajo en el renderizado de SVG animado, donde las fuentes suelen ir incrustadas mediante CSS. Sin un soporte adecuado para WOFF/WOFF2, el renderizado visual puede fallar aunque el SVG se haya parseado correctamente.

No todas las apps Flutter lo necesitarán, pero resulta útil en aplicaciones que consumen contenido externo, como SVG, HTML, EPUB, vistas previas de documentos, exportaciones de diseño, renderizado de correos electrónicos o pipelines de texto enriquecido. Este paquete puede eliminar un paso de conversión frustrante.

El paquete todavía está en fase inicial, pero la funcionalidad principal ya está consolidada.

Aquí tienes el paquete: [pub.dev/packages/woff2](https://pub.dev/packages/woff2)

Agradeceré cualquier comentario de desarrolladores Flutter con experiencia en fuentes personalizadas, renderizado de SVG, renderizado de documentos o aplicaciones en las que la tipografía tiene mucho peso.
