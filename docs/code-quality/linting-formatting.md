---
title: Linting & Formatting
parent: Code Quality
nav_order: 2
---

# Linting & Formatting

**ESLint** catches bugs; **Prettier** owns formatting. We keep them from fighting
by running Prettier *through* ESLint and putting `eslint-config-prettier` last.

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

`prettier-plugin-tailwindcss` sorts your `className` utilities into a canonical
order automatically.

## Commands

```bash
pnpm lint            # expo lint
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .   (this is what CI runs)
```
