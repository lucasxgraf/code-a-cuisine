import { Routes } from '@angular/router';
import { HeroComponent } from './features/hero/hero.component';
import { GenerateInputUserComponent } from './features/generator/generate-input-user/generate-input-user.component';

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
      headerTheme: 'creme-logo',
      backLink: true, 
      backTarget: '/', 
      backLabel: 'Back to home' 
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
