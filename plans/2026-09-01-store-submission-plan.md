# Store Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new bilingual **Store Submission** page under Build & Distribution documenting the App Store Connect and Google Play console steps (first release + updates) that take a build from "uploaded by `eas submit`" to "live", and wire it into the nav and cross-links.

**Architecture:** Pure documentation change to a Jekyll (`just-the-docs`) site. Create one new English page under `docs/build-and-distribution/` and its exact Spanish mirror under `es/docs/build-and-distribution/`, then add a pointer from `production-releases.md` and renumber the two pages that currently sit after it. No app code, no theme changes. "Tests" are `grep` assertions on file content plus a final `bundle exec jekyll build`.

**Tech Stack:** Jekyll 4.3, `just-the-docs` 0.10.1 (pinned gem), kramdown, `jekyll-seo-tag`. Ruby is Homebrew's (`/opt/homebrew/opt/ruby/bin`), not system Ruby 2.6.

## Global Constraints

- English and Spanish content stay in sync, file for file.
- `just-the-docs` has **no** `jekyll-relative-links` plugin — internal links must target the built `.html` path, not `.md`. Sibling pages in the same folder link by bare filename, e.g. `[Production Releases](production-releases.html)`.
- EN callouts use a single IAL + bold lead: `{: .note }` / `{: .warning }` / `{: .tip }` on its own line, followed by a paragraph that may start with a `**Bold lead:**`.
- ES callouts use the manual-title pattern already used in the `es/` tree: `{: .note-title }` + a literal title line, a blank line, then `{: .note }` + the body.
- Do not translate code, file names, command names, or the store-console UI labels (App Store Connect, TestFlight, Data safety, etc.) in the Spanish page — translate the surrounding prose and, where useful, add a short Spanish gloss next to an English console label.
- Never write secrets, API keys, service-account JSON, or credentials into any page.
- Nav ordering inside Build & Distribution stays contiguous with no duplicate `nav_order` values.
- Jekyll build command must prefix PATH with Homebrew Ruby: `export PATH="/opt/homebrew/opt/ruby/bin:$PATH"`.

---

### Task 1: Create the English Store Submission page

**Files:**
- Create: `docs/build-and-distribution/store-submission.md`

**Interfaces:**
- Produces: a page at `/docs/build-and-distribution/store-submission.html` with `nav_order: 7`, linked to by Task 3. Its own links point to `production-releases.html` and `troubleshooting.html` (same folder).

- [ ] **Step 1: Confirm the target file does not exist yet (pre-check)**

Run: `ls docs/build-and-distribution/store-submission.md 2>&1`
Expected: `No such file or directory`.

- [ ] **Step 2: Create the English page**

Write `docs/build-and-distribution/store-submission.md` with exactly:

````markdown
---
title: Store Submission
parent: Build & Distribution
nav_order: 7
---

# Store Submission

`eas submit` only **uploads** the binary. On both stores the uploaded build
lands in a holding area — TestFlight on iOS, a track on Google Play — and does
**nothing** on its own. To go live you still open the web console, attach the
build to a release, complete the required metadata, and submit it for
**review**.

In one line: **production = upload (`eas submit`) + a console release + an
approved review.**

This page picks up exactly where [Production Releases](production-releases.html)
leaves off. Each store has two flows: the **first production release** (a long,
once-per-app setup) and every **update** afterwards (a short loop).

## App Store Connect

Uploading a build and shipping it are two different things. The same build you
`eas submit` shows up under **TestFlight** and can reach TestFlight testers
within minutes — but the **public App Store** always requires creating a version
and submitting it **for review**.

### First production release (once per app)

The first release is front-loaded with one-time setup. Steps 1–3 are the tedious
part you never touch again; steps 4–6 are the actual "ship it".

1. **Create the app record.** App Store Connect → **My Apps** → **+** → **New
   App**. Set platform, name, primary language, **bundle ID**, and an SKU. The
   bundle ID must match the one in `app.json` / `eas.json`.

   {: .note }
   The bundle ID dropdown only lists identifiers Apple already knows about. If
   yours isn't there, the App ID hasn't been registered yet — that's a
   credentials/provisioning issue, not something you fix on this screen.

