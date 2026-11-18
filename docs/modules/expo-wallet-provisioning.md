---
title: expo-wallet-provisioning
parent: Modules
nav_order: 1
---

# expo-wallet-provisioning

Add a card to **Apple Wallet** and **Google Wallet** from the app, with the official buttons:
the user taps "Add to Apple Wallet" or "Add to Google Wallet", confirms, and the card is ready
to pay. This is **in-app push provisioning**.

- Package: `github.com/SpaceUY/expo-wallet-provisioning` (private).
- Backend: the `wallet-provisioning` module of `github.com/SpaceUY/NestJS-Template`.

It was extracted from a production app that passed Apple's and Google's reviews. Most of the
work in that project was not code: it was approvals, entitlements, review videos and rules that
are easy to miss. This page lists them.

## When to use it

Use it when the project issues cards through a processor (Pomelo, for example) and users
should be able to add them to the phone's wallet. It covers Mastercard and Visa cards (Visa is
not yet tested end to end, see **Visa** below).

It does not cover showing the card number to the user (a card vault), physical cards, or Tap
to Add.

{: .important }
Start the external requirements on day one. Google's SDK access, Apple's entitlement and the
processor's setup each take weeks and happen in parallel with development.

## External requirements

| Who | What to ask for | What you hand over | Notes |
|---|---|---|---|
| **Apple** (through the processor or the card network) | In-app provisioning entitlement (`com.apple.developer.payment-pass-provisioning`) for the app **and** both Wallet extensions | Team ID and bundle IDs | Granted per bundle ID. Signing any other bundle with it (a `-dev` build) fails the build |
| **Apple** | The app associated with the card product (`associatedApplicationIdentifiers`) | Team ID + bundle ID | Configured by the processor or network |
| **Apple** | Regenerated provisioning profiles | — | After the entitlement is granted |
| **Google** | Access to the TapAndPay SDK from the issuer portal | Issuer application | Under NDA, per issuer. **Never commit it to a shared repo** |
| **Google** | The app in Google's allowlist | Package name and the signing certificate fingerprints | Confirm the exact list of fingerprints in Google's current launch checklist |
| **Google** | UX review | A PDF of the flow (declaring bounce provisioning), videos and screenshots | See **Review checklist** |
| **Processor** | Credentials, network enablement of the BIN, the apps registered, token webhooks | Bundle IDs, package name, webhook URLs | See **Processor: Pomelo** |

## Install

```bash
pnpm add github:SpaceUY/expo-wallet-provisioning#v1.0.0
```

```ts
// app.config.ts → plugins
['expo-wallet-provisioning', {
  android: { tapAndPayRepository: './vendor/tapandpay/m2repository' },
  ios: { provisioningEntitlementBundleIds: ['com.acme.app'], walletExtension: true },
}],
```

The plugin follows **Project Architecture → Native SDKs Without an Expo Plugin**: no `ios/` or
`android/` is committed, everything native goes in through the plugin.

### Where the TapAndPay SDK lives

Google hands the SDK to each approved issuer. Keep its Maven repository **inside the project's
own repo** (for example `vendor/tapandpay/m2repository`) and point `tapAndPayRepository` at it.
EAS builds need it in the repo, so it is committed there, and only there.

{: .warning }
Never copy the SDK into the package, the guidelines, the template, another project or a shared
drive. It is licensed to that issuer only. An Android prebuild without it fails with a message
that explains how to get it; an iOS-only prebuild does not need it.

## Using it

```tsx
const { walletState, isAdding, add } = useAddToWallet({
  card: card && {
    lastFour: card.lastFour,
    network: 'MASTERCARD',
    isActive: card.status === 'ACTIVE',
    cardholderName: card.nameOnCard,
    billingAddress, // optional: prefills Google Wallet's billing form
  },
  fetchApplePayData: (request) => api.post('/cards/me/wallet/apple-pay', request).then((r) => r.data),
  fetchGooglePayData: (request) => api.post('/cards/me/wallet/google-pay', request).then((r) => r.data),
  onError: () => showToast(t('card.walletAddError')),
});
```

Render by `walletState`:

| `walletState` | iOS | Android |
|---|---|---|
| `CAN_ADD` | `<AddPassButton onPress={add} />` | `<GoogleWalletButton locale="es-419" onPress={add} isBusy={isAdding} />` |
| `ADDED` | Text: "Added to Apple Wallet" | Text: "Added to Google Wallet" |
| `UNAVAILABLE` | Nothing | Nothing |

