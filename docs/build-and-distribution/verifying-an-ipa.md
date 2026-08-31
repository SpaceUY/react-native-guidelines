---
title: Verifying an IPA
parent: Build & Distribution
nav_order: 5
---

# Verifying an IPA

Before you tell a tester "try again", confirm the build actually includes their
device. You inspect the provisioning profile embedded inside the `.ipa`:

```bash
# 1. Extract the embedded profile from the IPA
unzip -o -q ./build/app-preview.ipa "Payload/*/embedded.mobileprovision" -d /tmp/ipa_check

# 2. Decode it to a readable plist
security cms -D -i /tmp/ipa_check/Payload/*.app/embedded.mobileprovision -o /tmp/profile.plist

# 3. Inspect the type and the included devices
/usr/libexec/PlistBuddy -c "Print :Name" /tmp/profile.plist
/usr/libexec/PlistBuddy -c "Print :ProvisionedDevices" /tmp/profile.plist
```

What to look for:

- `:Name` should say **AdHoc**.
- `:ProvisionedDevices` must **contain** the tester's UDID.

Compare `:ProvisionedDevices` against `eas device:list`. If a UDID you expect is
**missing**, go back to **Adding a New iOS Device** and regenerate the profile
with that device included, then rebuild.
