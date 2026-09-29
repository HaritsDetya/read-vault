'use client';

import React from 'react';
import { ReadEntry } from '@/types/read';
import { Star, BookOpen, Flame, BookmarkCheck, BookMarked, Plus, FileText } from 'lucide-react';

interface ReadCardProps {
  entry: ReadEntry;
  onClick: () => void;
  onQuickChapterAdd?: (e: React.MouseEvent, id: string) => void;
}

export const ReadCard: React.FC<ReadCardProps> = ({ entry, onClick, onQuickChapterAdd }) => {
  const getFormatBadge = () => {
    switch (entry.comicFormat) {
      case 'MANGA':
        return { label: 'Manga', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: BookOpen };
      case 'MANHWA':
        return { label: 'Manhwa', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: Flame };
      case 'MANHUA':
        return { label: 'Manhua', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: BookmarkCheck };
      case 'NOVEL':
        return { label: 'Novel', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: BookMarked };
    }
  };

  const getStatusBadge = () => {
    switch (entry.status) {
      case 'COMPLETED':
        return { label: 'Tamat', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'READING':
        return { label: 'Dibaca', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'PLAN_TO_READ':
        return { label: 'Rencana', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'ON_HOLD':
        return { label: 'On Hold', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
      case 'DROPPED':
        return { label: 'Dropped', bg: 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30' };
    }
  };

  const formatInfo = getFormatBadge();
  const statusInfo = getStatusBadge();
  const FormatIcon = formatInfo.icon;

  return (
    <div
      onClick={onClick}
      className="group relative bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 flex flex-col"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-950">
        <img
          src={entry.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop'}
          alt={entry.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/50" />

        {/* Format Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border backdrop-blur-md flex items-center gap-1 ${formatInfo.bg}`}>
            <FormatIcon className="w-3 h-3" />
            <span>{formatInfo.label}</span>
          </span>
        </div>

        {/* Rating Badge (Top Right) */}
        {entry.rating > 0 && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{entry.rating}</span>
          </div>
        )}

        {/* Status Badge (Bottom Left) */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border backdrop-blur-md ${statusInfo.bg}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Quick +1 Chapter button when Reading */}
        {entry.status === 'READING' && onQuickChapterAdd && (
          <button
            onClick={(e) => onQuickChapterAdd(e, entry.id)}
            className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-bold backdrop-blur-md shadow-md flex items-center gap-1 transition-transform active:scale-95"
            title="Tambah 1 Chapter"
          >
            <Plus className="w-3 h-3" />
            <span>1 Ch</span>
          </button>
        )}
      </div>

      {/* Card Info Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Platform and Year */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-1.5 line-clamp-1">
            <span className="font-semibold text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
              {entry.platform || 'Online'}
            </span>
            {entry.releaseYear && <span>• {entry.releaseYear}</span>}
            {entry.genres && entry.genres.length > 0 && (
              <span className="truncate">• {entry.genres.slice(0, 2).join(', ')}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {entry.title}
          </h3>

          {/* Review snippet */}
          {entry.review && (
            <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 italic font-light">
              "{entry.review}"
            </p>
          )}
        </div>

        {/* Footer Meta (Chapter count & notes) */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 font-medium text-zinc-200">
            <span>
              Ch. {entry.currentChapter || 0} {entry.totalChapters ? `/ ${entry.totalChapters}` : ''}
            </span>
          </div>

          {entry.notes && entry.notes.trim().length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded" title="Memiliki Catatan">
              <FileText className="w-3 h-3" />
              <span>Notes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
