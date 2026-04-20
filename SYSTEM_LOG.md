# SYSTEM_LOG.md: Registro Técnico de Decisiones

## 18/04/2026 - Inicialización y Estructura
- **Decisión**: Reconstrucción de archivos de contexto en `MyApp03`.

## 19/04/2026 - Integración Cloud v9
- **Decisión**: Integración de Supabase con configuración Metro `.mjs`.

## 20/04/2026 - Migration & Stabilization (Groq + Identity Sync)
- **Decisión**: Migración a **Groq (Llama 3.1)**.
  - **Razón**: Mejora drástica en tiempos de respuesta (<1s) y eliminación de errores de cuota/404 de Gemini.
  - **Acción**: Implementado `fetchGroq` en `AITutorService.ts`.
- **Decisión**: Implementación de **Sync Guard** en `AuthService`.
  - **Razón**: El loop infinito de upserts en la tabla `profiles` causaba inestabilidad en la sesión.
- **Decisión**: Refactor visual del Baúl (**Bento Hub**).
  - **Acción**: Uso de layouts compuestos y categorización IA para organizar el vocabulario guardado.
- **Decisión**: Estabilización **SDK 54**.
  - **Acción**: Fix for `AsyncStorageError` reinstalando dependencias nativas específicas para evitar colisiones de versiones.
