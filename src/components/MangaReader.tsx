import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, SPACING } from '../constants';

interface MangaReaderProps {
  pages: string[];
  mangaTitle: string;
  chapterNumber: number;
  scansType: string;
  onBack: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const MangaReader: React.FC<MangaReaderProps> = ({
  pages,
  mangaTitle,
  chapterNumber,
  scansType,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePagePress = () => {
    setShowControls(!showControls);
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
      // Hauteur fixe : hauteur de l'image + marge
      const pageHeight = screenHeight * 0.8 + 2;
      scrollViewRef.current?.scrollTo({ y: pageIndex * pageHeight, animated: true });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      goToPage(currentPage + 1);
    } else {
      Alert.alert(
        'Fin du chapitre',
        'Vous avez atteint la fin de ce chapitre.',
        [{ text: 'OK' }]
      );
    }
  };

  const onScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // Hauteur fixe pour calculer la page actuelle
    const pageHeight = screenHeight * 0.8 + 2;
    const currentPageIndex = Math.round(scrollY / pageHeight);
    const newPage = Math.max(0, Math.min(currentPageIndex, pages.length - 1));
    setCurrentPage(newPage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={!showControls} />
      
      {/* Header avec contrôles */}
      {showControls && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.mangaTitle} numberOfLines={1}>
              {mangaTitle}
            </Text>
            <Text style={styles.chapterInfo}>
              {scansType} - Chapitre {chapterNumber}
            </Text>
          </View>
        </View>
      )}

      {/* Lecteur de pages avec scroll vertical continu */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={true}
      >
        {pages.map((pageUrl, index) => (
          <TouchableOpacity
            key={`page-${index}`}
            style={styles.pageContainer}
            onPress={handlePagePress}
            activeOpacity={1}
          >
            <Image
              source={{ uri: pageUrl }}
              style={styles.pageImage}
              resizeMode="contain"
              onError={() => {
                console.warn(`Erreur de chargement de la page ${index + 1}`);
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer avec navigation et compteur */}
      {showControls && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
            onPress={goToPreviousPage}
            disabled={currentPage === 0}
          >
            <Text style={[styles.navButtonText, currentPage === 0 && styles.navButtonTextDisabled]}>
              ← Précédent
            </Text>
          </TouchableOpacity>

          <View style={styles.pageCounter}>
            <Text style={styles.pageCounterText}>
              {currentPage + 1} / {pages.length}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.navButton, currentPage === pages.length - 1 && styles.navButtonDisabled]}
            onPress={goToNextPage}
            disabled={currentPage === pages.length - 1}
          >
            <Text style={[styles.navButtonText, currentPage === pages.length - 1 && styles.navButtonTextDisabled]}>
              Suivant →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  backButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
  },
  mangaTitle: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chapterInfo: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 2,
  },
  pageContainer: {
    width: screenWidth,
    marginBottom: 2, // Marge pour séparer clairement les pages
    backgroundColor: '#000', // Fond noir pour séparer visuellement
  },
  pageImage: {
    width: screenWidth,
    height: screenHeight * 0.8, // Hauteur fixe pour éviter le chevauchement
    backgroundColor: '#111', // Fond légèrement différent pour voir les limites
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 100,
  },
  navButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  navButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  navButtonTextDisabled: {
    color: COLORS.background,
  },
  pageCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  pageCounterText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});
