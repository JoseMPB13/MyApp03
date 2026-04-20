# 🦝 LyricLearn: AI Language Coach

¡Bienvenido a **LyricLearn** (Word Matcher Edition)! 🚀 Una aplicación educativa de próxima generación diseñada para llevar tu aprendizaje de inglés de la teoría pasiva a la fluidez activa. Impulsada por Inteligencia Artificial y diseñada con cariño para ser rápida, limpia y altamente efectiva.

## ✨ Core Features

Nuestra plataforma se centra en crear un ciclo de aprendizaje adictivo y práctico:

*   🦊 **Charla con Raccoon (AI Roleplay)**: Sumérgete en escenarios conversacionales dinámicos de la vida real (aeropuertos, cafeterías, entrevistas). Nuestro tutor de IA analiza tu gramática, vocabulario y naturalidad en cada turno, dándote feedback al instante.
*   🧠 **The Knowledge Vault (El Baúl)**: Tu "Bento Hub" personal. Cada vez que descubres una frase útil o una nueva palabra, guárdala aquí. La IA se encarga de categorizarlas automáticamente para ti.
*   ⚡ **Word Matcher**: Un mini-juego integrado de emparejamiento de alta velocidad diseñado para cimentar tu vocabulario y preparar tu cerebro antes de hablar.
*   🎯 **Misiones Diarias y Tips**: Mantén tu racha viva con objetivos diarios y recibe píldoras de motivación generadas por la IA cada vez que abras la app.

## 🛠️ Tech Stack

Construida sobre cimientos sólidos y modernos:

*   **Frontend**: **React Native** usando **Expo** (SDK 54) con Expo Router para una navegación fluida y nativa.
*   **Inteligencia Artificial**: **Groq Cloud API** con el modelo Llama 3.1, garantizando respuestas casi instantáneas (cero latencia frustrante).
*   **Backend & Data**: **Supabase**. Utilizamos PostgreSQL, Auth y Edge Functions para asegurar una sincronización impecable de tu progreso y tu Bóveda entre dispositivos.

## 🧘 Nuestra Filosofía

**"Zero-Dependency Minimalist"**. Creemos que menos es más.
*   🎨 Diseño limpio, minimalista y premium. Nos enfocamos en la usabilidad minimizando el ruido visual. Cero distracciones.
*   🏗️ Evitamos librerías pesadas e innecesarias, construyendo la mayor parte de la interfaz con los Componentes Core nativos. ¡Ligera como una pluma!

## 🚀 Instalación y Uso

¿Listo para practicar? Sigue estos pasos para levantar el entorno local:

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio-url>
   cd MyApp03
   ```

2. **Instala las dependencias** (puedes usar npm o bun)
   ```bash
   npm install
   # o
   bun install
   ```

3. **Configura el Entorno**
   Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales vitales:
   ```env
   EXPO_PUBLIC_GROQ_API_KEY=tu_clave_de_groq_aqui
   EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **¡Lanza la app!**
   ```bash
   npx expo start
   ```

---
*Hecho para conversar. Hecho para aprender.* 🚀
