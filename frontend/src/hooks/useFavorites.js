import { create } from "zustand";
import { persist } from "zustand/middleware";

const useFavorites = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (product) => {
        const favorites = get().favorites;

        const exists = favorites.some((item) => item.id === product.id);

        const updated = exists
          ? favorites.filter((item) => item.id !== product.id)
          : [...favorites, product];

        set({ favorites: updated });
      },

      isFavorite: (id) => {
        return get().favorites.some((item) => item.id === id);
      },
    }),
    {
      name: "favorites",
    },
  ),
);

export default useFavorites;
