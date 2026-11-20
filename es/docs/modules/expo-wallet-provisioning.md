---
title: expo-wallet-provisioning
parent: Módulos
nav_order: 1
---

# expo-wallet-provisioning

Agregar una tarjeta a **Apple Wallet** y a **Google Wallet** desde la app, con los botones
oficiales: el usuario toca "Agregar a Apple Wallet" o "Agregar a la Billetera de Google",
confirma y la tarjeta queda lista para pagar. Esto es **push provisioning desde la app**.

- Paquete: `github.com/SpaceUY/expo-wallet-provisioning` (privado).
- Backend: el módulo `wallet-provisioning` de `github.com/SpaceUY/NestJS-Template`.

Sale de una app en producción que pasó las revisiones de Apple y de Google. En ese proyecto, la
mayor parte del trabajo no fue código: fueron aprobaciones, entitlements, videos de revisión y
reglas fáciles de pasar por alto. Esta página las lista.

## Cuándo usarlo

Cuando el proyecto emite tarjetas a través de un procesador (Pomelo, por ejemplo) y los
usuarios tienen que poder agregarlas a la billetera del teléfono. Cubre tarjetas Mastercard y
Visa (Visa todavía no está probado de punta a punta, ver **Visa** más abajo).

No cubre mostrarle el número de la tarjeta al usuario (una bóveda), tarjetas físicas ni Tap to
Add.

{: .important-title }
Importante

{: .important }
Arrancá los requisitos externos el primer día. El acceso al SDK de Google, el entitlement de
Apple y la configuración del procesador tardan semanas cada uno y corren en paralelo con el
desarrollo.

## Requisitos externos

El proceso paso a paso (formularios, registro en la consola, videos de revisión, allowlists, congelamientos de fin de año) está en **Módulos → Alta en las wallets**. Esta tabla es el resumen.

| Quién | Qué pedir | Qué entregás | Notas |
|---|---|---|---|
| **Apple** (a través del procesador o la red) | Entitlement de in-app provisioning (`com.apple.developer.payment-pass-provisioning`) para la app **y** las dos extensiones de Wallet | Team ID y bundle IDs | Se concede por bundle ID. Firmar otro bundle con él (un build `-dev`) rompe el build |
| **Apple** | La app asociada al producto de tarjeta (`associatedApplicationIdentifiers`) | Team ID + bundle ID | Lo configura el procesador o la red |
| **Apple** | Provisioning profiles regenerados | — | Después de que se concede el entitlement |
| **Google** | Acceso al SDK TapAndPay desde el portal de emisores | Solicitud de emisor | Bajo NDA, por emisor. **Nunca lo commitees en un repo compartido** |
| **Google** | La app en el allowlist de Google | Package name y huellas del certificado de firma | Confirmá la lista exacta de huellas en el checklist de lanzamiento vigente de Google |
| **Google** | Revisión de UX | Un PDF del flujo (declarando el aprovisionamiento por rebote), videos y capturas | Ver **Checklist de revisión** |
| **Procesador** | Credenciales, habilitación del BIN en la red, las apps registradas, webhooks de tokens | Bundle IDs, package name, URLs de webhooks | Ver **Procesador: Pomelo** |

## Instalación

```bash
pnpm add github:SpaceUY/expo-wallet-provisioning#v1.0.0
```

El paquete se compila al instalarse, y pnpm lo bloquea hasta que se habilita: la primera
instalación falla e imprime la línea de `allowBuilds` para agregar a `pnpm-workspace.yaml` (o
corré `pnpm approve-builds`). Ver el README del paquete.

```ts
// app.config.ts → plugins
['expo-wallet-provisioning', {
  android: { tapAndPayRepository: './vendor/tapandpay/m2repository' },
  ios: { provisioningEntitlementBundleIds: ['com.acme.app'], walletExtension: true },
}],
```

El plugin sigue **Arquitectura del Proyecto → SDKs Nativos Sin Plugin de Expo**: no se commitean
`ios/` ni `android/`, todo lo nativo entra por el plugin.

