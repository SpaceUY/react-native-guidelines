# Per-environment `.env` files Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the guidelines to document Space's per-environment env-file protocol (`.env.dev` / `.env.preview` / `.env.prod`, git-ignored, plus one committed `.env.example`, loaded via `env-cmd`).

**Architecture:** Pure documentation change to a Jekyll (`just-the-docs`) site. Edit four English pages under `docs/` and their exact Spanish mirrors under `es/docs/`. No app code, no theme changes. "Tests" are `grep` assertions on file content plus a final `bundle exec jekyll build`.

**Tech Stack:** Jekyll, `just-the-docs` theme, Markdown/Kramdown. Ruby is Homebrew's (`/opt/homebrew/opt/ruby/bin`), not system Ruby 2.6.

## Global Constraints

- Environment file names are exactly `.env.dev`, `.env.preview`, `.env.prod` (use `preview`, never `staging`).
- A single committed template `.env.example`; the three per-env files are git-ignored.
- Loader is `env-cmd` (dev dependency); `dotenv-cli` mentioned only as an equivalent alternative.
- `APP_ENV` values stay `development | preview | production`; `app.config.ts` / `eas.json` build-time model is unchanged.
- English and Spanish content stay in sync, file for file. Spanish callouts use the manual-title syntax (`{: .warning-title }` / `{: .note-title }` + literal title) already used in `es/`.
- Do not translate code, file names, or command names in the Spanish pages.
- Jekyll build command must prefix PATH with Homebrew Ruby: `export PATH="/opt/homebrew/opt/ruby/bin:$PATH"`.

---

### Task 1: Rewrite `environment-variables.md` (EN + ES)

**Files:**
- Modify: `docs/getting-started/environment-variables.md` (full body replace)
- Modify: `es/docs/getting-started/environment-variables.md` (full body replace)

**Interfaces:**
- Produces: the canonical three-file model, the `env-cmd` script block, and the two-reason rationale that Tasks 2–4 cross-reference by page title ("Environment Variables" / "Variables de Entorno").

- [ ] **Step 1: Verify current single-`.env` content is present (pre-check)**

