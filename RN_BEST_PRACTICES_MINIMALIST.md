# Buenas Prácticas y Estándares Minimalistas

## Reglas de Oro de Robert
1. **Zero-Library Policy**: Antes de instalar un npm package, intenta resolverlo con `StyleSheet` y componentes Core.
2. **Estética de Espaciado**: Uso de unidades de 8px (8, 16, 24, 32) para márgenes y padding para mantener consistencia.
3. **Bordes y Sombras**: Bordes redondeados suaves (12px - 20px). Sombras sutiles o ninguna (diseño "Flat Premium").
4. **Tipografía**: Jerarquía clara. Uso de fuentes del sistema o Inter (vía Google Fonts si es necesario).

## Estándares de Código
- **Comentarios**: Explicar el "Por qué" se tomó una decisión técnica en español.
- **Componentes**: Deben ser funcionales y pequeños. Preferir hooks personalizados para la lógica compleja.
- **Comunicación con IA**: Siempre pedir a Gemini que responda en un JSON del tipo:
  ```json
  {
    "response": "Texto de la IA",
    "feedback": "Análisis del Raccoon Coach",
    "natural_alternative": "Cómo lo diría un nativo",
    "vault_suggestions": ["frase1", "frase2"]
  }
  ```

## UI/UX
- **Retroalimentación Hápica**: Usar `expo-haptics` para momentos clave (éxito/error).
- **Animaciones**: Entrada/Salida de elementos suave para evitar sensación de "parcheo".
