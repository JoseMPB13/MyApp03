# Lección 16: Motor de IA Tiny Lessons & Correcciones de Layout

## Contexto
Para mejorar la experiencia de aprendizaje, hemos evolucionado la sección de Chat genérico a un sistema de "Tiny Lessons" inspirado en Duolingo. Además, hemos resuelto problemas críticos de accesibilidad visual relacionados con el teclado en dispositivos móviles.

## Objetivos Cumplidos
1.  **Motor de Tutoría IA**: Implementación de `AITutorService` usando Groq (Llama 3.1) con capacidad de evaluación en tiempo real.
2.  **Layout Robusto**: Corrección del `KeyboardAvoidingView` para que el input de texto no sea tapado por el teclado.
3.  **UI de Feedback**: Burbujas de chat con estados visuales (Éxito/Corrección) y traducción interactiva.

## Implementación Técnica

### 1. Servicio de Tutoría Estructurada
Se creó `src/api/ai_tutor.ts` que força a la IA a responder en formato JSON. Esto permite separar el texto para mostrar de los metadatos de feedback y traducción.

```typescript
// Estructura de respuesta de la IA
export interface LessonResponse {
  text: string;
  feedbackType: 'success' | 'correction' | 'neutral';
  translation: string;
  nextGoal?: string;
}
```

### 2. UI Minimalista y Gamificada
*   **Bordes de Feedback**: Uso de colores `#05c46b` (Éxito) y `#ff4757` (Corrección) en los bordes de las burbujas para dar feedback inmediato sin interrumpir el flujo.
*   **Traducción Inline**: Al tocar una burbuja de la IA, se cambia el estado `isTranslationVisible`, permitiendo al usuario ver el significado en español instantáneamente.

### 3. Correcciones Móviles
*   **Keyboard Offset**: Se estableció un `keyboardVerticalOffset` dinámico (100 en iOS) para compensar los elementos absolutos del layout principal.
*   **SafeAreaView**: Aseguramos la compatibilidad con dispositivos con notch (iPhone, Android modernos).

## Resumen de Archivos
- `src/api/ai_tutor.ts`: Lógica de integración con Groq.
- `src/screens/AIScenario.tsx`: Componente de pantalla refactorizado.
- `PROJECT_STATE.md`: Actualizado a v19.0.0.

## Próximos Pasos
- Integrar audio (Text-to-Speech) para las respuestas de la IA.
- Expandir el número de escenarios predefinidos.
