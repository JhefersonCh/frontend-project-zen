import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { authGuard } from './shared/guards/auth.guard';
import { isLoggedGuard } from './shared/guards/isLogged.guard';
import { publicRoutes } from './public/public.routes';
import { authRoutes } from './auth/auth.routes';
import { profileRoutes } from './profile/profile.routes';
import { generalRoutes } from './general/general.routes';
import { organizationalRoutes } from './organizational/organizational.routes';
import { ChangePasswordComponent } from './auth/pages/change-password/change-password.component';

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
        children: publicRoutes
      },
      {
        path: 'auth',
        canActivate: [isLoggedGuard],
        children: authRoutes
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        children: profileRoutes
      },
      {
        path: 'general',
        canActivate: [authGuard],
        children: generalRoutes
      },
      {
        path: 'organizational',
        canActivate: [authGuard],
        children: organizationalRoutes
      }
    ]
  },
  {
    path: 'auth/:userId/change-password',
    component: ChangePasswordComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
