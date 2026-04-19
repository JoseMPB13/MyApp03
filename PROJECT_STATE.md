# PROJECT_STATE.md: Estado del Proyecto - AI Language Coach

## Fecha de Última Actualización: 18/04/2026

## Fase Actual: Fase 3 - Integración Cloud y Misiones ☁️🏗️

## Progreso:
- [x] Establecimiento de Protocolo de Contexto y Memoria.
- [x] Reconstrucción de Archivos de Reglas de Oro en el nuevo directorio (`MyApp03`).
- [x] Creación- **Decisión**: Barra de progreso de racha calculada manualmente con `Views`.
  - **Por qué**: Mantener el control total del estilo visual sin dependencias externas.

## 18/04/2026 - Refinamiento Premium v5 (Estética 3D)
- **Decisión**: Uso de `borderBottomWidth` y `translateY` para botones interactivos.
  - **Por qué**: Emular el feedback físico de aplicaciones de alto nivel (Mimo/Duolingo) sin dependencias externas.
- **Decisión**: Barra de navegación flotante con `glassmorphism`.
  - **Por qué**: Reducir la fatiga visual y modernizar el sistema de navegación manual.

## 18/04/2026 - Inicio v6 (Calendario & Racha Real)
- **Decisión**: Racha ligada a finalización de lecciones.
  - **Por qué**: Dar un propósito claro al usuario más allá de "acumular puntos", fomentando el aprendizaje real.
- **Decisión**: Calendario mensual con lógica `Date`.
  - **Por qué**: Visualizar el compromiso a largo plazo y permitir la navegación histórica, clave para la retención.
- **Decisión**: Iconos figurativos v3.
  - **Por qué**: El usuario rechazó lo abstracto; se volvió a formas reconocibles construidas pieza a pieza.

## 18/04/2026 - Refinamiento Visual v7 (Legibilidad Total)
- **Decisión**: Iconos sólidos (v4) con rellenos en lugar de líneas.
  - **Por qué**: Maximizar el peso visual y la identificación instantánea de las secciones.
- **Decisión**: Racha esmeralda con fondo de celda completo.
  - **Por qué**: Resolver el problema de visibilidad de la racha en el calendario mensual, permitiendo una lectura global inmediata.

## 18/04/2026 - Estabilización v8 (Calidad de Producción)
- **Decisión**: Integración de `@expo/vector-icons`.
  - **Por qué**: Los iconos construidos con `View` no tenían la nitidez requerida por el usuario. Se usó el estándar de Expo para asegurar calidad premium.
- **Decisión**: Eliminación de `app/(tabs)`.
  - **Por qué**: Limpieza de errores de ruteo y referencias huérfanas que bloqueaban la compilación limpia.
- **Decisión**: Refactor de tipos de estilo.
  - **Por qué**: Corregir errores de sobrecarga en React Native al usar operadores lógicos en arrays de estilos.
- [x] Implementación de Mockup Inicial en `app/(tabs)/index.tsx`.
- [x] Rediseño Premium y Panel de Racha (Tarea 2).
- [x] Reingeniería Radical: "The Minimalist Bento Hub" (Tarea 3).
- [x] Navegación por Secciones Gamificadas (Tarea 4).
- [x] Refinamiento Premium v5: Gamified Architecture (Tarea 5).
  - [x] Implementación de Botones 3D (estilo Duolingo).
  - [x] Barra de Navegación Flotante y Transparente.
  - [x] Lógica de Saludo Dinámico y Coach Tooltip.
- [x] Reconstrucción Inicio v6: Calendario & Racha (Tarea 6).
  - [x] Racha basada en lecciones (no en puntos).
  - [x] Calendario semanal y mensual expandible con navegación.
  - [x] Iconografía figurativa v3 (puras `Views`).
- [x] Refinamiento Visual v7: Iconos Sólidos & Legibilidad (Tarea 7).
  - [x] Rediseño de iconos figurativos a formas sólidas (v4).
  - [x] Racha esmeralda de alto contraste en calendario (relleno completo).
- [x] Estabilización v8: Iconos Profesionales & Fixes (Tarea 8).
  - [x] Integración de `@expo/vector-icons` (Ionicons).
  - [x] Corrección de errores de TypeScript (ViewStyle overlap).
  - [x] Limpieza de directorio `app/(tabs)` y escapado de caracteres.

## 19/04/2026 - Integración Cloud v9 (Supabase & Misiones)
- **Decisión**: Integración de Supabase como backend oficial.
  - **Por qué**: Necesidad de persistencia real de racha y vocabulario "Baúl" que sobreviva al cierre de la app.
- **Decisión**: Juego funcional "Word Matcher".
  - **Por qué**: Primer paso para que la app sea útil; el usuario ya puede aprender activamente.
- **Decisión**: Configuración Metro `.mjs` y SSR-Safe para web.
  - **Por qué**: Solucionar incompatibilidades críticas de Supabase en entornos Expo Web.

## Próximos Pasos:
1. Implementar motor de IA (Gemini) en la sección de Chat.
2. Añadir formulario de carga manual al Baúl.

## Notas de Agente:
Se ha recuperado el contexto perdido del proyecto. Estamos alineados con la filosofía **Zero-Dependency Minimalist**.
