---
title: Alta en las wallets
parent: Módulos
nav_order: 2
---

# Alta en las wallets (Apple Pay y Google Wallet)

El proceso no técnico que hay que recorrer para que la tarjeta de un programa emisor (prepago, débito o crédito) pueda agregarse a **Apple Wallet** y **Google Wallet**, a mano y desde la app (*push provisioning*). Sale de un proceso real con una Mastercard prepago emitida a través de un procesador. El código lo cubre **expo-wallet-provisioning**; esta página cubre todo lo que pasa afuera del código. No incluye datos de ningún cliente.

## Roles

| Rol | Qué hace |
|---|---|
| **Emisor / cliente** | Dueño del programa y de la app. Hace el registro en la consola de Google, firma los contratos, aporta los activos de marca y graba los videos. |
| **Procesador** (por ejemplo Pomelo) | Procesa la tarjeta y hace de agregador ante las wallets y la red (Mastercard MDES / Visa VTS). Gestiona los allowlists y los scopes de la API y, en Apple, intermedia casi todo. |
| **Desarrollo** | Implementa el push provisioning en la app (iOS y Android) y los webhooks en el backend. |
| **QA / grabación** | Graba los videos de certificación en dispositivos reales. |

{: .important }
**Apple y Google no funcionan igual.** En Apple, el procesador intermedia todo: entitlement, envío de videos y aprobación del emisor. En Google, el procesador solo aporta el allowlist y la configuración del TSP (MDES/VTS). El registro, los contratos, la UX, las huellas y los videos los hace el emisor desde **su propia consola** de Google Pay & Wallet.

## Orden recomendado

1. Alta con el procesador para cada wallet: formularios, contrato y activos.
2. Publicar el sitio web: soporte, términos y tratamiento de datos.
3. **Apple:** pedir el entitlement de In-App Provisioning, armar el build, probar el push y grabar los videos.
4. **Google:** perfil del emisor, NDA y CTA, vínculo con el agregador, UX, paquete y huellas, y videos de App Review.
5. Configurar los webhooks de tokenización y verificarlos.
6. Esperar la aprobación final de cada wallet.

{: .warning }
**Planificá los congelamientos de fin de año.** Apple congela las altas de emisores aproximadamente entre mediados de noviembre y principios de enero. Google congela cambios a fin de noviembre (en 2026: del 20-nov al 1-dic, sin pedidos de allowlist hasta el día siguiente). Conviene tener todo enviado antes.

## Alta con el procesador

Un formulario por wallet. Desarrollo confirma el Bundle ID, el package name y la acción del intent **antes** de mandarlos.

| Wallet | Datos que piden |
|---|---|
| **Apple Pay** | Nombre del cliente, BIN, red y tipo de producto, país, ID y descripción del programa, sitio web, teléfono y correo de soporte, **Adam ID** (App Store), **Team ID** y **Bundle ID**. |
| **Google Pay** | Los mismos datos del programa, más el **package name** de Android y la **acción del intent** que abre la app (por ejemplo `<package>.OPEN`). |

- **Contrato:** Apple Pay Program Manager Agreement entre el procesador y el emisor, firmado por un representante legal.
- **Activos de marca**, normalmente sobre la plantilla del procesador: logo del emisor (1372 × 283 px), ícono (100 × 100 px), card art (1536 × 969 px, sobre la plantilla de la red) y una pieza de marketing de Apple Pay según las guías de Apple.
- **Sitio web:** correo de soporte dedicado y páginas públicas de soporte, términos y condiciones (revisados por legal) y tratamiento de datos. Revisá la ortografía del nombre de la marca en todos los activos y páginas.
- **Webhooks:** configurar en el dashboard del procesador los de tokenización (ciclo de vida del token y notificaciones) apuntando al backend, y **comprobar que las rutas existen y responden 200** antes de empezar las pruebas.

## Apple Pay

### Entitlement de In-App Provisioning

Lo pide el procesador a Apple. Revisá en el portal de Apple Developer que no siga apareciendo "No Requests" en **los tres App IDs**: la app, la extensión `.wallet` y la extensión `.walletui`. Puede hacer falta escalar varias veces (en el caso real tardó unos 3 días). Cuando esté asignado, generá el build de iOS con el entitlement.

### Error 403 en el push

**Síntoma:** el push desde la app falla con `403` en el endpoint de token provisioning del procesador (por ejemplo `token-provisioning/mastercard/apple-pay`).

**Causa:** al perfil del cliente en el procesador le faltaban los **scopes de tokenización**.

