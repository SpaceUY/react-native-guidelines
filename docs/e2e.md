---
title: E2E Testing (Detox)
layout: default
nav_order: 11
---

# Detox E2E Testing

This guide is a quick and simple introduction on how to use Detox for end-to-end (E2E) testing in applications developed with React Native. Here, you will learn the basics, how to set it up in your project, and how to write your first automated tests to ensure that your application functions correctly.

## Configuration

1.  Install Detox CLI globally:

    ```sh
    npm install detox-cli --global
    ```

2.  [Only MacOS] Tap the Wix Homebrew repository:

    ```sh
    brew tap wix/brew
    ```

3.  [Only MacOS] Install `applesimutils`:

    ```sh
    brew install applesimutils
    ```

4.  Install Jest as a dev dependency:

    ```sh
    npm install "jest@^29" --save-dev
    ```

5.  Install Detox as a dev dependency:

    ```sh
    npm install detox --save-dev
    ```

6.  After running these commands, initialize your project with the following:

    ```sh
    detox init
    ```

    As a result, the following files will be created:

    - `.detoxrc.js`
    - `e2e/jest.config.js`
    - `e2e/starter.test.js`

7.  In the `.detoxrc.js` file, configure the binary path and the build command:

    ```javascript
    module.exports = {
      . . .
      configurations: {
        "ios.sim.release": {
          . . .
          app: {
            binaryPath: "ios/build/Build/Products/Release-iphonesimulator/YourApp.app",
            build: "xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Release -sdk iphonesimulator",
          },
        },
        "android.emu.release": {
          . . .
          app: {
            binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
            build: "cd android && ./gradlew assembleRelease",
          },
        },
      },
    };
    ```

8.  For Android, an additional configuration is required:

    In the file `android/build.gradle` add the following:

    ```javascript
    buildscript {
    ext {
        buildToolsVersion = "31.0.0"
        minSdkVersion = 21 // (1)
        compileSdkVersion = 30
        targetSdkVersion = 30
    +    kotlinVersion = 'X.Y.Z' // (2)
    }
    . . .
    dependencies {
        classpath("com.android.tools.build:gradle:7.1.1")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("de.undercouch:gradle-download-task:5.0.1")
    +    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion") // (3)
    . . .

    allprojects {
        repositories {
            . . .
            google()
        +    maven { // (4)
        +      url("$rootDir/../node_modules/detox/Detox-android")
        +    }
            maven { url 'https://www.jitpack.io' }
        }
    }

    (1) `minSdkVersion` should be 18 or higher.
    (2) Complete the Kotlin version of your Kotlin plug-in version from Android Studio.
    (3) and (4) Just add the following lines like in the image.
    ```

       <br>

    In the `android/app/build.gradle` file, add the following lines:

    ```javascript
    . . .

    android {
    . . .
    defaultConfig {
        . . .
        versionCode 1
        versionName "1.0"
    +    testBuildType System.getProperty('testBuildType', 'debug')
    +    testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'
    . . .
    buildTypes {
        release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    +      proguardFile "${rootProject.projectDir}/../node_modules/detox/android/detox/proguard-rules-app.pro"

        signingConfig signingConfigs.release
        }
    }
    . . .

    dependencies {
    +  androidTestImplementation('com.wix:detox:+')
    +  implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation fileTree(dir: "libs", include: ["*.jar"])
    ```

    ### Adding an auxiliary Android test

    Detox requires that your project has a single dummy native Android test with some special content, which will be picked up by testRunner that you just added in the previous step, so let's create it now.
    Copy the snippet below to create a file under the following path `android/app/src/androidTest/java/com/<your.package>/DetoxTest.java` (where <your.package> is your actual package name):

    ```javascript
    package com.<your.package>; // (1)

    import com.wix.detox.Detox;
    import com.wix.detox.config.DetoxConfig;

    import org.junit.Rule;
    import org.junit.Test;
    import org.junit.runner.RunWith;

    import androidx.test.ext.junit.runners.AndroidJUnit4;
    import androidx.test.filters.LargeTest;
    import androidx.test.rule.ActivityTestRule;

    @RunWith(AndroidJUnit4.class)
    @LargeTest
    public class DetoxTest {
        @Rule // (2)
        public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

        @Test
        public void runDetoxTests() {
            DetoxConfig detoxConfig = new DetoxConfig();
            detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
            detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
            detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 180 : 60);

            Detox.runTests(mActivityRule, detoxConfig);
        }
    }

    (1) - Replace with your package name. To look it up, you could copy and paste the first line from android/app/src/main/java/com/<your.package>/MainActivity.java.
    (2) - Usually not the case, but you might have a custom activity name instead of a default MainActivity. To check whether it is so or not, open your `android/app/src/main/AndroidManifest.xml`, and check what your main activity is called.
    ```

    ### Enabling unencrypted traffic for Detox

    Create a new network security config file for Android (or patch it if you have one):

    in `android/app/src/main/res/xml/network_security_config.xml`

    ```javascript
    <?xml version="1.0" encoding="utf-8"?>
    <network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
    </network-security-config>
    ```

    If you had no network security config before, it means you also have to register it after creation:
    in `android/app/src/main/AndroidManifest.xml`

    ```javascript
    <manifest>
    <application
    . . .
    +    android:networkSecurityConfig="@xml/network_security_config">
    </application>
    </manifest>
    ```

    Your Android app is ready to be used with Detox.

9.  Build the app:
    To build the app with detox run:

    IOS Debug:

    ```sh
    detox build --configuration ios.sim.debug
    ```

    IOS Release:

    ```sh
    detox build --configuration ios.sim.release
    ```

    Android Debug:

    ```sh
    detox build --configuration android.emu.debug
    ```

    Android Release:

    ```sh
    detox build --configuration android.emu.release
    ```

10. Create your first example test with Detox:

    ```
    1 - launch the application,
    2 - tap on a button,
    3 - and assert that some text appears as a result.
    ```

    You can also duplicate and modify a `e2e/starter.test.js` file that was generated automatically by detox init command.

    Create a new test file `e2e/yourTestName.test.js` under your `e2e` folder and add a similar test suite skeleton:

    ```javascript
    describe("Example", () => {
      beforeAll(async () => {
        await device.launchApp(); // (1)
      });

      beforeEach(async () => {
        await device.reloadReactNative(); // (2)

      });

      it("should tap on button by id and expect some text to be visible", async () => {
        await element(by.id("ButtonID")).tap(); // (3)(4)

        await expect(
          element(by.text("The button has been pressed"))
        ).toBeVisible();
        4;
      });
    });

    (1) - When your test starts, the application is not running yet. You need to call device.launchApp() at least once, e.g. in the beforeAll hook
    (2) - Like any live reloading, it is apt to cause glitches for more complex apps, but for simpler apps it proves to be a quicker way to reset the state between the tests
    (3) - Detox provides many options to match an element `by.id()`, `by.label()`, `by.text()` and more. The most common way to match elements is either by id or text.
    (4) - Detox provides many actions on elements such as tap(), swipe(), scroll().
    ```

11. Running tests
    ```sh
    detox test --configuration ios.sim.debug
    ```
