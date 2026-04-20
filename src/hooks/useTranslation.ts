import { useState } from 'react';

/**
 * Hook de traducción usando Groq Cloud API (Llama 3).
 * Reemplaza la integración anterior de Gemini para mayor estabilidad y velocidad.
 * Mantiene arquitectura Zero-Dependency usando fetch nativo.
 */
export const useTranslation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (text: string, targetLanguage: 'Spanish' | 'English'): Promise<string | null> => {
    if (!text.trim()) return null;

    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      console.error('Translation Error: Groq API Key missing (EXPO_PUBLIC_GROQ_API_KEY)');
      return null;
    }

    setLoading(true);
    setError(null);

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const payload = {
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Eres un traductor experto. Traduce el texto al idioma destino. Responde UNICAMENTE con el texto traducido, sin explicaciones, sin comillas y sin etiquetas.'
        },
        {
          role: 'user',
          content: `Traduce esto a ${targetLanguage}: ${text.trim()}`
        }
      ],
      temperature: 0.1,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.choices?.[0]?.message?.content) {
        const translated = data.choices[0].message.content.trim();
        console.log(`Translation Success (Groq): "${translated}"`);
        setLoading(false);
        return translated;
      }

      console.error('Translation Error Detail:', JSON.stringify(data, null, 2));
      throw new Error('Error en la respuesta de Groq');
    } catch (err: any) {
      console.error('Translation Error:', err);
      setError('IA no disponible. Escribe manualmente.');
      setLoading(false);
      return null;
    }
  };

  return { translate, loading, error };
};
