---
title: Adding a New iOS Device
parent: Build & Distribution
nav_order: 4
---

# Adding a New iOS Device

## Why you have to do this (the 30-second version)

Outside the App Store, Apple doesn't let your app install on just any iPhone.
For internal test builds — Apple calls this **ad-hoc distribution** — you have
to declare *ahead of time* exactly which iPhones are allowed to run the build.
Nothing installs on a phone you didn't declare in advance.

Think of a build as a **private party with a guest list at the door**:

- **UDID** — each iPhone's unique fingerprint, like a person's ID number.
- **Provisioning profile** — the **guest list**. iOS is the bouncer: if a
  device's UDID isn't on the list, it refuses entry and the app won't install.
- **Code signing** — the moment a build is created, the current guest list is
  **sealed inside it**. You can't add a name to the list afterward; you have to
  print a new list and build again.

That last point is the whole reason this page exists. Registering a new device
(Step 1) only adds its name to Apple's *master* list of known devices — it does
**not** touch the guest list already sealed into a build you shipped earlier. To
let the new device in, you have to regenerate the profile *with that device
included* and **rebuild** (Step 3). In one line: a build installs **only** on
devices whose **UDID was baked into the profile it was signed with** — no device
in the profile, no install, and no workaround but to rebuild.

## 1. Register the device (once per device)

```bash
eas device:create        # choose "Website"; send the link/QR to the tester
```

The tester must open the link **on the iPhone they'll use**. It installs a
configuration profile and adds the device's UDID to Apple's master list in the
Apple Developer portal (this is the "add a name to the master list" step — it
does *not* yet put them on any build's sealed guest list). Confirm it
registered:

```bash
eas device:list --apple-team-id <TEAM_ID>
```

## 2. The critical edge case

The distribution script builds with `--non-interactive`. In that mode EAS
**reuses the cached provisioning profile** (the guest list it already has on
file) and does **not** rebuild it to include newly registered devices. So the
new device is on Apple's master list, but not on the sealed guest list of the
build you just shipped.

{: .warning }
**Symptom:** the tester opens the link, sees *"Device registered — you'll get an
email when the app is ready"*, but the **install button never appears**. The
device is registered with Apple, but the build you uploaded was signed *before*
that, with a profile that doesn't include the new UDID.

## 3. The deterministic fix — regenerate the profile with ALL devices

```bash
eas credentials          # interactive; asks for your Apple login
```

Then navigate:

1. Platform **iOS** → build profile **preview** → your app
   (`com.yourorg.app`, team `<TEAM_ID>`).
2. Choose **Build Credentials → set up all required credentials** (or
   **Provisioning Profile → create a new provisioning profile**).
3. When it lists devices, **select ALL of them** — press **space** on each so
   every device is ticked. You're printing the new guest list here: anyone you
   don't tick is left off it and won't be able to install. (This is the exact
   step where a device gets left out.) Confirm.

Then rebuild and redistribute:

```bash
pnpm run release:preview:ios
```

Finally, **verify the IPA** before the tester tries again — see the next page.

{: .note }
**Apple limits:** 100 devices per year, per device type, and the quota **doesn't
reset** when you delete a device. Every new device means regenerate + rebuild —
so **collect several new devices and regenerate once**, rather than rebuilding
for each tester who joins.
