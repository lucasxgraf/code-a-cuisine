export interface Ingredient {
  id: string;
  name: string;
  amount: number | string;
  unit: string;
}

export interface SpoonacularIngredient {
  name: string;
  image: string;
}

export interface SelectionOption {
  label: string;
  sub?: string;
}

export interface RecipePreferences {
  portions: number;
  people: number;
  cookingTime: string;
  cuisine: string;
  diet: string;
}