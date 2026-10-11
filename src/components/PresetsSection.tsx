import React, { useState } from 'react';
import { PresetRecipe } from '../types';
import { RECIPE_PRESETS } from '../presets';
import { Utensils, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface PresetsSectionProps {
  activePresetId?: string;
  onSelectPreset: (preset: PresetRecipe) => void;
}

export const PresetsSection: React.FC<PresetsSectionProps> = ({
  activePresetId,
  onSelectPreset,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tamil' | 'regional'>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const filteredPresets = RECIPE_PRESETS.filter((p) => {
    if (selectedFilter === 'tamil') return p.region === 'Tamil Nadu';
    if (selectedFilter === 'regional') return p.region !== 'Tamil Nadu';
    return true;
  });

  // Display top 4 when collapsed, or all when expanded
  const displayedPresets = isExpanded ? filteredPresets : filteredPresets.slice(0, 4);

  return (
    <section className="glow-section no-print rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-sm transition-all sm:p-5">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--card-bg)] text-[var(--accent)] shadow-xs">
            <Utensils className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[var(--text)] sm:text-base">
                Authentic Regional Presets
              </h2>
              <span className="hidden rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-[var(--accent)] sm:inline-block">
                Tamil Nadu &amp; Regional
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Quickly load traditional measurement ratios into the scaler
            </p>
          </div>
        </div>

        {/* Filter controls & Expand Toggle */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
          <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-1 text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`glow-pill rounded-lg px-2.5 py-1 font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              All ({RECIPE_PRESETS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('tamil')}
              className={`glow-pill rounded-lg px-2.5 py-1 font-bold transition-all ${
                selectedFilter === 'tamil'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Tamil Nadu
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('regional')}
              className={`glow-pill rounded-lg px-2.5 py-1 font-bold transition-all ${
                selectedFilter === 'regional'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              Other
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="glow-btn flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1.5 text-xs font-bold text-[var(--text)] hover:text-[var(--accent)] transition-all"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Less' : `All (${filteredPresets.length})`}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Preset Cards Grid with Hover Glow */}
      <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {displayedPresets.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`glow-card group flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? 'border-[var(--accent)] bg-[var(--accent-light)] shadow-[0_0_18px_var(--glow)] ring-1.5 ring-[var(--accent)]'
                  : 'border-[var(--border-subtle)] bg-[var(--card-bg)] hover:border-[var(--accent)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] lg:text-xs font-extrabold uppercase tracking-wider text-[var(--accent)]">
                  <span>{preset.tag}</span>
                  {isSelected ? (
                    <span className="flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] lg:text-xs font-bold text-[var(--accent)]">
                      <Check className="h-3.5 w-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] lg:text-xs">
                      Load ➔
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors sm:text-base lg:text-lg">
                  {preset.name}
                </h3>
                <p className="font-serif text-[11px] lg:text-xs text-[var(--muted)] opacity-85">
                  {preset.tamilName}
                </p>
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-1.5 text-xs lg:text-sm text-[var(--muted)]">
                <span className="font-semibold text-[var(--text-secondary)]">
                  {preset.defaultOriginalServings} → {preset.defaultTargetServings} Servings
                </span>
                <span className="font-mono text-xs text-[var(--muted)]">
                  {preset.ingredients.length} items
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