### Dónde va el SDK TapAndPay

Google le entrega el SDK a cada emisor aprobado. Guardá su repositorio Maven **dentro del repo
del propio proyecto** (por ejemplo `vendor/tapandpay/m2repository`) y apuntá `tapAndPayRepository`
ahí. Los builds de EAS lo necesitan en el repo, así que se commitea ahí, y solo ahí.

{: .warning-title }
Advertencia

{: .warning }
Nunca copies el SDK al paquete, a las guidelines, al template, a otro proyecto ni a un drive
compartido. La licencia es solo para ese emisor. Un prebuild de Android sin el SDK falla con un
mensaje que explica cómo conseguirlo; un prebuild solo de iOS no lo necesita.

## Uso

```tsx
const { walletState, isAdding, add } = useAddToWallet({
  card: card && {
    lastFour: card.lastFour,
    network: 'MASTERCARD',
    isActive: card.status === 'ACTIVE',
    cardholderName: card.nameOnCard,
    billingAddress, // opcional: completa el formulario de facturación de Google Wallet
  },
  // El template de NestJS envuelve las respuestas como { success, data }: devolvé el objeto de adentro.
  fetchApplePayData: (request) => api.post('/cards/me/wallet/apple-pay', request).then((r) => r.data.data),
  fetchGooglePayData: (request) => api.post('/cards/me/wallet/google-pay', request).then((r) => r.data.data),
  onError: () => showToast(t('card.walletAddError')),
});
```

Qué mostrar según `walletState`:

| `walletState` | iOS | Android |
|---|---|---|
| `CAN_ADD` | `<AddPassButton onPress={add} />` | `<GoogleWalletButton locale="es-419" onPress={add} isBusy={isAdding} />` |
| `ADDED` | Texto: "Agregada a Apple Wallet" | Texto: "Agregada a la Billetera de Google" |
| `UNAVAILABLE` | Nada | Nada |

- **Ubicación:** el botón va directamente debajo de la tarjeta, en la pantalla de la tarjeta.
  Opcionalmente, un banner que se puede cerrar y una fila en la configuración de la tarjeta con
  el mismo botón oficial.
- **El botón de Google** es el asset oficial, sin modificar, de al menos 48 dp de alto y con 8 dp
  libres alrededor. No le cambies el estilo ni lo metas dentro de otro botón.
- **El texto "Agregada" es obligatorio.** Lo pide Google, y el video de revisión de Apple
  termina ahí.
- **El mensaje de error** lo pone la app (`onError`); corre después de que se cierra la hoja de
  la billetera, así no queda escondido detrás.
- Podés montar `useAddToWallet` en todas las pantallas que haga falta. El estado se vuelve a
  leer cuando la app vuelve a primer plano.

## Recetas

Dependen de la navegación, la sesión y las pantallas de cada app, así que no están en el
paquete.

### Aprovisionamiento por rebote (Android)

Google Wallet puede abrir la app desde su propio flujo de "Agregar tarjeta". La app tiene que
caer **en la pantalla de la tarjeta, sin pantallas intermedias**, después del login si no hay
sesión, e incluso si la app estaba bloqueada. Se monta una vez, en la raíz:

```tsx
useWalletBounceListener(
  () => {
    setPendingDeepLink('/card');           // arranque en frío: lo retoma el login
    if (!isSignedIn) return;
    lockStore.setPendingPath('/card');     // app viva: ir ahí al desbloquear
    if (!isLocked) router.replace('/card');
  },
  { onCleared: () => lockStore.clearPendingPath('/card') },
);
```

El paquete manda el próximo `add()` como rebote y descarta el rebote si la app pasa a segundo
plano.

### Wallet Extension de Apple

Permite agregar la tarjeta desde **Wallet → "+"** (el video 3 de la revisión de Apple). Copiá
`templates/apple-wallet-extension/` del paquete y seguí su README. Las reglas que no cambian: la
extensión sin interfaz nunca refresca la sesión, la extensión con interfaz pide Face ID y
refresca una sola vez, y el arte de la tarjeta va dentro de la extensión.

