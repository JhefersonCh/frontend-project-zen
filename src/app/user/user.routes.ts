import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    children: [
        {
          path: 'profile',
          loadComponent: () =>
            import('./pages/profile/profile.component').then((m) => m.ProfileComponent)
        },
        {
          path: 'settings',
          loadComponent: () =>
            import('./pages/settings/settings.component').then((m) => m.SettingsComponent)
        }
    ]
  }
];