import { create } from 'zustand';

export type DrawerId = 1 | 2 | 3 | 4 | null;
export type ProjectFolder = 'Skills' | 'Projects' | 'Demos';

interface CabinetState {
  activeDrawer: DrawerId;
  activeFolder: string | null;
  activeProject: string | null;
  activeProjectFolder: ProjectFolder;
  cabinetLanded: boolean;
  isFolderOpen: boolean;

  setActiveDrawer: (id: DrawerId) => void;
  setActiveFolder: (id: string | null) => void;
  setActiveProject: (id: string | null) => void;
  setActiveProjectFolder: (folder: ProjectFolder) => void;
  setCabinetLanded: (landed: boolean) => void;
  setFolderOpen: (open: boolean) => void;
  closeAll: () => void;
}

export const useCabinetStore = create<CabinetState>((set) => ({
  activeDrawer: null,
  activeFolder: null,
  activeProject: null,
  activeProjectFolder: 'Projects',
  cabinetLanded: false,
  isFolderOpen: false,

  setActiveDrawer: (id) => set({ activeDrawer: id, activeFolder: null, activeProject: null }),
  setActiveFolder: (id) => set({ activeFolder: id }),
  setActiveProject: (id) => set({ activeProject: id }),
  setActiveProjectFolder: (folder) => set({ activeProjectFolder: folder }),
  setCabinetLanded: (landed) => set({ cabinetLanded: landed }),
  setFolderOpen: (open) => set({ isFolderOpen: open }),
  closeAll: () => set({ activeDrawer: null, activeFolder: null, activeProject: null, isFolderOpen: false }),
}));
