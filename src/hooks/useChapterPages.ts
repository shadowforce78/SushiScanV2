import { useEffect, useState } from 'react';
import { fetchChapterPages } from '../services/mangaService';

export const useChapterPages = (mangaName: string, scansType: string, chapter: number) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchChapterPages(mangaName, scansType, chapter);
      setPages(response.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mangaName && scansType && chapter) {
      loadPages();
    }
  }, [mangaName, scansType, chapter]);

  return {
    pages,
    loading,
    error,
    reload: loadPages,
  };
};
