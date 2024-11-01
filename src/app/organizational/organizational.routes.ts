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
              import('./users/pages/manage-users/manage-users.component').then(
                (m) => m.ManageUserComponent
              )
          },
          {
            path: 'list',
            loadComponent: () =>
              import('./users/pages/see-users/see-users.component').then(
                (m) => m.SeeUsersComponent
              )
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./users/pages/manage-users/manage-users.component').then(
                (m) => m.ManageUserComponent
              )
          }
        ]
      }
    ]
  }
];
