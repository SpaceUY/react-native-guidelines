---
title: Variables de Entorno
parent: Primeros Pasos
nav_order: 3
---

# Variables de Entorno

Copiá la plantilla y completá los valores:

```bash
cp .env.example .env
```

## El prefijo `EXPO_PUBLIC_`

Cualquier variable con el prefijo `EXPO_PUBLIC_` se **inlinea dentro del bundle
de la app** en tiempo de build y se puede leer en runtime a través de
`process.env`:

```ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

{: .warning-title }
Advertencia

{: .warning }
Los valores `EXPO_PUBLIC_*` viajan **dentro de la app del cliente** — cualquiera
puede leerlos. Nunca pongas ahí secretos (API keys con permisos de escritura,
tokens, contraseñas). Esos van en el backend o en los secrets de EAS. Ver
**Entorno y Configuración → Secretos**.

## Qué se commitea

- `.env` — tus valores locales. **Ignorado por git. Nunca lo commitees.**
- `.env.example` — la plantilla con valores vacíos o de ejemplo. **Se
  commitea**, así todos saben qué variables necesita un proyecto.

Para el panorama completo — configuración de runtime vs. build-time y cómo
`APP_ENV` selecciona un ambiente — ver **Entorno y Configuración**.
