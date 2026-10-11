import React from 'react';
import { Ingredient } from '../types';
import { Plus, Trash2, RotateCcw, Flame, Users, Sparkles, ChefHat } from 'lucide-react';

interface RecipeFormProps {
  dishName: string;
  setDishName: (name: string) => void;
  cuisine: string;
  setCuisine: (c: string) => void;
  originalServings: number | '';
  setOriginalServings: (n: number | '') => void;
  targetServings: number | '';
  setTargetServings: (n: number | '') => void;
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  errorMsg: string | null;
  onClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const COMMON_UNITS = [
  'g',
  'kg',
  'ml',
  'L',
  'tbsp',
  'tsp',
  'cup',
  'pieces',
  'pinch',
  'sprigs',
];

export const RecipeForm: React.FC<RecipeFormProps> = ({
  dishName,
  setDishName,
  cuisine,
  setCuisine,
  originalServings,
  setOriginalServings,
  targetServings,
  setTargetServings,
  ingredients,
  setIngredients,
  errorMsg,
  onClear,
  onSubmit,
}) => {
  // Stepper helper
  const handleStepServings = (
    field: 'orig' | 'target',
    delta: number
  ) => {
    if (field === 'orig') {
      const current = typeof originalServings === 'number' ? originalServings : 4;
      const next = Math.max(0.5, Math.round((current + delta) * 10) / 10);
      setOriginalServings(next);
    } else {
      const current = typeof targetServings === 'number' ? targetServings : 4;
      const next = Math.max(0.5, Math.round((current + delta) * 10) / 10);
      setTargetServings(next);
    }
  };

  // Quick multipliers
  const handleApplyMultiplier = (factor: number) => {
    const orig = typeof originalServings === 'number' && originalServings > 0 ? originalServings : 4;
    setOriginalServings(orig);
    setTargetServings(Math.round(orig * factor * 10) / 10);
  };

  // Quick target guest count
  const handleSetTargetCount = (count: number) => {
    setTargetServings(count);
  };

  // Ingredients operations
  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      {
        id: 'ing-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: '',
        amount: '',
        unit: 'g',
        isSpice: false,
      },
    ]);
  };

  const handleUpdateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: any
  ) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleStepAmount = (index: number, delta: number) => {
    setIngredients((prev) => {
      const updated = [...prev];
      const curr = typeof updated[index].amount === 'number' ? updated[index].amount : 0;
      const unit = updated[index].unit.toLowerCase();
      const stepDelta = ['tsp', 'tbsp', 'pinch'].includes(unit) ? (delta > 0 ? 0.5 : -0.5) : delta;
      const next = Math.max(0.01, Math.round((curr + stepDelta) * 100) / 100);
      updated[index] = { ...updated[index], amount: next };
      return updated;
    });
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length <= 1) {
      setIngredients([
        {
          id: 'ing-1',
          name: '',
          amount: '',
          unit: 'g',
          isSpice: false,
        },
      ]);
      return;
    }
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const currentMultiplier =
    typeof originalServings === 'number' && typeof targetServings === 'number' && originalServings > 0
      ? Math.round((targetServings / originalServings) * 10) / 10
      : null;

  return (
    <section className="glow-section rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all sm:p-6 lg:p-7">
      {/* Header */}
      <div className="mb-4 lg:mb-5 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5 lg:pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 lg:h-11 lg:w-11 items-center justify-center rounded-xl bg-[var(--card-bg)] text-[var(--accent)] shadow-xs">
            <ChefHat className="h-5 w-5 lg:h-6 lg:w-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[var(--text)] sm:text-lg lg:text-xl">
              Recipe Inputs
            </h2>
            <p className="text-xs lg:text-sm text-[var(--muted)]">
              Specify base ingredients &amp; target serving scale
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="glow-btn flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs lg:text-sm font-bold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"
        >
          <RotateCcw className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-300 bg-[var(--error-bg)] p-3 text-xs lg:text-sm font-semibold text-[var(--error-text)] dark:border-red-800 animate-in fade-in duration-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 lg:space-y-5">
        {/* Dish Name & Cuisine */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label
              htmlFor="dish-name"
              className="mb-1 block text-xs lg:text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]"
            >
              Dish Name
            </label>
            <input
              id="dish-name"
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="e.g., Chettinad Sambar, Thalappakatti Biryani..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-2.5 lg:py-3 text-sm lg:text-base font-semibold text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--glow)] transition-all"
              required
            />
          </div>
          <div>
            <label
              htmlFor="cuisine-type"
              className="mb-1 block text-xs lg:text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]"
            >
              Cuisine
            </label>
            <select
              id="cuisine-type"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2.5 lg:py-3 text-xs sm:text-sm lg:text-base font-bold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--glow)] transition-all"
            >
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="South Indian">South Indian</option>
              <option value="North Indian">North Indian</option>
              <option value="Hyderabadi">Hyderabadi</option>
              <option value="Kerala">Kerala</option>
              <option value="Andhra / Telangana">Andhra / Telangana</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Fusion / Other">Fusion / Other</option>
            </select>
          </div>
        </div>

        {/* Servings Steppers Side-by-Side */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Original Servings */}
          <div className="glow-card rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 lg:p-4 transition-all hover:border-[var(--border)]">
            <div className="flex items-center justify-between text-xs lg:text-sm font-bold text-[var(--text-secondary)]">
              <span>ORIGINAL YIELD</span>
              <span className="text-[var(--muted)] font-normal">Base Servings</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepServings('orig', -1)}
                className="glow-btn flex h-10 w-11 lg:h-12 lg:w-13 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--stepper-bg)] text-base lg:text-xl font-extrabold text-[var(--stepper-text)] active:scale-95"
                aria-label="Decrease original servings"
              >
                −
              </button>
              <input
                id="servings-makes"
                type="number"
                min="0.1"
                step="any"
                value={originalServings}
                onChange={(e) =>
                  setOriginalServings(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                placeholder="e.g. 4"
                className="h-10 lg:h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-center text-base lg:text-xl font-black text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => handleStepServings('orig', 1)}
                className="glow-btn flex h-10 w-11 lg:h-12 lg:w-13 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--stepper-bg)] text-base lg:text-xl font-extrabold text-[var(--stepper-text)] active:scale-95"
                aria-label="Increase original servings"
              >
                +
              </button>
            </div>
          </div>

          {/* Servings Needed */}
          <div className="glow-card rounded-xl border border-[var(--accent)]/40 bg-[var(--card-bg)] p-3 lg:p-4 ring-1 ring-[var(--accent)]/20 shadow-xs">
            <div className="flex items-center justify-between text-xs lg:text-sm font-bold text-[var(--accent)]">
              <span>TARGET SERVINGS</span>
              {currentMultiplier && (
                <span className="rounded-md bg-amber-500/15 px-2 py-0.5 font-mono text-[11px] lg:text-xs font-bold">
                  {currentMultiplier}× Scale
                </span>
              )}
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepServings('target', -1)}
                className="glow-btn flex h-10 w-11 lg:h-12 lg:w-13 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--stepper-bg)] text-base lg:text-xl font-extrabold text-[var(--stepper-text)] active:scale-95"
                aria-label="Decrease target servings"
              >
                −
              </button>
              <input
                id="servings-needed"
                type="number"
                min="0.1"
                step="any"
                value={targetServings}
                onChange={(e) =>
                  setTargetServings(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                placeholder="e.g. 8"
                className="h-10 lg:h-12 w-full rounded-lg border border-[var(--accent)] bg-[var(--surface)] px-2 text-center text-base lg:text-xl font-black text-[var(--accent)] focus:border-[var(--accent)] focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => handleStepServings('target', 1)}
                className="glow-btn flex h-10 w-11 lg:h-12 lg:w-13 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--stepper-bg)] text-base lg:text-xl font-extrabold text-[var(--stepper-text)] active:scale-95"
                aria-label="Increase target servings"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Clean Scale Multipliers */}
        <div className="glow-card rounded-xl border border-[var(--border-subtle)] bg-[var(--card-subtle)]/50 p-3 lg:p-4">
          <div className="flex items-center justify-between text-xs lg:text-sm font-bold text-[var(--muted)]">
            <span className="flex items-center gap-1.5 text-[var(--accent)]">
              <Sparkles className="h-4 w-4" />
              Quick Scale Multipliers
            </span>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-[var(--muted)]" />
              <span className="font-semibold">Quick Presets</span>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {[
              { label: '0.5× (Half)', val: 0.5 },
              { label: '1×', val: 1 },
              { label: '1.5×', val: 1.5 },
              { label: '2× (Double)', val: 2 },
              { label: '3× (Triple)', val: 3 },
              { label: '4×', val: 4 },
              { label: '5×', val: 5 },
              { label: '10× (Feast)', val: 10 },
            ].map((btn) => (
              <button
                key={btn.val}
                type="button"
                onClick={() => handleApplyMultiplier(btn.val)}
                className={`glow-pill rounded-lg border px-2.5 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm font-bold transition-all active:scale-95 ${
                  currentMultiplier === btn.val
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-xs'
                    : 'border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Quick Guests Count */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-2.5 text-xs lg:text-sm">
            <span className="font-semibold text-[var(--muted)]">Guests:</span>
            {[
              { label: '4 (Family)', cnt: 4 },
              { label: '8 (Dinner)', cnt: 8 },
              { label: '15 (Party)', cnt: 15 },
              { label: '30 (Celebration)', cnt: 30 },
            ].map((g) => (
              <button
                key={g.cnt}
                type="button"
                onClick={() => handleSetTargetCount(g.cnt)}
                className="glow-pill rounded-md border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2.5 py-1 text-xs lg:text-sm font-bold text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients List */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-xs lg:text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Ingredients ({ingredients.length})
            </h3>
            <span className="text-xs lg:text-sm text-[var(--muted)]">
              Use 🌶️ for spice/salt damping
            </span>
          </div>

          <div className="space-y-2.5">
            {ingredients.map((ing, idx) => (
              <div
                key={ing.id || idx}
                className="glow-card group rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 lg:p-3.5 transition-all hover:border-[var(--accent)]"
              >
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-mono text-xs lg:text-sm font-bold text-[var(--muted)] w-6 shrink-0 text-center">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) =>
                        handleUpdateIngredient(idx, 'name', e.target.value)
                      }
                      placeholder={`Ingredient ${idx + 1} (e.g., Toor Dal)`}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 lg:py-2.5 text-xs sm:text-sm lg:text-base font-semibold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Amount with Stepper + Unit + Actions */}
                  <div className="flex items-center justify-end gap-2 shrink-0">
                    {/* Steppers */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStepAmount(idx, -5)}
                        className="glow-btn flex h-9 w-8 lg:h-10 lg:w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--stepper-bg)] text-xs lg:text-base font-bold text-[var(--stepper-text)] active:scale-95"
                        aria-label="Decrease amount"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="0.001"
                        step="any"
                        value={ing.amount}
                        onChange={(e) =>
                          handleUpdateIngredient(
                            idx,
                            'amount',
                            e.target.value === '' ? '' : parseFloat(e.target.value)
                          )
                        }
                        placeholder="Qty"
                        className="h-9 w-18 sm:w-22 lg:h-10 lg:w-26 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-1 text-center text-xs sm:text-sm lg:text-base font-bold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleStepAmount(idx, 5)}
                        className="glow-btn flex h-9 w-8 lg:h-10 lg:w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--stepper-bg)] text-xs lg:text-base font-bold text-[var(--stepper-text)] active:scale-95"
                        aria-label="Increase amount"
                      >
                        +
                      </button>
                    </div>

                    {/* Unit Selector */}
                    <div className="w-20 sm:w-24 lg:w-26">
                      <select
                        value={ing.unit}
                        onChange={(e) =>
                          handleUpdateIngredient(idx, 'unit', e.target.value)
                        }
                        className="h-9 lg:h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs lg:text-sm font-semibold text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                      >
                        {COMMON_UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Spice / Salt flag */}
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateIngredient(idx, 'isSpice', !ing.isSpice)
                      }
                      title={
                        ing.isSpice
                          ? 'Spice/salt category (75% damping applies)'
                          : 'Mark as spice/salt'
                      }
                      className={`glow-btn flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg border text-xs lg:text-sm transition-all ${
                        ing.isSpice
                          ? 'border-amber-500 bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/40'
                          : 'border-[var(--border-subtle)] text-[var(--muted)] opacity-60 hover:opacity-100'
                      }`}
                      aria-label="Toggle spice/salt"
                    >
                      <Flame className="h-4 w-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      title="Remove ingredient"
                      className="glow-btn flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--muted)] hover:border-red-400 hover:text-red-600"
                      aria-label="Remove ingredient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Ingredient Button */}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddIngredient}
              className="glow-btn flex items-center gap-1.5 rounded-xl border border-dashed border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-2 text-xs lg:text-sm font-bold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <Plus className="h-4 w-4 text-[var(--accent)]" />
              <span>Add Ingredient</span>
            </button>
          </div>
        </div>

        {/* Radiant Primary Submit Button */}
        <button
          type="submit"
          className="glow-btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 py-3.5 lg:py-4 text-sm lg:text-base font-black text-white shadow-md hover:from-amber-500 hover:to-amber-700 hover:shadow-[0_0_24px_var(--glow)] active:scale-[0.99] transition-all"
        >
          <span>Calculate Rescaled Amounts</span>
        </button>
      </form>
    </section>
  );
};
