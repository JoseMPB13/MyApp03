# 🏛️ Architecture & System Design: LyricLearn (AI Language Coach)

Este documento detalla la estructura profunda y el diseño de la arquitectura de nuestra aplicación, enfocada en mantener un ecosistema "Zero-Dependency", modular y altamente eficiente.

## 🗺️ Mapa del Proyecto

Nuestra arquitectura híbrida combina el enrutamiento moderno con una clara separación de la lógica de negocio.

```text
MyApp03/
├── app/                  # (Expo Router) Punto de entrada y jerarquía de navegación.
│   ├── _layout.tsx       # Layout principal que envuelve la app con ThemeContext.
│   ├── index.tsx         # Pantalla principal que orquesta todas las secciones (Vault, Actividades, Auth).
│   └── modal.tsx         # Rutas de presentación superpuestas.
│
├── src/                  # 🧠 El corazón de la aplicación (Lógica y UI Core).
│   ├── api/              # Capa de Servicios: Comunicación externa.
│   │   ├── ai_tutor.ts   # Integración con Groq Cloud (Llama 3.1) para prompts e IA.
│   │   ├── auth.ts       # Funciones de autenticación y "Sync Guard".
│   │   ├── missions.ts   # Gestión de rachas y objetivos diarios.
│   │   ├── supabase.ts   # Inicialización y cliente de la base de datos.
│   │   └── vault.ts      # Endpoints para obtener, subir y actualizar palabras guardadas.
│   │
│   ├── components/       # UI Reutilizable y Específica.
│   │   ├── common/       # Botones, tarjetas y layouts base.
│   │   └── games/        # Componentes aislados de gamificación.
│   │       └── WordMatcher.tsx # El mini-juego de emparejamiento.
│   │
│   ├── context/          # Estados Globales (React Context).
│   │   └── ThemeContext.tsx # Central de colores, tipografías y Dark Mode.
│   │
│   ├── hooks/            # Hooks pesados aislados.
│   │   └── useTranslation.ts # Manejo local del estado de las traducciones IA.
│   │
│   └── screens/          # Vistas Modulares (Inyectadas en app/index.tsx).
│       ├── ActividadesSection.tsx # Contenedor de juegos y escenarios.
│       ├── AIScenario.tsx         # Módulo de roleplay interactivo.
│       ├── AuthSection.tsx        # Flujos de Login/Signup nativos.
│       └── VaultSection.tsx       # El "Bento Hub", visualizador del baúl.
│
└── docs/                 # Documentación técnica, esquemas DB y lecciones aprendidas.
```

## 🔄 Flujo de Datos

El flujo de información en la aplicación es vertical y unidireccional, asegurando previsibilidad:

1.  **Estado Global (ThemeContext)**: Proveé a toda la aplicación (desde `app/_layout.tsx`) con los tokens de diseño (colores, modo oscuro). Cualquier cambio aquí re-renderiza eficientemente solo los estilos de la UI.
2.  **Capa de Servicios (`src/api/`)**: Actúa como un proxy. Las pantallas NUNCA hablan directamente con Internet; llaman a una función en `api/`.
    *   **Supabase**: `auth.ts`, `missions.ts`, y `vault.ts` utilizan el cliente de Supabase para operaciones directas en la base de datos PostgreSQL. Cuentan con lógica de caché local (`AsyncStorage`) para mitigar peticiones innecesarias.
    *   **Groq AI**: `ai_tutor.ts` realiza el `fetch` puro hacia la API de Groq y asegura que el retorno sea un JSON estandarizado para la app.

## 🤝 Relación de Archivos por Sección

### 1. The Knowledge Vault (El Baúl)
*   **Contenedor**: `src/screens/VaultSection.tsx`. Se encarga de solicitar los datos usando `src/api/vault.ts`.
*   **Interacción**: Muestra los datos de aprendizaje en formato visual "Bento". Cuando un usuario quiere añadir una palabra, el Vault consulta primero a `src/api/ai_tutor.ts` (`categorizeVaultWord()`) para asignarle una etiqueta temática automática antes de enviarla a Supabase.

### 2. Actividades y Gamificación
*   **Contenedor**: `src/screens/ActividadesSection.tsx`. Actúa como un Dashboard seleccionador.
*   **Interacciones Hojas**:
    *   Si se abre el minijuego, renderiza `src/components/games/WordMatcher.tsx`. Este componente obtiene aleatoriamente el vocabulario directamente del Baúl del usuario para configurar los niveles.
    *   Si se escoge un escenario, renderiza `src/screens/AIScenario.tsx`, que mantiene una conexión constante con `ai_tutor.ts` para evaluar el chat en vivo del usuario mediante prompts de IA pre-diseñados.

### 3. Autenticación (Auth)
*   **Contenedor**: `src/screens/AuthSection.tsx`.
*   **Interacción**: Permite Iniciar Sesión o Registrarse delegando las peticiones a `src/api/auth.ts`.
*   **Sync Guard**: Esta es la única sección que bloquea la renderización completa de `app/index.tsx` si no hay sesión iniciada, protegiendo todos los demás endpoints.

## 🧠 Lógica de Negocio Central

Toda la lógica "fuerte" de la aplicación está alojada y aislada de los componentes visuales:

*   **Sistema de Niveles (The Vault)**: Ubicado dentro de las funciones de evaluación en `vault.ts`. El backend de Supabase lleva una cuenta secreta de "dominio de palabra" basada en cuántas veces se usa correctamente en el `AIScenario`.
*   **Motor de Tips y Feedback (AI)**: Reside completamente en `ai_tutor.ts`. Las reglas sobre cómo se critica la gramática del usuario o qué tip diario mostrar se definen en los "System Prompts" del código, asegurando consistencia instruccional.
*   **Contador de Racha (Misiones Diarias)**: Manejado por `missions.ts` en sinergia con el Backend. Calcula matemáticamente si el `last_login_date` es contiguo al día actual para incrementar o reiniciar la racha.
