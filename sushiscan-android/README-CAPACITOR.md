# Sushi Scan - Configuration Capacitor

## Structure du projet

Votre projet est maintenant configuré pour fonctionner avec Capacitor (Android). Voici la structure actuelle :

```
├── src/                    # Code source Electron (Desktop)
│   ├── index.js
│   ├── preload.js
│   └── public/            # Assets web originaux
├── www/                   # Assets web pour Capacitor (Mobile)
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── img/
├── android/               # Projet Android natif (généré par Capacitor)
├── capacitor.config.json  # Configuration Capacitor
└── package.json

```

## Scripts disponibles

### Développement Desktop (Electron)
```bash
npm start                  # Lance l'app Electron
npm run package          # Package l'app Electron
npm run make             # Crée les installateurs
```

### Développement Mobile (Capacitor)
```bash
npm run build:web        # Copie les fichiers de src/public vers www
npm run cap:sync         # Synchronise les assets web avec Android
npm run cap:run:android  # Lance l'app sur un appareil/émulateur Android
npm run cap:open:android # Ouvre le projet dans Android Studio
npm run android:dev      # Lance en mode développement avec live reload
npm run android:build    # Build l'APK de production
```

## Workflow de développement

### 1. Développement des features
- Modifiez vos fichiers dans `src/public/`
- Testez avec Electron : `npm start`

### 2. Test sur Android
```bash
# Synchroniser les changements vers www et Android
npm run cap:sync

# Lancer sur un appareil Android
npm run cap:run:android
```

### 3. Build de production
```bash
# Préparer les assets
npm run build:web

# Build Android
npm run android:build
```

## Plugins Capacitor installés

- **@capacitor/app** - Gestion du cycle de vie de l'app
- **@capacitor/status-bar** - Personnalisation de la barre de statut
- **@capacitor/splash-screen** - Écran de démarrage
- **@capacitor/haptics** - Retours haptiques
- **@capacitor/network** - État du réseau

## Configuration Android

Le projet Android se trouve dans le dossier `android/`. Vous pouvez :

1. Ouvrir avec Android Studio : `npm run cap:open:android`
2. Modifier l'icône dans `android/app/src/main/res/`
3. Configurer les permissions dans `android/app/src/main/AndroidManifest.xml`

## Prérequis pour Android

1. **Android Studio** installé
2. **Java 11+** (recommandé Java 17)
3. **Android SDK** configuré
4. Un **appareil Android** ou **émulateur** connecté

## Commandes utiles

```bash
# Vérifier la configuration Capacitor
npx cap doctor

# Lister les appareils connectés
npx cap run android --list

# Nettoyer et reconstruire
npx cap sync android --clean
```

## Notes importantes

- Les fichiers dans `www/` sont automatiquement générés, modifiez toujours `src/public/`
- Utilisez `npm run build:web` avant de tester sur Android
- Le live reload fonctionne avec `npm run android:dev`
