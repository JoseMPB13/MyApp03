# AI Language Coach: Proyecto de Guerrilla 🚀

## Misión
Una plataforma de aprendizaje de inglés minimalista y de alto impacto, potenciada por **Groq AI (Llama 3.1)**. Diseñada para transformar el vocabulario pasivo en capacidad conversacional activa mediante escenarios de rol realistas y feedback inmediato.

## Características Principales
- **AI Scenario (Roleplay Dinámico)**: Practica en situaciones reales (aeropuertos, cafeterías, oficinas) con un tutor IA que analiza tu gramática y sugiere formas naturales de expresión.
- **Word Matcher**: Un mini-juego de velocidad integrado para calentar el cerebro antes de las sesiones de conversación.
- **The Knowledge Vault (Bento Hub)**: Un sistema de almacenamiento inteligente donde guardas palabras y frases. La IA las categoriza automáticamente por temas (Comida, Viajes, etc.).
- **Daily Motivation**: Tips diarios y frases motivacionales generadas por IA al iniciar la app.
- **Identity Sync Guard**: Sincronización automática de tu progreso y baúl con Supabase, con protección contra bucles de datos.

## Filosofía de Desarrollo: "Zero-Dependency Minimalist"
- **Eficiencia Extrema**: Uso de Groq Llama-3.1-8b para latencias menores a 1s en respuestas complejas.
- **Core RN Components**: Todo se construye con componentes nativos para asegurar rendimiento y ligereza.
- **Seguridad**: Autenticación persistente y segura vía Supabase.

## Guía de Inicio Rápido
1. Instalar dependencias: `npm install`
2. Configurar `.env` con `GROQ_API_KEY` y credenciales de Supabase.
3. Iniciar proyecto: `npx expo start`
