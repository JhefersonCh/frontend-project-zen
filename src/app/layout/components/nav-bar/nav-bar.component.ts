import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  @Input() isLoggedUser: boolean = false;
  @Output() logout: EventEmitter<boolean> = new EventEmitter();
  router = inject(Router);
  isMenuOpen = false;
  optionSelected: string = '';
  module: string[] = [];

  ngOnInit(): void {
    this.module = this.router.url.split('/');

    this.optionSelected = this.module[1];
  }

  /**
   * Alterna el estado del menú de navegación entre abierto y cerrado.
   * Cambia el valor de isMenuOpen.
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Cierra el menú de navegación.
   * Establece isMenuOpen en false.
   */
  closeMenu() {
    this.isMenuOpen = false;
  }

  /**
   * Gestiona la acción del usuario en función de su estado de logueo.
   * Si el usuario no está logueado, lo redirige a la página de inicio de sesión.
   * Si el usuario está logueado, emite un evento de cierre de sesión y lo redirige a la página de inicio.
   */
  manageUser(): void {
    if (!this.isLoggedUser) {
      this.router.navigateByUrl('/auth/login'); // Redirige a la página de inicio de sesión.
    } else {
      this.logout.emit(true); // Emite el evento de cierre de sesión.
      this.router.navigateByUrl('/home'); // Redirige a la página de inicio.
    }
  }
}
