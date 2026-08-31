# i18n: English + Spanish for the React Native Guidelines site

- Status: Approved (2026-08-31)
- Author: Claude (with matias)

## Context

The site (Jekyll + `just-the-docs` theme, pinned gem `0.10.1`) currently
ships English-only content across 41 pages under `docs/` plus the home page
`index.md`. We want the full site available in Spanish too, with a way to
switch languages, while keeping the build simple (no new GitHub Actions
workflow exists yet — deploy story is still manual/default GitHub Pages) and
without forking large parts of the theme.

Constraints established with the user:
- Translate **all** existing content now, not just a subset.
- No new Jekyll plugins (e.g. no `jekyll-polyglot`). Prefer a manual,
  low-dependency approach that keeps working with a plain `jekyll build`.
- Minimize the amount of vendored theme code we have to fork/maintain.

## Goals

- Every existing English page has a Spanish equivalent, reachable via a
  mirrored URL under `/es/`.
- A visible language switcher on every page, that links to the equivalent
  page in the other language (not just the homepage).
- The left-hand nav shows only the current language's page tree — no mixed
  English/Spanish entries.
- `<html lang>` is correct per page.
- Theme UI strings that are easy to make bilingual (search placeholder,
  "Table of contents", callout titles) are localized. Strings that would
  require forking theme JS (search index) are explicitly left as a known
  limitation, not silently broken.

## Non-goals (v1)

- Per-language search index / search results filtering.
- Per-page SEO `description` translation (no page currently sets one).
- A GitHub Actions deploy pipeline (unrelated to this feature; the site
  already builds and serves today via `bundle exec jekyll serve`/`build`).
- Any language beyond English/Spanish.

## URL structure & content layout

English keeps its current, unprefixed URLs (no `/en/` prefix — avoids
breaking existing links/bookmarks). Spanish lives under a `/es/` prefix that
exactly mirrors the English tree, file for file:

```
index.md                          → /
docs/**/*.md                      → /docs/**

es/index.md                       → /es/
es/docs/**/*.md                   → /es/docs/**   (same relative paths as docs/**)
```

This 1:1 mirroring is load-bearing: the language switcher (below) derives
the equivalent-language URL by adding/removing the `/es` prefix from
`page.url`, with no per-page mapping file to maintain. As long as every
English file has a Spanish file at the mirrored path (and vice versa), this
stays correct.

Internal cross-references in this site's prose are **never** hyperlinks —
they're bolded plain-text mentions of a page's title (e.g. "see **Best
Practices**"). Confirmed via a full grep of `docs/` and `index.md`: zero
relative/internal markdown links exist today. Translation therefore only
needs to translate that bolded text to the Spanish page's title — there is
no internal link target to keep in sync.

## Language selection (`lang` front matter)

Add to `_config.yml`'s `defaults:`:

```yaml
defaults:
  - scope:
      path: ""
    values:
      layout: default
      lang: en
  - scope:
      path: "es"
    values:
      lang: es
```

Jekyll applies later-matching, more-specific scopes last, so anything under
`es/` gets `lang: es`; everything else defaults to `lang: en`. No per-file
front matter needed.

## Theme customizations

All customizations are done by placing a same-relative-path file in the
site's own `_layouts`/`_includes` directories, which Jekyll uses to shadow
the theme gem's files of the same name — the standard Jekyll theme override
mechanism. This repo has no local overrides today; this feature introduces
the first ones.

1. **`_layouts/default.html`** (forked from the gem, 47 lines) — one-line
   change: `<html lang="{{ site.lang | default: 'en-US' }}">` becomes
   `<html lang="{{ page.lang | default: site.lang | default: 'en-US' }}">`.

2. **`_includes/header_custom.html`** (already an empty, theme-provided
   override point) — new content: the language switcher. Renders in the
   main header bar (between search and the "GitHub" aux link) on every page,
   since `default.html` includes the header unconditionally and the `home`
   layout extends `default`. Logic:
   - If `page.url` starts with `/es/` (or equals `/es`), the "other" URL is
     `page.url` with `/es` stripped (fallback to `/` if empty); label the
     current language "ES" (non-link, visually active) and the link "EN".
   - Otherwise, the "other" URL is `/es` prepended to `page.url`; current
     language "EN" (non-link), link "ES".
   - Render both language codes as a small two-item toggle with an
     `aria-label` per link (e.g. "Switch to Spanish" / "Cambiar a inglés").

3. **`_includes/components/site_nav.html`** (forked from the gem, 47 lines)
   — the single point in the theme where `site.html_pages` is gathered for
   the left nav (traced through `nav/pages.html` and `nav/children.html`,
   which both reuse the already-filtered array rather than re-querying the
   site — so this is the only file that needs the filter). Add a `where_exp`
   filtering `site.html_pages` to `item.lang == (page.lang | default: "en")`
   before computing `pages_top_size` and passing pages down.

4. **`_includes/search_placeholder_custom.html`** and
   **`_includes/toc_heading_custom.html`** (both already theme-provided
   override points, currently unused) — made lang-aware with a simple
   `{% if page.lang == "es" %}...{% else %}...{% endif %}`:
   - Search placeholder: "Search {{ site.title }}" / "Buscar {{ site.title
     }}".
   - TOC heading: "Table of contents" / "Tabla de contenidos".

