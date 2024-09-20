import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () =>
          import('./public/pages/home/home.component').then(
            (m) => m.HomeComponent
          )
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.routes').then((m) => m.authRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
