---
title: Continuous Integration
parent: Code Quality
nav_order: 5
---

# Continuous Integration

Every pull request (and every push to a main branch) runs the same **quality
gate**: install → lint → format check → type-check → test. If it's red, it
doesn't merge.

Here it is as a Bitbucket Pipeline; the exact same steps map cleanly to GitHub
Actions or any CI:

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

{: .note }
This gate checks quality; it doesn't build the app. You can wire **EAS
build/submit** into CI when you have cloud build credits — otherwise builds are
produced locally, which is exactly what **Build & Distribution** covers next.
