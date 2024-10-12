import { Routes } from '@angular/router';

export const generalRoutes: Routes = [
  {
    path: '',

    children: [
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/projects/projects.component').then(
                (m) => m.ProjectsComponent
              )
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/create-project/create-project.component').then(
                (m) => m.CreateProjectComponent
              )
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/project-detail/project-detail.component').then(
                (m) => m.ProjectDetailComponent
              )
          }
        ]
      }
    ]
  }
];
