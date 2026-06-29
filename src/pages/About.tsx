import React from "react";
import { Sparkles, Heart, HelpCircle, Hammer, Eye, Compass } from "lucide-react";
import { motion } from "motion/react";

export const About: React.FC = () => {
  return (
    <div id="about-brand-container" className="space-y-20 pb-20">
      
      {/* 1. Header Hero block */}
      <section className="relative bg-[#0c0c0c]/40 backdrop-blur-md text-stone-50 py-24 sm:py-32 overflow-hidden text-center border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">Our Origin Story</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-stone-100">The Artisan Spirit</h1>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-sans">
            Exploring organic lacing, fluid resin pigments, complex thread alignments, and premium solid teakwoods to co-create distinct living room decors.
          </p>
        </div>
      </section>

      {/* 2. Brand Mission, Vision, Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Mission card */}
        <div className="p-8 glass-card border border-stone-200 rounded-2xl space-y-4 shadow-lg backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Our Mission</h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            To rescue modern spaces from standardized industrial replicas. We design custom artistic home accents that tell a deeply personal human story.
          </p>
        </div>

        {/* Vision card */}
        <div className="p-8 glass-card border border-stone-200 rounded-2xl space-y-4 shadow-lg backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Our Vision</h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            To become a premium custom boutique where collectors and home-curators can direct-message design artisans to co-create one-of-a-kind treasures.
          </p>
        </div>

        {/* Craftsmanship card */}
        <div className="p-8 glass-card border border-stone-200 rounded-2xl space-y-4 shadow-lg backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <Hammer className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Our Craftsmanship</h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Every paint drop, resin layer, string wrap, and frame cut is processed entirely by hands inside our clean Jaipur boutique workshops.
          </p>
        </div>

      </section>

      {/* 3. Deep Brand Story Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-widest block">How it Began</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              Crafting With Deep Intention
            </h2>
            <div className="space-y-4 text-stone-700 text-sm leading-relaxed font-sans">
              <p>
                Dr.Decors was born out of a desire to create artistic products that feel warm, textured, and alive. Founded in Jaipur, India, we started as a small local experiment to create resin wave clocks. In our early days, curing epoxy in humid seasons was a massive challenge, but the results were breathtaking.
              </p>
              <p>
                As our passion grew, we integrated master craftsmen skilled in traditional canvas work, intricate pop light assemblies, and string art layouts. Today, we handle a diverse, boutique catalog, but our philosophy remains exact: we do not start carving or pouring resin until we receive your final WhatsApp draft instructions.
              </p>
              <p>
                Your home is your sanctuary. Each room deserves customized focus rather than mass-produced retail catalog items. We invite you to browse our collections, select a concept, and join our artisan dashboard on WhatsApp to customize it uniquely for your family.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-stone-100 border border-stone-200 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400" alt="Resin curing" className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-stone-200 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400" alt="Sanded wood circles" className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-stone-200 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400" alt="Thread wrap art details" className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-stone-100 border border-stone-200 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400" alt="Completed wall hanging showcase" className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Why Handmade Matters Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card py-20 border border-stone-200 rounded-3xl text-center max-w-4xl mx-auto space-y-6 px-6 sm:px-12 backdrop-blur-xl">
          <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-800 mx-auto">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">Why Handmade Matters</h2>
          <p className="text-stone-700 text-sm leading-relaxed font-sans max-w-2xl mx-auto">
            Unlike sterile machines printing thousands of identical plastic circles, a human hand pouring liquid resin infuses natural lacing and organic cells that cannot be mathematically replicated. There is a soulful depth to manual lacing, small wood grain shifts, and textured thread knots. When you purchase a Dr.Decors creation, you are acquiring an hour-long segment of an artisan's dedicated life, careful breath, and creative focus.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6 text-stone-500 text-xs uppercase tracking-widest font-semibold">
            <span>● Individual focus</span>
            <span>● Zero machines</span>
            <span>● Sustainable woods</span>
            <span>● Enduring joy</span>
          </div>
        </div>
      </section>

    </div>
  );
};
