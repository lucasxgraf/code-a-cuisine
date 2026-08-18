# Code a Cuisine

![Code a Cuisine Logo](public/assets/logo/logo_green.svg)

Never stand in front of the fridge at a loss again! An AI-powered recipe generator built with **Angular**, using **Supabase** as the backend and an **n8n** workflow to turn whatever ingredients you have at home into ready-to-cook recipes.

**Live:** [code-a-cuisine.lucasgraf.com](https://code-a-cuisine.lucasgraf.com/)

---

## About the Project

Code a Cuisine takes the ingredients you already have, plus a few preferences (portions, cooking time, cuisine, diet), and generates matching recipes automatically. The generation itself doesn't happen inside Angular: the app posts the request to an **n8n webhook**, which drives an AI workflow that creates full recipes — including step-by-step instructions split across multiple "chefs" for parallel cooking — and writes them into Supabase. The app then reads the generated recipe IDs back from Supabase and renders them. Liked recipes are saved locally and organized into a browsable cookbook by cuisine.

---

## Features

- **Ingredient-based recipe generation** — add ingredients (with live autocomplete via the Spoonacular API), set preferences, and get AI-generated recipes
- **n8n-powered generation workflow** — the actual recipe creation runs in an external n8n automation, decoupled from the frontend (workflow exported in `n8n/workflow/CodeACuisine.json`)
- **Multi-chef step instructions** — recipe steps are assigned to different "chefs" and flagged as parallelizable, so multiple steps can be cooked simultaneously
- **Cookbook** — liked recipes are saved (localStorage-based, no login required) and browsable grouped by cuisine
- **Live like counter** — likes are synced to Supabase via a Postgres RPC function and used to surface the most-liked recipes
- **Nutrition info** — calories, protein, fat, and carbs displayed per recipe
- **Portion scaling** — ingredient amounts scale with the selected number of portions/people
- **Legal pages** — legal notice and privacy policy

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Angular 20 (standalone components, signals) | Application framework |
| TypeScript | Language |
| SCSS | Styling |
| [Supabase](https://supabase.com/) | Postgres database (recipes, cuisines, ingredients, steps) + RPC for likes |
| [n8n](https://n8n.io/) | Automation workflow that generates recipes via AI and writes them to Supabase |
| [Spoonacular API](https://spoonacular.com/food-api) | Ingredient search/autocomplete |

---

## Project Structure

```text
src/app/
├── core/
│   ├── models/          # Recipe, Ingredient, Cuisine, RecipePreferences interfaces
│   └── services/        # Supabase client, recipe fetching/likes, recipe generation (n8n), ingredient search
├── features/
│   ├── hero/              # Landing page
│   ├── generator/         # Ingredient input → preferences → loading → results flow
│   ├── recipe-detail/     # Full recipe view (ingredients, steps, nutrition)
│   ├── cookbook/          # Liked recipes, grouped by cuisine
│   ├── cookbook-cuisine-list/
│   └── legal/            # Legal notice, privacy policy
└── shared/ui/             # Button, cuisine-card, recipe-card, heart-button, counter, tag, etc.

n8n/workflow/              # Exported n8n workflow driving the AI recipe generation
supabase/schema.sql        # Database schema (cuisines, recipes, recipe_steps, ingredients, usage_quota)
```

---

## Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/lucasxgraf/code-a-cuisine.git
cd code-a-cuisine
```

```bash
# 2. Install dependencies
npm install
```

```bash
# 3. Provide the required environment variables
export SUPABASE_URL="your-supabase-project-url"
export SUPABASE_KEY="your-supabase-anon-key"
export SPOONACULAR_API_KEY="your-spoonacular-api-key"
export SPOONACULAR_API_URL="https://api.spoonacular.com/food/ingredients/autocomplete"
export N8N_WEBHOOK="your-n8n-webhook-url"
node set-env.js
```

This generates `src/environments/environment.ts` from the environment variables above (the file is not checked into the repo). On Vercel, `set-env.js` runs automatically as part of the `build` script using the project's configured environment variables.

```bash
# 4. Start the local development server
ng serve -o
```

Open `http://localhost:4200` in your browser.

> Requires a Supabase project set up with the schema in `supabase/schema.sql`, and an n8n instance running the workflow from `n8n/workflow/CodeACuisine.json` (with its webhook URL set as `N8N_WEBHOOK`).

---

## Building

```bash
npm run build
```

Runs `set-env.js` to generate the environment file, then builds the production bundle into `dist/`.

---

## Running Tests

```bash
ng test
```

Runs unit tests via [Karma](https://karma-runner.github.io) and Jasmine.

---

## Contact

Lucas Graf — [contact@lucasgraf.com](mailto:contact@lucasgraf.com) — [lucasgraf.com](https://lucasgraf.com)
