---
title: TestFlight Setup
layout: default
parent: Getting Started
nav_order: 4
---

# TestFlight Setup

TestFlight serves as a beta testing platform for production builds. It's particularly useful for:
- Testing production builds before App Store release
- Distributing beta versions to stakeholders
- Validating app behavior in production environment

Note: For testing development or staging environments, use development builds as described in the [EAS Setup guide](https://spaceuy.github.io/react-native-guidelines/docs/getting-started/easSetup.html).

This guide will help you submit your Expo app to TestFlight using EAS Submit.

## Prerequisites

Before proceeding, ensure you have:
1. An Apple Developer account
2. Your app already built with EAS Build (production build)
3. App Store Connect setup completed
4. App signing setup (certificates and provisioning profiles)

### Understanding App Signing

While EAS handles most of the complexity for you, it's good to understand the basics:

- **Certificates**: Digital signatures that identify you as an Apple Developer
  - Development certificate: For building development versions
  - Distribution certificate: For TestFlight and App Store builds

- **Provisioning Profiles**: Files that link your app, certificates, and deployment method
  - Development profile: For testing on specific devices
  - Distribution profile: For TestFlight and App Store distribution

**Good news**: EAS manages all of this automatically! When you run your first build, EAS will:
1. Create necessary certificates
2. Generate appropriate provisioning profiles
3. Handle all the signing configuration
4. Store everything securely in EAS servers

You only need to provide your Apple Developer account credentials when prompted.

#### Adding Test Devices

For development builds, devices need to be registered in your provisioning profile. EAS makes this easy:

```bash
eas device:create
```

This command will:
1. Register your device with Apple
2. Update your development provisioning profile
3. Allow development builds to be installed on that device

Note: This is only needed for development/preview builds. TestFlight builds can be installed on any device.

## Configuring for TestFlight

### 1. Update eas.json

Make sure your `eas.json` has your apple developer app information

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "REPLACE_WITH_YOUR_APP_ID",
        "bundleIdentifier": "com.yourcompany.app"
      }
    }
  }
}
```

### 2. Build for TestFlight

Create a production build for TestFlight:

```bash
eas build --platform ios --profile production
```

### 3. Submit to TestFlight

Once the build is complete:

```bash
eas submit -p ios
```

EAS will prompt you to select your production build for submission.

## Managing TestFlight Distribution

TestFlight offers both internal and external testing capabilities. For most development teams, internal testing is the primary method used.

For information about external testing (public beta testing), check out [Apple's TestFlight documentation](https://developer.apple.com/testflight/).

In order to setup TestFlight and have team members start testing the app:

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app > TestFlight
3. Add internal or external testers
4. Manage beta testing groups

### Internal Testers

Internal testers are typically your team members and require special setup:

1. **User Access Setup** (Required First):
   - Go to App Store Connect > Users and Access
   - Add team members with appropriate roles:
     - At minimum, they need the "App Manager" or "Developer" role
     - For TestFlight access, ensure "TestFlight" is enabled in their role permissions
   - Team members must accept their invitation via email

2. **Adding Internal Testers**:
   - Go to App Store Connect > Your App > TestFlight > Internal Testing
   - First time only: Click the + button to create an "Internal Testing" group
   - Click on the Internal Testing group
   - Click "Testers" tab and click the + button to add testers
   - Only members previously added to Users and Access will appear here
   - They'll receive an email invitation to test your app

3. **Important Notes**:
   - Internal testers must have an Apple ID
   - They must be added to Users and Access BEFORE they can be added as testers
   - Internal testers can see all build versions
   - They need to install TestFlight app on their devices and redeem the invitation:
     1. Accept email invitation from App Store Connect
     2. Install TestFlight from the App Store
     3. Open the invitation link again to add the app to TestFlight

    **Advantages of Internal Testing**:
   - Builds are available immediately (no Beta App Review required)
   - Can test development features before external release
   - Up to 100 internal testers allowed
   - Testers can access all builds you upload

## Promoting to Production

Once your TestFlight build has been thoroughly tested and you're ready to release:

1. Go to App Store Connect > Your App > Distribution
2. Click "Add for Review" if this is your first version, or "+" (Add Version) for subsequent versions
3. Complete the App Store submission information:
   - App Store version information
   - Screenshots and app preview
   - Description and keywords
   - Support URL
   - Marketing URL (optional)
   - Version Release notes
4. Once all metadata is ready, you'll be prompted to select a build
   - Any build uploaded via EAS submit will be available
   - Make sure your desired build has been uploaded and tested in TestFlight

5. Submit for Review

Note: Make sure all your app's metadata and assets are ready before submitting. The review process for App Store release is typically more thorough than TestFlight reviews.

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

#### Quick video guides

- [EAS production build (iOS)](https://drive.google.com/file/d/1Fx1OgF_ECydT4M5nmjWh7GRjs0tNGp6E/view?usp=drive_link)

- [Create AppStoreConnect app + EAS submit configs](https://drive.google.com/file/d/1eQtDFRx61CUXeGy8oXXl75KOz0UlFVWt/view?usp=drive_link)

- [TestFlight internal tester invites](https://drive.google.com/file/d/1FPGyXQCOd7YjP5w65ls0DWrf4pfDzeQQ/view?usp=drive_link)

- [Promoting to prod from TestFlight build](https://drive.google.com/file/d/1mVQUCGUPlvWi660jwPexsDrKWOc9b-4K/view?usp=drive_link)