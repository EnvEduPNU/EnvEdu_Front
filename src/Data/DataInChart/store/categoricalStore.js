import { create } from "zustand";

export const categoricalStore = create((set, get) => ({
  categories: [],
  selectedCategory: "",
  categoriesLength: 0,

  // Methods to modify the state
  changeCategory: (category) => set(() => ({ selectedCategory: category })),
  changeCategoryLength: (length) => set(() => ({ categoriesLength: length })),

  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  removeCategory: (category) =>
    set((state) => ({
      categories: state.categories.filter((c) => c !== category),
      selectedCategory:
        state.selectedCategory === category
          ? state.categories[0]
          : state.selectedCategory,
    })),
  resetSelectedCategory: () =>
    set((state) => ({ selectedCategory: state.categories[0] })),

  // Getters to retrieve state
  getCategories: () => get().categories,
  getCategoriesLength: () => get().categoriesLength,
  getSelectedCategory: () => get().selectedCategory,
}));
