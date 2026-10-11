import React, { useState, useEffect, useRef } from 'react';
import { RecipeData, ScaledIngredient } from '../types';
import { renderRecipeToCanvas, exportRecipeToPng, PngThemeOption } from '../utils/exportPng';
import { roundToTwo } from '../utils/math';
import { Download, X, Palette, Leaf, Image as ImageIcon } from 'lucide-react';

interface PngExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeData | null;
  scaledIngredients: ScaledIngredient[];
  chefInsight?: string;
  isDarkMode: boolean;
}

export const PngExportModal: React.FC<PngExportModalProps> = ({
  isOpen,
  onClose,
  recipe,
  scaledIngredients,
  chefInsight,
  isDarkMode,
}) => {
  const [themeMode, setThemeMode] = useState<PngThemeOption>('theme');
  const [isDownloading, setIsDownloading] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const effectiveTheme: 'dark' | 'light' | 'eco' =
    themeMode === 'theme' ? (isDarkMode ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    if (!isOpen || !recipe) return;

    const canvas = renderRecipeToCanvas({
      dishName: recipe.dishName,
      region: recipe.cuisine,
      originalServings: recipe.originalServings,
      targetServings: recipe.targetServings,
      ingredients: scaledIngredients,
      chefInsight,
      themeMode: effectiveTheme,
    });

    if (canvas && containerRef.current) {
      containerRef.current.innerHTML = '';
      canvas.style.maxWidth = '100%';
      canvas.style.height = 'auto';
      canvas.style.borderRadius = '12px';
      canvas.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
      containerRef.current.appendChild(canvas);
      previewCanvasRef.current = canvas;
    }
  }, [isOpen, recipe, scaledIngredients, chefInsight, effectiveTheme]);

  if (!isOpen || !recipe) return null;

  const multiplier = roundToTwo(recipe.targetServings / recipe.originalServings);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await exportRecipeToPng({
        dishName: recipe.dishName,
        region: recipe.cuisine,
        originalServings: recipe.originalServings,
        targetServings: recipe.targetServings,
        ingredients: scaledIngredients,
        chefInsight,
        themeMode: effectiveTheme,
      });
      onClose();
    } catch (e) {
      console.error('Failed to export PNG', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6 no-print">
      <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden">
        {/* Modal Header Bar with Theme Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--accent)] shadow-xs">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-[var(--text)] sm:text-base">
                Export Recipe PNG ({multiplier}× Scale)
              </span>
              <p className="text-[11px] text-[var(--muted)]">
                Select output theme &amp; preview before saving
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Theme Style Selector matching PDF Print Sheet */}
            <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 text-xs">
              <button
                type="button"
                onClick={() => setThemeMode('theme')}
                className={`glow-pill flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  themeMode === 'theme'
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
                title="Match current application theme"
              >
                <Palette className="h-3 w-3" />
                <span>Match App ({isDarkMode ? 'Dark' : 'Light'})</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`glow-pill flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-all ${
                  themeMode === 'dark'
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
                title="Force Tandoor Charcoal dark palette"
              >
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`glow-pill flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-all ${
                  themeMode === 'light'
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
                title="Force Sandalwood cream light palette"
              >
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('eco')}
                className={`glow-pill flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  themeMode === 'eco'
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
                title="Clean monochrome high contrast"
              >
                <Leaf className="h-3 w-3" />
                <span>Eco</span>
              </button>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="glow-btn flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:from-amber-500 hover:to-amber-600 active:scale-95 disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="glow-btn flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] active:scale-95"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-[var(--bg)] flex items-center justify-center min-h-[340px]">
          <div ref={containerRef} className="w-full max-w-[680px] flex justify-center" />
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--card-bg)] px-4 py-2.5 text-xs text-[var(--muted)]">
          <span>High-DPI Retina Output (2× pixel density)</span>
          <span className="font-mono text-[11px]">Auto-scaled height: {scaledIngredients.length} ingredients</span>
        </div>
      </div>
    </div>
  );
};
