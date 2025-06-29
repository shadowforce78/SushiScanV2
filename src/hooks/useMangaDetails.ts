import { useEffect, useState } from 'react';
import { fetchMangaDetails } from '../services/mangaService';
import { Manga } from '../types/manga';

export const useMangaDetails = (mangaName: string) => {
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMangaDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchMangaDetails(mangaName);
      setManga(response.manga);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mangaName) {
      loadMangaDetails();
    }
  }, [mangaName]);

  return {
    manga,
    loading,
    error,
    reload: loadMangaDetails,
  };
};
