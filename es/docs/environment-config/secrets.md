---
title: Secretos
parent: Entorno y Configuración
nav_order: 3
---

# Secretos

La regla es simple: **los secretos nunca llegan al cliente.**

- `.env` guarda tus valores locales y está **ignorado por git** — nunca lo
  commitees.
- `.env.example` está **commiteado** como plantilla, con valores vacíos o de
  ejemplo.
- Un secreto exclusivo del servidor **no debe** usar el prefijo
  `EXPO_PUBLIC_` (ese prefijo hace que el valor viaje dentro de la app).
  Ponelo en un **secret de EAS** para los builds, o mantenelo enteramente en
  el backend.

## Dónde vive cada valor

| Tipo de valor | Dónde vive |
| --- | --- |
| Configuración pública (URL base de la API, client id público) | `EXPO_PUBLIC_*` en `.env` |
| Secreto de build-time (firma, tokens de servicio para CI) | Secret de EAS |
| Secreto de servidor (API keys privadas, credenciales de DB) | Solo backend — nunca en la app |

{: .warning-title }
Advertencia

{: .warning }
Si un secreto alguna vez termina en un archivo commiteado o en una variable
`EXPO_PUBLIC_*`, tratalo como **filtrado**: rotalo. Sacarlo en un commit
posterior no ayuda — ya quedó en el historial de git y en los bundles ya
distribuidos.
