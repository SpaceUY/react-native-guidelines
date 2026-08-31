---
title: Verificar un IPA
parent: Compilación y Distribución
nav_order: 5
---

# Verificar un IPA

Antes de decirle a un tester "probá de nuevo", confirmá que el build
realmente incluye su dispositivo. Inspeccionás el provisioning profile
embebido dentro del `.ipa`:

```bash
# 1. Extraer el profile embebido del IPA
unzip -o -q ./build/app-preview.ipa "Payload/*/embedded.mobileprovision" -d /tmp/ipa_check

# 2. Decodificarlo a un plist legible
security cms -D -i /tmp/ipa_check/Payload/*.app/embedded.mobileprovision -o /tmp/profile.plist

# 3. Inspeccionar el tipo y los dispositivos incluidos
/usr/libexec/PlistBuddy -c "Print :Name" /tmp/profile.plist
/usr/libexec/PlistBuddy -c "Print :ProvisionedDevices" /tmp/profile.plist
```

Qué buscar:

- `:Name` debería decir **AdHoc**.
- `:ProvisionedDevices` tiene que **contener** el UDID del tester.

Comparás `:ProvisionedDevices` contra `eas device:list`. Si falta un UDID
que esperabas, volvé a **Agregar un Nuevo Dispositivo iOS** y regenerá el
profile incluyendo ese dispositivo, después recompilá.
