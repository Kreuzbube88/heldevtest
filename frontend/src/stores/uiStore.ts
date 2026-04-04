import { create } from 'zustand';
import type { Toast } from '../types';

interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface UIState {
  toasts: Toast[];
  isSaving: boolean;
  confirmDialog: ConfirmDialogState | null;
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  setSaving: (saving: boolean) => void;
  openConfirm: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  isSaving: false,
  confirmDialog: null,

  addToast: (type, message) => {
    const id = Math.random().toString(36);
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 5000);
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  setSaving: (saving) => set({ isSaving: saving }),

  openConfirm: (title, message, onConfirm) => set({
    confirmDialog: { open: true, title, message, onConfirm }
  }),

  closeConfirm: () => set({ confirmDialog: null })
}));