- **Placement:** the button goes directly below the card, on the card screen. Optionally a
  dismissible banner and a row in card settings with the same official button.
- **Google's button** is the official asset, unchanged, at least 48 dp tall with 8 dp clear
  space. Do not restyle it or put it inside another button.
- **"Added" text is required.** Google asks for it, and Apple's review video ends on it.
- **The error message** is the app's (`onError`); it runs after the wallet sheet closes, so it
  is not hidden behind it.
- Mount `useAddToWallet` in as many screens as you need. The state refreshes when the app
  returns to the foreground.

## Recipes

These depend on the app's navigation, session and screens, so they are not in the package.

### Bounce provisioning (Android)

Google Wallet can open the app from its own "Add card" flow. The app must land **on the card
screen, with no screens in between**, after the login if there is no session, and even if the
app was locked. Mount once, at the root:

```tsx
useWalletBounceListener(
  () => {
    setPendingDeepLink('/card');           // cold start: the login resumes it
    if (!isSignedIn) return;
    lockStore.setPendingPath('/card');     // live app: go there after unlocking
    if (!isLocked) router.replace('/card');
  },
  { onCleared: () => lockStore.clearPendingPath('/card') },
);
```

The package sends the next `add()` as a bounce and drops the bounce if the app goes to the
background.

### Apple Wallet extension

Lets users add the card from **Wallet → "+"** (Apple's review video 2). Copy
`templates/apple-wallet-extension/` from the package and follow its README. The rules that
cannot change: the non-UI extension never refreshes the session, the UI extension asks for Face
ID and refreshes once, and the card art ships inside the extension.

### Screen capture

The card screen with the wallet button **can** be recorded (the review videos need it). Only a
screen that shows the full card number (a card vault) blocks screenshots and recording, and
only while it is open. Never show the full number anywhere else.

## Backend

Use the `wallet-provisioning` module of the NestJS template. The app calls:

| Endpoint | Body | Response |
|---|---|---|
| `POST /cards/me/wallet/apple-pay` | `{ cardId?, certificates, nonce, nonceSignature }` | `{ activationData, encryptedPassData, ephemeralPublicKey }` |
| `POST /cards/me/wallet/google-pay` | `{ cardId?, serverSessionId }` | `{ opc, googleOpc }` |

The project implements where cards come from (`CardResolver`) and what happens when a user
leaves the flow unfinished (`WalletProvisioningHooks`: send a reminder push; Apple asks for it).
The module's README covers configuration and webhooks.

## Processor: Pomelo

*Delete this section if the project uses another processor.*

- **Credentials:** API client id and secret, audience, and the webhook secret (the same one as
  the transaction webhooks).
- **Ask Pomelo** to enable the card product for Apple Pay and Google Pay with the network, to
  register the apps (bundle IDs, package name) and to configure the token webhooks:
  `token-lifecycle` and `token-notification` (one URL; `event_id` tells completed from
  abandoned).
- **Users** need an email and a phone with country code and no "+", or Pomelo rejects them.
- The backend adapter is `src/wallet-provisioning/pomelo-adapter/` in the template; it can be
  deleted without touching the rest.

## Review checklist

**Google** (confirm against Google's current launch checklist):

- One video per case: **a)** phone without Google Wallet, **b)** card added, then the app shows
  "Added", **c)** card removed from Wallet, then the app shows the button again, **d)** a card
  waiting for identity verification (the button resumes it).
- Bounce provisioning from Google Wallet into the card screen.
- Screenshots of the screen with the button and of the success state.
- No card number, CVC or expiry date in any video or screenshot.

**Apple:**

- Video 1: app → button → Apple's sheet → "Added to Apple Wallet".
- Video 2: Wallet → "+" → the app → card added (needs the Wallet extension).
- The reminder for an abandoned flow.

## Visa

The card network is a parameter of each card (`network: 'VISA'`), on both platforms. Still to
confirm per project, with the processor:

- the processor's Visa endpoints (Pomelo's Visa Apple Pay path is unconfirmed; there is no known
  Visa Google Pay path yet);
- which encryption scheme Apple Pay needs for Visa (`encryptionScheme`, default `ECC_V2`).

## See also

- **Project Architecture → Native SDKs Without an Expo Plugin**
- The package's `README.md` (API) and `RELEASE.md` (what CI cannot check)
