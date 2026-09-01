---
title: Publicación en las Tiendas
parent: Compilación y Distribución
nav_order: 7
---

# Publicación en las Tiendas

`eas submit` solo **sube** el binario. En las dos tiendas el build queda en una
zona de espera — TestFlight en iOS, un track en Google Play — y no hace **nada**
por sí solo. Para que salga a producción todavía tenés que entrar a la consola
web, asociar el build a un release, completar los metadatos requeridos y
enviarlo a **revisión**.

En una línea: **producción = subir (`eas submit`) + un release en la consola +
una revisión aprobada.**

Esta página arranca justo donde termina
[Lanzamientos a Producción](production-releases.html). Cada tienda tiene dos
flujos: el **primer release a producción** (una configuración larga, una sola vez
por app) y cada **actualización** posterior (un ciclo corto).

## App Store Connect

Subir un build y publicarlo son dos cosas distintas. El mismo build que subís con
`eas submit` aparece en **TestFlight** y les puede llegar a los testers de
TestFlight en minutos — pero llegar a la **App Store pública** siempre requiere
crear una versión y enviarla **a revisión**.

### Primer release a producción (una vez por app)

El primer release tiene toda la configuración inicial de una sola vez. Los pasos
1 a 3 son la parte tediosa que no volvés a tocar; los pasos 4 a 6 son el "mandarlo
de verdad".

1. **Creá el registro de la app.** App Store Connect → **My Apps** → **+** →
   **New App**. Poné plataforma, nombre, idioma principal, **bundle ID** y un
   SKU. El bundle ID tiene que coincidir con el de `app.json` / `eas.json`.

   {: .note-title }
   Nota

   {: .note }
   El desplegable de bundle ID solo lista identificadores que Apple ya conoce. Si
   el tuyo no está, el App ID todavía no fue registrado — eso es un tema de
   credenciales/provisioning, no algo que se arregle en esta pantalla.

2. **Esperá a que el build termine de procesarse.** Después de `eas submit` el
   build aparece en **TestFlight** como *Processing* — normalmente unos minutos,
   hasta ~1 hora. Además tiene que pasar el **export compliance** antes de que
   puedas asociarlo a una versión.

