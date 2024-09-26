import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { RecoverPasswordComponent } from './auth/pages/recover-password/recover-password.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { RegisterComponent } from './auth/pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', // Redirigir a 'home' por defecto
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () =>
          import('./public/pages/home/home.component').then(
            (m) => m.HomeComponent
          )
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.routes').then((m) => m.authRoutes)
      },
      {
        path: 'test',
        loadComponent: () =>
          import('./public/pages/test/test.component').then(
            (m) => m.TestComponent
          )
      }
    ]
  },
  {
    path: 'auth/login',
    component: LoginComponent // Componente de login (standalone)
  },
  {
    path: 'auth/register',
    component: RegisterComponent // Componente de registro (standalone)
  },
  {
    path: 'auth/recover-password',
    component: RecoverPasswordComponent // Componente de recuperar contraseña (standalone)
  },
  {
    path: '**',
    redirectTo: 'home' // Redirigir cualquier ruta no encontrada a 'home'
  }
];
