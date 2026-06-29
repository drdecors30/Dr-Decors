import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.js";
import { useNavigate } from "react-router-dom";
import { 
  Shield, LayoutDashboard, ShoppingBag, FolderTree, Users, Settings2, 
  Mail, Bell, TrendingUp, Eye, ShoppingCart, Plus, Edit3, Trash2, Copy, 
  UploadCloud, FileSpreadsheet, EyeOff, Check, X, AlertCircle, Save, Star
} from "lucide-react";

const convertGoogleDriveUrl = (url: string) => {
  if (!url) return "";

  // Already thumbnail URL
  if (url.includes("drive.google.com/thumbnail")) return url;

  const match = url.match(/\/file\/d\/([^/]+)/);

  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }

  return url;
};

const SEED_PRODUCTS = [
  {
    name: "Ocean Resin Wall Clock",
    shortDescription: "Elegant wall clock handcrafted with multiple layers of crystal epoxy resin and natural beach sand on premium teakwood.",
    fullDescription: "Our signature Ocean Resin Wall Clock is created by laying up to 5 individual coats of tinted crystal epoxy resin on organic teakwood circle frames. Each layer is hand-torched to induce realistic ocean foam waves, cellular lacing, and physical depth. Equipped with a silent sweeping quartz movement that guarantees tick-free silence. Perfect for creating a coastal theme in any living room or dining area.",
    price: 3499,
    discountPrice: 2499,
    discountPercentage: 28,
    category: "Wall Clocks",
    subcategory: "Ocean Series",
    sku: "DEE-CLK-OCN01",
    availableStock: 5,
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600"
    ],
    primaryImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
    materialsUsed: ["Teakwood", "Crystal Resin", "Quartz Movement", "Beach Sand"],
    dimensions: "12 x 12 inches",
    weight: "1.2 kg",
    color: "Ocean Blue & Teak",
    style: "Coastal Modern",
    tags: ["resin clock", "ocean waves", "teak wood decor"],
    featured: true,
    trending: true,
    newArrival: true,
    bestSeller: true,
    status: "published" as const
  },
  {
    name: "Golden Sunburst Acrylic Canvas",
    shortDescription: "Textured gold-leaf and acrylic sunburst painting on canvas panel, adding a luminous glow to dining backgrounds.",
    fullDescription: "A glorious statement piece. The Golden Sunburst painting uses heavy-body acrylic plaster to raise 3D textured light rays from the center, which are then meticulously gilded with fine gold-leaf sheets. Renders an absolute luxury warmth under accent lighting, making it the perfect focal highlight above beds or dining credenzas.",
    price: 5999,
    discountPrice: 4999,
    category: "Paintings",
    subcategory: "Heavy Textured Canvas",
    sku: "DEE-PNT-SBN02",
    availableStock: 3,
    images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600"],
    primaryImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600",
    materialsUsed: ["Stretched Canvas", "Heavy Gesso Plaster", "Gold Leafing", "Acrylic Colors"],
    dimensions: "24 x 36 inches",
    weight: "2.1 kg",
    color: "Metallic Gold & Charcoal",
    style: "Luxury Contemporary",
    tags: ["canvas painting", "gold leaf", "sunburst", "textured art"],
    featured: true,
    trending: false,
    newArrival: true,
    bestSeller: false,
    status: "published" as const
  },
  {
    name: "Custom Neon Calligraphy Light",
    shortDescription: "Glow sign crafted on transparent high-density acrylic backboard, customized with your name or favorite slogan.",
    fullDescription: "Make a bold, glowing statement with customizable neon lights. Utilizing low-voltage, flexible, high-luminosity silicone LED neon strips mounted on high-grade polished acrylic plates. Hand-soldered for absolute longevity. Choose your preferred font, backing style, and color to suit bedrooms or home workspace setups.",
    price: 2499,
    discountPrice: 1899,
    category: "Neon Light Art",
    sku: "DEE-NEO-CST03",
    availableStock: 10,
    images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600"],
    primaryImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
    materialsUsed: ["Flexible Silicone Neon Strips", "High Density Acrylic Plate", "12V Adapter"],
    dimensions: "18 x 8 inches",
    weight: "0.8 kg",
    color: "Amber Gold Glow",
    style: "Retro Modern Glow",
    tags: ["neon sign", "calligraphy light", "personalized gift"],
    featured: false,
    trending: true,
    newArrival: false,
    bestSeller: true,
    status: "published" as const
  },
  {
    name: "Geometric Mandala Thread Frame",
    shortDescription: "Captivating string mandala constructed by winding 1200 yards of premium cotton threads on 120 alignment pins.",
    fullDescription: "An intricate showcase of mathematical symmetry. Constructed by hand-hammering 120 brass alignment pins onto a dark-stained matte pine board. We then wind over 1200 yards of layered gradient cotton threads, intersecting carefully to formulate a hypnotizing mandala geometry. Each piece represents 14 hours of strict mechanical patience.",
    price: 3200,
    discountPrice: 2799,
    category: "Thread Art",
    sku: "DEE-THR-MDL04",
    availableStock: 2,
    images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600"],
    primaryImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600",
    materialsUsed: ["Matte Pine Wood", "Brass Pins", "Gradient Cotton Threads"],
    dimensions: "16 x 16 inches",
    weight: "1.6 kg",
    color: "Rainbow Gradient & Espresso",
    style: "Rustic Sacred Geometry",
    tags: ["string art", "mandala", "thread frames", "sacred geometry"],
    featured: false,
    trending: false,
    newArrival: false,
    bestSeller: false,
    status: "published" as const
  }
];