### Capturas de pantalla

La pantalla de la tarjeta con el botón de la billetera **se puede** grabar (los videos de
revisión lo necesitan). Solo una pantalla que muestra el número completo de la tarjeta (una
bóveda) bloquea capturas y grabación, y solo mientras está abierta. Nunca muestres el número
completo en otro lugar.

## Backend

Usá el módulo `wallet-provisioning` del template de NestJS. La app llama a:

| Endpoint | Body | Respuesta |
|---|---|---|
| `POST /cards/me/wallet/apple-pay` | `{ cardId?, certificates, nonce, nonceSignature }` | `{ activationData, encryptedPassData, ephemeralPublicKey }` |
| `POST /cards/me/wallet/google-pay` | `{ cardId?, serverSessionId }` | `{ opc, googleOpc }` |

Las respuestas exitosas del template llegan envueltas como `{ success: true, data: <respuesta> }` (los
errores como `{ success: false, statusCode, message }`); las funciones de fetch del hook devuelven el
objeto de adentro.

El proyecto implementa de dónde salen las tarjetas (`CardResolver`) y qué pasa cuando un usuario
deja el alta sin terminar (`WalletProvisioningHooks`: mandar una push de recordatorio; Apple lo
pide). El README del módulo cubre la configuración y los webhooks.

## Procesador: Pomelo

*Borrá esta sección si el proyecto usa otro procesador.*

- **Credenciales:** client id y secret de la API, audience, y el secreto de webhooks (el mismo que
  el de los webhooks de transacciones).
- **Pedile a Pomelo** que habilite el producto de tarjeta para Apple Pay y Google Pay con la red,
  que registre las apps (bundle IDs, package name) y que configure los webhooks de tokens:
  `token-lifecycle` y `token-notification` (una sola URL; `event_id` distingue completado de
  abandonado).
- **Los usuarios** necesitan email y teléfono con código de país y sin "+", o Pomelo los rechaza.
- El adaptador del backend es `src/wallet-provisioning/pomelo-adapter/` en el template; se puede
  borrar sin tocar el resto.

## Checklist de revisión

**Google** (confirmalo contra el checklist de lanzamiento vigente de Google):

- Un video por caso: **a)** teléfono sin Google Wallet, **b)** tarjeta agregada y la app muestra
  "Agregada", **c)** tarjeta borrada desde Wallet y la app vuelve a mostrar el botón, **d)** una
  tarjeta esperando verificación de identidad (el botón la retoma).
- Aprovisionamiento por rebote desde Google Wallet hasta la pantalla de la tarjeta.
- Capturas de la pantalla con el botón y del estado de éxito.
- Sin número de tarjeta, CVC ni vencimiento en ningún video ni captura.

**Apple:**

- Video manual: Wallet → "+" → tarjeta a mano → OTP → activa (además confirma que el BIN está habilitado).
- Video de push: app → botón → hoja de Apple → "Agregada a Apple Wallet".
- Video de la Wallet Extension: Wallet → "+" → la app → tarjeta agregada.
- El recordatorio de alta abandonada.

## Visa

La red es un parámetro de cada tarjeta (`network: 'VISA'`), en las dos plataformas. Falta
confirmar en cada proyecto, con el procesador:

- los endpoints de Visa del procesador (la ruta de Apple Pay para Visa de Pomelo no está
  confirmada; todavía no hay una ruta conocida de Google Pay para Visa);
- qué esquema de cifrado pide Apple Pay para Visa (`encryptionScheme`, por defecto `ECC_V2`).

## Ver también

- **Módulos → Alta en las wallets**: el proceso no técnico con Apple, Google y el procesador
- **Arquitectura del Proyecto → SDKs Nativos Sin Plugin de Expo**
- El `README.md` del paquete (API) y su `RELEASE.md` (lo que el CI no puede verificar)
