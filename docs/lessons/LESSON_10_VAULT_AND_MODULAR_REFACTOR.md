# LESSON_10: The Vault & Modular Refactor

## Contexto de la Tarea
El objetivo era implementar la pantalla de "The Knowledge Vault" (El Baúl) para que el usuario pueda capturar y visualizar su vocabulario personal, sentando las bases para el contexto futuro de la IA. Además, se requirió una refactorización para separar la lógica de misiones y baúl de `app/index.tsx`.

## Decisiones Técnicas Clave

### 1. Arquitectura Modular en `src/screens/`
- **Problema**: `app/index.tsx` se estaba volviendo un archivo monolítico difícil de mantener.
- **Solución**: Se crearon `ActividadesSection.tsx` y `VaultSection.tsx` en `src/screens/`.
- **Impacto**: Mejora significativa en la legibilidad y permite trabajar en misiones o vocabulario de forma independiente.

### 2. Estética "Bento Hub"
- **Diseño**: Inspirado en paneles de control premium, el Baúl utiliza un grid asimétrico.
- **Implementación**: Se usaron proporciones de 64% y 32% para el layout superior, combinando acciones rápidas ("Añadir Palabra") con métricas en tiempo real.

### 3. Formulario Bento con Dropdown Nativo
- **Restricción**: Zero-Dependency (No usar `react-native-picker` o similares).
- **Solución**: Se implementó un selector de categorías basado en "Chips" interactivos.
- **Resultado**: Interfaz ligera, altamente visual y consistente con el diseño minimalista.

### 4. Tarjetas 3D y Feedback Háptico
- **Estilo**: Se replicó el feedback visual de WordMatcher mediante `borderBottomWidth` y `Platform.select`.
- **Feedback**: El uso de `expo-haptics` (Impact y Notification) proporciona una sensación de calidad "física" al interactuar con el baúl.

## Código Representativo (VaultSection)
```tsx
const handleAddWord = async () => {
  // ... validaciones ...
  const result = await VaultService.addWord(newWord);
  if (result.success) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    loadVault(); // Recarga reactiva
  }
};
```

## Resumen de Aprendizaje
Separar las pantallas en componentes dedicados en `src/screens` es el estándar que seguiremos a partir de ahora para evitar archivos de más de 300 líneas. El diseño "Bento" es ideal para aplicaciones de aprendizaje porque facilita el consumo de información fragmentada.
