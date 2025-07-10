---
title: Notifications
layout: default
nav_order: 14
---

# Notifications with Firebase

Hey team! Let's dive into implementing push notifications in our React Native apps using Firebase Cloud Messaging (FCM). This guide will help you set up notifications that work seamlessly across iOS and Android platforms.

## Overview

Firebase Cloud Messaging (FCM) is the go-to solution for sending push notifications to mobile apps. It handles the complexity of different platforms and provides a unified API for both iOS and Android.

## Setup

### 1. Firebase Project Configuration

First, set up your Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add Android and iOS apps to your project
4. Download the configuration files:
   - `google-services.json` for Android
   - `GoogleService-Info.plist` for iOS

### 2. Install Dependencies

```bash
# For Expo managed workflow
expo install expo-notifications
expo install expo-device
expo install expo-constants

# For bare React Native
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging
npm install @react-native-async-storage/async-storage
```

### 3. Android Configuration

#### Add to `android/app/google-services.json`

Place the downloaded `google-services.json` file in the `android/app/` directory.

#### Update `android/build.gradle`

```gradle
buildscript {
    dependencies {
        // ... other dependencies
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

#### Update `android/app/build.gradle`

```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    // ... other dependencies
    implementation 'com.google.firebase:firebase-messaging:23.2.1'
}
```

### 4. iOS Configuration

#### Add to iOS project

1. Add `GoogleService-Info.plist` to your iOS project
2. Enable push notifications in your app capabilities
3. Add the following to your `Info.plist`:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

## Implementation

### Expo Managed Workflow

#### 1. Configure Notifications

```javascript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};
```

#### 2. React Hook

```javascript
import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './notificationUtils';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { expoPushToken, notification };
};
```

### Bare React Native

#### 1. Initialize Firebase

```javascript
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    return true;
  }
  
  return false;
};

export const getFCMToken = async () => {
  try {
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    
    if (!fcmToken) {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        return token;
      }
    }
    
    return fcmToken;
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
};
```

#### 2. Handle Notifications

```javascript
import messaging from '@react-native-firebase/messaging';

export const onMessageReceived = async (remoteMessage) => {
  console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  
  // Handle foreground messages
  // You can show a local notification here
};

export const onNotificationOpenedApp = (remoteMessage) => {
  console.log('Notification caused app to open from background state:', remoteMessage);
  
  // Navigate to specific screen based on notification data
  if (remoteMessage.data?.screen) {
    // Navigate to the specified screen
  }
};

export const onNotificationReceived = (remoteMessage) => {
  console.log('Notification received in background:', remoteMessage);
};
```

#### 3. Setup Listeners

```javascript
import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { onMessageReceived, onNotificationOpenedApp, onNotificationReceived } from './notificationHandlers';

export const useNotificationListeners = () => {
  useEffect(() => {
    // Foreground message handler
    const unsubscribe = messaging().onMessage(onMessageReceived);

    // Background message handler
    messaging().setBackgroundMessageHandler(onNotificationReceived);

    // App opened from background state
    messaging().onNotificationOpenedApp(onNotificationOpenedApp);

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
        }
      });

    return unsubscribe;
  }, []);
};
```

## Best Practices

### 1. Permission Handling

- Always request permission explicitly
- Handle all permission states gracefully
- Provide clear explanations of why notifications are needed

### 2. Token Management

```javascript
const updateFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    await AsyncStorage.setItem('fcmToken', token);
    
    // Send token to your backend
    await fetch('/api/notifications/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId: currentUser.id })
    });
  } catch (error) {
    console.error('Error updating FCM token:', error);
  }
};
```

### 3. Channel Configuration (Android)

```javascript
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const createNotificationChannels = () => {
  if (Platform.OS === 'android') {
    messaging().createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: 4,
      sound: 'default',
      vibration: true,
    });
    
    messaging().createChannel({
      id: 'high-priority',
      name: 'High Priority',
      importance: 5,
      sound: 'default',
      vibration: true,
    });
  }
};
```

### 4. Error Handling

```javascript
const handleNotificationError = (error) => {
  switch (error.code) {
    case 'messaging/permission-blocked':
      console.log('User blocked notifications');
      break;
    case 'messaging/permission-default':
      console.log('User hasn\'t made a choice yet');
      break;
    case 'messaging/token-registry-error':
      console.log('Token registry error');
      break;
    default:
      console.error('Notification error:', error);
  }
};
```

## Testing

### Local Testing

1. Use Firebase Console to send test messages
2. Test on physical devices (not simulators)
3. Test both foreground and background scenarios
4. Verify token generation and storage

### Production Testing

- Test on different devices and OS versions
- Verify notification delivery across networks
- Monitor error rates and user engagement
- Test notification actions and deep linking

## Useful Links

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase Messaging](https://rnfirebase.io/messaging/usage)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Console](https://console.firebase.google.com/)

## Example Component

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useNotifications } from './hooks/useNotifications';

const NotificationComponent = () => {
  const { expoPushToken, notification } = useNotifications();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (expoPushToken) {
      try {
        // Send token to your backend
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: expoPushToken })
        });
        setIsSubscribed(true);
        Alert.alert('Success', 'Subscribed to notifications!');
      } catch (error) {
        console.error('Error subscribing to notifications:', error);
        Alert.alert('Error', 'Failed to subscribe to notifications');
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Push Notifications
      </Text>
      
      {expoPushToken ? (
        <View>
          <Text style={{ marginBottom: 10 }}>
            Token: {expoPushToken.substring(0, 50)}...
          </Text>
          {!isSubscribed && (
            <Button title="Subscribe to Notifications" onPress={handleSubscribe} />
          )}
          {isSubscribed && (
            <Text style={{ color: 'green' }}>✅ Subscribed to notifications!</Text>
          )}
        </View>
      ) : (
        <Text>Loading notification token...</Text>
      )}
      
      {notification && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f0f0' }}>
          <Text style={{ fontWeight: 'bold' }}>Last Notification:</Text>
          <Text>{notification.request.content.title}</Text>
          <Text>{notification.request.content.body}</Text>
        </View>
      )}
    </View>
  );
};

export default NotificationComponent;
```

---

**Last updated: July 10, 2025**

Remember to replace placeholder values with your actual Firebase configuration. Keep your service account keys secure and never commit them to version control. For production apps, consider using environment variables for sensitive configuration. 