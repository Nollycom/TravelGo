# TravGo — Discover. Compare. Travel. | KSA

**Site officiel:** https://travgo.web.app  
**Projet Firebase:** `travgoravel` (site principal `travgo`) — oublier `travgoravel.web.app`  
**Région:** `me-central1` (Dammam) — `SAR` `ar-SA` `Asia/Riyadh`

Marketplace touristique premium qui connecte voyageurs et agences vérifiées en Arabie Saoudite. Devis gratuits, prestataires licenciés MOT, offres mondiales au départ de Riyad/Jeddah/Dammam.

## Stack
- **Next.js 16.3.2** (Turbopack, `output: export`, `trailingSlash: true`, `images.unoptimized: true`) → `out/` pour Hosting + Capacitor
- **React 19.2.8**, **Tailwind 4**, **TypeScript 5**
- **Firebase 12.18.0** (`travgoravel`): Auth, Firestore, Storage, Hosting, Analytics (me-central1)
- **Capacitor 8.5.0** (`@capacitor/app 8.1.1`) → `android/` `com.travgo.app` `TravGo`

## Données Firebase / Firestore
- **Users:** seul compte conservé `khalil.alnajjar81@gmail.com` (`ADMIN`, `khalil-admin`) — demo nettoyé. Voir `src/app/admin/page.tsx:35`
- **Collections vides à seeder si besoin:** `offers`, `providers`, `categories`, `destinations`, `reels`, `quoteRequests`, `providerRequests` (données statiques dans `src/lib/data.ts` utilisées en attendant)
- **Règles:** `firestore.rules` + `storage.rules` (permissif temporaire pour contourner `CONFIGURATION_NOT_FOUND` Auth désactivé — à resserrer après activation Email/Password)
- **Seed:** `src/lib/firebase/seed.ts` + bouton admin *Seed KSA*

## Auth — Correction 25/08/2026
- **Cause:** `CONFIGURATION_NOT_FOUND` (Email/Password désactivé sur `travgoravel`)
- **Fix `register`/`login`:** `createUserWithEmailAndPassword`/`signInWithEmailAndPassword` + fallback Firestore `users` (`email/phone` + `password`) + `localStorage travgo-role` → redirections `ADMIN→/admin`, `PROVIDER→/provider/dashboard`, `USER→/dashboard`
- **Prestataire:** `PROVIDER_PENDING` + `providerRequests` sans password — validation admin requise
- **Action requise:** Console Firebase → `travgoravel` → Authentication → Sign-in method → **Activer Email/Password** → ensuite `firebase deploy --only firestore:rules,storage`

## Icônes & Logo
- Source: `C:/Users/Lenovo/Desktop/logo apk travgo.png` (666×716)
- Générés: `src/app/favicon.ico` (16/32/48/256 multi), `src/app/icon.png` 512, `src/app/apple-icon.png` 180, `public/*` + SVG base64 wrappers — `src/app/layout.tsx:18` metadata `icons`
- Android mipmap `mdpi 48/hdpi 72/xhdpi 96/xxhdpi 144/xxxhdpi 192` + `ic_launcher_foreground.png` recréés via `sharp` — fond `#FFFFFF`

## Android — Back Button
- `src/components/layout/CapacitorBack.tsx` (`CapApp.addListener('backButton')` → `history.back()` / `router.back()`, `exitApp()` seulement sur `/`)
- `android/app/src/main/java/com/travgo/app/MainActivity.java` (`canGoBack()->goBack()`)

## APK — Firebase Accessible
- **Local:** `android/app/build/outputs/apk/debug/app-debug.apk` **9.71 MB** (04/08/2026) — aussi `out/app-debug.apk` + `public/app-debug.apk` (copié après build pour Hosting)
- **Hosting:** après `firebase deploy --only hosting:travgo` → **https://travgo.web.app/app-debug.apk**
- **GitHub Release:** https://github.com/Nollycom/TravelGo/releases/tag/v1.0.0 (`app-debug.apk`)
- **Install:** `adb install out/app-debug.apk` ou télécharger depuis le site

## Hosting — Déploiement correct `travgo.web.app`
```json
// firebase.json
"hosting": [{ "site": "travgo", "public": "out", "rewrites": [{ "source": "**", "destination": "/index.html" }] }]
// .firebaserc
{ "projects": { "default": "travgoravel" } }
```
```powershell
firebase login
firebase deploy --only hosting:travgo --project travgoravel
firebase deploy --only firestore:rules,storage --project travgoravel
# ou tout:
firebase deploy --project travgoravel
```
`https://travgo.web.app/__/firebase/init.json` → `projectId: travgoravel` — `travgoravel.web.app` ignoré.

## GitHub
- **Dépôt:** https://github.com/Nollycom/TravelGo (`main`)
- **Push:** `gh repo create TravelGo --public --source=. --remote=origin --push` déjà fait
- **Releases:** APK via `gh release create v1.0.0 android/app/build/outputs/apk/debug/app-debug.apk`

## Dev
```powershell
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ + 38 pages SSG
npx cap sync android
# Android
$env:ANDROID_HOME="C:\Users\Lenovo\AppData\Local\Android\Sdk"; $env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
.\gradlew assembleDebug # android/app/build/outputs/apk/debug/app-debug.apk
```

## TODO après activation Auth
- [ ] Supprimer champ `password` de `users/khalil-admin` (exposé en clair via REST)
- [ ] Resserrer `firestore.rules` (`allow create: if auth.uid==userId`, `allow update: if owner||isAdmin`)
- [ ] Resserer `storage.rules`
- [ ] Sécuriser `/admin` via `onAuthStateChanged` + `getDoc(users/uid).role`
- [ ] Seeder Firestore (`npx tsx src/lib/firebase/seed.ts`) si besoin de données dynamiques
