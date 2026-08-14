import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ArticlePanier = {
  produitId: string;
  varianteId: string;
  nom: string;
  image: string;
  taille: string;
  couleur: string;
  prix: number;
  quantite: number;
  stockDisponible: number;
};

type CartState = {
  articles: ArticlePanier[];
  ajouter: (article: ArticlePanier) => void;
  retirer: (varianteId: string) => void;
  majQuantite: (varianteId: string, quantite: number) => void;
  vider: () => void;
  total: () => number;
  nombreArticles: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      articles: [],

      ajouter: (article) => {
        const existant = get().articles.find(
          (a) => a.varianteId === article.varianteId
        );
        if (existant) {
          set({
            articles: get().articles.map((a) =>
              a.varianteId === article.varianteId
                ? {
                    ...a,
                    quantite: Math.min(
                      a.quantite + article.quantite,
                      a.stockDisponible
                    ),
                  }
                : a
            ),
          });
        } else {
          set({ articles: [...get().articles, article] });
        }
      },

      retirer: (varianteId) =>
        set({ articles: get().articles.filter((a) => a.varianteId !== varianteId) }),

      majQuantite: (varianteId, quantite) =>
        set({
          articles: get().articles.map((a) =>
            a.varianteId === varianteId
              ? { ...a, quantite: Math.max(1, Math.min(quantite, a.stockDisponible)) }
              : a
          ),
        }),

      vider: () => set({ articles: [] }),

      total: () =>
        get().articles.reduce((sum, a) => sum + a.prix * a.quantite, 0),

      nombreArticles: () =>
        get().articles.reduce((sum, a) => sum + a.quantite, 0),
    }),
    { name: "boutique-panier" }
  )
);
