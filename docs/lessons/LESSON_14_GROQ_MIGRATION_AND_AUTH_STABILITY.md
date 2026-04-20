# LESSON_14: Migración a Groq Cloud y Estabilización de Auth

## Contexto
Tras experimentar irregularidades con Google Gemini (problemas de tokens y modelos experimentales), se decidió migrar a una infraestructura más orientada a la producción y resolver un bucle de sincronización crítico en la autenticación.

## 1. Migración a Groq Cloud (modelo Llama 3.1)
Groq ofrece una de las APIs de inferencia más rápidas del mundo. Se reemplazó el hook `useGemini` por `useTranslation`.

### Desafíos de la IA Anterior (Gemini):
- El modelo `2.5-flash` tendía a razonar en voz alta, ocupando tokens valiosos.
- El parsing de la respuesta era complejo debido a la estructura de partes de Google.

### Solución con Groq:
- **Estandarización**: Groq usa el formato OpenAI, lo que simplifica el parsing a `choices[0].message.content`.
- **Velocidad**: La latencia se redujo significativamente, mejorando la sensación de la auto-traducción en el Baúl.
- **Modelo**: Se utiliza `llama-3.1-8b-instant` por su balance entre precisión y costo cero.

## 2. Bucle de Autenticación (Infinite Loop)
Se detectó que la aplicación realizaba peticiones `upsert` constantes a la tabla `profiles` de Supabase en cada cambio de estado, saturando la red y los logs.

### Lección de State Management:
- **Error**: Disparar efectos secundarios de persistencia basados en cambios de sesión sin una guardia de "ya procesado".
- **Solución**: Implementar una bandera de control (`lastSyncedUserId`) en la capa de servicio (`AuthService`).
- **Resultado**: La sincronización ahora es "Lazy": solo ocurre una vez por sesión o cuando el usuario realmente cambia.

## Resumen Técnico
- **Modelo de IA**: Groq Llama 3.1.
- **Flag de Control**: Evita saturación de base de datos.
- **Arquitectura**: Se mantiene el principio de **Zero-Dependencies**.
