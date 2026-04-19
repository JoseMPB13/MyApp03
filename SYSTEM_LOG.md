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
