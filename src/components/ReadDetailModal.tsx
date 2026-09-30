'use client';

import React, { useState, useEffect } from 'react';
import { ReadEntry, ReadStatus, ComicFormat, PublishStatus } from '@/types/read';
import { fetchAnilistDetails } from '@/lib/anilist';
import {
  X, Star, Trash2, Save, FileText, Plus, Minus,
  RefreshCw, CheckCircle2, BookOpen, Flame
} from 'lucide-react';

interface ReadDetailModalProps {
  entry: ReadEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ReadEntry) => void;
  onDelete: (id: string) => void;
}

export const ReadDetailModal: React.FC<ReadDetailModalProps> = ({
  entry, isOpen, onClose, onSave, onDelete
}) => {
  if (!isOpen || !entry) return null;

  const [status, setStatus] = useState<ReadStatus>(entry.status);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>(
    entry.publishStatus || (entry.totalChapters ? 'FINISHED' : 'RELEASING')
  );
  const [comicFormat, setComicFormat] = useState<ComicFormat>(entry.comicFormat);
  const [platform, setPlatform] = useState(entry.platform || 'Online');
  const [rating, setRating] = useState<number>(entry.rating || 0);
  const [currentChapter, setCurrentChapter] = useState<number>(entry.currentChapter || 0);
  const [totalChapters, setTotalChapters] = useState<number>(entry.totalChapters || 0);
  const [currentVolume, setCurrentVolume] = useState<number>(entry.currentVolume || 0);
  const [startDate, setStartDate] = useState(entry.startDate || '');
  const [finishDate, setFinishDate] = useState(entry.finishDate || '');
  const [review, setReview] = useState(entry.review || '');
  const [notes, setNotes] = useState(entry.notes || '');

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Auto-sync status from AniList if entry has anilistId and was releasing or missing totalChapters
  useEffect(() => {
    if (entry && entry.anilistId && (!entry.totalChapters || entry.publishStatus === 'RELEASING')) {
      setIsSyncing(true);
      fetchAnilistDetails(entry.anilistId).then(data => {
        setIsSyncing(false);
        if (data) {
          if (data.status === 'FINISHED' && data.chapters) {
            setTotalChapters(data.chapters);
            setPublishStatus('FINISHED');
            setSyncMessage(`Tamat di AniList! Total chapter otomatis diset ke ${data.chapters}.`);
          } else if (data.status === 'RELEASING') {
            setPublishStatus('RELEASING');
          }
        }
      }).catch(() => setIsSyncing(false));
    }
  }, [entry?.id]);

  const handleSyncAnilist = async () => {
    if (!entry?.anilistId) return;
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const data = await fetchAnilistDetails(entry.anilistId);
      if (data) {
        if (data.status === 'FINISHED' && data.chapters) {
          setTotalChapters(data.chapters);
          setPublishStatus('FINISHED');
          setSyncMessage(`Sukses! Judul ini telah Tamat dengan ${data.chapters} Chapter.`);
        } else if (data.status === 'RELEASING') {
          setPublishStatus('RELEASING');
          setSyncMessage('Status AniList: Masih Releasing (Ongoing). Chapter tetap "-".');
        } else {
          setSyncMessage(`Status AniList: ${data.status || 'Updated'}`);
        }
      } else {
        setSyncMessage('Tidak dapat mengambil data dari AniList.');
      }
    } catch {
      setSyncMessage('Gagal menghubungi server AniList.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = () => {
    let finalStatus = status;
    if (publishStatus === 'FINISHED' && totalChapters > 0 && currentChapter >= totalChapters && status === 'READING') {
      finalStatus = 'COMPLETED';
    }

    const updated: ReadEntry = {
      ...entry,
      status: finalStatus,
      publishStatus,
      comicFormat,
      platform,
      rating,
      currentChapter: Number(currentChapter),
      totalChapters: publishStatus === 'FINISHED' && totalChapters > 0 ? Number(totalChapters) : undefined,
      currentVolume: currentVolume > 0 ? Number(currentVolume) : undefined,
      startDate: startDate || undefined,
      finishDate: finishDate || undefined,
      review: review.trim() || undefined,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString()
    };
    onSave(updated);
    onClose();
  };

  const progressPercent = totalChapters > 0
    ? Math.min(100, Math.round((currentChapter / totalChapters) * 100))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]">

        {/* Header Backdrop Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-zinc-950 shrink-0">
          <img
            src={entry.bannerImage || entry.coverImage}
            alt={entry.title}
            className="w-full h-full object-cover object-center filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-950/70 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/50 transition-colors">
            <X className="w-5 h-5" />
          </button>

          {/* Title and Meta */}
          <div className="absolute bottom-4 left-5 right-14 flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {comicFormat === 'MANGA' ? '🇯🇵 Manga' : comicFormat === 'MANHWA' ? '🇰🇷 Manhwa' : comicFormat === 'MANHUA' ? '🇨🇳 Manhua' : '📖 Novel'}
              </span>
              {entry.author && <span className="text-xs text-zinc-300 font-medium">by {entry.author}</span>}
              {entry.releaseYear && <span className="text-xs text-zinc-400">• {entry.releaseYear}</span>}
              {entry.publishStatus && (
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  entry.publishStatus === 'RELEASING' ? 'bg-emerald-500/20 text-emerald-400' :
                  entry.publishStatus === 'FINISHED' ? 'bg-zinc-700 text-zinc-300' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {entry.publishStatus === 'RELEASING' ? 'Ongoing' : entry.publishStatus === 'FINISHED' ? 'Selesai' : 'Hiatus'}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight line-clamp-1">{entry.title}</h2>
            {entry.nativeTitle && entry.nativeTitle !== entry.title && (
              <p className="text-xs text-zinc-400 italic line-clamp-1">{entry.nativeTitle}</p>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-zinc-200">

          {/* Status, Format, Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Status Bacaan</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as ReadStatus)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 font-medium focus:border-emerald-500 focus:outline-none text-xs sm:text-sm">
                <option value="READING">Sedang Dibaca</option>
                <option value="COMPLETED">Tamat (Completed)</option>
                <option value="PLAN_TO_READ">Rencana Baca</option>
                <option value="ON_HOLD">Ditunda (On Hold)</option>
                <option value="DROPPED">Ditinggalkan (Dropped)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Format Komik</label>
              <select value={comicFormat} onChange={(e) => setComicFormat(e.target.value as ComicFormat)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 font-medium focus:border-emerald-500 focus:outline-none text-xs sm:text-sm">
                <option value="MANGA">Manga (Jepang)</option>
                <option value="MANHWA">Manhwa (Korea)</option>
                <option value="MANHUA">Manhua (China)</option>
                <option value="NOVEL">Light Novel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Platform Baca</label>
              <input type="text" value={platform} onChange={(e) => setPlatform(e.target.value)}
                placeholder="Webtoon, MangaPlus, Buku..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm" />
            </div>
          </div>

          {/* Chapter Progress Tracker - Redesigned & Tidied */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4 shadow-inner">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Progress Chapter
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  publishStatus === 'FINISHED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                }`}>
                  {publishStatus === 'FINISHED' ? `Tamat (${totalChapters || '-'} Ch)` : '● Ongoing / Masih Rilis (-)'}
                </span>
              </div>

              {/* AniList sync button if anilistId exists */}
              {entry.anilistId && (
                <button
                  type="button"
                  onClick={handleSyncAnilist}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 px-2.5 py-1 rounded-lg transition-all"
                  title="Cek apakah sudah tamat di AniList"
                >
                  <RefreshCw className={`w-3 h-3 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Memeriksa...' : 'Cek Status AniList'}</span>
                </button>
              )}
            </div>

            {/* Sync feedback notification */}
            {syncMessage && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{syncMessage}</span>
              </div>
            )}

            {/* Progress Bar */}
            {publishStatus === 'FINISHED' && totalChapters > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Progres Membaca</span>
                  <span className="font-semibold text-emerald-400">{progressPercent}% selesai ({currentChapter}/{totalChapters} Ch)</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Serial Masih Berlanjut (Ongoing)</span>
                  </span>
                  <span className="font-mono text-cyan-400 text-xs font-semibold">Ch. {currentChapter} / -</span>
                </div>
                <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500/40 via-cyan-400 to-emerald-400/40 rounded-full w-full" />
                </div>
              </div>
            )}

            {/* Main Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Current Chapter Section */}
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col justify-between">
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Chapter Terakhir Dibaca
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                    className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={currentChapter}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setCurrentChapter(val);
                      if (publishStatus === 'FINISHED' && totalChapters > 0 && val >= totalChapters) {
                        setStatus('COMPLETED');
                      }
                    }}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-center text-xl font-black text-emerald-400 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = currentChapter + 1;
                      setCurrentChapter(next);
                      if (publishStatus === 'FINISHED' && totalChapters > 0 && next >= totalChapters) {
                        setStatus('COMPLETED');
                      }
                    }}
                    className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {/* Quick jump step buttons */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-zinc-500">Lompat:</span>
                  {[5, 10, 20].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        const next = currentChapter + step;
                        setCurrentChapter(next);
                        if (publishStatus === 'FINISHED' && totalChapters > 0 && next >= totalChapters) {
                          setStatus('COMPLETED');
                        }
                      }}
                      className="px-2 py-0.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-300 transition-colors"
                    >
                      +{step}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Rilis & Total Chapter & Volume */}
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-3.5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Status Rilis Seri
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPublishStatus('RELEASING')}
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        publishStatus === 'RELEASING'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      ● Masih Rilis (-)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPublishStatus('FINISHED')}
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        publishStatus === 'FINISHED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      ✓ Sudah Tamat
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Total Chapter</label>
                    {publishStatus === 'RELEASING' ? (
                      <div className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl py-2 px-3 text-center text-xs font-mono text-cyan-400 font-bold">
                        - (Ongoing)
                      </div>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        value={totalChapters || ''}
                        onChange={(e) => setTotalChapters(Math.max(0, parseInt(e.target.value) || 0))}
                        placeholder="Misal: 179"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-center text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Volume Saat Ini</label>
                    <input
                      type="number"
                      min="0"
                      value={currentVolume || ''}
                      onChange={(e) => setCurrentVolume(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="Vol 1"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-center text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Rating Pribadi: {rating > 0 ? `${rating} / 10` : 'Belum dinilai'}
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button key={num} type="button" onClick={() => setRating(num === rating ? 0 : num)}
                  className={`w-7 h-8 rounded-lg text-xs font-bold transition-all ${
                    rating >= num
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:bg-zinc-800'
                  }`}>
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Tanggal Mulai Baca</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200 focus:border-emerald-500 focus:outline-none text-xs" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Tanggal Selesai Tamat</label>
              <input type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200 focus:border-emerald-500 focus:outline-none text-xs" />
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Ulasan & Kesan Pribadi
            </label>
            <textarea rows={3} value={review} onChange={(e) => setReview(e.target.value)}
              placeholder="Tulis ulasan alur cerita, art style, karakter favorit, atau arc terbaik..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm leading-relaxed" />
          </div>

          {/* Notes / Wiki */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Catatan Arc Cerita, Power System & Karakter (Markdown)</span>
            </label>
            <textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder={`### Power System / Magic System\n- Tulis catatan sistem kekuatan karakter\n\n### Arc Terbaik\n- Catatan arc cerita paling berkesan\n\n### Karakter Favorit\n- Alasan karakter favorit`}
              className="w-full font-mono bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-200 focus:border-emerald-500 focus:outline-none text-xs leading-relaxed" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <button type="button" onClick={() => {
            if (window.confirm(`Hapus "${entry.title}" dari ReadVault Anda?`)) {
              onDelete(entry.id); onClose();
            }
          }}
            className="px-3.5 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1.5">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Hapus</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors">
              Batal
            </button>
            <button type="button" onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all">
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
