import { create } from 'zustand';

interface AppState {
  selectedOrgan: string | null;
  setSelectedOrgan: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  cameraTarget: [number, number, number] | null;
  setCameraTarget: (target: [number, number, number] | null) => void;
  isSurgicalMode: boolean;
  setSurgicalMode: (mode: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedOrgan: null,
  setSelectedOrgan: (slug) => set({ selectedOrgan: slug, isSidebarOpen: slug !== null }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  isSurgicalMode: false,
  setSurgicalMode: (mode) => set({ isSurgicalMode: mode }),
}));
