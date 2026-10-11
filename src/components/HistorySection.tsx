import React, { useState } from 'react';
import { RecipeData } from '../types';
import { roundToTwo } from '../utils/math';
import { History, Search, Star, Trash2, ArrowUpRight, AlertCircle, Check } from 'lucide-react';

interface HistorySectionProps {
  history: RecipeData[];
  onLoadRecipe: (recipe: RecipeData) => void;
  onDeleteRecipe: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onLoadRecipe,
  onDeleteRecipe,
  onToggleFavorite,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.dishName.toLowerCase().includes(q) ||
      item.cuisine.toLowerCase().includes(q) ||
      item.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
    );
  });

  const handleExecuteClear = () => {
    onClearHistory();
    setIsConfirmingClear(false);
  };

  return (
    <section className="glow-section no-print rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--card-bg)] text-[var(--accent)] shadow-xs">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text)] sm:text-lg">
              Saved Recipe History ({history.length})
            </h2>
            <p className="text-xs text-[var(--muted)]">
              Your scaled recipes are preserved locally for quick kitchen reference
            </p>
          </div>
        </div>

        {/* Search Bar & Clear Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] py-1.5 pl-8 pr-3 text-xs text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--glow)] transition-all"
            />
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-1.5">
              {isConfirmingClear ? (
                <div className="flex items-center gap-1 rounded-xl border border-red-300 bg-red-50 p-1 dark:border-red-900/60 dark:bg-red-950/40 animate-in fade-in duration-200">
                  <span className="flex items-center gap-1 px-1.5 text-[11px] font-bold text-red-700 dark:text-red-300">
                    <AlertCircle className="h-3 w-3" />
                    Clear all?
                  </span>
                  <button
                    type="button"
                    onClick={handleExecuteClear}
                    className="rounded-lg bg-red-600 px-2 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all"
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClear(false)}
                    className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-[11px] font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingClear(true)}
                  className="glow-btn rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] hover:border-red-400 hover:text-red-600 active:scale-95"
                >
                  Clear History
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History Items Grid */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--card-bg)]/60 p-6 text-center text-xs text-[var(--muted)]">
          {searchQuery
            ? `No saved recipes match "${searchQuery}".`
            : 'No recipe history yet. Calculate your first dish above to save it automatically.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHistory.map((item) => {
            const mult = roundToTwo(item.targetServings / item.originalServings);
            const dateStr = new Date(item.timestamp).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            });

            return (
              <div
                key={item.id}
                className="glow-card group flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3.5 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                      {item.cuisine}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(item.id)}
                        className={`p-1 transition-all rounded-md hover:bg-[var(--surface)] ${
                          item.isFavorite
                            ? 'text-amber-500'
                            : 'text-[var(--muted)] opacity-60 hover:opacity-100'
                        }`}
                        title={item.isFavorite ? 'Unfavorite' : 'Favorite'}
                        aria-label="Toggle favorite"
                      >
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRecipe(item.id)}
                        className="p-1 rounded-md text-[var(--muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete from history"
                        aria-label="Delete recipe from history"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-1.5 text-sm sm:text-base lg:text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {item.dishName}
                  </h3>

                  <p className="mt-1 text-xs lg:text-sm text-[var(--muted)]">
                    {item.originalServings} ➔ {item.targetServings} servings ({mult}× scale)
                  </p>

                  <div className="mt-2 text-xs lg:text-sm text-[var(--text-secondary)] line-clamp-1">
                    {item.ingredients.map((i) => i.name).filter(Boolean).join(', ')}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2">
                  <span className="text-xs font-mono text-[var(--muted)]">
                    {dateStr}
                  </span>
                  <button
                    type="button"
                    onClick={() => onLoadRecipe(item)}
                    className="glow-btn flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs lg:text-sm font-bold text-[var(--text)] hover:text-[var(--accent)] active:scale-95"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
