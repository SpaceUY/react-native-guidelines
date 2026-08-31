---
title: Registros de Decisiones de Arquitectura
parent: Arquitectura del Proyecto
nav_order: 3
---

# Registros de Decisiones de Arquitectura

Un **ADR** es una nota corta y durable que registra *por qué* tomamos una
decisión significativa — el contexto, la elección y sus consecuencias. Meses
después, cuando alguien pregunta "¿por qué lo hicimos así?", la respuesta
está escrita en vez de perdida en un hilo de Slack.

## Dónde viven

```
docs/decisions/<AREA-NN>-<slug>.md
# ej. docs/decisions/NAV-01-navigation-library.md
```

Usá un prefijo de área corto (`NAV`, `STYLE`, `SETUP`, …) y un número
correlativo para que las decisiones relacionadas queden ordenadas juntas.

## Plantilla

```markdown
# NAV-01 — Librería de navegación

- Estado: Aceptada (2026-08-15) — reemplaza a: ninguna
- Contexto: <el problema y las fuerzas en juego>
- Decisión: <qué elegimos>
- Consecuencias: <trade-offs, seguimientos, qué queda descartado>
```

## Cuándo escribir una

Escribí un ADR cada vez que una decisión sea cara de revertir o pueda
desconcertar a un lector futuro: elegir una librería de navegación, un
enfoque de estilos, una convención de carpetas, una estrategia de
build/distribución.

{: .note-title }
Nota

{: .note }
Las decisiones pueden cambiar. Cuando eso pase, **escribí un ADR nuevo (o
actualizá el estado) que reemplace al anterior** — no borres el historial. El
rastro de "elegimos X, después lo revertimos a Y porque Z" es exactamente lo
que hace valiosos a los ADRs.
