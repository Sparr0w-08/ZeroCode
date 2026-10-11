export interface Ingredient {
  id: string;
  name: string;
  amount: number | '';
  unit: string;
  isSpice?: boolean;
}

export interface ScaledIngredient {
  id: string;
  name: string;
  originalAmount: number;
  scaledAmount: number;
  conservativeAmount?: number;
  unit: string;
  isSpice?: boolean;
  formula: string;
  fractionDisplay: string;
}

export interface RecipeData {
  id: string;
  dishName: string;
  cuisine: string;
  originalServings: number;
  targetServings: number;
  ingredients: Ingredient[];
  notes?: string;
  timestamp: number;
  isFavorite?: boolean;
}

export interface PresetRecipe {
  id: string;
  name: string;
  tamilName: string;
  region: string;
  defaultOriginalServings: number;
  defaultTargetServings: number;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    isSpice?: boolean;
  }>;
  chefInsight: string;
  tag: string;
}
