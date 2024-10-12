import { Routes } from '@angular/router';

export const generalRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects.component').then(
            (m) => m.ProjectsComponent
          )
      }
    ]
  }
];
