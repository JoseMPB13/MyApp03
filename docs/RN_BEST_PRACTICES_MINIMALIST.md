# Buenas Prácticas y Estándares Minimalistas

## Reglas de Oro
1. **Zero-Library Policy**: Antes de instalar un npm package, intenta resolverlo con `StyleSheet` y componentes Core. Mantén el bundle ligero.
2. **Estética de Espaciado (8px Grid)**: Uso de unidades de 8px (8, 16, 24, 32, 48) para márgenes y padding para mantener una rejilla visual consistente.
3. **Flat Premium Design**: Bordes redondeados generosos (16px - 24px) y sombras muy sutiles (`boxShadow` para compatibilidad web).
4. **Tipografía Moderna**: Uso de fuentes de sistema con pesos variados para jerarquía clara. Evitar colores de texto 100% negros; preferir grises profundos.

## Estándares de Código
- **Modularidad Híbrida**: Rutas en `app/` (Expo Router), pero lógica pesada y componentes de negocio en `src/`.
- **Hooks de Negocio**: Separar la lógica de IA y Datos en hooks (ej. `useTranslation`).
- **Comunicación con IA (Groq)**: Siempre solicitar respuestas en formato `json_object`. Formato estándar:
  ```json
  {
    "text": "Respuesta en inglés",
    "feedbackType": "success | correction | neutral",
    "translation": "Traducción al español",
    "feedbackCapsule": {
      "grammar": "...",
      "vocabulary": "...",
      "naturalness": "..."
    }
  }
  ```

## Backend & Sync
- **Sync Guard Pattern**: Implementar guardias de sincronización en los servicios para evitar loops infinitos entre el estado local y Supabase.
- **AsyncStorage First**: Usar caché local para asegurar que la app funcione instantáneamente mientras se sincroniza el cloud.

## UI/UX
- **Haptics**: Usar `expo-haptics` en interacciones clave.
- **Loading States**: Mockups o skeletons minimalistas durante los `fetch` de la IA.
