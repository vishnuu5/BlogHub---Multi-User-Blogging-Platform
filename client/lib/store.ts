import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;

  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  toast: {
    message: string;
    type: "success" | "error" | "info" | "warning";
    show: boolean;
  };
  showToast: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      theme: "light",
      setTheme: (theme) => set({ theme }),

      toast: {
        message: "",
        type: "info",
        show: false,
      },
      showToast: (message, type) =>
        set({
          toast: { message, type, show: true },
        }),
      hideToast: () =>
        set({
          toast: { ...get().toast, show: false },
        }),
    }),
    {
      name: "ui-store",
    }
  )
);

interface BlogState {
  currentFilter: "all" | "published" | "draft";
  setCurrentFilter: (filter: "all" | "published" | "draft") => void;

  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;

  resetFilters: () => void;
}

export const useBlogStore = create<BlogState>()(
  devtools(
    (set) => ({
      currentFilter: "all",
      setCurrentFilter: (filter) => set({ currentFilter: filter }),

      selectedCategoryId: null,
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      currentPage: 1,
      setCurrentPage: (page) => set({ currentPage: page }),

      resetFilters: () =>
        set({
          currentFilter: "all",
          selectedCategoryId: null,
          searchQuery: "",
          currentPage: 1,
        }),
    }),
    {
      name: "blog-store",
    }
  )
);

interface DashboardState {
  currentView: "posts" | "categories" | "analytics";
  setCurrentView: (view: "posts" | "categories" | "analytics") => void;

  selectedPostId: number | null;
  setSelectedPostId: (id: number | null) => void;

  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  isCreatingPost: boolean;
  setIsCreatingPost: (creating: boolean) => void;

  isCreatingCategory: boolean;
  setIsCreatingCategory: (creating: boolean) => void;

  resetDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      currentView: "posts",
      setCurrentView: (view) => set({ currentView: view }),

      selectedPostId: null,
      setSelectedPostId: (id) => set({ selectedPostId: id }),

      selectedCategoryId: null,
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),

      isCreatingPost: false,
      setIsCreatingPost: (creating) => set({ isCreatingPost: creating }),

      isCreatingCategory: false,
      setIsCreatingCategory: (creating) =>
        set({ isCreatingCategory: creating }),

      resetDashboard: () =>
        set({
          currentView: "posts",
          selectedPostId: null,
          selectedCategoryId: null,
          isCreatingPost: false,
          isCreatingCategory: false,
        }),
    }),
    {
      name: "dashboard-store",
    }
  )
);
