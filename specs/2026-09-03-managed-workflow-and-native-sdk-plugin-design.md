# Managed Workflow Default + Native SDK Config Plugin Pattern

- Status: Approved (2026-09-03)
- Author: Claude (with matias)

## Context

Two related gaps in `react-native-guidelines`, tracked as **G1** and **G2**:

**G1.** `docs/getting-started/create-or-clone.md` currently takes a neutral
stance on native folders: "Some projects commit the `ios/` and `android/`
folders (the 'bare' workflow); others generate them on demand with
`npx expo prebuild`. Either is fine — just know which one you're in." The team
wants to stop being neutral: **managed workflow with Continuous Native
Generation (CNG)** is the default, and `ios/`/`android/` are never committed.
That existing note directly contradicts the new default and needs to change,
not just gain a link.

**G2.** The guideline has no answer for the case where a project needs a
native SDK that has no first-party or community Expo config plugin — common
for vendor SDKs (KYC/identity verification, payments, etc.) that only ship
native (CocoaPods / Gradle / Info.plist / AndroidManifest) install
instructions. Without a documented pattern, the natural-seeming fallback is to
eject to bare or hand-commit `ios/`/`android/`, which undoes G1's default. The
actual pattern used on a real internal project (referred to as "T5", using the
Sumsub SDK as the motivating example) is a **local config plugin**
(`plugins/with<Sdk>.js`) that applies the native install steps
programmatically so `expo prebuild` keeps producing a correct native project.
This page documents the pattern generically — using Sumsub only as the
narrative/motivating case, not as a source of real, verified native
integration snippets (those aren't available to document accurately and would
go stale against Sumsub's own SDK updates).

This is a documentation-only change on a bilingual Jekyll site
(`just-the-docs` theme). Every English page under `docs/` has a Spanish mirror
under `es/docs/`, file for file; the `es/` tree uses the manual callout-title
syntax (`{: .note-title }` etc.).

## Goals

- Add `docs/getting-started/managed-workflow.md` (+ `es/` mirror): declare
  managed workflow / CNG as the team default, explain the day-to-day
  implications, and point to G2 as the answer for native code a config plugin
  doesn't cover — instead of bare/eject.
- Add `docs/architecture/native-sdks-without-plugins.md` (+ `es/` mirror):
  document the local config-plugin pattern generically, with Sumsub named as
  the real-world motivating case but no fabricated Sumsub-specific native
  values.
- Rewrite the "A note on native folders" section in `create-or-clone.md` (+
  `es/` mirror) to align with the new default instead of presenting bare and
  managed as equally valid, and link to the new G1 page.
- Add `/ios` and `/android` to the reference `.gitignore` block in
  `create-or-clone.md` (+ `es/` mirror), consistent with "generated, never
  committed."
- Add three glossary terms to `docs/reference.md` (+ `es/` mirror): **CNG**,
  **Config plugin**, **Prebuild**.
- Cross-link G1 ↔ G2, and G2 → `environment-config/build-time-config.md`
  (existing dynamic `app.config.ts` pattern).

## Non-goals

- No Architecture Decision Record. This is a guideline-level default, not a
  decision by a project consuming the guideline (ADRs are for the latter — see
  `docs/architecture/decision-records.md`).
- No changes to `docs/build-and-distribution/concepts.md` — it doesn't mention
  prebuild/managed today and isn't where this default belongs.
- No real, verified Sumsub native integration details (exact Info.plist keys,
  Gradle coordinates, minSdkVersion, permissions). The config-plugin example is
  schematic/placeholder, explicitly labeled as such, pointing readers to the
  SDK vendor's own native install docs for real values.
- No migration tooling or step-by-step guide for converting an existing bare
  project to managed — G1 only notes that this is a deliberate, separately
  planned change, not something to do as a side effect of unrelated work.

## Placement & nav

- New files:
  - `docs/getting-started/managed-workflow.md` — `parent: Getting Started`,
    `nav_order: 3`.
  - `es/docs/getting-started/managed-workflow.md` — `parent: Primeros Pasos`,
    `nav_order: 3`.
  - `docs/architecture/native-sdks-without-plugins.md` — `parent: Project
    Architecture`, `nav_order: 4`.
  - `es/docs/architecture/native-sdks-without-plugins.md` — `parent:
    Arquitectura del Proyecto`, `nav_order: 4`.
- Renumbering in `docs/getting-started/` (+ `es/` mirror): `environment-variables.md`
  moves from `nav_order: 3` to `4`; `running-the-app.md` moves from `4` to `5`.
  `prerequisites.md` (1) and `create-or-clone.md` (2) are unchanged.
- `docs/architecture/decision-records.md` (`nav_order: 3`) and earlier
  siblings are unchanged; the new page takes `4`.

## Page: Managed Workflow (CNG)

1. **Opening declaration** — the team default is the Expo managed workflow
   with Continuous Native Generation: `ios/` and `android/` are never
   committed. They're generated on demand by `npx expo prebuild` locally, or
   transparently by EAS Build in the cloud.
2. **Why** — committed native folders produce unreadable native diffs in PRs,
   create a second source of truth (hand-edited native files vs. JS config)
   that drifts from `app.config.ts`, and make onboarding depend on which
   workflow a given clone happens to be in.
3. **Day to day** — native identifiers, permissions, and deep-link schemes are
   changed in `app.config.ts` / config plugins, not in Xcode / Android Studio.
   `npx expo prebuild --clean` regenerates native projects locally when you
   need to inspect or run one; treat the output as disposable — never commit
   it, delete and regenerate if it drifts.
4. **When a config plugin doesn't cover what you need** — first search for an
   existing Expo config plugin (official or community) for the SDK. If none
   exists, the answer is a **local config plugin**, not bare/eject or
   committing native folders — link to **Native SDKs Without an Expo Plugin**.
5. **Note on legacy bare projects** — joining a project that already has
   `ios/`/`android/` committed is an inherited state, not a violation to fix
   inline; treat migrating it to managed as its own planned piece of work.

## Page: Native SDKs Without an Expo Plugin

1. **When this applies** — a native SDK ships only native install
   instructions (CocoaPods + Info.plist keys for iOS; a Gradle
   dependency/repository + AndroidManifest entries for Android) with no Expo
   config plugin, official or community. Sumsub (as integrated on the T5
   project) is named as the real-world case that motivated this pattern.
   Always search npm/GitHub for an existing plugin before writing one.
2. **The pattern** — a `plugins/with<Sdk>.js` file (e.g.
   `plugins/withSumsub.js`) using `@expo/config-plugins` mod functions to apply
   the native install steps programmatically, composed via `withPlugins` and
   registered in `app.config.ts`'s `plugins` array. `expo prebuild`
   (local or on EAS) then produces a native project with the SDK already
   wired in — no manual native-IDE edits, no committed native folders.
3. **Schematic example** — a skeleton `withSumsub.js` showing the shape of the
   composition (`withAndroidManifest`, `withInfoPlist`,
   `withAppBuildGradle`/`withProjectBuildGradle`, `withPodfile`), with
   placeholder values and inline comments directing the reader to the SDK's
   official native install guide for real values. Explicitly labeled as a
   template, not a copy-paste-ready Sumsub recipe.
4. **Scaling to more than one SDK** — one file per SDK under `plugins/`, each
   scoped to a single native concern, mirroring the guideline's existing
   small-well-bounded-units principle.
5. **Testing it** — `npx expo prebuild --clean` locally to inspect the
   generated project (or open it in Xcode/Android Studio), then delete the
   output again — never commit it (ties back to the Managed Workflow page).
   Recommend re-testing the plugin before any EAS build that touches it, since
   a broken plugin only surfaces as a native build failure.
6. **Maintenance warning** — the plugin file itself is committed source, like
   any other code (unlike `ios/`/`android/`), so normal code review and git
   blame apply. Pin the native SDK's version: a version bump can silently
   change required native config (a new permission, a changed Podspec) that
   the plugin must be updated to match, with nothing in `prebuild` warning you
   if it's drifted.
7. **Cross-links** — back to Managed Workflow (why this instead of bare/eject)
   and to Environment & Configuration → Build-Time Config (the existing
   dynamic `app.config.ts` pattern this plugin registers into).

## Cross-cutting edits (English + `es/` mirror, file for file)

1. **Edit** `docs/getting-started/create-or-clone.md` — replace "A note on
   native folders" (the "either is fine" framing) with a short paragraph
   declaring the managed/CNG default and linking to the new page; add `/ios`
   and `/android` to the reference `.gitignore` block with a "generated, never
   committed" note; renumber `nav_order` for the two later sibling pages.
2. **Edit** `es/docs/getting-started/create-or-clone.md` — same changes, in
   Rioplatense Spanish.
3. **Edit** `docs/reference.md` — add glossary rows for **CNG** (Continuous
   Native Generation), **Config plugin**, **Prebuild**.
4. **Edit** `es/docs/reference.md` — same glossary additions, translated.

## Testing / verification

- `bundle exec jekyll build` succeeds with no new Liquid errors.
- Local `jekyll serve` spot check:
  - Both new pages render at their expected URLs, appear in the nav in the
    correct order (EN and ES), and their cross-links (G1 ↔ G2, G2 → Build-Time
    Config) resolve.
  - `create-or-clone.md` (EN and ES) shows the rewritten note, the updated
    `.gitignore` block, and correct sibling `nav_order` values.
- Grep check: no real/specific Sumsub native values (permission strings,
  Gradle coordinates, Info.plist keys, version numbers) appear in the G2 page
  or its `es/` mirror — only placeholders with a "see the SDK's official docs"
  comment.
