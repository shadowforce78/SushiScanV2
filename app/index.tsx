import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import { MangaCard } from '../src/components/MangaCard';
import { useMangaList } from '../src/hooks/useMangaList';
import { MangaDetailScreen } from '../src/screens/MangaDetailScreen';
import { Manga } from '../src/types/manga';

export default function Index() {
  const { mangas, loading, error, refreshing, refresh } = useMangaList();
  const [selectedManga, setSelectedManga] = useState<string | null>(null);

  const handleMangaPress = (manga: Manga) => {
    setSelectedManga(manga.title);
  };

  const handleBackPress = () => {
    setSelectedManga(null);
  };

  // Si un manga est sélectionné, afficher l'écran de détails
  if (selectedManga) {
    return (
      <MangaDetailScreen 
        mangaName={selectedManga} 
        onBack={handleBackPress} 
      />
    );
  }

  const renderMangaItem = ({ item }: { item: Manga }) => (
    <MangaCard manga={item} onPress={handleMangaPress} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>SushiScan</Text>
      <Text style={styles.headerSubtitle}>
        {mangas.length} mangas disponibles
      </Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error ? 'Erreur lors du chargement' : 'Aucun manga trouvé'}
      </Text>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
        data={mangas}
        renderItem={renderMangaItem}
        keyExtractor={(item) => item.title}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={mangas.length === 0 ? styles.emptyList : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
  },
});
