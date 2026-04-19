# LESSON_02_EXPO_ROUTER_ENTRY.md: El Laberinto del Root 🧶

## ¿Qué se hizo?
Se corrigió un error de visibilidad de la interfaz. Aunque se había implementado el mockup en `App.js`, el proyecto estaba configurado para usar `expo-router`, lo que hace que el framework busque los puntos de entrada dentro de la carpeta `app/`.

1. **Identificación**: Se detectó que `package.json` apuntaba a `"expo-router/entry"`.
2. **Migración**: Se trasladó la lógica de UI minimalista de `App.js` a `app/(tabs)/index.tsx`.
3. **Limpieza**: Se eliminó `App.js` y se removieron los componentes boilerplate del template por defecto (`ThemedText`, `ParallaxScrollView`, etc.) para mantener la filosofía **Zero-Dependency**.

## ¿Cómo se aplicó la lógica de React Native?
- **Prioridad de Ruteo**: Se comprendió que en proyectos modernos de Expo, el archivo de la raíz es a menudo ignorado si existe una arquitectura de archivos en `app/`.
- **Simplificación**: En lugar de luchar contra el router, nos integramos en su pantalla principal (`HomeScreen`), manteniendo la pureza de los componentes Core.

## Continuidad para el Próximo Agente
- **Ojo con el Ruteo**: Antes de crear una nueva pantalla, verifica si debe ir en `app/` o si es un componente de `src/screens/`.
- **Estado**: La UI ahora debería ser visible inmediatamente al ejecutar `npx expo start`.

---
*Lección documentada por Robert (Senior Dev & Architect).*