`site.title` ("React Native Guidelines") stays a single global value in both
languages — it's a proper noun/brand name, not translated content.

## Callout titles (Note/Tip/Warning/Important)

The theme bakes callout title text into site-wide generated CSS from
`_config.yml`'s `callouts:` block (one `content: "..."` per class, compiled
once for the whole site) — this cannot vary per page/language without
forking the theme's SCSS pipeline, which we're avoiding.

`just-the-docs` already supports a second, content-based callout syntax for
exactly this kind of case: a manual title block (`{: .note-title }` followed
by the literal title text) instead of the CSS-generated shorthand
(`{: .note }`). Spanish pages use the manual form with translated titles
("Nota", "Consejo", "Importante", "Advertencia"). English pages are
unaffected and keep using the existing shorthand. No theme changes required
for this piece — it's purely an authoring convention applied when writing
the Spanish content.

## Known limitations (accepted for v1)

- **Search is global, not language-scoped.** The search index
  (`assets/js/search-data.json`) is generated once for the whole site by a
  vendored, Liquid-templated theme JS asset. Scoping it per language would
  mean forking that JS file (not just an include) and its fetch logic —
  more maintenance surface than this feature's "minimal fork" constraint
  allows. Searching from a Spanish page can surface English results and
  vice versa; the linked page itself renders correctly in its own language.
  Flagged as a possible future enhancement, not solved here.
- **`page.last_modified_date` footer string** ("Page last modified: ...") is
  hardcoded in a non-`_custom` theme include and is not localized. This site
  doesn't currently enable that feature, so it's moot today; if it's ever
  turned on, that one string would need its own small fork at that time.

## Content translation

All 41 existing pages under `docs/` plus `index.md` get a Spanish
counterpart under `es/`, translating:
- Front matter `title` (and `parent`/`grand_parent` values, which must
  exactly match the Spanish title of the referenced parent page — same
  convention the English tree already uses for nav grouping).
- Body prose, including bolded internal cross-references (translated to the
  Spanish page's title).
- Table headers/cells, callout bodies (using the manual-title syntax above).

Not translated (kept as-is):
- Code samples, file paths, command names, package/library names.
- External link URLs (link text may be translated, e.g. "Expo
  documentation" → "Documentación de Expo").
- `site.title` and any brand/proper nouns.

## Config changes summary

`_config.yml`:
- Add the two-entry `defaults:` block above (`lang: en` / `lang: es`).
- Add `specs` to the existing `exclude:` list (see below).

## Spec file location

This document lives at `specs/2026-08-31-i18n-en-es-design.md` (repo root),
not under `docs/`, because `docs/` is the site's actual Jekyll content root
— a spec file placed there would either render as a published page or, at
minimum, need excluding. `specs/` at the repo root is added to `_config.yml`'s
`exclude:` list alongside the existing `scripts`/`README.md`/`Gemfile`
entries, matching how this repo already keeps non-content material out of
the built site.

## Testing / verification

- `bundle exec jekyll build` succeeds with no new Liquid errors.
- Manual check in a local `jekyll serve`:
  - `/` and `/es/` both render, with correct nav (no cross-language leakage)
    and correct `<html lang>`.
  - Switcher on an English page (e.g. `/docs/best-practices.html`) links to
    `/es/docs/best-practices.html` and vice versa.
  - A deep page (e.g. `/es/docs/build-and-distribution/troubleshooting.html`)
    round-trips correctly through the switcher.
  - Callouts on a Spanish page render with Spanish titles; English pages
    unaffected.
- `bundle exec htmlproofer ./_site --disable-external --allow-hash-href
  --ignore-empty-alt` passes for both trees.
