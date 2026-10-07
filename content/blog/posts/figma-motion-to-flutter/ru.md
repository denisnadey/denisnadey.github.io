---
title: Figma Motion → Flutter уже работает.
description: Figma Motion экспортирует Animated SVG, а full_svg_flutter рендерит его прямо во Flutter. Без конвертации в Lottie, без WebView, без промежуточных форматов.
---

Без конвертации в Lottie. Без WebView. Без ручной пересборки анимации. Вообще без промежуточного формата анимации.

Figma Motion теперь умеет экспортировать напрямую в **Animated SVG**.

А full_svg_flutter умеет рендерить этот анимированный SVG **прямо во Flutter**.

Так что передача «дизайнер → разработчик» наконец может выглядеть так:

**Дизайнер**

Figma → Motion → анимируем → экспортируем → **Animated SVG**

**Flutter-разработчик**

```dart
FSvgPicture.asset('assets/onboarding.svg');
```

Готово.

И всё.

И, по-моему, это гораздо важнее, чем кажется.

Годами стандартный путь анимации в мобильное приложение выглядел примерно так:

```flow
Figma
After Effects / плагин / другой инструмент для анимации
Lottie JSON
ещё один рантайм
Flutter
```

Или:

```flow
Figma Motion
экспортируем данные анимации
вручную сопоставляем ноды Figma с виджетами Flutter
пересобираем части сцены в коде
```

Или, в худшем случае:

```flow
анимированный SVG
WebView 😐
```

Но теперь **Animated SVG** выдаёт сама Figma.

Так зачем конвертировать вполне рабочую векторную анимацию в другой формат только ради того, чтобы положить её во Flutter-приложение?

С full_svg_flutter сам .svg и есть ассет, который приложение использует в рантайме.

Пакет уже поддерживает:

- **анимированный SVG во Flutter**
- CSS-анимации на @keyframes
- SMIL-анимации
- анимированные трансформации
- морфинг путей
- градиенты и паттерны
- маски и контуры обрезки
- SVG-фильтры
- текст
- SVG-анимации на JavaScript
- экспорты SVGator
- запуск / пауза / перемотка
- управление скоростью воспроизведения
- статический и анимированный SVG через один и тот же рендерер
- без конвертации в Lottie
- без WebView

И тайминг тут особенно интересный:

Сейчас Figma Motion экспортирует в **MP4, GIF, WebM и Animated SVG**.

По словам Figma, нативный **экспорт в Lottie появится только позже**.

Но для Flutter ждать его не обязательно.

Экспорт в Animated SVG уже сейчас можно отдавать в разработку.

---

## Дизайнеры, добро пожаловать во Flutter. 💙

Делайте анимацию там же, где уже делаете интерфейс.

Экспортируйте Animated SVG.

Отправьте разработчику **один** файл .svg.

И всё.

А теперь — Flutter-разработчикам:

если вы гуглили **Figma Motion to Flutter**, **Figma animation export for Flutter**, **animated SVG in Flutter**, **Flutter SVG animation** или **Lottie alternative for Flutter** —

это ровно тот процесс, ради которого я делаю full_svg_flutter.

```bash
flutter pub add full_svg_flutter
```

```dart
import 'package:full_svg_flutter/full_svg_flutter.dart';

FSvgPicture.asset(
  'assets/figma_motion_animation.svg',
);
```

Хочу пойти с этим гораздо дальше.

Так что если вы моушн-дизайнер и работаете в **Figma Motion**, пришлите мне свой самый адский экспорт в Animated SVG.

Сложные маски. Фильтры. Морфинг. Странные трансформации. Длинные таймлайны.

**Попробуйте сломать рендерер.**

Лучше я сам найду пограничные случаи, чем вы наткнётесь на них в продакшене.

**full_svg_flutter**

- GitHub: [github.com/denisnadey/flutter_full_svg_support](https://github.com/denisnadey/flutter_full_svg_support)
- pub.dev: [pub.dev/packages/full_svg_flutter](https://pub.dev/packages/full_svg_flutter)

**Figma Motion → Animated SVG → Flutter.**

Возможно, путь анимации из дизайна во Flutter только что стал намного короче.
