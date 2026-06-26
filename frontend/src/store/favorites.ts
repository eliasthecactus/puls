import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesStore {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set((s) => ({
          favoriteIds: s.favoriteIds.includes(id)
            ? s.favoriteIds.filter((x) => x !== id)
            : [...s.favoriteIds, id],
        })),
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'puls-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
