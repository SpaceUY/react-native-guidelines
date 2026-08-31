---
title: Prerequisites & Tooling
parent: Getting Started
nav_order: 1
---

# Prerequisites & Tooling

Install these once. The right-hand column is how you check each one is ready.

| Tool | Minimum | Verify |
| --- | --- | --- |
| Node.js | 20+ | `node -v` |
| pnpm | 9+ | `pnpm -v` |
| EAS CLI | latest | `eas --version` (install: `npm i -g eas-cli`) |
| firebase-tools | latest | `npx firebase --version` |
| Xcode (macOS, for iOS) | latest stable | `xcodebuild -version` |
| Android Studio + SDK | latest | `adb --version` |

{: .note }
We use **pnpm** as the package manager. It's faster and stricter than npm about
your dependency tree, which catches "works on my machine" bugs early. Enable it
with Corepack if you don't have it: `corepack enable && corepack prepare pnpm@latest --activate`.

## Accounts you'll need

- **Expo** — for builds and OTA. Log in with `eas login`.
- **Apple Developer** — required to sign and ship iOS builds (both ad-hoc
  testing and the App Store).
- **Firebase** — access to the project used for internal test distribution.

Once every row above checks out, move on to **Create or Clone a Project**.