2. **Wait for the build to finish processing.** After `eas submit` the build
   appears under **TestFlight** marked *Processing* — usually a few minutes, up
   to ~1 hour. It also has to clear **export compliance** before you can attach
   it to a version.

3. **Complete the first-time-only metadata.** The store won't let you submit
   until every required item is filled in. Work through this checklist (each
   lives in the app's sidebar):
   - **App Privacy** — the data-collection questionnaire. Declare what data the
     app collects and why. Required; you can't submit without it.
   - **Age rating** — a short questionnaire that produces the rating.
   - **Category** and **Pricing & Availability** — primary category, price tier
     (or free), and countries.
   - **App Review Information** — a **demo account** (if the app has a login) and
     a contact. A missing demo account is a top cause of rejection.
   - **Screenshots** — the required device sizes (at minimum a 6.7" iPhone).
     Missing a required size blocks submission.
   - **Description, keywords, support URL** — the store-listing text.

4. **Create the version and attach the build.** Open the **1.0 Prepare for
   Submission** page → **Build** section → **(+)** → pick the build that finished
   processing in step 2.

5. **Submit for Review.** Answer the export-compliance and IDFA (advertising
   identifier) prompts. Status moves **Waiting for Review → In Review → Pending
   Developer Release** (or **Ready for Sale**).

6. **Release.** Choose how the approved build goes live:
   - **Manually release this version** — recommended for the first launch, so you
     press the button when you're ready.
   - **Automatically release** — goes live the moment review approves.

### Updates (the short loop)

Once the app exists, shipping a new version is quick — the metadata from the
first release carries over.

1. Bump the version/build number (if you use `autoIncrement` in `eas.json`, the
   build number is handled for you).
2. `eas submit` → wait for the build to finish processing in TestFlight.
3. App Store Connect → **(+ Version or Platform)** → enter the new version string
   (e.g. `1.1`).
4. Fill in **What's New in This Version** and select the new build.
5. Turn on **Phased Release** — it rolls the update out to existing users over 7
   days instead of all at once. You can pause it, or release to everyone
   immediately, from the same screen.
6. **Submit for Review.**

{: .note }
**Still says "Processing"?** A build can sit in *Processing* for up to an hour,
and occasionally Apple emails you about a missing compliance answer. If a build
never becomes selectable, check your email and the build's detail page — it
usually needs one manual answer first.

## Google Play

Google Play works differently from Apple in three ways that trip up people who
learned iOS first:

- **Releases live in tracks.** *Internal testing → Closed testing → Open testing
  → Production.* `eas submit` uploads the AAB; you then create a **release** on a
  track and roll it out. Production is just the last track.
- **Play App Signing.** The first time, Google enrolls your app in Play App
  Signing and manages the signing key. This is normally automatic.
- **The first review is slow.** Google's initial review can take **days**, not
  hours.

{: .warning }
Plan the first Android submission with buffer. Unlike a routine update, the very
first review is slow, and a brand-new **personal** developer account may need a
period of closed testing with real testers before it can publish to Production at
all.

### First production release (once per app)

1. **Create the app.** Play Console → **Create app**. Set the name, default
   language, app-or-game, free-or-paid, and accept the declarations.

2. **Complete the "Set up your app" checklist.** The Dashboard lists everything
   the store requires before you can publish. Work through it:
   - **App access** — a demo login if any part of the app is behind auth.
   - **Ads** — declare whether the app contains ads.
   - **Content rating** — the questionnaire that produces the rating.
   - **Target audience and content** — the age groups the app targets.
   - **Data safety** — Google's data-collection form (the equivalent of Apple's
     App Privacy). Required.
   - **Privacy policy** — a URL is mandatory.
   - **Store listing** — title, short and full descriptions, screenshots, app
     icon, and the **feature graphic** (1024×500).
   - **Countries and pricing.**

3. **Confirm the AAB uploaded.** After `eas submit` the bundle shows up under the
   target track, or in **App bundle explorer**. `eas submit` for Android needs a
   Google Play **service-account key** — that one-time setup is covered in
   [Production Releases](production-releases.html); EAS walks you through it.

4. **Create the production release.** **Production** (left nav) → **Create new
   release**. Select the AAB you uploaded (or promote one from a testing track),
   then set the release name and **release notes**.

5. **Roll it out.** **Review release** → **Start rollout to Production**. Use a
   **staged rollout percentage** (Play's version of phased release) — e.g. start
   at 20% of users.

6. **Wait for review.** Status goes **In review → Live**. The first submission is
   the slow one; later updates are much faster.

### Updates (the short loop)

1. `eas submit` → the new AAB uploads.
2. **Production** → **Create new release** → select the new AAB.
3. Write **release notes** (per language, inside `<en-US>…</en-US>` blocks).
4. Set the **staged rollout %** (e.g. 20%), then **Start rollout**.
5. **Manage the rollout afterwards** — from the same Production screen you can
   bump the percentage, or **halt the rollout** if something's wrong. The rest of
   the metadata carries over; you usually only touch notes and rollout.

{: .warning }
Never `eas submit` a **preview** (ad-hoc) build to either store — the store
rejects it. Always build and submit the **production** profile. See the
[Troubleshooting](troubleshooting.html) table for the exact error.

## Apple ↔ Google, side by side

If you know one platform, this maps the concepts to the other:

| Concept | App Store Connect | Google Play |
| --- | --- | --- |
| Where an uploaded build lands | TestFlight | A track (Internal / Closed / Open / Production) |
| Gradual rollout to users | Phased Release (7 days) | Staged rollout (% you choose) |
| Data-collection disclosure | App Privacy | Data safety |
| Content/age rating | Age rating questionnaire | Content rating questionnaire |
| What "go live" needs | Version + Submit for Review | Release on Production + rollout |

## See also

- [Production Releases](production-releases.html) — the CLI half (`eas build` +
  `eas submit`).
- [Troubleshooting](troubleshooting.html) — common submit/build errors.
````

- [ ] **Step 3: Verify the page has the required structure**

Run: `grep -n "nav_order: 7\|## App Store Connect\|## Google Play\|First production release\|### Updates\|production-releases.html\|troubleshooting.html" docs/build-and-distribution/store-submission.md`
Expected: matches for `nav_order: 7`, both `##` platform headings, two `First production release`, two `### Updates`, and the two internal links.

- [ ] **Step 4: Verify no secrets leaked into the page**

Run: `grep -niE "service.account|api.key|-----BEGIN|password|secret[\"' :=]" docs/build-and-distribution/store-submission.md`
Expected: only the prose mention "service-account key" (a noun, no value). No key material, no credentials.

- [ ] **Step 5: Commit**

```bash
git add docs/build-and-distribution/store-submission.md
git commit -m "docs: add Store Submission page — App Store Connect + Google Play console steps (EN)"
```

---

### Task 2: Create the Spanish Store Submission mirror

**Files:**
- Create: `es/docs/build-and-distribution/store-submission.md`

**Interfaces:**
- Consumes: the EN page from Task 1 as the structure to mirror, section for section.
- Produces: a page at `/es/docs/build-and-distribution/store-submission.html` with `nav_order: 7`, linked to by Task 3's Spanish pointer.

- [ ] **Step 1: Confirm the target file does not exist yet (pre-check)**

Run: `ls es/docs/build-and-distribution/store-submission.md 2>&1`
Expected: `No such file or directory`.

- [ ] **Step 2: Create the Spanish page**

Write `es/docs/build-and-distribution/store-submission.md` with exactly:

````markdown
---
title: Publicación en las Tiendas
parent: Compilación y Distribución
nav_order: 7
---

# Publicación en las Tiendas

`eas submit` solo **sube** el binario. En las dos tiendas el build queda en una
zona de espera — TestFlight en iOS, un track en Google Play — y no hace **nada**
por sí solo. Para que salga a producción todavía tenés que entrar a la consola
web, asociar el build a un release, completar los metadatos requeridos y
enviarlo a **revisión**.

En una línea: **producción = subir (`eas submit`) + un release en la consola +
una revisión aprobada.**

Esta página arranca justo donde termina
[Lanzamientos a Producción](production-releases.html). Cada tienda tiene dos
flujos: el **primer release a producción** (una configuración larga, una sola vez
por app) y cada **actualización** posterior (un ciclo corto).

## App Store Connect

Subir un build y publicarlo son dos cosas distintas. El mismo build que subís con
`eas submit` aparece en **TestFlight** y les puede llegar a los testers de
TestFlight en minutos — pero llegar a la **App Store pública** siempre requiere
crear una versión y enviarla **a revisión**.

### Primer release a producción (una vez por app)

El primer release tiene toda la configuración inicial de una sola vez. Los pasos
1 a 3 son la parte tediosa que no volvés a tocar; los pasos 4 a 6 son el "mandarlo
de verdad".

1. **Creá el registro de la app.** App Store Connect → **My Apps** → **+** →
   **New App**. Poné plataforma, nombre, idioma principal, **bundle ID** y un
   SKU. El bundle ID tiene que coincidir con el de `app.json` / `eas.json`.

   {: .note-title }
   Nota

   {: .note }
   El desplegable de bundle ID solo lista identificadores que Apple ya conoce. Si
   el tuyo no está, el App ID todavía no fue registrado — eso es un tema de
   credenciales/provisioning, no algo que se arregle en esta pantalla.

2. **Esperá a que el build termine de procesarse.** Después de `eas submit` el
   build aparece en **TestFlight** como *Processing* — normalmente unos minutos,
   hasta ~1 hora. Además tiene que pasar el **export compliance** antes de que
   puedas asociarlo a una versión.

3. **Completá los metadatos de una sola vez.** La tienda no te deja enviar hasta
   que esté todo lo requerido. Recorré esta checklist (cada ítem vive en la barra
   lateral de la app):
   - **App Privacy** — el cuestionario de recolección de datos. Declarás qué
     datos junta la app y para qué. Es obligatorio; sin esto no podés enviar.
   - **Age rating** — un cuestionario corto que genera la clasificación.
   - **Category** y **Pricing & Availability** — categoría principal, precio (o
     gratis) y países.
   - **App Review Information** — una **cuenta de prueba** (si la app tiene login)
     y un contacto. Que falte la cuenta de prueba es una de las causas más
     comunes de rechazo.
   - **Screenshots** — los tamaños de dispositivo requeridos (como mínimo un
     iPhone de 6.7"). Que falte un tamaño requerido bloquea el envío.
   - **Description, keywords, support URL** — los textos de la ficha.

4. **Creá la versión y asociá el build.** Abrí la página **1.0 Prepare for
   Submission** → sección **Build** → **(+)** → elegí el build que terminó de
   procesarse en el paso 2.

5. **Enviá a revisión (Submit for Review).** Respondé los prompts de export
   compliance e IDFA (identificador de publicidad). El estado pasa por **Waiting
   for Review → In Review → Pending Developer Release** (o **Ready for Sale**).

6. **Publicá (Release).** Elegí cómo sale a producción el build aprobado:
   - **Manually release this version** — recomendado para el primer lanzamiento,
     así apretás el botón cuando estés listo.
   - **Automatically release** — sale en cuanto la revisión aprueba.

### Actualizaciones (el ciclo corto)

Una vez que la app existe, sacar una versión nueva es rápido — los metadatos del
primer release se mantienen.

1. Subí el número de versión/build (si usás `autoIncrement` en `eas.json`, el
   número de build se maneja solo).
2. `eas submit` → esperá a que el build termine de procesarse en TestFlight.
3. App Store Connect → **(+ Version or Platform)** → poné el nuevo número de
   versión (ej. `1.1`).
4. Completá **What's New in This Version** y seleccioná el nuevo build.
5. Activá **Phased Release** — despliega la actualización a los usuarios
   existentes durante 7 días en vez de todos de golpe. Desde la misma pantalla
   podés pausarlo, o publicar a todos de una.
6. **Enviá a revisión (Submit for Review).**

{: .note-title }
¿Sigue en "Processing"?

{: .note }
Un build puede quedar en *Processing* hasta una hora, y a veces Apple te manda un
mail por una respuesta de compliance que falta. Si un build nunca se vuelve
seleccionable, revisá tu mail y la página de detalle del build — normalmente
necesita una respuesta manual primero.

## Google Play

Google Play funciona distinto a Apple en tres cosas que confunden a quienes
aprendieron iOS primero:

- **Los releases viven en tracks.** *Internal testing → Closed testing → Open
  testing → Production.* `eas submit` sube el AAB; después vos creás un
  **release** en un track y lo desplegás. Production es simplemente el último
  track.
- **Play App Signing.** La primera vez, Google inscribe tu app en Play App
  Signing y administra la clave de firma. Esto suele ser automático.
- **La primera revisión es lenta.** La revisión inicial de Google puede tardar
  **días**, no horas.

{: .warning-title }
Advertencia

{: .warning }
Planificá el primer envío de Android con margen. A diferencia de una
actualización de rutina, la primera revisión es lenta, y una cuenta de
desarrollador **personal** nueva puede necesitar un período de closed testing con
testers reales antes de poder publicar a Production.

### Primer release a producción (una vez por app)

1. **Creá la app.** Play Console → **Create app**. Poné el nombre, el idioma por
   defecto, app-o-juego, gratis-o-paga, y aceptá las declaraciones.

2. **Completá la checklist "Set up your app".** El Dashboard lista todo lo que la
   tienda exige antes de poder publicar. Recorrelo:
   - **App access** — un login de prueba si alguna parte de la app está detrás de
     autenticación.
   - **Ads** — declarás si la app tiene publicidad.
   - **Content rating** — el cuestionario que genera la clasificación.
   - **Target audience and content** — los grupos de edad a los que apunta la
     app.
   - **Data safety** — el formulario de recolección de datos de Google (el
     equivalente del App Privacy de Apple). Obligatorio.
   - **Privacy policy** — la URL es obligatoria.
   - **Store listing** — título, descripciones corta y larga, screenshots, ícono
     y el **feature graphic** (1024×500).
   - **Countries and pricing** — países y precios.

3. **Confirmá que el AAB se subió.** Después de `eas submit` el bundle aparece en
   el track de destino, o en el **App bundle explorer**. `eas submit` para
   Android necesita una **service-account key** de Google Play — esa
   configuración de una sola vez está en
   [Lanzamientos a Producción](production-releases.html); EAS te guía para
   hacerla.

4. **Creá el release de producción.** **Production** (nav izquierdo) → **Create
   new release**. Seleccioná el AAB que subiste (o promové uno desde un track de
   testing), y poné el nombre del release y las **release notes**.

5. **Desplegalo.** **Review release** → **Start rollout to Production**. Usá un
   **staged rollout percentage** (la versión de Play del phased release) — ej.
   empezá con el 20% de los usuarios.

6. **Esperá la revisión.** El estado pasa de **In review** a **Live**. El primer
   envío es el lento; las actualizaciones después son mucho más rápidas.

### Actualizaciones (el ciclo corto)

1. `eas submit` → se sube el nuevo AAB.
2. **Production** → **Create new release** → seleccioná el nuevo AAB.
3. Escribí las **release notes** (por idioma, dentro de bloques
   `<en-US>…</en-US>`).
4. Poné el **staged rollout %** (ej. 20%) y **Start rollout**.
5. **Gestioná el rollout después** — desde la misma pantalla de Production podés
   subir el porcentaje, o **frenar el rollout** (halt) si algo salió mal. El
   resto de los metadatos se mantienen; normalmente solo tocás las notas y el
   rollout.

{: .warning-title }
Advertencia

{: .warning }
Nunca hagas `eas submit` de un build **preview** (ad-hoc) a ninguna tienda — la
tienda lo rechaza. Siempre compilá y enviá el profile **production**. Ver la
tabla de [Solución de Problemas](troubleshooting.html) para el error exacto.

## Apple ↔ Google, lado a lado

Si conocés una plataforma, esto mapea los conceptos a la otra:

| Concepto | App Store Connect | Google Play |
| --- | --- | --- |
| Dónde cae un build subido | TestFlight | Un track (Internal / Closed / Open / Production) |
| Despliegue gradual a usuarios | Phased Release (7 días) | Staged rollout (% que elegís) |
| Declaración de datos | App Privacy | Data safety |
| Clasificación de contenido/edad | Age rating (cuestionario) | Content rating (cuestionario) |
| Qué necesita para "salir" | Versión + Submit for Review | Release en Production + rollout |

## Ver también

- [Lanzamientos a Producción](production-releases.html) — la mitad del CLI
  (`eas build` + `eas submit`).
- [Solución de Problemas](troubleshooting.html) — errores comunes de
  submit/build.
````

- [ ] **Step 3: Verify the Spanish page mirrors the English structure**

Run: `grep -n "nav_order: 7\|## App Store Connect\|## Google Play\|Primer release a producción\|### Actualizaciones\|production-releases.html\|troubleshooting.html" es/docs/build-and-distribution/store-submission.md`
Expected: matches for `nav_order: 7`, both `##` platform headings, two `Primer release a producción`, two `### Actualizaciones`, and the two internal links.

- [ ] **Step 4: Verify no secrets leaked into the page**

Run: `grep -niE "service.account|api.key|-----BEGIN|password|secret[\"' :=]" es/docs/build-and-distribution/store-submission.md`
Expected: only the prose mention "service-account key". No key material, no credentials.

- [ ] **Step 5: Commit**

```bash
git add es/docs/build-and-distribution/store-submission.md
git commit -m "docs: add Store Submission page (ES mirror)"
```

---

### Task 3: Wire the new page into nav and cross-links (EN + ES)

**Files:**
- Modify: `docs/build-and-distribution/production-releases.md`
- Modify: `es/docs/build-and-distribution/production-releases.md`
- Modify: `docs/build-and-distribution/troubleshooting.md:4` (nav_order 7 → 8)
- Modify: `es/docs/build-and-distribution/troubleshooting.md:4` (nav_order 7 → 8)
- Modify: `docs/build-and-distribution/cheat-sheet.md:4` (nav_order 8 → 9)
- Modify: `es/docs/build-and-distribution/cheat-sheet.md:4` (nav_order 8 → 9)

**Interfaces:**
- Consumes: the pages created in Tasks 1 and 2 (`store-submission.html`), which take `nav_order: 7`.
- Produces: a Build & Distribution nav ordered concepts(1) … production-releases(6), store-submission(7), troubleshooting(8), cheat-sheet(9), plus a pointer link from each Production Releases page.

- [ ] **Step 1: Renumber troubleshooting and cheat-sheet to free up nav_order 7**

Run: `sed -i '' 's/^nav_order: 7$/nav_order: 8/' docs/build-and-distribution/troubleshooting.md es/docs/build-and-distribution/troubleshooting.md && sed -i '' 's/^nav_order: 8$/nav_order: 9/' docs/build-and-distribution/cheat-sheet.md es/docs/build-and-distribution/cheat-sheet.md`

- [ ] **Step 2: Verify the nav_order values are now contiguous with no duplicates**

Run: `for f in docs/build-and-distribution/*.md es/docs/build-and-distribution/*.md; do grep -H nav_order "$f"; done | sort -t: -k1`
Expected: within each language folder, `nav_order` is 1,2,3,4,5,6,8,9 across the existing pages (7 is now free for store-submission, added in Tasks 1–2), with no duplicates. Specifically troubleshooting = 8 and cheat-sheet = 9 in both EN and ES.

- [ ] **Step 3: Add the pointer into the EN Production Releases page**

In `docs/build-and-distribution/production-releases.md`, find the final `{: .note }` block (the cloud-build note ending with `--latest`). Insert the following **immediately before** that `{: .note }` line, as its own paragraph:

```markdown
Once `eas submit` finishes, the build is uploaded but **not live** — it's sitting
in TestFlight (iOS) or a Play track (Android). See
[Store Submission](store-submission.html) for the console steps that take it to
production.

```

- [ ] **Step 4: Add the pointer into the ES Production Releases page**

In `es/docs/build-and-distribution/production-releases.md`, find the final `{: .note-title }` block (the cloud-build note). Insert the following **immediately before** that `{: .note-title }` line, as its own paragraph:

```markdown
Cuando `eas submit` termina, el build está subido pero **no publicado** — queda
en TestFlight (iOS) o en un track de Play (Android). Ver
[Publicación en las Tiendas](store-submission.html) para los pasos en la consola
que lo llevan a producción.

```

- [ ] **Step 5: Verify both pointers are present**

Run: `grep -n "store-submission.html" docs/build-and-distribution/production-releases.md es/docs/build-and-distribution/production-releases.md`
Expected: one match in each file.

- [ ] **Step 6: Commit**

```bash
git add docs/build-and-distribution/production-releases.md es/docs/build-and-distribution/production-releases.md docs/build-and-distribution/troubleshooting.md es/docs/build-and-distribution/troubleshooting.md docs/build-and-distribution/cheat-sheet.md es/docs/build-and-distribution/cheat-sheet.md
git commit -m "docs: link Production Releases to new Store Submission page and renumber nav (EN+ES)"
```

---

### Task 4: Build the site and verify the pages render

**Files:**
- None modified — this task only builds and inspects output.

**Interfaces:**
- Consumes: everything from Tasks 1–3.

- [ ] **Step 1: Build the site with Homebrew Ruby**

Run:
```bash
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
bundle exec jekyll build
```
Expected: build completes with `done in N seconds` and no `Liquid Exception` / `Error:` lines.

- [ ] **Step 2: Verify both pages were generated**

Run: `ls _site/docs/build-and-distribution/store-submission.html _site/es/docs/build-and-distribution/store-submission.html`
Expected: both files exist.

- [ ] **Step 3: Verify the cross-links resolve to real files (no broken .html targets)**

Run: `ls _site/docs/build-and-distribution/{store-submission,production-releases,troubleshooting}.html _site/es/docs/build-and-distribution/{store-submission,production-releases,troubleshooting}.html`
Expected: all six files exist (every target of an internal link on the new pages is a real generated page).

- [ ] **Step 4: Verify the built pages contain the expected content**

Run: `grep -l "Apple ↔ Google" _site/docs/build-and-distribution/store-submission.html _site/es/docs/build-and-distribution/store-submission.html`
Expected: both built pages match (the comparison table rendered).

- [ ] **Step 5: Final commit (only if the build produced tracked changes)**

`_site/` may be git-ignored. Check first:

Run: `git status --porcelain`

If `_site/` changes appear and `_site/` is tracked, commit them:
```bash
git add _site
git commit -m "chore: rebuild site with Store Submission page"
```
If `git status` is clean or only shows ignored files, skip this step — the work from Tasks 1–3 is already committed.

---

## Self-Review

**Spec coverage:**
- New dedicated Store Submission page (EN + ES) → Tasks 1, 2.
- First-release AND update flows per platform → both `### First production release` and `### Updates` sections in Tasks 1/2.
- Pointer from Production Releases at the upload-but-not-live spot → Task 3 Steps 3–4.
- Depth rule (release mechanics = numbered steps; first-time metadata = annotated checklist) → checklists in step 3 (iOS) and step 2 (Android); numbered mechanics elsewhere.
- Cross-cutting: "still processing" notes → Task 1/2 iOS note; slow-first-review + new-account warning → Google Play warning; never-submit-preview warning linking troubleshooting → Google Play closing warning; Apple↔Google table → both pages; links out + no secrets → Tasks 1/2 Steps 3–4.
- House style (primers, callouts, Rioplatense ES, manual callout-title syntax) → EN uses `{: .note }`/`{: .warning }`; ES uses `{: .note-title }`/`{: .warning-title }`.
- Non-goals (IAP, server notifications, custom listings, re-documenting service-account key/CLI) → none of these appear; service-account key is cross-linked, not re-documented.
- Nav placement after Production Releases without collision → Task 3 renumber (troubleshooting 7→8, cheat-sheet 8→9).
- Jekyll build + verification → Task 4.

**Placeholder scan:** No TBD/TODO; every page's full markdown is inline; all commands and expected outputs are concrete.

**Type consistency:** Internal links use bare `.html` filenames consistently (`production-releases.html`, `troubleshooting.html`, `store-submission.html`); `nav_order: 7` for the new pages matches the renumber in Task 3; front-matter `parent` values match the existing EN ("Build & Distribution") and ES ("Compilación y Distribución") pages.
