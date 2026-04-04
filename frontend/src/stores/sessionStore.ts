import { create } from 'zustand';
import type { TestSession, TestResult } from '../types';

interface SessionState {
  sessions: TestSession[];
  currentSession: TestSession | null;
  currentResults: TestResult[];
  localResults: Map<string, Partial<TestResult>>;
  setSessions: (sessions: TestSession[]) => void;
  setCurrentSession: (session: TestSession, results: TestResult[]) => void;
  updateLocalResult: (testPath: string, updates: Partial<TestResult>) => void;
  clearLocalResults: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  currentSession: null,
  currentResults: [],
  localResults: new Map(),

  setSessions: (sessions) => set({ sessions }),

  setCurrentSession: (session, results) => set({
    currentSession: session,
    currentResults: results,
    localResults: new Map()
  }),

  updateLocalResult: (testPath, updates) => set((state) => {
    const newMap = new Map(state.localResults);
    newMap.set(testPath, { ...newMap.get(testPath), ...updates });
    return { localResults: newMap };
  }),

  clearLocalResults: () => set({ localResults: new Map() })
}));
