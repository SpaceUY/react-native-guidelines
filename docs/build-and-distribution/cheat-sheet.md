---
title: Cheat Sheet
parent: Build & Distribution
nav_order: 9
---

# Cheat Sheet

```bash
# --- One-time setup ---
cp scripts/.env.example .env
npx firebase login
eas login

# --- Internal distribution (Firebase) ---
pnpm run release:preview:android
pnpm run release:preview:ios

# --- iOS devices ---
eas device:create
eas device:list --apple-team-id <TEAM_ID>
eas credentials                     # regenerate profile — include ALL devices

# --- Verify an IPA (which devices it includes) ---
unzip -o -q ./build/app-preview.ipa "Payload/*/embedded.mobileprovision" -d /tmp/ipa_check
security cms -D -i /tmp/ipa_check/Payload/*.app/embedded.mobileprovision -o /tmp/profile.plist
/usr/libexec/PlistBuddy -c "Print :ProvisionedDevices" /tmp/profile.plist

# --- Production (stores) ---
eas build --profile production --platform ios --local --output ./build/app-production.ipa
eas submit --profile production --platform ios --path ./build/app-production.ipa
eas build --profile production --platform android --local --output ./build/app-production.aab
eas submit --profile production --platform android --path ./build/app-production.aab
```

## Mental model

|  | Internal (testing) | Production (store) |
| --- | --- | --- |
| Tool | Firebase App Distribution | EAS Submit |
| Profile | `preview` (internal / ad-hoc) | `production` (store) |
| Command | `pnpm run release:preview:<platform>` | `eas build ...` + `eas submit ...` |
| iOS UDIDs | Required | N/A |
| Touches the stores | Never | Yes |
