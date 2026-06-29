import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.js";
import { Product } from "../types.js";
import { ProductCard } from "../components/ProductCard.js";
import { Heart, Share2, ShoppingBag, Truck, RotateCcw, Calendar, Check, Send, ChevronLeft, ChevronRight, Eye } from "lucide-react";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, toggleWishlist, wishlist, settings, addToast, user } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" });
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // 1. Fetch individual product from API to increment views & load details
  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setActiveImage(data.primaryImage || data.images[0]);
          
          // Save to Recently Viewed in localStorage (Client)
          const recentKey = "dee_recent_viewed";
          const recentList: string[] = JSON.parse(localStorage.getItem(recentKey) || "[]");
          const updatedRecent = [data.id, ...recentList.filter((x: string) => x !== data.id)].slice(0, 4);
          localStorage.setItem(recentKey, JSON.stringify(updatedRecent));
        } else {
          addToast("Failed to load product details", "error");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
        <p className="text-stone-400 text-sm font-medium">Curating details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-100">Artisan Masterpiece Not Found</h2>
        <p className="text-stone-400 text-sm">The product you are searching for might have been retired or updated.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-stone-100 rounded-full font-medium text-sm transition-colors">
          Return to Collections
        </Link>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);

  // Price calculations
  const displayPrice = product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount && product.discountPercentage 
    ? product.discountPercentage 
    : hasDiscount 
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100) 
    : 0;

  // Zoom on Hover Calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  // WhatsApp click handler & API log
  const handleBuyOnWhatsApp = async () => {
    // 1. Prepare messages
    const webUrl = window.location.origin;
    const productLink = `${webUrl}/product/${product.id}`;
    
    const message = `Hello Dr.Decors,

I am interested in purchasing this product.

Product:
${product.name}

Price:
₹${activePrice.toLocaleString()}

Product Link:
${productLink}

Product Image:
${activeImage}

Please let me know the availability.

Thank you.`;

    // 2. Fire backend logging (purchase Request click)
    try {
      await fetch(`/api/products/${product.id}/purchase-click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: user?.name || "Guest Customer",
          userEmail: user?.email || "guest@deedecors.com",
          whatsAppMessage: message
        })
      });
    } catch (e) {
      console.error("Failed to log click requests:", e);
    }

    // 3. Open Whatsapp Link
    const cleanNum = settings.whatsAppNumber.replace(/[^0-9]/g, "");
    const encodedMsg = encodeURIComponent(message);
    const whatsAppUrl = `https://wa.me/${cleanNum}?text=${encodedMsg}`;
    window.open(whatsAppUrl, "_blank");
    
    addToast("Purchase request logged! Redirecting to WhatsApp...", "success");
  };

  // Related products logic (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.status === "published" && p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Recently viewed products (using saved ids in client Storage)
  const recentIds: string[] = JSON.parse(localStorage.getItem("dee_recent_viewed") || "[]");
  const recentlyViewed = products
    .filter(p => p.status === "published" && recentIds.includes(p.id) && p.id !== product.id)
    .slice(0, 4);

  // Social Sharing mock
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href
      }).then(() => addToast("Shared successfully", "success"))
        .catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Link copied to clipboard!", "success");
    }
  };

  return (
    <div id="product-detail-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. Breadcrumbs */}
      <nav className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-2">
        <Link to="/" className="hover:text-amber-800">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-800">Collection</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-amber-800">{product.category}</Link>
        <span>/</span>
        <span className="text-stone-700 truncate">{product.name}</span>
      </nav>

      {/* 2. Main details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
        
        {/* L1: Images Block */}
        <div className="space-y-4">
          
          {/* Main Display Image with Zoom-on-Hover */}
          <div
            className="relative aspect-square glass-card border border-stone-200 rounded-3xl overflow-hidden cursor-crosshair group shadow-md flex items-center justify-center bg-white"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover animate-fadeIn"
              referrerPolicy="no-referrer"
            />
            {/* The zoom container */}
            <div
              className="absolute inset-0 pointer-events-none border border-stone-200 bg-repeat bg-stone-100"
              style={zoomStyle}
            ></div>
          </div>

          {/* Gallery Thumbnails List */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 bg-white ${
                    activeImage === img ? "border-amber-800 ring-2 ring-amber-500/30" : "border-stone-200 hover:border-stone-400"
                  } transition-all`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* R1: Content details Block */}
        <div className="space-y-6">
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-[10px] uppercase tracking-wider font-bold rounded-full">
              {product.category}
            </span>
            {product.featured && (
              <span className="px-3 py-1 bg-amber-800 text-white text-[10px] uppercase tracking-wider font-bold rounded-full">
                Signature Collection
              </span>
            )}
            {product.availableStock <= 0 && (
              <span className="px-3 py-1 bg-stone-100 text-stone-500 border border-stone-200 text-[10px] uppercase tracking-wider font-bold rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs text-stone-500 font-mono">SKU: {product.sku}</p>
          </div>

          {/* Price Tag & Discount calculations */}
          <div className="flex items-baseline gap-3.5 py-4 border-y border-stone-200">
            {hasDiscount ? (
              <>
                <span className="font-sans text-3xl font-extrabold text-stone-900">
                  ₹{Number(product.discountPrice).toLocaleString()}
                </span>
                <span className="font-sans text-lg text-stone-400 line-through">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-md">
                  {discountPercent}% OFF
                </span>
              </>
            ) : (
              <span className="font-sans text-3xl font-extrabold text-stone-900">
                ₹{Number(product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Brief Description */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-amber-850 font-sans">At a Glance</h3>
            <p className="text-sm text-stone-700 leading-relaxed font-sans">
              {product.shortDescription || "No short outline provided."}
            </p>
          </div>

          {/* Call to action panel */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            
            {/* Purchase CTA */}
            <button
              onClick={handleBuyOnWhatsApp}
              disabled={product.availableStock <= 0}
              className="flex-1 px-8 py-4 bg-amber-800 hover:bg-amber-900 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2.5 shadow-lg"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Buy on WhatsApp</span>
            </button>

            {/* Wishlist Toggle Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`px-6 py-4 rounded-full border transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                isSaved
                  ? "bg-amber-50 text-amber-900 border-amber-300"
                  : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
              }`}
            >
              <Heart className={`w-4.5 h-4.5 ${isSaved ? "fill-current text-rose-600" : ""}`} />
              <span>{isSaved ? "Saved to Wishlist" : "Save to Wishlist"}</span>
            </button>

            {/* Social Share Button */}
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full border border-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center shrink-0 hover:bg-stone-50 transition-colors"
              title="Share Design"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Artisan policies list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-800" />
              <span>Safe Insured Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-800" />
              <span>100% Customized Drafts</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-800" />
              <span>7-10 Days Delivery</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Deep Specifications, Materials & Policies */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-stone-200">
        
        {/* Full narrative */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-serif text-xl font-bold text-stone-900">The Story & Craft Process</h3>
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line font-sans">
            {product.fullDescription || "This exquisite design is fully handcrafted in our Dr.Decors artisan studio. It utilizes standard hand tools and highly specialized material treatment techniques. We prioritize durability and safety across our product lines, ensuring each piece is ready for display in any curated room."}
          </p>
        </div>

        {/* Specifications list */}
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-stone-200 bg-white">
          <h4 className="font-serif text-lg font-bold text-stone-900">Technical Specifications</h4>
          <dl className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-stone-500 font-medium">Material</dt>
              <dd className="text-stone-800 font-semibold text-right">{product.materialsUsed && product.materialsUsed.length ? product.materialsUsed.join(", ") : "Premium Custom Blend"}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-stone-500 font-medium">Dimensions</dt>
              <dd className="text-stone-800 font-semibold text-right">{product.dimensions}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-stone-500 font-medium">Weight</dt>
              <dd className="text-stone-800 font-semibold text-right">{product.weight}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-stone-500 font-medium">Style</dt>
              <dd className="text-stone-800 font-semibold text-right">{product.style}</dd>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-100">
              <dt className="text-stone-500 font-medium">Color Palette</dt>
              <dd className="text-stone-800 font-semibold text-right">{product.color}</dd>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2">
                <dt className="text-stone-500 font-medium">Tags</dt>
                <dd className="flex flex-wrap gap-1">
                  {product.tags.map((t, idx) => (
                    <span key={idx} className="bg-stone-50 text-stone-600 border border-stone-200 px-2 py-0.5 rounded text-[9px] font-medium font-mono">
                      #{t}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

      </section>

      {/* 4. Shipping & Return Policies section */}
      <section className="glass-card border border-stone-200 bg-white rounded-3xl p-8 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 text-sm text-stone-700 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-stone-900">Custom Work & Draft Approvals</h4>
            <p>
              Since each Dr.Decors creation is individually made to order, you can specify custom color variations and size shifts during our WhatsApp chat. For high-fidelity items (such as resin clocks or string arts), we will share a video draft of your cure/finish for review before bubble-wrapping it for courier transport.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-stone-900">Returns & Replacement Policy</h4>
            <p>
              Due to the personalized nature of our customized inventory, we do not support general cash refunds. However, in the rare event of damage during transit, we provide 100% free artisan repair or full replacement. Simply share an unboxing video of your courier crate within 24 hours of receipt.
            </p>
          </div>
        </div>
      </section>

      {/* 5. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div className="flex justify-between items-baseline">
            <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Related Handcrafted Pieces</h2>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-xs font-bold text-amber-800 hover:text-amber-900 uppercase tracking-wider">
              Explore {product.category}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 6. RECENTLY VIEWED PRODUCTS */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-stone-200">
          <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Recently Viewed Designs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
