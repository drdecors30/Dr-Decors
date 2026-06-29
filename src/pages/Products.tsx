import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext.js";
import { ProductCard } from "../components/ProductCard.js";
import { EmptyState } from "../components/EmptyState.js";
import { Search, SlidersHorizontal, ArrowUpDown, RotateCcw, Sparkles, Check, ChevronDown, Clock } from "lucide-react";

export const Products: React.FC = () => {
  const { products, categories, searchHistory, addToSearchHistory, clearSearchHistory } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [availability, setAvailability] = useState<"all" | "instock" | "outofstock">("all");
  
  // Status flags
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterTrending, setFilterTrending] = useState(false);
  const [filterBestSeller, setFilterBestSeller] = useState(false);
  
  // Sorting
  const [sortOption, setSortOption] = useState<string>(searchParams.get("sort") || "newest");
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync search query from URL params
  useEffect(() => {
    const searchUrl = searchParams.get("search");
    if (searchUrl !== null) {
      setSearchQuery(searchUrl);
    }
    const catUrl = searchParams.get("category");
    if (catUrl !== null) {
      setSelectedCategory(catUrl);
    }
  }, [searchParams]);

  // Click outside search auto-close suggestions
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // Suggestions list based on input query
  const suggestions = searchQuery.trim()
    ? products
        .filter(p => p.status === "published" && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(p => p.name)
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const finalTerm = term !== undefined ? term : searchQuery;
    
    if (finalTerm.trim()) {
      addToSearchHistory(finalTerm);
    }
    
    const newParams = new URLSearchParams(searchParams);
    if (finalTerm.trim()) {
      newParams.set("search", finalTerm);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    handleSearchSubmit(undefined, name);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice(0);
    setMaxPrice(25000);
    setAvailability("all");
    setFilterFeatured(false);
    setFilterTrending(false);
    setFilterBestSeller(false);
    setSortOption("newest");
    setSearchParams(new URLSearchParams());
  };

  // Run the massive filtering logic!
  const filteredProducts = products
    .filter(product => {
      // Must be published
      if (product.status !== "published") return false;

      // Search Query Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription?.toLowerCase().includes(query) || product.fullDescription?.toLowerCase().includes(query);
        const matchesTags = product.tags?.some(t => t.toLowerCase().includes(query));
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTags && !matchesCat) return false;
      }

      // Category filter
      if (selectedCategory && product.category !== selectedCategory) return false;

      // Price filter (takes discount price if present)
      const activePrice = product.discountPrice || product.price;
      if (activePrice < minPrice || activePrice > maxPrice) return false;

      // Availability filter
      if (availability === "instock" && product.availableStock <= 0) return false;
      if (availability === "outofstock" && product.availableStock > 0) return false;

      // Badge status flags
      if (filterFeatured && !product.featured) return false;
      if (filterTrending && !product.trending) return false;
      if (filterBestSeller && !product.bestSeller) return false;

      return true;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      switch (sortOption) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "alphabetical-asc":
          return a.name.localeCompare(b.name);
        case "alphabetical-desc":
          return b.name.localeCompare(a.name);
        case "oldest":
          return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "newest":
        default:
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
    });

  return (
    <div id="products-catalog-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block mb-2">Our Work</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">Handcrafted Treasures</h1>
        <p className="text-stone-600 text-sm mt-3 leading-relaxed">
          Explore our collection of custom paintings, resin wave clocks, glowing neon designs, pop arts, and handcrafted gifts curated specifically for beautiful homes.
        </p>
      </div>

      {/* SEARCH AND TOGGLE ROW */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        
        {/* Real-time Search Box */}
        <div ref={searchContainerRef} className="relative w-full md:max-w-lg z-30">
          <form onSubmit={(e) => handleSearchSubmit(e)} className="relative">
            <input
              type="text"
              placeholder="Search resin art, paintings, wall clocks..."
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              className="w-full bg-white border border-stone-200 pl-11 pr-10 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 shadow-sm text-stone-900 placeholder-stone-400"
            />
            <Search className="absolute left-4 top-3.5 text-stone-400 w-4 h-4" />
            
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("search");
                  setSearchParams(newParams);
                }}
                className="absolute right-4 top-3 text-stone-400 hover:text-stone-900 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </form>

          {/* Search Suggestions & Recent searches Overlay */}
          {showSuggestions && (showSuggestions || suggestions.length > 0 || searchHistory.length > 0) && (
            <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-2xl shadow-2xl p-4 overflow-hidden border border-stone-200">
              {/* Live matching Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-stone-600 mb-2">Suggestions</h5>
                  <div className="space-y-1">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(s)}
                        className="w-full text-left text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-stone-50 py-2 px-2.5 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Search className="w-3 h-3 text-stone-400" />
                        <span>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent History */}
              {searchHistory.length > 0 ? (
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h5 className="text-[10px] uppercase font-bold tracking-wider text-stone-600">Recent Searches</h5>
                    <button
                      onClick={clearSearchHistory}
                      className="text-[10px] font-semibold text-stone-500 hover:text-stone-800"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 5).map((historyTerm, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(historyTerm)}
                        className="w-full text-left text-xs text-stone-700 hover:text-amber-800 hover:bg-stone-50 py-2 px-2.5 rounded-lg flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{historyTerm}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                !suggestions.length && (
                  <div className="text-center text-xs text-stone-500 py-4">
                    Type to search handcrafted creations
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Filter controls Trigger Button and Sort menu */}
        <div className="flex gap-3 w-full md:w-auto shrink-0 justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border transition-colors ${
              showFilters || selectedCategory || minPrice > 0 || maxPrice < 25000 || availability !== "all" || filterFeatured || filterTrending || filterBestSeller
                ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Quick Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-stone-200 text-stone-700 px-5 py-3 pr-8 rounded-full text-sm font-medium focus:outline-none focus:ring-1 focus:ring-amber-500/50 shadow-sm appearance-none cursor-pointer"
            >
              <option value="newest" className="bg-white text-stone-700">Newest Added</option>
              <option value="oldest" className="bg-white text-stone-700">Oldest Added</option>
              <option value="price-asc" className="bg-white text-stone-700">Price: Low to High</option>
              <option value="price-desc" className="bg-white text-stone-700">Price: High to Low</option>
              <option value="alphabetical-asc" className="bg-white text-stone-700">Name: A to Z</option>
              <option value="alphabetical-desc" className="bg-white text-stone-700">Name: Z to A</option>
              <option value="popular" className="bg-white text-stone-700">Most Popular</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 text-stone-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* ADVANCED DEEP FILTERS CONTAINER */}
      {showFilters && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 animate-fadeIn border border-stone-200 backdrop-blur-xl bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* 1. Category selector */}
            <div>
              <h4 className="text-xs uppercase font-bold text-stone-600 tracking-wider mb-4">Category</h4>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                    !selectedCategory
                      ? "bg-amber-800 border-amber-800 text-white font-bold"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                      selectedCategory === cat.name
                        ? "bg-amber-800 border-amber-800 text-white font-bold"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                     {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Price Range */}
            <div>
              <div className="flex justify-between items-baseline mb-4">
                <h4 className="text-xs uppercase font-bold text-stone-600 tracking-wider">Price Range</h4>
                <span className="text-xs font-mono text-stone-800">₹{minPrice} - ₹{maxPrice}+</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] text-stone-500 block mb-1 uppercase font-bold">Min</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="bg-white px-3 py-1.5 rounded-lg text-xs w-full font-mono text-stone-900 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-stone-500 block mb-1 uppercase font-bold">Max</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="bg-white px-3 py-1.5 rounded-lg text-xs w-full font-mono text-stone-900 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Availability status */}
            <div>
              <h4 className="text-xs uppercase font-bold text-stone-600 tracking-wider mb-4">Availability</h4>
              <div className="flex gap-2">
                {(["all", "instock", "outofstock"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAvailability(opt)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      availability === opt
                        ? "bg-amber-800 border-amber-800 text-white font-bold"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    {opt === "all" ? "All Pieces" : opt === "instock" ? "In Stock" : "Out of Stock"}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Filter status flags (Bento checkboxes) */}
            <div>
              <h4 className="text-xs uppercase font-bold text-stone-600 tracking-wider mb-4">Special Badges</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Featured Collections", value: filterFeatured, setter: setFilterFeatured },
                  { label: "Trending Crafts", value: filterTrending, setter: setFilterTrending },
                  { label: "Bestseller Designs", value: filterBestSeller, setter: setFilterBestSeller },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 hover:text-stone-900">
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="rounded border-stone-300 text-amber-800 focus:ring-amber-500 bg-white"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-stone-200 mt-6">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-5 py-2 bg-amber-800 text-white rounded-full text-xs font-semibold hover:bg-amber-900 transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* FILTER TAG ROW */}
      {(selectedCategory || searchQuery || minPrice > 0 || maxPrice < 25000 || availability !== "all" || filterFeatured || filterTrending || filterBestSeller) && (
        <div className="flex flex-wrap gap-2 items-center mb-8">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide mr-2">Active Filters:</span>
          {searchQuery && (
            <span className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1 border border-stone-200 bg-white shadow-sm">
              <span>Query: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery("")} className="text-stone-400 hover:text-stone-900 font-bold ml-1">×</button>
            </span>
          )}
          {selectedCategory && (
            <span className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1 border border-stone-200 bg-white shadow-sm">
              <span>Category: {selectedCategory}</span>
              <button onClick={() => setSelectedCategory("")} className="text-stone-400 hover:text-stone-900 font-bold ml-1">×</button>
            </span>
          )}
          {(minPrice > 0 || maxPrice < 25000) && (
            <span className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1 border border-stone-200 bg-white shadow-sm">
              <span>Price: ₹{minPrice}-₹{maxPrice}</span>
              <button onClick={() => { setMinPrice(0); setMaxPrice(25000); }} className="text-stone-400 hover:text-stone-900 font-bold ml-1">×</button>
            </span>
          )}
          {availability !== "all" && (
            <span className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1 border border-stone-200 bg-white shadow-sm">
              <span>Stock: {availability}</span>
              <button onClick={() => setAvailability("all")} className="text-stone-400 hover:text-stone-900 font-bold ml-1">×</button>
            </span>
          )}
          {filterFeatured && (
            <span className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1 border border-stone-200 bg-white shadow-sm">
              <span>Featured</span>
              <button onClick={() => setFilterFeatured(false)} className="text-stone-400 hover:text-stone-900 font-bold ml-1">×</button>
            </span>
          )}
          {filterTrending && (
            <span className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1 border border-stone-200 bg-white shadow-sm">
              <span>Trending</span>
              <button onClick={() => setFilterTrending(false)} className="text-stone-400 hover:text-stone-900 font-bold ml-1">×</button>
            </span>
          )}
          {filterBestSeller && (
            <span className="glass-card px-3 py-1 rounded-full text-xs font-semibold text-stone-700 flex items-center gap-1 border border-stone-200 bg-white shadow-sm">
              <span>Bestseller</span>
              <button onClick={() => setFilterBestSeller(false)} className="text-stone-400 hover:text-stone-900 font-bold ml-1">×</button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 ml-1 underline decoration-dotted underline-offset-4"
          >
            Reset All
          </button>
        </div>
      )}

      {/* DYNAMIC PRODUCTS GRID OR EMPTY STATE */}
      {filteredProducts.length > 0 ? (
        <div>
          <div className="flex justify-between items-baseline mb-6">
            <span className="text-xs font-semibold text-stone-400">
              Showing {filteredProducts.length} handcrafted {filteredProducts.length === 1 ? "design" : "designs"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState type="search" onReset={resetFilters} />
      )}

    </div>
  );
};
