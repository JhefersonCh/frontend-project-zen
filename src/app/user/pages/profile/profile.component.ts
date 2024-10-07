import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: [''],
      email: [''],
      phone: [''],
      avatarUrl: [''],
      username: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {

    if (this.profileForm.valid) {

      // Muestra errores si uno de los formularios no es válido
    }
    };
    saveProfile(): void {
      // if (this.isEditing) {
      //   const updatedUser: ProfileInterface = this.profileForm.value;
      //   this._userService.updateUserProfile(updatedUser).subscribe({
      //     next: () => {
      //       this.isEditing = false; // Salir del modo de edición
      //     },
      //     error: (err) => {
      //       console.error('Error al actualizar el perfil:', err);
      //     }
      //   });
      // }
    }
    toggleEdit(): void {
      this.isEditing = false;
      this.getUserProfile(); // Recarga el formulario con los datos actuales
    }
  }

