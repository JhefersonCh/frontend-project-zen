import { Routes } from '@angular/router';

// Importaciones estáticas de los componentes
import { ManageUserComponent } from './users/pages/manage-users/manage-users.component';
import { SeeUsersComponent } from './users/pages/see-users/see-users.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ProjectsComponent } from './pages/projects/projects.component';

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
            component: ManageUserComponent // Carga estática
          },
          {
            path: 'list',
            component: SeeUsersComponent // Carga estática
          },
          {
            path: ':id/edit',
            component: ManageUserComponent // Carga estática
          }
        ]
      },
      {
        path: 'panel',
        children: [
          {
            path: '',
            component: AdminPanelComponent // Carga estática
          }
        ]
      },
      {
        path: 'tasks',
        component: TasksComponent // Carga estática
      },
      {
        path: 'projects',
        component: ProjectsComponent // Carga estática
      }
    ]
  }
];
