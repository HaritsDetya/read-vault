'use client';

import React, { useState, useEffect } from 'react';
import { ReadEntry, ReadStatus, ComicFormat } from '@/types/read';
import { searchAnilist } from '@/lib/anilist';
import { Search, Plus, Sparkles, X, Loader2, PenTool, BookOpen } from 'lucide-react';

interface AddReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: ReadEntry) => void;
}

export const AddReadModal: React.FC<AddReadModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'API' | 'MANUAL'>('API');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Form fields
  const [status, setStatus] = useState<ReadStatus>('READING');
  const [comicFormat, setComicFormat] = useState<ComicFormat>('MANHWA');
  const [platform, setPlatform] = useState('Webtoon');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [totalChapters, setTotalChapters] = useState<number>(0);

  // Manual fields
  const [manualTitle, setManualTitle] = useState('');
  const [manualCover, setManualCover] = useState('');
  const [manualGenre, setManualGenre] = useState('');
  const [manualYear, setManualYear] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');

  // Debounced AniList search
  useEffect(() => {
    if (mode !== 'API') return;
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchAnilist(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, mode]);

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setComicFormat(item.comicFormat);
    if (item.totalChapters) setTotalChapters(item.totalChapters);
  };

  const handleSubmitApi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newEntry: ReadEntry = {
      id: `read-${Date.now()}`,
      anilistId: selectedItem.id,
      title: selectedItem.title,
      romajiTitle: selectedItem.romajiTitle,
      nativeTitle: selectedItem.nativeTitle,
      comicFormat: selectedItem.comicFormat,
      coverImage: selectedItem.coverImage,
      bannerImage: selectedItem.bannerImage,
      status,
      publishStatus: selectedItem.status === 'FINISHED' ? 'FINISHED' : selectedItem.status === 'HIATUS' ? 'HIATUS' : 'RELEASING',
      rating: 0,
      currentChapter: status === 'COMPLETED' ? (totalChapters || 0) : currentChapter,
      totalChapters: totalChapters > 0 ? totalChapters : undefined,
      platform,
      genres: selectedItem.genres || [],
      author: selectedItem.author,
      releaseYear: selectedItem.releaseYear,
      synopsis: selectedItem.synopsis,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAdd(newEntry);
    onClose();
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const newEntry: ReadEntry = {
      id: `read-${Date.now()}`,
      title: manualTitle.trim(),
      comicFormat,
      coverImage: manualCover.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
      bannerImage: manualCover.trim() || undefined,
      status,
      rating: 0,
      currentChapter,
      totalChapters: totalChapters > 0 ? totalChapters : undefined,
      platform,
      genres: manualGenre ? manualGenre.split(',').map(g => g.trim()) : ['Fantasy'],
      author: manualAuthor.trim() || undefined,
      releaseYear: manualYear.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAdd(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tambah ke ReadVault</h3>
              <p className="text-xs text-zinc-400">Cari Manga, Manhwa, Manhua via AniList</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-6">
          <button onClick={() => { setMode('API'); setSelectedItem(null); }}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              mode === 'API' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}>
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Cari via AniList (Tanpa API Key!)</span>
          </button>
          <button onClick={() => setMode('MANUAL')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              mode === 'MANUAL' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}>
            <PenTool className="w-4 h-4" />
            <span>Input Manual</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {mode === 'API' ? (
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>AniList bekerja <strong>tanpa API Key</strong>! Pencarian akan langsung aktif untuk jutaan Manga, Manhwa, dan Manhua.</span>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik judul (misal: Solo Leveling, Berserk, Tower of God, Martial Peak)..."
                  className="w-full pl-9 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  autoFocus />
                {isSearching && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />}
              </div>

              {/* Selected Item or Search Results */}
              {selectedItem ? (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/40 flex gap-4 items-center">
                  <img src={selectedItem.coverImage} alt={selectedItem.title}
                    className="w-16 h-24 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {selectedItem.comicFormat} Terpilih ✓
                    </span>
                    <h4 className="font-bold text-white text-base truncate">{selectedItem.title}</h4>
                    <p className="text-xs text-zinc-400">
                      {selectedItem.releaseYear || 'N/A'} • {selectedItem.genres?.slice(0, 2).join(', ')}
                      {selectedItem.totalChapters ? ` • ${selectedItem.totalChapters} Ch` : ''}
                    </p>
                  </div>
                  <button type="button" onClick={() => setSelectedItem(null)}
                    className="text-xs text-zinc-400 hover:text-zinc-200 underline">Ganti</button>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {searchResults.map((item) => (
                    <div key={item.id} onClick={() => handleSelectItem(item)}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-emerald-500/60 hover:bg-zinc-800/50 cursor-pointer transition-all">
                      <img src={item.coverImage} alt={item.title}
                        className="w-10 h-14 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            item.comicFormat === 'MANGA' ? 'bg-rose-500/20 text-rose-300' :
                            item.comicFormat === 'MANHWA' ? 'bg-emerald-500/20 text-emerald-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>{item.comicFormat}</span>
                          <span className="text-xs text-zinc-400">{item.releaseYear}</span>
                          {item.totalChapters && <span className="text-xs text-zinc-500">• {item.totalChapters} Ch</span>}
                        </div>
                        <h4 className="font-semibold text-sm text-zinc-100 truncate">{item.title}</h4>
                        <p className="text-[11px] text-zinc-400 truncate">{item.genres?.slice(0, 3).join(', ')}</p>
                      </div>
                      <span className="text-xs text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10 shrink-0">Pilih</span>
                    </div>
                  ))}
                  {searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
                    <p className="text-xs text-zinc-500 text-center py-4">
                      Judul tidak ditemukan. Coba tab <strong className="text-zinc-300">Input Manual</strong>.
                    </p>
                  )}
                </div>
              )}

              {/* Config Form */}
              {selectedItem && (
                <form onSubmit={handleSubmitApi} className="space-y-4 pt-3 border-t border-zinc-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Status Bacaan</label>
                      <select value={status} onChange={(e) => setStatus(e.target.value as ReadStatus)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none">
                        <option value="READING">Sedang Dibaca</option>
                        <option value="COMPLETED">Tamat</option>
                        <option value="PLAN_TO_READ">Rencana Baca</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="DROPPED">Dropped</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Platform Baca</label>
                      <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)}
                        placeholder="Webtoon, MangaPlus, Tachiyomi..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Chapter Saat Ini</label>
                      <input type="number" min="0" value={currentChapter} onChange={(e) => setCurrentChapter(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white text-center focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Total Chapter</label>
                      <input type="number" min="0" value={totalChapters} onChange={(e) => setTotalChapters(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white text-center focus:outline-none" />
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Tambahkan ke ReadVault</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Manual Form */
            <form onSubmit={handleSubmitManual} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Judul Komik / Novel *</label>
                <input type="text" required value={manualTitle} onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Contoh: Sword Art Online, Rekomendasi Novel Lokal..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Format</label>
                  <select value={comicFormat} onChange={(e) => setComicFormat(e.target.value as ComicFormat)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none">
                    <option value="MANGA">Manga (JP)</option>
                    <option value="MANHWA">Manhwa (KR)</option>
                    <option value="MANHUA">Manhua (CN)</option>
                    <option value="NOVEL">Light Novel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as ReadStatus)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none">
                    <option value="READING">Sedang Dibaca</option>
                    <option value="COMPLETED">Tamat</option>
                    <option value="PLAN_TO_READ">Rencana Baca</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="DROPPED">Dropped</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Platform</label>
                  <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)}
                    placeholder="Webtoon / Buku Cetak"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">URL Cover (Opsional)</label>
                <input type="url" value={manualCover} onChange={(e) => setManualCover(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Author</label>
                  <input type="text" value={manualAuthor} onChange={(e) => setManualAuthor(e.target.value)}
                    placeholder="Nama Pengarang"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Genre</label>
                  <input type="text" value={manualGenre} onChange={(e) => setManualGenre(e.target.value)}
                    placeholder="Action, Fantasy"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tahun Rilis</label>
                  <input type="text" value={manualYear} onChange={(e) => setManualYear(e.target.value)}
                    placeholder="2020"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>

              <button type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2">
                <Plus className="w-4 h-4" />
                <span>Simpan Bacaan Manual</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
