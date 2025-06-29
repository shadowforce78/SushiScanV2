export interface ScanChapter {
  name: string;
  url: string;
  id_scan: string;
  episodes_url: string;
  total_chapters: number;
  chapters_count: number;
}

export interface ScanType {
  name: string;
  url: string;
}

export interface Manga {
  title: string;
  alt_title: string;
  genres: string[];
  image_url: string;
  language: string;
  scan_chapters: ScanChapter[];
  scan_types: ScanType[];
  total_chapters: number;
  total_pages: number;
  type: string;
  updated_at: string;
  url: string;
}

export interface MangaListResponse {
  mangas: Manga[];
}

export interface MangaDetailResponse {
  manga: Manga;
}

export interface MangaSearchResponse {
  results: Manga[];
}
