export type ComicFormat = 'MANGA' | 'MANHWA' | 'MANHUA' | 'NOVEL';

export type ReadStatus = 'READING' | 'COMPLETED' | 'PLAN_TO_READ' | 'ON_HOLD' | 'DROPPED';

export type PublishStatus = 'RELEASING' | 'FINISHED' | 'HIATUS';

export interface ReadEntry {
  id: string;
  anilistId?: number;
  title: string;
  romajiTitle?: string;
  nativeTitle?: string;
  comicFormat: ComicFormat;
  coverImage: string;
  bannerImage?: string;
  status: ReadStatus;
  publishStatus?: PublishStatus;
  rating: number; // 0 (unrated) or 1-10
  currentChapter: number;
  totalChapters?: number;
  currentVolume?: number;
  totalVolumes?: number;
  platform: string; // Webtoon, KakaoPage, MangaPlus, Tachiyomi, Buku Cetak, Web
  genres: string[];
  author?: string;
  artist?: string;
  releaseYear?: string;
  synopsis?: string;
  review?: string;
  notes?: string; // Catatan arc cerita, power system, karakter favorit
  startDate?: string;
  finishDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnilistMediaResult {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  countryOfOrigin: string; // 'JP' -> MANGA, 'KR' -> MANHWA, 'CN' -> MANHUA
  coverImage: {
    extraLarge?: string;
    large?: string;
  };
  bannerImage?: string;
  genres: string[];
  chapters?: number | null;
  volumes?: number | null;
  status?: string; // 'RELEASING', 'FINISHED', 'HIATUS'
  startDate?: { year?: number };
  description?: string;
  staff?: {
    nodes?: { name: { full: string } }[];
  };
}
