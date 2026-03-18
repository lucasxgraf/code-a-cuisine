import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TagComponent } from "../../shared/ui/tag/tag.component";
import { ChefsLabelComponent } from "../../shared/ui/chefs-label/chefs-label.component";
import { IngredientListItemComponent } from "../../shared/ui/ingredient-list-item/ingredient-list-item.component";
import { ActivatedRoute } from '@angular/router';
import { RecipeGeneratorService } from '../../core/services/recipe-generator.service';
import { HeartButtonComponent } from "../../shared/ui/heart-button/heart-button.component";
import { ButtonComponent } from "../../shared/ui/button/button.component";

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [TagComponent, ChefsLabelComponent, IngredientListItemComponent, HeartButtonComponent, ButtonComponent],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent {
  private route = inject(ActivatedRoute);
  protected generatorService = inject(RecipeGeneratorService);

  // protected recipeId = signal(this.route.snapshot.paramMap.get('id'));

  isLiked = signal(false);

  private readonly baseRecipe = signal({
    title: 'Pasta with spinach and cherry tomatoes',
    basePortions: 2,
    baseChefs: 2,
    likes: 10,
    time: '20min',
    nutrition: { kcal: 630, protein: '18g', fat: '24g', carbs: '58g' },
    tags: ['Vegetarian', 'Quick'],
    ingredients: {
      user: [
        { amount: 80, unit: 'g', name: 'Pasta noodles' },
        { amount: 100, unit: 'g', name: 'Baby spinach' },
        { amount: 150, unit: 'g', name: 'Cherry tomatoes' },
        { amount: 1, unit: 'pc', name: 'Egg' }
      ],
      extra: [
        { amount: 40, unit: 'g', name: 'Parmesan cheese' },
        { amount: 30, unit: 'ml', name: 'Olive oil' },
        { amount: 0, unit: '', name: 'Herbs (dry basil, oregano, garlic)' }
      ]
    },
    steps: [
      { id: 1, title: 'Cook the pasta', chef: 1, text: 'Cook your noodles in boiling, salted water, until the pasta is al dente. Drain the pasta and reserve some of the pasta water.' },
      { id: 2, title: 'Make the sauce', chef: 2, text: 'While the pasta is cooking, heat olive oil in a pan over medium heat. Add the garlic, and sauté until it starts to turn golden. Add the tomatoes, oregano, salt, and pepper, and cook for 3-4 minutes.' },
      { id: 3, title: 'Finish the pasta', chef: 1, text: 'Add the noodles to the sauce, then add pasta water until the sauce is the right consistency. Simmer for 1 minute, then add the spinach, basil, chili flakes, and parmesan.' },
      { id: 4, title: 'Final touch', chef: 2, text: 'Lower the heat to low, stir until mixed, and remove from the heat. Season to taste, top with parmesan cheese, and enjoy.' }
    ]
  });
protected recipe = computed(() => {
    const data = this.baseRecipe();
    const selectedPortions = this.generatorService.preferences().portions;
    const factor = selectedPortions / data.basePortions;

    const scaleIngredients = (list: any[]) => list.map(ing => ({
      ...ing,
      amount: ing.amount > 0 ? (ing.amount * factor).toFixed(0) : ing.amount
    }));

    return {
      ...data,
      currentPortions: selectedPortions,
      ingredients: {
        user: scaleIngredients(data.ingredients.user),
        extra: scaleIngredients(data.ingredients.extra)
      }
    };
  });

  toggleLike(): void {
    this.isLiked.update(v => !v);
  }
}
