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
