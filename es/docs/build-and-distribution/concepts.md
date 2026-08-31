---
title: Conceptos
parent: Compilación y Distribución
nav_order: 1
---

# Conceptos

## Build profiles de EAS

Los builds se describen con **profiles** en `eas.json`. Tres importan:

| Profile | Distribución | Para |
| --- | --- | --- |
| `development` | interno | Dev client, desarrollo local |
| `preview` | interno → APK / ad-hoc | **Testers.** Setea `APP_ENV=preview` |
| `production` | tienda | **Las tiendas.** Firma de tienda |

```json
{
  "cli": { "version": ">= 14.4.1", "appVersionSource": "remote" },
  "build": {
    "preview": {
      "distribution": "internal",
      "autoIncrement": true,
      "env": { "APP_ENV": "preview" }
    }
  }
}
```

## Builds locales

Compilamos **localmente** (el flag `--local`) para no gastar créditos de la
nube de EAS. El `.apk` / `.ipa` / `.aab` compilado termina en `./build/` en
tu máquina.

## La regla de oro

{: .important-title }
Importante

{: .important }
Un build **interno (ad-hoc)** no se puede subir a la tienda, y un build de
**tienda** no se puede instalar directamente en un teléfono. Están firmados
de forma distinta y **no son intercambiables**. Confundirlos es la forma
número uno de perder tiempo — mantené los dos caminos separados en tu
cabeza.

## Firebase App Distribution ≠ las tiendas

Firebase App Distribution es un canal gratuito que **hostea un build y les
manda por mail un link a los testers**. Registrar una "app" ahí **no** crea
ningún listado en App Store o Play — es puramente una vía de entrega, que es
justo por qué la podemos automatizar desde la línea de comandos.

## Bundle id

Un build interno que usa el bundle id de **producción** va a **reemplazar**
la app de tienda en un dispositivo (no pueden coexistir). En Android, si
está instalada una versión de tienda firmada de forma distinta, el tester
tiene que desinstalarla primero.