1. El procesador agrega los scopes que faltan.
2. Pedí un **access token nuevo, sin caché**: el anterior no trae los scopes nuevos.
3. Para depurar, compartí con el procesador **solo el campo `scope` del JWT** (nunca el token completo), con la hora y el `card_id` del intento.
4. Revisá que la tarjeta de prueba esté en el **allowlist**.

### Videos (los sube el procesador)

| # | Flujo | Qué debe verse |
|---|---|---|
| 1 | **Manual** | Wallet → + → tarjeta de débito o crédito → datos a mano → OTP → tarjeta activa. Sirve además para confirmar que el BIN está habilitado en Apple Pay. |
| 2 | **Push desde la app** | Botón "Agregar a Apple Wallet" en la app → tarjeta activa en Wallet. |
| 3 | **Wallet Extension** | Desde Apple Wallet, elegir la app del emisor → agregar la tarjeta. |

Difuminá los datos sensibles en los tres: número, nombre, dirección y correo.

Después del envío, la app tiene que pasar App Review con el entitlement y queda pendiente la **aprobación de Apple como emisor**, que puede tardar unas semanas.

## Google Wallet: registro en la consola

Casi todo se hace en la consola de **Google Pay & Wallet** del emisor.

| Paso | Detalle |
|---|---|
| **Perfil del emisor** | Datos del emisor. Abrir un caso con soporte de Push Provisioning. |
| **NDA y CTA** | Los firma un representante legal del emisor. |
| **Claves / agregador** | Vincular el **Merchant ID del emisor** con el **Merchant ID del procesador** (agregador), por caso de soporte. |
| **UX** | Subir las pantallas del flujo para que las aprueben. **Después no las toques:** cualquier cambio abre casos nuevos. |
| **App y huellas** | Cargar el package name y **las dos huellas SHA-256** (app signing key de Play y upload key) en la Push Provisioning API. Mandar las mismas huellas al procesador. |
| **TSP** | Elegir la red (por ejemplo Mastercard). Normalmente no hace falta cargar datos del procesador. |
| **App Review** | Consola → TSPs → red → cada caso de prueba → Subir video → compartir con el equipo de revisión de Google → "Enviar a revisión". |

### Builds de Android

- Las pruebas se hacen con **tarjetas de producción** y el build apuntando a producción.
- Si la app obliga a instalar la versión de Play, un APK instalado por fuera **no sirve**: hay que esperar a que Play apruebe el build.
- La app de producción tiene que apuntar al **target API** que Google exige en ese momento (en 2026: API 36).
- Las integraciones que hoy van solo por TSP tienen que **migrar a Unified Push Provisioning** (fecha límite anunciada: fin de 2026).

## Google Wallet: videos de App Review

Son 4 casos obligatorios, más **Bounce** si la app lo implementa (5 videos). Todos con los números de tarjeta ocultos y con todos los estados visibles: **cada video termina reabriendo la app y mostrando el estado del botón**.

| Caso | Qué debe verse | Dispositivo y cuenta |
|---|---|---|
| **1. Billetera nueva** | Teléfono sin Google Wallet → botón en la app → se instala Wallet → tarjeta activa → la app muestra "Agregada". | Un teléfono donde se pueda desinstalar Wallet (por ejemplo Samsung; **en Pixel no se puede**) y una cuenta de Google que nunca usó Wallet. |
| **2. Manual + estado** | Tarjeta agregada a mano en Wallet → la app esconde el botón → se quita la tarjeta → el botón vuelve. | Cualquiera. |
| **3. Quitar tarjeta** | Push desde la app → se quita en Wallet → el botón vuelve. | Cualquiera. |
| **4. Ruta amarilla** | Tarjeta manual pendiente de verificación → la app lleva a Wallet a verificar (OTP) → activa → "Agregada". | Cualquiera. |
| **5. Bounce** | Wallet sin tarjetas → + → Tarjeta de pago → elegir la app del emisor → login → pantalla de la tarjeta sin avisos → agregar → "Agregada". | Cuenta de Google que nunca usó Wallet (si no, Wallet muestra las tarjetas guardadas en lugar de la lista de bancos). |

**Orden de grabación sugerido:** 3 (el más fácil) y después 1 → 5 → 4 → 2.

### Lo que aprendimos grabando

