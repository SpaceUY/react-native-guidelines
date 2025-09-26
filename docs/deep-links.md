---
title: Deep Linking
layout: default
nav_order: 15
---

# Deep Linking with Universal Links and App Links

Deep linking allows users to navigate directly to specific content within your mobile app from external sources like websites, emails, or other apps. This guide covers implementing deep links using Universal Links (iOS) and App Links (Android) with Expo Router.

## Overview

Deep linking comes in three main forms:

1. **URL Schemes** - Custom protocol URLs (e.g., `myapp://profile/123`)
2. **Universal Links (iOS)** - Standard HTTP(S) URLs that open the app when installed
3. **App Links (Android)** - Android's equivalent to Universal Links

Universal Links and App Links are preferred because they:

- Work seamlessly with web fallbacks
- Don't require custom URL schemes
- Provide better user experience
- Are more secure and verified

## Universal Links (iOS)

Universal Links allow iOS apps to handle standard HTTP(S) URLs. When a user taps a Universal Link, iOS opens the app directly if installed, or falls back to the website.

### How Universal Links Work

1. iOS checks if an app can handle the URL
2. If the app is installed and configured, it opens the app
3. If not, it opens the URL in Safari
4. The app receives the full URL and can parse parameters

### iOS Configuration

#### 1. Associated Domains Entitlement

Add associated domains to your app configuration:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:myapp.com", "applinks:www.myapp.com"]
    }
  }
}
```

#### 2. Apple App Site Association File

Create `/.well-known/apple-app-site-association` in your website:

> **Important**!\
> The file **can't** have an extension. If you leave the `.json` extension, it won't work as expected

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.yourcompany.yourapp",
        "paths": ["/profile/*", "/product/*", "/share/*", "*"]
      }
    ]
  }
}
```

Please edit the following:

- Replace `TEAMID` with your Apple Developer Team ID
- Replace `com.yourcompany.yourapp` with your app's bundle ID
- Change the list of paths for the ones used by your app that you want to deep link

## App Links (Android)

App Links are Android's implementation of verified deep links using standard HTTP(S) URLs.

### How App Links Work

1. Android checks for apps that can handle the URL
2. Verifies the app's association with the domain
3. Opens the verified app directly
4. Falls back to browser if no verified app is found

### Android Configuration

#### 1. Intent Filter Configuration

Add intent filters to your Android manifest:

> **Important**!\
> Duplicate each item inside the data array to have both with `www.` and without

```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "myapp.com",
              "pathPrefix": "/relative_path_to_screen"
            },
            {
              "scheme": "https",
              "host": "www.myapp.com",
              "pathPrefix": "/relative_path_to_screen"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

#### 2. Digital Asset Links File

Inside the `public` folder of your website, create `/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yourcompany.yourapp",
      "sha256_cert_fingerprints": [
        "SHA256_FINGERPRINT_OF_YOUR_SIGNING_CERTIFICATE"
      ]
    }
  }
]
```

Then:

- Replace `com.yourcompany.yourapp` with your Android package name
- Get SHA256 fingerprint from your signing certificate
- Add as many certificates as you need, usually the one from the key used to sign the APKs by EAS and the one used by Google itself to sign the build being released on the store.

### Getting SHA256 Fingerprint

From EAS:

1. Open the terminal and execute:

```bash
eas credentials -p android
```

2. Select `production` environment
3. Copy the value for `SHA256 Fingerprint`

From Google Play Console:

1. Sign in to Google Play Console and open your app.

2. In the left menu go to Release (or Test and release) → Setup → App integrity (sometimes labeled Play App Signing / App signing).

3. In the App signing key certificate section you’ll see the certificate fingerprints (MD5, SHA‑1, SHA‑256). Copy the SHA‑256 certificate fingerprint shown there.

### Testing Website Configuration

#### Verify Apple App Site Association:

```bash
curl -I https://www.myapp.com/.well-known/apple-app-site-association
```

#### Verify Android Asset Links:

```bash
curl -I https://www.myapp.com/.well-known/assetlinks.json
```

Both should return `200 OK` with `Content-Type: application/json`.

## Testing Deep Links

### iOS Testing

1. **Simulator Testing**:

   ```bash
   xcrun simctl openurl booted "https://www.myapp.com/profile/123"
   ```

2. **Device Testing**:

   - Send the URL via Messages or Email
   - Use Notes app to create a clickable link
   - Test from Safari address bar

### Android Testing

1. **ADB Testing**:

   ```bash
   adb shell am start \
     -W -a android.intent.action.VIEW \
     -d "https://www.myapp.com/profile/123" \
     com.yourcompany.yourapp
   ```

2. **Device Testing**:

   - Use Chrome browser to navigate to your URL
   - Send via messaging apps
   - Test from other apps that handle links

## Best Practices

### 1. URL Structure Design

Keep URLs simple and intuitive:

```
https://www.myapp.com/profile/123
https://www.myapp.com/product/awesome-sneakers
https://www.myapp.com/share?type=post&id=456
```

### 2. Graceful Fallbacks

Always provide web fallbacks:

- Create corresponding web pages for all deep link URLs
- Implement Progressive Web App (PWA) features
- Add "Open in App" banners on web pages

## Troubleshooting

### Common iOS Issues

1. **Links not opening app**:

   - Verify team ID and bundle ID in AASA file
   - Check associated domains entitlement
   - Ensure HTTPS and valid SSL certificate

2. **AASA file not loading**:
   - Check file accessibility: `curl https://yoursite.com/.well-known/apple-app-site-association`
   - Verify Content-Type header
   - Check for redirects (not allowed)
   - Make sure you are not using the `.json` extension

### Common Android Issues

1. **App Links not verified**:

   - Check SHA256 fingerprint matches
   - Verify package name in assetlinks.json
   - Use `adb shell dumpsys package domain-preferred-apps`

2. **Intent filters not working**:

   - Ensure `autoVerify="true"` is set
   - Check scheme and host configuration
   - Verify BROWSABLE and DEFAULT categories

3. **SendGrid updating the link sent by email**:
   - Disable the click tracking

### Testing Tools

- [Apple App Site Association Validator](https://branch.io/resources/aasa-validator/)
- [Google Digital Asset Links Tester](https://developers.google.com/digital-asset-links/tools/generator)
- [Universal Links Tester](https://search.developer.apple.com/appsearch-validation-tool)

## Useful Links

- [Apple Universal Links Documentation](https://developer.apple.com/ios/universal-links/)
- [Android App Links Documentation](https://developer.android.com/training/app-links)
- [Expo Linking Documentation](https://docs.expo.dev/versions/latest/sdk/linking/)
- [Expo Router Deep Links](https://docs.expo.dev/router/reference/linking/)

---

**Last updated: September 26, 2025**

Remember to test deep links thoroughly on both platforms and various scenarios. Keep your association files updated when changing domains or app configurations. Always provide graceful fallbacks for better user experience.
