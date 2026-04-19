# SYSTEM_LOG.md: Registro Técnico de Decisiones

## 18/04/2026 - Inicialización de Protocolo y Estructura
- **Decisión**: Reconstrucción de archivos de contexto.
  - **Por qué**: El usuario cambió de directorio (`MyApp03`) y los archivos referenciados no existían localmente. Para cumplir el protocolo estrictamente, se restauraron basados en el plan conceptual previo.
- **Decisión**: Estructura de carpetas bajo `src/`.
  - **Por qué**: Organización modular estándar que facilita la separación de lógica de negocio (hooks) y presentación (components/screens), manteniendo el proyecto escalable dentro del minimalismo.
- **Decisión**: Uso de `New-Item` para carpetas.
  - **Escenario**: Entorno Windows PowerShell.

## 18/04/2026 - Corrección de Visibilidad (Expo Router)
- **Decisión**: Migrar lógica de `App.js` a `app/(tabs)/index.tsx`.
  - **Por qué**: El proyecto usa `expo-router` y el archivo `App.js` era ignorado. Se eliminó `App.js` para evitar confusiones de arquitectura.

## 18/04/2026 - Reingeniería Radical (Bento Hub)
- **Decisión**: Eliminación de `(tabs)` y paso a Single Hub Experience.
  - **Por qué**: Mejorar la jerarquía visual y eliminar la sensación de "tutorial genérico". El formato Bento permite destacar la actividad principal (AI Scenario).
- **Decisión**: Iconografía abstracta construida con `View` en lugar de emojis.
  - **Por qué**: Alineación con estética de software premium/minimalista.

## 18/04/2026 - Secciones Gamificadas (Estilo Duolingo)
- **Decisión**: Paso a navegación por estado (`activeTab`) con 4 secciones.
  - **Por qué**: Facilitar la progresión del usuario y separar el refuerzo positivo (Inicio) de la acción (Actividades), siguiendo patrones probados en EdTech.
- **Decisión**: Barra de progreso de racha calculada manualmente con `Views`.
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
