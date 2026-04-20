# MyApp03 - PROJECT_STATE.md
**Current Version**: v15.0.0
**Last Sync**: 2026-04-20
**Current Status**: Stabilized AI & Sync
**Author**: Antigravity (AI Architect)

## 🎯 Reciente / Fixes de Estabilidad (v15)
- **Motor de Traducción**: 
    - Migrado de Gemini API (cuota limitada) a **MyMemory API** (gratuita, sin key).
    - Traducción instantánea bidireccional EN<->ES sin depender de cuota.
- **Sincronización de Bóveda**: 
    - Resuelto error 409: `user_vault` requiere foreign key a `profiles`.
    - Implementado `ensureProfile` automático al login y al arrancar la app.
    - Logging detallado de errores Supabase (message, code, details).
- **Web Compliance**: Eliminadas TODAS las advertencias de `shadow*` en toda la app.
- **Email Template**: Rediseñada plantilla de confirmación con estilo premium.

## 20/04/2026 - The Vault & Modular Refactor v10
- **Decisión**: Arquitectura modular en `src/screens`.
- **Decisión**: Estética "Bento Hub" para el Baúl.

## 20/04/2026 - Auth Fixes & UX Optimization v13
- **Decisión**: Corrección de regresiones en `index.tsx`.
  - **Por qué**: Las importaciones de servicios se perdieron en la v12, causando pantallas en blanco.
- **Decisión**: Soporte completo para Sombras en Web (`boxShadow`).
  - **Por qué**: Eliminar advertencias de depreciación y asegurar uniformidad visual.
- **Decisión**: Mensajes de error específicos para Confirmación de Email.
  - **Por qué**: Guiar al usuario de forma clara cuando el registro está pendiente de validación.

## Progreso Tareas:
- [x] Vault & Modular Refactor v10.
- [x] AI Auto-Translation & UUID Fix v11.
- [x] Supabase Auth & Security v12.
- [x] Auth Fixes & UX Optimization v13 (Tarea Actual).

## Próximos Pasos:
1. Gamificar la progresión del Baúl (niveles por palabras dominadas).
2. Implementar motor de IA (Gemini) en la sección de Chat.
3. Personalizar el diseño de los emails automáticos.

## Notas de Agente:
Sistema de persistencia estabilizado. IA integrada en flujos de carga de datos.
