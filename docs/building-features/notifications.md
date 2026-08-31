---
title: Notifications
parent: Building Features
nav_order: 9
---

# Notifications

We use **`expo-notifications`** for push. Expo's push service sits in front of
**FCM** (Android) and **APNs** (iOS), so you send to one endpoint and Expo fans
out to the right platform.

## The flow

1. Ask permission and get the device's push token.
2. Send that token to your backend and store it against the user.
3. Your backend sends notifications via the **Expo Push API**.
4. The app handles notifications received in-foreground and taps that open a
   screen.

```ts
import * as Notifications from "expo-notifications";

export async function registerForPush() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  // POST `token` to your backend here
  return token;
}
```

Handle interaction:

```ts
Notifications.addNotificationResponseReceivedListener((response) => {
  const url = response.notification.request.content.data?.url as string | undefined;
  if (url) router.push(url); // deep link into the app
});
```

{: .important }
Push requires **external configuration** before it works end-to-end: an **FCM**
setup for Android and an **APNs** key for iOS, plus a **physical device** —
simulators and emulators can't receive push notifications.
