# Solutions CORS pour Capacitor Android

## Problème initial
L'application Capacitor Android rencontrait des erreurs CORS lors des appels à l'API :
```
Access to fetch at 'https://api.saumondeluxe.com/scans/homepage' from origin 'https://localhost' has been blocked by CORS policy
```

## Solutions implémentées

### 1. Configuration Capacitor
**Fichier:** `capacitor.config.json`

```json
{
  "server": {
    "androidScheme": "capacitor",
    "allowNavigation": [
      "https://api.saumondeluxe.com/*"
    ],
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true
  }
}
```

- **`androidScheme: "capacitor"`** : Change le schéma de `https://localhost` vers `capacitor://` pour éviter les restrictions CORS
- **`allowNavigation`** : Autorise explicitement les requêtes vers l'API
- **`cleartext: true`** : Autorise le traffic HTTP non chiffré si nécessaire
- **`allowMixedContent: true`** : Permet le contenu mixte HTTPS/HTTP

### 2. Fonction HTTP Helper
**Fichier:** `www/js/index.js`

```javascript
// Capacitor HTTP helper function to handle CORS issues
async function httpRequest(url, options = {}) {
    const fetchOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    try {
        console.log(`Making HTTP request to: ${url}`);
        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`HTTP request successful for: ${url}`);
        return data;
    } catch (error) {
        console.error(`HTTP request failed for ${url}:`, error);
        throw error;
    }
}
```

### 3. Modification des appels API
Remplacement de tous les appels `fetch()` par `httpRequest()` :

**Avant :**
```javascript
const response = await fetch(API);
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
```

**Après :**
```javascript
const data = await httpRequest(API);
```

## Fonctions mises à jour

- ✅ `getScansHomepage()` - Page d'accueil (TERMINÉ)
- ✅ `fetchMangaDetails()` - Détails manga (TERMINÉ)
- ✅ `searchManga()` - Recherche (TERMINÉ)
- ✅ `fetchChapterData()` - Données chapitre (TERMINÉ)

## Tests
1. **Synchroniser :** `npm run cap:sync`
2. **Tester sur Android :** `npm run cap:run:android`
3. **Debug :** Vérifier les logs dans Android Studio

## Problèmes potentiels et solutions

### Si les erreurs CORS persistent :
1. **Nettoyer et reconstruire :**
   ```bash
   npx cap sync android --clean
   ```

2. **Vérifier la configuration réseau :**
   ```bash
   npx cap doctor
   ```

3. **Alternative - Proxy local :**
   Si les problèmes persistent, considérer l'ajout d'un proxy dans le serveur de développement.

### Logs utiles pour le debugging :
- Vérifier les logs Capacitor dans Android Studio
- Console JavaScript dans Chrome DevTools (chrome://inspect)
- Logs réseau dans l'onglet Network

## Scripts utiles

```bash
# Développement avec live reload
npm run android:dev

# Build et test
npm run cap:sync && npm run cap:run:android

# Ouvrir Android Studio
npm run cap:open:android
```

## Notes importantes
- Toujours utiliser `npm run build:web` avant de tester sur Android
- Les changements dans `src/public/` doivent être synchronisés vers `www/`
- La configuration `androidScheme: "capacitor"` est recommandée pour éviter les problèmes CORS
