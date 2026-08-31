---
title: Claude
nav_order: 10
---

# Claude

Esta guía funciona mejor cuando tu asistente de IA (Claude Code, o cualquier
herramienta basada en LLM) la trata como fuente de verdad en vez de adivinar
convenciones desde cero en cada sesión. Esta página son instrucciones *para
Claude* — copialas en proyectos nuevos para que el asistente sea productivo
desde el día uno y se mantenga consistente con el resto de la organización.

## Prompt de arranque

Pegá esto en una sesión nueva de Claude Code al empezar o sumarte a un
proyecto de React Native + Expo:

```
Este proyecto sigue las SpaceDev React Native Guidelines:
https://spaceuy.github.io/react-native-guidelines/

Antes de hacer cualquier otra cosa:
1. Leé CLAUDE.md en este repo (si existe) — lista el stack específico de
   este proyecto, los comandos, y cualquier desviación de la guía.
2. Leé docs/decisions/ (si existe) para ver los ADRs — decisiones ya
   tomadas y por qué.
3. Cuando la guía y el código real del repo no coincidan, seguí al repo —
   y después marcá el conflicto en vez de "arreglarlo" en silencio.
4. Si este es un proyecto nuevo y CLAUDE.md todavía no existe, creá uno
   (ver Claude → Plantilla de CLAUDE.md del proyecto en la guía) una vez
   que hayas aprendido lo suficiente del stack como para completarlo con
   precisión.
```

## Plantilla de CLAUDE.md del proyecto

Todo proyecto debería tener un `CLAUDE.md` en la raíz del repo. Mantenelo
corto y que apunte a esta guía en vez de duplicarla — un `CLAUDE.md` que
repite la guía queda desactualizado apenas la guía cambia.

```markdown
# CLAUDE.md

Este proyecto sigue las SpaceDev React Native Guidelines:
https://spaceuy.github.io/react-native-guidelines/

## Stack
- Expo SDK <versión>, Expo Router, TypeScript
- Estado/datos: TanStack Query [+ <librería de estado de cliente, si aplica>]
- Estilos: NativeWind
- Formularios: React Hook Form + Zod

## Comandos
- `pnpm start` — correr el servidor de desarrollo
- `pnpm test` — tests unitarios
- `pnpm lint` / `pnpm typecheck`
- `eas build --profile preview` — build interno de prueba

## Desviaciones de la guía
- <ej. "Usa Redux Toolkit en vez de Zustand por razón X — ver ADR STATE-01">

## Notas específicas del proyecto
- <cualquier cosa que un ingeniero nuevo o Claude tendría que redescubrir>
```

{: .tip-title }
Consejo

{: .tip }
Si la lista de desviaciones está vacía, decilo explícitamente (`Ninguna —
seguir la guía tal cual.`). Eso es una señal en la que Claude puede confiar,
no una omisión que tenga que verificar dos veces.

## Qué debería hacer Claude primero, en cada proyecto

1. Leer `CLAUDE.md`, y después revisar por arriba `package.json` y la
   estructura de carpetas — confirmar que el stack coincide con lo
   declarado antes de asumir nada.
2. Revisar `docs/decisions/` en busca de ADRs (ver **Registros de
   Decisiones de Arquitectura**) — tienen prioridad sobre los valores por
   defecto de la guía para ese proyecto.
3. Priorizar los patrones existentes por sobre los ejemplos de la guía
   cuando ambos no coinciden en un codebase que ya funciona — la
   consistencia con el código que lo rodea gana por sobre lo "correcto de
   manual".
4. Ante algo genuinamente ambiguo (una convención faltante, la elección de
   una librería nueva), preguntar — no inventar una convención que la
   próxima sesión, o el próximo ingeniero, tenga después que reconstruir a
   la inversa.

## Qué persistir, y dónde

No todo lo que Claude aprende va en el mismo lugar. Usá el lugar más
durable y más compartido que corresponda:

| Qué | Dónde | Por qué |
| --- | --- | --- |
| Stack, comandos, desviaciones conocidas | `CLAUDE.md` (repo) | Compartido con todo el equipo, versionado junto con el código. |
| Una decisión significativa y cara de revertir | `docs/decisions/*.md` (ADR) | Necesita el *por qué*, no solo el *qué* — ver **Registros de Decisiones de Arquitectura**. |
| Un dato puntual de este codebase (ej. "la carpeta `legacy/` no tiene mantenimiento, no la toques") | `CLAUDE.md`, "Notas específicas del proyecto" | Cualquiera que trabaje acá lo necesita, no solo Claude. |
| Tus preferencias personales de trabajo (nivel de detalle, cuándo preguntar vs. actuar) | La memoria propia de Claude | Te sigue a *vos* entre proyectos; no le importa a tus compañeros ni al CI. |

{: .warning-title }
Advertencia

{: .warning }
Nunca persistas secretos, API keys ni credenciales en ningún lugar donde
Claude escriba — `CLAUDE.md`, los ADRs y la memoria son todas cosas que una
persona u otra herramienta puede leer después. Ver **Entorno y
Configuración → Secretos**.

## Tips de eficiencia

- Apuntá a Claude a una página específica (ej. "seguí Desarrollo de
  Funcionalidades → Navegación") en vez de a toda la guía cuando la tarea
  está acotada — menos contexto para cargar, menos chance de que elija la
  sección equivocada.
- Mantené `CLAUDE.md` como un puntero, no como una copia. Si empieza a
  re-explicar la estructura de carpetas o las reglas de nombres que ya
  están en esta guía, borrá esa parte y enlazá en su lugar.
- Cuando la guía cambia, no hay nada que migrar en los `CLAUDE.md`
  existentes a menos que realmente se hayan desviado — ese es justamente el
  sentido de enlazar en vez de copiar.
