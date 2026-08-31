---
title: Localization (i18n)
parent: Building Features
nav_order: 7
---

# Localization (i18n)

Recommended stack: **`i18next` + `react-i18next`** for translations, with
**`expo-localization`** to read the device locale.

```ts
// src/shared/config/i18n.ts
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@shared/config/locales/en.json";
import es from "@shared/config/locales/es.json";

i18n.use(initReactI18next).init({
  lng: Localization.getLocales()[0]?.languageCode ?? "en",
  fallbackLng: "en",
  resources: { en: { translation: en }, es: { translation: es } },
  interpolation: { escapeValue: false },
});

export default i18n;
```

```tsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
<Text>{t("orders.title")}</Text>;
```

Conventions:

- **Namespace keys by feature** (`orders.title`, `auth.login.cta`) so they stay
  organized as the app grows.
- **Use keys, not English strings, as ids.** `t("orders.empty")` is stable;
  `t("You have no orders")` breaks the moment the copy changes.

{: .note }
**Single-language app?** Still route copy through `t()` with one `resources`
block. It costs almost nothing now and means adding a second language later is
dropping in another JSON file — not hunting hardcoded strings across the app.
