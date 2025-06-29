import React from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS, SPACING } from '../constants';
import { Manga } from '../types/manga';

interface MangaDetailsProps {
  manga: Manga;
  onBack: () => void;
  onChapterSelect?: (scansType: string, chapter: number) => void;
}

export const MangaDetails: React.FC<MangaDetailsProps> = ({ manga, onBack, onChapterSelect }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleChapterTypePress = (chapterType: any) => {
    if (onChapterSelect) {
      // Utiliser la callback pour ouvrir la liste des chapitres
      onChapterSelect(chapterType.name, 1); // Par défaut, commencer au chapitre 1
    } else {
      Alert.alert(
        chapterType.name,
        `${chapterType.chapters_count} chapitres disponibles`,
        [
          {
            text: 'Lire',
            onPress: () => {
              // TODO: Naviguer vers le lecteur
              Alert.alert('À venir', 'Fonctionnalité de lecture à implémenter');
            },
          },
          {
            text: 'Annuler',
            style: 'cancel',
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header avec image et infos principales */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          
          <View style={styles.mainInfo}>
            <Image 
              source={{ uri: manga.image_url }} 
              style={styles.coverImage}
              resizeMode="cover"
            />
            
            <View style={styles.titleSection}>
              <Text style={styles.title}>{manga.title}</Text>
              {manga.alt_title && (
                <Text style={styles.altTitle}>{manga.alt_title}</Text>
              )}
              
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{manga.total_chapters}</Text>
                  <Text style={styles.statLabel}>Chapitres</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{manga.total_pages}</Text>
                  <Text style={styles.statLabel}>Pages</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Genres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.genresContainer}>
            {manga.genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Types de scan disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Types de lecture disponibles</Text>
          {manga.scan_chapters.map((chapterType, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chapterTypeCard}
              onPress={() => handleChapterTypePress(chapterType)}
            >
              <View style={styles.chapterTypeInfo}>
                <Text style={styles.chapterTypeName}>{chapterType.name}</Text>
                <Text style={styles.chapterTypeCount}>
                  {chapterType.chapters_count} chapitres
                </Text>
              </View>
              <Text style={styles.chapterTypeArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Informations supplémentaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoCard}>
            {manga.language && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Langue :</Text>
                <Text style={styles.infoValue}>{manga.language}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type :</Text>
              <Text style={styles.infoValue}>{manga.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dernière mise à jour :</Text>
              <Text style={styles.infoValue}>{formatDate(manga.updated_at)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  mainInfo: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  titleSection: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  altTitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SPACING.lg,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  genreText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  chapterTypeCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chapterTypeInfo: {
    flex: 1,
  },
  chapterTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  chapterTypeCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chapterTypeArrow: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
});
