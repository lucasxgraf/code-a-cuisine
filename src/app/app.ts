import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChefsLabelComponent } from "./shared/ui/chefs-label/chefs-label.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChefsLabelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('code-a-cuisine');
}