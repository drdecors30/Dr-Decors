import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Product, Category, WebsiteSettings } from "../types.js";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  user: User | null;
  token: string | null;
  settings: WebsiteSettings;
  products: Product[];
  categories: Category[];
  wishlist: string[];
  searchHistory: string[];
  toasts: Toast[];
  isLoading: boolean;
  theme: "light" | "dark";
  login: (userData: User, tokenStr: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: WebsiteSettings = {
  websiteName: "Dr.Decors",
  logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200",
  themeColor: "amber",
  whatsAppNumber: "+919876543210",
  businessAddress: "123 Elegance Lane, Artisan Quarter, Jaipur, India",
  contactEmail: "info@drdecors.com",
  facebookUrl: "https://facebook.com/drdecors",
  instagramUrl: "https://instagram.com/drdecors",
  seoDescription: "Premium handcrafted and customized home decor products - Dr.Decors.",
  seoKeywords: "home decor, customized gifts, resin art, wall clocks, thread art, paintings",
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("dee_token"));
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load initial system details
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      
      // Post visitor count (analytics, non-blocking)
      try {
        await fetch("/api/visitors", { method: "POST" });
      } catch (e) {}

      await Promise.all([
        refreshSettings(),
        refreshProducts(),
        refreshCategories()
      ]);

      // Check current user token
      if (token) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setWishlist(userData.wishlist || []);
            setSearchHistory(userData.searchHistory || []);
          } else {
            // Invalid/expired token
            localStorage.removeItem("dee_token");
            setToken(null);
          }
        } catch (e) {
          console.error("Auth check failed:", e);
        }
      } else {
        // Guest user wishlist
        const guestWish = localStorage.getItem("dee_guest_wishlist");
        if (guestWish) {
          setWishlist(JSON.parse(guestWish));
        }
        // Guest user search history
        const guestSearch = localStorage.getItem("dee_guest_search");
        if (guestSearch) {
          setSearchHistory(JSON.parse(guestSearch));
        }
      }

      setIsLoading(false);
    };

    initApp();
  }, [token]);

  const refreshSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  };

  const refreshProducts = async () => {
    try {
      const headers: any = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/products", { headers });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Error loading products:", e);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error("Error loading categories:", e);
    }
  };

  const login = (userData: User, tokenStr: string) => {
    localStorage.setItem("dee_token", tokenStr);
    setToken(tokenStr);
    setUser(userData);
    setWishlist(userData.wishlist || []);
    setSearchHistory(userData.searchHistory || []);
    addToast(`Welcome back, ${userData.name}!`, "success");
  };

  const logout = () => {
    localStorage.removeItem("dee_token");
    setToken(null);
    setUser(null);
    setWishlist([]);
    setSearchHistory([]);
    addToast("Logged out successfully", "info");
  };

  const updateProfile = async (updated: Partial<User>) => {
    if (!token) return;
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (updated.wishlist) setWishlist(data.wishlist);
        if (updated.searchHistory) setSearchHistory(data.searchHistory);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Profile update failed");
      }
    } catch (e: any) {
      addToast(e.message, "error");
      throw e;
    }
  };

  const toggleWishlist = async (productId: string) => {
    const isSaved = wishlist.includes(productId);
    let updated: string[];

    if (isSaved) {
      updated = wishlist.filter(id => id !== productId);
      addToast("Removed from wishlist", "info");
    } else {
      updated = [...wishlist, productId];
      addToast("Added to wishlist", "success");
    }

    setWishlist(updated);

    if (user && token) {
      try {
        await updateProfile({ wishlist: updated });
      } catch (e) {
        console.error("Sync wishlist failed:", e);
      }
    } else {
      localStorage.setItem("dee_guest_wishlist", JSON.stringify(updated));
    }
  };

  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return;
    const cleanQuery = query.trim().toLowerCase();
    const updated = [cleanQuery, ...searchHistory.filter(q => q !== cleanQuery)].slice(0, 10);
    setSearchHistory(updated);

    if (user && token) {
      updateProfile({ searchHistory: updated }).catch(e => console.error(e));
    } else {
      localStorage.setItem("dee_guest_search", JSON.stringify(updated));
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    if (user && token) {
      updateProfile({ searchHistory: [] }).catch(e => console.error(e));
    } else {
      localStorage.removeItem("dee_guest_search");
    }
  };

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        settings,
        products,
        categories,
        wishlist,
        searchHistory,
        toasts,
        isLoading,
        theme,
        login,
        logout,
        updateProfile,
        toggleWishlist,
        addToSearchHistory,
        clearSearchHistory,
        addToast,
        removeToast,
        refreshProducts,
        refreshCategories,
        refreshSettings,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
