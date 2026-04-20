import { useState } from 'react';

/**
 * Hook de traducción usando MyMemory API (gratuita, sin API key).
 * Soporta traducción bidireccional Español <-> Inglés.
 * Límite: 5000 caracteres/día (más que suficiente para palabras individuales).
 */
export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (text: string, targetLanguage: 'Spanish' | 'English'): Promise<string | null> => {
    if (!text.trim()) return null;

    setLoading(true);
    setError(null);

    // MyMemory usa códigos de idioma: en=English, es=Spanish
    const langPair = targetLanguage === 'Spanish' ? 'en|es' : 'es|en';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=${langPair}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translated = data.responseData.translatedText.trim();
        // MyMemory a veces devuelve el texto en mayúsculas, lo normalizamos
        const normalized = translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase();
        setLoading(false);
        return normalized;
      }

      throw new Error(data.responseDetails || 'Error en la traducción');
    } catch (err: any) {
      console.error('Translation Error:', err);
      setError('Error al traducir. Escribe ambos campos manualmente.');
      setLoading(false);
      return null;
    }
  };

  return { translate, loading, error };
};
