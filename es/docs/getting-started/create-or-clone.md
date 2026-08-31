---
title: Crear o Clonar un Proyecto
parent: Primeros Pasos
nav_order: 2
---

# Crear o Clonar un Proyecto

## Empezar un proyecto nuevo

```bash
pnpm create expo-app my-app        # o: npx create-expo-app@latest my-app
cd my-app && pnpm install
```

Esto te da una app de Expo moderna (estilo SDK 54 / RN 0.81) con TypeScript y
ruteo basado en archivos, lista para usar.

## Sumarte a un proyecto existente

```bash
git clone <repo-url>
cd <repo>
pnpm install
```

## Una nota sobre las carpetas nativas

{: .note-title }
Nota

{: .note }
Algunos proyectos commitean las carpetas `ios/` y `android/` (el workflow
"bare"); otros las generan a demanda con `npx expo prebuild`. Cualquiera de
las dos está bien — solo tenés que saber en cuál estás. La sección **Entorno
y Configuración** explica cómo un `app.config.ts` dinámico maneja los
identificadores nativos por ambiente.

Siguiente: configurá tus **Variables de Entorno**.
