import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../constants';
import { Manga } from '../types/manga';

interface MangaCardProps {
  manga: Manga;
  onPress: (manga: Manga) => void;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(manga)} activeOpacity={0.7}>
      <Image 
        source={{ uri: manga.image_url }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {manga.title}
        </Text>
        {manga.alt_title && (
          <Text style={styles.altTitle} numberOfLines={1}>
            {manga.alt_title}
          </Text>
        )}
        <View style={styles.info}>
          <Text style={styles.chapters}>
            {manga.total_chapters} chapitres
          </Text>
          <Text style={styles.pages}>
            {manga.total_pages} pages
          </Text>
        </View>
        <View style={styles.genres}>
          {manga.genres.slice(0, 3).map((genre, index) => (
            <Text key={index} style={styles.genre}>
              {genre}
            </Text>
          ))}
        </View>
        <Text style={styles.updated}>
          Mis à jour le {formatDate(manga.updated_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: 6,
    marginHorizontal: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  altTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  chapters: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  pages: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  genre: {
    fontSize: 10,
    backgroundColor: '#f0f0f0',
    color: '#555',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  updated: {
    fontSize: 10,
    color: COLORS.textLight,
  },
});
