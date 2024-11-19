import { Routes } from '@angular/router';

export const organizationalRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
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
      },
      {
        path: 'panel',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/admin-panel/admin-panel.component').then(
                (m) => m.AdminPanelComponent
              )
          }
        ]
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks/tasks.component').then((m) => m.TasksComponent)
      }
    ]
  }
];
