import { API_CONFIG } from "../constants";
import { MangaDetailResponse, MangaListResponse } from "../types/manga";

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
