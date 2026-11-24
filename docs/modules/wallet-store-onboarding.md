---
title: Wallet store onboarding
parent: Modules
nav_order: 2
---

# Wallet store onboarding (Apple Pay and Google Wallet)

The non-technical process to follow so a card from an issuing program (prepaid, debit or credit) can be added to **Apple Wallet** and **Google Wallet**, by hand and from the app (*push provisioning*). It comes from a real process with a prepaid Mastercard issued through a processor. The code is covered by **expo-wallet-provisioning**; this page covers everything that happens outside the code. It contains no client data.

## Roles

| Role | What they do |
|---|---|
| **Issuer / client** | Owns the program and the app. Registers in Google's console, signs the contracts, provides the brand assets and records the videos. |
| **Processor** (for example Pomelo) | Processes the card and acts as aggregator towards the wallets and the network (Mastercard MDES / Visa VTS). Manages the allowlists and the API scopes and, on Apple, mediates almost everything. |
| **Development** | Implements push provisioning in the app (iOS and Android) and the webhooks in the backend. |
| **QA / recording** | Records the certification videos on real devices. |

{: .important }
**Apple and Google do not work the same way.** On Apple, the processor mediates everything: entitlement, video submission and issuer approval. On Google, the processor only provides the allowlist and the TSP (MDES/VTS) configuration. Registration, contracts, UX, fingerprints and videos are done by the issuer in **its own** Google Pay & Wallet console.

## Recommended order

1. Sign up with the processor for each wallet: forms, contract and assets.
2. Publish the website: support, terms and data handling.
3. **Apple:** request the In-App Provisioning entitlement, build, test the push and record the videos.
4. **Google:** issuer profile, NDA and CTA, link with the aggregator, UX, package and fingerprints, and App Review videos.
5. Configure the tokenization webhooks and verify them.
6. Wait for each wallet's final approval.

{: .warning }
**Plan around the year-end freezes.** Apple freezes issuer onboarding roughly from mid-November to early January. Google freezes changes at the end of November (in 2026: 20 Nov to 1 Dec, with no allowlist requests until the next day). Have everything submitted before then.

## Signing up with the processor

One form per wallet. Development confirms the Bundle ID, the package name and the intent action **before** they are sent.

| Wallet | What they ask for |
|---|---|
| **Apple Pay** | Client name, BIN, network and product type, country, program ID and description, website, support phone and email, **Adam ID** (App Store), **Team ID** and **Bundle ID**. |
| **Google Pay** | The same program data, plus the Android **package name** and the **intent action** that opens the app (for example `<package>.OPEN`). |

- **Contract:** Apple Pay Program Manager Agreement between the processor and the issuer, signed by a legal representative.
- **Brand assets**, usually on the processor's template: issuer logo (1372 × 283 px), icon (100 × 100 px), card art (1536 × 969 px, on the network's template) and an Apple Pay marketing piece following Apple's guidelines.
- **Website:** a dedicated support email and public pages for support, terms and conditions (reviewed by legal) and data handling. Check the brand name's spelling in every asset and page.
- **Webhooks:** configure the tokenization ones (token lifecycle and notifications) in the processor's dashboard, pointing at the backend, and **check that the routes exist and answer 200** before testing starts.

## Apple Pay

### In-App Provisioning entitlement

The processor requests it from Apple. Check in the Apple Developer portal that "No Requests" no longer shows on **all three App IDs**: the app, the `.wallet` extension and the `.walletui` extension. It may need escalating several times (about 3 days in the real case). Once assigned, generate the iOS build with the entitlement.

### 403 on the push

**Symptom:** the push from the app fails with `403` on the processor's token provisioning endpoint (for example `token-provisioning/mastercard/apple-pay`).

**Cause:** the client's profile at the processor was missing the **tokenization scopes**.

1. The processor adds the missing scopes.
2. Request a **new access token, uncached**: the old one does not carry the new scopes.
3. To debug, share with the processor **only the `scope` field of the JWT** (never the whole token), with the time and the `card_id` of the attempt.
4. Check that the test card is in the **allowlist**.

### Videos (the processor uploads them)

| # | Flow | What must be visible |
|---|---|---|
| 1 | **Manual** | Wallet → + → debit or credit card → details by hand → OTP → card active. It also confirms the BIN is enabled on Apple Pay. |
| 2 | **Push from the app** | "Add to Apple Wallet" button in the app → card active in Wallet. |
| 3 | **Wallet Extension** | From Apple Wallet, pick the issuer's app → add the card. |

Blur sensitive data in all three: number, name, address and email.

After submission the app has to pass App Review with the entitlement, and **Apple's approval of the issuer** is still pending, which can take a few weeks.

## Google Wallet: console registration

Almost everything happens in the issuer's **Google Pay & Wallet** console.

