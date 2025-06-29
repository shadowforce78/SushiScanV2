import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChapterList } from '../components/ChapterList';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MangaDetails } from '../components/MangaDetails';
import { useMangaDetails } from '../hooks/useMangaDetails';
import { ChapterInfo } from '../types/manga';
import { MangaReaderScreen } from './MangaReaderScreen';

interface MangaDetailScreenProps {
  mangaName: string;
  onBack: () => void;
}

export const MangaDetailScreen: React.FC<MangaDetailScreenProps> = ({ 
  mangaName, 
  onBack 
}) => {
  const { manga, loading, error, reload } = useMangaDetails(mangaName);
  const [showChapterList, setShowChapterList] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<ChapterInfo | null>(null);

  const handleChapterSelect = (scansType: string, chapter: number) => {
    if (showChapterList) {
      // Si on est dans la liste des chapitres, ouvrir le lecteur
      setCurrentChapter({
        mangaName,
        scansType,
        chapter,
      });
      setShowChapterList(false);
    } else {
      // Si on est dans les détails, aller à la liste des chapitres
      setShowChapterList(true);
    }
  };

  const handleBackFromChapterList = () => {
    setShowChapterList(false);
  };

  const handleBackFromReader = () => {
    setCurrentChapter(null);
    setShowChapterList(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !manga) {
    return (
      <ErrorState
        message={error || "Impossible de charger les détails du manga"}
        onRetry={reload}
      />
    );
  }

  // Si un chapitre est sélectionné, afficher le lecteur
  if (currentChapter) {
    return (
      <MangaReaderScreen
        chapterInfo={currentChapter}
        mangaTitle={manga.title}
        onBack={handleBackFromReader}
      />
    );
  }

  // Si on doit afficher la liste des chapitres
  if (showChapterList) {
    return (
      <ChapterList
        scanChapters={manga.scan_chapters}
        mangaTitle={manga.title}
        onChapterSelect={handleChapterSelect}
        onBack={handleBackFromChapterList}
      />
    );
  }

  return (
    <View style={styles.container}>
      <MangaDetails 
        manga={manga} 
        onBack={onBack}
        onChapterSelect={handleChapterSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
