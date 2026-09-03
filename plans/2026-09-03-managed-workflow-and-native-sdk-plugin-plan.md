# Managed Workflow Default + Native SDK Config Plugin Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new bilingual guideline pages — **Managed Workflow (CNG)** (declares managed/CNG as the team default, no committed `ios/`/`android/`) and **Native SDKs Without an Expo Plugin** (documents the local config-plugin pattern, Sumsub/T5 as the motivating case) — and align the existing "either is fine" native-folders note, `.gitignore` reference, and glossary with the new default.

**Architecture:** Pure documentation change to a Jekyll (`just-the-docs`) site. Two new English pages (`docs/getting-started/managed-workflow.md`, `docs/architecture/native-sdks-without-plugins.md`) plus their exact Spanish mirrors under `es/docs/`, then edits to `create-or-clone.md` (EN+ES), nav-order renumbering for two sibling pages (EN+ES), and three new glossary rows in `reference.md` (EN+ES). No app code, no theme changes. "Tests" are `grep` assertions on file content plus a final `bundle exec jekyll build`.

**Tech Stack:** Jekyll 4.3, `just-the-docs` 0.10.1 (pinned gem), kramdown, `jekyll-seo-tag`. Ruby is Homebrew's (`/opt/homebrew/opt/ruby/bin`), not system Ruby 2.6.

## Global Constraints

