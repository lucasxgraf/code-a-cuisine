import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IngredientListItemComponent } from "./shared/ui/ingredient-list-item/ingredient-list-item.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IngredientListItemComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('code-a-cuisine');
}