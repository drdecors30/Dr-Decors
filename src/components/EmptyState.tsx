import React from "react";
import { Sparkles, Hammer } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  type?: "store" | "search";
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type = "store", onReset }) => {
  return (
    <div id="empty-state-section" className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white border border-stone-100 rounded-3xl shadow-sm max-w-2xl mx-auto my-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 mb-8 shadow-inner"
      >
        {type === "store" ? (
          <Hammer className="w-10 h-10 animate-pulse" />
        ) : (
          <Sparkles className="w-10 h-10" />
        )}
      </motion.div>

      {type === "store" ? (
        <>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight mb-4">
            No Products Available Yet
          </h2>
          <p className="font-sans italic text-stone-600 text-lg max-w-md leading-relaxed mb-8">
            We're creating beautiful handcrafted pieces. Please visit again soon.
          </p>
          <div className="w-12 h-0.5 bg-amber-600/30 mx-auto"></div>
        </>
      ) : (
        <>
          <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight mb-3">
            No Matching Treasures Found
          </h2>
          <p className="font-sans text-stone-600 max-w-sm leading-relaxed mb-8">
            We couldn't find any handcrafted pieces matching your active filters. Try resetting them or adjusting your search queries.
          </p>
          {onReset && (
            <button
              onClick={onReset}
              className="px-6 py-2.5 bg-stone-900 hover:bg-amber-800 text-stone-50 rounded-full text-sm font-medium transition-all shadow-sm"
            >
              Reset Filters
            </button>
          )}
        </>
      )}
    </div>
  );
};