- English and Spanish content stay in sync, file for file.
- Internal cross-references inside **Getting Started** and **Project Architecture** are plain bold text (e.g. `**Getting Started → Managed Workflow (CNG)**`), not hyperlinks — this matches the existing convention in those two folders (only `Build & Distribution` uses real `.html` links between siblings; do not introduce links where the surrounding folder doesn't already use them).
- EN callouts use a single IAL + bold lead: `{: .note }` / `{: .warning }` on its own line, followed by a paragraph that may start with a `**Bold lead:**`.
- ES callouts use the manual-title pattern already used in the `es/` tree: `{: .note-title }` + a literal title line (`Nota` / `Advertencia`), a blank line, then `{: .note }` / `{: .warning }` + the body.
- Keep Expo/technical loanwords untranslated in Spanish prose (`workflow`, `plugin`, `prebuild`, `feature`, `screen`), matching the existing `es/` tree — translate the surrounding prose only, per the existing `create-or-clone.md` ES mirror.
- **No fabricated Sumsub-specific native values.** The `Native SDKs Without an Expo Plugin` page (EN+ES) must not contain real/specific Info.plist key names, Android permission strings, Gradle coordinates, or SDK version numbers. Every mod body in the example is an empty schematic placeholder with a comment pointing to "the SDK's official native install guide."
- Never write secrets, API keys, or credentials into any page.
- Nav ordering inside `Getting Started` and inside `Project Architecture` stays contiguous with no duplicate `nav_order` values once all tasks in this plan are complete (a temporary duplicate between Tasks 1–3 is expected and resolved by Task 3).
- Jekyll build command must prefix PATH with Homebrew Ruby: `export PATH="/opt/homebrew/opt/ruby/bin:$PATH"`.

---

### Task 1: Create the English "Managed Workflow (CNG)" page

**Files:**
- Create: `docs/getting-started/managed-workflow.md`

**Interfaces:**
- Produces: a page at `/docs/getting-started/managed-workflow.html` with `nav_order: 3`, referenced by Task 4's edit to `create-or-clone.md` and by Task 6's `native-sdks-without-plugins.md`. Its own text references **Native SDKs Without an Expo Plugin** (created in Task 6) as plain bold text, not a link.

- [ ] **Step 1: Confirm the target file does not exist yet (pre-check)**

Run: `ls docs/getting-started/managed-workflow.md 2>&1`
Expected: `No such file or directory`.

- [ ] **Step 2: Create the English page**

Write `docs/getting-started/managed-workflow.md` with exactly:

````markdown
---
title: Managed Workflow (CNG)
parent: Getting Started
nav_order: 3
---

# Managed Workflow (CNG)

The team default is Expo's **managed workflow** with **Continuous Native
Generation (CNG)**: the `ios/` and `android/` folders are never committed.
They're generated on demand — locally with `npx expo prebuild`, or
transparently by **EAS Build** in the cloud — from `app.config.ts` and the
packages you install.

{: .note }
**Why not "either is fine"?** Committed native folders turn every native
config change into an unreadable diff, create a second source of truth
(hand-edited native files vs. `app.config.ts`) that silently drifts, and make
onboarding depend on which workflow a given clone happens to be in. CNG keeps
exactly one source of truth.

## Day to day

- Bundle IDs, permissions, deep-link schemes, and other native identifiers are
  changed in `app.config.ts` — see **Environment & Configuration → Build-Time
  Config** — never by hand in Xcode or Android Studio.
- Need to inspect or run a native project locally? Run `npx expo prebuild
  --clean` to (re)generate `ios/` and `android/`. Treat the result as
  **disposable build output**: never commit it, and delete/regenerate it if it
  ever looks like it's drifted from your config.
- Store and internal builds never require anyone to run `prebuild` by hand —
  **EAS Build** runs it in the cloud as part of every build. See **Build &
  Distribution → Concepts**.

## When a config plugin doesn't cover what you need

Most native capabilities ship as an official or community Expo **config
plugin**: add it to `app.config.ts`'s `plugins` array and `prebuild` wires it
into the generated native project for you. Before writing anything custom,
search npm/GitHub for one (`<sdk name> expo plugin`, `expo-config-plugin-*`).

If none exists — some vendor SDKs (KYC/identity verification, payments, etc.)
only ship native install instructions, no Expo integration — the answer is a
**local config plugin**, not ejecting to bare and not committing
`ios/`/`android/`. See **Project Architecture → Native SDKs Without an Expo
Plugin**.

{: .note }
**Joining a project that already has `ios/`/`android/` committed?** That's an
inherited bare setup, not something to "fix" as a side effect of unrelated
work. Migrating an existing project to managed is its own planned change —
raise it separately instead of doing it inline.
````

- [ ] **Step 3: Verify the page has the required structure**

Run: `grep -n "nav_order: 3\|## Day to day\|## When a config plugin doesn't cover what you need\|Native SDKs Without an Expo Plugin" docs/getting-started/managed-workflow.md`
Expected: matches for `nav_order: 3`, both `##` headings, and the reference to the Task 6 page.

- [ ] **Step 4: Verify no secrets leaked into the page**

Run: `grep -niE "api.key|-----BEGIN|password|secret[\"' :=]" docs/getting-started/managed-workflow.md`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add docs/getting-started/managed-workflow.md
git commit -m "docs: add Managed Workflow (CNG) page declaring the team default (EN)"
```

---

### Task 2: Create the Spanish "Workflow Managed (CNG)" mirror

**Files:**
- Create: `es/docs/getting-started/managed-workflow.md`

**Interfaces:**
- Consumes: the EN page from Task 1 as the structure to mirror, section for section.
- Produces: a page at `/es/docs/getting-started/managed-workflow.html` with `nav_order: 3`, referenced by Task 5's edit to the ES `create-or-clone.md`.

- [ ] **Step 1: Confirm the target file does not exist yet (pre-check)**

Run: `ls es/docs/getting-started/managed-workflow.md 2>&1`
Expected: `No such file or directory`.

- [ ] **Step 2: Create the Spanish page**

Write `es/docs/getting-started/managed-workflow.md` with exactly:

````markdown
---
title: Workflow Managed (CNG)
parent: Primeros Pasos
nav_order: 3
---

# Workflow Managed (CNG)

El default del equipo es el **workflow managed** de Expo con **Continuous
Native Generation (CNG)**: las carpetas `ios/` y `android/` nunca se
commitean. Se generan a demanda — local con `npx expo prebuild`, o de forma
transparente en **EAS Build** — a partir de `app.config.ts` y los paquetes que
instalás.

{: .note-title }
Nota

{: .note }
**¿Por qué no "cualquiera de las dos está bien"?** Commitear las carpetas
nativas convierte cada cambio de configuración nativa en un diff ilegible,
crea una segunda fuente de verdad (archivos nativos editados a mano vs.
`app.config.ts`) que se desalinea en silencio, y hace que el onboarding
dependa de en qué workflow está el clon de cada uno. CNG mantiene una única
fuente de verdad.

## El día a día

- Los bundle IDs, permisos, schemes de deep-link y demás identificadores
  nativos se cambian en `app.config.ts` — ver **Entorno y Configuración →
  Configuración en Tiempo de Compilación** — nunca a mano en Xcode o Android
  Studio.
- ¿Necesitás inspeccionar o correr un proyecto nativo local? Corré `npx expo
  prebuild --clean` para (re)generar `ios/` y `android/`. Tratá el resultado
  como **output de build descartable**: nunca lo commitees, y borralo o
  regeneralo si alguna vez parece desalineado con tu configuración.
- Los builds de tienda e internos nunca requieren que nadie corra `prebuild` a
  mano — **EAS Build** lo corre en la nube como parte de cada build. Ver
  **Compilación y Distribución → Conceptos**.

## Cuando un config plugin no cubre lo que necesitás

La mayoría de las capacidades nativas vienen como un **config plugin** de
Expo, oficial o de la comunidad: lo agregás al array `plugins` de
`app.config.ts` y `prebuild` lo integra al proyecto nativo generado por vos.
Antes de escribir algo propio, buscá uno en npm/GitHub (`<nombre del sdk> expo
plugin`, `expo-config-plugin-*`).

Si no existe ninguno — algunos SDKs de proveedores (verificación de
identidad/KYC, pagos, etc.) solo traen instrucciones de instalación nativa,
sin integración de Expo — la respuesta es un **config plugin local**, no
ejectar a bare ni commitear `ios/`/`android/`. Ver **Arquitectura del Proyecto
→ SDKs Nativos Sin Plugin de Expo**.

{: .note-title }
Nota

{: .note }
**¿Te sumaste a un proyecto que ya tiene `ios/`/`android/` commiteados?** Eso
es un setup bare heredado, no algo para "arreglar" como efecto secundario de
otra tarea. Migrar un proyecto existente a managed es un cambio planeado
aparte — plantealo por separado en vez de hacerlo de paso.
````

- [ ] **Step 3: Verify the Spanish page mirrors the English structure**

Run: `grep -n "nav_order: 3\|## El día a día\|## Cuando un config plugin no cubre lo que necesitás\|SDKs Nativos Sin Plugin de Expo" es/docs/getting-started/managed-workflow.md`
Expected: matches for `nav_order: 3`, both `##` headings, and the reference to the Task 7 page.

- [ ] **Step 4: Verify no secrets leaked into the page**

Run: `grep -niE "api.key|-----BEGIN|password|secret[\"' :=]" es/docs/getting-started/managed-workflow.md`
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add es/docs/getting-started/managed-workflow.md
git commit -m "docs: add Managed Workflow (CNG) page (ES mirror)"
```

---

### Task 3: Renumber Environment Variables and Running the App (EN + ES)

**Files:**
- Modify: `docs/getting-started/environment-variables.md:3` (`nav_order: 3` → `4`)
- Modify: `docs/getting-started/running-the-app.md:3` (`nav_order: 4` → `5`)
- Modify: `es/docs/getting-started/environment-variables.md:3` (`nav_order: 3` → `4`)
- Modify: `es/docs/getting-started/running-the-app.md:3` (`nav_order: 4` → `5`)

**Interfaces:**
- Consumes: the `nav_order: 3` pages created in Tasks 1–2.
- Produces: a Getting Started nav ordered prerequisites(1), create-or-clone(2), managed-workflow(3), environment-variables(4), running-the-app(5), in both languages.

- [ ] **Step 1: Renumber Environment Variables (EN + ES)**

Run: `sed -i '' 's/^nav_order: 3$/nav_order: 4/' docs/getting-started/environment-variables.md es/docs/getting-started/environment-variables.md`

- [ ] **Step 2: Renumber Running the App (EN + ES)**

Run: `sed -i '' 's/^nav_order: 4$/nav_order: 5/' docs/getting-started/running-the-app.md es/docs/getting-started/running-the-app.md`

- [ ] **Step 3: Verify the nav_order values are now contiguous with no duplicates**

Run: `for f in docs/getting-started/*.md es/docs/getting-started/*.md; do grep -H nav_order "$f"; done | sort -t: -k1`
Expected: within each language folder, `nav_order` reads 1 (prerequisites), 2 (create-or-clone), 3 (managed-workflow), 4 (environment-variables), 5 (running-the-app), with no duplicates.

- [ ] **Step 4: Commit**

```bash
git add docs/getting-started/environment-variables.md docs/getting-started/running-the-app.md es/docs/getting-started/environment-variables.md es/docs/getting-started/running-the-app.md
git commit -m "docs: renumber Getting Started nav to fit Managed Workflow page (EN+ES)"
```

---

### Task 4: Align the English "A note on native folders" section and `.gitignore` reference

**Files:**
- Modify: `docs/getting-started/create-or-clone.md`

**Interfaces:**
- Consumes: the `managed-workflow.html` page from Task 1 (referenced as plain bold text, not a link, per the Global Constraints).
- Produces: an updated page whose native-folders note, `.gitignore` block, and trailing notes all declare the managed/CNG default instead of "either is fine."

- [ ] **Step 1: Replace the native-folders note**

In `docs/getting-started/create-or-clone.md`, find this exact block:

```markdown
## A note on native folders

{: .note }
Some projects commit the `ios/` and `android/` folders (the "bare" workflow);
others generate them on demand with `npx expo prebuild`. Either is fine — just
know which one you're in. The **Environment & Configuration** section explains
how a dynamic `app.config.ts` drives the native identifiers per environment.
```

Replace it with:

```markdown
## A note on native folders

{: .note }
The team default is the **managed workflow with Continuous Native Generation
(CNG)**: the `ios/` and `android/` folders are never committed. They're
generated on demand — locally with `npx expo prebuild`, or transparently by
EAS Build — from `app.config.ts` and your installed packages. See **Getting
Started → Managed Workflow (CNG)** for the full rationale and what to do when
a native SDK needs more than a config plugin provides.
```

- [ ] **Step 2: Replace the `.gitignore` code block**

In the same file, find this exact fenced block:

````markdown
```gitignore
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native build outputs — generated, never commit
ios/build/
android/build/
android/app/build/
android/.gradle/
android/.cxx/
*.apk
*.aab
*.ipa
*.app
*.dSYM
*.dSYM.zip

# CocoaPods (restored by `pod install`)
ios/Pods/
ios/.xcode.env.local

# Android local machine config
android/local.properties

# Metro / bundler
.metro-health-check*
*.jsbundle

# Signing material & secrets — must never be committed
*.keystore
!debug.keystore
*.p8
*.p12
*.key
*.mobileprovision
.env
.env.*
!.env.example

# Logs & debug output
npm-debug.*
yarn-debug.*
yarn-error.*
*.log

# TypeScript
*.tsbuildinfo

# IDE / OS noise
.DS_Store
.vscode/
.idea/
*.pem
```
````

Replace it with:

````markdown
```gitignore
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native folders — generated by CNG, never commit (see Managed Workflow)
/ios
/android

# Compiled app binaries — generated on every build
*.apk
*.aab
*.ipa
*.app
*.dSYM
*.dSYM.zip

# Metro / bundler
.metro-health-check*
*.jsbundle

# Signing material & secrets — must never be committed
*.p8
*.p12
*.key
*.mobileprovision
.env
.env.*
!.env.example

# Logs & debug output
npm-debug.*
yarn-debug.*
yarn-error.*
*.log

# TypeScript
*.tsbuildinfo

# IDE / OS noise
.DS_Store
.vscode/
.idea/
*.pem
```
````

- [ ] **Step 3: Replace the "notes on entries that trip people up" bullets**

In the same file, find this exact block:

```markdown
- **`!debug.keystore`** — the shared Android *debug* keystore is safe to commit
  so every developer gets the same debug signature. Your **release** keystore is
  a secret: keep it out of the repo (store it in EAS or a secrets manager).
- **The `.env.*` files** (`.env.dev`, `.env.preview`, `.env.prod`) are ignored;
  **`.env.example`** is committed. See **Environment Variables** and
  **Environment & Configuration → Secrets** for the full rule — and rotate
  anything that leaks into git history.
- **Firebase config** (`google-services.json`, `GoogleService-Info.plist`): if a
  project generates these per-environment at build time, ignore them; if it
  checks in a single non-secret config, commit it. Decide once per project and
  document it in the repo's `README`.
```

Replace it with:

```markdown
- **No Android debug keystore to commit.** Under the managed default, `android/`
  isn't committed at all, so there's no shared `debug.keystore` file to carve an
  exception for. Each machine (and EAS) uses its own debug signature; if a
  feature genuinely needs a shared debug SHA-1 (e.g. Google Sign-In), manage it
  as an EAS credential, not a committed file. Your **release** keystore is
  always a secret regardless of workflow: keep it out of the repo (store it in
  EAS or a secrets manager).
- **The `.env.*` files** (`.env.dev`, `.env.preview`, `.env.prod`) are ignored;
  **`.env.example`** is committed. See **Environment Variables** and
  **Environment & Configuration → Secrets** for the full rule — and rotate
  anything that leaks into git history.
- **Firebase config** (`google-services.json`, `GoogleService-Info.plist`): these
  can't live inside `ios/`/`android/` under the managed default (not committed),
  so point to them from outside — e.g. a root-level path referenced via
  `googleServicesFile` in `app.config.ts`, which a config plugin copies into the
  generated project at `prebuild` time. Whether that file itself is safe to
  commit (it's usually a non-secret per-project identifier) is a decision to
  make once per project and document in the repo's `README`.
```

- [ ] **Step 4: Replace the trailing "already tracked" note**

In the same file, find this exact block:

```markdown
{: .note }
If a build artifact is _already_ tracked, adding it to `.gitignore` won't remove
it — Git keeps ignoring changes only to *untracked* files. Stop tracking it with
`git rm -r --cached ios/build android/app/build` (adjust paths), then commit.
```

Replace it with:

```markdown
{: .note }
If `ios/`, `android/`, or a build artifact is _already_ tracked, adding it to
`.gitignore` won't remove it — Git keeps ignoring changes only to *untracked*
files. Stop tracking it with `git rm -r --cached ios android` (adjust paths for
a narrower cleanup), then commit.
```

- [ ] **Step 5: Verify the edits landed and old text is gone**

Run: `grep -c "Either is fine\|!debug.keystore\|ios/build/" docs/getting-started/create-or-clone.md`
Expected: `0`.

Run: `grep -n "Managed Workflow (CNG)\|^/ios$\|^/android$\|No Android debug keystore to commit\|git rm -r --cached ios android" docs/getting-started/create-or-clone.md`
Expected: four matches (the page reference, `/ios`, `/android`, the new bullet lead, and the new `git rm` command).

- [ ] **Step 6: Verify no secrets leaked into the page**

Run: `grep -niE "api.key|-----BEGIN|password|secret[\"' :=]" docs/getting-started/create-or-clone.md`
Expected: no matches (the words "secret" appear only inside "secrets manager" / "not a secret" prose — re-run with `-w` if the broad pattern above flags prose incidentally, and confirm by eye that no line contains an actual credential value).

- [ ] **Step 7: Commit**

```bash
git add docs/getting-started/create-or-clone.md
git commit -m "docs: align native-folders note and .gitignore with managed/CNG default (EN)"
```

---

### Task 5: Align the Spanish "Una nota sobre las carpetas nativas" section and `.gitignore` reference

**Files:**
- Modify: `es/docs/getting-started/create-or-clone.md`

**Interfaces:**
- Consumes: the `managed-workflow.html` ES page from Task 2 (referenced as plain bold text, not a link).
- Produces: the ES mirror of Task 4's changes, section for section.

- [ ] **Step 1: Replace the native-folders note**

In `es/docs/getting-started/create-or-clone.md`, find this exact block:

```markdown
## Una nota sobre las carpetas nativas

{: .note-title }
Nota

{: .note }
Algunos proyectos commitean las carpetas `ios/` y `android/` (el workflow
"bare"); otros las generan a demanda con `npx expo prebuild`. Cualquiera de
las dos está bien — solo tenés que saber en cuál estás. La sección **Entorno
y Configuración** explica cómo un `app.config.ts` dinámico maneja los
identificadores nativos por ambiente.
```

Replace it with:

```markdown
## Una nota sobre las carpetas nativas

{: .note-title }
Nota

{: .note }
El default del equipo es el **workflow managed con Continuous Native
Generation (CNG)**: las carpetas `ios/` y `android/` nunca se commitean. Se
generan a demanda — local con `npx expo prebuild`, o de forma transparente en
EAS Build — a partir de `app.config.ts` y los paquetes instalados. Ver
**Primeros Pasos → Workflow Managed (CNG)** para la justificación completa y
qué hacer cuando un SDK nativo necesita más que un config plugin.
```

- [ ] **Step 2: Replace the `.gitignore` code block**

In the same file, find this exact fenced block:

````markdown
```gitignore
# Dependencias
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Artefactos de build nativos — generados, nunca commitear
ios/build/
android/build/
android/app/build/
android/.gradle/
android/.cxx/
*.apk
*.aab
*.ipa
*.app
*.dSYM
*.dSYM.zip

# CocoaPods (se restaura con `pod install`)
ios/Pods/
ios/.xcode.env.local

# Config local de la máquina (Android)
android/local.properties

# Metro / bundler
.metro-health-check*
*.jsbundle

# Material de firma y secretos — nunca commitear
*.keystore
!debug.keystore
*.p8
*.p12
*.key
*.mobileprovision
.env
.env.*
!.env.example

# Logs y salida de debug
npm-debug.*
yarn-debug.*
yarn-error.*
*.log

# TypeScript
*.tsbuildinfo

# Ruido de IDE / SO
.DS_Store
.vscode/
.idea/
*.pem
```
````

Replace it with:

````markdown
```gitignore
# Dependencias
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Carpetas nativas — generadas por CNG, nunca commitear (ver Workflow Managed)
/ios
/android

# Binarios de app compilados — generados en cada build
*.apk
*.aab
*.ipa
*.app
*.dSYM
*.dSYM.zip

# Metro / bundler
.metro-health-check*
*.jsbundle

# Material de firma y secretos — nunca commitear
*.p8
*.p12
*.key
*.mobileprovision
.env
.env.*
!.env.example

# Logs y salida de debug
npm-debug.*
yarn-debug.*
yarn-error.*
*.log

# TypeScript
*.tsbuildinfo

# Ruido de IDE / SO
.DS_Store
.vscode/
.idea/
*.pem
```
````

- [ ] **Step 3: Replace the "notas sobre las entradas" bullets**

In the same file, find this exact block:

```markdown
- **`!debug.keystore`** — el keystore de *debug* compartido de Android se puede
  commitear tranquilo para que todos tengan la misma firma de debug. Tu keystore
  de **release** es un secreto: mantenelo fuera del repo (guardalo en EAS o en un
  gestor de secretos).
- Los **archivos `.env.*`** (`.env.dev`, `.env.preview`, `.env.prod`) se
  ignoran; **`.env.example`** se commitea. Mirá **Variables de Entorno** y
  **Entorno y Configuración → Secretos** para la regla completa — y rotá
  cualquier cosa que se filtre en el historial de git.
- **Config de Firebase** (`google-services.json`, `GoogleService-Info.plist`): si
  un proyecto las genera por ambiente en tiempo de build, ignoralas; si commitea
  una única config no secreta, commiteala. Decidilo una vez por proyecto y
  documentalo en el `README` del repo.
```

Replace it with:

```markdown
- **No hay debug keystore de Android para commitear.** Con el default managed,
  `android/` no se commitea en absoluto, así que no hay un `debug.keystore`
  compartido al que hacerle una excepción. Cada máquina (y EAS) usa su propia
  firma de debug; si una feature realmente necesita un SHA-1 de debug
  compartido (ej. Google Sign-In), manejalo como credencial de EAS, no como
  archivo commiteado. Tu keystore de **release** siempre es un secreto,
  cualquiera sea el workflow: mantenelo fuera del repo (guardalo en EAS o en un
  gestor de secretos).
- Los **archivos `.env.*`** (`.env.dev`, `.env.preview`, `.env.prod`) se
  ignoran; **`.env.example`** se commitea. Mirá **Variables de Entorno** y
  **Entorno y Configuración → Secretos** para la regla completa — y rotá
  cualquier cosa que se filtre en el historial de git.
- **Config de Firebase** (`google-services.json`, `GoogleService-Info.plist`):
  con el default managed no pueden vivir dentro de `ios/`/`android/` (no se
  commitean), así que apuntalas desde afuera — ej. una ruta en la raíz
  referenciada vía `googleServicesFile` en `app.config.ts`, que un config
  plugin copia al proyecto generado en el `prebuild`. Si ese archivo en sí es
  seguro de commitear (normalmente es un identificador no secreto por
  proyecto) es una decisión que se toma una vez por proyecto y se documenta en
  el `README` del repo.
```

- [ ] **Step 4: Replace the trailing "ya está trackeado" note**

In the same file, find this exact block:

```markdown
{: .note-title }
Nota

{: .note }
Si un artefacto de build _ya_ está trackeado, agregarlo al `.gitignore` no lo
elimina — Git solo ignora cambios de archivos *no trackeados*. Dejá de trackearlo
con `git rm -r --cached ios/build android/app/build` (ajustá las rutas) y después
commiteá.
```

Replace it with:

```markdown
{: .note-title }
Nota

{: .note }
Si `ios/`, `android/`, o un artefacto de build _ya_ está trackeado, agregarlo
al `.gitignore` no lo elimina — Git solo ignora cambios de archivos *no
trackeados*. Dejá de trackearlo con `git rm -r --cached ios android` (ajustá
las rutas para una limpieza más acotada) y después commiteá.
```

- [ ] **Step 5: Verify the edits landed and old text is gone**

Run: `grep -c "Cualquiera de las dos está bien\|!debug.keystore\|ios/build/" es/docs/getting-started/create-or-clone.md`
Expected: `0`.

Run: `grep -n "Workflow Managed (CNG)\|^/ios$\|^/android$\|No hay debug keystore de Android para commitear\|git rm -r --cached ios android" es/docs/getting-started/create-or-clone.md`
Expected: four matches.

- [ ] **Step 6: Verify no secrets leaked into the page**

Run: `grep -niE "api.key|-----BEGIN|password|secret[\"' :=]" es/docs/getting-started/create-or-clone.md`
Expected: no matches other than the prose words "secreto"/"secretos" (confirm by eye that no line contains an actual credential value).

- [ ] **Step 7: Commit**

```bash
git add es/docs/getting-started/create-or-clone.md
git commit -m "docs: align native-folders note and .gitignore with managed/CNG default (ES)"
```

---

### Task 6: Create the English "Native SDKs Without an Expo Plugin" page

**Files:**
- Create: `docs/architecture/native-sdks-without-plugins.md`

**Interfaces:**
- Consumes: nothing executable — references **Managed Workflow (CNG)** (Task 1) and **Environment & Configuration → Build-Time Config** (existing page) as plain bold text.
- Produces: a page at `/docs/architecture/native-sdks-without-plugins.html` with `nav_order: 4`, closing the loop referenced by Task 1's `managed-workflow.md`.

- [ ] **Step 1: Confirm the target file does not exist yet (pre-check)**

Run: `ls docs/architecture/native-sdks-without-plugins.md 2>&1`
Expected: `No such file or directory`.

- [ ] **Step 2: Create the English page**

Write `docs/architecture/native-sdks-without-plugins.md` with exactly:

````markdown
---
title: Native SDKs Without an Expo Plugin
parent: Project Architecture
nav_order: 4
---

# Native SDKs Without an Expo Plugin

The project stays on the **managed workflow** (see **Getting Started →
Managed Workflow (CNG)**) even for a native SDK that has no Expo integration —
by writing a small **local config plugin** instead of ejecting to bare or
committing `ios/`/`android/`.

## When this applies

Some vendor SDKs — KYC/identity-verification providers, payment SDKs, and
similar — ship only native install instructions: a CocoaPods dependency and
`Info.plist` keys for iOS, a Gradle dependency/repository and
`AndroidManifest.xml` entries for Android. No `app.config.ts` plugin, official
or community.

This is exactly the situation the team hit integrating **Sumsub** (identity
verification) on an internal project: no Expo plugin existed, and the SDK's
own docs only describe native steps.

{: .note }
Always search first. Check npm/GitHub for `<sdk name> expo plugin` or
`expo-config-plugin-*` before writing your own — most popular SDKs already
have one, official or maintained by the community.

## The pattern

Create one file per SDK under `plugins/`, e.g. `plugins/withSumsub.js`. It
uses [`@expo/config-plugins`](https://docs.expo.dev/config-plugins/introduction/)
mod functions to apply the SDK's native install steps programmatically, so
`npx expo prebuild` — run locally or by EAS Build — produces a native project
with the SDK already wired in.

```js
// plugins/withSumsub.js
const {
  withPlugins,
  withInfoPlist,
  withAndroidManifest,
  withAppBuildGradle,
} = require("@expo/config-plugins");

// Schematic template only. The mod bodies below are intentionally empty —
// fill each one in from the SDK's official native install guide. Never copy
// Info.plist keys, permissions, or Gradle coordinates from this file — they
// are specific to the SDK version you're integrating.

function withSumsubIOS(config) {
  return withInfoPlist(config, (config) => {
    // Set the Info.plist keys the SDK's iOS install guide requires.
    return config;
  });
}

function withSumsubAndroid(config) {
  config = withAndroidManifest(config, (config) => {
    // Add the permissions / <meta-data> entries the SDK's manifest merge requires.
    return config;
  });
  return withAppBuildGradle(config, (config) => {
    // Add the Maven repository / dependency line the SDK's install guide requires.
    return config;
  });
}

module.exports = function withSumsub(config) {
  return withPlugins(config, [withSumsubIOS, withSumsubAndroid]);
};
```

```ts
// app.config.ts
export default () => ({
  expo: {
    // ...
    plugins: ["./plugins/withSumsub"],
  },
});
```

If the SDK's iOS install step is a raw `Podfile` entry instead of an
`Info.plist` key, the equivalent mod is `withPodfile`, from the same package.

## Scaling to more than one SDK

One file per SDK, each scoped to a single native concern — the same
small-well-bounded-units principle the rest of the codebase follows (see
**Feature-Based Structure**). Compose them in `app.config.ts`'s `plugins`
array; each entry is independent and easy to remove if the SDK is dropped.

## Testing it

Run `npx expo prebuild --clean` locally to regenerate `ios/` and `android/`
and confirm the mod applied correctly (open the generated project in Xcode /
Android Studio if needed), then delete the generated folders again — they're
still never committed. See **Getting Started → Managed Workflow (CNG)**.

{: .note }
Re-run this check before any EAS build that touches the plugin. A broken
config plugin doesn't fail until the native build step — there's no earlier
warning.

## Maintenance

Unlike `ios/`/`android/`, the plugin file itself is committed source — normal
code review and `git blame` apply to it.

{: .warning }
**Pin the native SDK's version.** A version bump can silently change what
native config it needs (a new permission, a changed Podspec) — `prebuild`
won't warn you if the plugin has drifted from what the new SDK version
requires. Re-check the plugin against the SDK's changelog on every upgrade.

## See also

- **Getting Started → Managed Workflow (CNG)** — why this instead of bare or
  eject.
- **Environment & Configuration → Build-Time Config** — how `app.config.ts` is
  already structured for per-environment values; this plugin registers into
  the same file.
````

- [ ] **Step 3: Verify the page has the required structure**

Run: `grep -n "nav_order: 4\|## When this applies\|## The pattern\|## Testing it\|## Maintenance\|Managed Workflow (CNG)" docs/architecture/native-sdks-without-plugins.md`
Expected: matches for `nav_order: 4`, all four `##` headings, and two references back to Managed Workflow (CNG).

- [ ] **Step 4: Verify no fabricated Sumsub-specific native values leaked in**

Run: `grep -niE "NSCamera|NSMicrophone|com\.sumsub|sumsub:[0-9]|implementation ['\"]com|<uses-permission|minSdkVersion" docs/architecture/native-sdks-without-plugins.md`
Expected: no matches — every mod body is an empty placeholder with a comment, per the Global Constraints.

- [ ] **Step 5: Verify no secrets leaked into the page**

Run: `grep -niE "api.key|-----BEGIN|password|secret[\"' :=]" docs/architecture/native-sdks-without-plugins.md`
Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git add docs/architecture/native-sdks-without-plugins.md
git commit -m "docs: add Native SDKs Without an Expo Plugin page (EN)"
```

---

### Task 7: Create the Spanish "SDKs Nativos Sin Plugin de Expo" mirror

**Files:**
- Create: `es/docs/architecture/native-sdks-without-plugins.md`

**Interfaces:**
- Consumes: the EN page from Task 6 as the structure to mirror, section for section.
- Produces: a page at `/es/docs/architecture/native-sdks-without-plugins.html` with `nav_order: 4`.

- [ ] **Step 1: Confirm the target file does not exist yet (pre-check)**

Run: `ls es/docs/architecture/native-sdks-without-plugins.md 2>&1`
Expected: `No such file or directory`.

- [ ] **Step 2: Create the Spanish page**

Write `es/docs/architecture/native-sdks-without-plugins.md` with exactly:

````markdown
---
title: SDKs Nativos Sin Plugin de Expo
parent: Arquitectura del Proyecto
nav_order: 4
---

# SDKs Nativos Sin Plugin de Expo

El proyecto se mantiene en el **workflow managed** (ver **Primeros Pasos →
Workflow Managed (CNG)**) incluso para un SDK nativo sin integración de Expo —
escribiendo un **config plugin local** chico en vez de ejectar a bare o
commitear `ios/`/`android/`.

## Cuándo aplica

Algunos SDKs de proveedores — verificación de identidad/KYC, pagos, y
similares — solo traen instrucciones de instalación nativa: una dependencia
de CocoaPods y claves de `Info.plist` en iOS, una dependencia/repositorio de
Gradle y entradas de `AndroidManifest.xml` en Android. Ningún plugin de
`app.config.ts`, ni oficial ni de comunidad.

Es exactamente lo que le pasó al equipo integrando **Sumsub** (verificación de
identidad) en un proyecto interno: no existía un plugin de Expo, y la propia
doc del SDK solo describe pasos nativos.

{: .note-title }
Nota

{: .note }
Buscá primero, siempre. Revisá npm/GitHub por `<nombre del sdk> expo plugin` o
`expo-config-plugin-*` antes de escribir el tuyo — la mayoría de los SDKs
populares ya tienen uno, oficial o mantenido por la comunidad.

## El patrón

Creá un archivo por SDK bajo `plugins/`, ej. `plugins/withSumsub.js`. Usa los
mods de [`@expo/config-plugins`](https://docs.expo.dev/config-plugins/introduction/)
para aplicar los pasos de instalación nativa del SDK de forma programática,
así `npx expo prebuild` — corrido local o por EAS Build — genera un proyecto
nativo con el SDK ya integrado.

```js
// plugins/withSumsub.js
const {
  withPlugins,
  withInfoPlist,
  withAndroidManifest,
  withAppBuildGradle,
} = require("@expo/config-plugins");

// Plantilla esquemática. Los mods de abajo están intencionalmente vacíos —
// completalos con la guía oficial de instalación nativa del SDK. Nunca
// copies claves de Info.plist, permisos, o coordenadas de Gradle de este
// archivo — son específicos de la versión del SDK que estés integrando.

function withSumsubIOS(config) {
  return withInfoPlist(config, (config) => {
    // Setear las claves de Info.plist que pide la guía de instalación de iOS del SDK.
    return config;
  });
}

function withSumsubAndroid(config) {
  config = withAndroidManifest(config, (config) => {
    // Agregar los permisos / entradas <meta-data> que pide el merge del manifest del SDK.
    return config;
  });
  return withAppBuildGradle(config, (config) => {
    // Agregar el repositorio Maven / línea de dependencia que pide la guía de instalación del SDK.
    return config;
  });
}

module.exports = function withSumsub(config) {
  return withPlugins(config, [withSumsubIOS, withSumsubAndroid]);
};
```

```ts
// app.config.ts
export default () => ({
  expo: {
    // ...
    plugins: ["./plugins/withSumsub"],
  },
});
```

Si el paso de instalación de iOS del SDK es una entrada directa en el
`Podfile` en vez de una clave de `Info.plist`, el mod equivalente es
`withPodfile`, del mismo paquete.

## Escalar a más de un SDK

Un archivo por SDK, cada uno acotado a una sola responsabilidad nativa — el
mismo principio de unidades chicas y bien delimitadas que sigue el resto del
código (ver **Estructura Basada en Features**). Se componen en el array
`plugins` de `app.config.ts`; cada entrada es independiente y fácil de sacar
si se deja de usar el SDK.

## Testearlo

Corré `npx expo prebuild --clean` local para regenerar `ios/` y `android/` y
confirmar que el mod se aplicó bien (abrí el proyecto generado en Xcode /
Android Studio si hace falta), y después borrá las carpetas generadas de
nuevo — igual nunca se commitean. Ver **Primeros Pasos → Workflow Managed
(CNG)**.

{: .note-title }
Nota

{: .note }
Volvé a chequear esto antes de cualquier build de EAS que toque el plugin. Un
config plugin roto no falla hasta el paso de build nativo — no hay ningún
aviso antes.

## Mantenimiento

A diferencia de `ios/`/`android/`, el archivo del plugin sí es código
commiteado — el code review y el `git blame` normales aplican.

{: .warning-title }
Advertencia

{: .warning }
**Pineá la versión del SDK nativo.** Un bump de versión puede cambiar en
silencio qué configuración nativa necesita (un permiso nuevo, un Podspec
cambiado) — `prebuild` no te avisa si el plugin quedó desalineado con lo que
pide la nueva versión del SDK. Revisá el plugin contra el changelog del SDK en
cada upgrade.

## Ver también

- **Primeros Pasos → Workflow Managed (CNG)** — por qué esto en vez de bare o
  eject.
- **Entorno y Configuración → Configuración en Tiempo de Compilación** — cómo
  ya está estructurado `app.config.ts` para valores por ambiente; este plugin
  se registra en el mismo archivo.
````

- [ ] **Step 3: Verify the Spanish page mirrors the English structure**

Run: `grep -n "nav_order: 4\|## Cuándo aplica\|## El patrón\|## Testearlo\|## Mantenimiento\|Workflow Managed (CNG)" es/docs/architecture/native-sdks-without-plugins.md`
Expected: matches for `nav_order: 4`, all four `##` headings, and two references back to Workflow Managed (CNG).

- [ ] **Step 4: Verify no fabricated Sumsub-specific native values leaked in**

Run: `grep -niE "NSCamera|NSMicrophone|com\.sumsub|sumsub:[0-9]|implementation ['\"]com|<uses-permission|minSdkVersion" es/docs/architecture/native-sdks-without-plugins.md`
Expected: no matches.

- [ ] **Step 5: Verify no secrets leaked into the page**

Run: `grep -niE "api.key|-----BEGIN|password|secret[\"' :=]" es/docs/architecture/native-sdks-without-plugins.md`
Expected: no matches.

- [ ] **Step 6: Commit**

```bash
git add es/docs/architecture/native-sdks-without-plugins.md
git commit -m "docs: add Native SDKs Without an Expo Plugin page (ES mirror)"
```

---

### Task 8: Add glossary terms to Reference (EN + ES)

**Files:**
- Modify: `docs/reference.md`
- Modify: `es/docs/reference.md`

**Interfaces:**
- Consumes: nothing executable — pure glossary text additions.
- Produces: three new glossary rows (**CNG**, **Prebuild**, **Config plugin**) in each language's Reference page, inserted between the existing `APP_ENV` and `Barrel` rows.

- [ ] **Step 1: Add the English glossary rows**

In `docs/reference.md`, find this exact block:

```markdown
| **`APP_ENV`** | The environment selector (`development` / `preview` / `production`) that drives dynamic config. |
| **Barrel** | An `index.ts` that re-exports a module's public surface. |
```

Replace it with:

```markdown
| **`APP_ENV`** | The environment selector (`development` / `preview` / `production`) that drives dynamic config. |
| **CNG** | Continuous Native Generation — Expo's approach of generating `ios/`/`android/` on demand instead of committing them. |
| **Prebuild** | The `npx expo prebuild` command that performs CNG — generates native projects from `app.config.ts` and installed config plugins. |
| **Config plugin** | A function that modifies the generated native project during `prebuild` (e.g. adding a permission, an `Info.plist` key, a Gradle dependency). |
| **Barrel** | An `index.ts` that re-exports a module's public surface. |
```

- [ ] **Step 2: Add the Spanish glossary rows**

In `es/docs/reference.md`, find this exact block:

```markdown
| **`APP_ENV`** | El selector de entorno (`development` / `preview` / `production`) que maneja la configuración dinámica. |
| **Barrel** | Un `index.ts` que re-exporta la superficie pública de un módulo. |
```

Replace it with:

```markdown
| **`APP_ENV`** | El selector de entorno (`development` / `preview` / `production`) que maneja la configuración dinámica. |
| **CNG** | Continuous Native Generation — el enfoque de Expo de generar `ios/`/`android/` a demanda en vez de commitearlas. |
| **Prebuild** | El comando `npx expo prebuild` que ejecuta el CNG — genera los proyectos nativos a partir de `app.config.ts` y los config plugins instalados. |
| **Config plugin** | Una función que modifica el proyecto nativo generado durante el `prebuild` (ej. agregar un permiso, una clave de `Info.plist`, una dependencia de Gradle). |
| **Barrel** | Un `index.ts` que re-exporta la superficie pública de un módulo. |
```

- [ ] **Step 3: Verify both glossaries were updated**

Run: `grep -n "CNG\|Prebuild\|Config plugin" docs/reference.md es/docs/reference.md`
Expected: three matches in each file.

- [ ] **Step 4: Commit**

```bash
git add docs/reference.md es/docs/reference.md
git commit -m "docs: add CNG, Prebuild, and Config plugin to the glossary (EN+ES)"
```

---

### Task 9: Build the site and verify everything resolves

**Files:**
- None modified — this task only builds and inspects output.

**Interfaces:**
- Consumes: everything from Tasks 1–8.

- [ ] **Step 1: Build the site with Homebrew Ruby**

Run:
```bash
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
bundle exec jekyll build
```
Expected: build completes with `done in N seconds` and no `Liquid Exception` / `Error:` lines.

- [ ] **Step 2: Verify all four new pages were generated**

Run: `ls _site/docs/getting-started/managed-workflow.html _site/es/docs/getting-started/managed-workflow.html _site/docs/architecture/native-sdks-without-plugins.html _site/es/docs/architecture/native-sdks-without-plugins.html`
Expected: all four files exist.

- [ ] **Step 3: Verify the Getting Started nav is contiguous in the built HTML**

Run: `grep -o 'nav_order[^,]*' _site/docs/getting-started/*.html 2>/dev/null | head -1; for f in docs/getting-started/*.md es/docs/getting-started/*.md; do grep -H nav_order "$f"; done | sort -t: -k1`
Expected: the second command shows 1,2,3,4,5 with no duplicates in each language folder (same check as Task 3 Step 3, re-confirmed after all edits).

- [ ] **Step 4: Verify the built pages contain the expected content**

Run: `grep -l "Continuous Native Generation" _site/docs/getting-started/managed-workflow.html _site/es/docs/getting-started/managed-workflow.html`
Expected: both built pages match.

Run: `grep -l "withSumsub" _site/docs/architecture/native-sdks-without-plugins.html _site/es/docs/architecture/native-sdks-without-plugins.html`
Expected: both built pages match.

- [ ] **Step 5: Final grep sweep for fabricated Sumsub native values and secrets across the whole diff**

Run: `git diff --name-only HEAD~8 -- docs es | xargs grep -niE "NSCamera|NSMicrophone|com\.sumsub|sumsub:[0-9]|<uses-permission|minSdkVersion|-----BEGIN|password"`
Expected: no matches. (If the commit count from Tasks 1–8 differs from 8 by the time this runs, adjust `HEAD~8` to cover exactly the commits made in this plan.)

- [ ] **Step 6: Final commit (only if the build produced tracked changes)**

`_site/` may be git-ignored. Check first:

Run: `git status --porcelain`

If `_site/` changes appear and `_site/` is tracked, commit them:
```bash
git add _site
git commit -m "chore: rebuild site with Managed Workflow and Native SDK Config Plugin pages"
```
If `git status` is clean or only shows ignored files, skip this step — the work from Tasks 1–8 is already committed.

---

## Self-Review

**Spec coverage:**
- G1 declares managed/CNG as team default, no committed `ios/`/`android/` → Task 1 (EN), Task 2 (ES).
- G1 day-to-day implications (`app.config.ts`, `prebuild --clean`, EAS Build) → Task 1/2 "Day to day" section.
- G1 escape valve pointing to G2 as the only recommended path (not bare) → Task 1/2 "When a config plugin doesn't cover what you need" section.
- G1 note on inherited bare projects (not a silent migration) → Task 1/2 closing note.
- G2 documents the local config-plugin pattern generically, Sumsub/T5 as motivating case only → Task 6 (EN), Task 7 (ES), with the Global Constraints ban on fabricated Sumsub-specific values enforced by Step 4 grep in each task plus Task 9 Step 5.
- G2 scaling to more SDKs, testing via `prebuild --clean`, maintenance/versioning warning → Task 6/7 "Scaling," "Testing it," "Maintenance" sections.
- Cross-links G1 ↔ G2, and G2 → Build-Time Config → present as plain bold text in both pages' bodies (Tasks 1, 2, 6, 7), consistent with the no-hyperlinks-in-these-folders constraint.
- Rewrite of the existing "either is fine" note → Task 4 (EN) Step 1, Task 5 (ES) Step 1.
- `.gitignore` reference updated to ignore `/ios` and `/android` outright, with the now-redundant granular native-subfolder rules removed and the debug-keystore exception resolved (removed, replaced with an accurate explanation) instead of left self-contradictory → Task 4/5 Steps 2–4.
- Firebase config bullet updated to reflect that `google-services.json` / `GoogleService-Info.plist` can't live inside the now-ignored native folders → Task 4/5 Step 3.
- Nav placement (Getting Started nav_order 3, Architecture nav_order 4) and renumbering of siblings → Task 1, Task 3, Task 6.
- Glossary additions (CNG, Config plugin, Prebuild) → Task 8.
- Non-goals respected: no ADR added, no changes to `build-and-distribution/concepts.md`, no real Sumsub native values, no bare-migration tooling — none of these appear in any task.
- Jekyll build + verification → Task 9.

**Placeholder scan:** No TBD/TODO; every page's full markdown is inline in Tasks 1, 2, 6, 7; every edit in Tasks 4, 5, 8 shows the exact old and new text; all commands and expected outputs are concrete.

**Type consistency:** File names match across tasks (`managed-workflow.md` / `.html` in Tasks 1–5, `native-sdks-without-plugins.md` / `.html` in Tasks 1, 6–9); `nav_order: 3` for Managed Workflow and `nav_order: 4` for Native SDKs Without an Expo Plugin are used consistently everywhere they're referenced; the plugin file/function names (`plugins/withSumsub.js`, `withSumsub`, `withSumsubIOS`, `withSumsubAndroid`) match between the EN and ES versions of Task 6/7's code block; front-matter `parent` values match the existing EN ("Getting Started", "Project Architecture") and ES ("Primeros Pasos", "Arquitectura del Proyecto") pages.
