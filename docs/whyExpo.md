---
title: Why Expo?
layout: default
nav_order: 2
---

# Why Expo?

Expo is now officially recommended by the React Native team for enhancing React Native development. It simplifies building cross-platform apps for Android, iOS, TV, and Web by providing a standard library of native modules and additional tools like file-based routing. Expo’s close collaboration with Meta's React Native team ensures it integrates the latest features, making it a reliable choice for modern app development. The Expo community is active on GitHub and Discord, offering a wealth of support and resources.

### What's New

When using Expo, these are some of the features not present in React Native CLI that you should be aware of:

- **Expo Application Services (EAS)**: These optional services streamline various stages of app development, from building to deployment. EAS Build allows you to compile and package your apps without requiring a local development environment. EAS Update enables over-the-air updates, letting you push changes to your app without requiring users to download a new version from the app store. EAS Submit helps automate the app submission process to app stores, simplifying deployment.

- **Expo Router**: As we are using Expo, Expo Router has become the ideal choice for managing navigation within our app. It is built on top of React Navigation and introduces a file-based routing system similar to modern web frameworks. By automatically creating routes based on the files in your app directory, Expo Router ensures consistent and intuitive navigation across Android, iOS, and Web platforms. This new routing paradigm not only simplifies navigation management but also provides a universal routing experience across all platforms.

- **Over-the-Air (OTA) Updates**: This allows developers to push updates directly to users without requiring them to download a new version from the app store. OTA updates are particularly useful for quickly deploying bug fixes, small features, or content changes without going through the entire app store submission process. This feature ensures that your users always have the most up-to-date version of the app, improving the user experience and reducing the time between development and deployment.

For a comprehensive overview of all the features and capabilities that Expo offers, you can visit the official [Expo Documentation](https://docs.expo.dev/)
