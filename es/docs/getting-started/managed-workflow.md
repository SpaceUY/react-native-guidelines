---
title: Workflow Managed (CNG)
parent: Primeros Pasos
nav_order: 3
---

# Workflow Managed (CNG)

El default del equipo es el **workflow managed** de Expo con **Continuous
Native Generation (CNG)**: las carpetas `ios/` y `android/` nunca se
commitean. Se generan a demanda — local con `npx expo prebuild`, o de forma
transparente en **EAS Build** — a partir de `app.config.ts` y los paquetes que
instalás.

{: .note-title }
Nota

{: .note }
**¿Por qué no "cualquiera de las dos está bien"?** Commitear las carpetas
nativas convierte cada cambio de configuración nativa en un diff ilegible,
crea una segunda fuente de verdad (archivos nativos editados a mano vs.
`app.config.ts`) que se desalinea en silencio, y hace que el onboarding
dependa de en qué workflow está el clon de cada uno. CNG mantiene una única
fuente de verdad.

## El día a día

- Los bundle IDs, permisos, schemes de deep-link y demás identificadores
  nativos se cambian en `app.config.ts` — ver **Entorno y Configuración →
  Configuración en Tiempo de Compilación** — nunca a mano en Xcode o Android
  Studio.
- ¿Necesitás inspeccionar o correr un proyecto nativo local? Corré `npx expo
  prebuild --clean` para (re)generar `ios/` y `android/`. Tratá el resultado
  como **output de build descartable**: nunca lo commitees, y borralo o
  regeneralo si alguna vez parece desalineado con tu configuración.
- Los builds de tienda e internos nunca requieren que nadie corra `prebuild` a
  mano — **EAS Build** lo corre en la nube como parte de cada build. Ver
  **Compilación y Distribución → Conceptos**.

## Cuando un config plugin no cubre lo que necesitás

La mayoría de las capacidades nativas vienen como un **config plugin** de
Expo, oficial o de la comunidad: lo agregás al array `plugins` de
`app.config.ts` y `prebuild` lo integra al proyecto nativo generado por vos.
Antes de escribir algo propio, buscá uno en npm/GitHub (`<nombre del sdk> expo
plugin`, `expo-config-plugin-*`).

Si no existe ninguno — algunos SDKs de proveedores (verificación de
identidad/KYC, pagos, etc.) solo traen instrucciones de instalación nativa,
sin integración de Expo — la respuesta es un **config plugin local**, no
ejectar a bare ni commitear `ios/`/`android/`. Ver **Arquitectura del Proyecto
→ SDKs Nativos Sin Plugin de Expo**.

{: .note-title }
Nota

{: .note }
**¿Te sumaste a un proyecto que ya tiene `ios/`/`android/` commiteados?** Eso
es un setup bare heredado, no algo para "arreglar" como efecto secundario de
otra tarea. Migrar un proyecto existente a managed es un cambio planeado
aparte — plantealo por separado en vez de hacerlo de paso.
