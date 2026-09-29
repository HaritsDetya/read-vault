'use client';

import React, { useState } from 'react';
import { ReadEntry, ReadStatus, ComicFormat, PublishStatus } from '@/types/read';
import {
  X, Star, Trash2, Save, FileText, Plus, Minus
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

  const handleSave = () => {
    let finalStatus = status;
    if (totalChapters > 0 && currentChapter >= totalChapters && status === 'READING') {
      finalStatus = 'COMPLETED';
    }

    const updated: ReadEntry = {
      ...entry,
      status: finalStatus,
      comicFormat,
      platform,
      rating,
      currentChapter: Number(currentChapter),
      totalChapters: totalChapters > 0 ? Number(totalChapters) : undefined,
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

          {/* Chapter Progress Tracker */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Progress Chapter
              </span>
              {totalChapters > 0 && (
                <span className="text-xs text-zinc-400">{progressPercent}% selesai</span>
              )}
            </div>

            {/* Progress Bar */}
            {totalChapters > 0 && (
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Chapter Counter */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Chapter Saat Ini (Terakhir Baca)</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <input type="number" min="0" value={currentChapter}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setCurrentChapter(val);
                      if (totalChapters > 0 && val >= totalChapters) setStatus('COMPLETED');
                    }}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-center text-lg font-bold text-white focus:border-emerald-500 focus:outline-none" />
                  <button type="button" onClick={() => {
                    const next = currentChapter + 1;
                    setCurrentChapter(next);
                    if (totalChapters > 0 && next >= totalChapters) setStatus('COMPLETED');
                  }}
                    className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total Chapters & Volume */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Total Chapter</label>
                  <input type="number" min="0" value={totalChapters}
                    onChange={(e) => setTotalChapters(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="Misal: 179"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-center text-sm text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Volume Saat Ini</label>
                  <input type="number" min="0" value={currentVolume}
                    onChange={(e) => setCurrentVolume(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 text-center text-sm text-white focus:border-emerald-500 focus:outline-none" />
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