export const Admin: React.FC = () => {
  const { user, token, refreshProducts, refreshCategories, refreshSettings, settings, addToast } = useApp();
  const navigate = useNavigate();

  // Enforce Admin Authentication
  useEffect(() => {
    if (!user || !user.isAdmin) {
      addToast("Unauthorized! Admin credentials required.", "error");
      navigate("/profile");
    }
  }, [user]);

  // Tab selections: "overview" | "products" | "categories" | "users" | "inquiries" | "settings"
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "users" | "inquiries" | "settings">("overview");

  // Load Admin Data states
  const [stats, setStats] = useState<any>(null);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for Products CRUD
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prdName, setPrdName] = useState("");
  const [prdShortDesc, setPrdShortDesc] = useState("");
  const [prdFullDesc, setPrdFullDesc] = useState("");
  const [prdPrice, setPrdPrice] = useState(0);
  const [prdDiscountPrice, setPrdDiscountPrice] = useState<number | undefined>(undefined);
  const [prdCategory, setPrdCategory] = useState("");
  const [prdSubcategory, setPrdSubcategory] = useState("");
  const [prdSku, setPrdSku] = useState("");
  const [prdStock, setPrdStock] = useState(1);
  const [prdPrimaryImage, setPrdPrimaryImage] = useState("");
  const [prdImages, setPrdImages] = useState<string[]>([]);
  const [prdMaterials, setPrdMaterials] = useState("");
  const [prdDimensions, setPrdDimensions] = useState("");
  const [prdWeight, setPrdWeight] = useState("");
  const [prdColor, setPrdColor] = useState("");
  const [prdStyle, setPrdStyle] = useState("");
  const [prdTags, setPrdTags] = useState("");
  const [prdFeatured, setPrdFeatured] = useState(false);
  const [prdTrending, setPrdTrending] = useState(false);
  const [prdNewArrival, setPrdNewArrival] = useState(false);
  const [prdBestSeller, setPrdBestSeller] = useState(false);
  const [prdStatus, setPrdStatus] = useState<"draft" | "published" | "hidden">("published");

  // Form states for Categories CRUD
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");
  const [catOrder, setCatOrder] = useState(10);

  // Form states for Settings modification
  const [setWebName, setSetWebName] = useState("");
  const [setLogo, setSetLogo] = useState("");
  const [setWhatsApp, setSetWhatsApp] = useState("");
  const [setAddress, setSetAddress] = useState("");
  const [setEmail, setSetEmail] = useState("");
  const [setInstagram, setSetInstagram] = useState("");
  const [setFacebook, setSetFacebook] = useState("");
  const [setSeoDesc, setSetSeoDesc] = useState("");

  // Bulk operation tracking
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Custom delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string | null;
    type: "product" | "category" | "bulk";
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Refresh admin data sets
  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [resStats, resPrd, resCat, resUsers, resMsg] = await Promise.all([
        fetch("/api/analytics", { headers }),
        fetch("/api/products", { headers }),
        fetch("/api/categories", { headers }),
        fetch("/api/users", { headers }),
        fetch("/api/contact-messages", { headers })
      ]);

      if (resStats.ok) setStats(await resStats.json());
      if (resPrd.ok) setProductsList(await resPrd.json());
      if (resCat.ok) setCategoriesList(await resCat.json());
      if (resUsers.ok) setUsersList(await resUsers.json());
      if (resMsg.ok) setInquiriesList(await resMsg.json());

    } catch (e) {
      console.error("Error loading admin datasets:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab, token]);

  // Sync settings when settings tab opens
  useEffect(() => {
    if (settings) {
      setSetWebName(settings.websiteName);
      setSetLogo(settings.logo);
      setSetWhatsApp(settings.whatsAppNumber);
      setSetAddress(settings.businessAddress);
      setSetEmail(settings.contactEmail);
      setSetInstagram(settings.instagramUrl || "");
      setSetFacebook(settings.facebookUrl || "");
      setSetSeoDesc(settings.seoDescription || "");
    }
  }, [settings, activeTab]);

  if (!user || !user.isAdmin) {
    return null;
  }

  // Handle Product Save (Create or Update)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prdName || !prdPrice || !prdCategory) {
      addToast("Name, Price, and Category are required", "error");
      return;
    }

    const payload = {
      name: prdName,
      shortDescription: prdShortDesc,
      fullDescription: prdFullDesc,
      price: Number(prdPrice),
      discountPrice: prdDiscountPrice ? Number(prdDiscountPrice) : undefined,
      category: prdCategory,
      subcategory: prdSubcategory,
      sku: prdSku,
      availableStock: Number(prdStock),
      images: prdImages.length
        ? prdImages.map(convertGoogleDriveUrl)
        : [convertGoogleDriveUrl(prdPrimaryImage)],

      primaryImage: convertGoogleDriveUrl(prdPrimaryImage),
      materialsUsed: prdMaterials.split(",").map(m => m.trim()).filter(Boolean),
      dimensions: prdDimensions,
      weight: prdWeight,
      color: prdColor,
      style: prdStyle,
      tags: prdTags.split(",").map(t => t.trim()).filter(Boolean),
      featured: prdFeatured,
      trending: prdTrending,
      newArrival: prdNewArrival,
      bestSeller: prdBestSeller,
      status: prdStatus
    };

    try {
      const url = editingProductId ? `/api/products/${editingProductId}` : "/api/products";
      const method = editingProductId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addToast(editingProductId ? "Product updated successfully!" : "New product published!", "success");
        setShowProductForm(false);
        resetProductForm();
        loadAdminData();
        refreshProducts();
      } else {
        const err = await res.json();
        addToast(err.error || "Failed to save product", "error");
      }
    } catch (e) {
      addToast("Save product request failed", "error");
    }
  };

  const handleEditProductClick = (p: any) => {
    setEditingProductId(p.id);
    setPrdName(p.name);
    setPrdShortDesc(p.shortDescription || "");
    setPrdFullDesc(p.fullDescription || "");
    setPrdPrice(p.price);
    setPrdDiscountPrice(p.discountPrice);
    setPrdCategory(p.category);
    setPrdSubcategory(p.subcategory || "");
    setPrdSku(p.sku);
    setPrdStock(p.availableStock);
    setPrdPrimaryImage(p.primaryImage);
    setPrdImages(p.images || []);
    setPrdMaterials(p.materialsUsed ? p.materialsUsed.join(", ") : "");
    setPrdDimensions(p.dimensions || "");
    setPrdWeight(p.weight || "");
    setPrdColor(p.color || "");
    setPrdStyle(p.style || "");
    setPrdTags(p.tags ? p.tags.join(", ") : "");
    setPrdFeatured(p.featured);
    setPrdTrending(p.trending);
    setPrdNewArrival(p.newArrival);
    setPrdBestSeller(p.bestSeller);
    setPrdStatus(p.status || "published");
    
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    setConfirmDelete({
      id,
      type: "product",
      title: "Permanently Delete Product?",
      message: "Are you sure you want to permanently delete this product? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.ok) {
            addToast("Product deleted successfully", "info");
            loadAdminData();
            refreshProducts();
          } else {
            addToast("Failed to delete product", "error");
          }
        } catch (e) {
          addToast("Delete request failed", "error");
        }
      }
    });
  };

  const handleDuplicateProduct = async (p: any) => {
    const payload = {
      ...p,
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-CP`,
      status: "draft" as const
    };
    delete payload.id;
    delete payload.createdDate;
    delete payload.updatedDate;
    delete payload.views;
    delete payload.purchaseClicks;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addToast("Product duplicated as draft successfully!", "success");
        loadAdminData();
        refreshProducts();
      } else {
        addToast("Failed to duplicate product", "error");
      }
    } catch (e) {
      addToast("Duplicate request failed", "error");
    }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setPrdName("");
    setPrdShortDesc("");
    setPrdFullDesc("");
    setPrdPrice(0);
    setPrdDiscountPrice(undefined);
    setPrdCategory("");
    setPrdSubcategory("");
    setPrdSku("");
    setPrdStock(1);
    setPrdPrimaryImage("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600");
    setPrdImages([]);
    setPrdMaterials("");
    setPrdDimensions("");
    setPrdWeight("");
    setPrdColor("");
    setPrdStyle("");
    setPrdTags("");
    setPrdFeatured(false);
    setPrdTrending(false);
    setPrdNewArrival(false);
    setPrdBestSeller(false);
    setPrdStatus("published");
  };

  // Bulk Seeding & Clearing operations
  const handleBulkSeedImport = async () => {
    try {
      const res = await fetch("/api/products/bulk-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ products: SEED_PRODUCTS })
      });

      if (res.ok) {
        const data = await res.json();
        addToast(`Successfully imported ${data.count} handcrafted seed products!`, "success");
        loadAdminData();
        refreshProducts();
      } else {
        addToast("Seed import failed.", "error");
      }
    } catch (e) {
      addToast("Seeding failed.", "error");
    }
  };

  const handleBulkDelete = () => {
    if (!selectedProductIds.length) return;
    setConfirmDelete({
      id: null,
      type: "bulk",
      title: "Delete Selected Products?",
      message: `Are you sure you want to permanently delete the ${selectedProductIds.length} selected products? This action is irreversible.`,
      onConfirm: async () => {
        try {
          const res = await fetch("/api/products/bulk-delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ids: selectedProductIds })
          });

          if (res.ok) {
            addToast("Bulk products deletion completed", "info");
            setSelectedProductIds([]);
            loadAdminData();
            refreshProducts();
          } else {
            addToast("Failed bulk delete", "error");
          }
        } catch (e) {
          addToast("Bulk deletion failed", "error");
        }
      }
    });
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Category CRUD handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    const payload = {
      name: catName,
      description: catDesc,
      image: convertGoogleDriveUrl(catImage),
      order: Number(catOrder)
    };

    try {
      const url = editingCategoryId ? `/api/categories/${editingCategoryId}` : "/api/categories";
      const method = editingCategoryId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addToast("Category stored successfully!", "success");
        setShowCategoryForm(false);
        setEditingCategoryId(null);
        setCatName("");
        setCatDesc("");
        setCatImage("");
        setCatOrder(10);
        loadAdminData();
        refreshCategories();
      }
    } catch (e) {
      addToast("Category save failed", "error");
    }
  };

  const handleEditCategoryClick = (c: any) => {
    setEditingCategoryId(c.id);
    setCatName(c.name);
    setCatDesc(c.description || "");
    setCatImage(c.image || "");
    setCatOrder(c.order || 10);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    setConfirmDelete({
      id,
      type: "category",
      title: "Delete Category Collection?",
      message: "Are you sure you want to delete this category? Products linked to this category won't be deleted but might become uncategorized.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            addToast("Category deleted", "info");
            loadAdminData();
            refreshCategories();
          } else {
            addToast("Delete category failed", "error");
          }
        } catch (e) {
          addToast("Delete category failed", "error");
        }
      }
    });
  };

  // User suspend toggle
  const handleToggleSuspendUser = async (id: string, currentSuspended: boolean) => {
    try {
      const res = await fetch(`/api/users/${id}/suspend`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isSuspended: !currentSuspended })
      });
      if (res.ok) {
        addToast(currentSuspended ? "User restored" : "User suspended", "info");
        loadAdminData();
      }
    } catch (e) {
      addToast("Toggle user status failed", "error");
    }
  };

  // Message status toggle
  const handleToggleMessageRead = async (id: string, currentStatus: "unread" | "read") => {
    const next = currentStatus === "unread" ? "read" : "unread";
    try {
      const res = await fetch(`/api/contact-messages/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: next })
      });
      if (res.ok) {
        addToast(`Message marked as ${next}`, "success");
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save website settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          websiteName: setWebName,
          logo: setLogo,
          whatsAppNumber: setWhatsApp,
          businessAddress: setAddress,
          contactEmail: setEmail,
          instagramUrl: setInstagram,
          facebookUrl: setFacebook,
          seoDescription: setSeoDesc
        })
      });

      if (res.ok) {
        addToast("Website settings updated dynamically!", "success");
        refreshSettings();
      } else {
        addToast("Failed to save settings", "error");
      }
    } catch (e) {
      addToast("Settings update failed", "error");
    }
  };

  return (
    <div id="admin-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">
      
      {/* LEFT SIDEBAR: TABS SELECTIONS */}
      <div className="w-full md:w-64 glass-card rounded-3xl p-5 shrink-0 space-y-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-stone-900">Admin Control</h2>
            <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">Dr.Decors V1.0</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
            { id: "products", label: "Manage Products", icon: ShoppingBag },
            { id: "categories", label: "Categories Manager", icon: FolderTree },
            { id: "users", label: "Registered Members", icon: Users },
            { id: "inquiries", label: "Client Inquiries", icon: Mail },
            { id: "settings", label: "Website Settings", icon: Settings2 }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setShowProductForm(false);
                  setShowCategoryForm(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all text-left ${
                  activeTab === item.id
                    ? "bg-amber-100 border border-amber-200 text-amber-800 shadow-sm"
                    : "text-stone-500 hover:text-amber-800 hover:bg-stone-50"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* RIGHT DISPLAY: ACTIVE TAB CONTENT */}
      <div className="flex-1 w-full space-y-8 min-w-0">
        
        {loading && !stats ? (
          <div className="p-24 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-900 mx-auto mb-3"></div>
            <p className="text-stone-400 text-xs uppercase font-bold tracking-wider">Syncing Admin Node...</p>
          </div>
        ) : (
          <>
            {/* ================= TAB 1: OVERVIEW ================= */}
            {activeTab === "overview" && stats && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* 1. Statistics Bento Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Visitors */}
                  <div className="p-6 glass-card rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Visitors</span>
                      <span className="text-2xl font-serif font-bold text-stone-900">{stats.stats.visitorsCount}</span>
                    </div>
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-800 border border-amber-200">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-6 glass-card rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Active Products</span>
                      <span className="text-2xl font-serif font-bold text-stone-900">{stats.stats.activeProducts} / {stats.stats.totalProducts}</span>
                    </div>
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-800 border border-amber-200">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Registered users */}
                  <div className="p-6 glass-card rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Registered Patrons</span>
                      <span className="text-2xl font-serif font-bold text-stone-900">{stats.stats.totalUsers}</span>
                    </div>
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-800 border border-amber-200">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  {/* WhatsApp Order Clicks */}
                  <div className="p-6 glass-card rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">WhatsApp Orders</span>
                      <span className="text-2xl font-serif font-bold text-stone-900">{stats.stats.totalRequests}</span>
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-800 border border-emerald-200">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                  </div>

                </div>

                {/* 2. Graphical Bento Bar and Recent Requests */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Category counts and analytics bento box */}
                  <div className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-6">
                    <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-1.5">
                      <TrendingUp className="w-5 h-5 text-amber-700" />
                      <span>Category Distribution Analytics</span>
                    </h3>
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                      {stats.categoryCounts.map((cat: any, idx: number) => {
                        const pct = stats.stats.totalProducts ? Math.round((cat.count / stats.stats.totalProducts) * 100) : 0;
                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-stone-700">
                              <span>{cat.name}</span>
                              <span className="font-mono text-amber-800">{cat.count} designs ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-600 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Popular Products List */}
                  <div className="glass-card rounded-3xl p-6 space-y-6">
                    <h3 className="font-serif font-bold text-base text-stone-900">Popular Designs</h3>
                    <div className="space-y-4">
                      {stats.popularProducts.length > 0 ? (
                        stats.popularProducts.map((p: any) => (
                          <div key={p.id} className="flex justify-between items-center py-1.5 border-b border-stone-100 text-xs">
                            <span className="font-medium text-stone-700 truncate max-w-[130px]">{p.name}</span>
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold shrink-0">{p.views} views</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-500 text-xs italic py-2">No product views recorded yet.</p>
                      )}
                    </div>
                  </div>

                </div>

                {/* 3. Recent purchase orders */}
                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <h3 className="font-serif font-bold text-base text-stone-900">Recent WhatsApp Orders</h3>
                  {stats.recentRequests.length > 0 ? (
                    <div className="divide-y divide-stone-100 text-xs">
                      {stats.recentRequests.map((req: any) => (
                        <div key={req.id} className="py-4 flex flex-col sm:flex-row justify-between gap-2">
                          <div className="space-y-1">
                            <span className="font-bold text-stone-850">{req.productName}</span>
                            <p className="text-stone-600">Triggered by: <b className="text-amber-850">{req.userName}</b> ({req.userEmail})</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-amber-750 block">₹{req.productPrice.toLocaleString()}</span>
                            <span className="text-[10px] text-stone-500 block font-mono">{new Date(req.clickedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-500 text-xs italic py-4">No WhatsApp orders recorded yet. Clicking "Buy on WhatsApp" will trigger entries.</p>
                  )}
                </div>

              </div>
            )}

            {/* ================= TAB 2: MANAGE PRODUCTS ================= */}
            {activeTab === "products" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Products Control actions row */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        resetProductForm();
                        setShowProductForm(true);
                      }}
                      className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Product</span>
                    </button>
                    
                    <button
                      onClick={handleBulkSeedImport}
                      className="px-4 py-2.5 bg-transparent border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-full text-xs font-semibold flex items-center gap-1.5"
                      title="Load high-fidelity initial products demo instantly"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Load Sandbox Seed</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {selectedProductIds.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Selected ({selectedProductIds.length})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* PRODUCT EDIT/CREATE FORM MODAL SLIDE */}
                {showProductForm && (
                  <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <h3 className="font-serif font-bold text-lg text-stone-900">
                        {editingProductId ? `Modify Design: ${prdName}` : "Publish New Handcrafted Design"}
                      </h3>
                      <button onClick={() => setShowProductForm(false)} className="text-stone-500 hover:text-stone-800">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleProductSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Product Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ocean Resin Wall Clock"
                            value={prdName}
                            onChange={(e) => setPrdName(e.target.value)}
                            className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">SKU Code</label>
                          <input
                            type="text"
                            placeholder="e.g. DEE-CLK-OCN01"
                            value={prdSku}
                            onChange={(e) => setPrdSku(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Price (₹)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={prdPrice}
                            onChange={(e) => setPrdPrice(Number(e.target.value))}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Discount Price (Optional, ₹)</label>
                          <input
                            type="number"
                            min={0}
                            value={prdDiscountPrice || ""}
                            onChange={(e) => setPrdDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Category</label>
                          <select
                            required
                            value={prdCategory}
                            onChange={(e) => setPrdCategory(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="">Select Category</option>
                            {categoriesList.map((cat) => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Available Stock</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={prdStock}
                            onChange={(e) => setPrdStock(Number(e.target.value))}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Primary Image URL</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. https://images.unsplash.com/photo-..."
                            value={prdPrimaryImage}
                            onChange={(e) =>  setPrdPrimaryImage(convertGoogleDriveUrl(e.target.value)) }
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Theme / Style</label>
                          <input
                            type="text"
                            placeholder="e.g. Coastal Modern / sacred geometry"
                            value={prdStyle}
                            onChange={(e) => setPrdStyle(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Materials Used (comma separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. Teakwood, crystal resin, quartz"
                            value={prdMaterials}
                            onChange={(e) => setPrdMaterials(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Dimensions</label>
                          <input
                            type="text"
                            placeholder="e.g. 12 x 12 inches"
                            value={prdDimensions}
                            onChange={(e) => setPrdDimensions(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Weight</label>
                          <input
                            type="text"
                            placeholder="e.g. 1.2 kg"
                            value={prdWeight}
                            onChange={(e) => setPrdWeight(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Color Palette</label>
                          <input
                            type="text"
                            placeholder="e.g. Turquoise Blue & Oak"
                            value={prdColor}
                            onChange={(e) => setPrdColor(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Short Description Outline</label>
                          <input
                            type="text"
                            required
                            placeholder="Brief 1-sentence outline for catalog preview..."
                            value={prdShortDesc}
                            onChange={(e) => setPrdShortDesc(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Full Craft Narrative Story</label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Detail your full curing cycles, hand tools used, and safety/durability features..."
                            value={prdFullDesc}
                            onChange={(e) => setPrdFullDesc(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Search Keywords / Tags (comma separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. ocean art, wall clock, customized resin"
                            value={prdTags}
                            onChange={(e) => setPrdTags(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      {/* Flag states checkboxes */}
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-150 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: "Featured Product", checked: prdFeatured, setter: setPrdFeatured },
                          { label: "Trending Product", checked: prdTrending, setter: setPrdTrending },
                          { label: "New Arrival", checked: prdNewArrival, setter: setPrdNewArrival },
                          { label: "Best Seller", checked: prdBestSeller, setter: setPrdBestSeller }
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-stone-600 hover:text-stone-900">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={(e) => item.setter(e.target.checked)}
                              className="rounded border-stone-300 text-amber-600 focus:ring-amber-500/20"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>

                      {/* Status select and submit */}
                      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="text-[10px] uppercase font-bold text-stone-400">Publishing Status:</span>
                          <select
                            value={prdStatus}
                            onChange={(e) => setPrdStatus(e.target.value as any)}
                            className="bg-stone-50 border border-stone-250 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                          >
                            <option value="published">Published (Visible immediately)</option>
                            <option value="draft">Draft (Visible only to admins)</option>
                            <option value="hidden">Hidden (Completely private)</option>
                          </select>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => setShowProductForm(false)}
                            className="px-5 py-2.5 bg-transparent border border-stone-200 text-stone-600 rounded-full text-xs font-semibold"
                          >
                            Discard
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-stone-900 hover:bg-amber-800 text-white rounded-full text-xs font-semibold shadow-sm"
                          >
                            {editingProductId ? "Save Changes" : "Publish Masterpiece"}
                          </button>
                        </div>
                      </div>

                    </form>
                  </div>
                )}

                {/* Products Table */}
                <div className="glass rounded-3xl overflow-hidden">
                  {productsList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-100 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-600 font-bold">
                            <th className="py-4 px-6 w-10">Select</th>
                            <th className="py-4 px-6">Product Details</th>
                            <th className="py-4 px-6">SKU</th>
                            <th className="py-4 px-6">Stock</th>
                            <th className="py-4 px-6">Pricing</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {productsList.map((p) => (
                            <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                              <td className="py-4 px-6">
                                <input
                                  type="checkbox"
                                  checked={selectedProductIds.includes(p.id)}
                                  onChange={() => toggleSelectProduct(p.id)}
                                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-amber-500/10"
                                />
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-stone-200 bg-stone-50">
                                    <img src={p.primaryImage} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-stone-900 block">{p.name}</span>
                                    <span className="text-[10px] text-stone-500 font-mono">{p.category}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-mono text-stone-600">{p.sku}</td>
                              <td className="py-4 px-6">
                                <span className={`font-semibold ${p.availableStock <= 0 ? "text-rose-600" : "text-stone-700"}`}>
                                  {p.availableStock} left
                                </span>
                              </td>
                              <td className="py-4 px-6 font-mono font-bold text-stone-900">
                                {p.discountPrice ? (
                                  <div>
                                    <span>₹{p.discountPrice}</span>
                                    <span className="text-[10px] text-stone-500 line-through block font-normal">₹{p.price}</span>
                                  </div>
                                ) : (
                                  <span>₹{p.price}</span>
                                )}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold capitalize ${
                                  p.status === "published" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : p.status === "draft" ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-stone-200 text-stone-600"
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleDuplicateProduct(p)}
                                    className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
                                    title="Duplicate design as draft"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditProductClick(p)}
                                    className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
                                    title="Edit design specifications"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 text-stone-500 hover:text-rose-600 transition-colors"
                                    title="Delete product permanently"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-16 text-center text-stone-400 text-xs italic">
                      Zero products in catalog. Click "Create Product" or "Load Sandbox Seed" to populate database instantly.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ================= TAB 3: CATEGORIES ================= */}
            {activeTab === "categories" && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-lg text-stone-900">Category Collections</h3>
                  <button
                    onClick={() => {
                      setEditingCategoryId(null);
                      setCatName("");
                      setCatDesc("");
                      setCatImage("");
                      setCatOrder(10);
                      setShowCategoryForm(true);
                    }}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-950 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-amber-600/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Category</span>
                  </button>
                </div>

                {showCategoryForm && (
                  <form onSubmit={handleCategorySubmit} className="glass-card p-6 rounded-2xl space-y-4">
                    <h4 className="font-serif font-bold text-sm text-stone-900">
                      {editingCategoryId ? "Edit Category Details" : "Construct New Category"}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Category Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Paintings"
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Layout Ordering</label>
                        <input
                          type="number"
                          value={catOrder}
                          onChange={(e) => setCatOrder(Number(e.target.value))}
                          className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Thumbnail Image URL</label>
                        <input
                          type="text"
                          placeholder="Paste Google Drive or Image URL"
                          value={catImage}
                          onChange={(e) =>
                            setCatImage(convertGoogleDriveUrl(e.target.value))
                          }
                          className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Short Description</label>
                        <input
                          type="text"
                          placeholder="Brief description of design items..."
                          value={catDesc}
                          onChange={(e) => setCatDesc(e.target.value)}
                          className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCategoryForm(false)}
                        className="px-4 py-1.5 bg-transparent border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold"
                      >
                        Save Category
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoriesList.map((cat) => (
                    <div key={cat.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between">
                      <div className="aspect-video w-full overflow-hidden bg-stone-50">
                        <img src={cat.image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300"} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-serif font-bold text-sm text-stone-900">{cat.name}</h4>
                            <span className="font-mono text-[10px] text-stone-500">Order: #{cat.order}</span>
                          </div>
                          <p className="text-stone-600 text-[11px] line-clamp-2 leading-relaxed">{cat.description || "No short outline."}</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                          <button onClick={() => handleEditCategoryClick(cat)} className="text-[11px] font-semibold text-stone-700 hover:text-amber-800">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteCategory(cat.id)} className="text-[11px] font-semibold text-stone-500 hover:text-rose-600">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ================= TAB 4: USERS / PATRONS ================= */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="font-serif font-bold text-lg text-stone-900">Registered Artisan Patrons</h3>
                
                <div className="glass rounded-3xl overflow-hidden">
                  {usersList.length > 0 ? (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-stone-100 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-600 font-bold">
                          <th className="py-4 px-6">Patron details</th>
                          <th className="py-4 px-6">Joined Date</th>
                          <th className="py-4 px-6">Wishlist count</th>
                          <th className="py-4 px-6">Address</th>
                          <th className="py-4 px-6 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {usersList.map((usr) => (
                          <tr key={usr.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-4 px-6">
                              <div>
                                <span className="font-bold text-stone-900 block">{usr.name}</span>
                                <span className="text-[10px] text-stone-500 block font-mono">{usr.email}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-stone-700">{new Date(usr.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-6 font-semibold text-stone-800">{usr.wishlist?.length || 0} items</td>
                            <td className="py-4 px-6 text-stone-700 max-w-[150px] truncate">{usr.savedAddress || "N/A"}</td>
                            <td className="py-4 px-6 text-right">
                              {usr.isAdmin ? (
                                <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest bg-stone-100 px-2 py-1 rounded border border-stone-200">
                                  System Admin
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleToggleSuspendUser(usr.id, !!usr.isSuspended)}
                                  className={`px-3 py-1.5 rounded-full font-semibold text-[10px] tracking-wide border transition-all ${
                                    usr.isSuspended
                                      ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                                      : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                                  }`}
                                >
                                  {usr.isSuspended ? "Suspended" : "Suspend patron"}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-stone-400 text-xs italic">
                      Zero registered patrons.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 5: CLIENT INQUIRIES ================= */}
            {activeTab === "inquiries" && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="font-serif font-bold text-lg text-stone-900">Client Mails Inquiries</h3>
                
                <div className="space-y-4">
                  {inquiriesList.length > 0 ? (
                    inquiriesList.map((msg) => (
                      <div key={msg.id} className="p-6 glass-card rounded-2xl space-y-3 relative">
                        <div className="flex justify-between items-start text-xs">
                          <div>
                            <span className="font-bold text-stone-900 text-sm block">{msg.name}</span>
                            <span className="text-stone-500 font-mono block">{msg.email}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-stone-500 font-semibold block">{new Date(msg.sentAt).toLocaleString()}</span>
                            <button
                              onClick={() => handleToggleMessageRead(msg.id, msg.status)}
                              className={`inline-block mt-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border transition-colors ${
                                msg.status === "unread" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-stone-100 text-stone-600 border-stone-200"
                              }`}
                            >
                              {msg.status}
                            </button>
                          </div>
                        </div>
                        <p className="text-stone-800 text-xs leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200/60 whitespace-pre-wrap font-sans">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-16 glass-card rounded-3xl text-center text-stone-500 text-xs italic">
                      Inquiries inbox empty. Any contact messages submitted via /contact will reflect here.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 6: WEBSITE SETTINGS ================= */}
            {activeTab === "settings" && (
              <form onSubmit={handleSaveSettings} className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
                <h3 className="font-serif font-bold text-lg text-stone-900">Configure Brand Identity</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Website Name</label>
                    <input
                      type="text"
                      required
                      value={setWebName}
                      onChange={(e) => setSetWebName(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Boutique Brand Logo Image URL</label>
                    <input
                      type="text"
                      required
                      value={setLogo}
                      onChange={(e) => setSetLogo(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">WhatsApp Order Hotline</label>
                    <input
                      type="text"
                      required
                      value={setWhatsApp}
                      onChange={(e) => setSetWhatsApp(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Artisan Office Email</label>
                    <input
                      type="email"
                      required
                      value={setEmail}
                      onChange={(e) => setSetEmail(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Physical Business Address</label>
                    <input
                      type="text"
                      required
                      value={setAddress}
                      onChange={(e) => setSetAddress(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Instagram Link</label>
                    <input
                      type="text"
                      value={setInstagram}
                      onChange={(e) => setSetInstagram(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">Facebook Link</label>
                    <input
                      type="text"
                      value={setFacebook}
                      onChange={(e) => setSetFacebook(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-600 block mb-1">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      value={setSeoDesc}
                      onChange={(e) => setSetSeoDesc(e.target.value)}
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold text-stone-900 leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 hover:bg-amber-800 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Website Settings</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}

      </div>

      {confirmDelete && (
        <div id="delete-confirmation-modal" className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-stone-900">{confirmDelete.title}</h3>
                <p className="text-stone-600 text-xs leading-relaxed">{confirmDelete.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-transparent border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDelete.onConfirm();
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
