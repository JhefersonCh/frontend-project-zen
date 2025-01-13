import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';

export const profileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProfileComponent
      },
      // {
      //   path: ':id/settings',
      //   loadComponent: () =>
      //     import('./pages/settings/settings.component').then(
      //       (m) => m.SettingsComponent
      //     )
      // },
      // {
      //   path: ':id/edit',
      //   loadComponent: () =>
      //     import('./pages/edit-user/edit-user.component').then(
      //       (m) => m.EditUserComponent
      //     )
      // },
      {
        path: ':id/user-settings',
        component: UserSettingsComponent
      }
    ]
  }
];
