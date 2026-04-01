/**
 * Represents a single ingredient within a recipe.
 */
export interface Ingredient {
  id: string;
  name: string;
  amount: number | string;
  unit: string;
  is_extra: boolean;
  scaledAmount?: string;
}

/**
 * Interface for ingredient data returned by the Spoonacular autocomplete API.
 */
export interface SpoonacularIngredient {
  name: string;
  image: string;
}

/**
 * Represents a selectable option in the UI (e.g., for cooking time or diet).
 */
export interface SelectionOption {
  label: string;
  sub?: string;
}

/**
 * Model representing the user's choices for the recipe generation process.
 */
export interface RecipePreferences {
  portions: number;
  people: number;
  cookingTime: string;
  cuisine: string;
  diet: string;
}

/**
 * Represents a cuisine category stored in the database.
 */
export interface Cuisine {
  id: string;
  name: string;
  slug: string;
}

/**
 * Represents the core master data of a recipe as stored in the database.
 */
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

/**
 * Extended Recipe interface used for lists that require cuisine-specific metadata.
 */
export interface RecipeWithCuisine extends Recipe {
  cuisines: {
    slug: string;
  } | null;
}

/**
 * Represents a single instructional step in the recipe workflow.
 */
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

/**
 * A comprehensive model representing a recipe including all relational data.
 */
export interface FullRecipe extends Recipe {
  ingredients: Ingredient[];
  recipe_steps: RecipeStep[];
}