| Step | Detail |
|---|---|
| **Issuer profile** | The issuer's details. Open a case with Push Provisioning support. |
| **NDA and CTA** | Signed by a legal representative of the issuer. |
| **Keys / aggregator** | Link the **issuer's Merchant ID** with the **processor's Merchant ID** (the aggregator), through a support case. |
| **UX** | Upload the flow's screens for approval. **Do not touch them afterwards:** any change opens new cases. |
| **App and fingerprints** | Load the package name and **both SHA-256 fingerprints** (Play's app signing key and the upload key) in the Push Provisioning API. Send the same fingerprints to the processor. |
| **TSP** | Pick the network (for example Mastercard). Usually no processor data needs loading. |
| **App Review** | Console → TSPs → network → each test case → Upload video → share with Google's review team → "Send for review". |

### Android builds

- Tests use **production cards** and the build pointing at production.
- If the app forces the Play version, an APK installed some other way **does not work**: wait for Play to approve the build.
- The production app must target the **target API** Google requires at that moment (in 2026: API 36).
- Integrations that go only through the TSP today must **migrate to Unified Push Provisioning** (announced deadline: end of 2026).

## Google Wallet: App Review videos

There are 4 mandatory cases, plus **Bounce** if the app implements it (5 videos). All with card numbers hidden and every state visible: **each video ends by reopening the app and showing the button's state**.

| Case | What must be visible | Device and account |
|---|---|---|
| **1. New wallet** | Phone without Google Wallet → button in the app → Wallet installs → card active → the app shows "Added". | A phone where Wallet can be uninstalled (for example Samsung; **it cannot on Pixel**) and a Google account that never used Wallet. |
| **2. Manual + state** | Card added by hand in Wallet → the app hides the button → the card is removed → the button returns. | Any. |
| **3. Remove card** | Push from the app → removed in Wallet → the button returns. | Any. |
| **4. Yellow path** | Manual card pending verification → the app takes the user to Wallet to verify (OTP) → active → "Added". | Any. |
| **5. Bounce** | Wallet with no cards → + → Payment card → pick the issuer's app → login → card screen with no notices → add → "Added". | A Google account that never used Wallet (otherwise Wallet lists the saved cards instead of the list of banks). |

**Suggested recording order:** 3 (the easiest), then 1 → 5 → 4 → 2.

### What we learned recording

- A video that does not work for one case may work for another (one meant as case 1 ended up used as case 3).
- Blur the number, name, address, email **and the other cards** that show in Wallet.
- During manual entry the screen shows **black** because of Google's `FLAG_SECURE`. That is normal.
- Raise the screen auto-lock (at least 40 s, or turn it off) and remember the app asks for login when reopened.
- The "Added" state can take a few seconds to appear.
- Grant the notification permission beforehand, have the OTP at hand for case 4 and use a clean Google account for cases 1 and 5.
- Paired watches can interfere (`hasEligibleTokenizationTarget`). If the watch will not be supported, consider disabling that target.
- The app may block recording on sensitive screens (for example "View card details"). Check that the rest of the flow records.

## When something fails

### The "Add to Google Wallet" button does not hide

**Symptom:** after adding the card (manual or push), the app keeps showing the button, even after reopening. Cases 2 and 4 fail because of it. Check, in this order:

1. **`listTokens` and the package name.** Google only returns to the app the tokens whose metadata includes **its package name**. On Mastercard it comes from `productConfig.issuerMobileApp.openIssuerMobileAppAndroidIntent.packageName` in MDES's *Digitize* response. Confirm with the processor that it is configured in the program's profile.
2. **`isTokenized`.** It compares the **last 4 of the FPAN + network + TSP**. If any differs, the app does not see the card.
3. **Data change callbacks.** The app has to **re-read the token state when it returns to the foreground** (and register Wallet's change callback).
4. **Yellow path.** With a pending token, a new push fails as a **duplicate**. Fix it by activating the token from the backend or calling `tokenize(tokenReferenceId)` instead of a new push.
5. **Wearables.** A paired watch can change the eligible target. Test with the watch target disabled.

### Google's billing address is always the same

A sample `UserAddress` was hardcoded in the push call. Replace it with the real address (the user's or the issuer's, depending on the program).

### Google documentation worth keeping at hand

The official test cases per TSP and the *Reading wallet state* and *Wallet operations* best practices.

## What the processor handles

| Topic | Detail |
|---|---|
| **Apple** | Escalates the entitlement, reviews and uploads the videos, and follows the issuer's approval. |
| **API scopes** | Adds the tokenization scopes to the client's profile. If a 403 shows up, check this first. |
| **Allowlists** | Apple: by `card_id` (Mastercard does not need the SEID; that applies to Visa). Google: `card_id` only. Each change takes **about 15 minutes** to take effect: ask early for each test card. |
| **Affinity group / limits** | Enable card-present purchases and everyday merchants so real payments can be tested with the tokenized card. |
| **TSP configuration** | Package name and app metadata in the MDES/VTS profile. |
| **Google** | Says which TSP to pick and passes the test-case documentation. **It does not upload the videos.** |

## Final checklist

**Sign-up**
- [ ] Apple Pay and Google Pay forms sent to the processor
- [ ] Apple Pay Program Manager Agreement signed
- [ ] Logo, icon, card art and marketing piece delivered
- [ ] Support, terms and privacy pages published
- [ ] Tokenization webhooks configured and answering 200

**Apple**
- [ ] In-App Provisioning entitlement assigned on all 3 App IDs
- [ ] iOS build with the entitlement approved on the App Store
- [ ] Tokenization scopes granted and the push working with a new token
- [ ] Test cards in the allowlist
- [ ] Videos of the manual, push and Wallet Extension flows sent
- [ ] Apple's approval of the issuer

**Google**
- [ ] Issuer profile and Push Provisioning case
- [ ] NDA and CTA signed
- [ ] Merchant ID linked to the aggregator's
- [ ] UX screens approved
- [ ] Package name and both SHA-256 fingerprints loaded in the console and sent to the processor
- [ ] TSP selected
- [ ] Production build published on Play with the current target API
- [ ] Button with the right state (it hides and comes back)
- [ ] Videos of cases 1 to 5 recorded, blurred, uploaded and sent for review
- [ ] Plan to migrate to Unified Push Provisioning

## See also

- **expo-wallet-provisioning**: the package, its recipes and the code-side review checklist.
