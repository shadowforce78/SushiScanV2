import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MangaReader } from '../components/MangaReader';
import { useChapterPages } from '../hooks/useChapterPages';
import { ChapterInfo } from '../types/manga';

interface MangaReaderScreenProps {
  chapterInfo: ChapterInfo;
  mangaTitle: string;
  onBack: () => void;
}

export const MangaReaderScreen: React.FC<MangaReaderScreenProps> = ({
  chapterInfo,
  mangaTitle,
  onBack,
}) => {
  const { pages, loading, error, reload } = useChapterPages(
    chapterInfo.mangaName,
    chapterInfo.scansType,
    chapterInfo.chapter
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || pages.length === 0) {
    return (
      <ErrorState
        message={error || "Impossible de charger les pages du chapitre"}
        onRetry={reload}
      />
    );
  }

  return (
    <View style={styles.container}>
      <MangaReader
        pages={pages}
        mangaTitle={mangaTitle}
        chapterNumber={chapterInfo.chapter}
        scansType={chapterInfo.scansType}
        onBack={onBack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
