import React, { useState } from 'react';
import { ScaledIngredient, RecipeData } from '../types';
import { roundToTwo, formatFraction } from '../utils/math';
import {
  Download,
  Printer,
  Copy,
  Check,
  Flame,
  Info,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface RecipeOutputProps {
  recipe: RecipeData | null;
  scaledIngredients: ScaledIngredient[];
  chefInsight?: string;
  isDarkMode: boolean;
  onOpenPrintPreview: () => void;
  onOpenPngPreview: () => void;
}

export const RecipeOutput: React.FC<RecipeOutputProps> = ({
  recipe,
  scaledIngredients,
  chefInsight,
  isDarkMode,
  onOpenPrintPreview,
  onOpenPngPreview,
}) => {
  const [useFractions, setUseFractions] = useState<boolean>(false);
  const [applySpiceDamping, setApplySpiceDamping] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  if (!recipe || scaledIngredients.length === 0) {
    return (
      <section className="glow-section flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--card-bg)] text-amber-600 shadow-inner">
          <HelpCircle className="h-7 w-7 opacity-75" />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-[var(--text)] sm:text-lg lg:text-xl">
          No Recipe Calculated Yet
        </h3>
        <p className="mt-1 max-w-sm text-xs lg:text-sm text-[var(--muted)]">
          Enter recipe details on the left or click any regional preset to view rescaled quantities with worked-out mathematical formulas.
        </p>
      </section>
    );
  }

  const multiplier = roundToTwo(recipe.targetServings / recipe.originalServings);
  const hasSpices = scaledIngredients.some((i) => i.isSpice);
  const showSpiceNotice = multiplier >= 2.5 && hasSpices;

  // Handle Copy formatted text
  const handleCopyText = async () => {
    const lines = [
      `🍛 ${recipe.dishName} (${recipe.cuisine})`,
      `Yield: ${recipe.originalServings} servings ➔ Rescaled: ${recipe.targetServings} servings (${multiplier}× multiplier)`,
      `\nIngredients:`,
      ...scaledIngredients.map((ing, i) => {
        const amtStr = useFractions
          ? formatFraction(ing.scaledAmount)
          : `${roundToTwo(ing.scaledAmount)}`;
        return `${i + 1}. ${ing.name}: ${amtStr} ${ing.unit} (Formula: (${roundToTwo(ing.originalAmount)} × ${recipe.targetServings}) / ${recipe.originalServings})`;
      }),
    ];

    if (chefInsight) {
      lines.push(`\nChef Scaling Secret: ${chefInsight}`);
    }

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <section className="glow-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all sm:p-6 lg:p-7">
      {/* Header with Title and Export Actions */}
      <div className="mb-4 lg:mb-5 flex flex-col justify-between gap-3 border-b border-[var(--border-subtle)] pb-3.5 lg:pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-[var(--accent)]" />
            <h2 className="text-base font-extrabold text-[var(--text)] sm:text-lg lg:text-xl">
              Worked-Out Output
            </h2>
          </div>
          <p className="text-xs lg:text-sm text-[var(--muted)]">
            Exact mathematical formulas with culinary damping
          </p>
        </div>

        {/* Export Button Toolbar with Hover Glow */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopyText}
            className="glow-btn flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1.5 lg:px-3 lg:py-2 text-xs lg:text-sm font-bold text-[var(--text)]"
            title="Copy recipe text to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[var(--accent)]" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Save PNG button */}
          <button
            type="button"
            onClick={onOpenPngPreview}
            className="glow-btn flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1.5 lg:px-3 lg:py-2 text-xs lg:text-sm font-bold text-[var(--text)]"
            title="Open PNG preview and theme options"
          >
            <Download className="h-4 w-4 text-[var(--accent)]" />
            <span>Save PNG</span>
          </button>

          {/* Print / PDF button */}
          <button
            type="button"
            onClick={onOpenPrintPreview}
            className="glow-btn flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1.5 lg:px-3 lg:py-2 text-xs lg:text-sm font-bold text-[var(--text)]"
            title="Open printable recipe sheet / Save to PDF"
          >
            <Printer className="h-4 w-4 text-[var(--accent)]" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Recipe Header Card */}
      <div className="glow-card mb-4 lg:mb-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3.5 sm:p-4 lg:p-5">
        <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-xs lg:text-sm font-bold text-[var(--accent)]">
                {recipe.cuisine}
              </span>
              <span className="font-mono text-xs lg:text-sm font-bold text-[var(--text-secondary)]">
                {multiplier}× Factor
              </span>
            </div>
            <h3 className="mt-1 text-base font-extrabold text-[var(--text)] sm:text-xl lg:text-2xl">
              {recipe.dishName}
            </h3>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 lg:px-4 lg:py-2.5 text-xs lg:text-sm">
            <span className="text-[var(--muted)]">Servings:</span>
            <span className="font-bold text-[var(--text)]">
              {recipe.originalServings}
            </span>
            <span className="text-[var(--accent)] font-bold">➔</span>
            <span className="font-black text-[var(--accent)] text-sm lg:text-base">
              {recipe.targetServings}
            </span>
          </div>
        </div>

        {/* View Options Toggles */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-2.5 text-xs lg:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--muted)] uppercase">Display:</span>
            <button
              type="button"
              onClick={() => setUseFractions(false)}
              className={`glow-pill rounded-md px-2.5 py-1 text-xs lg:text-sm font-bold transition-all ${
                !useFractions
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Decimals (1.5)
            </button>
            <button
              type="button"
              onClick={() => setUseFractions(true)}
              className={`glow-pill rounded-md px-2.5 py-1 text-xs lg:text-sm font-bold transition-all ${
                useFractions
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Fractions (1 ½)
            </button>
          </div>

          {hasSpices && multiplier >= 2 && (
            <label className="flex cursor-pointer items-center gap-1.5 text-xs lg:text-sm font-bold text-[var(--text)]">
              <input
                type="checkbox"
                checked={applySpiceDamping}
                onChange={(e) => setApplySpiceDamping(e.target.checked)}
                className="h-4 w-4 rounded-sm accent-[var(--accent)]"
              />
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                75% spice damping
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Non-linear Scaling Notice */}
      {showSpiceNotice && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-300/70 bg-amber-500/10 p-3.5 text-xs lg:text-sm text-[var(--text)] dark:border-amber-700/50">
          <Info className="h-5 w-5 shrink-0 text-[var(--accent)] mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-[var(--accent)]">
              Culinary Scaling Rule ({multiplier}× Batch):
            </strong>{' '}
            Spices, salt, and tamarind do not scale linearly. Commercial chefs recommend scaling concentrated spices at 70–80% initially to prevent over-seasoning.
          </div>
        </div>
      )}

      {/* Step-by-Step Ingredient Formula Cards */}
      <div className="space-y-3">
        {scaledIngredients.map((ing, idx) => {
          const effectiveAmount =
            applySpiceDamping && ing.isSpice && multiplier >= 2 && ing.conservativeAmount
              ? ing.conservativeAmount
              : ing.scaledAmount;

          const displayValue = useFractions
            ? formatFraction(effectiveAmount)
            : `${roundToTwo(effectiveAmount)}`;

          return (
            <div
              key={ing.id || idx}
              className="glow-card rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3.5 lg:p-4 transition-all"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs lg:text-sm font-bold text-[var(--muted)]">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="text-sm lg:text-base font-bold text-[var(--text)]">
                    {ing.name}
                  </span>
                  {ing.isSpice && (
                    <span
                      title="Spice / Seasoning category"
                      className="text-sm text-amber-500"
                    >
                      🌶️
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-mono text-base sm:text-lg lg:text-2xl font-black text-[var(--accent)]">
                    {displayValue} {ing.unit}
                  </span>
                  <div className="text-xs text-[var(--muted)]">
                    Original: {roundToTwo(ing.originalAmount)} {ing.unit}
                  </div>
                </div>
              </div>

              {/* Mathematical Equation Box */}
              <div className="mt-2.5 flex flex-col gap-1 rounded-lg bg-[var(--surface)] px-3 py-2 font-mono text-xs lg:text-sm">
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <span>
                    ({roundToTwo(ing.originalAmount)} × {roundToTwo(recipe.targetServings)}) ÷ {roundToTwo(recipe.originalServings)} = {roundToTwo(ing.scaledAmount)} {ing.unit}
                  </span>
                  <span className="text-xs text-[var(--muted)]">linear</span>
                </div>

                {applySpiceDamping && ing.isSpice && multiplier >= 2 && ing.conservativeAmount && (
                  <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-1 text-amber-700 dark:text-amber-400 font-semibold">
                    <span>
                      ★ Chef Recommendation: {roundToTwo(ing.conservativeAmount)} {ing.unit}
                    </span>
                    <span className="text-xs">damped</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chef Insight Footer */}
      {chefInsight && (
        <div className="glow-card mt-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-3.5 lg:p-4">
          <div className="flex items-center gap-1.5 text-xs lg:text-sm font-bold text-[var(--accent)]">
            <Flame className="h-4 w-4" />
            <span>Chef Scaling Secret</span>
          </div>
          <p className="mt-1 text-xs lg:text-sm text-[var(--text-secondary)] leading-relaxed">
            {chefInsight}
          </p>
        </div>
      )}
    </section>
  );
};
