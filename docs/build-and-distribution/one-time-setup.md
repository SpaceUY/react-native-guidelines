---
title: One-Time Setup
parent: Build & Distribution
nav_order: 2
---

# One-Time Setup

Do this once per machine (and once per project, for the Firebase side). If you
haven't installed the tools yet, see **Getting Started → Prerequisites &
Tooling**.

## 1. Log in to the CLIs

```bash
npx firebase login    # Google account with access to the Firebase project
eas login             # Expo account
```

## 2. Create your `.env`

The distribution script reads three variables. Copy the template and fill them
from **Firebase Console → Project settings → General → Your apps**:

```bash
cp scripts/.env.example .env
```

```
FIREBASE_ANDROID_APP_ID=1:000000000000:android:xxxxxxxxxxxx
FIREBASE_IOS_APP_ID=1:000000000000:ios:xxxxxxxxxxxx
FIREBASE_TESTER_GROUP=internal
```

{: .note }
`.env` is git-ignored — **never commit it**.

## 3. Create the Firebase project + tester group (first time only)

1. **Create the project** in the Firebase console. Analytics is optional — App
   Distribution doesn't need it.
2. **Register the apps with your production identifiers:** the Android app with
   your production **package name**, the iOS app with your production **bundle
   id**. You can **skip** downloading `google-services.json` /
   `GoogleService-Info.plist` and the SDK install steps — App Distribution only
   needs the CLI.
3. **Enable App Distribution** and create a testers **group**. Make sure the
   group's **alias** exactly matches `FIREBASE_TESTER_GROUP` (e.g. `internal`),
   then add your testers' emails to it.
