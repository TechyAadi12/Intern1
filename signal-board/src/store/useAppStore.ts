import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Signal, Status, Priority } from '../types';
import { fetchSignals, updateSignalStatus } from '../lib/api';

export type SortField = 'createdAt' | 'score' | 'priority';
export type SortDirection = 'asc' | 'desc';
export type Density = 'compact' | 'comfortable';

interface FilterState {
  status: Status | 'all';
  priority: Priority | 'all';
}

interface AppState {
  // Data State
  signals: Signal[];
  isLoading: boolean;
  error: string | null;
  
  // UI State
  searchQuery: string;
  filters: FilterState;
  sort: { field: SortField; direction: SortDirection };
  density: Density;
  selectedSignalId: string | null;
  localNotes: Record<string, string>; // Client-side notes

  // Actions
  loadSignals: () => Promise<void>;
  updateSignal: (id: string, updates: Partial<Signal>) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilter: (key: keyof FilterState, value: string) => void;
  setSort: (field: SortField, direction?: SortDirection) => void;
  setDensity: (density: Density) => void;
  setSelectedSignalId: (id: string | null) => void;
  addNote: (signalId: string, note: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      signals: [],
      isLoading: true,
      error: null,

      searchQuery: '',
      filters: { status: 'all', priority: 'all' },
      sort: { field: 'createdAt', direction: 'desc' },
      density: 'comfortable',
      selectedSignalId: null,
      localNotes: {},

      loadSignals: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await fetchSignals();
          set({ signals: data, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      updateSignal: async (id, updates) => {
        // Optimistic update
        const previousSignals = get().signals;
        set({
          signals: previousSignals.map(s => s.id === id ? { ...s, ...updates } : s)
        });

        try {
          // In a real app we'd await the API. If it fails, rollback.
          await updateSignalStatus(id, updates);
        } catch (err) {
          // Rollback on fail
          set({ signals: previousSignals });
          console.error("Failed to update signal", err);
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilter: (key, value) => set((state) => ({ 
        filters: { ...state.filters, [key]: value } 
      })),
      setSort: (field, direction) => set((state) => ({ 
        sort: { 
          field, 
          direction: direction ?? (state.sort.field === field && state.sort.direction === 'desc' ? 'asc' : 'desc') 
        } 
      })),
      setDensity: (density) => set({ density }),
      setSelectedSignalId: (id) => set({ selectedSignalId: id }),
      addNote: (signalId, note) => set((state) => ({
        localNotes: { ...state.localNotes, [signalId]: note }
      }))
    }),
    {
      name: 'signal-board-storage',
      // only persist UI preferences and local notes
      partialize: (state) => ({
        density: state.density,
        sort: state.sort,
        filters: state.filters,
        localNotes: state.localNotes
      }),
    }
  )
);
