import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Ingredient, ScaledIngredient, RecipeData, PresetRecipe } from './types';
import { RECIPE_PRESETS } from './presets';
import { roundToTwo, formatFraction, calculateSpiceRecommendation } from './utils/math';
import { Header } from './components/Header';
import { PresetsSection } from './components/PresetsSection';
import { RecipeForm } from './components/RecipeForm';
import { RecipeOutput } from './components/RecipeOutput';
import { HistorySection } from './components/HistorySection';
import { ChefTipsSection } from './components/ChefTipsSection';
import { KitchenConversionsSection } from './components/KitchenConversionsSection';
import { PrintSheetModal } from './components/PrintSheetModal';
import { PngExportModal } from './components/PngExportModal';
import { Calculator, ArrowRight, ArrowLeft } from 'lucide-react';

const HISTORY_STORAGE_KEY = 'rasoiscale_saved_history_v2';
const THEME_STORAGE_KEY = 'rasoiscale_theme_is_dark';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync theme with DOM document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode));
    } catch {}
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Form & Recipe State
  const [dishName, setDishName] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('Tamil Nadu');
  const [originalServings, setOriginalServings] = useState<number | ''>('');
  const [targetServings, setTargetServings] = useState<number | ''>('');
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);
  const [chefInsight, setChefInsight] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ingredients list (starts empty by default)
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'ing-1', name: '', amount: '', unit: 'g', isSpice: false },
    { id: 'ing-2', name: '', amount: '', unit: 'g', isSpice: false },
    { id: 'ing-3', name: '', amount: '', unit: 'g', isSpice: false },
  ]);

  // Current calculated recipe state
  const [calculatedRecipe, setCalculatedRecipe] = useState<RecipeData | null>(null);

  // Responsive mobile active view: 'inputs' | 'output'
  const [mobileViewTab, setMobileViewTab] = useState<'inputs' | 'output'>('inputs');

  // History state
  const [history, setHistory] = useState<RecipeData[]>(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync history to storage
  const saveHistory = (newList: RecipeData[]) => {
    setHistory(newList);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  // Print and PNG modal states
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isPngModalOpen, setIsPngModalOpen] = useState<boolean>(false);

  // Load a preset
  const handleSelectPreset = useCallback((preset: PresetRecipe) => {
    setDishName(preset.name);
    setCuisine(preset.region);
    setOriginalServings(preset.defaultOriginalServings);
    setTargetServings(preset.defaultTargetServings);
    setActivePresetId(preset.id);
    setChefInsight(preset.chefInsight);
    setErrorMsg(null);

    const newIngredients: Ingredient[] = preset.ingredients.map((ing, i) => ({
      id: `ing-preset-${i}-${Date.now()}`,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      isSpice: !!ing.isSpice,
    }));
    setIngredients(newIngredients);

    // Automatically calculate record
    const record: RecipeData = {
      id: 'rec-' + Date.now(),
      dishName: preset.name,
      cuisine: preset.region,
      originalServings: preset.defaultOriginalServings,
      targetServings: preset.defaultTargetServings,
      ingredients: newIngredients,
      timestamp: Date.now(),
    };
    setCalculatedRecipe(record);

    // Save in history if not already recent duplicate
    setHistory((prev) => {
      const filtered = prev.filter((p) => p.dishName !== preset.name);
      const updated = [record, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Load random preset
  const handleSelectRandomPreset = () => {
    const randomIndex = Math.floor(Math.random() * RECIPE_PRESETS.length);
    handleSelectPreset(RECIPE_PRESETS[randomIndex]);
  };

  // Clear Form
  const handleClearForm = () => {
    setDishName('');
    setCuisine('Tamil Nadu');
    setOriginalServings(4);
    setTargetServings(8);
    setActivePresetId(undefined);
    setChefInsight(undefined);
    setErrorMsg(null);
    setIngredients([
      { id: 'ing-1', name: '', amount: '', unit: 'g', isSpice: false },
      { id: 'ing-2', name: '', amount: '', unit: 'g', isSpice: false },
      { id: 'ing-3', name: '', amount: '', unit: 'g', isSpice: false },
    ]);
    setCalculatedRecipe(null);
    setMobileViewTab('inputs');
  };

  // Perform Calculation & Save
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const name = dishName.trim();
    if (!name) {
      setErrorMsg('Please enter a dish name.');
      return;
    }

    const orig = typeof originalServings === 'number' ? originalServings : parseFloat(String(originalServings));
    const target = typeof targetServings === 'number' ? targetServings : parseFloat(String(targetServings));

    if (!orig || orig <= 0) {
      setErrorMsg('Original servings must be a positive number greater than 0.');
      return;
    }
    if (!target || target <= 0) {
      setErrorMsg('Target servings must be a positive number greater than 0.');
      return;
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() !== '' && typeof ing.amount === 'number' && ing.amount > 0
    );

    if (validIngredients.length === 0) {
      setErrorMsg('Please enter at least one ingredient with a valid name and positive quantity.');
      return;
    }

    const record: RecipeData = {
      id: 'rec-' + Date.now(),
      dishName: name,
      cuisine,
      originalServings: orig,
      targetServings: target,
      ingredients: validIngredients,
      timestamp: Date.now(),
    };

    setCalculatedRecipe(record);

    // Save to history
    saveHistory([record, ...history.filter((h) => h.id !== record.id)].slice(0, 25));

    // On mobile, switch view tab to output smoothly
    setMobileViewTab('output');
  };

  // Compute Scaled Ingredients in real time
  const scaledIngredients: ScaledIngredient[] = useMemo(() => {
    if (!calculatedRecipe) return [];
    const orig = calculatedRecipe.originalServings;
    const target = calculatedRecipe.targetServings;
    if (!orig || !target || orig <= 0) return [];

    const multiplier = target / orig;

    return calculatedRecipe.ingredients.map((ing) => {
      const originalAmt = typeof ing.amount === 'number' ? ing.amount : 0;
      const scaledAmt = roundToTwo(originalAmt * multiplier);
      const conservativeAmt = ing.isSpice
        ? calculateSpiceRecommendation(originalAmt, multiplier)
        : scaledAmt;

      const formula = `(${roundToTwo(originalAmt)} × ${roundToTwo(target)}) ÷ ${roundToTwo(orig)} = ${scaledAmt} ${ing.unit}`;
      const fractionDisplay = formatFraction(scaledAmt);

      return {
        ...ing,
        originalAmount: originalAmt,
        scaledAmount: scaledAmt,
        conservativeAmount: conservativeAmt,
        unit: ing.unit,
        formula,
        fractionDisplay,
      };
    });
  }, [calculatedRecipe]);

  // Load from History
  const handleLoadFromHistory = (item: RecipeData) => {
    setDishName(item.dishName);
    setCuisine(item.cuisine);
    setOriginalServings(item.originalServings);
    setTargetServings(item.targetServings);
    setIngredients(item.ingredients);
    setCalculatedRecipe(item);
    setActivePresetId(undefined);
    setChefInsight(undefined);
    setMobileViewTab('output');

    // Smooth scroll to top of workbench
    const workbenchEl = document.getElementById('workbench-container');
    if (workbenchEl) {
      workbenchEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    saveHistory(history.filter((h) => h.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    saveHistory(
      history.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h))
    );
  };

  const handleClearHistory = () => {
    saveHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* Top Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onSelectPresetRandom={handleSelectRandomPreset}
      />

      {/* Main Responsive Container */}
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 space-y-6">
        {/* Presets Card */}
        <PresetsSection
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Mobile View Tab Switcher (Visible only on screens < 1024px) */}
        <div className="glow-section lg:hidden no-print flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-1.5 shadow-xs">
          <button
            type="button"
            onClick={() => setMobileViewTab('inputs')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
              mobileViewTab === 'inputs'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>Recipe Inputs</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileViewTab('output')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
              mobileViewTab === 'output'
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            <span>Rescaled Output</span>
            {calculatedRecipe && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white/25 px-1 font-mono text-[10px]">
                {scaledIngredients.length}
              </span>
            )}
          </button>
        </div>

        {/* Responsive 2-Column Workbench (Desktop side-by-side, Mobile/Tablet stacked or tabbed) */}
        <div id="workbench-container" className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Recipe Form */}
          <div
            className={`lg:col-span-6 xl:col-span-7 transition-all ${
              mobileViewTab === 'output' ? 'hidden lg:block' : 'block'
            }`}
          >
            <RecipeForm
              dishName={dishName}
              setDishName={setDishName}
              cuisine={cuisine}
              setCuisine={setCuisine}
              originalServings={originalServings}
              setOriginalServings={setOriginalServings}
              targetServings={targetServings}
              setTargetServings={setTargetServings}
              ingredients={ingredients}
              setIngredients={setIngredients}
              errorMsg={errorMsg}
              onClear={handleClearForm}
              onSubmit={handleCalculate}
            />

            {/* Mobile switch helper button */}
            {calculatedRecipe && (
              <div className="mt-3 lg:hidden text-center">
                <button
                  type="button"
                  onClick={() => setMobileViewTab('output')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline"
                >
                  <span>View calculated output for {calculatedRecipe.dishName}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Rescaled Output */}
          <div
            className={`lg:col-span-6 xl:col-span-5 lg:sticky lg:top-20 transition-all ${
              mobileViewTab === 'inputs' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Mobile back to inputs button */}
            <div className="mb-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileViewTab('inputs')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--text)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to edit recipe inputs</span>
              </button>
            </div>

            <RecipeOutput
              recipe={calculatedRecipe}
              scaledIngredients={scaledIngredients}
              chefInsight={chefInsight}
              isDarkMode={isDarkMode}
              onOpenPrintPreview={() => setIsPrintModalOpen(true)}
              onOpenPngPreview={() => setIsPngModalOpen(true)}
            />
          </div>
        </div>

        {/* Recipe History Card */}
        <HistorySection
          history={history}
          onLoadRecipe={handleLoadFromHistory}
          onDeleteRecipe={handleDeleteHistoryItem}
          onToggleFavorite={handleToggleFavorite}
          onClearHistory={handleClearHistory}
        />

        {/* Tamil Nadu Chef Scaling Secrets */}
        <ChefTipsSection />

        {/* Kitchen Measurement Conversions (ml, tbsp, cups, grains) */}
        <KitchenConversionsSection />

        {/* Footer */}
        <footer className="no-print border-t border-[var(--border-subtle)] py-6 text-center text-xs text-[var(--muted)]">
          <p>
            RasoiScale · Precision Recipe Rescaling Engine for Indian &amp; Tamil Nadu Cuisines
          </p>
          <p className="mt-1 text-[11px] opacity-75">
            Formulas: (Original Quantity × Target Servings) ÷ Original Servings · Damped spice scaling curve
          </p>
        </footer>
      </main>

      {/* Printable Sheet / PDF Preview Modal */}
      <PrintSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        recipe={calculatedRecipe}
        scaledIngredients={scaledIngredients}
        chefInsight={chefInsight}
        isDarkMode={isDarkMode}
      />

      {/* High-Resolution PNG Theme Export Modal */}
      <PngExportModal
        isOpen={isPngModalOpen}
        onClose={() => setIsPngModalOpen(false)}
        recipe={calculatedRecipe}
        scaledIngredients={scaledIngredients}
        chefInsight={chefInsight}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
