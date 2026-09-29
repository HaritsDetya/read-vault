'use client';

import React, { useRef } from 'react';
import { ReadEntry } from '@/types/read';
import { exportReadBackup, importReadBackup, saveStoredReadList } from '@/lib/storage';
import { INITIAL_READ_LIST } from '@/lib/sampleData';
import { X, Download, Upload, RefreshCw, ExternalLink, Cloud, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: ReadEntry[];
  onRefreshData: (newEntries: ReadEntry[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, entries, onRefreshData
}) => {
  if (!isOpen) return null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => exportReadBackup(entries);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importReadBackup(file,
        (imported) => { onRefreshData(imported); alert(`Berhasil mengimpor ${imported.length} data bacaan!`); onClose(); },
        (err) => alert(`Error: ${err}`)
      );
    }
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan ke data contoh bacaan bawaan?')) {
      saveStoredReadList(INITIAL_READ_LIST);
      onRefreshData(INITIAL_READ_LIST);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-6">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Pengaturan ReadVault</h3>
          <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-sm text-zinc-300 overflow-y-auto max-h-[80vh]">
          {/* AniList Info */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4>AniList API (100% Gratis, Tanpa Key!)</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              ReadVault menggunakan <strong className="text-zinc-200">AniList GraphQL API</strong> yang sepenuhnya gratis dan tanpa batas penggunaan untuk personal. Tidak perlu mendaftar API key — pencarian Manga, Manhwa, dan Manhua bisa langsung digunakan kapan saja!
            </p>
            <a href="https://anilist.co" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline pt-1">
              <span>Kunjungi anilist.co</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Backup & Restore */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Download className="w-4 h-4 text-emerald-400" />
              <h4>Backup & Restore Data Bacaan</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ekspor seluruh koleksi bacaan, progress chapter, rating, dan catatan arc cerita Anda ke file JSON.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button type="button" onClick={handleExport}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Backup (.JSON)</span>
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Import / Restore (.JSON)</span>
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

          {/* Reset */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Kembalikan ke data contoh bacaan awal:</span>
              <button type="button" onClick={handleReset}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset ke Sample Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
