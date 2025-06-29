import { API_CONFIG } from "../constants";
import { ChapterPagesResponse, MangaDetailResponse, MangaListResponse, MangaSearchResponse } from "../types/manga";

export const fetchMangaList = async (
  limit: number = API_CONFIG.DEFAULT_LIMIT,
  skip: number = API_CONFIG.DEFAULT_SKIP
): Promise<MangaListResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/scans/mangaList?limit=${limit}&skip=${skip}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching manga list:", error);
    throw error;
  }
};

export const searchMangas = async (
  query: string,
  limit: number = 20
): Promise<MangaListResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/scans/search?q=${encodeURIComponent(
        query
      )}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching mangas:", error);
    throw error;
  }
};

export const fetchMangaDetails = async (
  mangaName: string
): Promise<MangaDetailResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/scans/manga/info?manga_name=${encodeURIComponent(
        mangaName
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching manga details:", error);
    throw error;
  }
};

export const searchMangaByQuery = async (query: string): Promise<MangaSearchResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/scans/manga?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching manga by query:", error);
    throw error;
  }
};

export const fetchChapterPages = async (
  mangaName: string,
  scansType: string,
  chapter: number
): Promise<ChapterPagesResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/scans/chapter/pages?manga_name=${encodeURIComponent(mangaName)}&scans_type=${encodeURIComponent(scansType)}&chapter=${chapter}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chapter pages:", error);
    throw error;
  }
};
