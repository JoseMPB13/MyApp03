# SYSTEM_LOG.md: Registro Técnico de Decisiones

## 18/04/2026 - Inicialización y Estructura
- **Decisión**: Reconstrucción de archivos de contexto en `MyApp03`.

## 19/04/2026 - Integración Cloud v9
- **Decisión**: Integración de Supabase con configuración Metro `.mjs`.

## 20/04/2026 - The Vault & Modular Refactor v10
- **Decisión**: Arquitectura modular en `src/screens`.
- **Decisión**: Layout Bento para el Baúl.

## 20/04/2026 - AI Stabilization v11 (UUID & Translation)
- **Decisión**: Corrección de tipos a UUID.
  - **Contexto**: El error 400 en Supabase era causado por intentar comparar un `UUID` col con un string no-UUID.
  - **Acción**: Migración de `USER_ID` a formato UUID estándar.
- **Decisión**: Implementación de `useGemini` con `fetch`.
  - **Contexto**: Necesidad de traducción automática en el Baúl.
  - **Acción**: Fetch directo a la API de Google AI Studio para mantener la política de cero dependencias externas pesadas.
- **Decisión**: Lógica de Debounce de 1000ms.
  - **Razón**: Reducir latencia percibida y consumo de cuota de API mientras se provee feedback visual en tiempo real.
- **Decisión**: Regla de "No Sobrescritura" en traducciones.
  - **Razón**: Priorizar el input manual del usuario sobre las sugerencias de la IA.
