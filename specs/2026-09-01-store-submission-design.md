# Store Submission — console steps to get to production

- Status: Approved (2026-09-01)
- Author: Claude (with matias)

## Context

`docs/build-and-distribution/production-releases.md` documents the **CLI half**
of a production release — `eas build --profile production` + `eas submit` — for
both iOS and Android. It then stops at one sentence ("From App Store Connect you
then send the build to TestFlight or to review") and never explains what to
actually do **in the web consoles** (App Store Connect and Google Play) to move
the app from "build uploaded" to "live in the store".

That gap is the whole point of this work. `eas submit` only **uploads** the
binary. On both stores the uploaded build sits in a holding area (TestFlight /
Play track) and does nothing until a human, in the console, attaches it to a
release, completes the required metadata, and submits it for **review**.
Production = upload + console release + review approval.

This is a documentation-only change on a bilingual Jekyll site. Every English
page under `docs/` has a Spanish mirror under `es/docs/`, file for file, and the
`es/` tree uses the manual callout-title syntax (`{: .note-title }` etc.).

## Goals

- Add a new dedicated page, **Store Submission**, under Build & Distribution
  that documents the console steps for both platforms.
- Cover **both** scenarios per platform: the **first production release** (once
  per app — create the listing, complete first-time metadata, submit for review)
  and **subsequent updates** (the short loop).
- Keep `production-releases.md` focused on the CLI, and add a one-line pointer
  from it into the new page at the exact spot where the build is uploaded but
  not yet live.
- Match the house style: a short "why you have to do this" primer, numbered
  release-mechanics steps, annotated checklists for first-time metadata, Jekyll
  callouts, and Rioplatense Spanish in the `es/` mirror.
- Keep English and Spanish content in sync, file for file.

## Non-goals

- In-app purchases / subscription product setup.
- App Store Server Notifications / Play real-time developer notifications.
- Custom store listings, A/B store-listing experiments, pre-orders.
- Re-documenting `eas build` / `eas submit` mechanics or the Google Play
  service-account key — those live in `production-releases.md` and are linked to,
  not duplicated.
- Field-by-field walkthroughs of Apple/Google metadata forms — these are
  redesigned constantly by the stores; the page uses annotated checklists that
  link to the official pages instead (see Depth rule).

## Placement & nav

- New files:
  - `docs/build-and-distribution/store-submission.md`
  - `es/docs/build-and-distribution/store-submission.md`
- Front matter: `parent: Build & Distribution`, `nav_order: 7` (EN) /
  `parent: Compilación y Distribución`, `nav_order: 7` (ES). Production Releases
  is `nav_order: 6`, so this lands right after it.
- Pointer added into `production-releases.md` (and its `es/` mirror), right after
  the `eas submit` commands: once `eas submit` finishes, the build is uploaded
  but **not live** — link to Store Submission for the console steps.

## Depth rule

- **Release mechanics** → full numbered step-by-step (create app → wait for
  processing → attach build → version → release notes → submit → rollout).
  These are stable and are the actual "how do I ship" answer.
- **First-time-only metadata** (App Privacy / Data Safety, content/age rating,
  screenshots, pricing) → **annotated checklist**: what each item is, why the
  store blocks you without it, and the common gotcha — not a field-by-field
  walkthrough. Each checklist item links to the official page rather than
  duplicating a form that will be redesigned in a month.

## Page structure

### Opening primer

The `eas submit`-only-uploads mental model (from Context), plus the production
formula: upload + console release + review approval.

### App Store Connect

Short primer: what "sending a build to review" means, and the TestFlight vs App
Store distinction — the same uploaded build can reach TestFlight testers
immediately, but the public store always requires a review submission.

**First production release (once per app):**

1. **Create the app record** — App Store Connect → My Apps → **+** → New App
   (platform, name, primary language, **bundle ID** matching `eas.json` /
   `app.json`, SKU). Gotcha: the bundle ID dropdown is populated from
   identifiers Apple already knows; if it's missing, it's an App IDs /
   provisioning issue, not an ASC one.
2. **Wait for the build to process** — after `eas submit` the build shows under
   **TestFlight** as "Processing" for a few minutes to ~1 hour and must clear
   export compliance before it can be attached to a release.
3. **First-time-only metadata checklist** (annotated, links out): App Privacy
   ("Data collection" questionnaire), Age rating, Category, Pricing &
   Availability, App Review Information (demo account + contact), screenshots
   (required sizes), description / keywords / support URL.
4. **Create the version & attach the build** — the "1.0 Prepare for Submission"
   page → Build section → pick the processed build.
5. **Submit for Review** — answer export-compliance / IDFA prompts → status
   moves Waiting for Review → In Review → Pending Developer Release / Ready for
   Sale.
6. **Release** — manual release (recommended for the first one) vs automatic on
   approval.

**Subsequent updates (short loop):**

1. Bump version/build (note `autoIncrement` if used).
2. `eas submit` → wait for processing.
3. ASC → **+ Version** → new version string.
4. Fill **What's New**, select the new build.
5. **Phased Release** toggle (7-day gradual rollout) — recommended on; note how
   to pause/expedite.
6. Submit for Review. Metadata from the first release carries over; you usually
   only touch What's New + the build.

### Google Play

Short primer on the three ways Play differs from Apple (trips up iOS-first
people): releases live in **tracks** (Internal → Closed → Open → Production) and
you promote a build into a track; first app also enrolls in **Play App Signing**
(usually auto the first time); Google's first review is noticeably slower (days)
and new personal developer accounts have extra testing requirements — a warning
callout.

**First production release (once per app):**

1. **Create the app** — Play Console → Create app (name, default language,
   app/game, free/paid, declarations).
2. **Complete the "Set up your app" / Dashboard checklist** (annotated, links
   out): App access (demo login if gated), Ads declaration, Content rating,
   Target audience, **Data safety** form, Privacy policy URL, Store listing
   (title, descriptions, graphics/screenshots, feature graphic),
   countries/pricing.
3. **Confirm the AAB landed** — after `eas submit` the bundle appears under the
   target track (or App bundle explorer). Cross-link the service-account key
   requirement to `production-releases.md`; do not repeat it.
4. **Create the production release** — Production → Create new release → select
   the uploaded AAB (or promote from a testing track) → release name + notes.
5. **Rollout** — Review → Start rollout to Production, with **staged rollout %**
   (Play's equivalent of phased release).
6. **Wait for review** — status In review → Live. The first submission is the
   slow one.

**Subsequent updates (short loop):**

1. `eas submit` → AAB uploads.
2. Production → Create new release → pick the new AAB.
3. Release notes (per-language `<en-US>…</en-US>` blocks).
4. Set staged rollout % (e.g. start at 20%), then Start rollout.
5. **Manage the rollout later** — bump the % or **halt rollout** from the same
   screen if something's wrong. Metadata carries over; you usually only touch
   notes + rollout.

### Cross-cutting elements

- A **"still says Processing / not showing up?"** troubleshooting note on each
  platform (the most common real blocker).
- **Warnings:** iOS export-compliance prompt; Play's slower first review +
  new-account testing requirements; never submit a `preview` / ad-hoc build
  (link the existing troubleshooting row in `troubleshooting.md`).
- **Apple ↔ Google equivalents** table: TestFlight ↔ Internal testing, Phased
  Release ↔ Staged rollout, App Privacy ↔ Data Safety, Age rating ↔ Content
  rating.
- **Links out:** to Production Releases (the CLI half); the pointer added into
  Production Releases pointing here.
- House rule: no secrets, keys, or credentials written anywhere.

## Doc changes (English + `es/` mirror, file for file)

1. **New** `docs/build-and-distribution/store-submission.md` — the full page
   above, English.
2. **New** `es/docs/build-and-distribution/store-submission.md` — the same page
   in Rioplatense Spanish (vos/podés/tenés), manual callout-title syntax,
   translating prose while leaving code, file names, command names, and console
   UI labels recognizable (keep the English console label with a short gloss
   where helpful, since the consoles' Spanish UI varies).
3. **Edit** `docs/build-and-distribution/production-releases.md` — add the
   one-line pointer into Store Submission after the `eas submit` commands.
4. **Edit** `es/docs/build-and-distribution/production-releases.md` — same
   pointer, in Spanish.

## Testing / verification

- `bundle exec jekyll build` succeeds with no new Liquid errors.
- Local `jekyll serve` spot check:
  - `/docs/build-and-distribution/store-submission.html` and its `/es/`
    counterpart render, appear in the Build & Distribution nav right after
    Production Releases, and show both the first-release and update flows for
    each platform.
  - `/docs/build-and-distribution/production-releases.html` (and `/es/`) show the
    new pointer link to Store Submission.
- Grep check: the Store Submission page links to `production-releases` and to the
  `troubleshooting` ad-hoc row; no secrets/keys are present in either language
  file.
