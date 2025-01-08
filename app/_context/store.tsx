import { create } from "zustand";

interface EditingState {
    editingId: string | null;
    setEditingId: (id: string | null) => void;
}

export const useEditingStore = create<EditingState>((set) => ({
    editingId: null,
    setEditingId: (id: string | null) => set({ editingId: id }),
}));


