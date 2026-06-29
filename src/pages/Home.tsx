import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.js";
import { EmptyState } from "../components/EmptyState.js";
import { ProductCard } from "../components/ProductCard.js";
import { Sparkles, ArrowRight, Star, Heart, Shield, RefreshCw, Layers, Send } from "lucide-react";
import { motion } from "motion/react";

export const Home: React.FC = () => {
  const { products, categories, settings, addToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newsLoading, setNewsLoading] = useState(false);

  // Filter products by badges
  const publishedProducts = products.filter(p => p.status === "published");
  const featuredProducts = publishedProducts.filter(p => p.featured).slice(0, 4);
  const newArrivals = publishedProducts.filter(p => p.newArrival).slice(0, 4);
  const popularProducts = [...publishedProducts].sort((a, b) => b.views - a.views).slice(0, 4);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        addToast("Subscribed successfully! Thank you for supporting handcrafted decors.", "success");
        setEmail("");
      } else {
        addToast("Subscription failed.", "error");
      }
    } catch (err) {
      addToast("Subscription failed.", "error");
    } finally {
      setNewsLoading(false);
    }
  };

  const hasNoProducts = publishedProducts.length === 0;

  return (
    <div id="homepage-container" className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative min-h-[85vh] flex items-center bg-[#faf9f6] overflow-hidden border-b border-stone-200/40">
        {/* Ambient background decoration */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-15 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/92 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 text-stone-900">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold tracking-wider uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Artisan Studio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-none text-stone-900"
            >
              Handcrafted Decor <br />
              <span className="text-amber-800 italic font-normal font-serif">Just For You</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-stone-600 text-base sm:text-lg leading-relaxed font-sans max-w-lg"
            >
              Elevate your home with luxury resin art, custom lightings, pops, and canvas art customized to match your individual style. No templates, just pure artisan magic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-amber-700 hover:bg-amber-850 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2 group shadow-lg shadow-amber-900/10"
              >
                <span>Browse Collections</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-transparent border border-stone-300 hover:border-stone-800 text-stone-700 hover:bg-stone-50 font-medium text-sm rounded-full transition-all"
              >
                Request Custom Order
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. MAIN STATE ENGINES */}
      {hasNoProducts ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState type="store" />
        </div>
      ) : (
        <>
          {/* A. FEATURED CATEGORIES */}
          {categories.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-baseline mb-12">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block mb-2">Curated Spaces</span>
                  <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">Featured Categories</h2>
                </div>
                <Link to="/shop" className="text-sm font-semibold text-stone-600 hover:text-amber-800 flex items-center gap-1">
                  <span>View All Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {categories.slice(0, 5).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="group flex flex-col items-center text-center space-y-4"
                  >
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden glass-card border border-stone-200 shadow-sm">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300"}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-stone-950/25 transition-colors"></div>
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-stone-850 group-hover:text-amber-800 transition-colors">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-stone-500 text-xs truncate max-w-[150px] mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* B. NEW ARRIVALS */}
          {newArrivals.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-baseline mb-12">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block mb-2">Fresh Off the Easel</span>
                  <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">New Arrivals</h2>
                </div>
                <Link to="/shop?sort=newest" className="text-sm font-semibold text-stone-600 hover:text-amber-850 flex items-center gap-1">
                  <span>View All New Pieces</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* C. POPULAR TRENDS */}
          {popularProducts.length > 0 && (
            <section className="bg-stone-50 border-y border-stone-200/50 py-20 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-baseline mb-12">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block mb-2">Artisan Favorites</span>
                    <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">Popular Products</h2>
                  </div>
                  <Link to="/shop?sort=popular" className="text-sm font-semibold text-stone-600 hover:text-amber-850 flex items-center gap-1">
                    <span>View More Popular</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {popularProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* 3. WHY CHOOSE US (BENTO STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block mb-2">The Dr.Decors Vibe</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">Why Choose Our Crafts</h2>
          <p className="text-stone-500 text-sm mt-3 leading-relaxed">
            Every piece is made with absolute focus, high-quality non-toxic materials, and tailored explicitly to fit your specific interiors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 glass-card rounded-2xl hover:border-stone-300 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-6 border border-amber-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">100% Customized For You</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              We specialize in custom sizing, colors, and textures. You share your wall photo, we design a match.
            </p>
          </div>

          <div className="p-8 glass-card rounded-2xl hover:border-stone-300 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-6 border border-amber-200">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Museum-Grade Materials</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              We use premium crystal resins, durable pine woods, top-quality canvases, and high-luminosity neon strips.
            </p>
          </div>

          <div className="p-8 glass-card rounded-2xl hover:border-stone-300 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-6 border border-amber-200">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Zero-Hassle Process</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Chat directly with our design artisans on WhatsApp. Approve video drafts before final boxing and shipment.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HANDMADE COLLECTION SPECIAL PROFILE */}
      <section className="bg-[#faf9f6] border-y border-stone-200/50 text-stone-900 py-24 overflow-hidden relative backdrop-blur-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block">Signature Craft</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-stone-900">
                Our Signature Resin & Wave Clocks Collection
              </h2>
              <p className="text-stone-600 text-base leading-relaxed font-sans">
                Our oceans and wave wall clocks are created by layering multiple coats of tinted crystal epoxy resin on custom teakwood circles. It takes 72 hours of precision temperature curing to create the depth, waves, and organic lacing that makes every wall clock completely distinct.
              </p>
              <div className="flex flex-wrap gap-8 py-4">
                <div>
                  <span className="font-serif text-3xl font-bold text-amber-800 block">72h+</span>
                  <span className="text-stone-500 text-xs uppercase tracking-widest">Curing Cycle</span>
                </div>
                <div>
                  <span className="font-serif text-3xl font-bold text-amber-800 block">5 Layers</span>
                  <span className="text-stone-500 text-xs uppercase tracking-widest">Epoxy Depth</span>
                </div>
                <div>
                  <span className="font-serif text-3xl font-bold text-amber-800 block">Unique</span>
                  <span className="text-stone-500 text-xs uppercase tracking-widest">Wave Lacing</span>
                </div>
              </div>
              <Link
                to="/shop?category=Wall%20Clocks"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-950 transition-colors"
              >
                <span>Explore Wave Clocks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-stone-200 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
                alt="Ocean Clock Curing Process"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT BRAND CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-white">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
              alt="Artisan workspace"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block">Artisan Heritage</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              About Dr.Decors
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              We started in a backyard garage with a singular vision: to break away from sterile, mass-manufactured home accessories. Our craft is organic, tactile, and personal. We collaborate directly with clients to co-create paintings, light arts, and customized gifts that speak their stories.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed italic">
              "We believe home accessories should reflect your soul. Your living room shouldn't look like a catalog page; it should feel like an exhibition of your life's journeys."
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-stone-850 hover:text-amber-800 transition-colors group"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section className="bg-stone-50 py-20 border-y border-stone-200/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block mb-2">Artisan Reviews</span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">Voices of Our Patrons</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 glass-card rounded-2xl space-y-4 hover:border-stone-300 transition-all duration-300">
              <div className="flex gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed italic">
                "The customized Ocean Resin wall clock we ordered is the crown jewel of our living room. Under natural evening light, the ocean waves look like they're actively splashing. Fantastic service!"
              </p>
              <div>
                <span className="font-semibold text-stone-900 text-sm block">Aarav Sharma</span>
                <span className="text-stone-500 text-xs">Mumbai, IN</span>
              </div>
            </div>

            <div className="p-8 glass-card rounded-2xl space-y-4 hover:border-stone-300 transition-all duration-300">
              <div className="flex gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed italic">
                "I ordered custom neon sign gifts for my sister's wedding. Dr.Decors adjusted the calligraphy font four times until it was exactly what I had in mind. Incredibly patient team!"
              </p>
              <div>
                <span className="font-semibold text-stone-900 text-sm block">Ritu Patel</span>
                <span className="text-stone-500 text-xs">Delhi, IN</span>
              </div>
            </div>

            <div className="p-8 glass-card rounded-2xl space-y-4 hover:border-stone-300 transition-all duration-300">
              <div className="flex gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed italic">
                "Their Pop Art thread frames are simply mesmerizing. Seeing the thousands of interlacing thread lines up close is mind-boggling. The craftsmanship is flawless."
              </p>
              <div>
                <span className="font-semibold text-stone-900 text-sm block">Kabir Das</span>
                <span className="text-stone-500 text-xs">Bangalore, IN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER SUBSCRIPTION COMPACT SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="glass-card text-stone-900 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-lg border border-stone-200">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 max-w-lg mx-auto space-y-4">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900">Stay Connected With Us</h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Sign up with your email to receive direct notifications when we publish brand-new collections, announce festive customized hampers, or host behind-the-scenes artisan studio live streams.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-3">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-stone-900 placeholder-stone-450 px-5 py-3 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-full border border-stone-200"
              />
              <button
                type="submit"
                disabled={newsLoading}
                className="bg-amber-700 hover:bg-amber-850 text-white px-8 py-3 rounded-full text-sm font-semibold transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};
