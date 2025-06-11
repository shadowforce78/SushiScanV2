#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script de build multiplateforme pour SushiScan
 * Copie les fichiers de src/public vers www pour Capacitor
 */

const srcDir = path.join(__dirname, '..', 'src', 'public');
const destDir = path.join(__dirname, '..', 'www');

console.log('🍣 SushiScan Build Script');
console.log('========================');
console.log(`📁 Source: ${srcDir}`);
console.log(`📁 Destination: ${destDir}`);

/**
 * Copie récursive d'un dossier
 */
function copyDirectorySync(src, dest) {
    // Créer le dossier de destination s'il n'existe pas
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
        console.log(`📁 Created directory: ${dest}`);
    }

    // Lire le contenu du dossier source
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Récursion pour les sous-dossiers
            copyDirectorySync(srcPath, destPath);
        } else {
            // Copier le fichier
            fs.copyFileSync(srcPath, destPath);
            console.log(`📄 Copied: ${entry.name}`);
        }
    }
}

/**
 * Fonction principale
 */
function build() {
    try {
        console.log('🚀 Starting build process...');
        
        // Vérifier que le dossier source existe
        if (!fs.existsSync(srcDir)) {
            throw new Error(`Source directory not found: ${srcDir}`);
        }

        // Nettoyer le dossier de destination
        if (fs.existsSync(destDir)) {
            console.log('🧹 Cleaning destination directory...');
            fs.rmSync(destDir, { recursive: true, force: true });
        }

        // Copier les fichiers
        console.log('📋 Copying files...');
        copyDirectorySync(srcDir, destDir);

        console.log('✅ Build completed successfully!');
        console.log(`📊 Files copied to: ${destDir}`);
        
        // Afficher le contenu copié
        const files = fs.readdirSync(destDir, { recursive: true });
        console.log(`📈 Total files copied: ${files.length}`);
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Exécuter le build
build();
