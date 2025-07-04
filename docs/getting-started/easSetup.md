---
title: EAS Setup
layout: default
parent: Getting Started
nav_order: 3
---

# EAS Setup

This guide will help you set up EAS (Expo Application Services) in your managed workflow project. We'll configure your project for different environments and build types.

## Installing EAS CLI

First, install the EAS CLI globally:

```bash
npm install -g eas-cli
```

## Logging in to EAS

You'll need an Expo account to use EAS. If you don't have one, you can create it through the CLI:

```bash
eas login
```

After logging in, initialize your project with EAS:

```bash
eas init
```

This will create your project in the EAS Dashboard if it doesn't exist yet and set up the necessary configuration in your project.

## App Configuration

Create an `app.config.ts` file in your project root. This will allow you to have dynamic configuration based on the environment (development, preview, production). The configuration will:
- Create different app variants with unique names and identifiers
- Allow installing multiple variants on the same device
- Automatically detect the environment from `APP_ENV`

Your `app.config.ts` should look like this:

```typescript
import { ConfigContext, ExpoConfig } from "expo/config";

// Replace these with your EAS project ID and project slug.
// You can find them at https://expo.dev/accounts/[account]/projects/[project].
const EAS_PROJECT_ID = "44a3ece9-3c1e-4794-85bd-0326cbbd51ca";
const PROJECT_SLUG = "hello-world";
const OWNER = "pvicens-space";

// App production config
const APP_NAME = "Hello World";
const BUNDLE_IDENTIFIER = "com.space.helloworld";
const PACKAGE_NAME = "com.space.helloworld";
const ICON = "./assets/images/icons/iOS-Prod.png";
const ADAPTIVE_ICON = "./assets/images/icons/Android-Prod.png";
const SCHEME = "app-scheme";

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);
  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
    getDynamicAppConfig(
      (process.env.APP_ENV as "development" | "preview" | "production") ||
        "development"
    );

  return {
    ...config,
    name: name,
    version: "1.0.0",
    slug: PROJECT_SLUG, // Must be consistent across all environments.
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    icon: icon,
    scheme: scheme,
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleIdentifier,
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      package: packageName,
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: OWNER,
  };
};

// Dynamically configure the app based on the environment.
export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: "./assets/images/icons/iOS-Prev.png",
      adaptiveIcon: "./assets/images/icons/Android-Prev.png",
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: "./assets/images/icons/iOS-Dev.png",
    adaptiveIcon: "./assets/images/icons/Android-Dev.png",
    scheme: `${SCHEME}-dev`,
  };
};

```

Notice this example uses different icons for each environment, if you would like to use this apporach as well, first of all delete the icon import from the static config file which is in the `app.json` and afterwards make sure the icon path here points to the correct file in your project.

You'll also need to update your `eas.json`. Here's an example configuration that matches the previous `app.config.ts` and has a specific build for ios simulator as well:


```json
{
  "cli": {
    "version": ">= 14.4.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "preview"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "APP_ENV": "production"
      }
    },
    "ios-simulator": {
      "extends": "development",
      "ios": {
        "simulator": true
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Environment Variables

Environment variables are handled differently for local development versus EAS builds:

### Local Development
When running `expo start` or `expo run:ios/android`, your app will use:
- `.env.local` file (created when you run `eas env:pull`)
- This is primarily for development on your local machine

To get your environment variables for local development:
```bash
eas env:pull preview 
```

This will create a `.env.local` file with the variables you've set for the `preview` environment in the EAS dashboard. You can also use `development` or `production` instead of `preview` to pull variables from those environments:


### EAS Builds
Each build profile handles environment variables in different ways:

1. Build-time variables in `eas.json`:
   - Variables needed during the build process
   - Defined directly in the `env` section of each profile
   - Example: `APP_ENV` to determine which app variant to build

2. Runtime secrets in EAS Dashboard:
   - Sensitive variables your app needs while running
   - API keys, service credentials, etc.
   - Kept secure and separate from your code
   - Can be different per environment (development/preview/production)

3. Secrets via `eas env:create`:
   - Alternative way to add runtime secrets
   - Creates secrets via CLI instead of Dashboard
   - Same level of security as Dashboard secrets

## Building Your App

Important: For physical devices and app store builds, you will need:
- An Apple Developer account for iOS
- A Google Play Developer account for Android
- App signing credentials

When building for physical iOS devices (both development and preview builds), your device needs to be registered in the provisioning profile. Don't worry though - EAS handles this for you:

1. When you first try to build for a physical device, EAS will:
   - Guide you through creating the necessary credentials
   - Ask for your Apple account details
   - Create or update the provisioning profile
   - Register your device automatically

2. To add more devices later:
   - Run `eas device:create`
   - Follow the prompts to register new devices
   - EAS will automatically update your provisioning profile

Note: You can build and run on simulators without these requirements.

### EAS Build vs expo run:ios

There are two ways to run your app during development:

1. `npx expo run:ios`
   - Builds and runs the app in one command
   - Better for rapid local development
   - Automatically launches the simulator
   - Doesn't require EAS configuration

2. `eas build --local`
   - Creates a production-like build locally
   - Uses the same build process as EAS cloud builds
   - Useful for testing exact production configurations
   - Required for testing specific EAS build configurations
   - Needs manual simulator installation

For regular development, use `npx expo run:ios` as it's more streamlined. Use `eas build` when you need to test specific build configurations or verify production builds.


### Local Development Builds

Before creating local builds, make sure you have:
1. Fastlane installed (on macOS):
```bash
brew install fastlane
```
2. CocoaPods installed:
```bash
brew install cocoapods
```
3. An Apple Developer account (required for physical device builds)
4. Xcode properly configured with your Apple account



Then you can create your local builds:

```bash
# For iOS Simulator
eas build --profile ios-simulator --platform ios --local

