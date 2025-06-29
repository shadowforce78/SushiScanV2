import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ErrorState } from '../components/ErrorState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MangaDetails } from '../components/MangaDetails';
import { useMangaDetails } from '../hooks/useMangaDetails';

interface MangaDetailScreenProps {
  mangaName: string;
  onBack: () => void;
}

export const MangaDetailScreen: React.FC<MangaDetailScreenProps> = ({ 
  mangaName, 
  onBack 
}) => {
  const { manga, loading, error, reload } = useMangaDetails(mangaName);

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

  return (
    <View style={styles.container}>
      <MangaDetails manga={manga} onBack={onBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
