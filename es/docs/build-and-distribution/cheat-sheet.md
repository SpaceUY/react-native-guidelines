---
title: Hoja de Referencia Rápida
parent: Compilación y Distribución
nav_order: 9
---

# Hoja de Referencia Rápida

```bash
# --- Configuración inicial (una vez) ---
cp scripts/.env.example .env
npx firebase login
eas login

# --- Distribución interna (Firebase) ---
pnpm run release:preview:android
pnpm run release:preview:ios

# --- Dispositivos iOS ---
eas device:create
eas device:list --apple-team-id <TEAM_ID>
eas credentials                     # regenerar profile — incluir TODOS los dispositivos

# --- Verificar un IPA (qué dispositivos incluye) ---
unzip -o -q ./build/app-preview.ipa "Payload/*/embedded.mobileprovision" -d /tmp/ipa_check
security cms -D -i /tmp/ipa_check/Payload/*.app/embedded.mobileprovision -o /tmp/profile.plist
/usr/libexec/PlistBuddy -c "Print :ProvisionedDevices" /tmp/profile.plist

# --- Producción (tiendas) ---
eas build --profile production --platform ios --local --output ./build/app-production.ipa
eas submit --profile production --platform ios --path ./build/app-production.ipa
eas build --profile production --platform android --local --output ./build/app-production.aab
eas submit --profile production --platform android --path ./build/app-production.aab
```

## Modelo mental

|  | Interno (testing) | Producción (tienda) |
| --- | --- | --- |
| Herramienta | Firebase App Distribution | EAS Submit |
| Profile | `preview` (interno / ad-hoc) | `production` (tienda) |
| Comando | `pnpm run release:preview:<platform>` | `eas build ...` + `eas submit ...` |
| UDIDs de iOS | Requeridos | N/A |
| Toca las tiendas | Nunca | Sí |
