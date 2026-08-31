---
title: Linting y Formateo
parent: Calidad de Código
nav_order: 2
---

# Linting y Formateo

**ESLint** detecta bugs; **Prettier** se encarga del formateo. Evitamos que
peleen entre sí corriendo Prettier *a través de* ESLint y poniendo
`eslint-config-prettier` al final.

```js
// eslint.config.js  (flat config)
const expo = require("eslint-config-expo/flat");

module.exports = [
  ...expo,
  { rules: { "prettier/prettier": "warn" } },
];
```

```json
// .prettierrc.json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`prettier-plugin-tailwindcss` ordena tus utilidades de `className`
automáticamente en un orden canónico.

## Comandos

```bash
pnpm lint            # expo lint
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .   (esto es lo que corre el CI)
```
