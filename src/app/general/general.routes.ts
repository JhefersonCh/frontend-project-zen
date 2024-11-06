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
            children: [
              {
                path: '',
                loadComponent: () =>
                  import(
                    './pages/project-detail/project-detail.component'
                  ).then((m) => m.ProjectDetailComponent)
              },
              {
                path: 'members',
                loadComponent: () =>
                  import(
                    './pages/project-members/project-members.component'
                  ).then((m) => m.ProjectMembersComponent)
              }
            ]
          }
        ]
      },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/tasks/tasks.component').then(
                (m) => m.TasksComponent
              )
          }
        ]
      }
    ]
  }
];
