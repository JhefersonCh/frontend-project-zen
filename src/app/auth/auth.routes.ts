import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.component').then((m) => m.RegisterComponent)
      },
      {
        path: 'recover-password',
        loadComponent: () =>
          import('./pages/recover-password/recover-password.component').then((m) => m.RecoverPasswordComponent)
      }
    ]
  }
];
