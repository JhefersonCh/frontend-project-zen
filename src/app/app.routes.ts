import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { authGuard } from './shared/guards/auth.guard';
import { isLoggedGuard } from './shared/guards/isLogged.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./public/public.routes').then((m) => m.publicRoutes)
      },
      {
        path: 'auth',
        canActivate: [isLoggedGuard],
        loadChildren: () =>
          import('./auth/auth.routes').then((m) => m.authRoutes)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./profile/profile.routes').then((m) => m.profileRoutes)
      },
      {
        path: 'general',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./general/general.routes').then((m) => m.generalRoutes)
      },
      {
        path: 'organizational',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./organizational/organizational.routes').then(
            (m) => m.organizationalRoutes
          )
      }
    ]
  },
  {
    path: 'auth/:userId/change-password',
    loadComponent: () =>
      import('./auth/pages/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      )
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
