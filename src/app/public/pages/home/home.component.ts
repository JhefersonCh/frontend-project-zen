/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly _authService: AuthService = inject(AuthService);
  userIsLoggedIn: boolean = !!this._authService.getUserLoggedIn();
  testimonials = [
    {
      quote:
        '“ProjectZen ha transformado la manera en que organizo mis proyectos. Ahora mi equipo y yo trabajamos más rápido y mejor organizados.”',
      author: '– Juan Pérez, CEO de Innovatech'
    },
    {
      quote:
        '“Con ProjectZen, la comunicación y la gestión de tareas en mi empresa han mejorado drásticamente. ¡Es una herramienta increíble!”',
      author: '– María González, Gerente de Proyectos'
    },
    {
      quote:
        '“Desde que usamos ProjectZen, nuestra eficiencia ha aumentado y el seguimiento de tareas es mucho más claro.”',
      author: '– Carlos Rodríguez, Jefe de Desarrollo'
    }
  ];

  responsiveOptions: any[] | undefined;
}