- Un video que no sirve para un caso puede servir para otro (uno pensado como caso 1 terminó usándose como caso 3).
- Difuminá el número, el nombre, la dirección, el correo **y las otras tarjetas** que aparezcan en Wallet.
- Durante la carga manual la pantalla se ve **negra** por el `FLAG_SECURE` de Google. Es normal.
- Subí el bloqueo automático de pantalla (al menos 40 s, o desactivalo) y contemplá que la app pide login al reabrirse.
- El estado "Agregada" puede tardar unos segundos en aparecer.
- Concedé antes el permiso de notificaciones, tené a mano el OTP para el caso 4 y usá una cuenta de Google limpia para los casos 1 y 5.
- Los relojes vinculados pueden interferir (`hasEligibleTokenizationTarget`). Si no se va a soportar el reloj, considerá deshabilitar ese destino.
- La app puede bloquear la grabación en pantallas sensibles (por ejemplo "Ver datos de la tarjeta"). Comprobá que se pueda grabar el resto del flujo.

## Si algo falla

### El botón "Agregar a Google Wallet" no se esconde

**Síntoma:** después de agregar la tarjeta (manual o por push), la app sigue mostrando el botón, aunque se reabra. Con esto fallan los casos 2 y 4. Revisá, en este orden:

1. **`listTokens` y package name.** Google solo le devuelve a la app los tokens cuya metadata incluye **su package name**. En Mastercard sale de `productConfig.issuerMobileApp.openIssuerMobileAppAndroidIntent.packageName` en la respuesta *Digitize* de MDES. Confirmá con el procesador que está configurado en el perfil del programa.
2. **`isTokenized`.** Compara los **últimos 4 del FPAN + red + TSP**. Si alguno no coincide, la app no ve la tarjeta.
3. **Data change callbacks.** La app tiene que **releer el estado de los tokens al volver a primer plano** (y registrar el callback de cambios de Wallet).
4. **Ruta amarilla.** Con un token pendiente, un push nuevo falla como **duplicado**. Se resuelve activando el token por backend o llamando a `tokenize(tokenReferenceId)` en lugar de un push nuevo.
5. **Wearables.** Un reloj vinculado puede cambiar el destino elegible. Probá con el destino reloj deshabilitado.

### La dirección de facturación de Google es siempre la misma

Había un `UserAddress` de ejemplo hardcodeado en la llamada de push. Se reemplaza por la dirección real (la del usuario o la del emisor, según lo que defina el programa).

### Documentación de Google que conviene tener a mano

Los casos de prueba oficiales por TSP y las best practices de *Reading wallet state* y *Wallet operations*.

## Lo que gestiona el procesador

| Tema | Detalle |
|---|---|
| **Apple** | Escala el entitlement, revisa y sube los videos, y sigue la aprobación del emisor. |
| **Scopes de la API** | Agrega los scopes de tokenización al perfil del cliente. Si aparece un 403, es lo primero que hay que revisar. |
| **Allowlists** | Apple: por `card_id` (en Mastercard no hace falta SEID; eso aplica a Visa). Google: solo `card_id`. Cada cambio tarda **unos 15 minutos** en impactar: pedilo con tiempo para cada tarjeta de prueba. |
| **Grupo de afinidad / límites** | Habilitar compras con tarjeta presente y comercios de uso diario para poder probar pagos reales con la tarjeta tokenizada. |
| **Configuración del TSP** | Package name y metadata de la app en el perfil MDES/VTS. |
| **Google** | Indica qué TSP elegir y pasa la documentación de casos de prueba. **No sube los videos.** |

## Checklist final

**Alta**
- [ ] Formularios de Apple Pay y de Google Pay enviados al procesador
- [ ] Contrato Apple Pay Program Manager firmado
- [ ] Logo, ícono, card art y pieza de marketing entregados
- [ ] Páginas de soporte, términos y privacidad publicadas
- [ ] Webhooks de tokenización configurados y respondiendo 200

**Apple**
- [ ] Entitlement de In-App Provisioning asignado en los 3 App IDs
- [ ] Build de iOS con el entitlement aprobado en App Store
- [ ] Scopes de tokenización otorgados y push funcionando con un token nuevo
- [ ] Tarjetas de prueba en el allowlist
- [ ] Videos de los flujos manual, push y Wallet Extension enviados
- [ ] Aprobación de Apple como emisor

**Google**
- [ ] Perfil del emisor y caso de Push Provisioning
- [ ] NDA y CTA firmados
- [ ] Merchant ID vinculado al del agregador
- [ ] Pantallas de UX aprobadas
- [ ] Package name y las dos huellas SHA-256 cargados en la consola y enviados al procesador
- [ ] TSP seleccionado
- [ ] Build de producción publicado en Play con el target API vigente
- [ ] Botón con el estado correcto (se esconde y vuelve a aparecer)
- [ ] Videos de los casos 1 a 5 grabados, difuminados, subidos y enviados a revisión
- [ ] Plan de migración a Unified Push Provisioning

## Ver también

- **expo-wallet-provisioning**: el paquete, sus recetas y el checklist de revisión del lado del código.
