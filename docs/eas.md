---
title: CI/CD
layout: default
nav_order: 13
---

## CI/CD with EAS

As part of our continuous integration and continuous deployment (CI/CD) strategy, and considering that we use **Expo** for our projects, we recommend transitioning to **Expo Application Services (EAS)**.

### App Center Deprecation

Microsoft is retiring Visual Studio App Center by March 31, 2025. This change necessitates finding alternative solutions for building, testing, and monitoring mobile applications. We recommend the following tools:

- **EAS (Expo Application Services)**: EAS provides a cohesive workflow tailored specifically for React Native apps, offering features like cloud builds, over-the-air (OTA) updates, and app submission. EAS is well-integrated with Expo, making it a seamless choice for projects built using Expo.
- **Bitbucket Pipelines/ GitHub Actions / CircleCI**: For automated testing and CI/CD pipelines, Bitbucket Pipelines, GitHub Actions and CircleCI are robust alternatives. They offer extensive support for automated workflows, including testing, building, and deploying applications.

- **Sentry**: For error tracking and performance monitoring, Sentry is an excellent choice. It offers deep insights into application errors and performance issues, with support for React Native.

### Transitioning to New Tools

Migrating away from App Center involves setting up EAS for builds and OTA updates, and Sentry for monitoring. Both EAS and Sentry offer generous free tiers and comprehensive documentation to support the migration process.

For more detailed guidance on setting up and using these tools, refer to their official documentation:

- [Expo Application Services (EAS)](https://expo.dev/eas)
- [Sentry for React Native](https://docs.sentry.io/platforms/react-native/)

By adopting these alternatives, you can maintain a smooth CI/CD process with tools that are specifically designed for modern React Native development.
