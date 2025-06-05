---
title: TestFlight Setup
layout: default
parent: Getting Started
nav_order: 3
---

# TestFlight Setup (Work in Progress)

TestFlight is Apple's platform for beta testing iOS applications. This guide will help you submit your Expo app to TestFlight using EAS Submit.

## Prerequisites

Before proceeding, ensure you have:
1. An Apple Developer account
2. Your app already built with EAS Build
3. App Store Connect setup completed
4. Necessary certificates and provisioning profiles

## Configuring for TestFlight

### 1. Update eas.json

Add TestFlight-specific configuration to your `eas.json`:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

### 2. Build for TestFlight

Create a build specifically for TestFlight:

```bash
eas build --platform ios --profile preview
```

### 3. Submit to TestFlight

Once the build is complete, submit it to TestFlight:

```bash
eas submit -p ios --latest
```

## Managing TestFlight Distribution

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app > TestFlight
3. Add internal and external testers
4. Manage beta testing groups

## Common Issues and Solutions

### Build Rejection Issues
- Ensure your bundle identifier matches App Store Connect
- Verify your signing certificates are valid
- Check that your provisioning profile includes all necessary devices

### Submission Issues
- Verify your Apple Developer account has the correct role
- Ensure your app meets Apple's guidelines
- Check that your app's privacy declarations are complete

## Additional Resources

- [EAS Submit to TestFlight Guide](https://docs.expo.dev/submit/ios/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/) 