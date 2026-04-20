# Lección 12: Autenticación Profesional con Supabase Auth

En esta lección hemos transformado una aplicación con datos "quemados" (mock data) en un sistema profesional con usuarios reales, sesiones persistentes y seguridad avanzada.

## 1. Conceptos Clave de Supabase Auth

Supabase maneja la autenticación mediante **JWT (JSON Web Tokens)**. Cuando un usuario se registra o inicia sesión, Supabase devuelve una sesión que contiene un token de acceso. Nuestro cliente de Supabase está configurado para:
-   Persistir esta sesión en `AsyncStorage` (móvil) o `localStorage` (web).
-   Refrescar el token automáticamente antes de que expire.

## 2. Implementación del AuthService

Hemos centralizado toda la lógica en `src/api/auth.ts`:
-   `signUp`: Crea un nuevo usuario. Por configuración del proyecto, requiere confirmación por email.
-   `signInWithPassword`: Acceso tradicional.
-   `onAuthStateChange`: Un listener vital que detecta cuándo el usuario entra o sale para actualizar la interfaz en tiempo real.

## 3. Seguridad y RLS (Row Level Security)

Al usar autenticación real, ahora podemos configurar políticas de seguridad en el Dashboard de Supabase:
-   **SELECT**: `auth.uid() = user_id` (Solo yo veo mis palabras).
-   **INSERT**: `auth.uid() = user_id` (Solo yo guardo en mi baúl).

Esto resuelve los errores **406 (Not Acceptable)** que veíamos anteriormente, ya que PostgREST ahora recibe un token válido y sabe qué datos filtrar.

## 4. UI Estilo "Premium Minimalist"

La `AuthSection.tsx` sigue las reglas de oro del proyecto:
-   **Cero Dependencias**: Solo componentes core de React Native.
-   **Estética Elevada**: Uso de `LinearGradient` para un look moderno y limpio.
-   **Feedback Visual**: `ActivityIndicator` en botones y manejo de errores con `Alert`.

## 5. Integración Global

En `app/index.tsx`, el flujo de la app ahora es condicional:
```tsx
if (!session) return <AuthSection />;
return <AppPrincipal userId={session.user.id} />;
```
Esto garantiza que ninguna parte de la aplicación intente cargar datos sin un ID de usuario válido.

---
**Tarea para el desarrollador**:
1. Asegúrate de que el proveedor "Email" esté activo en Supabase.
2. Desactiva la confirmación de email si quieres probar el registro instantáneo, o confírmalo desde tu bandeja de entrada.
3. ¡Disfruta de tu Knowledge Vault 100% privado y seguro!
