# Stack Tecnológico y Arquitectura

## Frontend Core
- **Framework**: React Native (Expo SDK 54).
- **Entry Point**: `app/index.tsx` (Expo Router).
- **Componentes**: Pure Core Components (`View`, `Text`, `StyleSheet`, `ScrollView`).
- **Navegación**: `expo-router` con estructura híbrida (Logic in `src/screens`).
- **Animaciones**: `react-native-reanimated` para transiciones premium.

## Inteligencia Artificial
- **Modelo**: Groq Cloud - Llama 3.1 (8B Instant) vía API.
- **Integración**: `fetch` directo a la API de Groq con `json_object` response format.
- **Servicios**: `AITutorService` (Tutoría y Feedback).
- **Variable**: `EXPO_PUBLIC_GROQ_API_KEY`.

## Persistencia y Datos (Backend)
- **Database/Auth**: Supabase (PostgreSQL + Auth).
- **Local Cache**: `AsyncStorage` para estados de sesión y temas.
- **Realtime**: Sincronización de perfiles, misiones y bóveda.

## Arquitectura de Carpetas
- `app/`: Rutas y Layouts (Expo Router).
- `src/api`: Servicios de Groq y Supabase.
- `src/components`: UI shared y Mascotas.
- `src/context`: Auth y Theme state providers.
- `src/screens`: Pantallas modulares (Scenarios, Vault, Auth).
- `src/hooks`: Hook `useTranslation` para lógica de IA.
- `docs/db`: Scripts de configuración de base de datos (`supabase_setup.sql`).
