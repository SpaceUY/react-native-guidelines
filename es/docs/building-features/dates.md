---
title: Fechas
parent: Desarrollo de Funcionalidades
nav_order: 6
---

# Fechas

Usá **`date-fns`**. Es tree-shakeable (importás solo las funciones que usás)
y no le hace monkey-patch a los objetos globales como hacen algunas
librerías de fechas.

```ts
import { format, parseISO, formatDistanceToNow } from "date-fns";

format(parseISO(iso), "dd/MM/yyyy HH:mm");            // 31/08/2026 14:05
formatDistanceToNow(parseISO(iso), { addSuffix: true }); // "hace unas 2 horas"
```

{: .note-title }
Nota

{: .note }
**Guardá y transportá strings ISO en UTC** (ej. `2026-08-31T14:05:00Z`) y
formateá solo en el borde — en la UI, para el locale del usuario. Mantener
todo en UTC hasta el último momento evita toda una categoría de bugs de
desfasaje de zona horaria.