# For development builds (physical devices)
eas build --profile development --platform ios --local
eas build --profile development --platform android --local
```


After the iOS simulator build completes:
1. Extract the build artifacts:
```bash
cd [your-project-directory]
tar -xvf build-*.tar.gz
```
2. Install the app on the simulator:
```bash
xcrun simctl install booted HelloWorldDevelopment.app
```

Note: The .app name will match your project name followed by "Development" for development builds.

### Installing on Physical Devices

For physical iOS devices with development builds:

1. **Using QR Code** (Recommended):
   - Find your build in the [EAS Dashboard](https://expo.dev)
   - Scan the QR code with your device's camera
   - Follow the installation prompts

2. **Using AirDrop**:
   - Download the IPA file to your Mac
   - AirDrop it to your iOS device
   - It should automatically install it once its download to the device

**Important**: 
- These methods only work for development and preview builds
- Production builds must be distributed through TestFlight
- Remember to read the section at the beginning about `eas device:create`. Your device must be registered in the development provisioning profile before you can install development builds. EAS will guide you through this process when you first try to install on a device.


### Cloud Builds

If you rather have EAS build instead of your own machine, use:

```bash
# Preview builds (staging environment)
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Production builds
eas build --profile production --platform ios
eas build --profile production --platform android

# Dev builds (if needed)
eas build --profile development --platform ios
eas build --profile development --platform android
```

If built with either of these commands, you or any other team member should be able to download the specific build from the EAS dashboard.

## Submitting to App Stores

After successfully creating your builds, you can submit them to the respective app stores:

### iOS (TestFlight/App Store)

You have two options for submitting to TestFlight:

1. **Let EAS handle it** (recommended for new apps):
```bash
# Submit the iOS build
eas submit -p ios
```
From here you can follow the prompts to select your desired build from EAS. Otherwise you can pass the `--id` flag from the dashboard to the previous command.

EAS will create the app in App Store Connect if it doesn't exist.

Note: Make sure it properly sets the bundleIdentifier `com.space.helloworld` (in our example).
Otherwise create the app manually in the Apple Developer Portal using the proper id (as seen in the the tutorial video)

2. **Use existing App Store Connect app**:
- If you already created the app in App Store Connect, add its ID to your `eas.json`:

<small>You can find it in the App Information, under Apple ID</small>
```json
{
  "submit": {
      "production": {
      "ios": {
        "appleId": "info@spacedev.uy",
        "ascAppId": "REPLACE_WITH_YOUR_APP_ID",
        "bundleIdentifier": "com.space.helloworld"
      }
    }
  }
}
```

For more detailed instructions about TestFlight setup and submission, check out our [TestFlight Setup Guide](./testflightSetup.md).

### Android (Play Store)

**Important**: Before submitting, you must first:
1. Create your app in the [Google Play Console](https://play.google.com/console)
2. Set up your app signing key in EAS
3. Make sure your package name matches what you set in Play Console

Then you can submit your build:
```bash
# Submit the Android build
eas submit -p android
```

Note: Make sure you have the necessary store credentials and your app meets the store guidelines before submitting.


## Labeling Release Notes

### iOS

When submitting builds to TestFlight, you can label your releases as staging or production to help your team quickly identify which builds are for internal testing and which are for production. **As of the latest EAS CLI versions, release notes must be added manually in App Store Connect after submission.**

After your build is uploaded via `eas submit`, go to App Store Connect → TestFlight → Builds, select your build, and enter your release notes there. Use clear labels such as "Staging build – v1.0.3-beta" or "PRODUCTION build – v1.0.3" to distinguish between environments.

### Android

Similarly, for Android, release notes must be added manually in the Google Play Console after submitting your build. This helps testers and users understand what's new in each build.

After your build is uploaded via `eas submit`, go to the Play Console, select your release, and enter your release notes. Use clear labels to indicate staging or production status, e.g., "Staging build – v1.0.3-beta" or "PRODUCTION build – v1.0.3".

Keep your release notes clear and informative for both testers and end users!

## Additional Resources

- [EAS Build Configuration](https://docs.expo.dev/build/configuration/)
- [EAS Local Builds](https://docs.expo.dev/build/local-builds/)
- [Environment Variables in EAS](https://docs.expo.dev/build/environment-variables/)

#### Quick video guides
 - [EAS initial setup quick overview](https://drive.google.com/file/d/1sXnZKwPavo9G4gceAa0oNaummfFrKHGa/view?usp=drive_link)

- [Local iOS simulator build](https://drive.google.com/file/d/1bPLJK79i_rpNRxzCCsShLWDtLHh3W9YB/view?usp=drive_link)

- [Local Android build (for emulator or physical device)](https://drive.google.com/file/d/1Qr8fqAoEoU1SJssaqGJuQzoJ4Na5fE_4/view?usp=drive_link)

- [EAS cloud build/install + Device register (iOS)](https://drive.google.com/file/d/1YkdamOXxrwXiOBCAX9OVZeLZjKti8jh2/view?usp=drive_link)

- [EAS cloud build/install (Android)](https://drive.google.com/file/d/1f7V_ySPtdLraUjNS38MMRPBL0Ou5Ttpl/view?usp=drive_link)

- [Local iOS builds](https://drive.google.com/file/d/1zDH1jKrJYSaZ-m5xhdjuNGq_Dp1NO_ya/view?usp=drive_link)

