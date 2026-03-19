export interface Ingredient {
  id: string;
  name: string;
  amount: number | string;
  unit: string;
  is_extra: boolean;
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

export interface Cuisine {
  id: string;
  name: string;
  slug: string;
}

export interface Recipe {
  id: string;
  cuisine_id: string;
  title: string;
  description: string | null;
  cooking_time: number;
  base_portions: number;
  base_chefs: number;
  likes: number;
  diet_type: string | null;
  kcal: number | null;
  protein: string | null;
  fat: string | null;
  carbs: string | null;
  created_at: string;
}

export interface RecipeWithCuisine extends Recipe {
  cuisines: {
    slug: string;
    
  } | null;
}

export interface RecipeStep {
  id: string;
  recipe_id: string;
  step_number: number;
  chef_id: number;
  title: string | null;
  description: string;
  duration_min: number;
  is_parallel: boolean;
}

export interface FullRecipe extends Recipe {
  ingredients: Ingredient[];
  recipe_steps: RecipeStep[];
}