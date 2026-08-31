---
title: Dates
parent: Building Features
nav_order: 6
---

# Dates

Use **`date-fns`**. It's tree-shakeable (you import only the functions you use)
and doesn't monkey-patch global objects the way some date libraries do.

```ts
import { format, parseISO, formatDistanceToNow } from "date-fns";

format(parseISO(iso), "dd/MM/yyyy HH:mm");            // 31/08/2026 14:05
formatDistanceToNow(parseISO(iso), { addSuffix: true }); // "about 2 hours ago"
```

{: .note }
**Store and transport UTC ISO strings** (e.g. `2026-08-31T14:05:00Z`) and format
only at the edge — in the UI, for the user's locale. Keeping everything UTC until
the last moment avoids a whole category of off-by-a-timezone bugs.
