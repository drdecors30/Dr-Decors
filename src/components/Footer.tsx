import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.js";
import { Send, Phone, MapPin, Mail, Instagram, Facebook } from "lucide-react";

export const Footer: React.FC = () => {
  const { settings, addToast } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        addToast("Thank you for subscribing to our newsletter!", "success");
        setEmail("");
      } else {
        addToast("Failed to subscribe. Please try again.", "error");
      }
    } catch (err) {
      addToast("Failed to subscribe.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="app-footer" className="bg-stone-100/90 backdrop-blur-md border-t border-stone-200/50 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* About Column */}
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              {settings.websiteName}
            </span>
            <p className="text-stone-500 text-sm leading-relaxed">
              Luxurious handcrafted masterpieces curated to transform your living spaces. Every decor item is customized to bring your distinct imagination to life.
            </p>
            <div className="flex gap-4 pt-2">
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-amber-800 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-stone-500 hover:text-amber-800 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="text-stone-900 text-sm font-semibold tracking-wider uppercase mb-6">Explore Collections</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/shop?category=Paintings" className="hover:text-amber-800 transition-colors text-stone-500">Paintings</Link>
              </li>
              <li>
                <Link to="/shop?category=Wall Clocks" className="hover:text-amber-800 transition-colors text-stone-500">Resin Clocks</Link>
              </li>
              <li>
                <Link to="/shop?category=Resin Art" className="hover:text-amber-800 transition-colors text-stone-500">Resin Coasters</Link>
              </li>
              <li>
                <Link to="/shop?category=Custom Gifts" className="hover:text-amber-800 transition-colors text-stone-500">Custom Gifts</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links / Contact info */}
          <div>
            <h4 className="text-stone-900 text-sm font-semibold tracking-wider uppercase mb-6">Artisan Workshop</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
                <span>{settings.businessAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                <a href={`https://wa.me/${settings.whatsAppNumber.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-amber-800">
                  {settings.whatsAppNumber}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-amber-800">
                  {settings.contactEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h4 className="text-stone-900 text-sm font-semibold tracking-wider uppercase mb-6">Stay Inspired</h4>
            <p className="text-stone-500 text-sm leading-relaxed">
              Subscribe to receive exclusive launches, custom design showcases, and handcrafted care guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-stone-200 placeholder-stone-400 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 w-full text-stone-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-700 hover:bg-amber-800 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-stone-200 mt-16 pt-8 text-center text-xs text-stone-400 flex flex-col sm:flex-row justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.websiteName}. Handmade with love. All Rights Reserved.</p>
          <div className="flex justify-center gap-6">
            <Link to="/about" className="hover:text-stone-600">About Artisan</Link>
            <Link to="/contact" className="hover:text-stone-600">Contact</Link>
            <Link to="/shop" className="hover:text-stone-600">Collections</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
