import { Routes } from '@angular/router';
import { HeroComponent } from './features/hero/hero.component';
import { GenerateInputUserComponent } from './features/generator/generate-input-user/generate-input-user.component';
import { PreferencesComponent } from './features/generator/preferences/preferences.component';
import { LoadingComponent } from './features/generator/loading/loading.component';
import { ResultComponent } from './features/generator/result/result.component';
import { RecipeDetailComponent } from './features/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HeroComponent, 
    data: {
      headerTheme: 'creme-logo',
      backLink: false, 
      hideFooter: true,
    } 
  },
  { 
    path: 'generate-input-user', 
    component: GenerateInputUserComponent, 
    data: {
      headerTheme: 'green-logo',
      backLink: false, 
    } 
  },
  { 
    path: 'generate-preferences', 
    component: PreferencesComponent, 
    data: {
      headerTheme: 'green-logo',
      backLink: true,
      backTarget: '/generate-input-user', 
      backLabel: 'Ingredients'
    } 
  },
  { 
    path: 'generate-loading', 
    component: LoadingComponent, 
    data: {
      headerTheme: 'creme-logo',
      backLink: false,
      hideFooter: true,
    } 
  },
  { 
    path: 'generate-result', 
    component: ResultComponent, 
    data: {
      headerTheme: 'creme-logo',
      backLink: false,
      hideFooter: false,
    } 
  },
  { 
    path: 'recipe-detail', 
    component: RecipeDetailComponent, 
    data: {
      headerTheme: 'green-logo',
      backLink: true,
      hideFooter: false,
      backTarget: '/generate-result',
      backLabel: 'Recipe results'
    } 
  },



  // { 
  //   path: 'cookbook', 
  //   component: CookbookComponent, 
  //   data: { 
  //     backLink: true, 
  //     backTarget: '/home', 
  //     backLabel: 'Back to home' 
  //   } 
  // },
  // { 
  //   path: 'cuisine/:id', 
  //   component: CuisineDetailComponent, 
  //   data: { 
  //     backLink: true, 
  //     backTarget: '/cookbook', 
  //     backLabel: 'Back to Cookbook'
  //   }
  // }
];
