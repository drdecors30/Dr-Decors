import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types.js";
import { Heart, ArrowRight, Star } from "lucide-react";
import { useApp } from "../context/AppContext.js";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  // Price calculations
  const displayPrice = product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount && product.discountPercentage 
    ? product.discountPercentage 
    : hasDiscount 
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100) 
    : 0;

  return (
    <div className="group relative glass-card border border-stone-200 bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:border-stone-300 transition-all duration-300 flex flex-col h-full">
      
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-stone-50 border-b border-stone-200">
        <img
          src={product.primaryImage || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center border border-white/10 text-stone-300 hover:text-rose-400 transition-colors"
        >
          <Heart className={`w-4.5 h-4.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Tags Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.newArrival && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-stone-900 text-white rounded-md shadow-sm">
              New Arrival
            </span>
          )}
          {product.bestSeller && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-amber-600 text-white rounded-md shadow-sm">
              Best Seller
            </span>
          )}
          {product.trending && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-rose-600 text-white rounded-md shadow-sm">
              Trending
            </span>
          )}
          {product.availableStock <= 0 && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-stone-500 text-white rounded-md shadow-sm">
              Out of Stock
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-emerald-600 text-white rounded-md shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Info details */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 uppercase tracking-widest font-semibold mb-2">
          <span>{product.category}</span>
          {product.style && <span className="text-stone-500 font-normal">{product.style}</span>}
        </div>

        {/* Title */}
        <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 mb-1.5">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.shortDescription || "No description provided."}
        </p>

        {/* Pricing & Link */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-200">
          <div className="flex items-baseline gap-1.5">
            {hasDiscount ? (
              <>
                <span className="font-sans font-bold text-stone-900">
                  ₹{Number(product.discountPrice).toLocaleString()}
                </span>
                <span className="font-sans text-xs text-stone-500 line-through">
                  ₹{Number(product.price).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-sans font-bold text-stone-900">
                ₹{Number(product.price).toLocaleString()}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 group/btn transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
};
