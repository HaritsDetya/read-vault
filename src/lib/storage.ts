'use client';

import { ReadEntry } from '@/types/read';
import { INITIAL_READ_LIST } from './sampleData';

const STORAGE_KEY = 'read_vault_entries_v1';

export function getStoredReadList(): ReadEntry[] {
  if (typeof window === 'undefined') return INITIAL_READ_LIST;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_READ_LIST));
      return INITIAL_READ_LIST;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load read list from localStorage', e);
    return INITIAL_READ_LIST;
  }
}

export function saveStoredReadList(list: ReadEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('read_vault_updated'));
  } catch (e) {
    console.error('Failed to save read list to localStorage', e);
  }
}

export function exportReadBackup(list: ReadEntry[]) {
  const jsonStr = JSON.stringify(list, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `read-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importReadBackup(
  file: File,
  onSuccess: (imported: ReadEntry[]) => void,
  onError: (err: string) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      if (Array.isArray(data)) {
        saveStoredReadList(data);
        onSuccess(data);
      } else {
        onError('Format file JSON tidak valid (harus berupa array bacaan komik/novel).');
      }
    } catch {
      onError('Gagal membaca file JSON. Pastikan file tidak rusak.');
    }
  };
  reader.readAsText(file);
}
