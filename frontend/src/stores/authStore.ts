import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
  updateLanguage: (language: string) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: (user, token, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    set({ user: null, token: null });
  },

  updateLanguage: (language) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, language };
      if (localStorage.getItem('user')) localStorage.setItem('user', JSON.stringify(updatedUser));
      if (sessionStorage.getItem('user')) sessionStorage.setItem('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  initializeAuth: () => {
    let token = localStorage.getItem('token');
    let userJson = localStorage.getItem('user');

    if (!token) {
      token = sessionStorage.getItem('token');
      userJson = sessionStorage.getItem('user');
    }

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        set({ user, token });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
  }
}));
