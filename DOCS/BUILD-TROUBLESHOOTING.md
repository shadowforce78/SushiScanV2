# 🔧 Résolution des Problèmes de Build

Ce guide aide à résoudre les problèmes courants lors du build de SushiScan.

## ❌ **Problème Résolu : `xcopy: command not found`**

### 🐛 **Erreur**
```
sh: 1: xcopy: not found
Error: Process completed with exit code 127.
```

### ✅ **Solution Implémentée**
Nous avons remplacé le script `xcopy` spécifique à Windows par un **script Node.js multiplateforme** :

```javascript
// scripts/build.js - Script multiplateforme
const fs = require('fs');
const path = require('path');

function copyDirectorySync(src, dest) {
    // Copie récursive compatible avec tous les OS
}
```

### 📋 **Scripts Disponibles**
```json
{
  "build": "node scripts/build.js",          // ✅ Multiplateforme (Node.js)
  "build:windows": "xcopy ...",              // 🖥️ Windows uniquement
  "build:unix": "bash scripts/build.sh"      // 🐧 Linux/macOS uniquement
}
```

## 🚀 **GitHub Actions Corrigées**

### **Avant** (❌ Problématique)
```yaml
- name: Build Web Assets
  run: npm run build  # Utilisait xcopy sur Linux
```

### **Après** (✅ Fonctionnel)
```yaml
- name: Build Web Assets
  run: |
    echo "Building web assets with Node.js script..."
    npm run build  # Utilise le script Node.js multiplateforme
    echo "✅ Web build completed"
```

## 🔍 **Autres Problèmes Courants**

### **1. Android Build Fails**
```bash
# Erreur : ./gradlew: Permission denied
chmod +x android/gradlew
```

**Solution dans GitHub Actions :**
```yaml
- name: Make gradlew executable
  run: chmod +x android/gradlew
```

### **2. Android SDK Missing**
```bash
# Erreur : SDK not found
sdkmanager "build-tools;34.0.0"
sdkmanager "platforms;android-34"
```

**Solution dans GitHub Actions :**
```yaml
- name: Setup Android SDK Components
  run: |
    sdkmanager "build-tools;34.0.0"
    sdkmanager "platforms;android-34"
    sdkmanager "cmdline-tools;latest"
```

### **3. Node.js Version Mismatch**
```yaml
# Utiliser une version spécifique
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

### **4. Java Version Issues**
```yaml
# Java 17 pour Android builds modernes
- name: Setup Java
  uses: actions/setup-java@v4
  with:
    distribution: 'temurin'
    java-version: '17'
```

## 🧪 **Tests Locaux**

### **Tester le Build Web**
```bash
# Test du script multiplateforme
npm run build

# Vérifier la sortie
ls -la www/
```

### **Tester le Build Android**
```bash
# Build complet Android
npm run cap:build

# Build debug uniquement
cd android
./gradlew assembleDebug
```

### **Tester le Build Windows**
```bash
# Build Electron
npm run make

# Vérifier la sortie
ls -la out/make/
```

## 📊 **Workflow de Débogage**

1. **🔍 Identifier le Problème**
   - Lire les logs GitHub Actions
   - Reproduire localement

2. **🧪 Tester Localement**
   ```bash
   npm run build      # Test web assets
   npm run cap:sync   # Test Capacitor sync
   npm run make       # Test Electron build
   ```

3. **🔧 Appliquer la Correction**
   - Modifier les scripts si nécessaire
   - Tester à nouveau localement

4. **🚀 Valider avec GitHub Actions**
   - Push vers une branche test
   - Vérifier le build dans Actions

## 📝 **Logs Utiles**

### **Build Android Verbose**
```bash
cd android
./gradlew assembleRelease --stacktrace --info
```

### **Capacitor Debug**
```bash
npx cap run android --live-reload --external
```

### **Electron Debug**
```bash
npm run start  # Mode développement
```

## ⚡ **Optimisations Performances**

### **Cache NPM**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: 'npm'  # ⚡ Cache automatique
```

### **Cache Gradle**
```yaml
- name: Cache Gradle
  uses: actions/cache@v3
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
```

### **Builds Parallèles**
```yaml
jobs:
  build-windows:
    runs-on: windows-latest
  build-android:
    runs-on: ubuntu-latest  # ⚡ Parallèle
```

## 🎯 **Checklist de Validation**

- [ ] ✅ Script Node.js build fonctionne
- [ ] ✅ GitHub Actions passent
- [ ] ✅ APK Android généré
- [ ] ✅ EXE Windows généré
- [ ] ✅ Release automatique créée
- [ ] ✅ Artifacts uploadés
- [ ] ✅ Documentation à jour

## 📞 **Support**

Si vous rencontrez d'autres problèmes :

1. **📋 Vérifier les logs** dans GitHub Actions
2. **🔍 Reproduire localement** avec les commandes ci-dessus
3. **📝 Créer une issue** avec :
   - Description du problème
   - Logs d'erreur complets
   - OS et versions (Node.js, npm, etc.)
   - Étapes pour reproduire

---

**🍣 SushiScan - Build System v2.0**  
*Problèmes résolus avec ❤️ par SaumonDeLuxe*
