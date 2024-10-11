/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '../../../shared/services/localStorage.service';
import { CommonModule, DatePipe } from '@angular/common';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    MatIcon,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    DatePipe,
    RouterModule,
    CommonModule,
    MatFormFieldModule
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isEditing: boolean = false;
  user?: UserInterface;
  isLoading = true;

  private readonly _profileService: UserService = inject(UserService);
  private readonly _localStorageService: LocalStorageService =
    inject(LocalStorageService);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId: string =
      this._localStorageService.getAllSessionData()?.user?.id;

    userId &&
      this._profileService.getUserProfile(userId).subscribe({
        next: (response) => {
          this.user = response?.data;
        },
        error: (error) => {
          console.error('Error al cargar el usuario', error);
        }
      });
    /* Tiempo de recarga del profile al llamar al backend */
    setTimeout(() => {
      this.isLoading = false;
    }, 0);
  }

  editProfile(): void {
    this.isEditing = !this.isEditing;
    console.log(this.isEditing ? 'Editing profile' : 'Editing canceled');
    // Aquí puedes habilitar o deshabilitar los campos de edición según isEditing
  }
}
