'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ReadEntry, ReadStatus, ComicFormat } from '@/types/read';
import { getStoredReadList, saveStoredReadList } from '@/lib/storage';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { FilterBar } from '@/components/FilterBar';
import { ReadCard } from '@/components/ReadCard';
import { ReadDetailModal } from '@/components/ReadDetailModal';
import { AddReadModal } from '@/components/AddReadModal';
import { SettingsModal } from '@/components/SettingsModal';
import { BookOpen, Ghost } from 'lucide-react';

export default function Home() {
  const [entries, setEntries] = useState<ReadEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<ComicFormat | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ReadStatus | 'ALL'>('ALL');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'UPDATED' | 'RATING' | 'CHAPTERS' | 'TITLE'>('UPDATED');

  // Modals
  const [activeEntry, setActiveEntry] = useState<ReadEntry | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    const data = getStoredReadList();
    setEntries(data);
    setIsLoaded(true);

    const handleUpdate = () => setEntries(getStoredReadList());
    window.addEventListener('read_vault_updated', handleUpdate);
    return () => window.removeEventListener('read_vault_updated', handleUpdate);
  }, []);

  // Distinct platforms for filter
  const platforms = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => { if (e.platform) set.add(e.platform); });
    return Array.from(set);
  }, [entries]);

  // Filtered and sorted entries
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    if (formatFilter !== 'ALL') result = result.filter((e) => e.comicFormat === formatFilter);
    if (statusFilter !== 'ALL') result = result.filter((e) => e.status === statusFilter);
    if (platformFilter !== 'ALL') result = result.filter((e) => e.platform === platformFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.nativeTitle?.toLowerCase().includes(q) ||
          e.romajiTitle?.toLowerCase().includes(q) ||
          e.author?.toLowerCase().includes(q) ||
          e.genres?.some((g) => g.toLowerCase().includes(q)) ||
          e.review?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'RATING') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'CHAPTERS') return (b.currentChapter || 0) - (a.currentChapter || 0);
      if (sortBy === 'TITLE') return a.title.localeCompare(b.title);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [entries, formatFilter, statusFilter, platformFilter, searchQuery, sortBy]);

  const handleAddEntry = (newEntry: ReadEntry) => {
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveStoredReadList(updated);
  };

  const handleSaveEntry = (updatedEntry: ReadEntry) => {
    const updated = entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e));
    setEntries(updated);
    saveStoredReadList(updated);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveStoredReadList(updated);
  };

  // Quick +1 chapter from card
  const handleQuickChapterAdd = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = entries.map((item) => {
      if (item.id === id) {
        const nextCh = (item.currentChapter || 0) + 1;
        const isComplete = item.totalChapters ? nextCh >= item.totalChapters : false;
        return {
          ...item,
          currentChapter: nextCh,
          status: isComplete ? 'COMPLETED' as ReadStatus : item.status,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    setEntries(updated);
    saveStoredReadList(updated);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 animate-pulse text-emerald-500" />
          <span>Memuat ReadVault Anda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        totalEntries={entries.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <StatsOverview entries={entries} />

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          formatFilter={formatFilter}
          onFormatChange={setFormatFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          platformFilter={platformFilter}
          onPlatformChange={setPlatformFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          platforms={platforms}
        />

        {/* Read Grid */}
        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {filteredEntries.map((entry) => (
              <ReadCard
                key={entry.id}
                entry={entry}
                onClick={() => setActiveEntry(entry)}
                onQuickChapterAdd={handleQuickChapterAdd}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
              <Ghost className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-200">Tidak ada komik ditemukan</h3>
            <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-5">
              Coba ganti filter format/status atau cari dengan kata kunci lain.
            </p>
            <button onClick={() => { setSearchQuery(''); setFormatFilter('ALL'); setStatusFilter('ALL'); setPlatformFilter('ALL'); }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline">
              Reset Semua Filter
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <p>ReadVault &bull; Personal Manga, Manhwa & Manhua Library</p>
      </footer>

      <ReadDetailModal
        entry={activeEntry}
        isOpen={Boolean(activeEntry)}
        onClose={() => setActiveEntry(null)}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
      />

      <AddReadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEntry}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        entries={entries}
        onRefreshData={(newEntries) => setEntries(newEntries)}
      />
    </div>
  );
}
