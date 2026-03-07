import { create } from 'zustand';
import type { UserRole } from 'types';

interface UserState {
  profile: any | null; // Şimdilik mock data
  role: UserRole | null;
  setProfile: (profile: any, role: UserRole | null) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  role: null,
  setProfile: (profile, role) => set({ profile, role }),
  clearProfile: () => set({ profile: null, role: null }),
}));
