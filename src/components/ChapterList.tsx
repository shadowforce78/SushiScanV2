import React from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, SPACING } from '../constants';
import { ScanChapter } from '../types/manga';

interface ChapterListProps {
  scanChapters: ScanChapter[];
  mangaTitle: string;
  onChapterSelect: (scansType: string, chapter: number) => void;
  onBack: () => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  scanChapters,
  mangaTitle,
  onChapterSelect,
  onBack,
}) => {
  const renderScanType = ({ item }: { item: ScanChapter }) => (
    <View style={styles.scanTypeSection}>
      <Text style={styles.scanTypeName}>{item.name}</Text>
      <Text style={styles.scanTypeInfo}>
        {item.chapters_count} chapitres disponibles
      </Text>
      
      <View style={styles.chaptersGrid}>
        {Array.from({ length: item.chapters_count }, (_, index) => {
          const chapterNumber = index + 1;
          return (
            <TouchableOpacity
              key={chapterNumber}
              style={styles.chapterButton}
              onPress={() => onChapterSelect(item.name, chapterNumber)}
            >
              <Text style={styles.chapterButtonText}>
                {chapterNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {mangaTitle}
          </Text>
          <Text style={styles.subtitle}>Sélectionner un chapitre</Text>
        </View>
      </View>

      <FlatList
        data={scanChapters}
        renderItem={renderScanType}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: SPACING.lg,
  },
  scanTypeSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  scanTypeInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  chapterButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  chapterButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});
