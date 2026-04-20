/**
 * Servicio de Tutor IA para lecciones dinámicas (Tiny Lesson).
 * Utiliza Groq Cloud API (Llama 3.1) para procesar el lenguaje natural.
 */

const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface LessonResponse {
  text: string;
  feedbackType: 'success' | 'correction' | 'neutral';
  translation: string;
  nextGoal?: string;
}

export const AITutorService = {
  getLessonResponse: async (messages: any[], scenarioGoal: string): Promise<LessonResponse> => {
    if (!API_KEY) {
      throw new Error('Groq API Key missing');
    }

    const systemPrompt = `
      Eres un tutor de inglés experto para una app estilo Duolingo.
      ESCENARIO ACTUAL: "${scenarioGoal}"
      
      INSTRUCCIONES:
      1. El usuario está tratando de cumplir un objetivo en este escenario.
      2. Evalúa su respuesta. 
      3. Si es correcta o muy cercana, usa feedbackType: 'success'.
      4. Si tiene errores gramaticales o no cumple el objetivo, usa feedbackType: 'correction' y explícale sutilmente.
      5. Responde siempre en inglés para el campo "text", pero avanza la historia.
      6. Proporciona una traducción al español para el campo "translation".
      
      FORMATO DE RESPUESTA (Responde ÚNICAMENTE en JSON):
      {
        "text": "Tu respuesta en inglés aquí",
        "feedbackType": "success" | "correction" | "neutral",
        "translation": "Traducción al español aquí",
        "nextGoal": "Opcional: Siguiente paso de la lección si el actual se cumplió"
      }
    `;

    // Convertir historial al formato de OpenAI
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: formattedMessages,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error('No content in AI response');

      return JSON.parse(content) as LessonResponse;
    } catch (error) {
      console.error('AITutorService Error:', error);
      return {
        text: "I'm having some trouble connecting, but let's keep trying! Try to order your coffee again.",
        feedbackType: 'neutral',
        translation: "Tengo problemas de conexión, ¡pero sigamos intentándolo! Prueba a pedir tu café de nuevo.",
      };
    }
  },
};
