---
title: Notificaciones
parent: Desarrollo de Funcionalidades
nav_order: 9
---

# Notificaciones

Usamos **`expo-notifications`** para push. El servicio de push de Expo se
ubica delante de **FCM** (Android) y **APNs** (iOS), así que enviás a un
único endpoint y Expo distribuye a la plataforma correcta.

## El flujo

1. Pedir permiso y obtener el push token del dispositivo.
2. Enviar ese token a tu backend y guardarlo asociado al usuario.
3. Tu backend envía notificaciones vía la **Expo Push API**.
4. La app maneja las notificaciones recibidas en primer plano y los taps
   que abren una screen.

```ts
import * as Notifications from "expo-notifications";

export async function registerForPush() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  // hacé POST del `token` a tu backend acá
  return token;
}
```

Manejar la interacción:

```ts
Notifications.addNotificationResponseReceivedListener((response) => {
  const url = response.notification.request.content.data?.url as string | undefined;
  if (url) router.push(url); // deep link dentro de la app
});
```

{: .important-title }
Importante

{: .important }
El push requiere **configuración externa** antes de funcionar de punta a
punta: una configuración de **FCM** para Android y una key de **APNs** para
iOS, además de un **dispositivo físico** — los simuladores y emuladores no
pueden recibir notificaciones push.
