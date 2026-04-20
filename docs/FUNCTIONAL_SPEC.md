# ⚙️ Especificación Funcional (Lógica Interna)

Este documento explica "cómo funciona por dentro" el ecosistema de aprendizaje de **LyricLearn / AI Language Coach**. Su propósito es ayudar a cualquier desarrollador nuevo a comprender las lógicas de interacción sin necesidad de leer línea por línea el código fuente.

---

## 🕋 1. The Vault (El Baúl)
**Archivos Relevantes**: `src/screens/VaultSection.tsx` (UI) y `src/api/vault.ts` (Servicio).

El Baúl no es solo un bloc de notas estático, es un sistema dinámico de seguimiento de vocabulario.

*   **Guardado y Categorización con IA**: Cuando el usuario guarda una nueva palabra (ya sea manualmente o desde el resumen de un minijuego), los datos no van directamente a Supabase. Primero pasan por la función `categorizeVaultWord()` localizada en `src/api/ai_tutor.ts`. Esta función evalúa la palabra enviando un prompt invisible a **Groq (Llama 3.1)**, el cual decide a qué categoría semántica pertenece (ej. *Tecnología*, *Comida*, *Verbos*). Solo entonces, la palabra enriquecida se inserta en Supabase vía `vault.ts`.
*   **Sistema Progresivo de Niveles**: Cada palabra tiene un estado (`learning` o `mastered`) y un porcentaje de dominio (`mastery_percent`). Por ejemplo, al acertar una palabra en un juego rápido, se le otorga un 20% inicial de maestría. El objetivo es que a medida que el usuario usa esta palabra exitosamente en la "Charla con Raccoon", este porcentaje aumente hasta sellarla como *Mastered* (dominada).

---

## 🦊 2. Charla con Raccoon (Tiny Lesson)
**Archivos Relevantes**: `src/screens/AIScenario.tsx` (UI y Estado) y `src/api/ai_tutor.ts` (Flujo IA).

Este módulo es el corazón del "Roleplay", diseñado para simular inmersión total en ráfagas muy cortas para mantener la retención.

*   **Flujo de la "Tiny Lesson"**:
    1.  **Contexto**: El usuario selecciona un objetivo y un escenario (ej. "Pedir un café").
    2.  **Turnos Finitos**: El chat está programado por sistema para durar exactamente **5 turnos**. Del turno 1 al 4, la IA formula preguntas para mantener la interacción. En el turno 5, la IA despide la conversación para evitar chats infinitos y pérdida de enfoque.
*   **Motor de Feedback Estricto**: Las respuestas de la IA no son texto libre. El sistema requiere que Llama 3.1 conteste utilizando un formato JSON inmutable (`response_format: { type: 'json_object' }`). Este JSON contiene:
    *   La respuesta conversacional estricta en inglés.
    *   Una matriz de evaluación o `feedbackCapsule` separando el análisis en tres ejes: **Gramática**, **Vocabulario** y **Naturalidad**.
    *   Una traducción al español de toda su intervención, útil para destrabar al alumno mediante un botón de ayuda inline en la UI.

---

## ⚡ 3. Word Matcher (Calentamiento)
**Archivos Relevantes**: `src/components/games/WordMatcher.tsx` (Lógica del Juego) y `src/screens/ActividadesSection.tsx` (Inyección de Datos).

Es el gimnasio mental rápido antes de entrar al roleplay con la IA.

*   **Carga Dinámica de Datos**: `ActividadesSection.tsx` decide qué palabras inyectar en el juego. Si el usuario tiene suficientes en etapa "learning" en su Baúl, el juego utilizará ese vocabulario para repasar. Si no, inyectará paquetes prediseñados.
*   **Lógica de Emparejamiento Inmutable**:
    1.  Se generan dos columnas barajadas aleatoriamente conectadas por un `matchId`.
    2.  Si las tarjetas de ES y EN seleccionadas comparten id, la coincidencia desaparece sutilmente de la pantalla (actualizando el array `matchedIds`).
*   **Manejo de Errores y Retención**:
    *   Si los IDs difieren, un estado temporal (`wrongEs`/`wrongEn`) empapa las celdas de un color rojo con retroalimentación hápica de error, devolviéndolas a su estado normal a los 800ms.
    *   Al concluir las 5 asociaciones, una pantalla condicional resume la sesión. Las palabras repasadas que aún no estaban en el Baúl tienen un botón de **guardado rápido**.

---
*Conclusión: La app opera en un ciclo de retroalimentación donde The Vault alimenta a los Juegos, los Juegos refuerzan la memoria, y The AI Scenario pone todo ese refuerzo a prueba en tiempo real.*
