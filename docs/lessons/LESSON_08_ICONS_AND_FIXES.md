# LESSON_08_ICONS_AND_FIXES.md: Estabilización y Calidad de Producción 🛠️

## ¿Qué se hizo?
Se ha realizado una fase de estabilización crítica para resolver errores de compilación y mejorar la calidad visual mediante herramientas estándar de la industria.

1. **Integración de `@expo/vector-icons`**: Tras la retroalimentación del usuario sobre los iconos manuales, se integró la librería nativa de Expo para usar **Ionicons**. Esto proporciona una iconografía nítida, consistente y profesional sin el peso de assets externos.
2. **Corrección de Tipado en Estilos**: Se resolvió el error `No overload matches this call` en los arrays de estilos de React Native. El problema radicaba en el uso de operadores lógicos `&&` que devolvían `0` o `false`, valores no permitidos en ciertos tipos de `ViewStyle`. Se cambió por ternarios que devuelven `null`.
3. **Escapado de Caracteres**: Se corrigió el error de linter sobre comillas no escapadas en los strings de JSX, utilizando entidades HTML (`&quot;`) para asegurar la compatibilidad total.
4. **Limpieza de Ruteo**: Se eliminó el directorio `(tabs)` sobrante que generaba errores de referencia al intentar importar componentes inexistentes como `HapticTab`.

## ¿Cómo se aplicó la lógica de React Native?
- **Componente `TabIcon`**: Se abstrajo la lógica de selección de iconos en un componente funcional que mapea el nombre de la sección al nombre del glifo de Ionicons, manejando el estado `active` para alternar entre variantes rellenas y de línea (outline).
- **Control de Invariantes**: Al eliminar `useEffect` no utilizado y limpiar las importaciones, se redujo el ruido en el bundle y se mejoró la lectura del código.

## Hallazgos Técnicos
- **Expo Router & (tabs)**: Mantener directorios de ruteo vacíos o con errores de importación puede bloquear la compilación del bundle principal aunque no se estén usando. La limpieza de archivos huérfanos es esencial.

---
*Lección documentada por Robert (Senior Dev & Architect).*
