import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { authGuard } from './shared/guards/auth.guard';

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
        loadChildren: () =>
          import('./auth/auth.routes').then((m) => m.authRoutes)
      },
      {
        path: 'user',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./user/user.routes').then((m) => m.userRoutes)
      }
      // {
      //   path: ''
      // }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
