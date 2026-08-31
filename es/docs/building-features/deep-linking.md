---
title: Deep Linking
parent: Desarrollo de Funcionalidades
nav_order: 8
---

# Deep Linking

Un deep link abre una screen específica desde afuera de la app — un email,
una notificación, un navegador. Con Expo Router, los links mapean a rutas
**automáticamente**: un link a `/orders/123` abre `app/orders/[id].tsx`. En
general solo tenés que configurar el scheme.

## Scheme + universal links

- Un **scheme** custom (`myapp://orders/123`) siempre funciona y es genial
  para testear.
- **Universal / App Links** (`https://myapp.com/orders/123`) abren la app
  desde una URL web real y necesitan archivos de asociación de plataforma
  (`apple-app-site-association` de Apple, `assetlinks.json` de Android).

{: .note-title }
Nota

{: .note }
Dale a cada ambiente su **propio scheme y host** para que un build de dev y
un build de tienda no compitan por los mismos links. Ver **Entorno y
Configuración → Configuración en Tiempo de Compilación** para ver cómo
`APP_ENV` configura esto por variante.

## Probar un link

```bash
npx uri-scheme open "myapp://orders/123" --ios
npx uri-scheme open "myapp://orders/123" --android
```
