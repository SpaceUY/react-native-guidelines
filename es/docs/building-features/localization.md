---
title: Localización (i18n)
parent: Desarrollo de Funcionalidades
nav_order: 7
---

# Localización (i18n)

Stack recomendado: **`i18next` + `react-i18next`** para las traducciones,
con **`expo-localization`** para leer el locale del dispositivo.

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

Convenciones:

- **Organizá las keys por namespace de feature** (`orders.title`,
  `auth.login.cta`) para que se mantengan ordenadas a medida que la app
  crece.
- **Usá keys, no strings en inglés, como ids.** `t("orders.empty")` es
  estable; `t("You have no orders")` se rompe apenas cambia el copy.

{: .note-title }
Nota

{: .note }
**¿App de un solo idioma?** Igual pasá el copy por `t()` con un único bloque
de `resources`. Cuesta casi nada ahora y hace que agregar un segundo idioma
después sea sumar otro archivo JSON — no salir a cazar strings hardcodeados
por toda la app.
