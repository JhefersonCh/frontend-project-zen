import { Routes } from '@angular/router';

// Importaciones estáticas de los componentes
import { ProjectsComponent } from './pages/projects/projects.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { ProjectMembersComponent } from './pages/project-members/project-members.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

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
            component: ProjectsComponent // Carga estática
          },
          {
            path: 'create',
            component: CreateProjectComponent // Carga estática
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                component: ProjectDetailComponent // Carga estática
              },
              {
                path: 'members',
                component: ProjectMembersComponent // Carga estática
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
            component: TasksComponent // Carga estática
          }
        ]
      },
      {
        path: 'reports',
        component: ReportsComponent // Carga estática
      },
      {
        path: 'calendar',
        component: CalendarComponent // Carga estática
      }
    ]
  }
];
