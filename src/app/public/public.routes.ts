import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';

// Importaciones estáticas de los componentes
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { TestComponent } from './pages/test/test.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';

export const publicRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent // Carga estática
      },
      {
        path: 'about-us',
        component: AboutUsComponent // Carga estática
      },
      {
        path: 'test',
        canActivate: [authGuard], // Guardia de autenticación
        component: TestComponent // Carga estática
      },
      {
        path: 'access-denied',
        component: AccessDeniedComponent // Carga estática
      }
    ]
  }
];
