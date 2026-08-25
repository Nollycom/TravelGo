# TravGo KSA - Déploiement Firebase (Région me-central1 = Dammam)
# Prérequis: firebase login avec nollycom99@gmail.com
param([string]$ProjectId="travgo-ksa")

Write-Host "=== TravGo KSA Deploy ===" -ForegroundColor Green
Write-Host "Projet: $ProjectId | Région: me-central1 (Dammam) | Devise: SAR" -ForegroundColor Cyan

# 1. Vérif auth
firebase projects:list | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host "Non connecté. Lance: firebase login" -ForegroundColor Red; exit 1 }

# 2. Créer projet s'il n'existe pas
$exists = firebase projects:list 2>&1 | Select-String $ProjectId
if (-not $exists) {
  Write-Host "Création projet $ProjectId..." -ForegroundColor Yellow
  firebase projects:create $ProjectId --display-name "TravGo" --region me-central1
  # alternative via gcloud: gcloud projects create $ProjectId --name="TravGo"
}

firebase use $ProjectId

# 3. Activer APIs nécessaires
gcloud services enable firebase.googleapis.com firestore.googleapis.com storage.googleapis.com --project $ProjectId 2>&1 | Out-Null

# 4. Build Next.js
Write-Host "Build Next.js..." -ForegroundColor Yellow
npm run build

# 5. Init Firestore & Storage si premier deploy
# firebase firestore:databases:create --region=me-central1 --project $ProjectId 2>&1 | Out-Null

# 6. Deploy Hosting (Frameworks) + Firestore rules + Storage rules
Write-Host "Deploy Firebase (hosting + firestore + storage)..." -ForegroundColor Yellow
firebase deploy --only hosting,firestore,storage --project $ProjectId

Write-Host "=== Déployé ===" -ForegroundColor Green
Write-Host "URL: https://$ProjectId.web.app  et  https://$ProjectId.firebaseapp.com" -ForegroundColor Cyan
Write-Host "Console: https://console.firebase.google.com/project/$ProjectId/overview" -ForegroundColor Cyan
Write-Host "Ajoute nollycom99@gmail.com comme Owner dans IAM si besoin: https://console.cloud.google.com/iam-admin/iam?project=$ProjectId"
