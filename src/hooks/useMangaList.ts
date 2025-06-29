import { useEffect, useState } from 'react';
import { fetchMangaList } from '../services/mangaService';
import { Manga } from '../types/manga';

export const useMangaList = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadMangas = async (reset: boolean = false) => {
    try {
      if (reset) {
        setRefreshing(true);
        setMangas([]);
      } else {
        setLoading(true);
      }
      
      setError(null);
      const response = await fetchMangaList(50, 0);
      setMangas(response.mangas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = () => {
    loadMangas(true);
  };

  useEffect(() => {
    loadMangas();
  }, []);

  return {
    mangas,
    loading,
    error,
    refreshing,
    refresh,
    reload: loadMangas,
  };
};
