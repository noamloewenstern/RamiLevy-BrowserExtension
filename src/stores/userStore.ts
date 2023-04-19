import { create } from 'zustand';

interface UserStoreState {
  isLoading: boolean;
  error: string | null;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
}));
