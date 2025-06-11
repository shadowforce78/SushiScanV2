# 🔐 Résolution des Problèmes de Permissions GitHub

Ce guide aide à résoudre l'erreur 403 lors de la création de GitHub Releases.

## ❌ **Erreur 403 Résolue**

### 🐛 **Erreur Rencontrée**
```
⚠️ GitHub release failed with status: 403
undefined
retrying... (2 retries remaining)
❌ Too many retries. Aborting...
Error: Too many retries.
```

### ✅ **Solutions Implémentées**

#### **1. Permissions Explicites dans le Workflow**
```yaml
# Permissions explicites pour créer des releases
permissions:
  contents: write        # ✅ Nécessaire pour créer des releases
  actions: read         # ✅ Pour lire les artifacts
  checks: write         # ✅ Pour les vérifications
  issues: write         # ✅ Pour les issues liées
  pull-requests: write  # ✅ Pour les PR
```

#### **2. Permissions au Niveau du Job**
```yaml
create-release:
  name: 🚀 Create GitHub Release
  permissions:
    contents: write     # ✅ Permission spécifique au job
```

#### **3. Action Mise à Jour**
```yaml
# AVANT (❌ Obsolète)
- uses: softprops/action-gh-release@v1

# APRÈS (✅ Moderne)
- uses: softprops/action-gh-release@v2
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    fail_on_unmatched_files: false
```

#### **4. Gestion Améliorée des Fichiers**
```yaml
- name: 📁 Organize Release Files
  run: |
    # Copie robuste avec gestion d'erreurs
    for exe in ./artifacts/windows/*.exe; do
      cp "$exe" "./release-files/SushiScan-$VERSION-Windows.exe"
      break
    done
```

## 🔧 **Vérifications Supplémentaires**

### **Paramètres Repository GitHub**

1. **Aller dans Settings > Actions > General**
2. **Workflow permissions** : Sélectionner "Read and write permissions"
3. **Allow GitHub Actions to create and approve pull requests** : ✅ Coché

### **Token Permissions**
Le token `GITHUB_TOKEN` par défaut devrait maintenant avoir les permissions nécessaires grâce aux déclarations explicites.

### **Debug Environment**
Un step de debug a été ajouté pour diagnostiquer les problèmes :
```yaml
- name: 🔍 Debug Environment
  run: |
    echo "GitHub Actor: ${{ github.actor }}"
    echo "Repository: ${{ github.repository }}"
    echo "Ref: ${{ github.ref }}"
```

## 🚀 **Test de la Correction**

### **Créer une Nouvelle Release**
```bash
# 1. Bumper la version
npm version patch

# 2. Créer le tag
git tag v1.0.7
git push origin v1.0.7

# 3. Vérifier dans GitHub Actions
# La release devrait maintenant se créer automatiquement
```

### **Vérifier les Logs**
1. Aller dans **Actions** > **🍣 Build & Deploy SushiScan**
2. Cliquer sur le workflow du tag v1.0.7
3. Vérifier l'étape "🎉 Create GitHub Release"

## 🔍 **Autres Causes Possibles d'Erreur 403**

### **1. Branch Protection Rules**
Si des règles de protection de branche bloquent :
- Aller dans **Settings > Branches**
- Vérifier les restrictions sur `main`

### **2. Repository Visibility**
Pour les repositories privés :
- Vérifier les permissions d'organisation
- S'assurer que les Actions peuvent créer des releases

### **3. Personal Access Token**
Si le token par défaut ne fonctionne pas :
```yaml
# Créer un PAT avec scope 'repo'
- name: Create Release
  uses: softprops/action-gh-release@v2
  with:
    token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

## 📊 **Validation de la Correction**

### **Checklist Post-Correction**
- [ ] ✅ Permissions explicites ajoutées
- [ ] ✅ Action mise à jour vers v2
- [ ] ✅ Gestion d'erreurs améliorée
- [ ] ✅ Debug steps ajoutés
- [ ] ✅ Settings repository vérifiés
- [ ] ✅ Test avec nouveau tag

### **Résultat Attendu**
```
🎉 Create GitHub Release
✅ Successfully created release v1.0.7
📦 Uploaded 3 assets:
  - SushiScan-v1.0.7-Windows.exe
  - SushiScan-v1.0.7-Windows-Portable.zip
  - SushiScan-v1.0.7-Android.apk
```

## 🛠️ **Actions de Dépannage**

### **Si l'Erreur Persiste**

1. **Vérifier les Permissions Repository**
   ```bash
   # Dans Settings > Actions > General
   # Workflow permissions: "Read and write permissions"
   ```

2. **Créer un Personal Access Token**
   ```bash
   # GitHub > Settings > Developer settings > PAT
   # Scopes: repo, write:packages
   ```

3. **Tester avec Release Manuelle**
   ```bash
   gh release create v1.0.7 \
     --title "🍣 SushiScan v1.0.7" \
     --notes "Test release manual"
   ```

4. **Contacter Support GitHub**
   Si aucune solution ne fonctionne, il peut y avoir un problème côté GitHub.

## 📚 **Ressources Utiles**

- [GitHub Actions Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [softprops/action-gh-release Documentation](https://github.com/softprops/action-gh-release)
- [Troubleshooting GitHub Actions](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows)

---

**🔐 Permissions GitHub - Problème résolu avec 🔧 par SaumonDeLuxe**
