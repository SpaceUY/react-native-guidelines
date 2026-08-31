---
title: Adding a New iOS Device
parent: Build & Distribution
nav_order: 4
---

# Adding a New iOS Device

{: .important }
**The ad-hoc rule:** an iOS build installs **only** on devices whose **UDID is
baked into the provisioning profile** it was signed with. If a device isn't in
the profile, iOS refuses to install. There is no workaround — you must rebuild
with a profile that includes that device.

## 1. Register the device (once per device)

```bash
eas device:create        # choose "Website"; send the link/QR to the tester
```

The tester must open the link **on the iPhone they'll use**. It installs a
configuration profile and registers the device's UDID in the Apple Developer
portal. Confirm it registered:

```bash
eas device:list --apple-team-id <TEAM_ID>
```

## 2. The critical edge case

The distribution script builds with `--non-interactive`. In that mode EAS
**reuses the cached provisioning profile** and does **not** add newly registered
devices automatically.

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
   every device is ticked. (This is the exact step where a device gets left out.)
   Confirm.

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
