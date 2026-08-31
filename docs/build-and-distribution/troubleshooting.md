---
title: Troubleshooting
parent: Build & Distribution
nav_order: 7
---

# Troubleshooting

Real errors, their cause, and the fix. Search for your message here before
diving into a debugging session.

| Error | Cause | Fix |
| --- | --- | --- |
| "Invalid Provisioning Profile ... signed with an Ad Hoc/Enterprise Provisioning Profile" on `eas submit` | You're submitting a `preview` (ad-hoc) build to the store | Build with the `production` profile and submit that. Never `eas submit` a preview build |
| "The IPA bundle ID 'X' does not match your Firebase app's bundle ID 'Y'" | The Firebase App ID points to an app registered with a different bundle id | Register the iOS app with your production bundle id (Android with its package); point the `.env` App IDs at *those* apps |
| Tester sees "Device registered, wait for email" but can't install (iOS) | The device UDID isn't in the uploaded build's provisioning profile — common when adding a device, worsened by `--non-interactive` | Regenerate the profile with **all** devices via `eas credentials`, rebuild, redistribute; verify the IPA first |
| "Missing FIREBASE_ANDROID_APP_ID in .env" | No `.env`, or the App ID is missing | `cp scripts/.env.example .env` and fill in the real App IDs |
| "Unable to select an Apple team in non-interactive mode" | A non-interactive command needs to know the team | Add `--apple-team-id <TEAM_ID>` |
| Android "app not installed" / signature conflict | A differently-signed store version is already installed | Uninstall the store version first, then install the internal build |
