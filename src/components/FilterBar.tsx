'use client';

import React from 'react';
import { ComicFormat, ReadStatus } from '@/types/read';
import { Search, Filter, ArrowUpDown, BookOpen, Flame, BookmarkCheck, BookMarked, Layers } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  formatFilter: ComicFormat | 'ALL';
  onFormatChange: (f: ComicFormat | 'ALL') => void;
  statusFilter: ReadStatus | 'ALL';
  onStatusChange: (s: ReadStatus | 'ALL') => void;
  platformFilter: string;
  onPlatformChange: (p: string) => void;
  sortBy: 'UPDATED' | 'RATING' | 'CHAPTERS' | 'TITLE';
  onSortChange: (sort: 'UPDATED' | 'RATING' | 'CHAPTERS' | 'TITLE') => void;
  platforms: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  formatFilter,
  onFormatChange,
  statusFilter,
  onStatusChange,
  platformFilter,
  onPlatformChange,
  sortBy,
  onSortChange,
  platforms
}) => {
  const formatTabs: { key: ComicFormat | 'ALL'; label: string; icon: any }[] = [
    { key: 'ALL', label: 'Semua Koleksi', icon: Layers },
    { key: 'MANGA', label: 'Manga (JP)', icon: BookOpen },
    { key: 'MANHWA', label: 'Manhwa (KR)', icon: Flame },
    { key: 'MANHUA', label: 'Manhua (CN)', icon: BookmarkCheck },
    { key: 'NOVEL', label: 'Light Novel', icon: BookMarked }
  ];

  const statusTabs: { key: ReadStatus | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'Semua Status' },
    { key: 'READING', label: 'Sedang Dibaca' },
    { key: 'COMPLETED', label: 'Tamat' },
    { key: 'PLAN_TO_READ', label: 'Rencana Baca' },
    { key: 'DROPPED', label: 'Dropped' }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Format Primary Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-800 pb-3">
        {formatTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = formatFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onFormatChange(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul komik, manhwa, author, genre..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Platform & Sort Selectors */}
        <div className="flex items-center gap-2">
          {/* Platform Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={platformFilter}
              onChange={(e) => onPlatformChange(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 pr-8 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">Semua Platform</option>
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="w-full sm:w-auto appearance-none bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 pr-8 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="UPDATED">Terakhir Diupdate</option>
              <option value="RATING">Rating Tertinggi</option>
              <option value="CHAPTERS">Chapter Terbanyak</option>
              <option value="TITLE">Judul A-Z</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Status Filter Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onStatusChange(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/50 font-semibold'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
