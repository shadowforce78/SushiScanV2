import { useState } from 'react';
import { searchMangaByQuery } from '../services/mangaService';
import { Manga } from '../types/manga';

export const useMangaSearch = () => {
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMangas = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const response = await searchMangaByQuery(query);
      setSearchResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
  };

  return {
    searchResults,
    loading,
    error,
    hasSearched,
    searchMangas,
    clearSearch,
  };
};
