---
title: Variables de Entorno
parent: Primeros Pasos
nav_order: 4
---

# Variables de Entorno

Mantenemos **un archivo de entorno por ambiente**, cada uno ignorado por git,
más una única plantilla commiteada:

| Archivo | Ambiente | En git |
| --- | --- | --- |
| `.env.dev` | development | ignorado |
| `.env.preview` | preview | ignorado |
| `.env.prod` | production | ignorado |
| `.env.example` | plantilla (valores dummy) | commiteado |

{: .note-title }
Nota

{: .note }
Si venís de otro stack, **`preview` es nuestro "staging"** — el ambiente
interno, pre-producción. Lo llamamos `preview` para que coincida con el build
profile `preview` de EAS de Expo y el valor `APP_ENV=preview`.

Los **nombres** de las variables son iguales entre ambientes — solo cambian los
valores — así que un único `.env.example` los documenta a todos. Copialo en
cada archivo de ambiente y completá los valores reales:

```bash
cp .env.example .env.dev       # repetí para .env.preview y .env.prod
```

## Cargar el archivo correcto

Elegí el archivo por ambiente con
[`env-cmd`](https://www.npmjs.com/package/env-cmd) (una devDependency) en los
scripts de tu `package.json`:

```json
"scripts": {
  "start":         "env-cmd -f .env.dev expo start",
  "start:preview": "env-cmd -f .env.preview expo start",
  "start:prod":    "env-cmd -f .env.prod expo start"
}
```

Dale a cada archivo su propio `APP_ENV` (`development` / `preview` /
`production`) así los valores de runtime que carga `env-cmd` y la config de
build-time que elige el `app.config.ts` dinámico quedan en sync desde una sola
fuente. (`dotenv-cli` funciona igual si ya lo usás.) En los builds de EAS los
valores siguen viniendo del bloque `env` del perfil correspondiente en
`eas.json` — ver **Configuración en Tiempo de Compilación**.

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

- `.env.dev`, `.env.preview`, `.env.prod` — tus valores reales por ambiente.
  **Ignorados por git. Nunca los commitees.**
- `.env.example` — la plantilla con valores vacíos o de ejemplo. **Se
  commitea**, así todos saben qué variables necesita un proyecto.

## Por qué un archivo por ambiente

- **Aislamiento** — una wallet o credencial de dev/test en `.env.dev` nunca
  puede terminar empaquetada en un build de preview o de producción.
- **Sin herramientas bloqueadas** — las wallets y keys reales viven solo en
  archivos ignorados por git, nunca en contenido trackeado, así Claude Code y
  los scanners de secretos no se bloquean al detectar una key.

Para el panorama completo — configuración de runtime vs. build-time y cómo
`APP_ENV` selecciona un ambiente — ver **Entorno y Configuración**.
