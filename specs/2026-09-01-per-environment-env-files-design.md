# Per-environment `.env` files (Space protocol)

- Status: Approved (2026-09-01)
- Author: Claude (with matias)

## Context

The guidelines currently document a **single local `.env`** model:

- `getting-started/environment-variables.md` tells you to `cp .env.example .env`
  and describes exactly two files — `.env` (git-ignored) and `.env.example`
  (committed).
- `environment-config/secrets.md` repeats the same two-file rule.
- `environment-config/build-time-config.md` documents `APP_ENV`
  (`development` | `preview` | `production`) driving a dynamic `app.config.ts`,
  set per EAS build profile in `eas.json`.
- `getting-started/create-or-clone.md` now carries the project `.gitignore`
  guideline (added earlier today), whose secrets block ignores `.env` and
  `.env*.local`.

Space's real convention is **one env file per environment** so that test
wallets and credentials never travel into a production build, and so that real
wallets/keys never land in tracked files (which would otherwise make Claude
Code and secret scanners refuse to work). The guidelines don't reflect this
yet. This is a documentation change across the English pages and their `es/`
mirrors.

## Goals

- Document a per-environment env-file model: `.env.dev`, `.env.preview`,
  `.env.prod`, each git-ignored, plus a single committed `.env.example`
  template.
- Document the loader mechanism: `env-cmd` (dev dependency) selecting the file
  via `package.json` scripts.
- Update the `.gitignore` guideline so the new per-env files are ignored while
  `.env.example` stays committed.
- Keep the two established rationales explicit: (1) environment isolation
  prevents test wallets/credentials reaching prod; (2) real secrets stay out of
  tracked files so Claude Code / secret scanners don't block.
- Keep English and Spanish (`es/`) content in sync, file for file.

## Non-goals

- Changing the `APP_ENV` values (`development` | `preview` | `production`) or
  the `app.config.ts` / `eas.json` build-time model — those stay as-is.
- Per-environment `.example` templates (a single `.env.example` is enough; the
  variable **names** are the same across environments, only values differ).
- Switching to `dotenv-cli` or a `cp .env.$APP_ENV .env` script — `env-cmd`
  was chosen. (`dotenv-cli` is mentioned only as an equivalent alternative.)
- Any change to how EAS builds get their values (still the `env` block per
  profile in `eas.json` / EAS secrets).

## The model

| File | Environment | In git |
| --- | --- | --- |
| `.env.dev` | development | ignored |
| `.env.preview` | preview | ignored |
| `.env.prod` | production | ignored |
| `.env.example` | template with dummy values | committed |

The file names deliberately use `preview` (not `staging`) to line up with the
existing `APP_ENV` value `preview` and the EAS `preview` build profile.

## Loader mechanism

`env-cmd` is added as a dev dependency and selects the file per script in
`package.json`:

```json
"scripts": {
  "start":         "env-cmd -f .env.dev expo start",
  "start:preview": "env-cmd -f .env.preview expo start",
  "start:prod":    "env-cmd -f .env.prod expo start"
}
```

Each env file may define its own `APP_ENV` (`development` / `preview` /
`production`), so the runtime values loaded by `env-cmd` and the build-time
config selected by the dynamic `app.config.ts` stay in sync from a single
source. `dotenv-cli` is an equivalent alternative and is mentioned as such.

For EAS builds nothing changes: values still come from the `env` block of the
matching profile in `eas.json` (and EAS secrets). `env-cmd` is how you run
**locally** against a chosen environment.

## Clone / onboarding flow

The existing `cp .env.example .env` instruction becomes:

```bash
cp .env.example .env.dev       # repeat for .env.preview and .env.prod
# fill in the real values for each environment
```

## Rationale to document (both reasons)

1. **Isolation** — a separate file per environment keeps dev/test wallets and
   credentials from ever being bundled into a preview or production build.
2. **Claude / secret scanners** — real wallets and keys live **only** in
   git-ignored `.env.<env>` files, never in tracked content, so Claude Code and
   secret scanners don't trip on a detected wallet/key and block work.

## Doc changes (English + `es/` mirror, file for file)

1. **`getting-started/environment-variables.md`**
   - Replace the single-`.env` intro and `cp .env.example .env` with the
     per-environment model and the `cp .env.example .env.dev` flow.
   - Add a short "Loading the right file" subsection with the `env-cmd` scripts
     and the `APP_ENV`-inside-each-file note; mention `dotenv-cli` as an
     equivalent.
   - Rewrite "What's committed": `.env.example` committed; `.env.dev` /
     `.env.preview` / `.env.prod` git-ignored, never committed.
   - Add the two-reason rationale (isolation + Claude/scanners).
   - Keep the existing `EXPO_PUBLIC_` section unchanged.

2. **`getting-started/create-or-clone.md`** — in the `.gitignore` code block,
   replace the current secrets lines
   ```gitignore
   .env
   .env*.local
   ```
   with
   ```gitignore
   .env
   .env.*
   !.env.example
   ```
   and update the adjacent `.env` note bullet to say the per-env files are
   ignored while `.env.example` is committed.

3. **`environment-config/secrets.md`** — update the two `.env` bullets and (if
   present) the "where each value belongs" wording to reference `.env.<env>`
   files instead of a single `.env`, keeping the "rotate anything that leaks"
   warning.

4. **`environment-config/build-time-config.md`** — add a brief note tying
   `env-cmd -f .env.<env>` (local runtime values) to `APP_ENV` and the matching
   EAS profile (build-time config), so the reader sees how the two layers line
   up.

Spanish counterparts under `es/docs/...` receive the same edits, using the
manual callout-title syntax (`{: .warning-title }` / `{: .note-title }`) already
used in the `es/` tree, and translating prose while leaving code, file names,
and command names as-is.

## Testing / verification

- `bundle exec jekyll build` succeeds with no new Liquid errors.
- Local `jekyll serve` spot check:
  - `/docs/getting-started/environment-variables.html` and its `/es/`
    counterpart render the new three-file model and `env-cmd` scripts.
  - `/docs/getting-started/create-or-clone.html` shows `.env.*` +
    `!.env.example` in the `.gitignore` block.
  - `/docs/environment-config/secrets.html` reflects the per-env files.
- Grep check: no remaining `cp .env.example .env` (single-file) instruction and
  no `.env*.local`-only ignore rule in either language tree.
