---
title: Initial Setup
layout: default
parent: Getting Started
nav_order: 2
---

## Environment Setup

First things first, let's get your development environment set up! Here's what you'll need to get started with React Native development using Expo.

### Installing Node.js

We need Node.js as it's the engine that runs our app. Head over to the [Node.js website](https://nodejs.org/) and grab the latest LTS version.

> **Important**: If you previously installed the global `expo-cli` package, you should uninstall it to avoid conflicts:
> ```bash
> npm uninstall -g expo-cli
> ```
> Expo CLI is now included in the project dependencies and doesn't need global installation.

### Installing Xcode (for iOS Development)

If you plan to develop for iOS, you'll need to install Xcode:

1. Download Xcode from the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835)
2. Once installed, open Xcode to complete the installation of additional components
3. Install the iOS Simulator by going to Xcode > Preferences > Components
4. Install the Command Line Tools by running:
```bash
xcode-select --install
```

Make sure to also accept the Xcode license agreement:
```bash
sudo xcodebuild -license accept
```

## Creating Your First Project

With Node.js installed, you can create a new Expo project:

```bash
npx create-expo-app@latest --template
```

Select `Navigation (TypeScript)` when prompted.

The setup includes typescript, and expo-router for navigation with basic layout to start building. 

We'll add environment configurations later for development, staging (called preview in EAS), and production, making it easier to manage different build configurations.

## Running Your App

Once the project has been created, navigate to your project directory and start the development server:

```bash
cd your-project-name
npx expo start
```

### Running on Simulators

You can run your app on iOS or Android simulators during development:

#### iOS Simulator
Either use `npx expo run:ios` or press `i` in the terminal when running `npx expo start` (if app has been installed)

#### Android Emulator
1. Install Android Studio
2. Set up an Android Virtual Device (AVD) in Android Studio
3. Either use `npx expo run:android` or press `a` in the terminal when running `npx expo start`


The `ANDROID_HOME` environment variable must point to your Android SDK installation. On macOS, the default path is:
```bash
export ANDROID_HOME=/Users/$USER/Library/Android/sdk
```

Add this to your shell profile (`.zshrc` or `.bash_profile`) to make it permanent.


The `JAVA_HOME` environment variable must point to your Java SDK installation. For EAS builds, Java 17 is required. On macOS, if using Zulu JDK, the path is typically:
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

If you encounter build errors mentioning Java or Android SDK not found, verify these environment variables are correctly set. You can check their current values with:
```bash
echo $JAVA_HOME
echo $ANDROID_HOME
```



For running on physical devices or more thorough build processes for simulator as well, please refer to our EAS setup guide which provides a more robust development and testing environment.



## Additional Resources

- Visual guide for [this section](https://drive.google.com/file/d/1irc9gdAwtt8WqjsbLRuRbSi8aDWGeHss/view?usp=drive_link) (TL;DR version).

For more detailed information about development environment setup, check out the [Expo Development Environment Setup guide](https://docs.expo.dev/get-started/set-up-your-environment/). 

