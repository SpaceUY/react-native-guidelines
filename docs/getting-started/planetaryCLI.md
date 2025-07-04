---
title: Planetary CLI Setup
layout: default
parent: Getting Started
nav_order: 1
---

# Planetary CLI Setup

> **Important**: While Planetary CLI helps automate project setup, it's crucial to understand the underlying configurations and best practices. Please read through all sections of this documentation to ensure you understand how each component works, rather than solely relying on the CLI's automation.

Planetary CLI is our internal tool that helps streamline project setup by providing common functionality and configurations for React Native apps. It works similarly to ShadCN, copying specific modules from our template repositories into your project, which you can then customize as needed.

If you already have Planetary CLI installed, you can start using it by running:
```bash
planetary
```

For detailed information about installation, configuration, and usage, please refer to the [Planetary CLI Repository](https://github.com/SpaceUY/planetary).

## Available React Native Modules

Our React Native modules include:

### Template
- **Expo Template**: React Native template with Expo and Expo Router navigation
  - Includes: expo-router, expo-linking, expo-constants, expo-status-bar
  - Comes with pre-configured EAS setup (see our [EAS Setup guide](./easSetup.md) for details)

### API Client
- **TanStack**: Ready-to-use API client with Axios and TanStack Query
  - Includes: @tanstack/react-query, axios

### State Management
- **Zustand**: Lightweight state management solution
  - Includes: zustand

### Date Utilities
- **date-fns**: Comprehensive date manipulation utilities
  - Includes: date-fns

### Testing
- **Jest**: Unit and integration testing setup
  - Includes: @testing-library/react-native, @testing-library/jest-native, jest-expo
- **Detox**: End-to-end testing configuration
  - Includes: detox, @types/detox

## After Installation

After installing modules:
1. The copied files are fully owned by your project
2. You can modify them to fit your specific needs
3. Changes are independent of the original templates

For questions about specific modules or contribution guidelines, reach out to the team through our internal channels. 