Run: `grep -n "cp .env.example .env$" docs/getting-started/environment-variables.md es/docs/getting-started/environment-variables.md`
Expected: one match in each file (the single-file copy instruction we're replacing).

- [ ] **Step 2: Replace the EN file body**

Overwrite `docs/getting-started/environment-variables.md` with exactly:

```markdown
---
title: Environment Variables
parent: Getting Started
nav_order: 3
---

# Environment Variables

We keep **one env file per environment**, each git-ignored, plus a single
committed template:

| File | Environment | In git |
| --- | --- | --- |
| `.env.dev` | development | ignored |
| `.env.preview` | preview | ignored |
| `.env.prod` | production | ignored |
| `.env.example` | template (dummy values) | committed |

The variable **names** are the same across environments — only the values
differ — so one `.env.example` documents them all. Copy it into each
environment file and fill in the real values:

```bash
cp .env.example .env.dev       # repeat for .env.preview and .env.prod
```

## Loading the right file

Select the file per environment with
[`env-cmd`](https://www.npmjs.com/package/env-cmd) (a dev dependency) in your
`package.json` scripts:

```json
"scripts": {
  "start":         "env-cmd -f .env.dev expo start",
  "start:preview": "env-cmd -f .env.preview expo start",
  "start:prod":    "env-cmd -f .env.prod expo start"
}
```

Give each file its own `APP_ENV` (`development` / `preview` / `production`) so
the runtime values `env-cmd` loads and the build-time config the dynamic
`app.config.ts` selects stay in sync from one source. (`dotenv-cli` works the
same way if you already use it.) For EAS builds the values still come from the
`env` block of the matching profile in `eas.json` — see **Build-Time Config**.

## The `EXPO_PUBLIC_` prefix

Any variable prefixed with `EXPO_PUBLIC_` is **inlined into the app bundle** at
build time and readable at runtime through `process.env`:

```ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

{: .warning }
`EXPO_PUBLIC_*` values ship **inside the client app** — anyone can read them.
Never put secrets (API keys with write access, tokens, passwords) there. Those
belong on the backend or in EAS secrets. See **Environment & Configuration →
Secrets**.

## What's committed

- `.env.dev`, `.env.preview`, `.env.prod` — your real per-environment values.
  **Git-ignored. Never commit them.**
- `.env.example` — the template with empty or dummy values. **Committed**, so
  everyone knows which variables a project needs.

## Why one file per environment

- **Isolation** — a dev or test wallet/credential in `.env.dev` can never be
  bundled into a preview or production build.
- **No blocked tooling** — real wallets and keys live only in git-ignored
  files, never in tracked content, so Claude Code and secret scanners don't
  trip on a detected key and refuse to work.

For the full picture — runtime vs build-time config and how `APP_ENV` selects an
environment — see **Environment & Configuration**.
```

- [ ] **Step 3: Replace the ES file body**

Overwrite `es/docs/getting-started/environment-variables.md` with exactly:

```markdown
---
title: Variables de Entorno
parent: Primeros Pasos
nav_order: 3
---

# Variables de Entorno

Mantenemos **un archivo de entorno por ambiente**, cada uno ignorado por git,
más una única plantilla commiteada:

| Archivo | Ambiente | En git |
| --- | --- | --- |
| `.env.dev` | development | ignorado |
| `.env.preview` | preview | ignorado |
| `.env.prod` | production | ignorado |
| `.env.example` | plantilla (valores dummy) | commiteado |

Los **nombres** de las variables son iguales entre ambientes — solo cambian los
valores — así que un único `.env.example` los documenta a todos. Copialo en
cada archivo de ambiente y completá los valores reales:

```bash
cp .env.example .env.dev       # repetí para .env.preview y .env.prod
```

## Cargar el archivo correcto

Elegí el archivo por ambiente con
[`env-cmd`](https://www.npmjs.com/package/env-cmd) (una devDependency) en los
scripts de tu `package.json`:

```json
"scripts": {
  "start":         "env-cmd -f .env.dev expo start",
  "start:preview": "env-cmd -f .env.preview expo start",
  "start:prod":    "env-cmd -f .env.prod expo start"
}
```

Dale a cada archivo su propio `APP_ENV` (`development` / `preview` /
`production`) así los valores de runtime que carga `env-cmd` y la config de
build-time que elige el `app.config.ts` dinámico quedan en sync desde una sola
fuente. (`dotenv-cli` funciona igual si ya lo usás.) En los builds de EAS los
valores siguen viniendo del bloque `env` del perfil correspondiente en
`eas.json` — ver **Configuración en Tiempo de Compilación**.

## El prefijo `EXPO_PUBLIC_`

Cualquier variable con el prefijo `EXPO_PUBLIC_` se **inlinea dentro del bundle
de la app** en tiempo de build y se puede leer en runtime a través de
`process.env`:

```ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

{: .warning-title }
Advertencia

{: .warning }
Los valores `EXPO_PUBLIC_*` viajan **dentro de la app del cliente** — cualquiera
puede leerlos. Nunca pongas ahí secretos (API keys con permisos de escritura,
tokens, contraseñas). Esos van en el backend o en los secrets de EAS. Ver
**Entorno y Configuración → Secretos**.

## Qué se commitea

- `.env.dev`, `.env.preview`, `.env.prod` — tus valores reales por ambiente.
  **Ignorados por git. Nunca los commitees.**
- `.env.example` — la plantilla con valores vacíos o de ejemplo. **Se
  commitea**, así todos saben qué variables necesita un proyecto.

## Por qué un archivo por ambiente

- **Aislamiento** — una wallet o credencial de dev/test en `.env.dev` nunca
  puede terminar empaquetada en un build de preview o de producción.
- **Sin herramientas bloqueadas** — las wallets y keys reales viven solo en
  archivos ignorados por git, nunca en contenido trackeado, así Claude Code y
  los scanners de secretos no se bloquean al detectar una key.

Para el panorama completo — configuración de runtime vs. build-time y cómo
`APP_ENV` selecciona un ambiente — ver **Entorno y Configuración**.
```

- [ ] **Step 4: Verify new content (post-check)**

Run: `grep -c "env-cmd -f .env.preview" docs/getting-started/environment-variables.md es/docs/getting-started/environment-variables.md; grep -c "cp .env.example .env$" docs/getting-started/environment-variables.md es/docs/getting-started/environment-variables.md`
Expected: first grep reports `1` for each file; second grep reports `0` for each file (single-file instruction gone).

- [ ] **Step 5: Commit**

```bash
git add docs/getting-started/environment-variables.md es/docs/getting-started/environment-variables.md
git commit -m "docs: per-environment .env files in Environment Variables (EN+ES)"
```

---

### Task 2: Update the `.gitignore` block in `create-or-clone.md` (EN + ES)

**Files:**
- Modify: `docs/getting-started/create-or-clone.md` (secrets lines in the `.gitignore` code block + the `.env` note bullet)
- Modify: `es/docs/getting-started/create-or-clone.md` (same, Spanish)

**Interfaces:**
- Consumes: the file names established in Task 1 (`.env.dev` / `.env.preview` / `.env.prod`).
- Produces: a `.gitignore` rule (`.env` + `.env.*` + `!.env.example`) that ignores all per-env files while keeping the template.

- [ ] **Step 1: Verify current ignore lines are present (pre-check)**

Run: `grep -n ".env\*.local" docs/getting-started/create-or-clone.md es/docs/getting-started/create-or-clone.md`
Expected: one match in each file.

- [ ] **Step 2: Edit the EN `.gitignore` code block**

In `docs/getting-started/create-or-clone.md`, replace this exact block:

```gitignore
.env
.env*.local
```

with:

```gitignore
.env
.env.*
!.env.example
```

- [ ] **Step 3: Edit the EN `.env` note bullet**

In `docs/getting-started/create-or-clone.md`, replace this exact text:

```markdown
- **`.env`** is ignored; **`.env.example`** is committed. See **Environment
  Variables** and **Environment & Configuration → Secrets** for the full rule —
  and rotate anything that leaks into git history.
```

with:

```markdown
- **The `.env.*` files** (`.env.dev`, `.env.preview`, `.env.prod`) are ignored;
  **`.env.example`** is committed. See **Environment Variables** and
  **Environment & Configuration → Secrets** for the full rule — and rotate
  anything that leaks into git history.
```

- [ ] **Step 4: Edit the ES `.gitignore` code block**

In `es/docs/getting-started/create-or-clone.md`, replace this exact block:

```gitignore
.env
.env*.local
```

with:

```gitignore
.env
.env.*
!.env.example
```

- [ ] **Step 5: Edit the ES `.env` note bullet**

In `es/docs/getting-started/create-or-clone.md`, replace this exact text:

```markdown
- **`.env`** se ignora; **`.env.example`** se commitea. Mirá **Variables de
  Entorno** y **Entorno y Configuración → Secretos** para la regla completa — y
  rotá cualquier cosa que se filtre en el historial de git.
```

with:

```markdown
- Los **archivos `.env.*`** (`.env.dev`, `.env.preview`, `.env.prod`) se
  ignoran; **`.env.example`** se commitea. Mirá **Variables de Entorno** y
  **Entorno y Configuración → Secretos** para la regla completa — y rotá
  cualquier cosa que se filtre en el historial de git.
```

- [ ] **Step 6: Verify new content (post-check)**

Run: `grep -c "!.env.example" docs/getting-started/create-or-clone.md es/docs/getting-started/create-or-clone.md; grep -c ".env\*.local" docs/getting-started/create-or-clone.md es/docs/getting-started/create-or-clone.md`
Expected: first grep reports `1` for each file; second grep reports `0` for each file.

- [ ] **Step 7: Commit**

```bash
git add docs/getting-started/create-or-clone.md es/docs/getting-started/create-or-clone.md
git commit -m "docs: ignore per-environment .env files in .gitignore guideline (EN+ES)"
```

---

### Task 3: Update `secrets.md` `.env` bullets (EN + ES)

**Files:**
- Modify: `docs/environment-config/secrets.md`
- Modify: `es/docs/environment-config/secrets.md`

**Interfaces:**
- Consumes: the per-env file names from Task 1.

- [ ] **Step 1: Verify current single-`.env` bullet is present (pre-check)**

Run: `grep -n "\`.env\` holds your local values" docs/environment-config/secrets.md`
Expected: one match.

- [ ] **Step 2: Edit the EN bullet**

In `docs/environment-config/secrets.md`, replace this exact text:

```markdown
- `.env` holds your local values and is **git-ignored** — never commit it.
```

with:

```markdown
- `.env.dev`, `.env.preview`, and `.env.prod` hold your per-environment values
  and are **git-ignored** — never commit them.
```

- [ ] **Step 3: Edit the EN table row**

In `docs/environment-config/secrets.md`, replace this exact text:

```markdown
| Public config (API base URL, public client id) | `EXPO_PUBLIC_*` in `.env` |
```

with:

```markdown
| Public config (API base URL, public client id) | `EXPO_PUBLIC_*` in `.env.<env>` |
```

- [ ] **Step 4: Edit the ES bullet**

In `es/docs/environment-config/secrets.md`, replace this exact text:

```markdown
- `.env` guarda tus valores locales y está **ignorado por git** — nunca lo
  commitees.
```

with:

```markdown
- `.env.dev`, `.env.preview` y `.env.prod` guardan tus valores por ambiente y
  están **ignorados por git** — nunca los commitees.
```

- [ ] **Step 5: Edit the ES table row**

In `es/docs/environment-config/secrets.md`, replace this exact text:

```markdown
| Configuración pública (URL base de la API, client id público) | `EXPO_PUBLIC_*` en `.env` |
```

with:

```markdown
| Configuración pública (URL base de la API, client id público) | `EXPO_PUBLIC_*` en `.env.<env>` |
```

- [ ] **Step 6: Verify new content (post-check)**

Run: `grep -c ".env.preview" docs/environment-config/secrets.md es/docs/environment-config/secrets.md`
Expected: `1` for each file.

- [ ] **Step 7: Commit**

```bash
git add docs/environment-config/secrets.md es/docs/environment-config/secrets.md
git commit -m "docs: reference per-environment .env files in Secrets (EN+ES)"
```

---

### Task 4: Tie `env-cmd` to `APP_ENV` in `build-time-config.md` (EN + ES)

**Files:**
- Modify: `docs/environment-config/build-time-config.md`
- Modify: `es/docs/environment-config/build-time-config.md`

**Interfaces:**
- Consumes: the `env-cmd -f .env.<env>` loader from Task 1.

- [ ] **Step 1: Verify the anchor paragraph is present (pre-check)**

Run: `grep -n "picking a profile picks the environment" docs/environment-config/build-time-config.md`
Expected: one match.

- [ ] **Step 2: Edit the EN file — add a note after the profile paragraph**

In `docs/environment-config/build-time-config.md`, replace this exact text:

```markdown
you never set it by hand — picking a profile picks the environment. See
**Build & Distribution → Concepts**.
```

with:

```markdown
you never set it by hand — picking a profile picks the environment. See
**Build & Distribution → Concepts**.

Locally, `env-cmd -f .env.<env>` loads that environment's runtime values while
`APP_ENV` (which each `.env.<env>` file can define) selects the matching native
config here — the two layers stay aligned. See **Getting Started → Environment
Variables**.
```

- [ ] **Step 3: Edit the ES file — add the same note**

In `es/docs/environment-config/build-time-config.md`, replace this exact text:

```markdown
`APP_ENV` se configura **por build profile de EAS** en `eas.json` (el bloque
`env`), así que nunca lo seteás a mano — elegir un profile elige el
ambiente. Ver **Compilación y Distribución → Conceptos**.
```

with:

```markdown
`APP_ENV` se configura **por build profile de EAS** en `eas.json` (el bloque
`env`), así que nunca lo seteás a mano — elegir un profile elige el
ambiente. Ver **Compilación y Distribución → Conceptos**.

Localmente, `env-cmd -f .env.<env>` carga los valores de runtime de ese
ambiente mientras `APP_ENV` (que cada archivo `.env.<env>` puede definir)
selecciona la config nativa correspondiente acá — las dos capas quedan
alineadas. Ver **Primeros Pasos → Variables de Entorno**.
```

- [ ] **Step 4: Verify new content (post-check)**

Run: `grep -c "env-cmd -f .env.<env>" docs/environment-config/build-time-config.md es/docs/environment-config/build-time-config.md`
Expected: `1` for each file.

- [ ] **Step 5: Commit**

```bash
git add docs/environment-config/build-time-config.md es/docs/environment-config/build-time-config.md
git commit -m "docs: link env-cmd file selection to APP_ENV in Build-Time Config (EN+ES)"
```

---

### Task 5: Full-site build + cross-tree sweep

**Files:**
- None modified (verification only)

- [ ] **Step 1: Build the site**

Run: `export PATH="/opt/homebrew/opt/ruby/bin:$PATH" && bundle exec jekyll build`
Expected: build ends with `done in ... seconds` and no `Liquid Warning`/`Error` referencing the four edited pages. (Pre-existing SASS deprecation warnings and the unrelated `navigation.md` Liquid warning are fine.)

- [ ] **Step 2: Sweep for leftover single-`.env` guidance**

Run: `grep -rn "cp .env.example .env$" docs/ es/; grep -rn ".env\*.local" docs/ es/`
Expected: no output from either grep (no single-file copy instruction, no old ignore rule remain in either language tree).

- [ ] **Step 3: Confirm the new model is present in both trees**

Run: `grep -rl "env-cmd -f .env.preview" docs/ es/`
Expected: at least `docs/getting-started/environment-variables.md` and `es/docs/getting-started/environment-variables.md`.

- [ ] **Step 4: Spot-check rendered HTML (optional, if a serve is running)**

Run: `curl -s http://127.0.0.1:4000/react-native-guidelines/docs/getting-started/environment-variables.html | grep -o "Why one file per environment"`
Expected: `Why one file per environment` (confirms the new section rendered). Skip if no server is running.

---

## Self-Review

- **Spec coverage:** Model table (Task 1) ✓; loader/`env-cmd` (Task 1) ✓; clone flow `cp .env.example .env.dev` (Task 1) ✓; two rationales (Task 1) ✓; `.gitignore` update (Task 2) ✓; secrets bullets (Task 3) ✓; build-time note (Task 4) ✓; EN+ES mirror every task ✓; build/grep verification (Task 5) ✓.
- **Placeholder scan:** none — every step has exact paths, exact old/new content, and exact commands.
- **Type/string consistency:** file names `.env.dev`/`.env.preview`/`.env.prod`, template `.env.example`, ignore rule `.env.*` + `!.env.example`, and loader `env-cmd -f .env.<env>` are used identically across all tasks and match the spec.
