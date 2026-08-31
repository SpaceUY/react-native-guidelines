---
title: Internal Builds (Firebase)
parent: Build & Distribution
nav_order: 3
---

# Internal Builds (Firebase)

One command builds the app locally with the `preview` profile and uploads it to
Firebase App Distribution.

## Wire up the scripts

```json
// package.json
{
  "scripts": {
    "release:preview:android": "node scripts/distribute-firebase.js android",
    "release:preview:ios": "node scripts/distribute-firebase.js ios"
  }
}
```

## What the script does

1. **Validates `.env`** — fails fast with a clear message if a `FIREBASE_*` var
   is missing, *before* wasting time on a build.
2. **Builds locally** with the `preview` profile
   (`eas build --local --non-interactive`).
3. **Verifies the artifact** exists in `./build/`.
4. **Uploads to Firebase** with **auto release notes** — the current branch,
   short commit SHA, and last commit subject.

Here is the full `scripts/distribute-firebase.js`:

```js
#!/usr/bin/env node
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const platform = process.argv[2];
if (platform !== "android" && platform !== "ios") {
  console.error("Usage: node scripts/distribute-firebase.js <android|ios>");
  process.exit(1);
}

// Minimal .env loader (no dotenv dependency)
(function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
})();

const appId =
  platform === "android"
    ? process.env.FIREBASE_ANDROID_APP_ID
    : process.env.FIREBASE_IOS_APP_ID;
const group = process.env.FIREBASE_TESTER_GROUP || "internal";

if (!appId) {
  const varName =
    platform === "android" ? "FIREBASE_ANDROID_APP_ID" : "FIREBASE_IOS_APP_ID";
  console.error(`Missing ${varName} in .env. Copy scripts/.env.example to .env.`);
  process.exit(1);
}

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: "utf8" }).trim();
}
let releaseNotes = "manual build";
try {
  releaseNotes = `${git("rev-parse --abbrev-ref HEAD")} ${git(
    "rev-parse --short HEAD",
  )} - ${git("log -1 --pretty=%s")}`;
} catch {}

function run(command) {
  execSync(command, { stdio: "inherit" });
}

const ext = platform === "android" ? "apk" : "ipa";
const artifact = path.resolve("build", `app-preview.${ext}`);
fs.mkdirSync(path.dirname(artifact), { recursive: true });

console.log(`\n> Building ${platform} (preview, local)...`);
run(
  `npx eas build -p ${platform} --profile preview --local --non-interactive ` +
    `--output "${artifact}"`,
);

if (!fs.existsSync(artifact)) {
  console.error(`Build finished but ${artifact} was not created. Aborting.`);
  process.exit(1);
}

console.log(`\n> Uploading to Firebase App Distribution (group: ${group})...`);
run(
  `npx firebase appdistribution:distribute "${artifact}" ` +
    `--app "${appId}" --groups "${group}" ` +
    `--release-notes "${releaseNotes.replace(/"/g, "'")}"`,
);

if (platform === "ios") {
  console.log(
    "\nNote: iOS is ad-hoc. A tester can only install if their device UDID is " +
      "in the provisioning profile. New device? See 'Adding a New iOS Device'.",
  );
}

console.log("\nDone.");
```

## Android

No device restrictions — one command:

```bash
pnpm run release:preview:android
```

The release appears in **Firebase Console → App Distribution** (Android app), and
testers in your group get an email with an install link.

## iOS

iOS uses **ad-hoc** distribution, which has strict device rules. Run:

```bash
pnpm run release:preview:ios
```

...but read **Adding a New iOS Device** before promising a build to a tester
whose device you haven't registered yet.

## Tester instructions

- **Android:** open the Firebase email → tap the link → install the `.apk`
  (allow "install from unknown sources" if prompted).
- **iOS:** open the email link → install the **Firebase App Tester** app (it
  offers it right there) → install the build from App Tester.

{: .warning }
**Android:** a tester who has the store version installed must **uninstall it
first** — the internal build is signed differently, and Android won't install
over a different signature.
