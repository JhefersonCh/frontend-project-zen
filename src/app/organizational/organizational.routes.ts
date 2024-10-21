import { Routes } from '@angular/router';

export const organizationalRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        children: [
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/manage-users/manage-users.component').then(
                (m) => m.ManageUserComponent
              )
          }
        ]
      }
    ]
  }
];
