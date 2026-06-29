import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.js";
import { Heart, User, Shield, Menu, X, Search, Sparkles } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, wishlist, settings } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { label: "Home", path: "/" },
    { label: "Collection", path: "/shop" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-200 shadow-sm flex items-center justify-center bg-stone-50">
                <img 
                  src={settings.logo || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200"} 
                  alt="Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
                  {settings.websiteName}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-stone-500 -mt-0.5 font-sans font-semibold">
                  Customized Just for You
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive(link.path)
                    ? "text-amber-800 font-semibold"
                    : "text-stone-600 hover:text-amber-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions panel */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/shop?focus=search" className="text-stone-600 hover:text-amber-800 transition-colors" title="Search">
              <Search className="w-5 h-5" />
            </Link>

            <Link to="/profile" className="relative text-stone-600 hover:text-amber-800 transition-colors" title="Wishlist">
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-amber-600 text-amber-600" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {user?.isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
                  isActive("/admin")
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                } transition-colors`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-amber-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-stone-600" />
              </div>
              <span className="max-w-[100px] truncate">
                {user ? user.name : "Login"}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/shop?focus=search" className="text-stone-600 hover:text-amber-800">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/profile" className="relative text-stone-600 hover:text-amber-800">
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-amber-600 text-amber-600" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-600 hover:text-amber-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white/95 backdrop-blur-xl animate-fadeIn">
          <div className="px-4 py-6 space-y-4 text-stone-900">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium ${
                  isActive(link.path) ? "text-amber-800 font-semibold" : "text-stone-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <hr className="border-stone-200" />

            <div className="space-y-3">
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg"
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-800"
              >
                <User className="w-4 h-4" />
                {user ? `Profile (${user.name})` : "Login / Sign Up"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