3. **Completá los metadatos de una sola vez.** La tienda no te deja enviar hasta
   que esté todo lo requerido. Recorré esta checklist (cada ítem vive en la barra
   lateral de la app):
   - **App Privacy** — el cuestionario de recolección de datos. Declarás qué
     datos junta la app y para qué. Es obligatorio; sin esto no podés enviar.
   - **Age rating** — un cuestionario corto que genera la clasificación.
   - **Category** y **Pricing & Availability** — categoría principal, precio (o
     gratis) y países.
   - **App Review Information** — una **cuenta de prueba** (si la app tiene login)
     y un contacto. Que falte la cuenta de prueba es una de las causas más
     comunes de rechazo.
   - **Screenshots** — los tamaños de dispositivo requeridos (como mínimo un
     iPhone de 6.7"). Que falte un tamaño requerido bloquea el envío.
   - **Description, keywords, support URL** — los textos de la ficha.

4. **Creá la versión y asociá el build.** Abrí la página **1.0 Prepare for
   Submission** → sección **Build** → **(+)** → elegí el build que terminó de
   procesarse en el paso 2.

5. **Enviá a revisión (Submit for Review).** Respondé los prompts de export
   compliance e IDFA (identificador de publicidad). El estado pasa por **Waiting
   for Review → In Review → Pending Developer Release** (o **Ready for Sale**).

6. **Publicá (Release).** Elegí cómo sale a producción el build aprobado:
   - **Manually release this version** — recomendado para el primer lanzamiento,
     así apretás el botón cuando estés listo.
   - **Automatically release** — sale en cuanto la revisión aprueba.

### Actualizaciones (el ciclo corto)

Una vez que la app existe, sacar una versión nueva es rápido — los metadatos del
primer release se mantienen.

1. Subí el número de versión/build (si usás `autoIncrement` en `eas.json`, el
   número de build se maneja solo).
2. `eas submit` → esperá a que el build termine de procesarse en TestFlight.
3. App Store Connect → **(+ Version or Platform)** → poné el nuevo número de
   versión (ej. `1.1`).
4. Completá **What's New in This Version** y seleccioná el nuevo build.
5. Activá **Phased Release** — despliega la actualización a los usuarios
   existentes durante 7 días en vez de todos de golpe. Desde la misma pantalla
   podés pausarlo, o publicar a todos de una.
6. **Enviá a revisión (Submit for Review).**

{: .note-title }
¿Sigue en "Processing"?

{: .note }
Un build puede quedar en *Processing* hasta una hora, y a veces Apple te manda un
mail por una respuesta de compliance que falta. Si un build nunca se vuelve
seleccionable, revisá tu mail y la página de detalle del build — normalmente
necesita una respuesta manual primero.

## Google Play

Google Play funciona distinto a Apple en tres cosas que confunden a quienes
aprendieron iOS primero:

- **Los releases viven en tracks.** *Internal testing → Closed testing → Open
  testing → Production.* `eas submit` sube el AAB; después vos creás un
  **release** en un track y lo desplegás. Production es simplemente el último
  track.
- **Play App Signing.** La primera vez, Google inscribe tu app en Play App
  Signing y administra la clave de firma. Esto suele ser automático.
- **La primera revisión es lenta.** La revisión inicial de Google puede tardar
  **días**, no horas.

{: .warning-title }
Advertencia

{: .warning }
Planificá el primer envío de Android con margen. A diferencia de una
actualización de rutina, la primera revisión es lenta, y una cuenta de
desarrollador **personal** nueva puede necesitar un período de closed testing con
testers reales antes de poder publicar a Production.

### Primer release a producción (una vez por app)

1. **Creá la app.** Play Console → **Create app**. Poné el nombre, el idioma por
   defecto, app-o-juego, gratis-o-paga, y aceptá las declaraciones.

2. **Completá la checklist "Set up your app".** El Dashboard lista todo lo que la
   tienda exige antes de poder publicar. Recorrelo:
   - **App access** — un login de prueba si alguna parte de la app está detrás de
     autenticación.
   - **Ads** — declarás si la app tiene publicidad.
   - **Content rating** — el cuestionario que genera la clasificación.
   - **Target audience and content** — los grupos de edad a los que apunta la
     app.
   - **Data safety** — el formulario de recolección de datos de Google (el
     equivalente del App Privacy de Apple). Obligatorio.
   - **Privacy policy** — la URL es obligatoria.
   - **Store listing** — título, descripciones corta y larga, screenshots, ícono
     y el **feature graphic** (1024×500).
   - **Countries and pricing** — países y precios.

3. **Confirmá que el AAB se subió.** Después de `eas submit` el bundle aparece en
   el track de destino, o en el **App bundle explorer**. `eas submit` para
   Android necesita una **service-account key** de Google Play — esa
   configuración de una sola vez está en
   [Lanzamientos a Producción](production-releases.html); EAS te guía para
   hacerla.

4. **Creá el release de producción.** **Production** (nav izquierdo) → **Create
   new release**. Seleccioná el AAB que subiste (o promové uno desde un track de
   testing), y poné el nombre del release y las **release notes**.

5. **Desplegalo.** **Review release** → **Start rollout to Production**. Usá un
   **staged rollout percentage** (la versión de Play del phased release) — ej.
   empezá con el 20% de los usuarios.

6. **Esperá la revisión.** El estado pasa de **In review** a **Live**. El primer
   envío es el lento; las actualizaciones después son mucho más rápidas.

### Actualizaciones (el ciclo corto)

1. `eas submit` → se sube el nuevo AAB.
2. **Production** → **Create new release** → seleccioná el nuevo AAB.
3. Escribí las **release notes** (por idioma, dentro de bloques
   `<en-US>…</en-US>`).
4. Poné el **staged rollout %** (ej. 20%) y **Start rollout**.
5. **Gestioná el rollout después** — desde la misma pantalla de Production podés
   subir el porcentaje, o **frenar el rollout** (halt) si algo salió mal. El
   resto de los metadatos se mantienen; normalmente solo tocás las notas y el
   rollout.

{: .warning-title }
Advertencia

{: .warning }
Nunca hagas `eas submit` de un build **preview** (ad-hoc) a ninguna tienda — la
tienda lo rechaza. Siempre compilá y enviá el profile **production**. Ver la
tabla de [Solución de Problemas](troubleshooting.html) para el error exacto.

## Apple ↔ Google, lado a lado

Si conocés una plataforma, esto mapea los conceptos a la otra:

| Concepto | App Store Connect | Google Play |
| --- | --- | --- |
| Dónde cae un build subido | TestFlight | Un track (Internal / Closed / Open / Production) |
| Despliegue gradual a usuarios | Phased Release (7 días) | Staged rollout (% que elegís) |
| Declaración de datos | App Privacy | Data safety |
| Clasificación de contenido/edad | Age rating (cuestionario) | Content rating (cuestionario) |
| Qué necesita para "salir" | Versión + Submit for Review | Release en Production + rollout |

## Ver también

- [Lanzamientos a Producción](production-releases.html) — la mitad del CLI
  (`eas build` + `eas submit`).
- [Solución de Problemas](troubleshooting.html) — errores comunes de
  submit/build.
