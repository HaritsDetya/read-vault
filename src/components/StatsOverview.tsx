'use client';

import React from 'react';
import { ReadEntry } from '@/types/read';
import { BookOpen, BookmarkCheck, CheckCircle2, Star, Layers, Flame } from 'lucide-react';

interface StatsOverviewProps {
  entries: ReadEntry[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ entries }) => {
  const total = entries.length;
  const mangaCount = entries.filter(e => e.comicFormat === 'MANGA').length;
  const manhwaCount = entries.filter(e => e.comicFormat === 'MANHWA').length;
  const manhuaCount = entries.filter(e => e.comicFormat === 'MANHUA' || e.comicFormat === 'NOVEL').length;

  const totalChaptersRead = entries.reduce((acc, e) => acc + (e.currentChapter || 0), 0);

  const ratedEntries = entries.filter(e => (e.rating || 0) > 0);
  const avgRating = ratedEntries.length > 0
    ? (ratedEntries.reduce((acc, e) => acc + e.rating, 0) / ratedEntries.length).toFixed(1)
    : '0';

  const stats = [
    {
      label: 'Total Judul',
      value: total,
      icon: Layers,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'Koleksi Manga',
      value: mangaCount,
      icon: BookOpen,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      label: 'Koleksi Manhwa',
      value: manhwaCount,
      icon: Flame,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Manhua & Novel',
      value: manhuaCount,
      icon: BookmarkCheck,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Chapter Dibaca',
      value: `${totalChaptersRead.toLocaleString()} Ch`,
      icon: CheckCircle2,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: 'Rata-rata Rating',
      value: `★ ${avgRating}`,
      icon: Star,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border ${item.bg} backdrop-blur-sm transition-all hover:translate-y-[-2px]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-zinc-400 line-clamp-1">{item.label}</span>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <p className="text-xl font-bold tracking-tight text-white">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};
