#!/bin/bash

# Script de build pour systèmes Unix (Linux/macOS)
# Alternative au script Node.js pour plus de compatibilité

echo "🍣 SushiScan Build Script (Unix)"
echo "=============================="

# Configuration
SRC_DIR="$(pwd)/src/public"
DEST_DIR="$(pwd)/www"

echo "📁 Source: $SRC_DIR"
echo "📁 Destination: $DEST_DIR"

# Vérifier que le dossier source existe
if [ ! -d "$SRC_DIR" ]; then
    echo "❌ Source directory not found: $SRC_DIR"
    exit 1
fi

echo "🚀 Starting build process..."

# Nettoyer le dossier de destination
if [ -d "$DEST_DIR" ]; then
    echo "🧹 Cleaning destination directory..."
    rm -rf "$DEST_DIR"
fi

# Créer le dossier de destination
mkdir -p "$DEST_DIR"

# Copier les fichiers avec rsync (plus robuste que cp)
if command -v rsync >/dev/null 2>&1; then
    echo "📋 Copying files with rsync..."
    rsync -av --progress "$SRC_DIR/" "$DEST_DIR/"
else
    echo "📋 Copying files with cp..."
    cp -r "$SRC_DIR/"* "$DEST_DIR/"
fi

# Vérifier le résultat
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Files copied to: $DEST_DIR"
    
    # Compter les fichiers copiés
    FILE_COUNT=$(find "$DEST_DIR" -type f | wc -l)
    echo "📈 Total files copied: $FILE_COUNT"
    
    # Afficher la structure
    echo "📁 Directory structure:"
    find "$DEST_DIR" -type f | head -10
else
    echo "❌ Build failed!"
    exit 1
fi
