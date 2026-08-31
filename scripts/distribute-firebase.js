#!/usr/bin/env node
// scripts/distribute-firebase.js
// Build the app locally with the EAS "preview" profile and upload it to
// Firebase App Distribution for internal testers — in one command.
//
// Usage: node scripts/distribute-firebase.js <android|ios>
// Wire via package.json:
//   "release:preview:android": "node scripts/distribute-firebase.js android"
//   "release:preview:ios":     "node scripts/distribute-firebase.js ios"

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const platform = process.argv[2];
if (platform !== "android" && platform !== "ios") {
  console.error("Usage: node scripts/distribute-firebase.js <android|ios>");
  process.exit(1);
}

// --- Minimal .env loader (no dotenv dependency) ------------------------------
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

// --- Resolve config ----------------------------------------------------------
const appId =
  platform === "android"
    ? process.env.FIREBASE_ANDROID_APP_ID
    : process.env.FIREBASE_IOS_APP_ID;
const group = process.env.FIREBASE_TESTER_GROUP || "internal";

if (!appId) {
  const varName =
    platform === "android" ? "FIREBASE_ANDROID_APP_ID" : "FIREBASE_IOS_APP_ID";
  console.error(
    `Missing ${varName} in .env. Copy scripts/.env.example to .env and fill it ` +
      `in (Firebase Console -> Project settings -> General -> Your apps).`,
  );
  process.exit(1);
}

// --- Release notes from git --------------------------------------------------
function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: "utf8" }).trim();
}
let releaseNotes = "manual build";
try {
  releaseNotes = `${git("rev-parse --abbrev-ref HEAD")} ${git(
    "rev-parse --short HEAD",
  )} - ${git("log -1 --pretty=%s")}`;
} catch {
  /* not a git repo - keep the default note */
}

// --- Build locally with EAS --------------------------------------------------
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

// --- Distribute to Firebase --------------------------------------------------
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
