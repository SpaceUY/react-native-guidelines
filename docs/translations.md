---
title: Translations
layout: default
nav_order: 7
---

# Translations

## What is react-i18next?

**react-i18next** is a library that facilitates the integration of internationalization (i18n) into React Native applications using the ‘I18next’ library. It provides a set of specific components and functions designed to work with React, simplifying the translation and localization process in mobile applications.

[Official docs](https://react.i18next.com/)

### Pros and Cons

#### Pros

- **Easy Integration with React Native**: It is designed to integrate seamlessly with React Native applications. It provides React Native specific components and utilities for managing translations.
- **Use of Hooks**: Provides hooks like `useTranslation`, which simplify access to translation functions directly in React Native components, eliminating the need to pass translation objects through props.
- **Automatic Language Detection**: Facilitates detection of the user’s preferred language based on device or application settings, enhancing user experience by defaulting to the appropriate language.
- **Comprehensive Documentation**: The library offers extensive documentation and practical examples, making it easier for developers to implement and learn.
- **Active Community**: Being part of the I18next ecosystem, react-i18next benefits from an active community that offers support and contributes to the library's ongoing development.

#### Cons

- **Complex Initial Setup**: For large or complex React Native projects, the initial setup might be perceived as challenging. While the library offers flexibility and advanced features, it can require more detailed configuration and longer integration time.
- **Library Size**: Although efficient, extensive use of its features and extensions can add to the total size of the application, which is a critical consideration in mobile development.

### Alternative

- **React-Intl**: An alternative to react-i18next, React-Intl is an official React library that provides components and utilities for internationalization, including date formatting, number formatting, and handling of translatable messages. While it's more commonly used in web applications, it can be adapted for use in React Native projects as well.
