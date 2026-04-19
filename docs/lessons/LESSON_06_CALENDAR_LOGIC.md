# LESSON_06_CALENDAR_LOGIC.md: El Almanaque del Estudiante 🗓️

## ¿Qué se hizo?
Se ha reconstruido la lógica de retención (retention loop) de la app, pasando de un sistema de puntos genéricos a un historial de cumplimiento real.

1. **Racha por Cumplimiento**: La racha ahora se define como "Haber completado al menos una lección/misión hoy". 
2. **Calendario Dual (Semanal/Mensual)**: 
   - Se implementó una **Weekly View** (7 días) para feedback rápido.
   - Se desarrolló un **Calendario Mensual Expandible** que permite al usuario navegar mediante un sistema de fechas dinámico (`new Date()`).
3. **Iconografía Figurativa v3**: Evolución de los iconos geométricos hacia formas reconocibles (Casita, Brújula con aguja roja, Baúl con cerradura) usando exclusivamente `View`.
4. **Navegación de Meses**: Se implementó una lógica de cambio de mes (`setMonth`) que regenera automáticamente el grid de días asegurando que el día 1 caiga en el día de la semana correcto.

## ¿Cómo se aplicó la lógica de React Native?
- **Generación de Grid Dinámico**: 
  ```javascript
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  ```
  Esta lógica permite calcular cuántos días tiene un mes y cuántos espacios vacíos dejar al principio de la fila para que el calendario sea preciso.
- **Animación de Expansión**: Se utilizó `Animated.spring` sobre la propiedad `height` del contenedor del calendario para que la transición entre la vista semanal y la mensual sea orgánica.
- **Iconos Multicapa**: Los nuevos iconos usan capas de `View` superpuestas (ej: la casa usa un triángulo absoluto sobre un cuadrado base) para lograr detalle sin imágenes.

## Continuidad
- **Persistencia**: La racha actual es "mocked" visualmente. El siguiente paso técnico es integrar `AsyncStorage` para que los puntos en el calendario reflejen la realidad del usuario.

---
*Lección documentada por Robert (Senior Dev & Architect).*
