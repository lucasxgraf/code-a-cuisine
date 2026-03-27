import { Routes } from '@angular/router';
import { HeroComponent } from './features/hero/hero.component';
import { GenerateInputUserComponent } from './features/generator/generate-input-user/generate-input-user.component';
import { PreferencesComponent } from './features/generator/preferences/preferences.component';
import { LoadingComponent } from './features/generator/loading/loading.component';
import { ResultComponent } from './features/generator/result/result.component';
import { RecipeDetailComponent } from './features/recipe-detail/recipe-detail.component';
import { CookbookComponent } from './features/cookbook/cookbook.component';
import { CookbookCuisineListComponent } from './features/cookbook-cuisine-list/cookbook-cuisine-list.component';
import { LegalNoticeComponent } from './features/legal/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './features/legal/privacy-policy/privacy-policy.component';

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
      backLabel: 'Ingredients',
      hideFooter: false,
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
      backTarget: '/generate-result',
      backLabel: 'Recipe results',
      hideFooter: false,
    } 
  },
  { 
    path: 'cookbook', 
    component: CookbookComponent, 
    data: {
      headerTheme: 'green-logo',
      backLink: true,
      backTarget: 'auto',
      backLabel: 'Back',
      hideFooter: false,
    }
  },
  { 
    path: 'cuisine/:id', 
    component: CookbookCuisineListComponent, 
    data: { 
      headerTheme: 'green-logo', 
      backLink: true, 
      backTarget: '/cookbook', 
      backLabel: 'Cookbook',
      hideFooter: false,
    }
  },
  { 
    path: 'recipe/:id', 
    component: RecipeDetailComponent,
    data: { 
      headerTheme: 'green-logo', 
      backLink: true, 
      backTarget: 'auto', 
      backLabel: 'Back' 
    }
  },
  { 
    path: 'legal-notice', 
    component: LegalNoticeComponent,
    data: { 
      headerTheme: 'green-logo', 
      backLink: true, 
      backTarget: 'auto', 
      backLabel: 'Back' 
    }
  },
  { 
    path: 'privacy-policy', 
    component: PrivacyPolicyComponent,
    data: { 
      headerTheme: 'green-logo', 
      backLink: true, 
      backTarget: 'auto', 
      backLabel: 'Back' 
    }
  }
];
