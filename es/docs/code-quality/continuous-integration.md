---
title: Integración Continua
parent: Calidad de Código
nav_order: 5
---

# Integración Continua

Cada pull request (y cada push a una rama principal) corre el mismo
**quality gate**: install → lint → format check → type-check → test. Si
está en rojo, no mergea.

Acá está como un Bitbucket Pipeline; los mismos pasos exactos mapean
limpiamente a GitHub Actions o cualquier CI:

```yaml
image: node:20

pipelines:
  pull-requests:
    "**":
      - step:
          name: lint-typecheck-test
          script:
            - corepack enable
            - pnpm install --frozen-lockfile
            - pnpm run lint
            - pnpm run format:check
            - npx tsc --noEmit
            - pnpm test
  branches:
    "{main,dev}":
      - step:
          name: lint-typecheck-test
          script:
            - corepack enable
            - pnpm install --frozen-lockfile
            - pnpm run lint
            - pnpm run format:check
            - npx tsc --noEmit
            - pnpm test
```

{: .note-title }
Nota

{: .note }
Este gate chequea calidad; no compila la app. Podés conectar **EAS
build/submit** al CI cuando tengas créditos de build en la nube — si no,
los builds se generan localmente, que es justo lo que cubre **Compilación y
Distribución** a continuación.
